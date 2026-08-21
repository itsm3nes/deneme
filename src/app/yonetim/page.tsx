import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, isPanelEnabled } from "@/lib/admin/auth";
import { sectionList } from "@/lib/admin/sections";
import { storageMode } from "@/lib/admin/storage";
import { Icon } from "@/components/site/Icons";
import { clinic } from "@/lib/clinic";
import { doctors, faqs, posts, testimonials } from "@/lib/content";
import { treatments } from "@/lib/treatments";
import { gallery } from "@/lib/gallery";

const counts: Record<string, number> = {
  doctors: doctors.length,
  faqs: faqs.length,
  testimonials: testimonials.length,
  treatments: treatments.length,
  posts: posts.length,
};

export default async function AdminHomePage() {
  if (!isPanelEnabled() || !(await isAuthenticated())) redirect("/yonetim/giris");

  const todo = [
    doctors.some((d) => d.placeholder)
      ? "Hekim kartları hâlâ yer tutucu — gerçek ad, unvan ve özgeçmişleri girin."
      : null,
    testimonials.some((t) => t.placeholder)
      ? "Hasta yorumları örnek metin — gerçek yorumlarla değiştirin ya da kaydı silin."
      : null,
    !clinic.hours.verified
      ? "Çalışma saatleri doğrulanmadı — klinikten teyit alıp güncelleyin."
      : null,
    !clinic.whatsapp.verified
      ? "WhatsApp numarası doğrulanmadı — gerçek hattı girin."
      : null,
    gallery.photos.length === 0
      ? "Klinik fotoğrafı yüklenmedi — sitede yer tutucular görünüyor."
      : null,
  ].filter(Boolean) as string[];

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Genel bakış</h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-500">
        Sitedeki metinleri buradan düzenleyebilirsiniz. Değişiklikler{" "}
        {storageMode === "github"
          ? "kaydettiğiniz anda depoya işlenir ve site birkaç dakika içinde yeniden yayınlanır."
          : "içerik dosyalarına yazılır; yayındaki siteye yansıması için siteyi yeniden yayınlamanız gerekir."}
      </p>

      {todo.length ? (
        <section className="mt-6 rounded-xl2 bg-amber-50 p-5 ring-1 ring-amber-200 ring-inset">
          <h2 className="text-sm font-bold text-amber-900">
            Yayına almadan önce tamamlanması gerekenler
          </h2>
          <ul className="mt-3 grid gap-2">
            {todo.map((item) => (
              <li key={item} className="flex gap-2.5 text-sm text-amber-900">
                <span aria-hidden="true">•</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/yonetim/klinik" className="card card-hover group flex items-start gap-4 p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
            <Icon name="pin" className="size-5" />
          </span>
          <span>
            <span className="block font-bold text-brand-800">Klinik bilgileri</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-500">
              Adres, telefon, WhatsApp, e-posta, çalışma saatleri ve sosyal medya.
            </span>
          </span>
        </Link>

        <Link href="/yonetim/galeri" className="card card-hover group flex items-start gap-4 p-5">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-sm font-extrabold text-aqua-600">
            {gallery.photos.length}
          </span>
          <span>
            <span className="block font-bold text-brand-800">Galeri</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-500">
              Klinik fotoğrafları ve öncesi/sonrası vakaları; yüklerken otomatik
              küçültülür.
            </span>
          </span>
        </Link>

        {sectionList.map((section) => (
          <Link
            key={section.id}
            href={`/yonetim/icerik/${section.id}`}
            className="card card-hover group flex items-start gap-4 p-5"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-sm font-extrabold text-aqua-600">
              {counts[section.id] ?? 0}
            </span>
            <span>
              <span className="block font-bold text-brand-800">{section.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-500">
                {section.description}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <section className="card mt-8 p-5">
        <h2 className="text-sm font-bold text-brand-800">Panelin kapsamadıkları</h2>
        <ul className="mt-3 grid gap-2 text-sm text-ink-500">
          <li>
            • <strong className="font-semibold text-ink-700">Sayfa tasarımı</strong>{" "}
            ve bölüm sıralaması kod tarafındadır.
          </li>
          <li>
            • <strong className="font-semibold text-ink-700">Randevu talepleri</strong>{" "}
            panelde listelenmez; formu e-postaya bağlamanız önerilir.
          </li>
        </ul>
      </section>
    </div>
  );
}
