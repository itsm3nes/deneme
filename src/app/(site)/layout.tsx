import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/ui";
import { clinic } from "@/lib/clinic";

/**
 * Herkese açık sayfaların iskeleti.
 *
 * Yönetim paneli (`/yonetim`) bu grubun dışında kaldığı için site başlığını,
 * alt bilgisini ve WhatsApp düğmesini almaz.
 */

const SCHEMA_DAYS: Record<string, string> = {
  Pazartesi: "Monday",
  Salı: "Tuesday",
  Çarşamba: "Wednesday",
  Perşembe: "Thursday",
  Cuma: "Friday",
  Cumartesi: "Saturday",
  Pazar: "Sunday",
};

/** Google için yapılandırılmış veri (yerel işletme / diş kliniği). */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: clinic.name,
  url: clinic.siteUrl,
  telephone: clinic.phone.intl,
  email: clinic.email,
  image: `${clinic.siteUrl}/logo.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: clinic.address.street,
    addressLocality: clinic.address.city,
    addressRegion: clinic.address.city,
    postalCode: clinic.address.postalCode,
    addressCountry: clinic.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: clinic.address.geo.lat,
    longitude: clinic.address.geo.lng,
  },
  openingHoursSpecification: clinic.hours.weekly
    .filter((day) => day.open)
    .map((day) => ({
      "@type": "OpeningHoursSpecification",
      // schema.org İngilizce gün adı bekler; künyedeki Türkçe ad çevrilir.
      dayOfWeek: SCHEMA_DAYS[day.day] ?? day.day,
      opens: day.open,
      closes: day.close,
    })),
  sameAs: [clinic.social.instagram, clinic.social.facebook],
  medicalSpecialty: "Dentistry",
  areaServed: { "@type": "City", name: clinic.address.city },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:bg-brand-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        İçeriğe geç
      </a>
      <Header />
      <main id="icerik" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFab />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
