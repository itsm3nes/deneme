import type { Metadata } from "next";
import { CtaBand, DoctorCard, DraftNote, PageHero } from "@/components/site/ui";
import { doctors } from "@/lib/content";

export const metadata: Metadata = {
  title: "Hekimlerimiz",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği hekim kadrosu: implant cerrahisi, ortodonti, endodonti ve çocuk diş hekimliği.",
  alternates: { canonical: "/hekimlerimiz" },
};

export default function DoctorsPage() {
  return (
    <>
      <PageHero
        eyebrow="Ekibimiz"
        title="Hekimlerimiz"
        description="Tedaviniz, ilgili alanda çalışan hekimimiz tarafından planlanır ve yürütülür. Karmaşık vakalarda hekimlerimiz süreci birlikte değerlendirir."
        breadcrumbs={[{ label: "Hekimlerimiz" }]}
      />

      <section className="section">
        <div className="container-x">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((d) => (
              <div key={d.slug} className="reveal">
                <DoctorCard {...d} />
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            <DraftNote>
              Hekim adları, unvanları, mezuniyet bilgileri ve fotoğrafları açık
              kaynaklarda bulunamadığı için uydurulmadı. Gerçek bilgiler{" "}
              <code className="rounded bg-amber-100 px-1">
                src/lib/content.ts
              </code>{" "}
              içindeki{" "}
              <code className="rounded bg-amber-100 px-1">doctors</code> dizisine
              yazıldığında bu sayfa kendiliğinden güncellenir. Hekim
              tanıtımlarında Sağlık Bakanlığı tanıtım kurallarına uyulmalıdır.
            </DraftNote>
          </div>
        </div>
      </section>

      <CtaBand
        title="Hekimlerimizden randevu alın"
        text="Şikâyetinizi belirtin, sizi ilgili alanda çalışan hekimimize yönlendirelim."
      />
    </>
  );
}
