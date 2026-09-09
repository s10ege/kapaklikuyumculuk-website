# FINAL.md — deploy, Google Business Profile, widgets

> **Stage 4 of 4.** Begins after [`TECHNICAL.md`](TECHNICAL.md) is approved. This is the
> only stage that needs Soner's accounts and the live domain, so most of it is his hands on
> the keyboard, not Claude's.
>
> Builds on `docs/index-cleanup-plan.md`, `docs/google-profile-claiming.md` and
> `docs/google-business-plan.md`. Those remain the reference; this file is the launch
> sequence and the corrections to them.

## ⚠️ Two corrections to the existing docs

Both docs have been amended, but the reasoning is recorded here because following the old
version would be expensive.

**1 · The canonical name changed.** `index-cleanup-plan.md` Step 1 and
`google-business-plan.md` Phase 2 specified `Kapaklı Kuyumculuk`. The decision is
**`Trakya Kapaklı Kuyumculuk`**, title case.

**2 · Never request removal of the `/urunler/` prefix.** `index-cleanup-plan.md` Step 7
originally listed `/urun/`, `/urunler/`, `/wp-content/` and `/author/` for Search Console's
prefix removal tool. That was written when a holding page was the only thing live.
**`/urunler/` is now the live catalogue** — removing that prefix would hide all four
category pages from Google for about six months, and it would look exactly like a working
site while it happened. The corrected list is **`/urun/`, `/wp-content/`, `/author/`** only.

## Order of operations

The sequence matters more than any individual step.

1. **Deploy to Vercel**, domain not yet pointed. Verify on the `.vercel.app` URL.
2. **Point DNS** at Vercel — `docs/dns-a-kaydi-ekleme.md` has the Natro steps. Confirm
   HTTPS, and that `www` and apex resolve to one canonical host.
3. **Verify live** (below). Nothing on Google happens until this passes.
4. **Search Console**, then Bing, then Yandex.
5. **Google Business Profile ownership request** — can run in parallel from day one, since
   it takes 3–7 days and does not depend on the site being live.
6. **Directory cleanup** — Steps 3–5 of `index-cleanup-plan.md`, with the new canonical
   string.
7. **Reviews** — acquisition first, widget later, and only in that order.

## Live verification

- `curl -sI` every one of the **26 redirect rules** — one host-level, 25 path-level:
  **308** with the correct `location`. *(Corrected 2026-09-08: this line said "24 rules …
  301". `permanent: true` emits 308, which is what the holding page already serves and what
  `tests/redirects.spec.ts` asserts. Do not "fix" a working 308 to 301.)*
- `/urunler`, `/urunler/ozel-tasarim-takilar`, `/galeri`, `/hakkimizda`,
  `/iletisim` → **200**.
- `/urunler/pirlanta`, `/urunler/tek-tas-modelleri` → **308 to `/urunler/yuzuk`**, and that
  destination returns 200. Both were live pages until the 2026-09-08 category restructure.
- `/wp-admin`, `/author/x`, `/?p=1` → 404, landing on the branded Turkish page.
- The redirect suite against the live domain:

  ```bash
  E2E_BASE_URL=https://www.kapaklikuyumculuk.com \
    npx playwright test --project=prod tests/redirects.spec.ts
  ```

  **This was not possible until 2026-09-08.** The line here used to read
  `npm run test:e2e -- tests/redirects.spec.ts`, which would have started a local dev server
  and tested that instead of the live domain — a command that looks like it verifies
  production and does not. `E2E_BASE_URL` points the suite at a running host and turns the
  managed server off. The map is proven against a local production build already; this is
  the real test.
- Rich Results Test on `/` and one category: `JewelryStore` + `BreadcrumbList` + `ItemList`
  valid, **`geo` and `hasMap` present and pointing at the shop's own Maps listing**.
  *(Corrected 2026-09-08: this line said "no `geo` emitted", written while the coordinates
  were graded ❌. They now come from the shop's own listing, so the pin, the door number and
  the place ID all describe the same door.)*
- The coin loop on a real phone on mobile data, not wifi.
- Turkish glyphs at 390px, no mid-word fallback.

## 4.2 — Live verification, measured 2026-09-09

The site went live at 15:0x on 2026-09-09 by merging to `main`; production is
`holdingscree-kk`, which already held both domains, so nothing about DNS or the domain
attachment moved. Measured against the live domain, not inferred.

### What the domain publishes now

