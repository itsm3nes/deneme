/**
 * Panel eylemlerinin dönüş tipi.
 *
 * Server Action dosyalarının dışında tutulur: `"use server"` işaretli bir dosya
 * yalnızca async fonksiyon export edebilir; sabit ya da tip export ederse
 * çalışma zamanında "A use server file can only export async functions" hatası
 * verir.
 */
export type AdminState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export const initialAdminState: AdminState = { status: "idle" };

/** Görsel yükleme sonucu. */
export type UploadResult =
  | { ok: true; src: string }
  | { ok: false; message: string };
