# TECHNICAL.md — brand consolidation, SEO, mobile, and everything left

> **Stage 3 of 4.** Begins after [`CATALOGUE.md`](CATALOGUE.md) is approved. Ends when the
> site is technically ready to deploy — everything that does not need the live domain or a
> Google account, which is [`FINAL.md`](FINAL.md)'s job.

---

## 0 · What the 2026-09-08 stage-2 pass already did

> Recorded so stage 3 does not re-plan finished work. This stage file was **not opened** —
> §1's ⛔ confirmation gate is untouched and stage 3 has not begun. What follows happened
> inside stage 2's final iteration (`plan.md` § 2.6) because it was catalogue and copy work
> that happened to overlap this file's sections.

- **§3, the copy gate — done, and larger than specified.** `lib/filler.ts` is deleted;
  `lib/copy.ts` holds every sentence in *sade esnaf sesi*; `tests/copy.test.mts` is the
  gate. See §3 below, rewritten.
- **§4, redirects — two rules added and two repointed.** `/urunler/pirlanta` and
  `/urunler/tek-tas-modelleri` are 301 sources now, and the rules that used to land on them
  name `/urunler/yuzuk` directly. A no-chains assertion follows every source one hop and
  requires a 200. `/urunler/pirlanta` left the reclaimed list — the only path ever to do so.
- **§5, SEO — partly done.** `JewelryStore` now carries `geo` and `hasMap` (the coordinates
  stopped being ❌ when they came from the shop's own Maps listing), and
  `openingHoursSpecification` is three seasonal entries. Every meta description is rewritten
  to 120–155 characters. **Still outstanding and still stage 3's:** OG images (there are
  none), and dropping the `/studio` disallow.
- **§9, analytics — the `/yol-tarifi` half exists.** It is a prerendered page rather than
  the redirect the section imagines, for two reasons: a redirect would be the only dynamic
  route in the build, and — the one that decides it — Vercel Web Analytics counts page views
  from a script on a rendered page, so a redirect fires nothing. `/wa` is no longer needed —
  WhatsApp was removed on 2026-09-08, in the same pass. **`/telefon` and
  `@vercel/analytics` landed in stage 3 on 2026-09-08; §9 is done.**

## ⛔ 1 · CONFIRMATION GATE — do not write code past this point

**Claude must stop here and ask Soner to confirm, in writing, in the session:**

1. The canonical name string, character-for-character.
2. The full address block, character-for-character.
3. **`0282 717 55 62`** — still in use?
4. **Opening hours**, including the winter closing time.
5. That the **Altın Alım–Satım copy** on `/hizmetler` matches how the shop actually
   operates — it promises weighing on the counter in front of the customer, with any
   deduction named beforehand.

> **Five, not six, since 2026-09-08.** Item 3 used to be *"WhatsApp `0554 915 77 90` —
> correct? Then `contact.whatsapp.pending` → `false`"*. There is nothing left to confirm:
> Soner removed WhatsApp, the number is out of `lib/config.ts`, and the pending mechanism it
> was waiting on is gone with it. **(2)** is also already answered — the address was
> confirmed as `No: 56/C` in the same pass — but it stays on the list, because the point of
> a gate is that it is read out loud rather than assumed.

**Instruction to Claude:** if asked to start this iteration without these confirmations,
stop and ask for them first. Do not infer them from `docs/`, do not carry them over from an
earlier session, and do not treat silence as approval.

### ✅ Confirmed by Soner, in writing, 2026-09-08

Asked and answered in the session that opened stage 3, each item quoted back to him from
`lib/config.ts` rather than paraphrased, so what he confirmed is the stored string and not a
description of it.

| # | Fact | Answer |
|---|---|---|
| 1 | Canonical name | ✅ `Trakya Kapaklı Kuyumculuk` — confirmed as stored, unchanged |
| 2 | Address block | ✅ Confirmed as stored, character-for-character: `Cumhuriyet Mah., Pınar Bulvarı No: 56/C` · `59510 Kapaklı / Tekirdağ`. `Bulvarı` not `Blv.`, the space after `No:`, the spaces around the slash |
| 3 | `0282 717 55 62` | ✅ **Still in use.** Stays as `contact.phoneAlt`. `0282 717 21 31` remains primary and is the number in every CTA, the title tag and the JSON-LD `telephone` |
| 4 | Opening hours | ✅ Confirmed as stored — summer (May–Sep) 09:00–19:00, winter (Oct–Apr) 09:00–18:00, Monday–Saturday, Pazar kapalı. Sunday is never emitted in JSON-LD, which is how schema.org reads *closed* |
| 5 | Altın Alım–Satım copy | ✅ **Matches how the shop operates.** Both load-bearing promises stand: the gold is weighed on the counter in front of the customer, and any deduction is named before the transaction. They stay declared at the use site in `app/hizmetler/page.tsx` and asserted by e2e |

