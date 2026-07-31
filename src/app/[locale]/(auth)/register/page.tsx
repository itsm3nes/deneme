import { redirect } from "next/navigation";
import { currentPhotographer } from "@/lib/auth";
import { getDictionary, resolveLocale } from "@/i18n";
import AuthForm from "../AuthForm";

export default async function RegisterPage({
  params,
}: PageProps<"/[locale]/register">) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);
  if (await currentPhotographer()) redirect(`/${locale}/dashboard`);
  const t = getDictionary(locale);

  return (
    <div className="animate-fade-up">
      <h1 className="text-2xl font-semibold tracking-tight text-ink-50">
        {t.auth.registerTitle}
      </h1>
      <p className="mt-1.5 mb-7 text-sm text-ink-400">
        {t.auth.registerSubtitle}
      </p>
      <AuthForm mode="register" locale={locale} t={t} />
    </div>
  );
}
