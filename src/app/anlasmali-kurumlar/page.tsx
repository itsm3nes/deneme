import type { Metadata } from "next";
import { Icon } from "@/components/site/Icons";
import { CtaBand, DraftNote, PageHero } from "@/components/site/ui";
import { partners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Anlaşmalı Kurumlar",
  description:
    "Meva Ağız ve Diş Sağlığı Polikliniği'nin kurum protokolleri ve indirim anlaşmaları hakkında bilgi.",
  alternates: { canonical: "/anlasmali-kurumlar" },
};

export default function PartnersPage() {
  return (
    <>
      <PageHero
        eyebrow="Kurumsal"
        title="Anlaşmalı kurumlar"
        description="Belirli kurumların üyeleri, çalışanları ve birinci derece yakınları için indirim protokollerimiz bulunmaktadır."
        breadcrumbs={[{ label: "Anlaşmalı Kurumlar" }]}
      />

      <section className="section">
        <div className="container-x max-w-3xl">
          <ul className="grid gap-5">
            {partners.items.map((p) => (
              <li key={p.name} className="card flex gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-aqua-50 text-aqua-600">
                  <Icon name="shield" className="size-5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold">{p.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {p.note}
                  </p>
                  <p className="mt-3 text-xs text-ink-400">Kaynak: {p.source}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="card mt-8 p-6">
            <h2 className="text-base font-bold">Nasıl yararlanılır?</h2>
            <ol className="mt-4 grid gap-3 text-sm text-ink-600">
              {[
                "Randevu alırken anlaşmalı kurum çalışanı/üyesi olduğunuzu belirtin.",
                "Muayeneye gelirken kurum kimliğinizi ya da üyelik belgenizi yanınızda getirin.",
                "Tedavi planı çıkarıldıktan sonra protokol kapsamındaki indirim uygulanır.",
              ].map((item, index) => (
                <li key={item} className="flex gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[0.7rem] font-extrabold text-white">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <DraftNote>
            Bu sayfadaki liste basına yansımış tek bir protokole dayanmaktadır ve
            güncel olmayabilir. Güncel anlaşmalı kurum listesini klinikten alıp{" "}
            <code className="rounded bg-amber-100 px-1">src/lib/content.ts</code>{" "}
            dosyasındaki{" "}
            <code className="rounded bg-amber-100 px-1">partners</code> bölümüne
            işleyin. İndirim oranları ve fiyat bilgisi sitede yayımlanmamalıdır.
          </DraftNote>
        </div>
      </section>

      <CtaBand
        title="Kurumunuz için protokol oluşturalım"
        text="Kurumsal anlaşma talepleriniz için bize telefonla ulaşabilirsiniz."
      />
    </>
  );
}
