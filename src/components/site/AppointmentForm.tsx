"use client";

import Link from "next/link";
import { useState } from "react";
import {
  formatAppointmentMessage,
  validateAppointment,
  type AppointmentField,
} from "@/lib/appointment";
import { clinic, whatsappLink } from "@/lib/clinic";
import { treatments } from "@/lib/treatments";
import { Icon } from "./Icons";

/**
 * Randevu formu.
 *
 * Talep sunucuya yazılmaz: alanlar tarayıcıda doğrulanır, ardından bilgiler
 * hazır bir mesaja çevrilip WhatsApp'ta açılır. Gönderim tıklama olayının
 * içinde eşzamanlı yapılır — tarayıcının açılır pencere engelleyicisi bunu
 * engellemez. Yine de engellenirse, başarı ekranındaki düğme elle tıklanabilir.
 */

type Errors = Partial<Record<AppointmentField, string>>;

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
  const [errors, setErrors] = useState<Errors>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const { values, errors: found, phone, isBot } = validateAppointment(formData);

    if (isBot) return;

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setErrors({});
    const url = whatsappLink(formatAppointmentMessage(values, phone));
    window.open(url, "_blank", "noopener,noreferrer");
    setSentUrl(url);
  };

  if (sentUrl) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl2 bg-aqua-50 px-6 py-10 text-center ring-1 ring-aqua-100 ring-inset">
        <span className="flex size-14 items-center justify-center rounded-full bg-aqua-500 text-white">
          <Icon name="whatsapp" className="size-7" />
        </span>
        <h3 className="text-xl font-extrabold">WhatsApp&apos;ta açıldı</h3>
        <p className="max-w-sm text-sm leading-relaxed text-ink-600">
          Bilgileriniz hazır bir mesaja dönüştürüldü. Talebinizi tamamlamak için
          mesajı göndermeniz yeterli.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href={sentUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary btn-sm"
          >
            <Icon name="whatsapp" className="size-4" />
            Pencere açılmadıysa tıklayın
          </a>
          <a href={clinic.phone.href} className="btn btn-outline btn-sm">
            <Icon name="phone" className="size-4" />
            {clinic.phone.display}
          </a>
        </div>
        <Link href="/" className="text-sm font-semibold text-aqua-700 hover:underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
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
            aria-invalid={Boolean(errors.adSoyad)}
            placeholder="Adınız ve soyadınız"
          />
          <FieldError>{errors.adSoyad}</FieldError>
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
            aria-invalid={Boolean(errors.telefon)}
            placeholder="0 5__ ___ __ __"
          />
          <FieldError>{errors.telefon}</FieldError>
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
            defaultValue={defaultTreatment ?? ""}
            aria-invalid={Boolean(errors.tedavi)}
          >
            <option value="">Seçiniz (isteğe bağlı)</option>
            {treatments.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.title}
              </option>
            ))}
          </select>
          <FieldError>{errors.tedavi}</FieldError>
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
              aria-invalid={Boolean(errors.eposta)}
              placeholder="ornek@eposta.com"
            />
            <FieldError>{errors.eposta}</FieldError>
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
                aria-invalid={Boolean(errors.tarih)}
              />
              <FieldError>{errors.tarih}</FieldError>
            </div>
            <div>
              <label className="label" htmlFor="saat">
                Tercih ettiğiniz saat aralığı
              </label>
              <select id="saat" name="saat" className="field" defaultValue="">
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
              aria-invalid={Boolean(errors.mesaj)}
              placeholder="Örn. sağ alt azı dişimde sıcak-soğuk hassasiyeti var."
            />
            <FieldError>{errors.mesaj}</FieldError>
          </div>
        </>
      ) : null}

      <div>
        <label className="flex items-start gap-3 text-sm text-ink-600">
          <input
            type="checkbox"
            name="kvkk"
            className="mt-0.5 size-4.5 shrink-0 rounded accent-aqua-500"
            aria-invalid={Boolean(errors.kvkk)}
          />
          <span>
            <Link href="/kvkk" className="font-semibold text-aqua-700 underline">
              KVKK Aydınlatma Metni
            </Link>
            &apos;ni okudum; iletişim bilgilerimin randevu amacıyla işlenmesini
            onaylıyorum. *
          </span>
        </label>
        <FieldError>{errors.kvkk}</FieldError>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        <Icon name="whatsapp" className="size-4" />
        WhatsApp ile Randevu Talebi Gönder
      </button>

      <p className="hint">
        Form gönderimi randevunuzu kesinleştirmez; bilgileriniz WhatsApp mesajına
        dönüştürülür. Talebiniz bize ulaştıktan sonra sizi arayarak uygun saati
        birlikte belirliyoruz. Acil durumlarda lütfen doğrudan telefonla ulaşın.
      </p>
    </form>
  );
}
