import Link from "next/link";
import Brand, { Aperture } from "@/components/Brand";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { currentPhotographer } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/i18n";

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M10 13.5a3.5 3.5 0 0 0 5 0l3-3a3.54 3.54 0 0 0-5-5l-1.5 1.5M14 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.54 3.54 0 0 0 5 5l1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <rect
        x="6"
        y="2.5"
        width="12"
        height="19"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M10.5 18.5h3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v9a2.5 2.5 0 0 1-2.5 2.5H10l-4.6 3.6A.5.5 0 0 1 4.6 20V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 8.5h7M8.5 12h4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M12 15V3.5m0 0L8.5 7M12 3.5 15.5 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 14v4A2.5 2.5 0 0 0 7 20.5h10a2.5 2.5 0 0 0 2.5-2.5v-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);
  const photographer = await currentPhotographer();

  const features = [
    {
      icon: <LinkIcon />,
      title: t.home.feature1Title,
      body: t.home.feature1Body,
    },
    {
      icon: <PhoneIcon />,
      title: t.home.feature2Title,
      body: t.home.feature2Body,
    },
    {
      icon: <NoteIcon />,
      title: t.home.feature3Title,
      body: t.home.feature3Body,
    },
    {
      icon: <ExportIcon />,
      title: t.home.feature4Title,
      body: t.home.feature4Body,
    },
  ];

  const steps = [
    { title: t.home.step1Title, body: t.home.step1Body },
    { title: t.home.step2Title, body: t.home.step2Body },
    { title: t.home.step3Title, body: t.home.step3Body },
    { title: t.home.step4Title, body: t.home.step4Body },
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Brand locale={locale} name={t.meta.appName} />
        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <Link
            href={photographer ? `/${locale}/dashboard` : `/${locale}/login`}
            className="btn-secondary !px-4 !py-2"
          >
            {photographer ? t.nav.dashboard : t.nav.login}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden px-5 pt-14 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
          <div
            className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[120px]"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-ink-850 px-3.5 py-1.5 text-xs font-medium text-ink-300 ring-1 ring-ink-700 ring-inset">
              <Aperture className="h-3.5 w-3.5 text-gold-500" />
              {t.meta.tagline}
            </p>
            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-ink-50 sm:text-6xl">
              {t.home.heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-pretty text-ink-300 sm:text-lg">
              {t.home.heroSubtitle}
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={
                  photographer ? `/${locale}/dashboard` : `/${locale}/register`
                }
                className="btn-primary !px-7 !py-3 !text-base"
              >
                {photographer ? t.nav.dashboard : t.home.ctaPrimary}
              </Link>
              {!photographer && (
                <Link
                  href={`/${locale}/login`}
                  className="btn-secondary !px-7 !py-3 !text-base"
                >
                  {t.home.ctaSecondary}
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <div key={f.title} className="card p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 ring-1 ring-gold-500/20 ring-inset">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-ink-50">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-ink-850 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
              {t.home.howTitle}
            </h2>
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <li key={step.title}>
                  <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-sm font-semibold text-gold-400 ring-1 ring-ink-700 ring-inset">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-semibold text-ink-100">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-400">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-850 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-sm text-ink-500 sm:flex-row sm:justify-between">
          <Brand locale={locale} name={t.meta.appName} />
          <span>
            © {new Date().getFullYear()} {t.meta.appName}
          </span>
        </div>
      </footer>
    </div>
  );
}
