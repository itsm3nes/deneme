import "server-only";
import { db } from "./db";
import type { Gallery, GallerySummary, Photo, Selection } from "./types";

export function listGalleries(photographerId: string): GallerySummary[] {
  return db
    .prepare(
      `SELECT g.*,
              (SELECT COUNT(*) FROM photos p WHERE p.gallery_id = g.id) AS photo_count,
              (SELECT COUNT(*) FROM selections s WHERE s.gallery_id = g.id) AS selected_count
       FROM galleries g
       WHERE g.photographer_id = ?
       ORDER BY g.created_at DESC`,
    )
    .all(photographerId) as GallerySummary[];
}

export function getGalleryForPhotographer(
  galleryId: string,
  photographerId: string,
): Gallery | null {
  return (
    (db
      .prepare("SELECT * FROM galleries WHERE id = ? AND photographer_id = ?")
      .get(galleryId, photographerId) as Gallery | undefined) ?? null
  );
}

export function getGalleryBySlug(slug: string): Gallery | null {
  return (
    (db.prepare("SELECT * FROM galleries WHERE slug = ?").get(slug) as
      | Gallery
      | undefined) ?? null
  );
}

export function listPhotos(galleryId: string): Photo[] {
  return db
    .prepare(
      "SELECT * FROM photos WHERE gallery_id = ? ORDER BY position, created_at",
    )
    .all(galleryId) as Photo[];
}

export function listSelections(galleryId: string): Selection[] {
  return db
    .prepare("SELECT * FROM selections WHERE gallery_id = ?")
    .all(galleryId) as Selection[];
}

export type SelectedPhoto = Photo & {
  note: string | null;
  selected_at: string;
};

export function listSelectedPhotos(galleryId: string): SelectedPhoto[] {
  return db
    .prepare(
      `SELECT p.*, s.note, s.created_at AS selected_at
       FROM selections s
       JOIN photos p ON p.id = s.photo_id
       WHERE s.gallery_id = ?
       ORDER BY p.position, p.created_at`,
    )
    .all(galleryId) as SelectedPhoto[];
}

export function countPhotos(galleryId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM photos WHERE gallery_id = ?")
    .get(galleryId) as { n: number };
  return row.n;
}

export function countSelections(galleryId: string): number {
  const row = db
    .prepare("SELECT COUNT(*) AS n FROM selections WHERE gallery_id = ?")
    .get(galleryId) as { n: number };
  return row.n;
}
