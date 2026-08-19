import type { Metadata } from "next";
import Image from "next/image";
import { BeforeAfter } from "@/components/site/BeforeAfter";
import { Icon } from "@/components/site/Icons";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/ui";
import { gallery } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Galeri",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği'nden klinik fotoğrafları ve öncesi–sonrası vaka örnekleri.",
  alternates: { canonical: "/galeri" },
};

export default function GalleryPage() {
  const { photos, cases } = gallery;
  const withImages = cases.filter((item) => item.before && item.after);
  const isEmpty = photos.length === 0 && withImages.length === 0;

  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Kliniğimiz ve vakalarımız"
        description="Kliniğimizden kareler ve tedavi öncesi–sonrası örnekleri. Hasta görsellerinin tamamı yazılı izinle paylaşılır."
        breadcrumbs={[{ label: "Galeri" }]}
      />

      {photos.length > 0 ? (
        <section className="section">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="Klinikten"
              title="Klinik fotoğrafları"
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
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
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {withImages.length > 0 ? (
        <section className="section bg-ink-50/70">
          <div className="container-x">
            <SectionHeading
              align="left"
              eyebrow="Vaka örnekleri"
              title="Öncesi ve sonrası"
              description="Görselin üzerindeki sürgüyü sağa sola kaydırarak karşılaştırabilirsiniz."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {withImages.map((item) => (
                <div key={item.id} className="reveal">
                  <BeforeAfter
                    caption={[item.title, item.note].filter(Boolean).join(" — ")}
                    before={
                      <Image
                        src={item.before}
                        alt={`${item.title} öncesi`}
                        fill
                        sizes="(max-width: 640px) 100vw, 480px"
                        className="object-cover"
                      />
                    }
                    after={
                      <Image
                        src={item.after}
                        alt={`${item.title} sonrası`}
                        fill
                        sizes="(max-width: 640px) 100vw, 480px"
                        className="object-cover"
                      />
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Hiç görsel yokken boş bir sayfa yerine kısa bir yönlendirme gösterilir. */}
      {isEmpty ? (
        <section className="section">
          <div className="container-x">
            <div className="card mx-auto max-w-xl p-8 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-aqua-50 text-aqua-600">
                <Icon name="heart" className="size-6" />
              </span>
              <h2 className="mt-4 text-xl font-extrabold">
                Fotoğraflarımızı yakında paylaşacağız
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Kliniğimizi yerinde görmek isterseniz sizi bekleriz; dilerseniz
                önce telefonla bilgi alabilirsiniz.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand
        title="Sizin için de benzer bir plan çıkaralım"
        text="Muayene sonrası size özel tedavi seçeneklerini birlikte değerlendirelim."
      />
    </>
  );
}
