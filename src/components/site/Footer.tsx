import Link from "next/link";
import { clinic, mainNav } from "@/lib/clinic";
import { treatments } from "@/lib/treatments";
import { Icon } from "./Icons";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-brand-900 text-brand-200">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="text-white">
            <Logo />
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-brand-300">
            Yalova&apos;da ağız ve diş sağlığı hizmetleri. Modern cihazlar,
            sterilizasyon standartları ve kişiye özel tedavi planlarıyla
            yanınızdayız.
          </p>
          <div className="mt-5 flex gap-2">
            <a
              href={clinic.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram sayfamız"
              className="rounded-full bg-brand-800 p-2.5 text-brand-200 transition-colors hover:bg-aqua-500 hover:text-white"
            >
              <Icon name="instagram" className="size-4.5" />
            </a>
            <a
              href={clinic.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook sayfamız"
              className="rounded-full bg-brand-800 p-2.5 text-brand-200 transition-colors hover:bg-aqua-500 hover:text-white"
            >
              <Icon name="facebook" className="size-4.5" />
            </a>
          </div>
        </div>

        <nav aria-labelledby="footer-sayfalar">
          <h2
            id="footer-sayfalar"
            className="text-sm font-bold tracking-wide text-white uppercase"
          >
            Sayfalar
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-300 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/anlasmali-kurumlar"
                className="text-brand-300 transition-colors hover:text-white"
              >
                Anlaşmalı Kurumlar
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-tedaviler">
          <h2
            id="footer-tedaviler"
            className="text-sm font-bold tracking-wide text-white uppercase"
          >
            Tedaviler
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {treatments.slice(0, 8).map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/tedaviler/${t.slug}`}
                  className="text-brand-300 transition-colors hover:text-white"
                >
                  {t.short}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/tedaviler"
                className="font-semibold text-aqua-300 transition-colors hover:text-white"
              >
                Tümünü gör →
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-bold tracking-wide text-white uppercase">
            İletişim
          </h2>
          <ul className="mt-4 space-y-4 text-sm">
            <li className="flex gap-3">
              <Icon name="pin" className="mt-0.5 size-4.5 shrink-0 text-aqua-400" />
              <a
                href={clinic.address.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-brand-300 transition-colors hover:text-white"
              >
                {clinic.address.street}
                <br />
                {clinic.address.district} / {clinic.address.city}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="phone" className="mt-0.5 size-4.5 shrink-0 text-aqua-400" />
              <a
                href={clinic.phone.href}
                className="font-semibold text-white transition-colors hover:text-aqua-300"
              >
                {clinic.phone.display}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="mail" className="mt-0.5 size-4.5 shrink-0 text-aqua-400" />
              <a
                href={`mailto:${clinic.email}`}
                className="break-all text-brand-300 transition-colors hover:text-white"
              >
                {clinic.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Icon name="clock" className="mt-0.5 size-4.5 shrink-0 text-aqua-400" />
              <span className="text-brand-300">{clinic.hours.summary}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-brand-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {clinic.name}. Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/kvkk" className="transition-colors hover:text-white">
              KVKK &amp; Gizlilik
            </Link>
            <Link href="/sss" className="transition-colors hover:text-white">
              Sık Sorulan Sorular
            </Link>
            <Link href="/iletisim" className="transition-colors hover:text-white">
              İletişim
            </Link>
          </div>
        </div>
        <div className="container-x pb-8">
          <p className="text-[0.7rem] leading-relaxed text-brand-500">
            Bu sitedeki içerikler yalnızca bilgilendirme amaçlıdır; hekim
            muayenesinin yerini tutmaz ve tedavi vaadi içermez. Teşhis ve tedavi
            için lütfen kliniğimize başvurun.
          </p>
        </div>
      </div>
    </footer>
  );
}
