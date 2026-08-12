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
import { saveSection } from "@/lib/admin/storage";
import type { AdminState } from "@/lib/admin/state";
import type { Clinic } from "@/lib/clinic";

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
