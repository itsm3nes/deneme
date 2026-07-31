"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Gallery } from "@/lib/types";
import {
  createGalleryAction,
  generateAccessCodeAction,
  updateGalleryAction,
  type GalleryFormState,
} from "./actions";

function SubmitButton({
  label,
  savingLabel,
}: {
  label: string;
  savingLabel: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? savingLabel : label}
    </button>
  );
}

export default function GalleryForm({
  locale,
  t,
  gallery,
}: {
  locale: Locale;
  t: Dictionary;
  gallery?: Gallery;
}) {
  const isEdit = !!gallery;
  const [state, formAction] = useActionState<GalleryFormState, FormData>(
    isEdit ? updateGalleryAction : createGalleryAction,
    {},
  );
  const [code, setCode] = useState(gallery?.access_code ?? "");
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={async (formData) => {
        setSaved(false);
        await formAction(formData);
        if (isEdit) setSaved(true);
      }}
      className="space-y-5"
    >
      <input type="hidden" name="locale" value={locale} />
      {gallery && <input type="hidden" name="gallery_id" value={gallery.id} />}

      <div>
        <label className="label" htmlFor="title">
          {t.gallery.titleLabel}
        </label>
        <input
          id="title"
          name="title"
          className="field"
          placeholder={t.gallery.titlePlaceholder}
          defaultValue={gallery?.title}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="client_name">
            {t.gallery.clientNameLabel}
          </label>
          <input
            id="client_name"
            name="client_name"
            className="field"
            placeholder={t.gallery.clientNamePlaceholder}
            defaultValue={gallery?.client_name}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="client_email">
            {t.gallery.clientEmailLabel}{" "}
            <span className="font-normal text-ink-500">
              ({t.common.optional})
            </span>
          </label>
          <input
            id="client_email"
            name="client_email"
            type="email"
            inputMode="email"
            className="field"
            defaultValue={gallery?.client_email ?? ""}
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="description">
          {t.gallery.descriptionLabel}{" "}
          <span className="font-normal text-ink-500">
            ({t.common.optional})
          </span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="field resize-y"
          placeholder={t.gallery.descriptionPlaceholder}
          defaultValue={gallery?.description ?? ""}
        />
      </div>

      <div>
        <label className="label" htmlFor="access_code">
          {t.gallery.accessCodeLabel}
        </label>
        <div className="flex gap-2">
          <input
            id="access_code"
            name="access_code"
            className="field font-mono tracking-[0.2em] uppercase"
            maxLength={12}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
          />
          <button
            type="button"
            className="btn-secondary shrink-0"
            onClick={async () => setCode(await generateAccessCodeAction())}
          >
            {t.gallery.generateCode}
          </button>
        </div>
        <p className="hint">{t.gallery.accessCodeHint}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="min_selections">
            {t.gallery.minSelectionsLabel}{" "}
            <span className="font-normal text-ink-500">
              ({t.common.optional})
            </span>
          </label>
          <input
            id="min_selections"
            name="min_selections"
            type="number"
            min={1}
            inputMode="numeric"
            className="field"
            defaultValue={gallery?.min_selections ?? ""}
          />
        </div>
        <div>
          <label className="label" htmlFor="max_selections">
            {t.gallery.maxSelectionsLabel}{" "}
            <span className="font-normal text-ink-500">
              ({t.common.optional})
            </span>
          </label>
          <input
            id="max_selections"
            name="max_selections"
            type="number"
            min={1}
            inputMode="numeric"
            className="field"
            defaultValue={gallery?.max_selections ?? ""}
          />
        </div>
      </div>
      <p className="-mt-3 text-xs text-ink-400">{t.gallery.limitsHint}</p>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-ink-900 p-4 ring-1 ring-ink-800 ring-inset">
        <input
          type="checkbox"
          name="allow_notes"
          defaultChecked={gallery ? gallery.allow_notes === 1 : true}
          className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
        />
        <span className="text-sm text-ink-200">
          {t.gallery.allowNotesLabel}
        </span>
      </label>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/25 ring-inset"
        >
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton
          label={isEdit ? t.common.save : t.gallery.create}
          savingLabel={t.common.saving}
        />
        {saved && !state.error && (
          <span className="animate-fade-up text-sm text-emerald-400">
            {t.common.saved}
          </span>
        )}
      </div>
    </form>
  );
}
