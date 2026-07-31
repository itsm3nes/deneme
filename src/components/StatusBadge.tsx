import type { Dictionary } from "@/i18n";
import type { GalleryStatus } from "@/lib/types";

const styles: Record<GalleryStatus, string> = {
  draft: "bg-ink-800 text-ink-300 ring-ink-700",
  sent: "bg-gold-500/12 text-gold-400 ring-gold-500/25",
  completed: "bg-emerald-500/12 text-emerald-300 ring-emerald-500/25",
};

export default function StatusBadge({
  status,
  t,
}: {
  status: GalleryStatus;
  t: Dictionary;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {t.status[status]}
    </span>
  );
}
