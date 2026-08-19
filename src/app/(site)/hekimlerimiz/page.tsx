import type { Metadata } from "next";
import { CtaBand, DoctorCard, PageHero } from "@/components/site/ui";
import { Icon } from "@/components/site/Icons";
import { publicDoctors } from "@/lib/content";

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
          {publicDoctors.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {publicDoctors.map((doctor) => (
                <div key={doctor.slug} className="reveal">
                  <DoctorCard {...doctor} />
                </div>
              ))}
            </div>
          ) : (
            /* Hekim bilgileri girilene kadar boş kart dizmek yerine, ziyaretçiyi
               doğrudan iletişime yönlendiren sade bir bölüm gösterilir. */
            <div className="card mx-auto max-w-xl p-8 text-center">
              <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-aqua-50 text-aqua-600">
                <Icon name="users" className="size-6" />
              </span>
              <h2 className="mt-4 text-xl font-extrabold">
                Kadromuz hakkında bilgi almak için
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-500">
                Hangi hekimimizin ilgileneceğini şikâyetinize göre belirliyoruz.
                Bize ulaşın, sizi doğru hekime yönlendirelim.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title="Hekimlerimizden randevu alın"
        text="Şikâyetinizi belirtin, sizi ilgili alanda çalışan hekimimize yönlendirelim."
      />
    </>
  );
}
