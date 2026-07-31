import Link from "next/link";
import { getDictionary, resolveLocale } from "@/i18n";
import GalleryForm from "../GalleryForm";

export default async function NewGalleryPage({
  params,
}: PageProps<"/[locale]/galleries/new">) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <Link
        href={`/${locale}/dashboard`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            d="M15 5l-7 7 7 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t.nav.dashboard}
      </Link>

      <h1 className="text-2xl font-semibold tracking-tight text-ink-50">
        {t.gallery.createTitle}
      </h1>
      <p className="mt-1.5 mb-8 text-sm text-ink-400">
        {t.gallery.createSubtitle}
      </p>

      <GalleryForm locale={locale} t={t} />
    </div>
  );
}
