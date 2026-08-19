import type { MetadataRoute } from "next";

import { shop } from "@/lib/config";

/* §10 — and §4 rule 4, which is the important one.
 *
 * robots.txt must NOT block the old WordPress paths. A blocked URL is never
 * crawled, so Google never sees the 301 or the 404 underneath it and never
 * drops it from the index — the cleanup would stall precisely where it looks
 * like it is working. So there is no Disallow for /urun/, /urunler/,
 * /wp-content/ or /author/, however tempting they look.
 *
 * /studio is disallowed ahead of phase two, when the Sanity Studio mounts
 * there (§11). It is listed now so it can never be indexed even briefly.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio"],
    },
    sitemap: `${shop.url}/sitemap.xml`,
    host: shop.url,
  };
}
