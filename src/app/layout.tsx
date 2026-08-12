import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { clinic, isDraftDeployment } from "@/lib/clinic";
import "./globals.css";

/**
 * Kök yerleşim yalnızca belgeyi ve fontları kurar.
 * Site başlığı/alt bilgisi `(site)` grubunun yerleşimindedir; böylece yönetim
 * paneli kendi sade iskeletiyle çalışır.
 */

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
  // Taslak dağıtımlarda dizine eklenmeyi kapat (bkz. isDraftDeployment).
  robots: isDraftDeployment
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#2f4179",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
