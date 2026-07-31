"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState, useTransition } from "react";
import { interpolate, type Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Gallery, Photo, Selection } from "@/lib/types";
import Lightbox from "./Lightbox";
import {
  saveNoteAction,
  submitSelectionAction,
  toggleSelectionAction,
} from "./actions";

type Picks = Map<string, string>;

function CheckMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 12.5l4.5 4.5L19 7.5"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ClientGallery({
  gallery,
  photos,
  initialSelections,
  locale,
  t,
}: {
  gallery: Gallery;
  photos: Photo[];
  initialSelections: Selection[];
  locale: Locale;
  t: Dictionary;
}) {
  const router = useRouter();
  const [picks, setPicks] = useState<Picks>(
    () => new Map(initialSelections.map((s) => [s.photo_id, s.note ?? ""])),
  );
  const [view, setView] = useState<"all" | "picked">("all");
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [submitting, startSubmit] = useTransition();

  const locked = gallery.status === "completed";
  const allowNotes = gallery.allow_notes === 1;
  const count = picks.size;

  const visible = useMemo(
    () => (view === "picked" ? photos.filter((p) => picks.has(p.id)) : photos),
    [view, photos, picks],
  );

  const lightboxIndex = lightboxId
    ? visible.findIndex((p) => p.id === lightboxId)
    : -1;

  const flash = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2400);
  }, []);

  const toggle = useCallback(
    async (photoId: string) => {
      if (locked) return;
      const had = picks.has(photoId);

      if (
        !had &&
        gallery.max_selections &&
        picks.size >= gallery.max_selections
      ) {
        flash(
          interpolate(t.client.maxReached, { max: gallery.max_selections }),
        );
        return;
      }

      setPicks((prev) => {
        const next = new Map(prev);
        if (had) next.delete(photoId);
        else next.set(photoId, "");
        return next;
      });

      const result = await toggleSelectionAction(gallery.slug, photoId);
      if (!result.ok) {
        setPicks((prev) => {
          const next = new Map(prev);
          if (had) next.set(photoId, prev.get(photoId) ?? "");
          else next.delete(photoId);
          return next;
        });
        if (result.error === "max" && gallery.max_selections) {
          flash(
            interpolate(t.client.maxReached, { max: gallery.max_selections }),
          );
        } else if (result.error === "locked") {
          flash(t.errors.galleryLocked);
          router.refresh();
        } else {
          flash(t.errors.generic);
        }
      }
    },
    [locked, picks, gallery.max_selections, gallery.slug, flash, t, router],
  );

  const saveNote = useCallback(
    async (photoId: string, note: string) => {
      if (locked) return;
      const previous = picks.get(photoId);

      setPicks((prev) => new Map(prev).set(photoId, note.trim()));

      const result = await saveNoteAction(gallery.slug, photoId, note);
      if (!result.ok) {
        setPicks((prev) => {
          const next = new Map(prev);
          if (previous === undefined) next.delete(photoId);
          else next.set(photoId, previous);
          return next;
        });
        flash(
          result.error === "max" ? t.errors.maxSelections : t.errors.generic,
        );
      }
    },
    [locked, picks, gallery.slug, flash, t],
  );

  function submit() {
    startSubmit(async () => {
      const result = await submitSelectionAction(gallery.slug, locale);
      setConfirming(false);
      if (result.ok) router.refresh();
      else flash(t.errors.generic);
    });
  }

  const belowMinimum =
    !!gallery.min_selections && count < gallery.min_selections;

  return (
    <>
      <div className="mx-auto max-w-6xl px-3 pb-40 sm:px-6 sm:pb-32">
        <div className="sticky top-0 z-20 -mx-3 mb-4 flex gap-1 border-b border-ink-850 bg-ink-950/90 px-3 py-2.5 backdrop-blur sm:-mx-6 sm:px-6">
          {(["all", "picked"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                view === key
                  ? "bg-ink-800 text-ink-50"
                  : "text-ink-400 hover:text-ink-100"
              }`}
            >
              {key === "all" ? t.client.viewAll : t.client.viewSelected}
              {key === "picked" && count > 0 && (
                <span className="ml-1.5 text-gold-400">{count}</span>
              )}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="py-20 text-center text-sm text-ink-500">
            {t.client.noSelectionYet}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((photo) => {
              const picked = picks.has(photo.id);
              const note = picks.get(photo.id);
              return (
                <li key={photo.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setLightboxId(photo.id)}
                    className="block w-full overflow-hidden rounded-lg bg-ink-850 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
                    aria-label={photo.original_name}
                  >
                    <span className="relative block aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/media/thumb/${photo.thumb_name}`}
                        alt=""
                        loading="lazy"
                        className={`h-full w-full object-cover transition ${
                          picked ? "" : "sm:hover:brightness-110"
                        }`}
                      />
                      {picked && (
                        <span
                          className="pointer-events-none absolute inset-0 rounded-lg ring-3 ring-gold-500 ring-inset"
                          aria-hidden="true"
                        />
                      )}
                      {note && (
                        <span className="pointer-events-none absolute bottom-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink-950/75 text-gold-400 backdrop-blur">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path
                              d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-4.6 3.6A.5.5 0 0 1 4.6 20V5.5Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => toggle(photo.id)}
                    aria-pressed={picked}
                    aria-label={
                      picked ? t.client.deselectPhoto : t.client.selectPhoto
                    }
                    className={`absolute top-1.5 right-1.5 flex h-9 w-9 items-center justify-center rounded-full transition ${
                      picked
                        ? "bg-gold-500 text-ink-950"
                        : "bg-ink-950/55 text-ink-100 ring-1 ring-white/25 ring-inset backdrop-blur hover:bg-ink-950/80"
                    } ${locked ? "pointer-events-none" : ""}`}
                  >
                    {picked ? (
                      <span className="animate-pop-in">
                        <CheckMark className="h-5 w-5" />
                      </span>
                    ) : (
                      <CheckMark className="h-5 w-5 opacity-60" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!locked && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-850 bg-ink-950/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-50">
                {interpolate(t.client.selectedCount, { count })}
              </p>
              <p className="truncate text-xs text-ink-400">
                {belowMinimum
                  ? interpolate(t.client.minRequired, {
                      min: gallery.min_selections!,
                    })
                  : gallery.max_selections
                    ? interpolate(t.client.remaining, {
                        count: gallery.max_selections - count,
                      })
                    : t.client.intro}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary shrink-0 !px-6 !py-3"
              disabled={count === 0 || belowMinimum || submitting}
              onClick={() => setConfirming(true)}
            >
              {t.client.submit}
            </button>
          </div>
        </div>
      )}

      {lightboxIndex >= 0 && (
        <Lightbox
          photos={visible}
          index={lightboxIndex}
          t={t}
          locked={locked}
          allowNotes={allowNotes}
          isSelected={(id) => picks.has(id)}
          noteFor={(id) => picks.get(id) ?? ""}
          onClose={() => setLightboxId(null)}
          onNavigate={(next) => setLightboxId(visible[next]?.id ?? null)}
          onToggle={toggle}
          onSaveNote={saveNote}
        />
      )}

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/80 p-4 backdrop-blur-sm sm:items-center">
          <div className="card w-full max-w-md animate-fade-up p-6">
            <h2 className="text-lg font-semibold text-ink-50">
              {t.client.submitConfirmTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-300">
              {interpolate(t.client.submitConfirmBody, { count })}
            </p>
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setConfirming(false)}
                disabled={submitting}
              >
                {t.common.cancel}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={submit}
                disabled={submitting}
              >
                {submitting ? "…" : t.client.submitConfirmAction}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 animate-fade-up rounded-full bg-ink-800 px-5 py-2.5 text-sm text-ink-50 shadow-lg ring-1 ring-ink-700 ring-inset"
        >
          {toast}
        </div>
      )}
    </>
  );
}
