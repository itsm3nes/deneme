/**
 * Klinik künyesi — sitedeki tüm iletişim bilgileri buradan okunur.
 *
 * ⚠️ TASLAK NOTU: `verified: false` işaretli alanlar internetteki açık
 * kaynaklardan derlenmedi ya da doğrulanamadı. Yayına almadan önce klinikten
 * teyit alıp güncelleyin (ayrıntı için README "Doğrulanması gerekenler").
 */

export const clinic = {
  name: "Meva Ağız ve Diş Sağlığı Polikliniği",
  shortName: "Meva Diş",
  tagline: "Yalova'da modern ağız ve diş sağlığı",
  legalName: "Meva Ağız ve Diş Sağlığı Polikliniği",

  // Kaynak: mevadis.com.tr / harita kayıtları
  phone: {
    display: "0226 813 33 77",
    href: "tel:+902268133377",
    intl: "+90 226 813 33 77",
  },

  // ⚠️ verified: false — kliniğin WhatsApp hattı teyit edilmeli.
  whatsapp: {
    display: "0226 813 33 77",
    // wa.me formatı: ülke kodu + numara, boşluksuz
    number: "902268133377",
    verified: false,
  },

  email: "mevadisklinikleri@gmail.com",

  address: {
    street: "Bayraktepe Mah. Şehit Ömer Faydalı Cad. No: 77/A",
    district: "Merkez",
    city: "Yalova",
    postalCode: "77100",
    country: "TR",
    full: "Bayraktepe Mah. Şehit Ömer Faydalı Cad. No: 77/A, Merkez / Yalova",
    // ⚠️ verified: false — pin konumu haritadan teyit edilip güncellenmeli.
    geo: { lat: 40.6549, lng: 29.2769, verified: false },
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Meva+A%C4%9F%C4%B1z+ve+Di%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Poliklini%C4%9Fi+Yalova",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=Meva+A%C4%9F%C4%B1z+ve+Di%C5%9F+Sa%C4%9Fl%C4%B1%C4%9F%C4%B1+Poliklini%C4%9Fi+Yalova",
  },

  /** ⚠️ verified: false — çalışma saatleri klinikten teyit edilmeli. */
  hours: {
    verified: false,
    weekly: [
      { day: "Pazartesi", open: "09:00", close: "19:00" },
      { day: "Salı", open: "09:00", close: "19:00" },
      { day: "Çarşamba", open: "09:00", close: "19:00" },
      { day: "Perşembe", open: "09:00", close: "19:00" },
      { day: "Cuma", open: "09:00", close: "19:00" },
      { day: "Cumartesi", open: "09:00", close: "17:00" },
      { day: "Pazar", open: null, close: null },
    ] as const,
    summary: "Hafta içi 09:00 – 19:00 · Cumartesi 09:00 – 17:00",
    note: "Pazar günleri kapalıyız. Acil durumlar için telefonla ulaşabilirsiniz.",
  },

  social: {
    instagram: "https://www.instagram.com/meva.dis/",
    facebook:
      "https://www.facebook.com/people/Meva-A%C4%9F%C4%B1z-Ve-Di%C5%9F-Sa%C4%9Fl%C4%B1%C4%9F%C4%B1-Poliklini%C4%9Fi/100088811685814/",
    website: "https://www.mevadis.com.tr",
  },

  /**
   * Sitenin canlı adresi; canonical, Open Graph, sitemap ve robots buradan üretilir.
   * Öncelik: NEXT_PUBLIC_SITE_URL → Vercel önizleme adresi → gerçek alan adı.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://www.mevadis.com.tr"),
} as const;

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