**No `lib/config.ts` change fell out of the gate** — every fact was confirmed as already
stored. That is the outcome to expect from a gate on a file that has been maintained
carefully, and it is not a reason to skip the next one.

One item stays open and is **not** part of this gate: Ramazan and bayram hour variations,
still unresolved in `docs/open-questions.md`. The site claims nothing about them, which is
correct until it can claim something true. It is a Google Business Profile field before it
is a website one.

---

## 2 · The brand name — launch-blocking

The site publishes **`Trakya Kapaklı Kuyumculuk`**. `docs/index-cleanup-plan.md` Step 1
lists that exact string among the three variants *causing* the ranking problem and
originally recommended `Kapaklı Kuyumculuk`. Soner's decision overrides that, and both
Google docs have been corrected — but the decision only works **if every directory moves to
it at the same time**. Publishing it while Google Business Profile still says something else
adds a fourth variant instead of replacing three.

**Canonical block** — this exact text, everywhere:

```
Trakya Kapaklı Kuyumculuk
Cumhuriyet Mah., Pınar Bulvarı No: 56/C
59510 Kapaklı / Tekirdağ
0282 717 21 31
https://www.kapaklikuyumculuk.com
```

Punctuation is load-bearing: `Bulvarı` not `Blv.`, `No: 56/C` with the space,
`Kapaklı / Tekirdağ` with spaces around the slash.

**Title case is the stored form.** Google Business Profile guidelines prohibit unnecessary
capitalisation, and ALL-CAPS names have been treated as a name policy violation — which can
cost the profile. Where the design wants caps (the header lockup, the hero), that is a
**CSS `text-transform` treatment**, not the stored string. With `lang="tr"` on the document,
uppercasing follows Turkish casing rules, so dotted and dotless i behave correctly.

Checklist: Google Business Profile · Instagram bio (`kuyumculukkapakli` — **not**
`@kapaklikuyumculuk`, a different jeweller in Şanlıurfa) · Facebook page `537179436417060` ·
the Steps 3–5 directory corrections in `docs/index-cleanup-plan.md` · and retire
`Kapaklı Kuyumcusu` everywhere editable.

`tests/source-invariants.test.mts` fails the build if any of this is inlined anywhere but
`lib/config.ts`. That guarantee stops at the edge of the repo; the directories are the other
half, and they are manual. `FINAL.md` covers them.

## 3 · The copy gate

> **Done 2026-09-08, and it grew.** `lib/filler.ts` is gone — every page carries real copy
> now, written in one pass in the *sade esnaf sesi* voice and living in `lib/copy.ts`. The
> gate this section specified is `tests/copy.test.mts`.

Filler shipping to production was the original worry, and it was the easy half. Filler is
obvious. What actually threatens a shop like this is fluent copy that says nothing —
*"eşsiz zarafet"*, *"hayallerinizdeki yüzük"*, *"her zevke uygun"*. It reads fine, it passes
review, and it is indistinguishable from every other jeweller's site in the country.

So the gate walks every string in `lib/copy.ts` and every category intro and meta
description in `lib/content.ts`, and fails the build on:

- **A banned-word list** — the vocabulary above, ~30 entries. Each is a word that sounds
  like it describes the jewellery while carrying no information about it.
- **Exclamation marks and rhetorical questions.** An exclamation mark on a jeweller's site
  is a sale sign; this shop's argument is that it has been calm on the same street since 2000.
- **Sentences opening `Biz,` or `Sizin için`** — the sound of a company describing itself.
- **Sentence-count caps.** Three on product and contact pages, four on Hakkımızda.
- **The locality, exactly once per page**, and never twice in one paragraph.
- **Meta descriptions inside 120–155 characters**, and never in capitals.
- **The questions customers actually ask** — ayar and gram on the tag, why no price is
  printed, weighing in front of you, deductions said before, resizing and repair, how long
  an order takes. If the copy stops answering one of them, the build fails. This is the
  assertion that would have caught the copy it replaced.

The copy as it stood before the redesign is preserved in
[`docs/original-copy.md`](docs/original-copy.md).

## 4 · Redirects

**26 rules** in `next.config.ts` — one host-level rule sending `*.vercel.app` to the
canonical domain, plus 25 path rules — verified against the 309 URLs in
`docs/old-urls.txt`. `tests/redirects.spec.ts` exercises them through 24 concrete source
paths, seven of the rules being wildcards proven with a representative path.