| | Holding page, until today | Live now |
|---|---|---|
| Business name | the retired bare name | **Trakya Kapaklı Kuyumculuk** |
| `streetAddress` in JSON-LD | `No: 56/A` | **`Cumhuriyet Mah., Pınar Bulvarı No: 56/C`** |
| Closing time | `20:00` | **`18:00` winter / `19:00` summer**, three specs |
| `pırlanta` as a stock claim | present | **0 occurrences in rendered markup** |
| Former partner's two numbers | — | **0 occurrences** |

`JewelryStore` carries `geo` (41.326459, 27.976502), `hasMap`, `image` and the telephone;
`/urunler/yuzuk` adds `ItemList` (15 items) and `BreadcrumbList` (3). All valid JSON.

### The three things only a live deployment could settle

1. **Security headers on 308 responses — ✅ resolved, and the good way.** Vercel's routing
   layer applies all five *plus* the CSP to redirects. `headers()` in `next.config.ts` does
   not, which is what `next dev` shows and what `TECHNICAL.md` §10 recorded as a real cost:
   26 of this domain's URLs are redirects, so a returning visitor's first response would
   carry no HSTS. In production it does. `tests/headers.spec.ts` now asserts **both** halves
   — present live, absent locally — so neither can rot unnoticed.

2. **The analytics beacon vs `connect-src 'self'` — ❌ not proven, and the CSP is not why.**
   The client side is correct: the script loads from Vercel's randomised path
   (`/ad9940f2e35c761b/script.js`, not `/_vercel/insights/…` — an ad-blocker evasion that
   makes the obvious test look like a failure), `window.va` is defined, and a pageview is
   queued. **No CSP violation is raised and no request is blocked.** But the queue never
   drains, no beacon is sent, and the Web Analytics API answers `404 Web Analytics not
   found` for the project. The feature is not provisioned. **Outstanding: enable Web
   Analytics in the dashboard, then re-run.** Until then `/telefon` and `/yol-tarifi` count
   nothing, which is the only reason those two pages exist.

3. **Lighthouse mobile — ✅ the target is met; ❌ the design gate still is not.**
   **97 / 100** against a ≥90 target, on the real CDN. FCP 0.9 s, **LCP 2.6 s**, TBT 50 ms,
   **CLS 0**, Speed Index 1.8 s. Stage 3 measured 89 locally with LCP 3.6 s and said the gap
   was partly environmental; it was, almost entirely. What is *not* environmental is
   unchanged: **the LCP element is still the coin `<video>`**, where `design.md`:129 says it
   should be the H1, and LCP is 2.6 s against a 2.5 s target. Recorded as unmet rather than
   reworded. No hero surgery was done for it — at 97 with CLS 0 the risk of regressing
   outweighs the gain, and `components/HeroCoin.tsx`:54-60 records that the obvious fix
   tripled slow-network desktop LCP.

### Vercel's firewall, found by tripping it

Sweeping the 79 archived paths from `docs/old-urls.txt` against production fired ~160
requests in two minutes from one IP. Vercel answered with `x-vercel-mitigated: challenge`
and then blocked that IP outright — every path, including `/`, `/robots.txt` and
`/favicon.ico`, returned 403 for roughly ten minutes.

**This is not a site fault and it was nearly written up as one.** The tell was `/urunler`
returning 403 having returned 200 twenty minutes earlier. Confirmed by fetching the live
site through Vercel's own infrastructure while the local IP was blocked: `status 200`, real
markup, all four category links. The 403s were the test client, not the site.

Two things worth keeping:

- **The archived-URL sweep is unfinished.** 42 of 79 paths were measured before the block:
  **29 redirected, 8 live pages, 5 deliberate 404s, 0 surprises.** The remaining 37 are
  unmeasured. This was always a belt-and-braces check — the 25 redirect *rules* are proven
  by the live suite — so it is a gap in coverage, not a known defect. Re-run it slowly, or
  from CI rather than a workstation.
- **Rapid crawling gets challenged.** Verified search-engine bots are allowlisted by Vercel
  and Googlebot crawls far more gently than this did, so indexing is not expected to be
  affected. Worth knowing before anyone points a bulk link-checker at the domain.

### Redirects live: 60 passed, 4 failed

Every path rule lands correctly, all reclaimed paths return 200, and **the apex still 308s
to `www`** — asserted now rather than assumed, since that redirect is a Vercel domain
setting rather than code.

