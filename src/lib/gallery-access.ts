import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_PREFIX = "ps_gallery_";
const MAX_AGE = 60 * 60 * 24 * 30;

function accessSecret(): string {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "AUTH_SECRET must be set to a random string of 16+ characters.",
      );
    }
    return "dev-only-insecure-secret-change-me";
  }
  return value;
}

function sign(slug: string, accessCode: string): string {
  return createHmac("sha256", accessSecret())
    .update(`${slug}:${accessCode}`)
    .digest("hex");
}

export function codesMatch(input: string, expected: string): boolean {
  const a = Buffer.from(input.trim().toUpperCase());
  const b = Buffer.from(expected.trim().toUpperCase());
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function grantGalleryAccess(
  slug: string,
  accessCode: string,
): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_PREFIX + slug, sign(slug, accessCode), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function hasGalleryAccess(
  slug: string,
  accessCode: string | null,
): Promise<boolean> {
  if (!accessCode) return true;
  const store = await cookies();
  const token = store.get(COOKIE_PREFIX + slug)?.value;
  if (!token) return false;
  const expected = sign(slug, accessCode);
  if (token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
