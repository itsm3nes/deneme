import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "./actions";
import { isAuthenticated, isPanelEnabled } from "@/lib/admin/auth";
import { sectionList } from "@/lib/admin/sections";
import { storageMode } from "@/lib/admin/storage";
import { LogoMark } from "@/components/site/Logo";

export const metadata: Metadata = {
  title: "Yönetim Paneli",
  robots: { index: false, follow: false, nocache: true },
};

/** Panel her istekte oturum kontrolü yapar; önbelleğe alınmamalı. */
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = isPanelEnabled() && (await isAuthenticated());

  return (
    <div className="min-h-dvh bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5">
          <Link href="/yonetim" className="flex items-center gap-2.5 text-brand-700">
            <LogoMark className="h-8 w-auto" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-extrabold">meva</span>
              <span className="mt-0.5 text-[0.6rem] font-bold tracking-widest text-ink-400 uppercase">
                Yönetim
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="btn btn-outline btn-sm">
              Siteyi gör
            </Link>
            {authed ? (
              <form action={logout}>
                <button type="submit" className="btn btn-ghost btn-sm">
                  Çıkış
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-8 lg:flex-row lg:gap-10">
        {authed ? (
          <nav className="lg:w-52 lg:shrink-0">
            <ul className="flex flex-wrap gap-1 lg:flex-col">
              <li>
                <Link
                  href="/yonetim"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 hover:bg-white hover:text-brand-800"
                >
                  Genel bakış
                </Link>
              </li>
              <li>
                <Link
                  href="/yonetim/klinik"
                  className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 hover:bg-white hover:text-brand-800"
                >
                  Klinik bilgileri
                </Link>
              </li>
              {sectionList.map((section) => (
                <li key={section.id}>
                  <Link
                    href={`/yonetim/icerik/${section.id}`}
                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink-600 hover:bg-white hover:text-brand-800"
                  >
                    {section.title}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-6 rounded-lg bg-white px-3 py-2.5 text-[0.7rem] leading-relaxed text-ink-500 ring-1 ring-ink-200 ring-inset">
              Kayıt yeri:{" "}
              <strong className="font-bold text-brand-800">
                {storageMode === "github" ? "GitHub deposu" : "yerel dosyalar"}
              </strong>
              {storageMode === "github"
                ? " — kaydettiğinizde site yeniden yayınlanır."
                : " — yayındaki siteye yansıması için yeniden yayınlamanız gerekir."}
            </p>
          </nav>
        ) : null}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
