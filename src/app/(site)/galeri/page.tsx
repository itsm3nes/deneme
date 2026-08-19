import type { Metadata } from "next";
import Image from "next/image";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Icon, type IconName } from "@/components/site/Icons";
import {
  CtaBand,
  DraftNote,
  PageHero,
  PhotoSlot,
  SectionHeading,
} from "@/components/site/ui";
import { gallery } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği'nden klinik fotoğrafları ve öncesi–sonrası vaka örnekleri.",
  alternates: { canonical: "/galeri" },
};

/** Fotoğraf yüklenmemişken gösterilen yönlendirici yer tutucular. */
const suggestedPhotos: { label: string; icon: IconName }[] = [
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

const suggestedCases = [
  { title: "Zirkonyum kaplama", note: "Üst çene ön bölge estetik restorasyonu" },
  { title: "Diş beyazlatma", note: "Ofis tipi beyazlatma, tek seans" },
  { title: "Ortodonti", note: "Sabit tedavi ile çapraşıklığın düzeltilmesi" },
  { title: "İmplant üstü kron", note: "Tek diş eksikliğinin tamamlanması" },
];

/** Vaka görseli yokken kullanılan boş panel. */
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
  const { photos, cases } = gallery;

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
            {photos.length > 0
              ? photos.map((photo) => (
                  <figure
                    key={photo.id}
                    className="reveal relative aspect-4/3 overflow-hidden rounded-xl2 bg-ink-100"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </figure>
                ))
              : suggestedPhotos.map((item) => (
                  <PhotoSlot
                    key={item.label}
                    label={item.label}
                    hint="Önerilen: 1200×900 px (4:3)"
                    icon={item.icon}
                    className="reveal aspect-4/3"
                  />
                ))}
          </div>

          {photos.length === 0 ? (
            <DraftNote>
              Fotoğraflar yönetim panelinden yüklenir:{" "}
              <code className="rounded bg-amber-100 px-1">/yonetim/galeri</code>.
              Yüklenen görseller otomatik küçültülür ve bu sayfada sıralarıyla
              görünür.
            </DraftNote>
          ) : null}
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
            {cases.length > 0
              ? cases.map((item) => (
                  <div key={item.id} className="reveal">
                    <BeforeAfter
                      caption={[item.title, item.note].filter(Boolean).join(" — ")}
                      before={
                        item.before ? (
                          <Image
                            src={item.before}
                            alt={`${item.title} öncesi`}
                            fill
                            sizes="(max-width: 640px) 100vw, 480px"
                            className="object-cover"
                          />
                        ) : (
                          <Panel tone="before" label={`${item.title} · öncesi`} />
                        )
                      }
                      after={
                        item.after ? (
                          <Image
                            src={item.after}
                            alt={`${item.title} sonrası`}
                            fill
                            sizes="(max-width: 640px) 100vw, 480px"
                            className="object-cover"
                          />
                        ) : (
                          <Panel tone="after" label={`${item.title} · sonrası`} />
                        )
                      }
                    />
                  </div>
                ))
              : suggestedCases.map((c) => (
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
