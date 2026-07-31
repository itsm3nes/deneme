"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n";

type Progress = { done: number; total: number };

export default function PhotoUploader({
  galleryId,
  t,
}: {
  galleryId: string;
  t: Dictionary;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function upload(fileList: FileList | File[]) {
    const files = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length === 0) return;

    setErrors([]);
    setProgress({ done: 0, total: files.length });

    const batchSize = 4;
    const problems: string[] = [];

    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const body = new FormData();
      for (const file of batch) body.append("files", file);

      try {
        const res = await fetch(`/api/galleries/${galleryId}/photos`, {
          method: "POST",
          body,
        });
        const data = await res.json();
        for (const f of data.failed ?? []) {
          const reason =
            f.reason === "tooLarge"
              ? t.upload.tooLarge
              : f.reason === "wrongType"
                ? t.upload.wrongType
                : t.upload.failed;
          problems.push(`${f.name} — ${reason}`);
        }
      } catch {
        for (const file of batch)
          problems.push(`${file.name} — ${t.upload.failed}`);
      }

      setProgress({
        done: Math.min(i + batch.length, files.length),
        total: files.length,
      });
    }

    setErrors(problems);
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  const busy = progress !== null;

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (!busy) upload(e.dataTransfer.files);
        }}
        onClick={() => !busy && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !busy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-busy={busy}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl2 border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? "border-gold-500 bg-gold-500/5"
            : "border-ink-700 hover:border-ink-600 hover:bg-ink-900/60"
        } ${busy ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && upload(e.target.files)}
        />

        {busy ? (
          <>
            <div className="mb-3 h-1.5 w-48 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gold-500 transition-[width] duration-300"
                style={{ width: `${(progress.done / progress.total) * 100}%` }}
              />
            </div>
            <p className="text-sm text-ink-200">
              {t.upload.uploading} {progress.done}/{progress.total}
            </p>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="mb-3 h-8 w-8 text-ink-500"
              aria-hidden="true"
            >
              <path
                d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3.5 14.5V18A2.5 2.5 0 0 0 6 20.5h12a2.5 2.5 0 0 0 2.5-2.5v-3.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm font-medium text-ink-100">
              {t.upload.dropzone}
            </p>
            <p className="mt-1 text-xs text-ink-400">{t.upload.dropzoneHint}</p>
          </>
        )}
      </div>

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-300 ring-1 ring-red-500/25 ring-inset">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <p className="hint mt-3">{t.upload.hint}</p>
    </div>
  );
}