> **Corrected 2026-09-08.** This section said "24 rules … returns 301" from the day it was
> written. Both halves were wrong, and the second one is the dangerous one: `permanent: true`
> emits **308**, in Next and on Vercel, and 308 is what the holding page has been serving
> since the cleanup shipped. Google treats the two identically for indexing, so the code is
> right and the prose was stale — but a stage-4 operator curling for 301 against a working
> site would read a false alarm and start "fixing" the highest-risk file in the repo.
> `tests/redirects.spec.ts` carries the same reasoning at the assertion.

- Every old path returns **308** with the correct `location`.
- The reclaimed paths — `/urunler`, `/urunler/ozel-tasarim-takilar`, `/galeri`,
  `/hakkimizda`, `/iletisim` — return **200, not a redirect**. This is the check that
  protects the domain's index history.
- **No chains.** Every source reaches a 200 in one hop. `/urunler/pirlanta` and
  `/urunler/tek-tas-modelleri` became redirect sources on 2026-09-08 when the categories
  were restructured, so any rule still aimed at either one is a two-hop chain.
- The deliberate 404s stay 404: `/wp-admin*`, `/wp-login.php*`, `/wp-content/*`,
  `/author/*`, `/category/*`. **`/?p=*` is the exception and returns 200**, not 404 — a
  query string is not a route in Next, so no rule can make it one. Four such URLs are in
  `docs/old-urls.txt`. The mitigation is real rather than hopeful: the response carries
  `<link rel="canonical">` pointing at the homepage, so Google folds them in rather than
  indexing duplicates. This bullet claimed a mechanism that does not exist until 2026-09-08.
  **Corrected the same day:** `/anasayfa2` and
  `/slide-types/*` were in this list and are not 404s — both are redirect rules to `/`
  (`next.config.ts`, in the "no successor" group). Listing them here contradicted the file
  they were supposed to describe, and would have had a stage-4 operator "fixing" two working
  redirects into 404s, throwing away whatever link equity they carry.
- **`robots.txt` must not block the old paths.** A blocked URL is never crawled, so Google
  never sees the 301 and never drops it.

The redesign touches `next.config.ts`, so the suite runs on every change, not only at the
end. Proven locally here; proven live in `FINAL.md`.

## 5 · SEO after the redesign

- Title pattern, from the old indexed template:
  `%page% - Trakya Kapaklı Kuyumculuk | 0282 717 21 31 | Kapaklı`.
- `JewelryStore` JSON-LD site-wide, generated from `lib/config.ts`, **carrying `geo` and
  `hasMap`** since 2026-09-08. This bullet said *omitting `geo`* until then, on the grounds
  that sources differed by ~150 m and a wrong pin is worse than none — true while the
  coordinates were graded ❌, and moot once they came from the shop's own Maps listing. See
  §0 and `lib/schema.ts`. `sameAs`: Instagram + Facebook.
- `BreadcrumbList` on **every page except the homepage**, from the same `trail` prop as the
  visible strip, so the two cannot disagree. *(This said "every page" until 2026-09-08 and
  the code did not, correctly: a one-item breadcrumb on a root page is standard practice and
  Google shows nothing for it. The doc was the thing that was wrong.)* `ItemList` of
  `Product` per category, **now carrying real image URLs**, which it could not before.
- ✅ **OG images — built 2026-09-08.** Five 1200×630 cards: the coin and the claim as the
  site-wide default, and one per category using that category's own cover, so the card and
  the page a visitor lands on show the same piece. Committed PNGs in `public/og/`,
  photographed from `app/dev/og` by `scripts/og.mjs`. Not `next/og` — the fonts come from
  `next/font/google`, nothing here is a font binary, and `ImageResponse` would put a Google
  Fonts fetch inside `next build`. **Re-run `npm run og` if the lockup, the palette or a
  category cover ever changes; nothing regenerates them automatically.**
- `sitemap.ts` regenerated from the folder-driven catalogue, so a new product needs no
  sitemap edit. ✅ **The `/studio` disallow is gone (2026-09-08)** — `robots.txt` now carries
  no `Disallow` at all, and a test asserts the absence rather than the rule.
- Targets stay local: **`kapaklı kuyumcu`, `kapaklı altın`, `tekirdağ altın seti`**. Not
  `altın bilezik` on its own — that is competing nationally against chains with budgets.
  (`tekirdağ pırlanta` was a target until 2026-09-08. The pırlanta category was retired —
  the pieces are white gold — so the shop no longer competes on a word it cannot back.)

## 6 · Mobile — adaptation and verification

Layout decisions for phones live in `design.md` (D15). This section is device-level
correctness and the things only real hardware reveals.

Baseline carried over: Tailwind mobile-first, breakpoints proven at **320 / 360 / 390 /
768 / 1440** since 2026-09-08, hamburger panel listing the four categories first, tap
targets ≥44px (§7).

