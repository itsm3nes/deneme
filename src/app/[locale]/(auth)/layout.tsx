import Brand from "@/components/Brand";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { getDictionary, resolveLocale } from "@/i18n";

export default async function AuthLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-5 py-5 sm:px-8">
        <Brand locale={locale} name={t.meta.appName} />
        <LocaleSwitcher locale={locale} />
      </header>
      <main className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
