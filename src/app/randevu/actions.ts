"use server";

import { appendFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  formatAppointmentMessage,
  validateAppointment,
  type AppointmentState,
} from "@/lib/appointment";

/**
 * Vercel gibi sunucusuz ortamlarda proje klasörü salt okunurdur; yalnızca
 * geçici klasöre yazılabilir. Bu yüzden orada /tmp kullanılır — kalıcı değildir,
 * bu nedenle her talep ayrıca sunucu günlüğüne de yazılır.
 */
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME,
);
const DATA_DIR =
  process.env.DATA_DIR ??
  (isServerless
    ? path.join(os.tmpdir(), "meva")
    : path.join(process.cwd(), "storage"));
const REQUEST_FILE = path.join(DATA_DIR, "randevu-talepleri.jsonl");

export async function createAppointmentRequest(
  _prev: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const { values, errors, phone, isBot } = validateAppointment(formData);

  // Bot tuzağı: gizli alan doluysa isteği sessizce başarılı gösterip yok say.
  if (isBot) {
    return { status: "success", message: "Talebiniz alındı." };
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Formda eksik ya da hatalı alanlar var.",
      errors,
      values,
    };
  }

  const record = { ...values, telefon: phone, olusturma: new Date().toISOString() };

  /**
   * ⚠️ TASLAK: Talepler şimdilik sunucudaki bir dosyaya yazılıyor ve günlüğe
   * düşürülüyor. Yayına alırken burayı e-posta (ör. Resend/SMTP), SMS ya da
   * klinik yazılımınızın API'siyle değiştirin — aksi hâlde sunucusuz
   * ortamlarda talepler kalıcı olarak saklanmaz.
   */
  console.info("[randevu talebi]", formatAppointmentMessage(values, phone));

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
