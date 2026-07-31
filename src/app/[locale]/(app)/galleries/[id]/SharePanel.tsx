"use client";

import { useEffect, useState } from "react";
import { interpolate, type Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Gallery } from "@/lib/types";
import { markGallerySentAction } from "../actions";

function CopyButton({
  value,
  label,
  copiedLabel,
  variant = "secondary",
}: {
  value: string;
  label: string;
  copiedLabel: string;
  variant?: "primary" | "secondary";
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <button
      type="button"
      className={variant === "primary" ? "btn-primary" : "btn-secondary"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          const el = document.createElement("textarea");
          el.value = value;
          document.body.appendChild(el);
          el.select();
          document.execCommand("copy");
          el.remove();
        }
        setCopied(true);
      }}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}

export default function SharePanel({
  gallery,
  locale,
  t,
  photoCount,
  origin,
}: {
  gallery: Gallery;
  locale: Locale;
  t: Dictionary;
  photoCount: number;
  origin: string;
}) {
  const link = `${origin}/${locale}/g/${gallery.slug}`;
  const message = gallery.access_code
    ? interpolate(t.share.messageTemplate, {
        client: gallery.client_name,
        link,
        code: gallery.access_code,
      })
    : interpolate(t.share.messageTemplateNoCode, {
        client: gallery.client_name,
        link,
      });

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="text-base font-semibold text-ink-50">{t.share.title}</h2>

      <div className="mt-4 space-y-4">
        <div>
          <span className="label">{t.share.linkLabel}</span>
          <div className="flex flex-col gap-2">
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="field !py-2.5 font-mono text-xs"
            />
            <CopyButton
              value={link}
              label={t.share.copyLink}
              copiedLabel={t.common.copied}
              variant="primary"
            />
          </div>
        </div>

        {gallery.access_code && (
          <div>
            <span className="label">{t.share.codeLabel}</span>
            <div className="flex items-center gap-3">
              <code className="rounded-lg bg-ink-850 px-4 py-2 font-mono text-lg tracking-[0.3em] text-gold-400 ring-1 ring-ink-700 ring-inset">
                {gallery.access_code}
              </code>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-1">
          <CopyButton
            value={message}
            label={t.share.copyMessage}
            copiedLabel={t.common.copied}
          />
          <a
            href={`/${locale}/g/${gallery.slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            {t.share.preview}
          </a>
        </div>

        {gallery.status === "draft" && (
          <div className="border-t border-ink-800 pt-4">
            {photoCount === 0 ? (
              <p className="text-sm text-ink-400">{t.share.needPhotos}</p>
            ) : (
              <form
                action={markGallerySentAction.bind(null, gallery.id, locale)}
              >
                <button type="submit" className="btn-secondary">
                  {t.share.markSent}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
