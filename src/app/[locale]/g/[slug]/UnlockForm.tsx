"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { unlockGalleryAction, type UnlockState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "…" : label}
    </button>
  );
}

export default function UnlockForm({
  slug,
  locale,
  t,
  title,
}: {
  slug: string;
  locale: Locale;
  t: Dictionary;
  title: string;
}) {
  const [state, formAction] = useActionState<UnlockState, FormData>(
    unlockGalleryAction,
    {},
  );

  return (
    <div className="w-full max-w-sm animate-fade-up text-center">
      <h1 className="text-xl font-semibold tracking-tight text-ink-50">
        {title}
      </h1>
      <p className="mt-1 mb-1 text-sm text-gold-400">{t.client.unlockTitle}</p>
      <p className="mb-7 text-sm text-ink-400">{t.client.unlockSubtitle}</p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="slug" value={slug} />

        <input
          name="code"
          className="field text-center font-mono text-xl tracking-[0.4em] uppercase"
          placeholder={t.client.unlockPlaceholder}
          autoComplete="one-time-code"
          autoCapitalize="characters"
          maxLength={12}
          required
          autoFocus
        />

        {state.error && (
          <p role="alert" className="text-sm text-red-400">
            {state.error}
          </p>
        )}

        <SubmitButton label={t.client.unlock} />
      </form>
    </div>
  );
}