1. **Real-device pass, not emulator.** Minimum: one mid-range Android (Chrome and Samsung
   Internet) and one iPhone (Safari — Chrome for iOS is Safari underneath, so it is not a
   second engine). Emulators do not reproduce URL-bar behaviour, touch latency or font
   rendering.
2. **The coin at phone size.** Budget ≤500 KB, rotation pauses off-screen, still frame under
   `prefers-reduced-motion` and `prefers-reduced-data`. ✅ **Fixed 2026-09-08:** the video
   source switched encodes at 768px while the coin only grows at 1024px, so every
   768–1023px viewport downloaded the 1326 KB encode to paint a 320px coin — over the
   budget, on a tablet. The switch now tracks the size jump. The *poster* upgrade stays at
   768px on purpose: the still is 117 KB, and the reduced-motion visitors who see it are
   the ones who look at it indefinitely.
3. ✅ **`dvh`, not `vh` — done 2026-09-08.** The `hero-height` utility in `app/globals.css`
   declares `78vh` then `78dvh`, in that order, so an engine without `dvh` keeps the first.
   Written as a utility rather than two Tailwind arbitrary classes because that would bet
   on generated-CSS ordering. This was the only viewport-height unit in the codebase.
4. **Safe-area insets.** The call FAB must clear the iOS home indicator
   (`env(safe-area-inset-bottom)`) and must never sit on the last row of a product grid.
   ✅ **Half-fixed 2026-09-08:** `CallFab` had read the insets correctly since it was
   written, but the viewport export carried no `viewportFit: "cover"`, so on iOS they
   always resolved to `0px`. Correct code, inert — the hardest kind to spot, since nothing
   is missing and nothing errors. `cover` is set now; whether the button actually clears
   the home indicator is 4.2's, on a real phone.
5. **Lightbox on touch.** Swipe to step through, close button in thumb reach, focus trap
   that does not fight the on-screen keyboard, pinch-zoom not blocked. Currently proven with
   keyboard and mouse only.
6. **Sticky header height** on a 667px-tall screen — decide between shrink-on-scroll and
   accepting the cost.
7. ✅ **No horizontal scroll at 320px — now tested, 2026-09-08.** This was a done-when from
   the day the section was written and never had a test; the narrowest width the suite
   checked was 360. Adding it found one real failure: `/yol-tarifi` scrolled 39px because
   "yönlendiriliyorsunuz" is a single 20-character word at 40px in a 280px content box.
   Fixed with `hyphens-auto break-words` rather than by shortening the sentence — long
   Turkish words are a permanent condition here, not an accident of that heading. Note the
   overflow assertion reported *no offending element*: a wide text node leaves every box
   inside the viewport, so only `scrollWidth` sees it.
8. **Browser text scaling and 200% zoom.** Nothing in fixed px that ignores the user's
   setting — older customers are a real share of this shop's audience.
9. **Turkish glyphs at 390px**, both faces, no mid-word fallback.
10. **Maps embed** responsive and lazily loaded, or tap-to-load (see `FINAL.md`).
11. **`tel:` is a dead end on desktop.** The number must also appear as selectable text
    wherever it appears as a button.
12. **Landscape phone** must not break the hero or the header.

**Done when — split 2026-09-08.** The measurable half is stage 3's; the half that needs
hardware moves to `FINAL.md` 4.2, against the live URL. A phone on mobile data is the real
test of the coin and the LCP anyway, and the site is not deployed yet.

*Stage 3:* e2e green at 320 / 360 / 390 / 768 · no horizontal scroll at 320px, asserted per
route · `dvh` hero · safe-area insets active · the coin's source breakpoint matching its
render width.

*Stage 4.2, on real hardware:* manual pass on one mid-range Android and one iPhone with
findings logged here · Lighthouse **mobile** performance ≥90 and accessibility 100 on the
homepage and one category, run in a real browser · LCP ≤2.5s on throttled 4G with the coin
in place.

