"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Photo } from "@/lib/types";

function PhotoActions({
  photo,
  note,
  selected,
  locked,
  allowNotes,
  t,
  onToggle,
  onSaveNote,
  onEditingChange,
}: {
  photo: Photo;
  note: string;
  selected: boolean;
  locked: boolean;
  allowNotes: boolean;
  t: Dictionary;
  onToggle: (photoId: string) => void;
  onSaveNote: (photoId: string, note: string) => void;
  onEditingChange: (editing: boolean) => void;
}) {
  const [draft, setDraft] = useState(note);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  function startEditing() {
    setDraft(note);
    setEditing(true);
    onEditingChange(true);
  }

  function stopEditing() {
    setEditing(false);
    onEditingChange(false);
  }

  function commitNote() {
    onSaveNote(photo.id, draft);
    stopEditing();
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          maxLength={1000}
          autoFocus
          placeholder={t.client.notePlaceholder}
          className="field resize-none"
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={commitNote}
          >
            {t.client.saveNote}
          </button>
          <button type="button" className="btn-secondary" onClick={stopEditing}>
            {t.common.cancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {note && (
        <p className="mb-3 rounded-xl bg-ink-900 px-4 py-3 text-sm whitespace-pre-wrap text-ink-200 ring-1 ring-ink-800 ring-inset">
          {note}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={locked}
          onClick={() => onToggle(photo.id)}
          className={`btn flex-1 !py-3 ${
            selected
              ? "bg-gold-500 text-ink-950 hover:bg-gold-400"
              : "bg-ink-800 text-ink-100 ring-1 ring-ink-700 ring-inset hover:bg-ink-700"
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
            aria-hidden="true"
          >
            {selected ? (
              <path
                d="M5 12.5l4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <circle
                cx="12"
                cy="12"
                r="8.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            )}
          </svg>
          {selected ? t.client.deselectPhoto : t.client.selectPhoto}
        </button>

        {allowNotes && !locked && (
          <button
            type="button"
            className="btn-secondary !py-3"
            onClick={startEditing}
          >
            {note ? t.client.editNote : t.client.addNote}
          </button>
        )}
      </div>
      {saved && (
        <p className="mt-2 text-center text-xs text-emerald-400">
          {t.client.noteSaved}
        </p>
      )}
    </>
  );
}

export default function Lightbox({
  photos,
  index,
  t,
  locked,
  allowNotes,
  isSelected,
  noteFor,
  onClose,
  onNavigate,
  onToggle,
  onSaveNote,
}: {
  photos: Photo[];
  index: number;
  t: Dictionary;
  locked: boolean;
  allowNotes: boolean;
  isSelected: (photoId: string) => boolean;
  noteFor: (photoId: string) => string;
  onClose: () => void;
  onNavigate: (nextIndex: number) => void;
  onToggle: (photoId: string) => void;
  onSaveNote: (photoId: string, note: string) => void;
}) {
  const photo = photos[index];
  const editingRef = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (editingRef.current) return;
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight" && index < photos.length - 1)
        onNavigate(index + 1);
      if (event.key === "ArrowLeft" && index > 0) onNavigate(index - 1);
      if ((event.key === " " || event.key === "Enter") && photo && !locked) {
        event.preventDefault();
        onToggle(photo.id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, photos.length, photo, locked, onClose, onNavigate, onToggle]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ink-950/97 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={photo.original_name}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <span className="truncate text-sm text-ink-400">
          {index + 1} {t.common.of} {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label={t.common.close}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink-300 hover:bg-ink-850 hover:text-ink-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
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

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16"
        onTouchStart={(e) => {
          touchStart.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          };
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          if (!start) return;
          const dx = e.changedTouches[0].clientX - start.x;
          const dy = e.changedTouches[0].clientY - start.y;
          touchStart.current = null;
          if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;
          if (dx < 0 && index < photos.length - 1) onNavigate(index + 1);
          if (dx > 0 && index > 0) onNavigate(index - 1);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={photo.id}
          src={`/media/full/${photo.stored_name}`}
          alt={photo.original_name}
          className="max-h-full max-w-full object-contain"
        />

        {index > 0 && (
          <button
            type="button"
            onClick={() => onNavigate(index - 1)}
            aria-label={t.common.previous}
            className="absolute left-1 hidden h-12 w-12 items-center justify-center rounded-full bg-ink-900/70 text-ink-200 backdrop-blur transition hover:bg-ink-800 hover:text-ink-50 sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
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
          </button>
        )}
        {index < photos.length - 1 && (
          <button
            type="button"
            onClick={() => onNavigate(index + 1)}
            aria-label={t.common.next}
            className="absolute right-1 hidden h-12 w-12 items-center justify-center rounded-full bg-ink-900/70 text-ink-200 backdrop-blur transition hover:bg-ink-800 hover:text-ink-50 sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      <div className="shrink-0 border-t border-ink-850 bg-ink-950/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-3xl">
          <PhotoActions
            key={photo.id}
            photo={photo}
            note={noteFor(photo.id)}
            selected={isSelected(photo.id)}
            locked={locked}
            allowNotes={allowNotes}
            t={t}
            onToggle={onToggle}
            onSaveNote={onSaveNote}
            onEditingChange={(value) => {
              editingRef.current = value;
            }}
          />
        </div>
      </div>
    </div>
  );
}
