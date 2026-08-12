import type { MetadataRoute } from "next";
import { clinic } from "@/lib/clinic";
import { posts } from "@/lib/content";
import { treatments } from "@/lib/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = clinic.siteUrl.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1 },
    { path: "/tedaviler", priority: 0.9 },
    { path: "/randevu", priority: 0.9 },
    { path: "/iletisim", priority: 0.8 },
    { path: "/hakkimizda", priority: 0.7 },
    { path: "/hekimlerimiz", priority: 0.7 },
    { path: "/galeri", priority: 0.6 },
    { path: "/blog", priority: 0.6 },
    { path: "/sss", priority: 0.6 },
    { path: "/anlasmali-kurumlar", priority: 0.4 },
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${base}${route.path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route.priority,
    })),
    ...treatments.map((t) => ({
      url: `${base}/tedaviler/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
