import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/site/Icons";
import {
  CtaBand,
  DraftNote,
  PageHero,
  SitePhoto,
  SectionHeading,
} from "@/components/site/ui";
import { clinic } from "@/lib/clinic";
import { partners } from "@/lib/content";
import { pickPhotos } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği; modern cihazlar, sterilizasyon standartları ve alanında çalışan hekim kadrosuyla ağız ve diş sağlığı hizmeti sunar.",
  alternates: { canonical: "/hakkimizda" },
};

const values = [
  {
    icon: "shield" as const,
    title: "Şeffaflık",
    text: "Tedavi seçenekleri, süreleri ve olası riskler işlem öncesinde açıkça anlatılır. Onayınız olmadan hiçbir işleme başlanmaz.",
  },
  {
    icon: "sterile" as const,
    title: "Hijyen",
    text: "Sterilizasyon zinciri her adımda takip edilir; tek kullanımlık malzemeler hasta bazında yenilenir.",
  },
  {
    icon: "heart" as const,
    title: "Hasta konforu",
    text: "Kaygılı hastalar için işlem adım adım anlatılır, gerektiğinde seanslar bölünerek planlanır.",
  },
  {
    icon: "users" as const,
    title: "Ekip çalışması",
    text: "Karmaşık vakalar farklı alanlarda çalışan hekimlerimiz tarafından birlikte değerlendirilir.",
  },
];

export default function AboutPage() {
  const [photo1, photo2] = pickPhotos(2);

  return (
    <>
      <PageHero
        eyebrow="Hakkımızda"
        title="Yalova'da ağız ve diş sağlığında güvenilir adres"
        description="Meva Ağız ve Diş Sağlığı Polikliniği; koruyucu diş hekimliğinden implant ve estetik uygulamalara kadar geniş bir hizmet yelpazesini tek çatı altında sunar."
        breadcrumbs={[{ label: "Hakkımızda" }]}
      />

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div className="prose-lite">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Kliniğimiz</h2>
            <p className="mt-5">
              Meva Ağız ve Diş Sağlığı Polikliniği, Yalova Bayraktepe&apos;de
              hizmet veren özel bir ağız ve diş sağlığı kuruluşudur. Amacımız,
              hastalarımızın tedavi sürecinde ne olacağını bilerek ilerlemesini
              sağlamak; teşhisten kontrol randevusuna kadar her adımı anlaşılır
              biçimde planlamaktır.
            </p>
            <p>
              Kliniğimizde ağız, diş ve çene cerrahisinden ortodontiye,
              endodontiden çocuk diş hekimliğine kadar farklı alanlardaki
              tedaviler yürütülmektedir. Dijital görüntüleme sistemleri, tedavi
              planlamasını daha net ve düşük radyasyon dozuyla yapmamıza olanak
              tanır.
            </p>
            <p>
              Ağız sağlığının genel sağlığın bir parçası olduğuna inanıyoruz. Bu
              nedenle tedavi kadar koruyucu uygulamalara ve düzenli kontrollere
              de önem veriyoruz.
            </p>
            <DraftNote>
              Kuruluş yılı, klinik büyüklüğü, ünit sayısı ve kadro bilgileri
              açık kaynaklarda doğrulanamadığı için bu metne eklenmedi.
              Klinikten alınacak bilgilerle bu bölüm zenginleştirilmelidir.
            </DraftNote>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <SitePhoto
              photo={photo1}
              label="Klinik dış cephe"
              hint="Önerilen: 800×1000 px"
              icon="pin"
              className="aspect-4/5 sm:mt-10"
            />
            <SitePhoto
              photo={photo2}
              label="Bekleme alanı"
              hint="Önerilen: 800×1000 px"
              icon="users"
              className="aspect-4/5"
            />
          </div>
        </div>
      </section>

      <section className="section bg-ink-50/70">
        <div className="container-x">
          <SectionHeading
            eyebrow="Değerlerimiz"
            title="Çalışma prensiplerimiz"
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="reveal card p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                  <Icon name={v.icon} className="size-5.5" />
                </span>
                <h3 className="mt-4 text-base font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Sterilizasyon"
              title="Her randevuda aynı standart"
              description="Enfeksiyon kontrolü, kliniğimizde tartışmaya açık olmayan bir konudur."
            />
            <ol className="mt-8 grid gap-4">
              {[
                "Kullanılan aletler işlem sonrası ön dezenfeksiyona alınır.",
                "Ultrasonik banyoda mekanik temizlik yapılır.",
                "Paketlenen aletler otoklavda basınçlı buharla steril edilir.",
                "Steril paketler tarih etiketiyle saklanır, randevuda hasta önünde açılır.",
                "Ünit yüzeyleri ve el aletleri her hasta sonrası dezenfekte edilir.",
              ].map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-extrabold text-white">
                    {index + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-ink-600">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="Anlaşmalı kurumlar"
              title="Kurum protokolleri"
              description="Belirli kurumların üyeleri ve çalışanları için indirim protokollerimiz bulunmaktadır."
            />
            <ul className="mt-8 grid gap-4">
              {partners.items.map((p) => (
                <li key={p.name} className="card p-5">
                  <h3 className="text-base font-bold">{p.name}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {p.note}
                  </p>
                  <p className="mt-2 text-xs text-ink-400">Kaynak: {p.source}</p>
                </li>
              ))}
            </ul>
            <DraftNote>
              Anlaşmalı kurum listesi güncel olmayabilir; klinikten alınacak
              güncel listeyle{" "}
              <code className="rounded bg-amber-100 px-1">
                src/lib/content.ts
              </code>{" "}
              içindeki <code className="rounded bg-amber-100 px-1">partners</code>{" "}
              bölümü güncellenmelidir.
            </DraftNote>
            <Link
              href="/anlasmali-kurumlar"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-600 hover:text-aqua-700"
            >
              Ayrıntılı bilgi
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-brand-800">
        <div className="container-x grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: "pin" as const,
              title: "Konum",
              text: `${clinic.address.street}, ${clinic.address.district} / ${clinic.address.city}`,
            },
            {
              icon: "clock" as const,
              title: "Çalışma saatleri",
              text: clinic.hours.summary,
            },
            {
              icon: "phone" as const,
              title: "Telefon",
              text: clinic.phone.display,
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-aqua-300">
                <Icon name={item.icon} className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-brand-300">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
