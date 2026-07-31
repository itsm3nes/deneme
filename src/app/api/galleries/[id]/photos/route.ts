import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { NextResponse } from "next/server";
import { db, THUMB_DIR, UPLOAD_DIR } from "@/lib/db";
import { currentPhotographer } from "@/lib/auth";
import { getGalleryForPhotographer } from "@/lib/queries";
import { newId } from "@/lib/ids";

const MAX_BYTES = 40 * 1024 * 1024;
const ACCEPTED = new Set(["image/jpeg", "image/png", "image/webp"]);

export const maxDuration = 60;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const photographer = await currentPhotographer();
  if (!photographer) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { id: galleryId } = await params;
  const gallery = getGalleryForPhotographer(galleryId, photographer.id);
  if (!gallery)
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "no_files" }, { status: 400 });
  }

  const startRow = db
    .prepare(
      "SELECT COALESCE(MAX(position), -1) AS max FROM photos WHERE gallery_id = ?",
    )
    .get(galleryId) as { max: number };
  let position = startRow.max + 1;

  const insert = db.prepare(
    `INSERT INTO photos
       (id, gallery_id, original_name, base_name, stored_name, thumb_name,
        mime, bytes, width, height, position, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );

  const created: { id: string; original_name: string; thumb_name: string }[] =
    [];
  const failed: { name: string; reason: string }[] = [];

  for (const file of files) {
    if (!ACCEPTED.has(file.type)) {
      failed.push({ name: file.name, reason: "wrongType" });
      continue;
    }
    if (file.size > MAX_BYTES) {
      failed.push({ name: file.name, reason: "tooLarge" });
      continue;
    }

    try {
      const input = Buffer.from(await file.arrayBuffer());
      const id = newId();
      const storedName = `${id}.jpg`;
      const thumbName = `${id}_t.webp`;

      const pipeline = sharp(input, { failOn: "none" }).rotate();
      const meta = await pipeline.metadata();

      const full = await pipeline
        .clone()
        .resize({
          width: 2560,
          height: 2560,
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 84, mozjpeg: true })
        .toBuffer();

      const thumb = await pipeline
        .clone()
        .resize({
          width: 720,
          height: 720,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 74 })
        .toBuffer();

      await fs.promises.writeFile(path.join(UPLOAD_DIR, storedName), full);
      await fs.promises.writeFile(path.join(THUMB_DIR, thumbName), thumb);

      const originalName = path.basename(file.name);
      insert.run(
        id,
        galleryId,
        originalName,
        originalName.replace(/\.[^.]+$/, ""),
        storedName,
        thumbName,
        "image/jpeg",
        full.byteLength,
        meta.width ?? null,
        meta.height ?? null,
        position++,
        new Date().toISOString(),
      );

      created.push({ id, original_name: originalName, thumb_name: thumbName });
    } catch {
      failed.push({ name: file.name, reason: "failed" });
    }
  }

  return NextResponse.json({ created, failed });
}
