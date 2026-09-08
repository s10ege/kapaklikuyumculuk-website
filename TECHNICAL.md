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
  from a script on a rendered page, so a redirect fires nothing. `/telefon` is still to
  build and `@vercel/analytics` is still not installed. `/wa` is no longer needed —
  WhatsApp was removed on 2026-09-08, in the same pass.

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

24 rules in `next.config.ts`, verified against the 309 URLs in `docs/old-urls.txt`.

- Every old path returns **301** with the correct `location`.
- The reclaimed paths — `/urunler`, `/urunler/ozel-tasarim-takilar`, `/galeri`,
  `/hakkimizda`, `/iletisim` — return **200, not 301**. This is the check that protects the
  domain's index history.
- **No chains.** Every source reaches a 200 in one hop. `/urunler/pirlanta` and
  `/urunler/tek-tas-modelleri` became redirect sources on 2026-09-08 when the categories
  were restructured, so any rule still aimed at either one is a two-hop chain.
- The deliberate 404s stay 404: `/wp-admin*`, `/wp-login.php*`, `/wp-content/*`,
  `/author/*`, `/category/*`, `/?p=*`, `/anasayfa2`, `/slide-types/*`.
- **`robots.txt` must not block the old paths.** A blocked URL is never crawled, so Google
  never sees the 301 and never drops it.

The redesign touches `next.config.ts`, so the suite runs on every change, not only at the
end. Proven locally here; proven live in `FINAL.md`.

## 5 · SEO after the redesign

- Title pattern, from the old indexed template:
  `%page% - Trakya Kapaklı Kuyumculuk | 0282 717 21 31 | Kapaklı`.
- `JewelryStore` JSON-LD site-wide, generated from `lib/config.ts`, **omitting `geo`** —
  sources differ by ~150 m and a wrong pin is worse than none. `sameAs`: Instagram +
  Facebook.
- `BreadcrumbList` on every page; `ItemList` of `Product` per category, **now carrying real
  image URLs**, which it could not before.
- **OG images** — new requirement from the redesign. A dark card with the coin and the
  lockup as the site-wide default, plus per-category cards using a product image. There is
  currently nothing, so every share of the link looks broken — and sharing a link is
  still how this shop's customers pass it on, whatever they share it in.
- `sitemap.ts` regenerated from the folder-driven catalogue, so a new product needs no
  sitemap edit. **Drop the `/studio` disallow** — there is no Studio.
- Targets stay local: **`kapaklı kuyumcu`, `kapaklı altın`, `tekirdağ altın seti`**. Not
  `altın bilezik` on its own — that is competing nationally against chains with budgets.
  (`tekirdağ pırlanta` was a target until 2026-09-08. The pırlanta category was retired —
  the pieces are white gold — so the shop no longer competes on a word it cannot back.)

## 6 · Mobile — adaptation and verification

Layout decisions for phones live in `design.md` (D15). This section is device-level
correctness and the things only real hardware reveals.

Baseline carried over: Tailwind mobile-first, breakpoints proven at 390 / 768 / 1440,
hamburger panel listing the five categories first, tap targets ≥44px (§7).

1. **Real-device pass, not emulator.** Minimum: one mid-range Android (Chrome and Samsung
   Internet) and one iPhone (Safari — Chrome for iOS is Safari underneath, so it is not a
   second engine). Emulators do not reproduce URL-bar behaviour, touch latency or font
   rendering.
2. **The coin at phone size.** Budget ≤500 KB, rotation pauses off-screen, still frame under
   `prefers-reduced-motion` and `prefers-reduced-data`.
3. **`100dvh`, not `100vh`.** iOS Safari's collapsing URL bar makes a `vh` hero jump
   mid-scroll. `dvh` with a `vh` fallback.
4. **Safe-area insets.** The call FAB must clear the iOS home indicator
   (`env(safe-area-inset-bottom)`) and must never sit on the last row of a product grid.
5. **Lightbox on touch.** Swipe to step through, close button in thumb reach, focus trap
   that does not fight the on-screen keyboard, pinch-zoom not blocked. Currently proven with
   keyboard and mouse only.
6. **Sticky header height** on a 667px-tall screen — decide between shrink-on-scroll and
   accepting the cost.
7. **No horizontal scroll at 320px**, on any route. The most common regression after a
   redesign.
