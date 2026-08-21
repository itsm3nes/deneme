"use client";

import { useId, useState, useTransition } from "react";
import {
  blocksToText,
  textToBlocks,
  type FieldDef,
  type ListSectionId,
  type SectionDef,
} from "@/lib/admin/sections";
import type { PostBlock } from "@/lib/content";
import { saveListSection } from "../actions";
import { initialAdminState, type AdminState } from "@/lib/admin/state";
import { Icon } from "@/components/site/Icons";

type Item = Record<string, unknown>;

/* ---------- Depolanan biçim ⇄ formda düzenlenen biçim ---------- */

function toEditable(section: SectionDef, items: Item[]): Item[] {
  return items.map((item) => {
    const copy: Item = { ...item };
    for (const field of section.fields) {
      if (field.type === "body") {
        copy[field.key] = blocksToText((item[field.key] as PostBlock[]) ?? []);
      }
    }
    return copy;
  });
}

function toStored(section: SectionDef, items: Item[]): Item[] {
  return items.map((item) => {
    const copy: Item = { ...item };
    for (const field of section.fields) {
      const value = copy[field.key];
      if (field.type === "body") {
        copy[field.key] = textToBlocks(String(value ?? ""));
      } else if (field.type === "number") {
        copy[field.key] = Number(value) || 0;
      } else if (field.type === "checkbox" && !value) {
        // Kapalı bayrakları JSON'da taşımaya gerek yok.
        delete copy[field.key];
      }
    }
    return copy;
  });
}

function emptyItem(fields: FieldDef[]): Item {
  const item: Item = {};
  for (const field of fields) {
    if (field.type === "tags" || field.type === "items") item[field.key] = [];
    else if (field.type === "checkbox") item[field.key] = false;
    else if (field.type === "number") item[field.key] = 0;
    else item[field.key] = "";
  }
  return item;
}

/* ---------- Tek bir alan ---------- */

