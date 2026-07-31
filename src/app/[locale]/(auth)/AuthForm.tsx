"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { loginAction, registerAction, type AuthState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "…" : label}
    </button>
  );
}

export default function AuthForm({
  mode,
  locale,
  t,
}: {
  mode: "login" | "register";
  locale: Locale;
  t: Dictionary;
}) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction] = useActionState<AuthState, FormData>(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />

      {mode === "register" && (
        <>
          <div>
            <label className="label" htmlFor="name">
              {t.common.name}
            </label>
            <input
              id="name"
              name="name"
              className="field"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="studio">
              {t.common.studio}{" "}
              <span className="font-normal text-ink-500">
                ({t.common.optional})
              </span>
            </label>
            <input
              id="studio"
              name="studio"
              className="field"
              autoComplete="organization"
            />
          </div>
        </>
      )}

      <div>
        <label className="label" htmlFor="email">
          {t.common.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          className="field"
          autoComplete="email"
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          {t.common.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="field"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={mode === "register" ? 8 : undefined}
          required
        />
      </div>

      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300 ring-1 ring-red-500/25 ring-inset"
        >
          {state.error}
        </p>
      )}

      <SubmitButton
        label={mode === "login" ? t.auth.submitLogin : t.auth.submitRegister}
      />

      <p className="pt-2 text-center text-sm text-ink-400">
        {mode === "login" ? t.auth.noAccount : t.auth.hasAccount}{" "}
        <Link
          href={`/${locale}/${mode === "login" ? "register" : "login"}`}
          className="font-medium text-gold-400 hover:text-gold-500"
        >
          {mode === "login" ? t.nav.register : t.nav.login}
        </Link>
      </p>
    </form>
  );
}
