import Link from "next/link";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Icon } from "@/components/site/Icons";
import { LogoMark } from "@/components/site/Logo";
import {
  CtaBand,
  DoctorCard,
  FaqItem,
  PhotoSlot,
  PostCard,
  SectionHeading,
  TreatmentCard,
} from "@/components/site/ui";
import { clinic, whatsappLink } from "@/lib/clinic";
import { doctors, faqs, posts, testimonials } from "@/lib/content";
import { treatments } from "@/lib/treatments";

const whyUs = [
  {
    icon: "sterile" as const,
    title: "Sterilizasyon önceliği",
    text: "Aletler ultrasonik temizlik sonrası otoklavda steril edilir; tek kullanımlık malzemeler her hasta için yenilenir.",
  },
  {
    icon: "xray" as const,
    title: "Dijital görüntüleme",
    text: "Dijital röntgen sistemleriyle daha düşük dozda, anında değerlendirilebilen net görüntüler.",
  },
  {
    icon: "users" as const,
    title: "Farklı alanlarda hekim kadrosu",
    text: "İmplant, ortodonti, endodonti ve pedodonti gibi alanlarda tedaviniz aynı çatı altında planlanır.",
  },
  {
    icon: "heart" as const,
    title: "Kaygıya duyarlı yaklaşım",
    text: "Diş hekimi korkusu olan hastalar için işlem adım adım anlatılır, seanslar ihtiyaca göre kısa tutulur.",
  },
];

const steps = [
  {
    title: "Randevu",
    text: "Telefon, WhatsApp ya da form üzerinden talebinizi iletirsiniz; size uygun saati birlikte belirleriz.",
  },
  {
    title: "Muayene ve görüntüleme",
    text: "Ağız içi muayene ve gerekli röntgenlerle mevcut durum ayrıntılı olarak değerlendirilir.",
  },
  {
    title: "Tedavi planı",
    text: "Seçenekler, seans sayısı ve takvim anlatılır; kararı birlikte veririz.",
  },
  {
    title: "Tedavi ve kontrol",
    text: "Planlanan tedavi uygulanır, sonrasında düzenli kontrollerle sonuç takip edilir.",
  },
];

