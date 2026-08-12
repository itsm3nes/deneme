import clinicJson from "../../content/clinic.json";

/**
 * Klinik künyesi.
 *
 * Veriler `content/clinic.json` dosyasından gelir; bu dosyayı yönetim
 * panelinden (`/yonetim`) düzenleyebilirsiniz. JSON build sırasında koda
 * gömüldüğü için hem sunucu hem tarayıcı tarafında kullanılabilir — bu yüzden
 * değişiklikler sitede yeniden yayınlandıktan sonra görünür.
 */

export type ClinicHours = {
  verified: boolean;
  weekly: { day: string; open: string | null; close: string | null }[];
  summary: string;
  note: string;
};

export type Clinic = {
  name: string;
  shortName: string;
  tagline: string;
  legalName: string;
  phone: { display: string; href: string; intl: string };
  whatsapp: { display: string; number: string; verified: boolean };
  email: string;
  address: {
    street: string;
    district: string;
    city: string;
    postalCode: string;
    country: string;
    full: string;
    geo: { lat: number; lng: number; verified: boolean };
    mapsUrl: string;
    directionsUrl: string;
  };
  hours: ClinicHours;
  social: { instagram: string; facebook: string; website: string };
};

const data = clinicJson as Clinic;

export const clinic = {
  ...data,
  /**
   * Sitenin canlı adresi; canonical, Open Graph, sitemap ve robots buradan üretilir.
   * Öncelik: NEXT_PUBLIC_SITE_URL → Vercel önizleme adresi → gerçek alan adı.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://www.mevadis.com.tr"),
};

/**
 * Gerçek alan adı (NEXT_PUBLIC_SITE_URL) tanımlanmadığı sürece site taslak
 * sayılır: arama motorlarına kapatılır. Yayına alırken bu değişkeni ayarlayın.
 */
export const isDraftDeployment = !process.env.NEXT_PUBLIC_SITE_URL;

export type NavItem = {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
};

export const mainNav: NavItem[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/tedaviler", label: "Tedavilerimiz" },
  { href: "/hekimlerimiz", label: "Hekimlerimiz" },
  { href: "/galeri", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/sss", label: "S.S.S." },
  { href: "/iletisim", label: "İletişim" },
];

/** WhatsApp'a hazır mesajla yönlendiren bağlantı. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${clinic.whatsapp.number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}
