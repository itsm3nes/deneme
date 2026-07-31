"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, type Locale } from "@/i18n/config";
import { setLocaleCookie } from "@/lib/cookies.client";

export default function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    setLocaleCookie(next);
    const rest = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "");
    startTransition(() => {
      router.push(`/${next}${rest || ""}`);
      router.refresh();
    });
  }

  return (
    <div
      className="inline-flex items-center rounded-full bg-ink-850 p-0.5 ring-1 ring-ink-700 ring-inset"
      data-pending={pending || undefined}
    >
      {locales.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => switchTo(code)}
          aria-current={code === locale ? "true" : undefined}
          className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
            code === locale
              ? "bg-ink-700 text-ink-50"
              : "text-ink-400 hover:text-ink-100"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