export default function HomePage() {
  const homeFaqs = faqs.slice(0, 6);
  // Saatler künyeden okunur; panelden değiştirilince burası da güncellenir.
  const weekday = clinic.hours.weekly[0];
  const weekdayHours = `${weekday.open} – ${weekday.close}`;
  const openDays = clinic.hours.weekly.filter((day) => day.open).length;

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="bg-mesh relative overflow-hidden">
        <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
          <div className="animate-fade-up">
            <span className="chip">
              <Icon name="pin" className="size-3.5" />
              Yalova · Bayraktepe
            </span>
            <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold sm:text-5xl lg:text-[3.4rem]">
              Yalova&apos;da{" "}
              <span className="text-gradient">güvenle gülümseyin</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-500 sm:text-lg">
              Meva Ağız ve Diş Sağlığı Polikliniği&apos;nde implanttan
              ortodontiye, estetik diş hekimliğinden çocuk tedavilerine kadar
              tüm ihtiyaçlarınız tek çatı altında karşılanır.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/randevu" className="btn btn-primary">
                <Icon name="calendar" className="size-4" />
                Randevu Al
              </Link>
              <a href={clinic.phone.href} className="btn btn-outline">
                <Icon name="phone" className="size-4" />
                {clinic.phone.display}
              </a>
            </div>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-ink-200 pt-6">
              {[
                { icon: "tooth" as const, value: "16", label: "tedavi başlığı" },
                {
                  icon: "clock" as const,
                  value: `${openDays} gün`,
                  label: "haftalık hizmet",
                },
                { icon: "shield" as const, value: "Steril", label: "her randevuda" },
              ].map((item) => (
                <div key={item.label}>
                  <dt className="sr-only">{item.label}</dt>
                  <dd>
                    <Icon name={item.icon} className="size-5 text-aqua-500" />
                    <p className="mt-2 text-xl font-extrabold text-brand-800">
                      {item.value}
                    </p>
                    <p className="text-xs text-ink-500">{item.label}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Görsel blok */}
          <div className="relative animate-fade-up lg:pl-8">
            <div className="relative mx-auto aspect-square w-full max-w-md">
              <div
                className="absolute inset-0 rounded-full bg-linear-to-br from-aqua-200/70 via-aqua-50 to-white shadow-lift"
                aria-hidden="true"
              />
              <div className="absolute inset-8 flex items-center justify-center rounded-full bg-white/70 backdrop-blur-sm">
                <LogoMark className="w-1/2 text-brand-700" />
              </div>

              <div className="card absolute -top-2 -left-2 flex items-center gap-3 p-3 sm:-left-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-aqua-50 text-aqua-600">
                  <Icon name="clock" className="size-4.5" />
                </span>
                <div className="text-xs">
                  <p className="font-bold text-brand-800">Pzt – Cmt</p>
                  <p className="text-ink-500">{weekdayHours}</p>
                </div>
              </div>

              <div className="card absolute -right-2 bottom-8 flex items-center gap-3 p-3 sm:-right-4">
                <span className="flex size-9 items-center justify-center rounded-full bg-aqua-50 text-aqua-600">
                  <Icon name="implant" className="size-4.5" />
                </span>
                <div className="text-xs">
                  <p className="font-bold text-brand-800">İmplant</p>
                  <p className="text-ink-500">3B planlama</p>
                </div>
              </div>

              <div className="card absolute -bottom-3 left-2 flex items-center gap-3 p-3 sm:left-8">
                <span className="flex size-9 items-center justify-center rounded-full bg-aqua-50 text-aqua-600">
                  <Icon name="child" className="size-4.5" />
                </span>
                <div className="text-xs">
                  <p className="font-bold text-brand-800">Çocuk dostu</p>
                  <p className="text-ink-500">Tanışma randevusu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Hızlı bilgi ---------------- */}
      <section className="relative z-10 -mt-6 pb-4">
        <div className="container-x grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "pin" as const,
              title: "Adresimiz",
              lines: [clinic.address.street, `${clinic.address.district} / ${clinic.address.city}`],
              href: clinic.address.mapsUrl,
              cta: "Haritada aç",
              external: true,
            },
            {
              icon: "phone" as const,
              title: "Telefon",
              lines: [clinic.phone.display, `Pzt–Cmt ${weekdayHours}`],
              href: clinic.phone.href,
              cta: "Hemen ara",
              external: false,
            },
            {
              icon: "whatsapp" as const,
              title: "WhatsApp",
              lines: ["Sorularınızı yazın", "Randevu talebi oluşturun"],
              href: whatsappLink("Merhaba, randevu almak istiyorum."),
              cta: "Mesaj gönder",
              external: true,
            },
          ].map((card) => (
            <a
              key={card.title}
              href={card.href}
              {...(card.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="card card-hover group flex items-start gap-4 p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white">
                <Icon name={card.icon} className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-brand-800">
                  {card.title}
                </span>
                {card.lines.map((line) => (
                  <span key={line} className="block text-xs leading-relaxed text-ink-500">
                    {line}
                  </span>
                ))}
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-aqua-600">
                  {card.cta}
                  <Icon
                    name="arrowRight"
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------------- Tedaviler ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Tedavilerimiz"
            title="Ağzınızın ihtiyacı olan her tedavi tek adreste"
            description="Koruyucu diş hekimliğinden implant ve estetik uygulamalara kadar geniş bir hizmet yelpazesi sunuyoruz."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {treatments.slice(0, 8).map((t) => (
              <div key={t.slug} className="reveal">
                <TreatmentCard
                  slug={t.slug}
                  title={t.short}
                  excerpt={t.excerpt}
                  icon={t.icon}
                />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/tedaviler" className="btn btn-navy">
              Tüm tedavileri gör
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Neden biz ---------------- */}
      <section className="section bg-ink-50/70">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Neden Meva?"
              title="Tedaviden önce güven"
              description="Kliniğe adım attığınız andan tedavi sonrası kontrollere kadar süreci şeffaf yürütüyoruz. Ne yapılacağını, neden yapılacağını ve ne kadar süreceğini önceden biliyorsunuz."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {whyUs.map((item) => (
                <div key={item.title} className="reveal">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-white text-aqua-600 shadow-soft">
                    <Icon name={item.icon} className="size-5" />
                  </span>
                  <h3 className="mt-3 text-[0.95rem] font-bold">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            <PhotoSlot
              label="Klinik girişi"
              hint="Önerilen: 800×1000 px"
              icon="pin"
              className="aspect-4/5 sm:mt-8"
            />
            <PhotoSlot
              label="Muayene odası"
              hint="Önerilen: 800×1000 px"
              icon="xray"
              className="aspect-4/5"
            />
          </div>
        </div>
      </section>

      {/* ---------------- Süreç ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Nasıl ilerliyoruz?"
            title="İlk aramadan son kontrole dört adım"
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="reveal relative">
                <span className="font-display text-5xl font-extrabold text-aqua-100">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 text-base font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Hekimler ---------------- */}
      <section className="section bg-ink-50/70">
        <div className="container-x">
          <SectionHeading
            eyebrow="Hekim kadromuz"
            title="Tedavinizi kim üstleniyor?"
            description="Her tedavi, ilgili alanda çalışan hekimimiz tarafından planlanır ve yürütülür."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((d) => (
              <div key={d.slug} className="reveal">
                <DoctorCard {...d} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Galeri ---------------- */}
      <section className="section">
        <div className="container-x">
          <SectionHeading
            eyebrow="Galeri"
            title="Kliniğimizden kareler"
            description="Bekleme alanı, muayene odaları ve sterilizasyon ünitemizden fotoğraflar."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Bekleme alanı", icon: "users" as const },
              { label: "Ünit ve muayene odası", icon: "tooth" as const },
              { label: "Sterilizasyon ünitesi", icon: "sterile" as const },
              { label: "Röntgen odası", icon: "xray" as const },
              { label: "Çocuk köşesi", icon: "child" as const },
              { label: "Klinik dış cephe", icon: "pin" as const },
            ].map((item) => (
              <PhotoSlot
                key={item.label}
                label={item.label}
                hint="Önerilen: 1200×900 px"
                icon={item.icon}
                className="aspect-4/3"
              />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/galeri" className="btn btn-outline">
              Galerinin tamamı
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- Yorumlar ---------------- */}
      <section className="section bg-brand-800">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-aqua-300">Hasta deneyimleri</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
              Hastalarımız ne söylüyor?
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t, index) => (
              <figure
                key={index}
                className="reveal rounded-xl2 bg-brand-700/60 p-6 ring-1 ring-brand-600 ring-inset"
              >
                <div className="flex gap-0.5 text-aqua-300" aria-label="5 üzerinden 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" fill="currentColor" className="size-4" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-brand-100">
                  “{t.text}”
                </blockquote>
                <figcaption className="mt-5 text-xs text-brand-300">
                  <span className="font-bold text-white">{t.name}</span> ·{" "}
                  {t.city} · {t.treatment}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-[0.7rem] leading-relaxed text-brand-400">
            Taslak notu: Yukarıdaki yorumlar örnek metinlerdir. Yayına almadan
            önce hastalardan yazılı izin alınarak gerçek yorumlarla
            değiştirilmeli ya da bu bölüm kaldırılmalıdır.
          </p>
        </div>
      </section>

      {/* ---------------- Randevu + SSS ---------------- */}
      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Sık sorulan sorular"
              title="Merak ettikleriniz"
            />
            <div className="mt-8 grid gap-3">
              {homeFaqs.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
            <Link
              href="/sss"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-600 hover:text-aqua-700"
            >
              Tüm soruları gör
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>

          <div className="card p-6 sm:p-8 lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-xl font-extrabold">Hızlı randevu talebi</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Adınızı ve telefonunuzu bırakın, sizi arayalım.
            </p>
            <div className="mt-6">
              <AppointmentForm variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Blog ---------------- */}
      <section className="section bg-ink-50/70">
        <div className="container-x">
          <SectionHeading
            eyebrow="Blog"
            title="Ağız sağlığı rehberi"
            description="Sık karşılaştığımız soruları hekimlerimizin diliyle yanıtlıyoruz."
          />
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <div key={p.slug} className="reveal">
                <PostCard {...p} />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/blog" className="btn btn-outline">
              Tüm yazılar
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
