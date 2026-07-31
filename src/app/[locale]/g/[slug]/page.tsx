import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import {
  getGalleryBySlug,
  listPhotos,
  listSelectedPhotos,
  listSelections,
} from "@/lib/queries";
import { hasGalleryAccess } from "@/lib/gallery-access";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Aperture } from "@/components/Brand";
import { getDictionary, resolveLocale, interpolate, type Locale } from "@/i18n";
import type { Photographer } from "@/lib/types";
import UnlockForm from "./UnlockForm";
import ClientGallery from "./ClientGallery";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/g/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const gallery = getGalleryBySlug(slug);
  return {
    title: gallery?.title ?? "",
    robots: { index: false, follow: false },
  };
}

function Shell({
  children,
  locale,
  title,
  subtitle,
  centered,
}: {
  children: React.ReactNode;
  locale: Locale;
  title?: string;
  subtitle?: string;
  centered?: boolean;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <Aperture className="h-5 w-5 shrink-0 text-gold-500" />
          <div className="min-w-0">
            {title && (
              <p className="truncate text-sm font-semibold text-ink-50">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="truncate text-xs text-ink-400">{subtitle}</p>
            )}
          </div>
        </div>
        <LocaleSwitcher locale={locale} />
      </header>
      <main
        className={
          centered
            ? "flex flex-1 items-center justify-center px-5 py-10"
            : "flex-1"
        }
      >
        {children}
      </main>
    </div>
  );
}

export default async function ClientGalleryPage({
  params,
}: PageProps<"/[locale]/g/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);

  const gallery = getGalleryBySlug(slug);
  if (!gallery) notFound();

  const photographer = db
    .prepare("SELECT * FROM photographers WHERE id = ?")
    .get(gallery.photographer_id) as Photographer | undefined;
  const studio = photographer?.studio || photographer?.name || "";

  if (gallery.status === "draft") {
    return (
      <Shell locale={locale} title={gallery.title} subtitle={studio} centered>
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-ink-50">
            {t.client.notReadyTitle}
          </h1>
          <p className="mt-2 text-sm text-ink-400">{t.client.notReadyBody}</p>
        </div>
      </Shell>
    );
  }

  if (!(await hasGalleryAccess(slug, gallery.access_code))) {
    return (
      <Shell locale={locale} subtitle={studio} centered>
        <UnlockForm slug={slug} locale={locale} t={t} title={gallery.title} />
      </Shell>
    );
  }

  if (gallery.status === "completed") {
    const picks = listSelectedPhotos(gallery.id);
    const submitted = gallery.submitted_at
      ? new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
          new Date(gallery.submitted_at),
        )
      : "";

    return (
      <Shell locale={locale} title={gallery.title} subtitle={studio}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-8 rounded-xl2 bg-emerald-500/8 px-5 py-6 text-center ring-1 ring-emerald-500/20 ring-inset">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M5 12.5l4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-ink-50">
              {t.client.submitted}
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-300">
              {t.client.submittedBody}
            </p>
            {submitted && (
              <p className="mt-3 text-xs text-ink-500">
                {interpolate(t.client.lockedBody, { date: submitted })}
              </p>
            )}
          </div>

          <h2 className="mb-4 text-sm font-semibold text-ink-200">
            {t.client.yourSelection}{" "}
            <span className="font-normal text-ink-500">({picks.length})</span>
          </h2>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {picks.map((photo) => (
              <li key={photo.id}>
                <div className="overflow-hidden rounded-lg bg-ink-850">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/media/thumb/${photo.thumb_name}`}
                    alt={photo.original_name}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </div>
                {photo.note && (
                  <p className="mt-1.5 rounded-lg bg-ink-900 px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap text-ink-300">
                    {photo.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Shell>
    );
  }

  const photos = listPhotos(gallery.id);
  const selections = listSelections(gallery.id);

  return (
    <Shell locale={locale} title={gallery.title} subtitle={studio}>
      {gallery.description && (
        <div className="mx-auto max-w-6xl px-4 pt-1 pb-4 sm:px-6">
          <div className="rounded-xl bg-ink-900 px-4 py-3 ring-1 ring-ink-800 ring-inset">
            <p className="mb-1 text-xs font-medium text-gold-400">
              {t.client.photographerNote}
            </p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap text-ink-200">
              {gallery.description}
            </p>
          </div>
        </div>
      )}

      <ClientGallery
        gallery={gallery}
        photos={photos}
        initialSelections={selections}
        locale={locale}
        t={t}
      />
    </Shell>
  );
}
