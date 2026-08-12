/**
 * Randevu formunun **statik export** sürümü.
 *
 * `STATIC_EXPORT=1 npm run build` ile üretilen sürümde sunucu yoktur, bu yüzden
 * Server Action çalışamaz. next.config.ts bu dosyayı `@/app/randevu/actions`
 * yerine devreye sokar: form aynı doğrulamadan geçer, ardından talep hazır bir
 * mesaj hâlinde WhatsApp'a aktarılır.
 *
 * İmza Server Action ile aynıdır; `AppointmentForm` bileşeninde değişiklik
 * gerektirmez.
 */

import { whatsappLink } from "./clinic";
import {
  formatAppointmentMessage,
  validateAppointment,
  type AppointmentState,
} from "./appointment";

export async function createAppointmentRequest(
  _prev: AppointmentState,
  formData: FormData,
): Promise<AppointmentState> {
  const { values, errors, phone, isBot } = validateAppointment(formData);

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

  const message = formatAppointmentMessage(values, phone);
  window.open(whatsappLink(message), "_blank", "noopener,noreferrer");

  return {
    status: "success",
    title: "WhatsApp'a aktarıldı",
    message:
      "Bilgileriniz hazır bir mesaja dönüştürülüp WhatsApp'ta açıldı. Göndermek için mesajı iletmeniz yeterli. Pencere açılmadıysa telefonla arayabilirsiniz: 0226 813 33 77",
  };
}
