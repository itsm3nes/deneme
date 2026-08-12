import type { Metadata } from "next";
import { CtaBand, PageHero, TreatmentCard } from "@/components/site/ui";
import { treatments } from "@/lib/treatments";

export const metadata: Metadata = {
  title: "Tedavilerimiz",
  description:
    "İmplant, ortodonti, zirkonyum kaplama, gülüş tasarımı, kanal tedavisi, diş beyazlatma, çocuk diş hekimliği ve daha fazlası. Yalova Meva Diş Polikliniği tedavi listesi.",
  alternates: { canonical: "/tedaviler" },
};

export default function TreatmentsPage() {
  return (
    <>
      <PageHero
        eyebrow="Hizmetlerimiz"
        title="Tedavilerimiz"
        description="Koruyucu diş hekimliğinden cerrahi ve estetik uygulamalara kadar sunduğumuz tedavilerin tamamı. Her başlığın altında süreç, süre ve sık sorulan sorular yer alıyor."
        breadcrumbs={[{ label: "Tedavilerimiz" }]}
      />

      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((t) => (
            <div key={t.slug} className="reveal">
              <TreatmentCard
                slug={t.slug}
                title={t.title}
                excerpt={t.excerpt}
                icon={t.icon}
              />
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Hangi tedaviye ihtiyacınız olduğundan emin değil misiniz?"
        text="Muayene randevusu alın; ağız içi inceleme ve röntgen sonrası size uygun seçenekleri birlikte değerlendirelim."
      />
    </>
  );
}
