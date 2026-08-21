import type { Metadata } from "next";
import { AppointmentForm } from "@/components/site/AppointmentForm";
import { Icon } from "@/components/site/Icons";
import { PageHero, SectionHeading } from "@/components/site/ui";
import { clinic, whatsappLink } from "@/lib/clinic";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Yalova Meva Ağız ve Diş Sağlığı Polikliniği iletişim bilgileri: Bayraktepe Mah. Şehit Ömer Faydalı Cad. No: 77/A, Merkez / Yalova. Telefon: 0226 813 33 77.",
  alternates: { canonical: "/iletisim" },
};

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  "Meva Ağız ve Diş Sağlığı Polikliniği, Bayraktepe Mah. Şehit Ömer Faydalı Cad. No:77/A Yalova",
)}&output=embed&hl=tr`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Bize ulaşın"
        description="Randevu, tedavi bilgisi ya da yol tarifi için aşağıdaki kanallardan bize ulaşabilirsiniz."
        breadcrumbs={[{ label: "İletişim" }]}
      />

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Bilgi sütunu */}
          <div className="grid content-start gap-4">
            <a
              href={clinic.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="card card-hover flex gap-4 p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                <Icon name="pin" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-brand-800">
                  Adres
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                  {clinic.address.street}
                  <br />
                  {clinic.address.postalCode} {clinic.address.district} /{" "}
                  {clinic.address.city}
                </span>
              </span>
            </a>

            <a href={clinic.phone.href} className="card card-hover flex gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                <Icon name="phone" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-brand-800">
                  Telefon
                </span>
                <span className="mt-1 block text-lg font-extrabold text-aqua-600">
                  {clinic.phone.display}
                </span>
              </span>
            </a>

            <a
              href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
              target="_blank"
              rel="noreferrer"
              className="card card-hover flex gap-4 p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                <Icon name="whatsapp" className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-bold text-brand-800">
                  WhatsApp
                </span>
                <span className="mt-1 block text-sm text-ink-500">
                  Mesaj göndererek bilgi alabilirsiniz
                </span>
              </span>
            </a>

            <a
              href={`mailto:${clinic.email}`}
              className="card card-hover flex gap-4 p-5"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                <Icon name="mail" className="size-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-bold text-brand-800">
                  E-posta
                </span>
                <span className="mt-1 block truncate text-sm text-ink-500">
                  {clinic.email}
                </span>
              </span>
            </a>

            <div className="card p-5">
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                  <Icon name="clock" className="size-5" />
                </span>
                <div className="w-full">
                  <p className="text-sm font-bold text-brand-800">
                    Çalışma saatleri
                  </p>
                  <dl className="mt-3 grid gap-2 text-sm">
                    {clinic.hours.weekly.map((day) => (
                      <div
                        key={day.day}
                        className="flex items-center justify-between gap-4 border-b border-ink-100 pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-ink-500">{day.day}</dt>
                        <dd
                          className={
                            day.open
                              ? "font-semibold text-brand-800"
                              : "font-semibold text-ink-400"
                          }
                        >
                          {day.open ? `${day.open} – ${day.close}` : "Kapalı"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="hint">{clinic.hours.note}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={clinic.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm flex-1"
              >
                <Icon name="instagram" className="size-4" />
                Instagram
              </a>
              <a
                href={clinic.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-sm flex-1"
              >
                <Icon name="facebook" className="size-4" />
                Facebook
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="card p-6 sm:p-8">
            <SectionHeading
              align="left"
              eyebrow="Randevu talebi"
              title="Formu doldurun, sizi arayalım"
            />
            <div className="mt-8">
              <AppointmentForm />
            </div>
          </div>
        </div>
      </section>

      {/* Harita */}
      <section className="pb-16 sm:pb-20">
        <div className="container-x">
          <div className="overflow-hidden rounded-xl2 ring-1 ring-ink-200 ring-inset">
            <iframe
              src={mapSrc}
              title={`${clinic.name} konumu`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[24rem] w-full border-0 sm:h-[28rem]"
            />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink-400">
              Harita Google Maps üzerinden yüklenir.
            </p>
            <a
              href={clinic.address.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              <Icon name="arrowUpRight" className="size-4" />
              Yol tarifi al
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
