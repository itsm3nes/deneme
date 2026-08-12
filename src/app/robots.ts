import type { MetadataRoute } from "next";
import { clinic, isDraftDeployment } from "@/lib/clinic";

export default function robots(): MetadataRoute.Robots {
  const base = clinic.siteUrl.replace(/\/$/, "");

  // Önizleme/taslak dağıtımı: yer tutucu içerik arama motorlarına düşmesin.
  if (isDraftDeployment) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/kvkk", "/yonetim"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

/** Statik export sırasında da üretilebilmesi için. */
export const dynamic = "force-static";
