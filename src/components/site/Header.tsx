"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clinic, mainNav, whatsappLink } from "@/lib/clinic";
import { Icon } from "./Icons";
import { Logo } from "./Logo";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Üst şerit */}
      <div className="hidden bg-brand-800 text-brand-100 lg:block">
        <div className="container-x flex h-10 items-center justify-between text-xs">
          <div className="flex items-center gap-6">
            <a
              className="flex items-center gap-2 transition-colors hover:text-white"
              href={clinic.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Icon name="pin" className="size-3.5" />
              {clinic.address.full}
            </a>
            <span className="flex items-center gap-2">
              <Icon name="clock" className="size-3.5" />
              {clinic.hours.summary}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              className="flex items-center gap-2 font-semibold transition-colors hover:text-white"
              href={clinic.phone.href}
            >
              <Icon name="phone" className="size-3.5" />
              {clinic.phone.display}
            </a>
            <span className="h-3 w-px bg-brand-600" />
            <a
              href={clinic.social.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="transition-colors hover:text-white"
            >
              <Icon name="instagram" className="size-4" />
            </a>
            <a
              href={clinic.social.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition-colors hover:text-white"
            >
              <Icon name="facebook" className="size-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Ana çubuk */}
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-ink-200/80 bg-white/90 shadow-soft backdrop-blur-md"
            : "border-transparent bg-white"
        }`}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href="/"
            className="text-brand-700 transition-opacity hover:opacity-80"
            aria-label={`${clinic.name} — Ana sayfa`}
          >
            <Logo />
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-[0.85rem] font-semibold whitespace-nowrap transition-colors xl:px-3.5 xl:text-[0.875rem] ${
                  isActive(item.href)
                    ? "bg-aqua-50 text-aqua-700"
                    : "text-ink-600 hover:bg-ink-50 hover:text-brand-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={clinic.phone.href}
              className="btn btn-outline btn-sm lg:hidden"
              aria-label={`Telefonla ara: ${clinic.phone.display}`}
            >
              <Icon name="phone" className="size-4" />
              Ara
            </a>
            <Link href="/randevu" className="btn btn-primary btn-sm hidden whitespace-nowrap sm:inline-flex lg:px-5 lg:py-2.5 lg:text-sm">
              <Icon name="calendar" className="size-4" />
              Randevu Al
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="rounded-full p-2 text-brand-800 transition-colors hover:bg-ink-100 lg:hidden"
              aria-expanded={open}
              aria-controls="mobil-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            >
              <Icon name={open ? "close" : "menu"} className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      <div
        id="mobil-menu"
        hidden={!open}
        className="border-b border-ink-200 bg-white lg:hidden"
      >
        <nav className="container-x flex flex-col py-3">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeMenu}
              className={`rounded-xl px-3 py-3 text-[0.95rem] font-semibold transition-colors ${
                isActive(item.href)
                  ? "bg-aqua-50 text-aqua-700"
                  : "text-ink-700 hover:bg-ink-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-2 pb-3">
            <Link href="/randevu" onClick={closeMenu} className="btn btn-primary btn-sm">
              <Icon name="calendar" className="size-4" />
              Randevu Al
            </Link>
            <a
              href={whatsappLink("Merhaba, randevu almak istiyorum.")}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              <Icon name="whatsapp" className="size-4" />
              WhatsApp
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
