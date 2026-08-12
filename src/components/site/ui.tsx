import Link from "next/link";
import type { ReactNode } from "react";
import { clinic, whatsappLink } from "@/lib/clinic";
import { Icon, type IconName } from "./Icons";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  as: As = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <As className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</As>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Fotoğraf yer tutucusu.
 * ⚠️ TASLAK: Klinik fotoğrafları elinize geçtiğinde bu bileşeni
 * `next/image` ile değiştirin. `label` metni önerilen içeriği anlatır.
 */
export function PhotoSlot({
  label,
  hint,
  className = "",
  icon = "tooth",
}: {
  label: string;
  hint?: string;
  className?: string;
  icon?: IconName;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-xl2 border-2 border-dashed border-aqua-200 bg-aqua-50/60 p-6 text-center ${className}`}
    >
      <Icon name={icon} className="size-8 text-aqua-400" />
      <p className="text-sm font-semibold text-brand-700">{label}</p>
      {hint ? <p className="text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Sayfa yolu" className="text-xs text-ink-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition-colors hover:text-aqua-600">
            Ana Sayfa
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-aqua-600"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-brand-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs: { href?: string; label: string }[];
}) {
  return (
    <section className="bg-mesh border-b border-ink-100">
      <div className="container-x py-12 sm:py-16">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-5 max-w-3xl">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function CtaBand({
  title = "Dişleriniz için doğru adımı bugün atın",
  text = "Muayene randevunuzu telefonla, WhatsApp'tan ya da form üzerinden oluşturabilirsiniz. Talebinizi çalışma saatleri içinde yanıtlıyoruz.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="section">
      <div className="container-x">
        <div className="reveal relative overflow-hidden rounded-xl3 bg-brand-800 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="bg-grid absolute inset-0 opacity-[0.15]" aria-hidden="true" />
          <div
            className="absolute -top-24 -right-16 size-72 rounded-full bg-aqua-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-brand-200 sm:text-base">
              {text}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/randevu" className="btn btn-primary">
                <Icon name="calendar" className="size-4" />
                Randevu Formu
              </Link>
              <a href={clinic.phone.href} className="btn btn-white">
                <Icon name="phone" className="size-4" />
                {clinic.phone.display}
              </a>
              <a
                href={whatsappLink("Merhaba, randevu almak istiyorum.")}
                target="_blank"
                rel="noreferrer"
                className="btn text-white ring-1 ring-brand-600 ring-inset hover:bg-brand-700"
              >
                <Icon name="whatsapp" className="size-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Yalnızca CSS ile çalışan açılır SSS öğesi. */
export function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group card overflow-hidden">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-brand-800 transition-colors hover:bg-aqua-50/50 [&::-webkit-details-marker]:hidden">
        <span className="text-[0.95rem]">{q}</span>
        <Icon
          name="chevronDown"
          className="size-5 shrink-0 text-aqua-500 transition-transform duration-300 group-open:rotate-180"
        />
      </summary>
      <div className="border-t border-ink-100 px-5 py-4 text-sm leading-relaxed text-ink-600">
        {a}
      </div>
    </details>
  );
}

export function WhatsAppFab() {
  return (
    <a
      href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
      target="_blank"
      rel="noreferrer"
      className="fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] py-3 pr-5 pl-4 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
      aria-label="WhatsApp ile yazın"
    >
      <Icon name="whatsapp" className="size-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}

export function TreatmentCard({
  slug,
  title,
  excerpt,
  icon,
}: {
  slug: string;
  title: string;
  excerpt: string;
  icon: IconName;
}) {
  return (
    <Link
      href={`/tedaviler/${slug}`}
      className="card card-hover group flex flex-col p-6"
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600 transition-colors group-hover:bg-aqua-500 group-hover:text-white">
        <Icon name={icon} className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-bold">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {excerpt}
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-aqua-600">
        Ayrıntılar
        <Icon
          name="arrowRight"
          className="size-4 transition-transform group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}

export function DoctorCard({
  name,
  title,
  field,
  bio,
  interests,
  placeholder,
}: {
  name: string;
  title: string;
  field: string;
  bio: string;
  interests: string[];
  placeholder?: boolean;
}) {
  return (
    <article className="card card-hover overflow-hidden">
      <div className="flex aspect-4/3 items-center justify-center bg-linear-to-br from-aqua-50 to-brand-50">
        <Icon name="users" className="size-14 text-aqua-300" />
      </div>
      <div className="p-6">
        <p className="text-xs font-bold tracking-wide text-aqua-600 uppercase">
          {field}
        </p>
        <h3 className="mt-2 text-lg font-extrabold">
          {title} {name}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{bio}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {interests.map((i) => (
            <li key={i} className="chip">
              {i}
            </li>
          ))}
        </ul>
        {placeholder ? (
          <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[0.7rem] leading-relaxed text-amber-800">
            Yer tutucu kart — hekim adı, fotoğrafı ve özgeçmişi klinikten
            alınarak doldurulacak.
          </p>
        ) : null}
      </div>
    </article>
  );
}

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  category,
  readingMinutes,
}: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readingMinutes: number;
}) {
  return (
    <article className="card card-hover group relative flex flex-col p-6">
      <div className="flex items-center gap-2 text-xs text-ink-400">
        <span className="chip">{category}</span>
        <span>{readingMinutes} dk okuma</span>
      </div>
      <h3 className="mt-4 text-lg font-bold">
        <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
          {title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
        {excerpt}
      </p>
      <p className="mt-4 text-xs text-ink-400">
        <time dateTime={date}>{formatDate(date)}</time>
      </p>
    </article>
  );
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Klinik künyesinde doğrulanmamış alanlar için görünür uyarı (yalnızca taslakta). */
export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-200 ring-inset">
      <strong className="font-bold">Taslak notu:</strong> {children}
    </p>
  );
}
