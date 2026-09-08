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
   more than a 301. So /urunler, /urunler/ozel-tasarim-takilar, /galeri,
   /hakkimizda and /iletisim are NOT redirected — they are real pages now, and
   their redirects were deliberately deleted from the holding page's map. A
   test asserts each returns 200 rather than 301.

   /urunler/pirlanta was on that list until 2026-09-08. It is a 301 now because
   the category itself is gone, not because the path was given up: a 301 to the
   page that actually holds its pieces is the best available answer once the
   page it named no longer exists. This is the only reclaimed path ever to move
   back into the redirect map, and it needed the category restructure to
   justify it.
--------------------------------------------------------------------------- */

const CATEGORY = {
  altinSeti: "/urunler/altin-seti",
  kupe: "/urunler/kupe-modelleri",
  yuzuk: "/urunler/yuzuk",
  ozelTasarim: "/urunler/ozel-tasarim-takilar",
} as const;

/* Retired 2026-09-08 — see the note in lib/content.ts. Both were live category
   pages, both are in Google's index, and both now 301 to /urunler/yuzuk.

   NOTHING may point at these two paths as a destination. A redirect landing on
   a redirect costs a hop of PageRank and, worse, is the exact shape that hides
   a broken chain: every URL still resolves, so the site looks fine while every
   old link takes two round trips. The `permanent: true` rules below therefore
   name CATEGORY.yuzuk directly, and tests/redirects.spec.ts asserts that every
   source in this file reaches a 200 in exactly one hop. */
const RETIRED = {
  pirlanta: "/urunler/pirlanta",
  tekTas: "/urunler/tek-tas-modelleri",
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
     * those down hard; WebP covers anything that cannot take AVIF.
     *
     * The gap between those two is bigger than it looks, and it is the whole
     * reason for the `qualities` entry below. Measured on a production build,
     * at w=750: every one of the 60 masters lands under 80 KB as AVIF, worst
     * 66 KB. On the WebP path the same set has nine over 80 KB, worst 148 KB —
     * 2.67 MB against AVIF's 1.61 MB across the catalogue. Stage 2.5's
     * "11 of 60 exceed 80 KB" was measuring WebP; the finding was real and
     * still is, for Safari before 16 and older Android. */
    formats: ["image/avif", "image/webp"],

    /* Next 16 requires this allowlist: a `quality` prop naming a value that is
     * not here is refused with a 400, so the prop alone silently does nothing
     * — verified against a production build before relying on it.
     *
     * 75 stays for everything that is not a product card. 60 is for the cards,
     * where the image is rendered at a quarter of the viewport behind a
     * hairline border and the difference is not visible at that size, but the
     * bytes are — on the WebP path, on a phone, on mobile data.
     *
     * Measured across all 60 masters at w=750, WebP path / AVIF path:
     *
     *     q=75   9 over 80 KB, worst 148 KB, 2.67 MB / 1.61 MB
     *     q=60   6 over 80 KB, worst 125 KB, 2.23 MB / 1.05 MB
     *     q=50   4 over 80 KB, worst 115 KB, 1.98 MB / 0.80 MB
     *
     * 50 was measured and deliberately not shipped: the remaining offenders
     * are busy frames — suede, chain, a boxed bangle — and those are exactly
     * the images where a low quality shows first. The six that stay over 80 KB
     * are a cropping problem, not a compression one, and cropping changes what
     * the photograph shows, which is Soner's call and not a build setting.
     * Do not add 50 back without a decision recorded beside it. */
    qualities: [60, 75],
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
      { source: "/urun/tek-tas-modelleri", destination: CATEGORY.yuzuk, permanent: true },
      { source: "/urun/ozel-tasarim-takilar", destination: CATEGORY.ozelTasarim, permanent: true },
      { source: "/urun/pirlanta-yuzukler", destination: CATEGORY.yuzuk, permanent: true },
      /* Generic "ring models" — no single category is the right answer, so it
         goes to the index rather than guessing. */
      { source: "/urun/yuzuk-modelleri", destination: "/urunler", permanent: true },
      /* The old category listing for gold, archived 2017. */
      { source: "/urunler/altin", destination: CATEGORY.altinSeti, permanent: true },

      /* ---- Retired category pages (2026-09-08) ---------------------------
         These two were live pages that Google indexed, so they are the most
         valuable sources in this file — a visitor arriving on either one came
         from a real search result. They go to the page that now holds their
         contents: /urunler/pirlanta's rings and /urunler/tek-tas-modelleri's
         rings are all in /urunler/yuzuk, and the su yolu takımı that was the
         only non-ring in pirlanta is in /urunler/altin-seti.

         The su yolu takımı is the one thing this loses: someone who had
         bookmarked pirlanta for it lands on rings. One destination has to be
         picked, and five of the six pieces went to yuzuk. */
      { source: RETIRED.pirlanta, destination: CATEGORY.yuzuk, permanent: true },
      { source: RETIRED.tekTas, destination: CATEGORY.yuzuk, permanent: true },

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
