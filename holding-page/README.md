# holding-page — superseded, kept for reference

This is the static page that was live at `https://www.kapaklikuyumculuk.com/`
while the real site was being built. It is **no longer deployed** and is kept
only as a record.

## Do not reapply `vercel.json` from this folder

Its redirect map sends `/urunler`, `/urunler/ozel-tasarim-takilar`, `/galeri`,
`/hakkimizda`, `/iletisim` — and the retired `/urunler/pirlanta` — to `/` with a
permanent redirect. All but the last are **live pages on the new site**, and two
of them are confirmed still in Google's index. The last is a 301 to
`/urunler/yuzuk` since the 2026-09-08 category restructure, which is still not
what this file would do to it.

Reapplying this file would throw away the index history the whole cleanup was
meant to preserve — the single largest risk named in §4 of the spec.

The current, authoritative redirect map lives in **`next.config.ts`** at the
repo root, and every rule in it is asserted by `tests/redirects.spec.ts`.

## What is still useful here

- `index.html` — the JSON-LD `JewelryStore` block it carries is the basis for
  the site-wide structured data (iteration 14). Its address, hours and
  `sameAs` values must stay character-for-character identical to
  `lib/config.ts`.
- `404.html` — superseded by `app/not-found.tsx`.
- `robots.txt` / `sitemap.xml` — superseded by `app/robots.ts` and
  `app/sitemap.ts`, which generate from `lib/content.ts`.
