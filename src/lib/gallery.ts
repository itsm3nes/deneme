import galleryJson from "../../content/gallery.json";

/**
 * Klinik fotoğrafları ve öncesi/sonrası vakaları.
 *
 * Görsel dosyaları `public/galeri/` altında durur; bu dosya yalnızca hangi
 * görselin nerede, hangi açıklamayla kullanılacağını tutar. İkisi de yönetim
 * panelinden (`/yonetim/galeri`) düzenlenir.
 *
 * Liste boşken sitedeki fotoğraf alanları kesikli çerçeveli yer tutucu olarak
 * görünmeyi sürdürür — yani fotoğraf yüklemeden de site tutarlı görünür.
 */

export type Photo = {
  id: string;
  /** public klasörüne göre yol: /galeri/dosya.webp */
  src: string;
  /** Görme engelli okuyucular ve arama motorları için açıklama */
  alt: string;
};

export type BeforeAfterCase = {
  id: string;
  title: string;
  note: string;
  before: string;
  after: string;
};

export type Gallery = {
  photos: Photo[];
  cases: BeforeAfterCase[];
};

export const gallery = galleryJson as Gallery;

/** Belirli sayıda fotoğraf döndürür; yetmezse eksik kalanlar `null` olur. */
export function pickPhotos(count: number, offset = 0): (Photo | null)[] {
  return Array.from(
    { length: count },
    (_, index) => gallery.photos[offset + index] ?? null,
  );
}
