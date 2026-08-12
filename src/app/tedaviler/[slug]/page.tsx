import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Icon } from "@/components/site/Icons";
import {
  Breadcrumbs,
  FaqItem,
  PhotoSlot,
  TreatmentCard,
} from "@/components/site/ui";
import { clinic, whatsappLink } from "@/lib/clinic";
import { getTreatment, treatments } from "@/lib/treatments";

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/tedaviler/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) return { title: "Tedavi bulunamadı" };

  return {
    title: treatment.title,
    description: treatment.excerpt,
    alternates: { canonical: `/tedaviler/${treatment.slug}` },
    openGraph: {
      title: `${treatment.title} | ${clinic.shortName}`,
      description: treatment.excerpt,
    },
  };
}

export default async function TreatmentPage({
  params,
}: PageProps<"/tedaviler/[slug]">) {
  const { slug } = await params;
  const treatment = getTreatment(slug);
  if (!treatment) notFound();

  const related = treatments.filter((t) => t.slug !== treatment.slug).slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: treatment.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <section className="bg-mesh border-b border-ink-100">
        <div className="container-x py-12 sm:py-16">
          <Breadcrumbs
            items={[
              { href: "/tedaviler", label: "Tedavilerimiz" },
              { label: treatment.short },
            ]}
          />
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-xl2 bg-white text-aqua-600 shadow-soft">
              <Icon name={treatment.icon} className="size-8" />
            </span>
            <div className="max-w-2xl">
              <h1 className="text-3xl font-extrabold sm:text-4xl">
                {treatment.title}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">
                {treatment.excerpt}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/randevu" className="btn btn-primary">
                  <Icon name="calendar" className="size-4" />
                  Randevu Al
                </Link>
                <a
                  href={whatsappLink(
                    `Merhaba, ${treatment.title} hakkında bilgi almak istiyorum.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                >
                  <Icon name="whatsapp" className="size-4" />
                  Bilgi Al
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <div>
            <p className="prose-lite text-[1.05rem] leading-[1.9] text-ink-600">
              {treatment.intro}
            </p>

            <PhotoSlot
              label={`${treatment.short} — tedavi görseli`}
              hint="Önerilen: 1200×675 px · hasta izni alınmış klinik fotoğrafı"
              icon={treatment.icon}
              className="mt-8 aspect-video"
            />

            <h2 className="mt-12 text-2xl font-extrabold">
              Kimler için uygundur?
            </h2>
            <ul className="mt-5 grid gap-3">
              {treatment.suitableFor.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem] text-ink-600">
                  <Icon
                    name="check"
                    className="mt-0.5 size-5 shrink-0 text-aqua-500"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <h2 className="mt-12 text-2xl font-extrabold">Tedavi süreci</h2>
            <ol className="mt-6 grid gap-5">
              {treatment.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-aqua-50 text-sm font-extrabold text-aqua-700">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="mt-12 text-2xl font-extrabold">
              Sık sorulan sorular
            </h2>
            <div className="mt-6 grid gap-3">
              {treatment.faq.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          {/* Yan sütun */}
          <aside className="grid content-start gap-5 lg:sticky lg:top-28">
            <div className="card p-6">
              <h2 className="text-sm font-bold tracking-wide text-brand-800 uppercase">
                Özet bilgiler
              </h2>
              <dl className="mt-4 grid gap-3 text-sm">
                {treatment.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-start justify-between gap-4 border-b border-ink-100 pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="text-ink-500">{fact.label}</dt>
                    <dd className="text-right font-semibold text-brand-800">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="hint">
                Süreler hastadan hastaya değişir; kesin plan muayene sonrası
                belirlenir.
              </p>
            </div>

            <div className="card bg-brand-800 p-6 text-white ring-0">
              <h2 className="text-base font-extrabold text-white">
                Randevu talebi
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-200">
                Bu tedavi için sizi arayalım.
              </p>
              <a
                href={clinic.phone.href}
                className="btn btn-white mt-5 w-full text-sm"
              >
                <Icon name="phone" className="size-4" />
                {clinic.phone.display}
              </a>
              <Link
                href="/randevu"
                className="btn mt-2 w-full text-sm text-white ring-1 ring-brand-600 ring-inset hover:bg-brand-700"
              >
                Form ile talep oluştur
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-ink-50/70">
        <div className="container-x">
          <h2 className="text-2xl font-extrabold">Diğer tedaviler</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((t) => (
              <TreatmentCard
                key={t.slug}
                slug={t.slug}
                title={t.short}
                excerpt={t.excerpt}
                icon={t.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="card mx-auto max-w-2xl p-6 sm:p-8">
            <h2 className="text-xl font-extrabold">
              {treatment.short} için randevu alın
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">
              Formu doldurun, çalışma saatleri içinde sizi arayalım.
            </p>
            <div className="mt-6">
              <AppointmentForm variant="compact" defaultTreatment={treatment.slug} />
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
