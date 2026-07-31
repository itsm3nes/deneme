"use server";

import fs from "node:fs";
import path from "node:path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, THUMB_DIR, UPLOAD_DIR } from "@/lib/db";
import { requirePhotographer } from "@/lib/auth";
import { newAccessCode, newId, newSlug, slugify } from "@/lib/ids";
import { countPhotos, getGalleryForPhotographer } from "@/lib/queries";
import { getDictionary } from "@/i18n";
import type { Photo } from "@/lib/types";

export type GalleryFormState = { error?: string };

function parseLimit(value: FormDataEntryValue | null): number | null {
  const n = Number(String(value ?? "").trim());
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : null;
}

export async function createGalleryAction(
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const locale = String(formData.get("locale") ?? "tr");
  const t = getDictionary(locale);
  const photographer = await requirePhotographer();

  const title = String(formData.get("title") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  if (!title || !clientName) return { error: t.common.required };

  const description = String(formData.get("description") ?? "").trim();
  const clientEmail = String(formData.get("client_email") ?? "").trim();
  const accessCode = String(formData.get("access_code") ?? "")
    .trim()
    .toUpperCase();
  const min = parseLimit(formData.get("min_selections"));
  const max = parseLimit(formData.get("max_selections"));
  const allowNotes = formData.get("allow_notes") === "on" ? 1 : 0;

  const base = slugify(title) || "galeri";
  let slug = `${base}-${newSlug().slice(0, 6)}`;
  while (db.prepare("SELECT 1 FROM galleries WHERE slug = ?").get(slug)) {
    slug = `${base}-${newSlug().slice(0, 6)}`;
  }

  const id = newId();
  db.prepare(
    `INSERT INTO galleries
       (id, photographer_id, slug, title, description, client_name, client_email,
        access_code, min_selections, max_selections, allow_notes, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?)`,
  ).run(
    id,
    photographer.id,
    slug,
    title,
    description || null,
    clientName,
    clientEmail || null,
    accessCode || null,
    min,
    max && min && max < min ? min : max,
    allowNotes,
    new Date().toISOString(),
  );

  revalidatePath(`/${locale}/dashboard`);
  redirect(`/${locale}/galleries/${id}`);
}

export async function updateGalleryAction(
  _prev: GalleryFormState,
  formData: FormData,
): Promise<GalleryFormState> {
  const locale = String(formData.get("locale") ?? "tr");
  const t = getDictionary(locale);
  const photographer = await requirePhotographer();
  const galleryId = String(formData.get("gallery_id") ?? "");

  const gallery = getGalleryForPhotographer(galleryId, photographer.id);
  if (!gallery) return { error: t.gallery.notFound };

  const title = String(formData.get("title") ?? "").trim();
  const clientName = String(formData.get("client_name") ?? "").trim();
  if (!title || !clientName) return { error: t.common.required };

  const min = parseLimit(formData.get("min_selections"));
  const max = parseLimit(formData.get("max_selections"));

  db.prepare(
    `UPDATE galleries
     SET title = ?, description = ?, client_name = ?, client_email = ?,
         access_code = ?, min_selections = ?, max_selections = ?, allow_notes = ?
     WHERE id = ? AND photographer_id = ?`,
  ).run(
    title,
    String(formData.get("description") ?? "").trim() || null,
    clientName,
    String(formData.get("client_email") ?? "").trim() || null,
    String(formData.get("access_code") ?? "")
      .trim()
      .toUpperCase() || null,
    min,
    max && min && max < min ? min : max,
    formData.get("allow_notes") === "on" ? 1 : 0,
    galleryId,
    photographer.id,
  );

  revalidatePath(`/${locale}/galleries/${galleryId}`);
  return {};
}

export async function generateAccessCodeAction(): Promise<string> {
  await requirePhotographer();
  return newAccessCode();
}

export async function markGallerySentAction(galleryId: string, locale: string) {
  const photographer = await requirePhotographer();
  const gallery = getGalleryForPhotographer(galleryId, photographer.id);
  if (!gallery || countPhotos(galleryId) === 0) return;

  db.prepare(
    "UPDATE galleries SET status = 'sent' WHERE id = ? AND status = 'draft'",
  ).run(galleryId);
  revalidatePath(`/${locale}/galleries/${galleryId}`);
  revalidatePath(`/${locale}/dashboard`);
}

export async function reopenSelectionAction(galleryId: string, locale: string) {
  const photographer = await requirePhotographer();
  const gallery = getGalleryForPhotographer(galleryId, photographer.id);
  if (!gallery) return;

  db.prepare(
    `UPDATE galleries SET status = 'sent', submitted_at = NULL, reopened_at = ?
     WHERE id = ? AND photographer_id = ?`,
  ).run(new Date().toISOString(), galleryId, photographer.id);

  revalidatePath(`/${locale}/galleries/${galleryId}`);
  revalidatePath(`/${locale}/galleries/${galleryId}/selections`);
  revalidatePath(`/${locale}/dashboard`);
}

function removeFiles(photos: Pick<Photo, "stored_name" | "thumb_name">[]) {
  for (const photo of photos) {
    fs.rmSync(path.join(UPLOAD_DIR, path.basename(photo.stored_name)), {
      force: true,
    });
    fs.rmSync(path.join(THUMB_DIR, path.basename(photo.thumb_name)), {
      force: true,
    });
  }
}

export async function deletePhotoAction(photoId: string, locale: string) {
  const photographer = await requirePhotographer();

  const photo = db
    .prepare(
      `SELECT p.* FROM photos p
       JOIN galleries g ON g.id = p.gallery_id
       WHERE p.id = ? AND g.photographer_id = ?`,
    )
    .get(photoId, photographer.id) as Photo | undefined;
  if (!photo) return;

  db.prepare("DELETE FROM photos WHERE id = ?").run(photoId);
  removeFiles([photo]);

  revalidatePath(`/${locale}/galleries/${photo.gallery_id}`);
}

export async function deleteGalleryAction(galleryId: string, locale: string) {
  const photographer = await requirePhotographer();
  const gallery = getGalleryForPhotographer(galleryId, photographer.id);
  if (!gallery) return;

  const photos = db
    .prepare("SELECT stored_name, thumb_name FROM photos WHERE gallery_id = ?")
    .all(galleryId) as Pick<Photo, "stored_name" | "thumb_name">[];

  db.prepare("DELETE FROM galleries WHERE id = ? AND photographer_id = ?").run(
    galleryId,
    photographer.id,
  );
  removeFiles(photos);

  revalidatePath(`/${locale}/dashboard`);
  redirect(`/${locale}/dashboard`);
}
