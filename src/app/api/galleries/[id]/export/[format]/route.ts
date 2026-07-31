import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";
import { NextResponse } from "next/server";
import { UPLOAD_DIR } from "@/lib/db";
import { currentPhotographer } from "@/lib/auth";
import { getGalleryForPhotographer, listSelectedPhotos } from "@/lib/queries";
import {
  buildCsv,
  buildFilenameList,
  buildXmp,
  parseXmpOptions,
  uniqueSidecarName,
} from "@/lib/lightroom";
import { getDictionary } from "@/i18n";
import { slugify } from "@/lib/ids";

export const maxDuration = 120;

const FORMATS = new Set(["xmp", "filenames", "csv", "photos"]);

function attachment(name: string) {
  return `attachment; filename="${name}"; filename*=UTF-8''${encodeURIComponent(name)}`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; format: string }> },
) {
  const photographer = await currentPhotographer();
  if (!photographer) return new NextResponse("Unauthorized", { status: 401 });

  const { id, format } = await params;
  if (!FORMATS.has(format))
    return new NextResponse("Not found", { status: 404 });

  const gallery = getGalleryForPhotographer(id, photographer.id);
  if (!gallery) return new NextResponse("Not found", { status: 404 });

  const picks = listSelectedPhotos(gallery.id);
  if (picks.length === 0)
    return new NextResponse("No selections", { status: 409 });

  const searchParams = new URL(request.url).searchParams;
  const stem = slugify(gallery.title) || "gallery";

  if (format === "filenames") {
    const body = buildFilenameList(picks.map((p) => p.base_name));
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": attachment(`${stem}-filenames.txt`),
      },
    });
  }

  if (format === "csv") {
    const t = getDictionary(searchParams.get("locale") ?? photographer.locale);
    const body = buildCsv(
      picks.map((p) => ({
        filename: p.original_name,
        note: p.note,
        selectedAt: p.selected_at,
      })),
      [t.common.photo, t.selections.noteColumn, t.selections.submittedAt],
    );
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": attachment(`${stem}-selections.csv`),
      },
    });
  }

  const zip = new JSZip();

  if (format === "xmp") {
    const options = parseXmpOptions(searchParams);
    const taken = new Set<string>();
    for (const photo of picks) {
      zip.file(
        uniqueSidecarName(photo.base_name, taken),
        buildXmp(photo.note, options),
      );
    }
    zip.file(
      "_filenames.txt",
      buildFilenameList(picks.map((p) => p.base_name)),
    );
  } else {
    const taken = new Set<string>();
    for (const photo of picks) {
      const filePath = path.join(UPLOAD_DIR, path.basename(photo.stored_name));
      try {
        const buffer = await fs.promises.readFile(filePath);
        let name = `${photo.base_name}.jpg`;
        let n = 2;
        while (taken.has(name.toLowerCase()))
          name = `${photo.base_name} (${n++}).jpg`;
        taken.add(name.toLowerCase());
        zip.file(name, buffer);
      } catch {
        // A missing file on disk shouldn't sink the whole archive.
      }
    }
  }

  const archive = await zip.generateAsync({
    type: "nodebuffer",
    compression: format === "photos" ? "STORE" : "DEFLATE",
  });

  return new NextResponse(new Uint8Array(archive), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Length": String(archive.byteLength),
      "Content-Disposition": attachment(
        format === "xmp" ? `${stem}-xmp.zip` : `${stem}-photos.zip`,
      ),
    },
  });
}
