import Link from "next/link";
import { db } from "@/lib/db";
import { requirePhotographer } from "@/lib/auth";
import { listGalleries } from "@/lib/queries";
import StatusBadge from "@/components/StatusBadge";
import { getDictionary, resolveLocale } from "@/i18n";
import type { Photo } from "@/lib/types";

function coverThumb(galleryId: string): string | null {
  const row = db
    .prepare(
      "SELECT thumb_name FROM photos WHERE gallery_id = ? ORDER BY position, created_at LIMIT 1",
    )
    .get(galleryId) as Pick<Photo, "thumb_name"> | undefined;
  return row?.thumb_name ?? null;
}

export default async function DashboardPage({
  params,
}: PageProps<"/[locale]/dashboard">) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);
  const photographer = await requirePhotographer();
  const galleries = listGalleries(photographer.id);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-ink-400">
            {t.dashboard.greeting}, {photographer.name.split(" ")[0]}
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
            {t.dashboard.title}
          </h1>
          <p className="mt-1.5 text-sm text-ink-400">{t.dashboard.subtitle}</p>
        </div>
        <Link href={`/${locale}/galleries/new`} className="btn-primary">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          {t.dashboard.createGallery}
        </Link>
      </div>

      {galleries.length === 0 ? (
        <div className="card flex flex-col items-center px-6 py-16 text-center">
          <p className="text-ink-300">{t.dashboard.empty}</p>
          <Link href={`/${locale}/galleries/new`} className="btn-primary mt-5">
            {t.dashboard.emptyCta}
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {galleries.map((gallery) => {
            const thumb = coverThumb(gallery.id);
            return (
              <li key={gallery.id}>
                <Link
                  href={`/${locale}/galleries/${gallery.id}`}
                  className="card group block overflow-hidden transition-colors hover:ring-ink-600"
                >
                  <div className="relative aspect-[3/2] bg-ink-850">
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`/media/thumb/${thumb}`}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-ink-600">
                        {t.upload.empty}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={gallery.status} t={t} />
                    </div>
                  </div>

                  <div className="p-4">
                    <h2 className="truncate font-medium text-ink-50">
                      {gallery.title}
                    </h2>
                    <p className="mt-0.5 truncate text-sm text-ink-400">
                      {gallery.client_name}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-ink-400">
                      <span>
                        <strong className="font-semibold text-ink-200">
                          {gallery.photo_count}
                        </strong>{" "}
                        {t.dashboard.statPhotos}
                      </span>
                      <span>
                        <strong className="font-semibold text-gold-400">
                          {gallery.selected_count}
                        </strong>{" "}
                        {t.dashboard.statSelected}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
