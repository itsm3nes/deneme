import type { IconName } from "@/components/site/Icons";
import treatmentsJson from "../../content/treatments.json";

/**
 * Tedavi içerikleri `content/treatments.json` dosyasında tutulur ve yönetim
 * panelinden (`/yonetim/tedaviler`) düzenlenir.
 */

export type Treatment = {
  slug: string;
  title: string;
  /** Menü ve kartlarda kullanılan kısa ad */
  short: string;
  icon: IconName;
  /** Kart altı tek cümlelik özet */
  excerpt: string;
  /** Detay sayfası giriş paragrafı */
  intro: string;
  /** "Kimler için uygundur?" maddeleri */
  suitableFor: string[];
  /** Tedavi adımları */
  steps: { title: string; text: string }[];
  facts: { label: string; value: string }[];
  faq: { q: string; a: string }[];
  featured?: boolean;
};

export const treatments = treatmentsJson as Treatment[];

export function getTreatment(slug: string) {
  return treatments.find((t) => t.slug === slug);
}

export const featuredTreatments = treatments.filter((t) => t.featured);
