import type { Metadata } from "next";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Icon, type IconName } from "@/components/site/Icons";
import {
  CtaBand,
  DraftNote,
  PageHero,
  PhotoSlot,
  SectionHeading,
} from "@/components/site/ui";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği'nden klinik fotoğrafları ve öncesi–sonrası vaka örnekleri.",
  alternates: { canonical: "/galeri" },
};

const clinicPhotos: { label: string; icon: IconName }[] = [
  { label: "Klinik dış cephe", icon: "pin" },
  { label: "Resepsiyon", icon: "users" },
  { label: "Bekleme alanı", icon: "heart" },
  { label: "1. muayene odası", icon: "tooth" },
  { label: "2. muayene odası", icon: "crown" },
  { label: "Röntgen odası", icon: "xray" },
  { label: "Sterilizasyon ünitesi", icon: "sterile" },
  { label: "Çocuk köşesi", icon: "child" },
  { label: "Cerrahi oda", icon: "surgery" },
];

const cases = [
  { title: "Zirkonyum kaplama", note: "Üst çene ön bölge estetik restorasyonu" },
  { title: "Diş beyazlatma", note: "Ofis tipi beyazlatma, tek seans" },
  { title: "Ortodonti", note: "Sabit tedavi ile çapraşıklığın düzeltilmesi" },
  { title: "İmplant üstü kron", note: "Tek diş eksikliğinin tamamlanması" },
];

/** Fotoğraf gelene kadar kullanılan boş panel. */
function Panel({ tone, label }: { tone: "before" | "after"; label: string }) {
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-2 ${
        tone === "before"
          ? "bg-linear-to-br from-ink-100 to-ink-200"
          : "bg-linear-to-br from-aqua-100 to-aqua-200"
      }`}
    >
      <Icon
        name="tooth"
        className={tone === "before" ? "size-10 text-ink-400" : "size-10 text-aqua-600"}
      />
      <p className="px-4 text-center text-xs font-semibold text-brand-700">
        {label}
      </p>
    </div>
  );
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Kliniğimiz ve vakalarımız"
        description="Kliniğimizden kareler ve tedavi öncesi–sonrası örnekleri. Hasta görsellerinin tamamı yazılı izinle paylaşılır."
        breadcrumbs={[{ label: "Galeri" }]}
      />

      <section className="section">
        <div className="container-x">
          <SectionHeading
            align="left"
            eyebrow="Klinikten"
            title="Klinik fotoğrafları"
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clinicPhotos.map((photo) => (
              <PhotoSlot
                key={photo.label}
                label={photo.label}
                hint="Önerilen: 1200×900 px (4:3)"
                icon={photo.icon}
                className="reveal aspect-4/3"
              />
            ))}
          </div>
          <DraftNote>
            Klinik fotoğrafları eklendiğinde bu yer tutucular{" "}
            <code className="rounded bg-amber-100 px-1">next/image</code> ile
            değiştirilmelidir. Fotoğrafları{" "}
            <code className="rounded bg-amber-100 px-1">public/galeri/</code>{" "}
            klasörüne koymanız yeterli.
          </DraftNote>
        </div>
      </section>

      <section className="section bg-ink-50/70">
        <div className="container-x">
          <SectionHeading
            align="left"
            eyebrow="Vaka örnekleri"
            title="Öncesi ve sonrası"
            description="Görselin üzerindeki sürgüyü sağa sola kaydırarak karşılaştırabilirsiniz."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {cases.map((c) => (
              <div key={c.title} className="reveal">
                <BeforeAfter
                  caption={`${c.title} — ${c.note}`}
                  before={<Panel tone="before" label={`${c.title} · öncesi`} />}
                  after={<Panel tone="after" label={`${c.title} · sonrası`} />}
                />
              </div>
            ))}
          </div>

          <DraftNote>
            Öncesi–sonrası görselleri, hastadan yazılı aydınlatılmış onam
            alınmadan yayınlanamaz. Ayrıca sağlık hizmeti tanıtımında bu
            görsellerin reklam niteliği taşımaması, karşılaştırmalı üstünlük
            iddiası içermemesi gerekir.
          </DraftNote>
        </div>
      </section>

      <CtaBand
        title="Sizin için de benzer bir plan çıkaralım"
        text="Muayene sonrası size özel tedavi seçeneklerini birlikte değerlendirelim."
      />
    </>
  );
}
