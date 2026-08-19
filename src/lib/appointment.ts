/**
 * Randevu formunun doğrulaması ve mesaj biçimlendirmesi.
 *
 * Form sunucuya kayıt yazmaz: doğrulamadan geçen talep hazır bir mesaja
 * çevrilip WhatsApp'ta açılır. Bu sayede hem sunuculu hem statik sürümde
 * aynı şekilde çalışır ve hiçbir talep sunucuda kaybolmaz.
 */

import { treatments } from "./treatments";

export type AppointmentField =
  | "adSoyad"
  | "telefon"
  | "eposta"
  | "tedavi"
  | "tarih"
  | "saat"
  | "mesaj"
  | "kvkk";

export type AppointmentValues = Record<
  Exclude<AppointmentField, "kvkk">,
  string
>;

/** Türkiye cep/sabit hat: 10 hane (başındaki 0 ve +90 ayıklanır). */
export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) return digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
  return digits;
}

export type ValidationResult = {
  values: AppointmentValues;
  errors: Partial<Record<AppointmentField, string>>;
  /** Normalize edilmiş 10 haneli numara */
  phone: string;
  /** Gizli alan doldurulmuşsa istek bot kaynaklıdır. */
  isBot: boolean;
};

export function validateAppointment(formData: FormData): ValidationResult {
  const get = (key: string) =>
    (formData.get(key) as string | null)?.trim() ?? "";

  const values: AppointmentValues = {
    adSoyad: get("adSoyad"),
    telefon: get("telefon"),
    eposta: get("eposta"),
    tedavi: get("tedavi"),
    tarih: get("tarih"),
    saat: get("saat"),
    mesaj: get("mesaj"),
  };

  const errors: ValidationResult["errors"] = {};
  const phone = normalizePhone(values.telefon);

  if (values.adSoyad.length < 3) {
    errors.adSoyad = "Lütfen ad ve soyadınızı yazın.";
  }

  if (phone.length !== 10) {
    errors.telefon = "10 haneli telefon numarası girin (örn. 555 123 45 67).";
  }

  if (values.eposta && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.eposta)) {
    errors.eposta = "E-posta adresi geçerli görünmüyor.";
  }

  if (values.tedavi && !treatments.some((t) => t.slug === values.tedavi)) {
    errors.tedavi = "Listeden bir tedavi seçin.";
  }

  if (values.tarih) {
    const chosen = new Date(`${values.tarih}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(chosen.getTime()) || chosen < today) {
      errors.tarih = "Geçmiş bir tarih seçilemez.";
    }
  }

  if (values.mesaj.length > 1000) {
    errors.mesaj = "Mesajınız 1000 karakteri aşmamalı.";
  }

  if (formData.get("kvkk") !== "on") {
    errors.kvkk = "Devam etmek için aydınlatma metnini onaylamanız gerekiyor.";
  }

  return { values, errors, phone, isBot: Boolean(get("website")) };
}

/** Talebi okunur bir mesaja çevirir (WhatsApp/e-posta gönderimi için). */
export function formatAppointmentMessage(
  values: AppointmentValues,
  phone: string,
) {
  const treatment = treatments.find((t) => t.slug === values.tedavi);
  const saatler: Record<string, string> = {
    sabah: "Sabah (09:00 – 12:00)",
    "ogleden-sonra": "Öğleden sonra (12:00 – 16:00)",
    aksam: "Akşamüstü (16:00 – 19:00)",
  };

  return [
    "Merhaba, randevu talebi oluşturmak istiyorum.",
    "",
    `Ad Soyad: ${values.adSoyad}`,
    `Telefon: 0${phone}`,
    values.eposta ? `E-posta: ${values.eposta}` : null,
    treatment ? `Tedavi: ${treatment.title}` : null,
    values.tarih ? `Tercih edilen gün: ${values.tarih}` : null,
    values.saat ? `Tercih edilen saat: ${saatler[values.saat] ?? values.saat}` : null,
    values.mesaj ? `Not: ${values.mesaj}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
