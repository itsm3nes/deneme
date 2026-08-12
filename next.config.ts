import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1 npm run build` çalıştırıldığında site, sunucu gerektirmeyen
 * saf HTML/CSS/JS olarak `out/` klasörüne üretilir (bkz. README → "Statik HTML").
 *
 * Statik export'ta Server Action desteklenmediği için randevu formunun eylemi,
 * aynı imzaya sahip istemci tarafı sürümüyle değiştirilir; form WhatsApp'a
 * yönlendirir. Sunucu ile çalışan normal build bundan etkilenmez.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      // Her sayfa kendi klasöründe index.html olur; basit sunucularda yol sorunu çıkmaz.
      trailingSlash: true,
      // Görüntü optimizasyonu sunucu ister; statik sürümde kapatılır.
      images: { unoptimized: true },
      turbopack: {
        resolveAlias: {
          "@/app/(site)/randevu/actions": "./src/lib/appointment-static.ts",
        },
      },
    }
  : {};

export default nextConfig;
