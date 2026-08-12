"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { initialAdminState } from "@/lib/admin/state";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialAdminState);

  return (
    <form action={formAction} className="grid gap-4">
      {state.status === "error" ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100 ring-inset"
        >
          {state.message}
        </p>
      ) : null}

      <div>
        <label className="label" htmlFor="parola">
          Parola
        </label>
        <input
          id="parola"
          name="parola"
          type="password"
          className="field"
          required
          autoComplete="current-password"
          autoFocus
        />
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
        {isPending ? "Kontrol ediliyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
