"use server";

import { redirect } from "next/navigation";
import {
  checkPassword,
  endSession,
  isAuthenticated,
  isPanelEnabled,
  startSession,
} from "@/lib/admin/auth";
import {
  sections,
  validateSection,
  type ListSectionId,
  type SectionDef,
} from "@/lib/admin/sections";
import { deleteImage, saveImage, saveSection } from "@/lib/admin/storage";
import type { AdminState, UploadResult } from "@/lib/admin/state";
import type { Clinic } from "@/lib/clinic";
import type { Gallery } from "@/lib/gallery";

/* ---------------- Oturum ---------------- */

export async function login(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  if (!isPanelEnabled()) {
    return {
      status: "error",
      message:
        "Panel kapalı: sunucuda ADMIN_PASSWORD tanımlı değil (en az 8 karakter).",
    };
  }

  const password = String(formData.get("parola") ?? "");
  if (!checkPassword(password)) {
    // Kaba kuvvet denemelerini yavaşlatmak için küçük bir gecikme.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { status: "error", message: "Parola hatalı." };
  }

  await startSession();
  redirect("/yonetim");
}

export async function logout() {
  await endSession();
  redirect("/yonetim/giris");
}

/* ---------------- Kaydetme ---------------- */

async function guard() {
  if (!(await isAuthenticated())) {
    throw new Error("Oturumunuz sona ermiş. Lütfen yeniden giriş yapın.");
  }
}

/** Liste hâlindeki bölümler: hekimler, S.S.S., yorumlar, tedaviler, blog. */
export async function saveListSection(
  sectionId: ListSectionId,
  payload: string,
): Promise<AdminState> {
  try {
    await guard();

    const section: SectionDef | undefined = sections[sectionId];
    if (!section) return { status: "error", message: "Bilinmeyen bölüm." };

    const items = JSON.parse(payload) as Record<string, unknown>[];
    if (!Array.isArray(items)) {
      return { status: "error", message: "İçerik biçimi bozuk." };
    }

    const errors = validateSection(section, items);
    if (errors.length) {
      return { status: "error", message: errors.slice(0, 4).join(" ") };
    }

    const result = await saveSection(sectionId, items);
    return { status: result.ok ? "success" : "error", message: result.message };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Kaydedilemedi.",
    };
  }
}

/** Klinik künyesi (tek nesne). */
export async function saveClinic(payload: string): Promise<AdminState> {
  try {
    await guard();

    const data = JSON.parse(payload) as Clinic;
    if (!data?.name || !data?.phone?.display) {
      return {
        status: "error",
        message: "Klinik adı ve telefon numarası boş bırakılamaz.",
      };
    }

    // Telefon bağlantısı numaradan türetilir; elle girilmesi gerekmez.
    const digits = data.phone.display.replace(/\D/g, "");
    const national = digits.startsWith("0") ? digits.slice(1) : digits;
    data.phone.href = `tel:+90${national}`;
    data.phone.intl = `+90 ${national}`;

    data.address.full = `${data.address.street}, ${data.address.district} / ${data.address.city}`;

    const result = await saveSection("clinic", data);
    return { status: result.ok ? "success" : "error", message: result.message };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Kaydedilemedi.",
    };
  }
}

/* ---------------- Galeri ---------------- */

const ALLOWED_TYPES = ["image/webp", "image/jpeg", "image/png"];
const MAX_BYTES = 900 * 1024; // Server Action gövde sınırının altında kalmalı

/** Dosya adı için güvenli, Türkçe karaktersiz karşılık üretir. */
function slugify(value: string) {
  const map: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return value
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (ch) => map[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "gorsel";
}

/**
 * Tek bir görseli yükler. Görsel tarayıcıda küçültülüp sıkıştırıldığı için
 * buraya küçük bir dosya ulaşır; yine de tür ve boyut sunucuda da denetlenir.
 */
export async function uploadGalleryImage(formData: FormData): Promise<UploadResult> {
  try {
    await guard();

    const file = formData.get("dosya");
    if (!(file instanceof File) || file.size === 0) {
      return { ok: false, message: "Dosya alınamadı." };
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { ok: false, message: "Yalnızca WebP, JPEG ve PNG yüklenebilir." };
    }
    if (file.size > MAX_BYTES) {
      return {
        ok: false,
        message: "Görsel çok büyük. Lütfen daha küçük bir dosya seçin.",
      };
    }

    const label = slugify(String(formData.get("ad") ?? "gorsel"));
    const extension = file.type === "image/png" ? "png" : file.type === "image/jpeg" ? "jpg" : "webp";
    const filename = `${label}-${Date.now().toString(36)}.${extension}`;

    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await saveImage(filename, bytes);
    if (!result.ok) return { ok: false, message: result.message };

    return { ok: true, src: `/galeri/${filename}` };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Görsel yüklenemedi.",
    };
  }
}

/** Galeri kaydı: fotoğraf listesi + öncesi/sonrası vakaları. */
export async function saveGallery(
  payload: string,
  removedImages: string[] = [],
): Promise<AdminState> {
  try {
    await guard();

    const data = JSON.parse(payload) as Gallery;
    if (!Array.isArray(data?.photos) || !Array.isArray(data?.cases)) {
      return { status: "error", message: "İçerik biçimi bozuk." };
    }

    const eksikAlt = data.photos.filter((photo) => !photo.alt?.trim()).length;
    if (eksikAlt > 0) {
      return {
        status: "error",
        message: `${eksikAlt} fotoğrafın açıklaması boş. Açıklama, görme engelli ziyaretçiler ve arama motorları için zorunlu.`,
      };
    }

    const result = await saveSection("gallery", data);
    if (!result.ok) return { status: "error", message: result.message };

    // Kayıt başarılıysa listeden çıkarılan görsellerin dosyalarını da temizle.
    for (const src of removedImages) {
      await deleteImage(src);
    }

    return { status: "success", message: result.message };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Kaydedilemedi.",
    };
  }
}
