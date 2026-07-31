"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { newId } from "@/lib/ids";
import {
  createSession,
  destroySession,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { getDictionary } from "@/i18n";
import type { Photographer } from "@/lib/types";

export type AuthState = { error?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = String(formData.get("locale") ?? "tr");
  const t = getDictionary(locale);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email)) return { error: t.auth.invalidEmail };

  const row = db
    .prepare("SELECT * FROM photographers WHERE email = ?")
    .get(email) as Photographer | undefined;

  if (!row || !verifyPassword(password, row.password_hash)) {
    return { error: t.auth.invalidCredentials };
  }

  await createSession(row.id);
  redirect(`/${locale}/dashboard`);
}

export async function registerAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const locale = String(formData.get("locale") ?? "tr");
  const t = getDictionary(locale);
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const studio = String(formData.get("studio") ?? "").trim();

  if (!name) return { error: t.auth.nameRequired };
  if (!EMAIL_RE.test(email)) return { error: t.auth.invalidEmail };
  if (password.length < 8) return { error: t.auth.passwordTooShort };

  const exists = db
    .prepare("SELECT 1 FROM photographers WHERE email = ?")
    .get(email);
  if (exists) return { error: t.auth.emailTaken };

  const id = newId();
  db.prepare(
    `INSERT INTO photographers (id, email, password_hash, name, studio, locale, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    email,
    hashPassword(password),
    name,
    studio || null,
    locale,
    new Date().toISOString(),
  );

  await createSession(id);
  redirect(`/${locale}/dashboard`);
}

export async function logoutAction(formData: FormData) {
  const locale = String(formData.get("locale") ?? "tr");
  await destroySession();
  redirect(`/${locale}`);
}
