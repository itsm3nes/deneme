import Link from "next/link";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Icon } from "@/components/site/Icons";
import { LogoMark } from "@/components/site/Logo";
import { clinic } from "@/lib/clinic";

/** Kök seviyede olduğu için site başlığını/alt bilgisini kendisi ekler. */
export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <section className="bg-mesh flex-1">
      <div className="container-x flex flex-col items-center py-24 text-center sm:py-32">
        <LogoMark className="h-16 w-auto text-aqua-300" />
        <p className="mt-8 font-display text-6xl font-extrabold text-brand-200">
          404
        </p>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Aradığınız sayfa bulunamadı
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-ink-500">
          Bağlantı taşınmış ya da kaldırılmış olabilir. Aşağıdaki sayfalardan
          devam edebilir veya bize doğrudan ulaşabilirsiniz.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">
            Ana sayfaya dön
          </Link>
          <Link href="/tedaviler" className="btn btn-outline">
            Tedavilerimiz
          </Link>
          <a href={clinic.phone.href} className="btn btn-outline">
            <Icon name="phone" className="size-4" />
            {clinic.phone.display}
          </a>
        </div>
      </div>
      </section>
      <Footer />
    </div>
  );
}