> **First Lighthouse numbers, 2026-09-08 — local, and short of the targets.** Run against
> `next build && next start`, mobile form factor, simulated throttling. Not the deploy
> number: no CDN, no edge caching, and the run is a simulation rather than a device.
>
> | | perf | a11y | best-practices | SEO | LCP | CLS |
> |---|---|---|---|---|---|---|
> | `/` | **89** | 100 | 96 | 100 | **3.6 s** | 0 |
> | `/urunler/yuzuk` | 93 | 100 | 96 | 100 | **3.2 s** | 0 |
>
> Accessibility is 100 on both, which is the half §6 asks for outright. Performance is
> **below** the ≥90 target on the homepage and LCP is well over 2.5 s on both. Recorded as
> failing rather than explained away — 4.2 re-runs it on the deployed site, and if it still
> misses there, it is a real problem and not a measurement artefact.
>
> **Two things the run found that are not environmental:**
>
> 1. **On the homepage the LCP element is the coin `<video>`, not the H1.** `design.md`'s
>    performance budget says "LCP stays the H1, not the coin" — so this is a stated budget
>    being missed, and it would be missed on any hardware. 85–87% of LCP is *render delay*,
>    not network: `Load Delay` and `Load Time` are both 0 ms, so nothing is waiting on a
>    download. Fixing it means touching the hero, which the frontend freeze puts out of scope
>    for stage 3. Flagged for the 4.2 findings pass.
> 2. **`best-practices` 96 and the console errors are local-only.**
>    `/_vercel/insights/script.js` 404s under a local `next start` because that path is
>    served by Vercel's platform, not by Next, and the browser then refuses the `text/plain`
>    response. Neither exists on a deployment. Do not chase this one.
>
> Reproduce with `npx lighthouse@12 http://localhost:3200/ --only-categories=performance,accessibility,best-practices,seo`
> against `npx next start -p 3200`. **Do not pass `--preset=desktop`** — the first run here
> did, alongside `--form-factor=mobile`, and desktop won: it reported perf 100 and LCP 0.7 s,
> which is a different measurement wearing the right label.

## 7 · Accessibility on a dark ground

Dark palettes fail differently from light ones, so this gets its own pass: contrast measured
for `#E8E3DA` and `#9A958D` on espresso; gold checked wherever it carries meaning rather
than decoration; gold focus rings verified on both espresso and cream; tap targets ≥44px
re-audited after the redesign; `prefers-reduced-motion` and `prefers-reduced-data` both
honoured by the coin.

> **Measured 2026-09-08.** `tests/contrast.test.mts` does the arithmetic, parsing the tokens
> out of `app/globals.css` rather than restating them — a contrast test carrying its own copy
> of the hexes tests itself. `tests/a11y.spec.ts` does the half arithmetic cannot reach.
>
> **Every text pairing clears AA.** `cream-text` 14.55:1 on espresso, `muted` 6.25:1,
> `gold-soft` 8.71:1; on cream, `ink-text` 15.58:1, `ink-muted` 6.02:1, `gold-deep` 5.29:1.
> The two ratios `globals.css` states in prose — 5.3 and 6 — are exactly right and are now
> asserted, because they are the reason two tokens were changed at the 1.2 gate; a drift
> would make the reasoning recorded beside them false.
>
> **Focus rings resolve correctly on both grounds**, in a browser: gold-deep on the cream
> header, gold on the espresso body, gold-deep again on the skip link whose own fill is gold.
> Plain gold on cream measures **2.46:1**, below the 3:1 an indicator needs — which is
> precisely why the `.bg-frame` override exists. The test asserts the measurement *and* that
> the rule is still in the stylesheet, since the measurement alone would pass the day
> somebody deletes it.
>
> **Two real failures, both fixed.** "İletişim sayfasına dön" measured 20px on `/yol-tarifi`
> and `/telefon` — `chrome.spec.ts` had only ever measured the header, the footer and the
> FAB, never inside a page, and `/telefon` inherited it by being written from the other
> file's pattern. Nothing had checked 200% text scaling or that pinch-zoom is unblocked
> either; both are asserted now, the second because the Next docs show
> `maximumScale: 1, userScalable: false` in the same example as fields this site does set.
>
> **One thing measured and deliberately not graded.** The hairlines are `line-dark` at
> **1.30:1** on espresso and `line-light` at **1.18:1** on cream, far below 3:1. Not a
> failure — D11 separates sections by spacing first and treats the rule as a refinement —
> but whether they survive a phone in daylight is §13 risk 4 and needs real hardware: **4.2**.
>
> **`prefers-reduced-data` could not be tested here, and that is a fact about Chrome rather
> than about this site.** Chrome parses the feature but never matches it;
> `page.emulateMedia({ reducedData: "reduce" })` runs clean and leaves `matches` false,
> because no user-facing setting was ever shipped behind it. The flag that does fire for a
> visitor with Data Saver on is `navigator.connection.saveData`, which `HeroCoin` reads and
> which **is** tested, by stubbing it before any script runs. The media query itself is 4.2's
> to confirm, on a real Android.

## 8 · Repo hygiene

> **This section is verify-and-tidy, not build.** Everything below except the last line was
> already done in earlier sessions and verified on 2026-09-08. Recorded as ✅ rather than
> deleted, so a later session does not re-plan finished work.

