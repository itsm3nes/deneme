import Link from "next/link";
import { redirect } from "next/navigation";
import Brand from "@/components/Brand";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { currentPhotographer } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/i18n";
import { logoutAction } from "../(auth)/actions";

export default async function AppLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const photographer = await currentPhotographer();
  if (!photographer) redirect(`/${locale}/login`);
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-ink-850 bg-ink-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <Brand
            locale={locale}
            name={t.meta.appName}
            href={`/${locale}/dashboard`}
          />
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden text-sm text-ink-400 sm:inline">
              {photographer.studio || photographer.name}
            </span>
            <LocaleSwitcher locale={locale} />
            <form action={logoutAction}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="btn-ghost !px-3 !py-2">
                {t.nav.logout}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-ink-850 px-5 py-6 sm:px-8">
        <div className="mx-auto max-w-6xl text-xs text-ink-600">
          <Link href={`/${locale}`} className="hover:text-ink-400">
            {t.meta.appName}
          </Link>
        </div>
      </footer>
    </div>
  );
}