function Field({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (next: unknown) => void;
}) {
  const id = useId();

  if (field.type === "checkbox") {
    return (
      <label className="flex items-start gap-3 text-sm text-ink-600">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 size-4.5 shrink-0 rounded accent-aqua-500"
        />
        <span>
          <span className="font-semibold text-brand-800">{field.label}</span>
          {field.hint ? (
            <span className="mt-0.5 block text-xs text-ink-400">{field.hint}</span>
          ) : null}
        </span>
      </label>
    );
  }

  if (field.type === "items") {
    const rows = (value as Item[]) ?? [];
    const update = (index: number, key: string, next: string) => {
      const copy = rows.map((row, i) => (i === index ? { ...row, [key]: next } : row));
      onChange(copy);
    };
    return (
      <div>
        <span className="label">{field.label}</span>
        <div className="grid gap-3">
          {rows.map((row, index) => (
            <div key={index} className="rounded-xl bg-ink-50 p-3 ring-1 ring-ink-200 ring-inset">
              <div className="grid gap-2">
                {(field.fields ?? []).map((sub) =>
                  sub.type === "textarea" ? (
                    <textarea
                      key={sub.key}
                      className="field bg-white text-sm"
                      rows={sub.rows ?? 2}
                      placeholder={sub.label}
                      value={String(row[sub.key] ?? "")}
                      onChange={(e) => update(index, sub.key, e.target.value)}
                    />
                  ) : (
                    <input
                      key={sub.key}
                      className="field bg-white text-sm"
                      placeholder={sub.label}
                      value={String(row[sub.key] ?? "")}
                      onChange={(e) => update(index, sub.key, e.target.value)}
                    />
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, i) => i !== index))}
                className="mt-2 text-xs font-semibold text-red-600 hover:underline"
              >
                Bu satırı sil
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange([...rows, emptyItem(field.fields ?? [])])}
          className="btn btn-outline btn-sm mt-3"
        >
          + Satır ekle
        </button>
      </div>
    );
  }

  return (
    <div>
      <label className="label" htmlFor={id}>
        {field.label}
        {field.required ? <span className="text-red-500"> *</span> : null}
      </label>

      {field.type === "textarea" || field.type === "body" || field.type === "tags" ? (
        <textarea
          id={id}
          className="field resize-y"
          rows={field.type === "body" ? 14 : field.type === "tags" ? 4 : (field.rows ?? 3)}
          value={
            field.type === "tags"
              ? ((value as string[]) ?? []).join("\n")
              : String(value ?? "")
          }
          onChange={(e) =>
            onChange(
              field.type === "tags"
                ? e.target.value.split("\n").map((line) => line.trim()).filter(Boolean)
                : e.target.value,
            )
          }
        />
      ) : field.type === "select" ? (
        <select
          id={id}
          className="field"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Seçiniz</option>
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
          className="field"
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {field.hint ? <p className="hint">{field.hint}</p> : null}
    </div>
  );
}

/* ---------- Bölüm düzenleyici ---------- */

export function ItemsEditor({
  section,
  initialItems,
}: {
  section: SectionDef;
  initialItems: Item[];
}) {
  const [items, setItems] = useState<Item[]>(() => toEditable(section, initialItems));
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [result, setResult] = useState<AdminState>(initialAdminState);
  const [isPending, startTransition] = useTransition();
  const [dirty, setDirty] = useState(false);

  const change = (index: number, key: string, value: unknown) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
    setDirty(true);
    setResult(initialAdminState);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const copy = [...prev];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
    setOpenIndex(target);
    setDirty(true);
  };

  const remove = (index: number) => {
    const label = String(items[index]?.[section.titleKey] ?? "bu kayıt");
    if (!confirm(`“${label}” silinsin mi? Bu işlem geri alınamaz.`)) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    setOpenIndex(null);
    setDirty(true);
  };

  const add = () => {
    setItems((prev) => [...prev, emptyItem(section.fields)]);
    setOpenIndex(items.length);
    setDirty(true);
  };

  const save = () => {
    startTransition(async () => {
      const response = await saveListSection(
        section.id as ListSectionId,
        JSON.stringify(toStored(section, items)),
      );
      setResult(response);
      if (response.status === "success") setDirty(false);
    });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">{section.title}</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-500">
            {section.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {section.addable ? (
            <button type="button" onClick={add} className="btn btn-outline btn-sm">
              + Yeni ekle
            </button>
          ) : null}
          <button
            type="button"
            onClick={save}
            disabled={isPending || !dirty}
            className="btn btn-primary btn-sm"
          >
            {isPending ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kaydedildi"}
          </button>
        </div>
      </div>

      {result.status !== "idle" ? (
        <p
          role="alert"
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ring-1 ring-inset ${
            result.status === "success"
              ? "bg-green-50 text-green-800 ring-green-200"
              : "bg-red-50 text-red-700 ring-red-100"
          }`}
        >
          {result.message}
        </p>
      ) : null}

      <div className="mt-6 grid gap-3">
        {items.map((item, index) => {
          const open = openIndex === index;
          return (
            <article key={index} className="card overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  aria-expanded={open}
                >
                  <Icon
                    name="chevronDown"
                    className={`size-4 shrink-0 text-aqua-500 transition-transform ${open ? "rotate-180" : ""}`}
                  />
                  <span className="truncate text-sm font-bold text-brand-800">
                    {String(item[section.titleKey] || "(başlıksız)")}
                  </span>
                </button>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-100 disabled:opacity-30"
                    aria-label="Yukarı taşı"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-100 disabled:opacity-30"
                    aria-label="Aşağı taşı"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sil
                  </button>
                </div>
              </div>

              {open ? (
                <div className="grid gap-4 border-t border-ink-100 bg-ink-50/50 p-4 sm:p-5">
                  {section.fields.map((field) => (
                    <Field
                      key={field.key}
                      field={field}
                      value={item[field.key]}
                      onChange={(next) => change(index, field.key, next)}
                    />
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}

        {items.length === 0 ? (
          <p className="card p-6 text-center text-sm text-ink-500">
            Henüz kayıt yok. “Yeni ekle” ile başlayın.
          </p>
        ) : null}
      </div>

      {items.length > 3 ? (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={save}
            disabled={isPending || !dirty}
            className="btn btn-primary btn-sm"
          >
            {isPending ? "Kaydediliyor…" : dirty ? "Kaydet" : "Kaydedildi"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
