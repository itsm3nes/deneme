/**
 * Meva logosu.
 *
 * ⚠️ TASLAK NOTU: Buradaki işaret, kliniğin logosuna (diş + diş fırçası +
 * gülümseme yayı) benzetilerek yeniden çizilmiş bir vektördür. Orijinal logo
 * dosyanız (SVG/PNG) elinize geçtiğinde tek yapmanız gereken:
 *   1. Dosyayı `public/logo.svg` olarak kaydedin,
 *   2. Bu bileşendeki <svg>…</svg> bloğunu
 *      `<Image src="/logo.svg" alt={clinic.name} width={..} height={..} />` ile
 *      değiştirin (koyu zeminler için `public/logo-beyaz.svg` ekleyin).
 * Bileşen `currentColor` kullandığı için şu hâliyle her zeminde renk alır.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 100"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={8.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* diş gövdesi */}
      <path d="M25 72C17 46 20 17 37 17c10 0 14 11 21 11s11-11 21-11c17 0 20 29 12 55" />
      {/* gülümseme yayı */}
      <path d="M8 74c6 12 20 19 37 19 16 0 31-6 43-18" />
      <path d="M8 74c-1-3 .5-5 3-5" strokeWidth={6} />
      {/* fırça başı */}
      <g transform="rotate(-40 92 60)">
        <rect x="76" y="52" width="34" height="16" rx="8" strokeWidth={7} />
        <path
          d="M82 52v-7M88 52v-7M94 52v-7M100 52v-7"
          strokeWidth={5}
        />
      </g>
    </svg>
  );
}

export function Logo({
  withTagline = true,
  className = "",
}: {
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-auto shrink-0 sm:h-10" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-extrabold tracking-tight sm:text-[1.7rem]">
          meva
        </span>
        {withTagline ? (
          <span className="mt-1 hidden text-[0.5rem] font-semibold tracking-[0.14em] whitespace-nowrap uppercase opacity-80 min-[380px]:block sm:text-[0.55rem]">
            Ağız ve Diş Sağlığı Polikliniği
          </span>
        ) : null}
      </span>
    </span>
  );
}
