"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getGalleryBySlug } from "@/lib/queries";
import {
  codesMatch,
  grantGalleryAccess,
  hasGalleryAccess,
} from "@/lib/gallery-access";
import { getDictionary } from "@/i18n";

export type UnlockState = { error?: string };

export async function unlockGalleryAction(
  _prev: UnlockState,
  formData: FormData,
): Promise<UnlockState> {
  const locale = String(formData.get("locale") ?? "tr");
  const slug = String(formData.get("slug") ?? "");
  const code = String(formData.get("code") ?? "");
  const t = getDictionary(locale);

  const gallery = getGalleryBySlug(slug);
  if (!gallery?.access_code) return { error: t.client.wrongCode };
  if (!codesMatch(code, gallery.access_code))
    return { error: t.client.wrongCode };

  await grantGalleryAccess(slug, gallery.access_code);
  revalidatePath(`/${locale}/g/${slug}`);
  return {};
}

type MutationResult =
  | { ok: true }
  | { ok: false; error: "locked" | "max" | "denied" };

async function openGalleryFor(slug: string) {
  const gallery = getGalleryBySlug(slug);
  if (!gallery) return null;
  if (!(await hasGalleryAccess(slug, gallery.access_code))) return null;
  return gallery;
}

export async function toggleSelectionAction(
  slug: string,
  photoId: string,
): Promise<MutationResult> {
  const gallery = await openGalleryFor(slug);
  if (!gallery) return { ok: false, error: "denied" };
  if (gallery.status === "completed") return { ok: false, error: "locked" };

  const belongs = db
    .prepare("SELECT 1 FROM photos WHERE id = ? AND gallery_id = ?")
    .get(photoId, gallery.id);
  if (!belongs) return { ok: false, error: "denied" };

  const existing = db
    .prepare("SELECT 1 FROM selections WHERE gallery_id = ? AND photo_id = ?")
    .get(gallery.id, photoId);

  if (existing) {
    db.prepare(
      "DELETE FROM selections WHERE gallery_id = ? AND photo_id = ?",
    ).run(gallery.id, photoId);
    return { ok: true };
  }

  if (gallery.max_selections) {
    const { n } = db
      .prepare("SELECT COUNT(*) AS n FROM selections WHERE gallery_id = ?")
      .get(gallery.id) as { n: number };
    if (n >= gallery.max_selections) return { ok: false, error: "max" };
  }

  const now = new Date().toISOString();
  db.prepare(
    "INSERT INTO selections (gallery_id, photo_id, note, created_at, updated_at) VALUES (?, ?, NULL, ?, ?)",
  ).run(gallery.id, photoId, now, now);

  return { ok: true };
}

export async function saveNoteAction(
  slug: string,
  photoId: string,
  note: string,
): Promise<MutationResult> {
  const gallery = await openGalleryFor(slug);
  if (!gallery) return { ok: false, error: "denied" };
  if (gallery.status === "completed") return { ok: false, error: "locked" };
  if (!gallery.allow_notes) return { ok: false, error: "denied" };

  const trimmed = note.trim().slice(0, 1000);
  const now = new Date().toISOString();

  const updated = db
    .prepare(
      "UPDATE selections SET note = ?, updated_at = ? WHERE gallery_id = ? AND photo_id = ?",
    )
    .run(trimmed || null, now, gallery.id, photoId);

  if (updated.changes === 0) {
    const belongs = db
      .prepare("SELECT 1 FROM photos WHERE id = ? AND gallery_id = ?")
      .get(photoId, gallery.id);
    if (!belongs) return { ok: false, error: "denied" };

    if (gallery.max_selections) {
      const { n } = db
        .prepare("SELECT COUNT(*) AS n FROM selections WHERE gallery_id = ?")
        .get(gallery.id) as { n: number };
      if (n >= gallery.max_selections) return { ok: false, error: "max" };
    }

    db.prepare(
      "INSERT INTO selections (gallery_id, photo_id, note, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    ).run(gallery.id, photoId, trimmed || null, now, now);
  }

  return { ok: true };
}

export async function submitSelectionAction(
  slug: string,
  locale: string,
): Promise<MutationResult> {
  const gallery = await openGalleryFor(slug);
  if (!gallery) return { ok: false, error: "denied" };
  if (gallery.status === "completed") return { ok: false, error: "locked" };

  const { n } = db
    .prepare("SELECT COUNT(*) AS n FROM selections WHERE gallery_id = ?")
    .get(gallery.id) as { n: number };

  if (gallery.min_selections && n < gallery.min_selections) {
    return { ok: false, error: "denied" };
  }

  db.prepare(
    "UPDATE galleries SET status = 'completed', submitted_at = ? WHERE id = ?",
  ).run(new Date().toISOString(), gallery.id);

  revalidatePath(`/${locale}/g/${slug}`);
  revalidatePath(`/${locale}/galleries/${gallery.id}`);
  revalidatePath(`/${locale}/galleries/${gallery.id}/selections`);
  revalidatePath(`/${locale}/dashboard`);

  return { ok: true };
}
