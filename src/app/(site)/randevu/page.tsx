import type { Metadata } from "next";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Icon } from "@/components/site/Icons";
import { PageHero } from "@/components/site/ui";
import { clinic, whatsappLink } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "Randevu Al",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği'nden online randevu talebi oluşturun ya da 0226 813 33 77 numaralı telefondan bize ulaşın.",
  alternates: { canonical: "/randevu" },
};

const notes = [
  {
    icon: "clock" as const,
    title: "Ne zaman dönüş yapılır?",
    text: "Form talepleri çalışma saatleri içinde değerlendirilir ve telefonla teyit edilir.",
  },
  {
    icon: "calendar" as const,
    title: "Randevu kesinleşti mi?",
    text: "Form gönderimi randevunuzu kesinleştirmez. Saat, arama sırasında birlikte belirlenir.",
  },
  {
    icon: "shield" as const,
    title: "Bilgileriniz",
    text: "Paylaştığınız bilgiler yalnızca randevu süreci için kullanılır, üçüncü kişilerle paylaşılmaz.",
  },
];

export default function AppointmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Randevu"
        title="Randevu talebi oluşturun"
        description="Aşağıdaki formu doldurun; çalışma saatleri içinde sizi arayarak size uygun günü ve saati birlikte belirleyelim."
        breadcrumbs={[{ label: "Randevu Al" }]}
      />

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
          <div className="card p-6 sm:p-8">
            <AppointmentForm />
          </div>

          <aside className="grid content-start gap-5">
            <div className="card bg-brand-800 p-6 text-white ring-0">
              <h2 className="text-lg font-extrabold text-white">
                Hemen ulaşmak isterseniz
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-200">
                Acil durumlarda ya da aynı gün randevu talebinde telefonla
                aramanız daha hızlı sonuç verir.
              </p>
              <a href={clinic.phone.href} className="btn btn-white mt-5 w-full">
                <Icon name="phone" className="size-4" />
                {clinic.phone.display}
              </a>
              <a
                href={whatsappLink("Merhaba, randevu almak istiyorum.")}
                target="_blank"
                rel="noreferrer"
                className="btn mt-2 w-full text-white ring-1 ring-brand-600 ring-inset hover:bg-brand-700"
              >
                <Icon name="whatsapp" className="size-4" />
                WhatsApp&apos;tan yazın
              </a>
            </div>

            {notes.map((note) => (
              <div key={note.title} className="card flex gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                  <Icon name={note.icon} className="size-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-brand-800">
                    {note.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-500">
                    {note.text}
                  </p>
                </div>
              </div>
            ))}

            <div className="card p-5">
              <h3 className="text-sm font-bold text-brand-800">
                İlk muayeneye gelirken
              </h3>
              <ul className="mt-3 grid gap-2 text-sm text-ink-500">
                {[
                  "Kimlik belgeniz",
                  "Varsa önceki röntgenleriniz",
                  "Düzenli kullandığınız ilaçların listesi",
                  "Bilinen alerjileriniz ve sistemik hastalıklarınız",
                ].map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <Icon
                      name="check"
                      className="mt-0.5 size-4 shrink-0 text-aqua-500"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
