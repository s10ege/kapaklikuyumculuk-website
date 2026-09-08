# Trakya Kapaklı Kuyumculuk — Plan

> **This file is the index.** The work itself lives in four stage files, executed in
> order. The detailed record of the original build (iterations 0–16, milestones M1–M5)
> is preserved in [`docs/build-history.md`](docs/build-history.md).
>
> Last updated 2026-09-08.

## Context

`kapaklikuyumculuk.com` currently serves a single static holding page from Vercel.
The real site is a Turkish-language catalogue for a family jeweller in Kapaklı,
Tekirdağ. Its only job is to make a visitor confident enough to walk into the shop
or pick up the phone — no cart, no payments, no accounts.

The project's root problem is not design. Per `docs/index-cleanup-plan.md`, the shop's
name currently resolves to **two different addresses** across the web (a former
partner's shop still trades under the same name), across **3+ name variants**, **4
phone numbers**, and **2 districts**. Google hedges, and competitors outrank the shop
for its own name. The website is one input to fixing that — which is why the
architecture forces every business fact through a single module, and why the redirect
map is treated as the highest-risk artefact in the repo.

## Stages

Priority order. Each stage has its own file.

| # | File | Covers | Status |
|---|---|---|---|
| 1 | [`design.md`](design.md) | Ata Lirası hero animation, dark palette, full design approval | ✅ **approved in writing 2026-08-29** |
| 2 | [`CATALOGUE.md`](CATALOGUE.md) | Photography brief, image pipeline, product content | ✅ **approved 2026-09-08 — closed.** Categories 5 → 4 (`pirlanta` retired, `tek-tas-modelleri` → `yuzuk`), every page rewritten in the shop's voice with a build gate behind it, two-season hours, the canonical address at 56/C with real coordinates, a pin-only map and a platform-aware Yol Tarifi, Hakkımızda columns aligned, **WhatsApp removed — the phone is the only channel**. 57 products, four categories. Screenshots in `screenshots/final-tweaks/`. Approved in writing by Soner; `spec`, the `featured` four and the contact-sheet flags stay outstanding as content, not as gates |
| 3 | [`TECHNICAL.md`](TECHNICAL.md) | Brand name, SEO, mobile, remaining technical work | **← next, and now unblocked** — stage 2 approved 2026-09-08. Prepared 2026-08-29, still not opened. 3.1 is a ⛔ gate: five facts, and it must be read out loud before any stage-3 code |
| 4 | [`FINAL.md`](FINAL.md) | Google Business Profile, map and review widgets, deploy | blocked on 3 |

## Roadmap

Every iteration ends somewhere you can look at or run — no iteration finishes in a state
whose only proof is "the code exists". Iterations are sequential within a stage. The detail
behind each one lives in that stage's file; this is the execution order.

### Stage 1 — design.md

| # | Iteration | Ends when |
|---|---|---|
| 1.1 | **Render the coin loop** from `ata_animation/turkey_coin3.glb` — seamless ~16s loop, tilted axis, eased dwell, specular sweep, plus the still frame for reduced motion. Desktop and mobile sizes. | There is a file you can play, under the 500 KB mobile budget, and it loops without a visible seam |
| 1.2 | **Palette migration** — espresso tokens replace charcoal/cream throughout; cream header and footer; `#E8E3DA` body text; Bodoni restricted to ≥32px | Every existing page renders in the new palette with its layout unchanged |
| 1.3 | **Hero rebuild** — coin placement and sizing (D14), mobile order (D15), the warm glow, the old diamond motif retired | The homepage hero is finished at 390 / 768 / 1440 |
| 1.4 | **Chrome** — cream header, gold-deep lockup, cream mobile menu panel, cream footer | Nav works at all three breakpoints, tap targets ≥44px, focus rings visible on both grounds |
| 1.5 | **Interior pass** — category tiles (D16), section separation (D11), cream reading bands on Hakkımızda and Hizmetler (D10), Turkish filler swapped in | All eleven routes look deliberate in the new system |
| 1.6 | **Verification** — the eight checks in `design.md` § Done when. Ran long: at this gate Soner also removed the homepage eyebrows and replaced the display face (Bodoni → Marcellus → live trials → **Ibarra Real Nova 500**), all recorded in D8. Checks measured 2026-08-29; two (Android 60fps, CLS/LCP numbers) fold into stage 3.5 | Soner approves the design, in writing — ✅ **approved 2026-08-29** (monogram matched to 500 with it) |

**Gate 1→2:** no photography begins until the design is approved. The photography brief
depends on the final panel colour and image treatment.

### Stage 2 — CATALOGUE.md

| # | Iteration | Ends when |
|---|---|---|
| 2.1 | **Build the pipeline** — `scripts/catalogue.mjs` + `catalogue.bat`, one 1200px opaque WebP master (three sizes dropped — `next/image` derives them), contact sheet | ✅ **2026-08-29** — six trial photos through end to end; the 2.4 folder reader came forward so they render on the real pages (local-only, gitignored until 2.3). *Revised and reworked 2026-08-29: cut-outs dropped — photos ship polished with backgrounds kept (Claude does crop, straighten, exposure). rembg stripped, `PIPELINE_VERSION` 3, revised D16 built; all twelve re-run as opaque masters* |
| 2.2 | **Photograph** — per the brief, one category per sitting | ✅ **2026-08-29** — first real batch: 12 photos in `catalogue/raw/` (6 rings from 2.1 plus 4 kolye and 2 bilezik), 8 products across 4 categories |
| 2.3 | **Process and polish** — run the batch, polish with Claude (crop, straighten, exposure), re-run | ✅ **2026-09-07**, on a new machine (the first batch's raws, masters and `catalogue.json` stayed gitignored on the old one, so the catalogue was rebuilt from the full 61-frame shoot). Soner triaged a numbered artifact and kept 31 frames; multi-piece frames were cropped into single products, so 31 frames became **60 masters, 57 products, all ≤250 KB**. Polish pass into `catalogue/fixed/`: nine re-crops, four exposure lifts on the underexposed thin-bangle frame, one hangtag blurred out (`tek-tas-modelleri/yuzuk-04`), one tagged angle dropped. Left for Soner on the contact sheet: shop background still shows around the 29 Aug box shots (decided: tight crop, keep), hangtags remain visible on about six frames, and the red-velvet ring sitting is soft-focus. **`/public/urunler/` came out of `.gitignore` 2026-09-07** on Soner's word that stage 2 is over; the 60 masters and `catalogue.json` are committed. The contact-sheet flags above stand as notes for him, not blockers |
| 2.4 | **Folder-driven content** — `lib/content.ts` reads `public/urunler/`, `catalogue.json` for specs and `featured` | ◐ **reader unchanged; `catalogue.json` rewritten 2026-09-07** for all 57 products — a plain-Turkish `name` per Soner's instruction (simple terms: Bilezik, Kolye, Küpe, Yüzük, Takım, one qualifier at most) and a hand-written `alt`. All five categories retired `Yakında`; `/galeri` fills with 58 images. Outstanding, and **all of it needs Soner**: `spec` is absent on every entry (the gram tags in frame 165453 read 4.53 · 3.97 · 4.10 gr / 14K, and one bangle carries a 22 SEN hallmark — noted, not entered), `featured` is unset so Öne Çıkanlar stays hidden, and the names have not been checked against the pieces |
| 2.5 | **Verify with real images** — lightbox, `/galeri`, alt text, file sizes, LCP | ◐ **measured 2026-09-07 on a production build.** ✅ build fully static (20 routes, no `ƒ`), 46 unit tests green, Turkish alt on every image. ✅ **Lightbox with real images at 390 / 768 / 1440**: opens from the card, arrows step (`2 / 12`), Esc closes, focus returns to the card, the image loads in the dialog. ❌ **Card delivery: 11 of 60 masters exceed 80 KB at w=750** (worst 129 KB, `pirlanta/takim-01`) — every one a box/suede background; paper-sitting shots are 12–50 KB. Fix belongs to stage 3: a lower card `quality`, or tighter crops on those eleven. Outstanding: swipe on real touch hardware, homepage LCP |

**Stage 2 is over but not sealed (2026-09-07).** The catalogue is in the repo — 57 products,
all five categories — and the Hakkımızda page carries the founder, the owner and the
shopfront (`scripts/hakkimizda-photos.mjs`; originals in gitignored `images/hakkimizda/`).
Soner will keep playing with layout and text, so page-level changes are expected and do not
reopen the stage. The loop for further photographs is unchanged: drop them in `images/`,
agree a rename table against the five published slugs, copy into `catalogue/raw/`,
`npm run catalogue`, review the contact sheet. Three things still need Soner and nothing
else can substitute for them: the **ayar and gram** per piece, the **`featured` four**, and
a decision on the contact-sheet flags (hangtags, the soft-focus velvet rings).

### 2.6 — Final iteration, 2026-09-08

The last pass over stage 2, run on branch `final-tweaks`. Seven sections, one commit each,
`tsc` + lint + 66 unit + 210 e2e green at the end and the build still fully static
(20 routes, no `ƒ`).

| | What changed | Why it mattered |
|---|---|---|
| §1 | **Five categories became four.** `pirlanta` retired — every piece under it is white gold, not diamond — and `tek-tas-modelleri` → `yuzuk`, which was naming a subset of its own contents. Su yolu takımı → `altin-seti`, ten + five rings → `yuzuk`. Homepage and `/urunler` show four tiles in one row; the pale-gold "Tüm Ürünler" tile and the `/urunler` ask-cell are gone, replaced by a text link | The slug, the H1, the nav, the sitemap and the JSON-LD were all making a claim about the stock that the stock does not support |
| §1 | **Both retired paths 301 to `/urunler/yuzuk`**, and every rule that used to land on them now names the final destination. A new test follows each source one hop and requires a 200 on the far side | `/urun/tek-tas-modelleri` and `/urun/pirlanta-yuzukler` were two-hop chains for the length of one edit. A chain looks exactly like a working site |
| §2 | **Two opening-hour seasons**, both published all year, with today's emphasised client-side. 19:00 summer, 18:00 winter. JSON-LD emits three `openingHoursSpecification` entries — winter crosses New Year and `validFrom`/`validThrough` are dates, not a rule | A static build in August was telling a December visitor the shop is open until seven. The old ❌ grade on hours was never a data problem: every source had half a real seasonal pattern |
| §3 | **Address is `No: 56/C`**, `address.formatted` is the single spelling, the Ziraat landmark is gone, and the coordinates are published from the shop's own Maps listing — so JSON-LD carries `geo` and `hasMap` | A landmark is a second address in everything but name, and this project exists because the shop already has two circulating. The TSO registry's 56/A is quoted unedited in `business-facts.md`: evidence you have edited is worth nothing |
| §4 | **Pin-only map embed**, and a Yol Tarifi that asks on Apple platforms and goes straight to Google everywhere else. `/yol-tarifi` is a prerendered page, not a 302 | The old embed drew a *route* from "Kapaklı" to the shop — a trip planner where a location belonged. A 302 would have been dynamic *and* would never have fired the analytics beacon it exists to fire |
| §5 | **Hakkımızda columns end on the same line**, structurally: `items-stretch` + `h-full` + `object-cover`, asserted at 1024 / 1280 / 1440. Portraits moved below the grid, names kept per Soner | Padding can only be right at one viewport width |
| §6 | **Every page rewritten** in *sade esnaf sesi*. `lib/filler.ts` deleted, `lib/copy.ts` in its place, and `tests/copy.test.mts` is the gate `TECHNICAL.md` §3 specified but nobody had written | The old copy was not filler in the obvious sense — it was fluent and said nothing. The gate now fails the build if the copy stops answering what customers actually ask at the counter |

**Verification.** All 25 redirect sources curled against a production build: one 308 hop to a
200, every time; reclaimed paths 200; deliberate 404s 404; the `*.vercel.app` host still
redirects to the canonical domain. Retired terms appear in no page's rendered markup —
title, meta, JSON-LD and alt text included — asserted per route in `tests/seo.spec.ts` and
backed at source level by `npm run gate:terms`. Screenshots at 390 / 768 / 1440 for `/`,
`/urunler`, `/urunler/yuzuk`, `/urunler/altin-seti`, `/hakkimizda`, `/iletisim` and the 404
are in `screenshots/final-tweaks/`.

### 2.7 — WhatsApp removed, 2026-09-08

The pass above left one boolean outstanding: the copy named WhatsApp, `whatsapp.pending` was
still `true`, and confirming the number would have switched the buttons and the sentences
together. Soner's answer was to remove the channel instead — **the shop takes calls.**

So the fallback became the only path, and everything built for the other one came out: the
number, the `wa.me` branch, the `productName` prefill that four components passed, the
WhatsApp icon, the `#25D366` palette token, and the green state of the floating button that
never shipped. The five copy lines that named a channel collapse to the phone versions that
were already written beside them — no sentence was rewritten. The floating button is
`CallFab` now and looks exactly as it always has, because the pending fallback *was* what
shipped.

This reverses `TECHNICAL.md` §9, which made WhatsApp "the site's one CTA", so the reversal is
recorded rather than quietly applied — here, in `TECHNICAL.md`, in `design.md` D15 and in
`docs/business-facts.md`. The stage-3 confirmation gate drops from six facts to five: there
is no longer a WhatsApp number to confirm. `/wa`, the planned analytics hop, is dropped with
it.

Two source invariants and a rendered-markup gate now enforce the absence, so it cannot creep
back by accident.

**Gate 2→3. ✅ Satisfied 2026-09-08.** Stage 2 is approved and closed, so this gate is no
longer being crossed on a technicality — it is simply open.

It was crossed deliberately on 2026-08-29, on Soner's instruction, with stage 2 paused and
the catalogue unapproved; the reasoning then was that the gate's actual concern is *"the
catalogue is approved before any directory or Google work starts"*, that work being stage 4.
That reasoning is moot now. The constraint it carried — that stage 3.3 could not finish
without an approved catalogue — is lifted with it: the catalogue is in the repo, approved,
and 3.3's per-category `ItemList` and OG cards have real product images to work from.

### Stage 3 — TECHNICAL.md

| # | Iteration | Ends when |
|---|---|---|
| 3.1 | **⛔ Confirmation gate** — **Claude stops here and asks**, in the session that writes the code. The five facts, named so they cannot be skimmed past: **(1)** the canonical name, character-for-character · **(2)** the full address block, character-for-character · **(3)** `0282 717 55 62` — still in use? · **(4)** opening hours including the winter closing time · **(5)** that the Altın Alım–Satım copy on `/hizmetler` matches how the shop actually operates. *(Six until 2026-09-08; the WhatsApp item went with the channel.)* | Facts confirmed; hours and phones correct in `lib/config.ts` |
| 3.2 | **Copy** — Soner's real Turkish text replaces the filler; filler build gate added | The gate fails a build containing filler, and passes on the real copy |
| 3.3 | **SEO** — metadata, JSON-LD with real product images, sitemap from the folders, `/studio` disallow removed, **OG images** for the homepage and five categories | Rich Results Test passes locally; a shared link previews correctly |
| 3.4 | **Redirects re-verified** after the redesign | All 24 rules 301 correctly; the five reclaimed paths return 200 |
| 3.5 | **Mobile device pass** — one Android, one iPhone, real hardware | Findings logged and fixed; no horizontal scroll at 320px; Lighthouse mobile ≥90 / a11y 100 |
| 3.6 | **Accessibility on dark** — contrast, focus, reduced motion and reduced data | Measured, not assumed |
| 3.7 | **Repo hygiene** — `.gitattributes`, delete `sanity/`, gitignore, dev routes 404 in production | `git status` is clean of line-ending noise |
| 3.8 | **Analytics plumbing** — `/telefon` so clicks count on the free tier (`/yol-tarifi` is built; `/wa` is not needed since WhatsApp was removed) | Each records as a page view and forwards correctly |
| 3.9 | **Runbook proven** — add one product end to end following `TECHNICAL.md` §11 | The runbook works as written, without improvisation |

**Two things the stage-3 session should know before it starts** (recorded 2026-08-29, when
the stage was prepared but deliberately not opened):

1. ~~**The paused catalogue blocks part of 3.3 and only 3.3.**~~ **No longer true — resolved
   2026-09-08.** Two items in 3.3 needed product images that exist *in the repo*, and at the
   time none did. They do now: `/public/urunler/` came out of `.gitignore` on 2026-09-07 and
   the stage closed approved on 2026-09-08, so the per-category `ItemList` carries real
   image URLs already, and the per-category OG cards have 57 products to build from. Nothing
   in stage 3 is blocked on the catalogue any more. 3.9 is still *written but not proven*
   until something is published.
2. **3.7 is mostly already done, uncommitted work from earlier sessions.** `.gitattributes`
   exists with `* text=auto eol=lf`; `sanity/` is gone; `catalogue/raw/`, `images/` and
   `/public/urunler/` are gitignored; all four `app/dev/*` routes guard on
   `NODE_ENV === "production"` and call `notFound()`. Treat 3.7 as verify-and-tidy, not
   build.

**Gate 3→4:** nothing is deployed and nothing on Google is touched until stage 3 is approved.

### Stage 4 — FINAL.md

| # | Iteration | Ends when |
|---|---|---|
| 4.1 | **Deploy** to Vercel, then point DNS at it | HTTPS live, `www` and apex resolving to one canonical host |
| 4.2 | **Verify live** — redirect suite against production, rich results, the coin on a real phone on mobile data | `FINAL.md` § Live verification is green |
| 4.3 | **Search Console** (Domain property), sitemap, indexing request, **removals for `/urun/`, `/wp-content/`, `/author/` only** — then Bing, then Yandex | Submitted and confirmed; `/urunler/` untouched |
| 4.4 | **GBP ownership request** — may start in parallel with 4.1; takes 3–7 days | Access granted, or escalation under way |
| 4.5 | **GBP corrections** — name, website, category, phones, address, hours, 10+ photos, reply to the review. Spread over a week, never in one hour | Profile matches the canonical block character-for-character |
| 4.6 | **Directory cleanup** — Steps 3–5 of `docs/index-cleanup-plan.md` with the new name | Priority listings corrected; request dates logged for chasing |
| 4.7 | **Reviews** — acquisition only. The widget stays out until ~4.0+ across 10+ reviews | A review-asking routine exists at the counter |
| 4.8 | **Re-verify at 30 days** — Step 8 of the cleanup plan, then monthly | Baseline recorded and compared |

## Working agreement

1. **No stage begins without Soner's explicit approval.** Not implied by silence, not
   inferred from an earlier message, not carried over from a previous session.
2. **On approval**, that stage's file and this table are both updated before the next
   file opens.
3. **Confirmation gates block code.** `TECHNICAL.md` §1 carries a ⛔ gate listing facts
   Soner must confirm in writing before that iteration starts. If asked to begin that
   work without them, stop and ask.
4. **Turkish filler, never Latin.** Placeholder copy uses Turkish text carrying the full
   glyph set (`ı İ ğ ş ç ö ü`), so the font fallback checks stay meaningful. A build
   gate in `TECHNICAL.md` §3 fails if filler survives to launch.

## Where the build stands

As of commit `a48f740` (2026-08-19), before this redesign:

- 11 routes, all prerendered static, zero server rendering.
- 41 unit tests and 146 end-to-end tests green. `tsc --noEmit` clean.
- Launch content state: `PRODUCTS` is empty, so all five categories and `/galeri`
  correctly show the `Yakında` panel.
- **Not deployed.** The domain still serves the holding page, and no Vercel project
  is linked.

And at the end of the 1.6 verification (2026-08-29):

- Redesign complete on all 11 routes: espresso/cream palette, coin hero, new chrome,
  interior pass, homepage eyebrows removed, display face **Ibarra Real Nova 500**.
- 41 unit and 150 end-to-end tests green (font, hero, redirect and layout suites
  included). `tsc --noEmit` clean. Build fully static, zero `ƒ` markers.
- Still not deployed. **Stage 1 approved in writing 2026-08-29**; `CATALOGUE.md`
  stays unopened until Soner explicitly starts stage 2.

## Decisions locked

| # | Decision | Where |
|---|---|---|
| 1 | Brand name **`Trakya Kapaklı Kuyumculuk`** — title case as the canonical stored string everywhere; all-caps only ever as a CSS display treatment | `TECHNICAL.md` §1 |
| 2 | **Espresso** `#17120E` body with **cream** `#F4F0E8` header and footer | `design.md` D6 |
| 3 | Ata Lirası coin in the homepage hero, turning continuously on a tilted axis | `design.md` D1–D3 |
| 4 | Pre-rendered loop from the GLB; live 3D only if cursor interaction is ever wanted | `design.md` D2 |
| 5 | **No CMS.** Folder-driven catalogue; Soner adds images himself | `CATALOGUE.md` §3 |
| 6 | **No individual product pages.** Category pages carry the SEO, the lightbox carries the detail | `CATALOGUE.md` §3 |
| 7 | Hours publish 09:00–20:00 pending confirmation; closing shifts winter↔summer | `TECHNICAL.md` §2 |
| 8 | Redirect map lives in `next.config.ts` — verified against `docs/old-urls.txt` | `TECHNICAL.md` §4 |
| 9 | Vercel Analytics on the free tier, with `/telefon` and `/yol-tarifi` giving click counts | `TECHNICAL.md` §9 |
| 10 | Display face **Ibarra Real Nova, weight 500** (replacing Bodoni Moda after a three-round selection); homepage section eyebrows removed, interior pages keep theirs | `design.md` D8 |

## Decisions overturned

Recorded so nobody re-implements a superseded decision from `docs/build-history.md`.

| Was | Now | Why |
|---|---|---|
| Alternating charcoal/cream bands, ~50/50 | Fully dark espresso body, cream header and footer only | The coin and the logo both work harder on dark; the cream frame supplies the warmth |
| Sanity schemas written, wired in phase two | **No CMS at all.** `sanity/` deleted | Soner adds products himself; a CMS nobody logs into is a slower file editor |
| `siteSettings` document holding seasonal hours | Hours are a one-line edit in `lib/config.ts` | Follows from the above. The hours that matter most live on the Google profile anyway |
| Scroll-scrubbed hero animation | Continuous rotation, no scroll linkage | Simpler, cheaper, and it avoids scroll-jacking on mobile |
| Redirect map in `vercel.json` | `next.config.ts` | Already true in the code; the original decision was stale |
| Canonical name `Kapaklı Kuyumculuk` (per `docs/index-cleanup-plan.md`) | `Trakya Kapaklı Kuyumculuk` | Soner's decision. Both Google docs corrected accordingly |

## Two traps worth knowing about

1. **Never request Search Console removal of the `/urunler/` prefix.** The old doc lists
   it, written when only a holding page was live. `/urunler/` is now the live catalogue —
   removing that prefix would hide all five category pages for ~6 months. Corrected in
   `FINAL.md` and in `docs/index-cleanup-plan.md`.
2. **The brand name must move everywhere at once.** Publishing
   `Trakya Kapaklı Kuyumculuk` while the directories still say something else adds a
   fourth name variant rather than replacing three — the exact failure this project
   exists to fix. Launch-blocking, not follow-up.

## Phase two — after all four stages

- Gold price ticker. The header slot exists and is empty (`#gold-ticker-slot`).
- Real photography beyond the launch catalogue.
- Reviews widget, once the Google rating supports showing it (`FINAL.md`).

## Not doing, and why

- **Archived product photos.** 111 JPGs under `/wp-content/uploads/2015/12/`. 2015-era
  1024px amateur shots would need replacing anyway.
- **A contact form.** The domain has no MX records, so there is no address to deliver
  to. A form would silently swallow every message; a test enforces its absence.
- **Coordinates in the schema.** Graded ❌, sources differ by ~150 m. The maps embed
  keys on the address string instead.