- ✅ **`.gitattributes` with `* text=auto eol=lf`**, plus `*.bat text eol=crlf` and eleven
  binary declarations. `git ls-files --eol` shows every text file as `w/lf`; the only
  `w/crlf` is `catalogue.bat`, deliberately.
- ✅ **`sanity/` deleted.** No directory, no dependency, no reference. Git history keeps it.
- ✅ `app/dev/*` 404s in production — all four routes guard on
  `NODE_ENV === "production"` — and none appears in `sitemap.ts`.
- ✅ `ata_animation/` stays out of `public/`; only the rendered loop in `public/hero/` ships.
- ✅ `.gitignore` covers `catalogue/raw/`, `catalogue/fixed/`, `test-results/`,
  `.tmp.drive*/` and `images/`. **Added 2026-09-08:** `__pycache__/` and `*.py[cod]` — three
  `.pyc` files under the hand-vendored `ui-ux-pro-max` skill were tracked, having ridden in
  on the unignore that brings that whole tree back.
- ☐ Decide the fate of `holding-page/` once the real site is live. **Stage 4** — it is still
  what the domain serves.

## 9 · Analytics

Vercel Web Analytics, **Hobby (free) tier**: 50,000 events/month, **1-month reporting
window**, and **custom events are Pro-only**. So visitors, page views, referrers, devices
and country-level location work free; button clicks do not.

The workaround, which stays on the free tier: route the important CTAs through internal URLs
first. Directions link to `/yol-tarifi`, which is built. Phone needs a `/telefon` page that
fires the `tel:` link on load, rather than a redirect, because browsers handle redirects to
`tel:` inconsistently — and because a rendered page is what the analytics script needs in
order to fire at all. Cost is roughly one extra 100ms hop on the two actions that matter.

*(A third hop, `/wa` → `wa.me`, was specified here and is not needed: WhatsApp was removed
on 2026-09-08. With it gone the phone is one of the two actions worth counting rather than
the fallback for the other.)*

> **Built 2026-09-08.** `@vercel/analytics` is installed and `<Analytics />` renders from the
> root layout; it emits nothing outside a Vercel deployment, so the dev server, the e2e suite
> and the static build are unaffected. `/telefon` is a prerendered page carrying the number,
> both hour seasons and a fallback message, in the shape `/yol-tarifi` already proved.
>
> **Only the label-bearing buttons route through it** — `contactCta()`, which is what
> `CallFab` and `ContactButton` render. Every place the number itself is printed keeps a
> direct `tel:` link on the digits, so the number stays selectable text where `tel:` is a
> dead end (§6.11). That split was not a judgement call: every direct `phoneHref` use on the
> site already rendered `{phoneDisplay}`, and every `contactCta()` use rendered a label.
>
> One thing the hop costs, recorded because it is easy to forget: a unit test could
> previously assert `contactCta().href === phoneHref` — the button *was* the number, so it
> could not drift from it. A page sits in the middle now, so that guarantee is split between
> `tests/config.test.mts` and the e2e in `tests/telefon.spec.ts` and `tests/chrome.spec.ts`,
> which follow the button through to a rendered `tel:` carrying the real number.

Location granularity is country and region, not reliably city; for a shop in Kapaklı nearly
all traffic reads "Turkey", so the genuinely useful dimension is **referrer** — Instagram
versus Google.

The site collects no personal data — no forms, no accounts, no email — and Vercel Analytics
is cookieless, so no consent banner is required. That stays true only as long as nothing
tracking-heavy is added.

**The real measurement for this project is Search Console**, not analytics: queries,
position and impressions over 16 months. That is in `FINAL.md`.

## 10 · Domain and infrastructure

