import type { Metadata } from "next";
import { CtaBand, PageHero, PostCard } from "@/components/site/ui";
import { posts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Ağız ve diş sağlığı rehberi: 20 yaş dişi, implant süreci, diş beyazlatma, çocuklarda ilk diş hekimi ziyareti ve diş eti sağlığı.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Ağız sağlığı rehberi"
        description="Kliniğimizde en sık karşılaştığımız soruları, tedavi süreçlerini ve bakım önerilerini yazıya döküyoruz."
        breadcrumbs={[{ label: "Blog" }]}
      />

      <section className="section">
        <div className="container-x grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <div key={post.slug} className="reveal">
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </section>

      <CtaBand
        title="Yazıda yanıtını bulamadığınız bir sorunuz mu var?"
        text="Muayene randevusu alın, durumunuzu birlikte değerlendirelim."
      />
    </>
  );
}
