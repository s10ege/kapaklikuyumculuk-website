# holding-page — superseded, kept for reference

This is the static page that **is still live** at
`https://www.kapaklikuyumculuk.com/` — verified 2026-09-08 by fetching the
domain and diffing: the response is byte-identical to `index.html` here.

> **This paragraph said "no longer deployed" until 2026-09-08, and that was
> wrong.** It matters more than a stale sentence usually does, because what is
> live is not neutral. This file publishes the retired bare name as the
> business name, `No: 56/A` in both the visible address and the JSON-LD,
> `20:00` closing hours, and `pırlanta` as a stock claim — every single thing
> the project exists to correct, on the canonical URL, in structured data,
> signed by us. Stage 3 finishing does not change that. **The deploy does**,
> and it is `FINAL.md` 4.1.

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

- `index.html` — the JSON-LD `JewelryStore` block it carries was the basis for
  the site-wide structured data (iteration 14).

  **Do not edit it to match `lib/config.ts`.** This bullet used to require the
  opposite — that its address, hours and `sameAs` stay character-for-character
  identical to config — and that instruction was both false in fact (it says
  56/A and 20:00) and in direct conflict with `scripts/retired-terms.mjs`,
  which allowlists this file as *"archived verbatim — editing it would falsify
  the record"*. Two instructions pointing opposite ways, on the one file that
  currently is the website. The archive rule wins: this is a record of what was
  served, and the fix for what it says is to stop serving it.
- `404.html` — superseded by `app/not-found.tsx`.
- `robots.txt` / `sitemap.xml` — superseded by `app/robots.ts` and
  `app/sitemap.ts`, which generate from `lib/content.ts`.
