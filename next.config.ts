import type { NextConfig } from "next";

/**
 * `STATIC_EXPORT=1 npm run build` (yani `npm run build:static`) çalıştırıldığında
 * site, sunucu gerektirmeyen saf HTML/CSS/JS olarak `out/` klasörüne üretilir.
 * Bkz. README → "Statik HTML".
 *
 * Randevu formu sunucu kullanmadığı (WhatsApp'a yönlendirdiği) için iki sürüm
 * arasında davranış farkı yoktur.
 */
const staticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = staticExport
  ? {
      output: "export",
      // Her sayfa kendi klasöründe index.html olur; basit sunucularda yol sorunu çıkmaz.
      trailingSlash: true,
      // Görüntü optimizasyonu sunucu ister; statik sürümde kapatılır.
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
