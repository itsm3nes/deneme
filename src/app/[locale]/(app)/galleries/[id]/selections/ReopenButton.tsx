"use client";

import { useTransition } from "react";
import type { Locale } from "@/i18n/config";
import { reopenSelectionAction } from "../../actions";

export default function ReopenButton({
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
      className="btn-secondary"
      onClick={() => {
        if (!confirm(confirmText)) return;
        startTransition(() => {
          reopenSelectionAction(galleryId, locale);
        });
      }}
    >
      {label}
    </button>
  );
}
