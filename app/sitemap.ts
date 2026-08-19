import type { MetadataRoute } from "next";

import { shop } from "@/lib/config";
import { getCategorySlugs } from "@/lib/content";

/* §10 — generated from lib/content.ts, so a new category appears in the
 * sitemap automatically rather than being remembered.
 *
 * Only live URLs. Old paths are handled by the redirect map and must not be
 * listed here: a sitemap is a set of claims about what exists now. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages = [
    { path: "/", priority: 1 },
    { path: "/urunler", priority: 0.9 },
    { path: "/galeri", priority: 0.7 },
    { path: "/hizmetler", priority: 0.7 },
    { path: "/hakkimizda", priority: 0.6 },
    { path: "/iletisim", priority: 0.8 },
  ];

  /* Categories rank above most of the static pages: with no product pages,
   * these five URLs are the entire search surface (§1). */
  const categories = getCategorySlugs().map((slug) => ({
    path: `/urunler/${slug}`,
    priority: 0.8,
  }));

  return [...staticPages, ...categories].map(({ path, priority }) => ({
    url: `${shop.url}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