> **Security headers — added 2026-09-08, and not previously scoped.** There were none at
> all: no HSTS, no `X-Content-Type-Options`, no `Referrer-Policy`, nothing. `next.config.ts`
> now sets five on every path.
>
> `Referrer-Policy` is `strict-origin-when-cross-origin` rather than the tidier-looking
> `no-referrer`, deliberately: referrer is the one analytics dimension §9 calls genuinely
> useful for this shop — Instagram versus Google — and `no-referrer` would throw away the
> measurement the project wants. `X-Content-Type-Options` earns its place because
> `next.config.ts` already lets SVG through `next/image`, and MIME sniffing is how an SVG
> becomes a script. HSTS does nothing until the domain points at Vercel in 4.1, which is
> what makes it safe to land now.
>
> **Found while testing: `headers()` does not apply to redirect responses.** A 308 arrives
> with none of the five. That matters more here than on most sites — 26 of this domain's
> URLs *are* redirects, and they are what an old inbound link hits first, so a returning
> visitor's very first response carries no HSTS. The cost is one hop: the destination is the
> same origin and does carry it. `tests/headers.spec.ts` pins the behaviour so it is known
> rather than assumed, and fails if it ever changes. Measured against `next dev` — **Vercel's
> routing layer may apply headers to redirects itself, which is 4.2's to check against the
> live domain** rather than something to guess at from here.
>
> **The Content-Security-Policy landed separately, 2026-09-08** — report-only first, swept
> for violations across all 13 routes against a production build, then promoted to enforcing
> in the same pass.
>
> **There is no nonce, and that is forced rather than chosen.** The local Next guide is
> explicit: *"Static pages are generated at build time, when no request or response headers
> exist — so no nonce can be injected"*, and nonces *"must use dynamic rendering"*. Hard rule
> 9 keeps every route static, so a nonce would cost the whole build its `○`. Hashes were the
> alternative and were rejected: Next's inline bootstrap changes content per build, so the
> hash set would need regenerating on every deploy and would fail closed — blanking the site
> the first time somebody forgot.
>
> **So `script-src` carries `'unsafe-inline'`, and this CSP does not stop an injected inline
> script.** Worth stating plainly rather than leaving for someone to discover. What it does
> stop: a base-tag rewrite, an `<object>`/`<embed>`, a form posting somewhere else, this site
> being framed, and — the one that earns its keep here — any iframe other than Google Maps.
>
> **`frame-src` needs both `maps.google.com` and `www.google.com`.** The embed URL in
> `lib/config.ts` is the first; it **301s** to the second, and CSP re-checks `frame-src`
> against the redirect target. A policy naming only the URL we write would blank the map.
>
> **Two development-only allowances**, both read out of the source rather than guessed:
> `'unsafe-eval'`, because React uses `eval` in dev to rebuild error stacks, and
> `va.vercel-scripts.com`, because `@vercel/analytics` loads a debug script from there in dev
> and a same-origin `/_vercel/insights/script.js` in production. Production keeps
> `script-src 'self'` with no third-party origin. This is why the production sweep came back
> clean while the dev-server e2e suite went red — 13 tests, every interactive one, timing out
> at 30s because the page served but never hydrated.
>
> **⚠ One thing 4.2 must verify live.** `connect-src 'self'` covers the analytics beacon only
> if it posts to the deployment's own origin. The beacon lives inside the remote script,
> which loads only on a real Vercel deployment, so it cannot be observed from here.
> **A CSP that blocks the beacon fails silently** — no data, and a site that looks perfect.
> Same failure class as a blanked map, without the visible symptom.


`docs/domain-security-plan.md` is the reference. Landing in this stage: registrar lock and
contact accuracy at Natro, DNS pointing correctly, and confirming there are still no MX
records — the site asserts the shop has no email address, and a test enforces the absence of
a contact form on that basis.

## 11 · Runbook — adding a product

Written for six months from now, when the details have been forgotten.

> **Rehearsed end to end on 2026-09-08** (iteration 3.9) with a scratch photograph, then
> reverted — `public/urunler/` came out byte-identical, 61 files. The steps below are what
> the pipeline actually does. Three of them did not match what this section used to say, and
> the corrections are marked.

1. Photograph the piece per the brief in `CATALOGUE.md` — white paper, window light, out of
   the vitrin.

2. **Name the file `<kategori-slug>_<parça-adı>_<nn>.jpg`** and drop it in `catalogue/raw/`.
   *(New step. The naming rule was only written down in `catalogue.bat` and inside
   `scripts/catalogue.mjs`, never here — and it is the thing most likely to go wrong.)*
   All lowercase, hyphens inside each part, `nn` two digits for the angle:
   `yuzuk_burma-yuzuk_01.jpg`. The four slugs are `altin-seti`, `kupe-modelleri`, `yuzuk`,
   `ozel-tasarim-takilar`.

   Both likely mistakes fail loudly and write nothing:

   ```
   skipped  Yuzuk Deneme 97.jpg — name is not <kategori>_<parça>_<nn>
   skipped  pirlanta_deneme-98_01.jpg — "pirlanta" is not a published category
   ```

3. Run it. **`npm run catalogue`** on macOS or Linux; `catalogue.bat` is the Windows
   double-click wrapper around the same script. *(Corrected: this section named only the
   `.bat`, which does nothing on a Mac.)* Useful flags: `--only <substring>` to process one
   piece, `--force` to redo one that is already cached — a second run prints `cached` and
   changes nothing, which is intended.

   Node prints a `MODULE_TYPELESS_PACKAGE_JSON` warning about `lib/content.ts` first. It is
   noise, not a failure.

4. Check `catalogue/contact-sheet.html`. If a crop is off centre, the frame is crooked or
   the exposure does not match the rest of the sitting, fix that one file, put it in
   `catalogue/fixed/` under the same name, and run again — a fixed file wins over the raw
   one.