The four failures share one cause and none is a redirect fault: **Vercel's WAF blocks
WordPress paths at the edge** (`x-vercel-mitigated: deny`), returning a plain-text 403
before Next can serve the branded Turkish 404. `/wp-admin` and `/wp-login.php` being swatted
at the edge is arguably a bonus. **`/wp-content/uploads/*` is not** — 111 archived image
URLs are indexed under it, and §4 rule 3 wants a 404 *so Google drops them*. A 403 is
dropped too, but more slowly and less definitively. **Outstanding decision:** allow
`/wp-content/*` through the firewall so the 404 serves.

### Also found

**The repo had no git identity configured.** Every commit since stage 1 is authored
`kapaklikuyumculuk@Kapakls-MacBook-Pro.local`, a hostname-derived address on no account.
Vercel refuses to build commits it cannot attribute and returned `BLOCKED` before starting —
this would have stopped the launch whatever was pushed, and surfaced only because this was
the repo's first deployment. Fixed by setting the repo-local identity; history was not
rewritten. **Any future commit from a machine without it set will block production.**

## Search Console

- **Domain property, not URL-prefix.** The old URLs are indexed as `http://www.`, and only a
  domain property covers every host and scheme variant. Choosing wrong is a silent half-fix.
  Verification is a DNS TXT record via the Natro panel.
- Submit `sitemap.xml`, then URL Inspection → Request indexing on the homepage.
- Removals → *Remove all URLs with this prefix* for **`/urun/`, `/wp-content/`, `/author/`**
  — and nothing else. See the correction above. Temporary (~6 months); the permanent fix is
  the 301s working underneath.
- Bing Webmaster Tools, then **Yandex Webmaster** — Yandex matters more than Bing in Turkey.

Expected timing: removals bite in 4–24 hours, the 301s land over 1–4 weeks, old images fade
from Google Images over 4–12 weeks.

## Google Business Profile

> ### ⛔ Corrected 2026-09-09 — this section named the wrong business
>
> Everything below was written against Place ID `ChIJHUgV0gQmtRQRsb2D_txDS2Q`. Both IDs in
> `docs/business-facts.md` were resolved in a browser on 2026-09-09, and that one is
> **"Vural Kuyumculuk", Atatürk Mah., Hürriyet Cd., Çerkezköy — a different business at the
> former partner's address.** Submitting an ownership request for it would have burned a
> 3–7 day cycle claiming somebody else's legitimate listing, and `index-cleanup-plan.md`
> Step 5 is explicit: never touch his own listings under his own name.
>
> **The shop's profile is `ChIJSQxn1KkptRQRLtfCCLZCYLk`** — "Trakya kuyumculuk",
> Cumhuriyet, Pınar Blv 56/C, 59510 Kapaklı. And it is in far better shape than this file
> assumed:
>
> | Field | Live value | Action |
> |---|---|---|
> | Rating | **4,1★ across 15 reviews** | none — the 2.3★/1 review was Vural's |
> | Category | `Kuyumcu` | ✅ already correct |
> | Address | Pınar Blv **56/C** | ✅ already correct |
> | Website | `kapaklikuyumculuk.com` | ✅ already set — and **live** as of today |
> | Name | "Trakya kuyumculuk" | → `Trakya Kapaklı Kuyumculuk` |
> | Phone | `0554 915 77 90` | **Left as-is — Soner's decision, 2026-09-09.** It is the retired WhatsApp number and differs from the landline the site publishes, so GBP and the site disagree on this one field. Recorded so a later session does not "fix" it. The repo never contained it and `source-invariants` still forbids it there. |
> | Ownership | no claim prompt shown — appears already claimed | confirm who holds it |
>
> **So 4.4 may not be an ownership dispute at all.** The claiming flow below still applies
> if the profile turns out to be held by someone unreachable, but the first action is simply
> to find out whether Soner or the family already has access. The reply-to-the-2.3★-review
> task is void: that review belongs to another business.
>
> **And the reviews gate in § Reviews is already met** — 4,1 across 15 clears the "~4.0+
> across 10+" bar that deferred the widget to phase two.

*The original text follows, and is retained because the claiming procedure it describes is
still correct for a profile that genuinely needs claiming.*

The profile it was written about is at Place ID `ChIJHUgV0gQmtRQRsb2D_txDS2Q`, is claimed by
an unknown party, and carried 1 review at 2.3★.

**Follow `docs/google-profile-claiming.md` exactly.** The instinctive route — create a new
profile, report the old one — is the one path that reliably makes things worse: Google
suppresses the *new* profile, not the incumbent, and the review history and age signal are
lost. The ownership-request flow needs 3–7 days of the current owner's silence.

