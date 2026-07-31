import Link from "next/link";
import type { Locale } from "@/i18n/config";

export function Aperture({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 2.75 16.5 10.5M21.1 15 12.1 15M16.6 21.1 12.1 13.4M6.9 21.2 11.4 13.5M2.9 15 11.9 15M7.4 2.9 11.9 10.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Brand({
  locale,
  name,
  href,
}: {
  locale: Locale;
  name: string;
  href?: string;
}) {
  return (
    <Link
      href={href ?? `/${locale}`}
      className="inline-flex items-center gap-2.5 text-ink-50 transition-opacity hover:opacity-80"
    >
      <Aperture className="h-6 w-6 text-gold-500" />
      <span className="text-base font-semibold tracking-tight">{name}</span>
    </Link>
  );
}
