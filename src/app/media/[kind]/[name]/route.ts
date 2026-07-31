import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { THUMB_DIR, UPLOAD_DIR } from "@/lib/db";

const SAFE_NAME = /^[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp)$/;

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string; name: string }> },
) {
  const { kind, name } = await params;

  if ((kind !== "thumb" && kind !== "full") || !SAFE_NAME.test(name)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const dir = kind === "thumb" ? THUMB_DIR : UPLOAD_DIR;
  const filePath = path.join(dir, path.basename(name));
  if (!filePath.startsWith(dir + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = name.split(".").pop()!.toLowerCase();
  const body = await fs.promises.readFile(filePath);

  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Content-Length": String(stat.size),
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
