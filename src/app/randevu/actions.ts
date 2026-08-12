"use server";

import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { treatments } from "@/lib/treatments";

export type AppointmentState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<AppointmentField, string>>;
  values?: Partial<Record<AppointmentField, string>>;
};

type AppointmentField =
  | "adSoyad"
  | "telefon"
  | "eposta"
  | "tedavi"
  | "tarih"
  | "saat"
  | "mesaj"
  | "kvkk";

export const initialAppointmentState: AppointmentState = { status: "idle" };

const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), "storage");
const REQUEST_FILE = path.join(DATA_DIR, "randevu-talepleri.jsonl");

/** Türkiye cep/sabit hat: 10 hane (başındaki 0 ve +90 ayıklanır). */
function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("90") && digits.length === 12) return digits.slice(2);
  if (digits.startsWith("0") && digits.length === 11) return digits.slice(1);
  return digits;
}

export async function createAppointmentRequest(
  _prev: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const get = (key: AppointmentField) =>
    (formData.get(key) as string | null)?.trim() ?? "";

  const values = {
    adSoyad: get("adSoyad"),
    telefon: get("telefon"),
    eposta: get("eposta"),
    tedavi: get("tedavi"),
    tarih: get("tarih"),
    saat: get("saat"),
    mesaj: get("mesaj"),
  };

  // Bot tuzağı: gizli alan doluysa isteği sessizce başarılı gösterip yok say.
  if (get("website" as AppointmentField)) {
    return { status: "success", message: "Talebiniz alındı." };
  }

  const errors: AppointmentState["errors"] = {};

  if (values.adSoyad.length < 3) {
    errors.adSoyad = "Lütfen ad ve soyadınızı yazın.";
  }

  const phone = normalizePhone(values.telefon);
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

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Formda eksik ya da hatalı alanlar var.",
      errors,
      values,
    };
  }

  const record = {
    ...values,
    telefon: phone,
    olusturma: new Date().toISOString(),
  };

  /**
   * ⚠️ TASLAK: Talepler şimdilik sunucudaki bir dosyaya yazılıyor.
   * Yayına alırken burayı e-posta (ör. Resend/SMTP), SMS ya da klinik
   * yazılımınızın API'siyle değiştirin.
   */
  try {
    await mkdir(DATA_DIR, { recursive: true });
    await appendFile(REQUEST_FILE, `${JSON.stringify(record)}\n`, "utf8");
  } catch (error) {
    console.error("Randevu talebi kaydedilemedi:", error);
    return {
      status: "error",
      message:
        "Talebiniz kaydedilemedi. Lütfen bizi telefonla arayın: 0226 813 33 77",
      values,
    };
  }

  return {
    status: "success",
    message:
      "Randevu talebiniz bize ulaştı. Çalışma saatleri içinde sizi arayarak randevunuzu kesinleştireceğiz.",
  };
}
