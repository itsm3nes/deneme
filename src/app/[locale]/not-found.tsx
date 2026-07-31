import Link from "next/link";
import { cookies } from "next/headers";
import { Aperture } from "@/components/Brand";
import { getDictionary, resolveLocale } from "@/i18n";

export default async function NotFound() {
  const locale = resolveLocale((await cookies()).get("NEXT_LOCALE")?.value);
  const t = getDictionary(locale);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-5 text-center">
      <Aperture className="mb-5 h-9 w-9 text-ink-700" />
      <h1 className="text-xl font-semibold text-ink-50">{t.errors.notFound}</h1>
      <Link href={`/${locale}`} className="btn-secondary mt-6">
        {t.meta.appName}
      </Link>
    </div>
  );
}
