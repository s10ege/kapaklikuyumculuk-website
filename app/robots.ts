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
 * There is no Disallow at all, in fact. `/studio` was disallowed here from the
 * first commit, reserved for a Sanity Studio that phase two would mount —
 * listed early so it could never be indexed even briefly. That decision was
 * overturned (plan.md, Decisions overturned: "No CMS at all"), `sanity/` was
 * deleted, and the rule outlived the thing it was protecting by about a month.
 * A Disallow for a route that does not exist is not harmless: it is a public
 * statement that the site has something at /studio worth hiding.
 *
 * The routes that genuinely must not be indexed — /yol-tarifi and app/dev/*,
 * plus /telefon when 3.8 builds it — carry `robots: { index: false }` in their
 * own metadata and are absent from the sitemap, which is the mechanism that
 * actually works. A
 * crawler obeying robots.txt never reads the noindex; both together is the
 * belt-and-braces that silently cancels itself.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${shop.url}/sitemap.xml`,
    host: shop.url,
  };
}
