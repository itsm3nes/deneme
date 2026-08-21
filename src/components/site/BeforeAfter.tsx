"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Öncesi / sonrası karşılaştırma sürgüsü.
 *
 * `before` ve `after` içine şimdilik yer tutucu paneller veriliyor; klinik
 * fotoğrafları hazır olduğunda doğrudan `<Image fill … />` bileşenleriyle
 * değiştirilebilir — bileşenin geri kalanı aynı çalışır.
 */
export function BeforeAfter({
  before,
  after,
  caption,
}: {
  before: ReactNode;
  after: ReactNode;
  caption?: string;
}) {
  const [value, setValue] = useState(50);
  const id = useId();

  return (
    <figure className="card overflow-hidden">
      <div className="relative aspect-4/3 select-none">
        <div className="absolute inset-0">{after}</div>
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        >
          {before}
        </div>

        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-brand-900/80 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-white uppercase">
          Öncesi
        </span>
        <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-aqua-500 px-2.5 py-1 text-[0.65rem] font-bold tracking-wide text-white uppercase">
          Sonrası
        </span>

        {/* Ayırıcı çizgi */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-lift"
          style={{ left: `${value}%` }}
        >
          <span className="absolute top-1/2 left-1/2 flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-700 shadow-lift">
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 6-5 6 5 6M15 6l5 6-5 6" />
            </svg>
          </span>
        </div>

        <label htmlFor={id} className="sr-only">
          Öncesi / sonrası karşılaştırma sürgüsü
        </label>
        <input
          id={id}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
          aria-label="Öncesi ve sonrası görselini karşılaştır"
        />
      </div>
      {caption ? (
        <figcaption className="border-t border-ink-100 px-5 py-3 text-sm text-ink-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