8. **Browser text scaling and 200% zoom.** Nothing in fixed px that ignores the user's
   setting — older customers are a real share of this shop's audience.
9. **Turkish glyphs at 390px**, both faces, no mid-word fallback.
10. **Maps embed** responsive and lazily loaded, or tap-to-load (see `FINAL.md`).
11. **`tel:` is a dead end on desktop.** The number must also appear as selectable text
    wherever it appears as a button.
12. **Landscape phone** must not break the hero or the header.

**Done when:** manual pass completed on two real devices with findings logged here · e2e
green at 390 and 768 · Lighthouse **mobile** performance ≥90 and accessibility 100 on the
homepage and one category · no horizontal scroll at 320px · LCP ≤2.5s on throttled 4G with
the coin in place.

## 7 · Accessibility on a dark ground

Dark palettes fail differently from light ones, so this gets its own pass: contrast measured
for `#E8E3DA` and `#9A958D` on espresso; gold checked wherever it carries meaning rather
than decoration; gold focus rings verified on both espresso and cream; tap targets ≥44px
re-audited after the redesign; `prefers-reduced-motion` and `prefers-reduced-data` both
honoured by the coin.

## 8 · Repo hygiene

- **Add `.gitattributes` with `* text=auto eol=lf`.** Six files currently show as modified
  purely from CRLF line endings — noise that hides real changes.
- **Delete `sanity/`.** Git history keeps it.
- `app/dev/*` must 404 in production and stay out of the sitemap — verify after the redesign.
- Keep `ata_animation/` as source assets, **out of `public/`**. Only the rendered loop ships.
- `.gitignore` for `catalogue/raw/`, `test-results/`, `.tmp.driveupload/`.
- Decide the fate of `holding-page/` once the real site is live.

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

Location granularity is country and region, not reliably city; for a shop in Kapaklı nearly
all traffic reads "Turkey", so the genuinely useful dimension is **referrer** — Instagram
versus Google.

The site collects no personal data — no forms, no accounts, no email — and Vercel Analytics
is cookieless, so no consent banner is required. That stays true only as long as nothing
tracking-heavy is added.

**The real measurement for this project is Search Console**, not analytics: queries,
position and impressions over 16 months. That is in `FINAL.md`.

## 10 · Domain and infrastructure

`docs/domain-security-plan.md` is the reference. Landing in this stage: registrar lock and
contact accuracy at Natro, DNS pointing correctly, and confirming there are still no MX
records — the site asserts the shop has no email address, and a test enforces the absence of
a contact form on that basis.

## 11 · Runbook — adding a product

Written for six months from now, when the details have been forgotten.

1. Photograph the piece per the brief in `CATALOGUE.md` — white paper, window light, out of
   the vitrin.
2. Drop the photo into `catalogue/raw/` and run `catalogue.bat`.
3. Check the contact sheet. If a crop is off centre, the frame is crooked or the exposure
   does not match the rest of the sitting, fix that one file, put it in `catalogue/fixed/`
   under the same name, and run again — a fixed file wins over the raw one.
4. Move the finished image into `public/urunler/<kategori>/`, add a line to `catalogue.json`
   if it needs a spec or a `featured` flag, then commit and push. Vercel rebuilds on its own,
   usually in under two minutes.

To remove a product: delete the image, commit, push.

## 12 · Done when

- Canonical name applied to every directory Soner controls, character-for-character.
- All six gate items confirmed and the pending flags flipped.
- Filler gate green — no placeholder copy in the build.
- Redirect suite green locally; reclaimed paths return 200.
- OG images present for the homepage and all five categories.
- Lighthouse mobile ≥90 performance / 100 accessibility on the homepage and one category.
- `npm run build` — every route static, no `ƒ`.
- Full unit and e2e suite green.
- NAP block diffed character-by-character against `lib/config.ts` and the canonical block.

## 13 · Risks

1. **The name applied unevenly** is worse than not doing it at all. It must move everywhere
   in the same week.
2. **Filler copy shipping.** Mitigated by the build gate, which is why it exists.
3. **Redirect regression from the redesign**, since the rules live in a file the redesign
   also touches.
4. **Dark-palette contrast failures** that pass automated checks and fail on a real phone in
   daylight. Only the device pass catches these.
