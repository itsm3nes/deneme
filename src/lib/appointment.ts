/**
 * Randevu formunun paylaşılan tipleri ve başlangıç durumu.
 *
 * Bunlar bilerek Server Action dosyasının dışında tutuldu: `"use server"`
 * işaretli bir dosya yalnızca async fonksiyon export edebilir, sabit ya da tip
 * export ederse çalışma zamanında hata verir.
 */

export type AppointmentField =
  | "adSoyad"
  | "telefon"
  | "eposta"
  | "tedavi"
  | "tarih"
  | "saat"
  | "mesaj"
  | "kvkk";

export type AppointmentState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<AppointmentField, string>>;
  values?: Partial<Record<AppointmentField, string>>;
};

export const initialAppointmentState: AppointmentState = { status: "idle" };
