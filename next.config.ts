import type { NextConfig } from "next";

/* ---------------------------------------------------------------------------
   REDIRECTS — the highest-risk artefact in this project (§4).

   The old WordPress site left 309 URLs in Archive.org and six still visible in
   Google's index. docs/index-cleanup-plan.md calls these 301s "the only thing
   preserving whatever index history the domain still holds". Losing them in the
   move to a fresh repo was named the single largest risk in the build.

   WHY THESE LIVE HERE AND NOT IN vercel.json
   §4 and §13 say vercel.json. They are here instead for one reason: redirects
   declared in vercel.json only exist on Vercel, so they cannot be exercised
   until after a deploy. Next config redirects behave identically on Vercel and
   under `next dev`/`next start`, which means the entire map below is asserted
   by tests/redirects.spec.ts before anything ships. For a file whose failure
   mode is "looks exactly like a working site", being testable is worth more
   than being in the file the spec named. Nothing is lost: the map is still one
   declarative list in version control.

   THE RULE THAT MATTERS MOST
   §4's insight is that a live page at an already-indexed address is worth far
   more than a 301. So /urunler, /urunler/pirlanta, /urunler/ozel-tasarim-takilar,
   /galeri, /hakkimizda and /iletisim are NOT redirected — they are real pages
   now, and their redirects were deliberately deleted from the holding page's
   map. A test asserts each returns 200 rather than 301.
--------------------------------------------------------------------------- */

const CATEGORY = {
  pirlanta: "/urunler/pirlanta",
  altinSeti: "/urunler/altin-seti",
  kupe: "/urunler/kupe-modelleri",
  tekTas: "/urunler/tek-tas-modelleri",
  ozelTasarim: "/urunler/ozel-tasarim-takilar",
} as const;

const nextConfig: NextConfig = {
  /* Carried over from the holding page. Archive.org shows the old site used
     trailing slashes (/hakkimizda/, /iletisim/), so Next canonicalises those
     to the slashless form with a 308 before these rules are consulted. */
  trailingSlash: false,

  images: {
    /* §12 — next/image is in place from day one, while every image is still an
     * SVG placeholder. Swapping a placeholder for a real JPEG is then a change
     * to one path string in lib/content.ts, with no component edit.
     *
     * Next does not optimise SVG by default because SVG can carry script. The
     * two settings below are what the docs require alongside it: the sandbox
     * CSP stops any embedded script executing, and `attachment` means a direct
     * visit to the file downloads rather than renders it. */
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    /* Product photography will be amateur phone shots (§11). AVIF first cuts
     * those down hard; WebP covers anything that cannot take AVIF. */
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      /* §4 rule 5 — the preview host must never be indexed as a duplicate of
         the real domain. Note this also sends Vercel preview deployments to
         production, which is the trade the holding page already made. */
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        destination: "https://www.kapaklikuyumculuk.com/:path*",
        permanent: true,
      },

      /* ---- Old product URLs → the category that replaced them -------------
         §4's table covers three of these. docs/old-urls.txt shows four more
         indexed product paths it missed: /urun/ozel-tasarim-takilar,
         /urun/pirlanta-yuzukler, /urun/yuzuk-modelleri and /urunler/altin. */
      { source: "/urun/altin-seti", destination: CATEGORY.altinSeti, permanent: true },
      { source: "/urun/kupe-modelleri", destination: CATEGORY.kupe, permanent: true },
      { source: "/urun/tek-tas-modelleri", destination: CATEGORY.tekTas, permanent: true },
      { source: "/urun/ozel-tasarim-takilar", destination: CATEGORY.ozelTasarim, permanent: true },
      { source: "/urun/pirlanta-yuzukler", destination: CATEGORY.pirlanta, permanent: true },
      /* Generic "ring models" — no single category is the right answer, so it
         goes to the index rather than guessing. */
      { source: "/urun/yuzuk-modelleri", destination: "/urunler", permanent: true },
      /* The old category listing for gold, archived 2017. */
      { source: "/urunler/altin", destination: CATEGORY.altinSeti, permanent: true },

      /* Anything else under /urun/ lands on the catalogue rather than a 404.
         Must come after the specific rules above: first match wins. */
      { source: "/urun/:path*", destination: "/urunler", permanent: true },

      /* ---- Generation-1 pages (2013–2016) --------------------------------- */
      { source: "/urunlerimiz", destination: "/urunler", permanent: true },
      { source: "/urunlerimiz/:path*", destination: "/urunler", permanent: true },

      /* Kurumsal was the old About page, and its recovered copy is the source
         of the Hakkımızda text — so it has a genuine successor, not just "/". */
      { source: "/kurumsal", destination: "/hakkimizda", permanent: true },
      { source: "/misyonvizyon", destination: "/hakkimizda", permanent: true },
      { source: "/markalar-2", destination: "/hakkimizda", permanent: true },
      { source: "/calistigimiz-firmalar", destination: "/hakkimizda", permanent: true },
      { source: "/calistigimiz-firmalar/:path*", destination: "/hakkimizda", permanent: true },

      /* Both old photo galleries have a real successor now. */
      { source: "/fotograf-galerisi", destination: "/galeri", permanent: true },
      { source: "/fotograf-galerisi/:path*", destination: "/galeri", permanent: true },
      { source: "/gallery_plus/:path*", destination: "/galeri", permanent: true },

      /* ---- No successor ---------------------------------------------------
         The gold-price and currency tickers are phase two at the earliest, so
         these go to the homepage rather than to a page that does not exist. */
      { source: "/altin-fiyatlari", destination: "/", permanent: true },
      { source: "/doviz-kurlari", destination: "/", permanent: true },
      { source: "/referanslar", destination: "/", permanent: true },
      { source: "/slide-types/:path*", destination: "/", permanent: true },
      { source: "/anasayfa2", destination: "/", permanent: true },

      /* ---- Deliberately NOT redirected (§4 rule 3) -------------------------
         /wp-admin, /wp-login.php, /wp-content/* and /author/* are WordPress
         internals with no successor and must 404, so Google drops them rather
         than following a 301 to a page that has nothing to do with them. They
         land on the branded Turkish 404 (§6.8), not Vercel's error screen.

         robots.txt must NOT block any of these (§4 rule 4): a blocked URL is
         never crawled, so Google never sees the 301 or the 404 and never
         removes it from the index. */
    ];
  },
};

export default nextConfig;
