import { iconNames } from "@/components/site/Icons";
import type { PostBlock } from "@/lib/content";

/**
 * Panelde düzenlenebilen bölümlerin tanımı.
 *
 * Formlar bu şemadan üretilir; yeni bir alan eklemek için buraya bir satır
 * eklemek yeterlidir. Sunucu tarafındaki doğrulama da aynı şemayı kullanır.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "tags"
  | "items"
  | "number"
  | "date"
  | "checkbox"
  | "body";

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  hint?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Alt nesne dizileri (ör. tedavi adımları) */
  fields?: FieldDef[];
  /** Listedeki her satırın başlığında kullanılacak alan */
  rows?: number;
};

export type SectionId =
  | "clinic"
  | "gallery"
  | "treatments"
  | "doctors"
  | "faqs"
  | "testimonials"
  | "posts"
  | "partners";

export type ListSectionId = Exclude<SectionId, "clinic" | "gallery" | "partners">;

export type SectionDef = {
  id: SectionId;
  title: string;
  description: string;
  /** Liste hâlinde düzenlenen bölümlerde her kaydın başlık alanı */
  titleKey: string;
  /** Yeni kayıt eklenebilir mi? */
  addable: boolean;
  fields: FieldDef[];
};

const iconOptions = iconNames.map((name) => ({ value: name, label: name }));

export const sections: Record<ListSectionId, SectionDef> = {
  doctors: {
    id: "doctors",
    title: "Hekimler",
    description: "Hekim kartları: ad, unvan, uzmanlık alanı ve kısa özgeçmiş.",
    titleKey: "name",
    addable: true,
    fields: [
      { key: "name", label: "Ad Soyad", type: "text", required: true },
      { key: "title", label: "Unvan", type: "text", hint: "Örn. Dt. / Uzm. Dt. / Prof. Dr." },
      { key: "field", label: "Uzmanlık alanı", type: "text", required: true },
      { key: "bio", label: "Kısa özgeçmiş", type: "textarea", rows: 3 },
      {
        key: "interests",
        label: "İlgi alanları",
        type: "tags",
        hint: "Virgülle ayırın. Kartta etiket olarak görünür.",
      },
      { key: "slug", label: "Kısa ad (URL)", type: "text", hint: "Boşluksuz, örn. dt-ayse-yilmaz" },
      {
        key: "placeholder",
        label: "Yer tutucu kart",
        type: "checkbox",
        hint: "İşaretliyken kartın altında 'yer tutucu' uyarısı görünür. Gerçek bilgiyi girince kaldırın.",
      },
    ],
  },

  faqs: {
    id: "faqs",
    title: "Sık Sorulan Sorular",
    description: "S.S.S. sayfasındaki ve ana sayfadaki sorular.",
    titleKey: "q",
    addable: true,
    fields: [
      { key: "q", label: "Soru", type: "text", required: true },
      { key: "a", label: "Yanıt", type: "textarea", rows: 4, required: true },
      {
        key: "group",
        label: "Grup",
        type: "text",
        hint: "Aynı grup adını taşıyan sorular birlikte listelenir.",
        required: true,
      },
    ],
  },

  testimonials: {
    id: "testimonials",
    title: "Hasta Yorumları",
    description:
      "Ana sayfadaki yorumlar. Gerçek yorumlar için hastadan yazılı izin alınmalıdır.",
    titleKey: "name",
    addable: true,
    fields: [
      { key: "name", label: "Ad", type: "text", required: true },
      { key: "city", label: "Şehir / ilçe", type: "text" },
      { key: "treatment", label: "Tedavi", type: "text" },
      { key: "text", label: "Yorum", type: "textarea", rows: 4, required: true },
      {
        key: "placeholder",
        label: "Örnek metin",
        type: "checkbox",
        hint: "Gerçek yorumu girince bu kutunun işaretini kaldırın.",
      },
    ],
  },

  treatments: {
    id: "treatments",
    title: "Tedaviler",
    description:
      "Tedavi sayfaları. Her kaydın kendi detay sayfası vardır: /tedaviler/kısa-ad",
    titleKey: "title",
    addable: true,
    fields: [
      { key: "title", label: "Başlık", type: "text", required: true },
      { key: "short", label: "Kısa ad", type: "text", hint: "Kartlarda ve menüde görünür.", required: true },
      {
        key: "slug",
        label: "Adres (URL)",
        type: "text",
        hint: "Boşluksuz, Türkçe karaktersiz. Örn. implant",
        required: true,
      },
      { key: "icon", label: "Simge", type: "select", options: iconOptions, required: true },
      { key: "excerpt", label: "Kart özeti", type: "textarea", rows: 2, required: true },
      { key: "intro", label: "Giriş paragrafı", type: "textarea", rows: 5, required: true },
      { key: "featured", label: "Ana sayfada öne çıkar", type: "checkbox" },
      {
        key: "suitableFor",
        label: "Kimler için uygundur?",
        type: "tags",
        hint: "Her maddeyi ayrı satıra yazın.",
      },
      {
        key: "steps",
        label: "Tedavi adımları",
        type: "items",
        fields: [
          { key: "title", label: "Adım başlığı", type: "text" },
          { key: "text", label: "Açıklama", type: "textarea", rows: 2 },
        ],
      },
      {
        key: "facts",
        label: "Özet bilgiler",
        type: "items",
        fields: [
          { key: "label", label: "Etiket", type: "text" },
          { key: "value", label: "Değer", type: "text" },
        ],
      },
      {
        key: "faq",
        label: "Bu tedaviye özel S.S.S.",
        type: "items",
        fields: [
          { key: "q", label: "Soru", type: "text" },
          { key: "a", label: "Yanıt", type: "textarea", rows: 3 },
        ],
      },
    ],
  },

  posts: {
    id: "posts",
    title: "Blog Yazıları",
    description: "Blog bölümündeki bilgilendirme yazıları.",
    titleKey: "title",
    addable: true,
    fields: [
      { key: "title", label: "Başlık", type: "text", required: true },
      {
        key: "slug",
        label: "Adres (URL)",
        type: "text",
        hint: "Boşluksuz, Türkçe karaktersiz.",
        required: true,
      },
      { key: "excerpt", label: "Özet", type: "textarea", rows: 2, required: true },
      { key: "category", label: "Kategori", type: "text", required: true },
      { key: "date", label: "Yayın tarihi", type: "date", required: true },
      { key: "readingMinutes", label: "Okuma süresi (dk)", type: "number" },
      {
        key: "body",
        label: "Yazı metni",
        type: "body",
        hint: "Satır başına ## yazarsanız ara başlık, - yazarsanız madde olur. Boş satır paragrafları ayırır.",
      },
    ],
  },
};

