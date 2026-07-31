import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePhotographer } from "@/lib/auth";
import { getGalleryForPhotographer, listSelectedPhotos } from "@/lib/queries";
import StatusBadge from "@/components/StatusBadge";
import { getDictionary, resolveLocale, interpolate } from "@/i18n";
import LightroomExport from "./LightroomExport";
import ReopenButton from "./ReopenButton";

export default async function SelectionsPage({
  params,
}: PageProps<"/[locale]/galleries/[id]/selections">) {
  const { locale: rawLocale, id } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);
  const photographer = await requirePhotographer();

  const gallery = getGalleryForPhotographer(id, photographer.id);
  if (!gallery) notFound();

  const picks = listSelectedPhotos(gallery.id);
  const withNotes = picks.filter((p) => p.note);
  const submitted = gallery.submitted_at
    ? new Intl.DateTimeFormat(locale, {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(gallery.submitted_at))
    : null;

  return (
    <div className="animate-fade-up">
      <Link
        href={`/${locale}/galleries/${gallery.id}`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {gallery.title}
      </Link>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <StatusBadge status={gallery.status} t={t} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
            {t.selections.title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">
            {gallery.status === "completed"
              ? interpolate(t.selections.subtitle, {
                  client: gallery.client_name,
                  count: picks.length,
                })
              : picks.length > 0
                ? interpolate(t.selections.partial, { count: picks.length })
                : t.selections.pending}
          </p>
          {submitted && (
            <p className="mt-1 text-xs text-ink-500">
              {t.selections.submittedAt}: {submitted}
            </p>
          )}
        </div>

        {gallery.status === "completed" && (
          <ReopenButton
            galleryId={gallery.id}
            locale={locale}
            label={t.selections.reopen}
            confirmText={t.selections.reopenConfirm}
          />
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_26rem] lg:items-start">
        <section>
          <div className="mb-4 flex items-center gap-4 text-sm text-ink-400">
            <span>
              <strong className="font-semibold text-ink-100">
                {picks.length}
              </strong>{" "}
              {t.common.selected}
            </span>
            {withNotes.length > 0 && (
              <span>
                <strong className="font-semibold text-gold-400">
                  {withNotes.length}
                </strong>{" "}
                {t.selections.withNotes}
              </span>
            )}
          </div>

          {picks.length === 0 ? (
            <p className="card px-5 py-12 text-center text-sm text-ink-500">
              {t.selections.pending}
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {picks.map((photo) => (
                <li key={photo.id} className="card overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/media/thumb/${photo.thumb_name}`}
                    alt={photo.original_name}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  <div className="p-3">
                    <p
                      className="truncate font-mono text-[11px] text-ink-400"
                      title={photo.original_name}
                    >
                      {photo.original_name}
                    </p>
                    {photo.note ? (
                      <p className="mt-2 text-xs leading-relaxed whitespace-pre-wrap text-ink-200">
                        {photo.note}
                      </p>
                    ) : (
                      <p className="mt-2 text-xs text-ink-600">
                        {t.selections.noNote}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside className="lg:sticky lg:top-20">
          <h2 className="text-base font-semibold text-ink-50">
            {t.lightroom.title}
          </h2>
          <p className="mt-1 mb-4 text-sm text-ink-400">
            {t.lightroom.subtitle}
          </p>
          <LightroomExport
            galleryId={gallery.id}
            locale={locale}
            t={t}
            hasSelections={picks.length > 0}
          />
        </aside>
      </div>
    </div>
  );
}
