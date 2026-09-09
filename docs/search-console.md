# Search Console, Bing, Yandex — stage 4.3

> Written 2026-09-09, the day the site went live. Every step here is yours: it needs the
> Natro panel and a Google account. Work top to bottom; the order matters once, at step 2.

## Before you start

The site is live and verified (`FINAL.md` § 4.2). Sitemap:
**`https://www.kapaklikuyumculuk.com/sitemap.xml`**

## 1 · Add the property — **Domain**, not URL prefix

`https://search.google.com/search-console` → Add property → the **left-hand box, "Domain"**.
Enter `kapaklikuyumculuk.com` (no `https://`, no `www`).

**Choosing "URL prefix" here is a silent half-fix.** The old WordPress URLs are indexed as
`http://www.…`, and a URL-prefix property covers exactly one scheme-plus-host combination.
A Domain property covers every variant — `http`, `https`, bare, `www` — which is the only
thing that sees the whole picture.

## 2 · Verify with a DNS TXT record at Natro

Google gives you one `TXT` value. In the Natro panel:

`Hesabım → Alan Adı Yönetimi → Aktif Alan Adlarınız → kapaklikuyumculuk.com → Yönet →
Profesyonel DNS → Gelişmiş Bölge Düzenleyicisi → Yönet → Diğer İşlemler → Yeni Kayıt`

- Type `TXT`, Name/Host `@`, Value = the string Google gave you, TTL 3600.
- **Do not touch the existing `A` record for `@` or the `CNAME` for `www`.** They point the
  domain at Vercel and the site is live through them. Adding a TXT record alongside is safe;
  editing either of those takes the site down.

Wait a few minutes, then press Verify. Tell me when the record is in and I will confirm it
has propagated with `dig`.

## 3 · Submit the sitemap

Sitemaps → add `sitemap.xml` → Submit. Then URL Inspection → paste
`https://www.kapaklikuyumculuk.com/` → **Request indexing**.

## 4 · Removals — three prefixes, and no others

Removals → **Remove all URLs with this prefix**, once for each:

```
/urun/
/wp-content/
/author/
```

> ### ⛔ Never `/urunler/`
>
> The old version of `index-cleanup-plan.md` listed it, written when a holding page was the
> only thing live. **`/urunler/` is now the live catalogue.** Removing that prefix hides all
> four category pages for about six months, and it looks exactly like a working site the
> whole time. This is hard rule 3 in `AGENTS.md`.

Removals are temporary (~6 months). The permanent fix is the 301s underneath, which are
verified working in production.

## 5 · Then Bing, then Yandex

- **Bing Webmaster Tools** — can import directly from Search Console once step 3 is done.
- **Yandex Webmaster** — do not skip. Yandex matters more than Bing in Turkey, and two of
  the listings in the cleanup plan are Yandex Maps records.

## What to expect, and when

| | Timing |
|---|---|
| Removals take effect | 4–24 hours |
| 301s reflected in the index | 1–4 weeks |
| Old images fade from Google Images | 4–12 weeks |
| First useful query data | ~3 days, then it compounds |

Search Console is the measurement for this whole project, not analytics: queries, position,
impressions, 16 months of history. If the name consolidation works, it shows up here first.

## One thing already known about the old WordPress paths

Vercel's firewall blocks `/wp-admin`, `/wp-login.php` and `/wp-content/*` at the edge with a
plain **403**, before the site can serve its branded Turkish 404 (measured 2026-09-09).

For `/wp-admin` and `/wp-login.php` that is fine, arguably better. For **`/wp-content/*` it
is not ideal**: 111 archived image URLs are indexed under that prefix and a 404 is the
cleaner "drop this" signal to Google than a 403. The prefix removal in step 4 covers it
either way, which is why this is a refinement and not a blocker — but if you want it exact,
add a Vercel Firewall rule allowing `/wp-content/*` through to the site's own 404.
