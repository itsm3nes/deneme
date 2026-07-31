"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { XMP_COLORS, type XmpColor } from "@/lib/lightroom.client";

const SWATCHES: Record<XmpColor, string> = {
  Red: "#e05252",
  Yellow: "#e0c452",
  Green: "#5eb56a",
  Blue: "#4f8fd6",
  Purple: "#9b6fd0",
};

function Panel({
  title,
  body,
  steps,
  children,
}: {
  title: string;
  body: string;
  steps?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5">
      <h3 className="text-sm font-semibold text-ink-50">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
      {steps && (
        <p className="mt-3 rounded-lg bg-ink-950/60 px-3.5 py-3 text-xs leading-relaxed text-ink-300 ring-1 ring-ink-800 ring-inset">
          {steps}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function LightroomExport({
  galleryId,
  locale,
  t,
  hasSelections,
}: {
  galleryId: string;
  locale: Locale;
  t: Dictionary;
  hasSelections: boolean;
}) {
  const [rating, setRating] = useState(5);
  const [label, setLabel] = useState<XmpColor | "">("Green");
  const [keyword, setKeyword] = useState("Client Selects");
  const [noteToCaption, setNoteToCaption] = useState(true);

  const base = `/api/galleries/${galleryId}/export`;
  const xmpHref = `${base}/xmp?${new URLSearchParams({
    rating: String(rating),
    label,
    keyword,
    caption: noteToCaption ? "1" : "0",
  })}`;

  if (!hasSelections) {
    return (
      <p className="card px-5 py-8 text-center text-sm text-ink-500">
        {t.lightroom.nothingToExport}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <Panel
        title={t.lightroom.xmpTitle}
        body={t.lightroom.xmpBody}
        steps={t.lightroom.xmpSteps}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="label">{t.lightroom.ratingLabel}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    aria-label={`${star}`}
                    aria-pressed={star <= rating}
                    className={`text-xl transition-colors ${
                      star <= rating
                        ? "text-gold-500"
                        : "text-ink-700 hover:text-ink-500"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="label">{t.lightroom.colorLabel}</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setLabel("")}
                  className={`rounded-full px-3 py-1 text-xs transition ${
                    label === ""
                      ? "bg-ink-700 text-ink-50"
                      : "bg-ink-850 text-ink-400 hover:text-ink-100"
                  }`}
                >
                  {t.lightroom.colors.none}
                </button>
                {XMP_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setLabel(color)}
                    title={t.lightroom.colors[color]}
                    aria-label={t.lightroom.colors[color]}
                    aria-pressed={label === color}
                    className={`h-7 w-7 rounded-full transition ${
                      label === color
                        ? "ring-2 ring-ink-100 ring-offset-2 ring-offset-ink-900"
                        : "opacity-60 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: SWATCHES[color] }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="lr-keyword">
              {t.lightroom.keywordLabel}
            </label>
            <input
              id="lr-keyword"
              className="field !py-2 !text-sm"
              value={keyword}
              maxLength={64}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <p className="hint">{t.lightroom.keywordHint}</p>
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={noteToCaption}
              onChange={(e) => setNoteToCaption(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-gold-500"
            />
            <span className="text-sm text-ink-200">
              {t.lightroom.noteToCaption}
              <span className="mt-0.5 block text-xs text-ink-500">
                {t.lightroom.noteToCaptionHint}
              </span>
            </span>
          </label>

          <a href={xmpHref} download className="btn-primary w-full">
            {t.lightroom.xmpDownload}
          </a>
        </div>
      </Panel>

      <div className="grid gap-4 sm:grid-cols-2">
        <Panel
          title={t.lightroom.filterTitle}
          body={t.lightroom.filterBody}
          steps={t.lightroom.filterSteps}
        >
          <a
            href={`${base}/filenames`}
            download
            className="btn-secondary w-full"
          >
            {t.lightroom.filterDownload}
          </a>
        </Panel>

        <Panel title={t.lightroom.csvTitle} body={t.lightroom.csvBody}>
          <a
            href={`${base}/csv?locale=${locale}`}
            download
            className="btn-secondary w-full"
          >
            {t.lightroom.csvDownload}
          </a>
        </Panel>
      </div>

      <a href={`${base}/photos`} download className="btn-ghost w-full">
        {t.selections.downloadSelected}
      </a>
    </div>
  );
}
