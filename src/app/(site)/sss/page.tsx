import type { Metadata } from "next";
import { CtaBand, FaqItem, PageHero } from "@/components/site/ui";
import { faqs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sık Sorulan Sorular",
  description:
    "Randevu, tedavi süreci, sterilizasyon, hamilelikte diş tedavisi ve ödeme hakkında en çok sorulan soruların yanıtları.",
  alternates: { canonical: "/sss" },
};

export default function FaqPage() {
  const groups = [...new Set(faqs.map((f) => f.group))];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <PageHero
        eyebrow="S.S.S."
        title="Sık sorulan sorular"
        description="Hastalarımızın en çok merak ettiği konuları bir araya getirdik. Aradığınız yanıtı bulamazsanız bize telefonla ya da WhatsApp'tan ulaşabilirsiniz."
        breadcrumbs={[{ label: "Sık Sorulan Sorular" }]}
      />

      <section className="section">
        <div className="container-x max-w-3xl">
          {groups.map((group) => (
            <div key={group} className="mb-12 last:mb-0">
              <h2 className="text-xl font-extrabold">{group}</h2>
              <div className="mt-5 grid gap-3">
                {faqs
                  .filter((f) => f.group === group)
                  .map((f) => (
                    <FaqItem key={f.q} q={f.q} a={f.a} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Sorunuzun yanıtını bulamadınız mı?"
        text="Bize yazın ya da telefonla ulaşın; kliniğimizden ayrıntılı bilgi alabilirsiniz."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