export const sectionList = Object.values(sections);

/* ---------- Blog gövdesi: blok ⇄ düz metin dönüşümü ---------- */

export function blocksToText(blocks: PostBlock[] = []) {
  return blocks
    .map((block) => {
      if (block.type === "h2") return `## ${block.text}`;
      if (block.type === "ul") return block.items.map((i) => `- ${i}`).join("\n");
      return block.text;
    })
    .join("\n\n");
}

export function textToBlocks(text: string): PostBlock[] {
  const blocks: PostBlock[] = [];
  let list: string[] = [];

  const flush = () => {
    if (list.length) {
      blocks.push({ type: "ul", items: list });
      list = [];
    }
  };

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line) {
      flush();
      continue;
    }
    if (line.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
    } else if (line.startsWith("- ")) {
      list.push(line.slice(2).trim());
    } else {
      flush();
      blocks.push({ type: "p", text: line });
    }
  }
  flush();
  return blocks;
}

/* ---------- Doğrulama ---------- */

/** Boş zorunlu alanları ve yinelenen adresleri yakalar. */
export function validateSection(section: SectionDef, items: Record<string, unknown>[]) {
  const errors: string[] = [];

  items.forEach((item, index) => {
    const label = String(item[section.titleKey] ?? `${index + 1}. kayıt`);
    for (const field of section.fields) {
      if (!field.required) continue;
      const value = item[field.key];
      const empty =
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0);
      if (empty) errors.push(`“${label}” kaydında “${field.label}” boş olamaz.`);
    }
  });

  const slugs = items
    .map((item) => item.slug)
    .filter((slug): slug is string => typeof slug === "string" && slug.length > 0);
  const duplicates = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  for (const slug of new Set(duplicates)) {
    errors.push(`“${slug}” adresi birden fazla kayıtta kullanılmış.`);
  }

  return errors;
}