Have ready before starting: Çerkezköy TSO registration, Oda Sicil **3037** / Ticaret Sicil
**3230**, vergi levhası, a utility bill or rent contract at the address, and storefront
photos. If the masked email in the request flow looks like the former partner's, a phone call
beats a three-week support case.

Once access is granted — spread over a week or two, never in one hour, because a profile
that changes everything at once looks like a hijacking and can trip a manual review:

- **Name → `Trakya Kapaklı Kuyumculuk`.** Title case, exactly, no added keywords.
  "Trakya Kapaklı Kuyumculuk Altın Pırlanta Tekirdağ" is a policy violation and a common
  cause of suppression. ALL-CAPS carries the same risk.
- **Website → the live domain.** The single most valuable field, currently a dead link.
- **Primary category `Kuyumcu`.** Secondaries only for what the shop genuinely does.
- **Remove `0282 717 85 88` and `0282 717 39 87`** — the former partner's shop.
- Address and hours to the canonical block, character-for-character.
- **10+ photos.** There is currently one. Profiles with ten or more get materially more
  calls and direction requests, and the catalogue from stage 2 supplies them.
- **Reply to the 2.3★ review.** Calm, specific, no defensiveness. Everyone who reads the
  profile reads the owner's reply, and it is often worth more than the rating itself.

## Reviews — acquisition before widget

**Do not embed a reviews widget yet.** At one review and 2.3★, a reviews section argues
against the shop to every visitor who reaches it. The widget is the last thing in this
stage, gated on the rating.

Sequence: claim the profile → reply to the existing review → ask customers in person, at the
counter, with the short review link on a small printed card or a QR code by the till. **No
incentives, and no filtering for happy customers only** — both violate Google's policies and
both are detectable.

When the rating is healthy — roughly 4.0+ across ten or more reviews — the widget becomes
worth adding. Options then: Google's Places API (up to five reviews, requires a key and
attribution, and Google's terms restrict how long the data may be cached), or a third-party
embed such as Trustindex or Elfsight, simpler but paid above a small free tier. Decide then,
not now.

## The map

The build uses the keyless `output=embed` iframe keyed on the **address string** rather than
coordinates — deliberately, since sources differ by ~150 m and a wrong pin is worse than no
pin.

Two refinements for launch:

- **Tap-to-load.** A static styled placeholder with a *Haritayı aç* button that swaps in the
  iframe on click. Saves several hundred KB on every page load, avoids Google's cookies until
  the visitor asks for the map, and sidesteps the consent question entirely.
- Keep a plain **Yol Tarifi** link alongside, which works whether or not the embed loads.

If the keyless embed ever stops working, the supported route is the Maps Embed API with a
domain-restricted key on the free tier.

## Directory cleanup

Steps 3–5 of `docs/index-cleanup-plan.md`, unchanged in method, but every listing now gets
**`Trakya Kapaklı Kuyumculuk`**. Highest value: the two Yandex listings, the wrong-Instagram
correction at esnaf.pro, and disentangling the Atatürk Mahallesi records that carry the shop's
name at the former partner's address.

Frame every request as *"this listing shows my business name at an address that is not
mine"* — factual, actionable by a moderator, and true. Do not touch his own listings under
his own name.

## Monitoring

- **Search Console is the measurement**, not analytics: queries, position, impressions, 16
  months of history. If the name consolidation works, it shows up here first.
- Step 8 of the cleanup plan: search the shop name monthly from a logged-out browser and
  record what appears. Fifteen minutes, forever.
- Vercel Analytics for visitors and referrers, with `/telefon` and `/yol-tarifi` giving
  click counts on the free tier.

## Done when

- Site live at the domain, HTTPS, one canonical host.
- Redirect suite green against production; reclaimed paths return 200.
- Search Console domain property verified, sitemap submitted, **correct** removals requested.
- Bing and Yandex submitted.
- GBP owned, renamed, website and phones corrected, 10+ photos, review answered.
- Priority directories corrected, with request dates logged for chasing.
- 30-day re-verification scheduled.

## Risks

1. **The `/urunler/` removal**, if anyone follows the old version of the doc. Corrected in
   both places.
2. **A GBP name suspension** from keyword stuffing or all-caps. The name goes in exactly as
   specified, once.
3. **The ownership request is denied** — likely only if the former partner holds it and
   objects. `google-profile-claiming.md` covers escalation.
4. **Reviews embedded too early**, turning a ranking asset into a conversion liability.
