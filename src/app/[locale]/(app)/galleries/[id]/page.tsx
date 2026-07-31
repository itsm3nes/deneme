import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePhotographer } from "@/lib/auth";
import { siteOrigin } from "@/lib/origin";
import {
  getGalleryForPhotographer,
  listPhotos,
  listSelections,
} from "@/lib/queries";
import StatusBadge from "@/components/StatusBadge";
import { getDictionary, resolveLocale } from "@/i18n";
import GalleryForm from "../GalleryForm";
import PhotoUploader from "./PhotoUploader";
import PhotoManager from "./PhotoManager";
import SharePanel from "./SharePanel";
import DeleteGalleryButton from "./DeleteGalleryButton";

export default async function GalleryDetailPage({
  params,
}: PageProps<"/[locale]/galleries/[id]">) {
  const { locale: rawLocale, id } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);
  const photographer = await requirePhotographer();

  const gallery = getGalleryForPhotographer(id, photographer.id);
  if (!gallery) notFound();

  const photos = listPhotos(gallery.id);
  const selections = listSelections(gallery.id);
  const origin = await siteOrigin();
  const selectedIds = new Set(selections.map((s) => s.photo_id));

  return (
    <div className="animate-fade-up">
      <Link
        href={`/${locale}/dashboard`}
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-400 hover:text-ink-100"
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

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <StatusBadge status={gallery.status} t={t} />
            <span className="text-xs text-ink-500">
              {t.status[`${gallery.status}Hint`]}
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
            {gallery.title}
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            {gallery.client_name}
            {gallery.client_email ? ` · ${gallery.client_email}` : ""}
          </p>
        </div>

        <Link
          href={`/${locale}/galleries/${gallery.id}/selections`}
          className="btn-secondary"
        >
          {t.dashboard.viewSelections}
          <span className="rounded-full bg-gold-500/20 px-2 py-0.5 text-xs font-semibold text-gold-400">
            {selections.length}
          </span>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 flex items-baseline gap-2 text-base font-semibold text-ink-50">
              {t.upload.title}
              <span className="text-sm font-normal text-ink-500">
                {photos.length}
              </span>
            </h2>
            <PhotoUploader galleryId={gallery.id} t={t} />
          </section>

          <section>
            <PhotoManager
              photos={photos}
              locale={locale}
              t={t}
              selectedIds={selectedIds}
            />
          </section>
        </div>

        <div className="space-y-6">
          <SharePanel
            gallery={gallery}
            locale={locale}
            t={t}
            photoCount={photos.length}
            origin={origin}
          />

          <details className="card overflow-hidden">
            <summary className="cursor-pointer list-none px-5 py-4 text-base font-semibold text-ink-50 select-none marker:hidden">
              {t.gallery.settings}
            </summary>
            <div className="border-t border-ink-800 px-5 py-5">
              <GalleryForm locale={locale} t={t} gallery={gallery} />
            </div>
          </details>

          <DeleteGalleryButton
            galleryId={gallery.id}
            locale={locale}
            label={t.common.delete}
            confirmText={t.gallery.deleteConfirm}
          />
        </div>
      </div>
    </div>
  );
}
