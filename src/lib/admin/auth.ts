import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Yönetim paneli oturumu.
 *
 * Tek bir yönetici parolası kullanılır (`ADMIN_PASSWORD` ortam değişkeni).
 * Parola hiçbir zaman çereze yazılmaz; çerezde yalnızca HMAC ile imzalanmış,
 * süreli bir jeton durur. Parola tanımlı değilse panel tamamen kapalıdır.
 */

const COOKIE_NAME = "meva_yonetim";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 saat

function adminPassword() {
  return process.env.ADMIN_PASSWORD ?? "";
}

/** Panel yalnızca yeterince uzun bir parola tanımlıysa açılır. */
export function isPanelEnabled() {
  return adminPassword().length >= 8;
}

function signingSecret() {
  return process.env.ADMIN_SECRET || `meva:${adminPassword()}`;
}

function sign(payload: string) {
  return createHmac("sha256", signingSecret()).update(payload).digest("hex");
}

function safeEquals(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Parolayı zamanlama saldırılarına kapalı biçimde karşılaştırır. */
export function checkPassword(input: string) {
  if (!isPanelEnabled()) return false;
  return safeEquals(input, adminPassword());
}

function createToken() {
  const payload = `${Date.now() + MAX_AGE_SECONDS * 1000}.${randomBytes(8).toString("hex")}`;
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token: string | undefined) {
  if (!token || !isPanelEnabled()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (!safeEquals(signature, sign(`${expires}.${nonce}`))) return false;
  return Number(expires) > Date.now();
}

export async function startSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/yonetim",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/yonetim" });
}

export async function isAuthenticated() {
  const store = await cookies();
  return verifyToken(store.get(COOKIE_NAME)?.value);
}
