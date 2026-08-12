"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createAppointmentRequest } from "@/app/randevu/actions";
import { initialAppointmentState } from "@/lib/appointment";
import { treatments } from "@/lib/treatments";
import { Icon } from "./Icons";

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs font-semibold text-red-600">
      {children}
    </p>
  );
}

export function AppointmentForm({
  variant = "full",
  defaultTreatment,
}: {
  variant?: "full" | "compact";
  defaultTreatment?: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createAppointmentRequest,
    initialAppointmentState,
  );

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl2 bg-aqua-50 px-6 py-10 text-center ring-1 ring-aqua-100 ring-inset">
        <span className="flex size-14 items-center justify-center rounded-full bg-aqua-500 text-white">
          <Icon name="check" className="size-7" />
        </span>
        <h3 className="text-xl font-extrabold">Talebiniz alındı</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ink-600">
          {state.message}
        </p>
        <Link href="/" className="btn btn-outline btn-sm">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  const v = state.values ?? {};
  const e = state.errors ?? {};

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      {state.status === "error" && state.message ? (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 ring-1 ring-red-100 ring-inset"
        >
          {state.message}
        </p>
      ) : null}

      {/* bot tuzağı */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="adSoyad">
            Ad Soyad *
          </label>
          <input
            id="adSoyad"
            name="adSoyad"
            className="field"
            required
            autoComplete="name"
            defaultValue={v.adSoyad}
            aria-invalid={Boolean(e.adSoyad)}
            placeholder="Adınız ve soyadınız"
          />
          <FieldError>{e.adSoyad}</FieldError>
        </div>

        <div>
          <label className="label" htmlFor="telefon">
            Telefon *
          </label>
          <input
            id="telefon"
            name="telefon"
            type="tel"
            inputMode="tel"
            className="field"
            required
            autoComplete="tel"
            defaultValue={v.telefon}
            aria-invalid={Boolean(e.telefon)}
            placeholder="0 5__ ___ __ __"
          />
          <FieldError>{e.telefon}</FieldError>
        </div>
      </div>

      <div className={variant === "compact" ? "" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label className="label" htmlFor="tedavi">
            İlgilendiğiniz tedavi
          </label>
          <select
            id="tedavi"
            name="tedavi"
            className="field"
            defaultValue={v.tedavi ?? defaultTreatment ?? ""}
            aria-invalid={Boolean(e.tedavi)}
          >
            <option value="">Seçiniz (isteğe bağlı)</option>
            {treatments.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          <FieldError>{e.tedavi}</FieldError>
        </div>

        {variant === "full" ? (
          <div>
            <label className="label" htmlFor="eposta">
              E-posta
            </label>
            <input
              id="eposta"
              name="eposta"
              type="email"
              className="field"
              autoComplete="email"
              defaultValue={v.eposta}
              aria-invalid={Boolean(e.eposta)}
              placeholder="ornek@eposta.com"
            />
            <FieldError>{e.eposta}</FieldError>
          </div>
        ) : null}
      </div>

      {variant === "full" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="tarih">
                Tercih ettiğiniz gün
              </label>
              <input
                id="tarih"
                name="tarih"
                type="date"
                className="field"
                defaultValue={v.tarih}
                aria-invalid={Boolean(e.tarih)}
              />
              <FieldError>{e.tarih}</FieldError>
            </div>
            <div>
              <label className="label" htmlFor="saat">
                Tercih ettiğiniz saat aralığı
              </label>
              <select
                id="saat"
                name="saat"
                className="field"
                defaultValue={v.saat ?? ""}
              >
                <option value="">Fark etmez</option>
                <option value="sabah">Sabah (09:00 – 12:00)</option>
                <option value="ogleden-sonra">Öğleden sonra (12:00 – 16:00)</option>
                <option value="aksam">Akşamüstü (16:00 – 19:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label" htmlFor="mesaj">
              Şikâyetiniz ya da eklemek istedikleriniz
            </label>
            <textarea
              id="mesaj"
              name="mesaj"
              rows={4}
              className="field resize-y"
              defaultValue={v.mesaj}
              aria-invalid={Boolean(e.mesaj)}
              placeholder="Örn. sağ alt azı dişimde sıcak-soğuk hassasiyeti var."
            />
            <FieldError>{e.mesaj}</FieldError>
          </div>
        </>
      ) : null}

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <input
            type="checkbox"
            name="kvkk"
            className="mt-0.5 size-4.5 shrink-0 rounded accent-aqua-500"
            aria-invalid={Boolean(e.kvkk)}
          />
          <span>
            <Link href="/kvkk" className="font-semibold text-aqua-700 underline">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum; iletişim bilgilerimin randevu amacıyla işlenmesini
            onaylıyorum. *
          </span>
        </label>
        <FieldError>{e.kvkk}</FieldError>
      </div>

      <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
        {isPending ? (
          "Gönderiliyor…"
        ) : (
          <>
            <Icon name="calendar" className="size-4" />
            Randevu Talebi Gönder
          </>
        )}
      </button>

      <p className="hint">
        Form gönderimi randevunuzu kesinleştirmez. Talebinizi aldıktan sonra
        sizi arayarak uygun saati birlikte belirliyoruz. Acil durumlarda lütfen
        doğrudan telefonla ulaşın.
      </p>
    </form>
  );
}
