"use client";

import { useTransition } from "react";
import type { Locale } from "@/i18n/config";
import { deleteGalleryAction } from "../actions";

export default function DeleteGalleryButton({
  galleryId,
  locale,
  label,
  confirmText,
}: {
  galleryId: string;
  locale: Locale;
  label: string;
  confirmText: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(() => {
          deleteGalleryAction(galleryId, locale);
        });
      }}
      className="btn-danger w-full"
    >
      {label}
    </button>
  );
}
