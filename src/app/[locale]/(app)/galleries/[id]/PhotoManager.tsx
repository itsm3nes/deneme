"use client";

import { useTransition } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Photo } from "@/lib/types";
import { deletePhotoAction } from "../actions";

export default function PhotoManager({
  photos,
  locale,
  t,
  selectedIds,
}: {
  photos: Photo[];
  locale: Locale;
  t: Dictionary;
  selectedIds: Set<string>;
}) {
  const [pending, startTransition] = useTransition();

  if (photos.length === 0) {
    return (
      <p className="rounded-xl bg-ink-900 px-4 py-8 text-center text-sm text-ink-500">
        {t.upload.empty}
      </p>
    );
  }

  return (
    <ul
      className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6"
      data-pending={pending || undefined}
    >
      {photos.map((photo) => (
        <li key={photo.id} className="group relative">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-850">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/media/thumb/${photo.thumb_name}`}
              alt={photo.original_name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            {selectedIds.has(photo.id) && (
              <span
                className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow"
                title={t.common.selected}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            )}
            <button
              type="button"
              aria-label={t.upload.deletePhoto}
              onClick={() => {
                if (!confirm(t.upload.deletePhotoConfirm)) return;
                startTransition(() => {
                  deletePhotoAction(photo.id, locale);
                });
              }}
              className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-ink-950/70 text-ink-200 opacity-0 backdrop-blur transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-red-500/80 hover:text-white"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <p
            className="mt-1 truncate text-[11px] text-ink-500"
            title={photo.original_name}
          >
            {photo.original_name}
          </p>
        </li>
      ))}
    </ul>
  );
}
