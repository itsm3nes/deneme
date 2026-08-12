import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/site/Icons";
import {
  Breadcrumbs,
  CtaBand,
  PostCard,
  formatDate,
} from "@/components/site/ui";
import { clinic } from "@/lib/clinic";
import { getPost, posts } from "@/lib/content";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Yazı bulunamadı" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: clinic.name },
    publisher: { "@type": "Organization", name: clinic.name },
    mainEntityOfPage: `${clinic.siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <section className="bg-mesh border-b border-ink-100">
        <div className="container-x max-w-3xl py-12 sm:py-16">
          <Breadcrumbs
            items={[{ href: "/blog", label: "Blog" }, { label: post.title }]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-ink-500">
            <span className="chip">{post.category}</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingMinutes} dk okuma</span>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">
            {post.excerpt}
          </p>
        </div>
      </section>

      <article className="section">
        <div className="container-x max-w-3xl">
          {post.body.map((block, index) => {
            if (block.type === "h2") {
              return (
                <h2 key={index} className="mt-10 text-2xl font-extrabold first:mt-0">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={index} className="mt-5 grid gap-3">
                  {block.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-[0.975rem] leading-relaxed text-ink-600"
                    >
                      <Icon
                        name="check"
                        className="mt-1 size-4.5 shrink-0 text-aqua-500"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p
                key={index}
                className="mt-5 text-[1.02rem] leading-[1.9] text-ink-600"
              >
                {block.text}
              </p>
            );
          })}

          <div className="mt-12 rounded-xl2 bg-aqua-50 p-6 ring-1 ring-aqua-100 ring-inset">
            <p className="text-sm leading-relaxed text-ink-600">
              <strong className="font-bold text-brand-800">Not:</strong> Bu yazı
              genel bilgilendirme amaçlıdır ve hekim muayenesinin yerini tutmaz.
              Şikâyetiniz varsa lütfen kliniğimize başvurun.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/randevu" className="btn btn-primary btn-sm">
                <Icon name="calendar" className="size-4" />
                Randevu Al
              </Link>
              <a href={clinic.phone.href} className="btn btn-outline btn-sm">
                <Icon name="phone" className="size-4" />
                {clinic.phone.display}
              </a>
            </div>
          </div>
        </div>
      </article>

      <section className="section bg-ink-50/70">
        <div className="container-x">
          <h2 className="text-2xl font-extrabold">Diğer yazılar</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <PostCard key={p.slug} {...p} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
