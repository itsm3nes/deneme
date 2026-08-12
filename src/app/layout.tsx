import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/ui";
import { clinic } from "@/lib/clinic";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(clinic.siteUrl),
  title: {
    default: `${clinic.name} | Yalova Diş Kliniği`,
    template: `%s | ${clinic.shortName}`,
  },
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği: implant, ortodonti, zirkonyum kaplama, gülüş tasarımı, kanal tedavisi ve çocuk diş hekimliği. Randevu için 0226 813 33 77.",
  keywords: [
    "Yalova diş kliniği",
    "Yalova diş hekimi",
    "Meva diş",
    "Yalova implant",
    "Yalova ortodonti",
    "Yalova zirkonyum kaplama",
    "ağız ve diş sağlığı polikliniği",
  ],
  authors: [{ name: clinic.name }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: clinic.siteUrl,
    siteName: clinic.name,
    title: `${clinic.name} | Yalova Diş Kliniği`,
    description:
      "Yalova'da implant, ortodonti, estetik diş hekimliği ve çocuk diş hekimliği. Modern cihazlar, sterilizasyon standartları, kişiye özel tedavi planı.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${clinic.name} | Yalova Diş Kliniği`,
    description:
      "Yalova'da ağız ve diş sağlığı hizmetleri. Randevu: 0226 813 33 77",
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2f4179",
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
  ],
  sameAs: [clinic.social.instagram, clinic.social.facebook],
  medicalSpecialty: "Dentistry",
  areaServed: { "@type": "City", name: "Yalova" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
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
      </body>
    </html>
  );
}