5. **The image is already published.** *(Corrected, and this is the one that would have
   wasted the most time: this section said "move the finished image into
   `public/urunler/<kategori>/`". There is nothing to move — the script writes there
   directly, and `lib/content.ts` reads the folder, so the product is on its category page
   and in `/galeri` the moment the script finishes. No sitemap edit, no code change.)*

6. **Add a line to `public/urunler/catalogue.json`** — keyed `<kategori>/<parça>`. *(Also
   corrected: this section called it optional, "if it needs a spec or a `featured` flag". It
   is where the `name` and the `alt` live too. Without it the name is derived from the slug
   in ASCII — `deneme-99` becomes `Deneme 99`, with no `ş`, `ğ` or `ü` — and the alt text
   falls back to that name. A piece will appear either way; it will just be named by a
   machine.)*

   ```json
   "yuzuk/burma-yuzuk": {
     "name": "Burma Yüzük",
     "alt": "Sarı altın burma yüzük, tezgâh üstünde."
   }
   ```

7. Commit and push. Vercel rebuilds on its own, usually in under two minutes.

To remove a product: delete the image, commit, push.

## 12 · Done when

> **Walked 2026-09-08 at the stage close.** Result per line below. Two items are honestly
> not met and are recorded as such rather than reworded until they pass.

- ~~Canonical name applied to every directory Soner controls~~ — **stage 4.** §2's own last
  paragraph says so: the repo half is enforced by `tests/source-invariants.test.mts`, and the
  directories are manual work `FINAL.md` owns. Stage 3 cannot satisfy this line and should
  not pretend to.
- ✅ All **five** gate items confirmed. *(Six until 2026-09-08; the WhatsApp item went with the
  channel. Every `pending` flag in `lib/config.ts` is already `false` — there is nothing left
  to flip.)*
- ✅ Copy gate green — `tests/copy.test.mts`, not a filler check. See §3.
- ✅ Redirect suite green against a **production build** — all 26 rules, one hop to 200; the
  five reclaimed paths return 200. Three coverage gaps closed, including the host rule.
- ✅ OG images present for the homepage and all **four** categories. *(Five until the 2026-09-08
  restructure retired `pirlanta`.)*
- ❌ **Lighthouse mobile ≥90 / a11y 100 — accessibility yes, performance no.** Measured
  locally: `/` **89**, `/urunler/yuzuk` 93; accessibility **100** on both. LCP 3.6 s and
  3.2 s against a ≤2.5 s target. The formal number is 4.2's, on the deployed site with a
  CDN — but this is short today and is written down as short. See §6 for the breakdown,
  including the part that is not environmental: on the homepage the LCP element is the coin
  `<video>`, where `design.md`'s budget says it should be the H1.
- ✅ `npm run build` — 21 routes, every one static, no `ƒ`. Verified by exit code and by the
  route table being present, not by grepping for the absence of a character.
- ✅ Full suite green: **78 unit** (including the retired-terms gate), **310 e2e dev**,
  **286 e2e prod**. `npm run verify` runs all six gates and exits 0.
- ✅ **NAP block diffed character-by-character**, three ways: the canonical block in §2
  against the `JewelryStore` JSON-LD on the built homepage — all five lines identical, 25 /
  39 / 24 / 14 / 33 characters — and against the visible text on `/` and `/iletisim`. No
  rival spelling anywhere in the built markup: no `56/A`, no `Blv.`, no `Kapaklı/Tekirdağ`
  without spaces, no Ziraat landmark, neither of the former partner's numbers.

### Not done, by decision rather than oversight

- **Öne Çıkanlar does not render.** `catalogue.json` sets `featured` on none of its 57
  products, so `getFeaturedProducts()` returns `[]` and the homepage section is absent. No
  product card carries an ayar/gram line either, for the same reason: `spec` is unset
  throughout. Both need Soner, and the stage-3 scope decision was that the frontend is
  frozen — "this stage only fixes the technical stuff". Naming it here so the stage does not
  close with a hidden homepage section counted as finished.
- **`/urunler/pirlanta` and the other retired paths** stay redirect sources, correctly.
- **The real-device pass** is 4.2's by the same decision. Everything measurable locally was
  done in 3.5 and 3.6.

## 13 · Risks

1. **The name applied unevenly** is worse than not doing it at all. It must move everywhere
   in the same week.
2. **Filler copy shipping.** Mitigated by the build gate, which is why it exists.
3. **Redirect regression from the redesign**, since the rules live in a file the redesign
   also touches.
4. **Dark-palette contrast failures** that pass automated checks and fail on a real phone in
   daylight. Only the device pass catches these.
