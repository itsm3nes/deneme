import type { MetadataRoute } from "next";
import { clinic } from "@/lib/clinic";

export default function robots(): MetadataRoute.Robots {
  const base = clinic.siteUrl.replace(/\/$/, "");

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/kvkk" },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
