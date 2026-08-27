# Trakya Kapaklı Kuyumculuk — Plan

> **This file is the index.** The work itself lives in four stage files, executed in
> order. The detailed record of the original build (iterations 0–16, milestones M1–M5)
> is preserved in [`docs/build-history.md`](docs/build-history.md).
>
> Last updated 2026-08-27.

## Context

`kapaklikuyumculuk.com` currently serves a single static holding page from Vercel.
The real site is a Turkish-language catalogue for a family jeweller in Kapaklı,
Tekirdağ. Its only job is to make a visitor confident enough to walk into the shop
or send a WhatsApp message — no cart, no payments, no accounts.

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
| 1 | [`design.md`](design.md) | Ata Lirası hero animation, dark palette, full design approval | **← current** |
| 2 | [`CATALOGUE.md`](CATALOGUE.md) | Photography brief, image pipeline, product content | blocked on 1 |
| 3 | [`TECHNICAL.md`](TECHNICAL.md) | Brand name, SEO, mobile, remaining technical work | blocked on 2 |
| 4 | [`FINAL.md`](FINAL.md) | Google Business Profile, map and review widgets, deploy | blocked on 3 |

## Roadmap

Every iteration ends somewhere you can look at or run — no iteration finishes in a state
whose only proof is "the code exists". Iterations are sequential within a stage. The detail
behind each one lives in that stage's file; this is the execution order.

### Stage 1 — design.md  ← current

| # | Iteration | Ends when |
|---|---|---|
| 1.1 | **Render the coin loop** from `ata_animation/turkey_coin3.glb` — seamless ~16s loop, tilted axis, eased dwell, specular sweep, plus the still frame for reduced motion. Desktop and mobile sizes. | There is a file you can play, under the 500 KB mobile budget, and it loops without a visible seam |
| 1.2 | **Palette migration** — espresso tokens replace charcoal/cream throughout; cream header and footer; `#E8E3DA` body text; Bodoni restricted to ≥32px | Every existing page renders in the new palette with its layout unchanged |
| 1.3 | **Hero rebuild** — coin placement and sizing (D14), mobile order (D15), the warm glow, the old diamond motif retired | The homepage hero is finished at 390 / 768 / 1440 |
| 1.4 | **Chrome** — cream header, gold-deep lockup, cream mobile menu panel, cream footer | Nav works at all three breakpoints, tap targets ≥44px, focus rings visible on both grounds |
| 1.5 | **Interior pass** — category tiles (D16), section separation (D11), cream reading bands on Hakkımızda and Hizmetler (D10), Turkish filler swapped in | All eleven routes look deliberate in the new system |
| 1.6 | **Verification** — the eight checks in `design.md` § Done when | Soner approves the design, in writing |

**Gate 1→2:** no photography begins until the design is approved. The photography brief
depends on the final panel colour and image treatment.

### Stage 2 — CATALOGUE.md

| # | Iteration | Ends when |
|---|---|---|
| 2.1 | **Build the pipeline** — `scripts/catalogue.mjs` + `catalogue.bat`, rembg + BiRefNet, transparent WebP at three sizes, contact sheet | Three sample photos go in and three usable images come out |
| 2.2 | **Photograph** — per the brief, one category per sitting | Raw photos exist in `catalogue/raw/` |
| 2.3 | **Process and repair** — run the batch, fix failures in Photopea, re-run | Contact sheet approved by Soner |
| 2.4 | **Folder-driven content** — `lib/content.ts` reads `public/urunler/`, `catalogue.json` for specs and `featured` | Categories show real products; `Yakında` retires itself; Öne Çıkanlar appears, capped at four |
| 2.5 | **Verify with real images** — lightbox, `/galeri`, alt text, file sizes, LCP | `CATALOGUE.md` § Done when is green |

**Gate 2→3:** the catalogue is approved before any directory or Google work starts.

### Stage 3 — TECHNICAL.md

| # | Iteration | Ends when |
|---|---|---|
| 3.1 | **⛔ Confirmation gate** — the six facts in `TECHNICAL.md` §1, confirmed in writing by Soner. **Claude stops here and asks.** | Facts confirmed; `whatsapp.pending` flipped; hours and phones correct in `lib/config.ts` |
| 3.2 | **Copy** — Soner's real Turkish text replaces the filler; filler build gate added | The gate fails a build containing filler, and passes on the real copy |
| 3.3 | **SEO** — metadata, JSON-LD with real product images, sitemap from the folders, `/studio` disallow removed, **OG images** for the homepage and five categories | Rich Results Test passes locally; a shared link previews correctly |
| 3.4 | **Redirects re-verified** after the redesign | All 24 rules 301 correctly; the five reclaimed paths return 200 |
| 3.5 | **Mobile device pass** — one Android, one iPhone, real hardware | Findings logged and fixed; no horizontal scroll at 320px; Lighthouse mobile ≥90 / a11y 100 |
| 3.6 | **Accessibility on dark** — contrast, focus, reduced motion and reduced data | Measured, not assumed |
| 3.7 | **Repo hygiene** — `.gitattributes`, delete `sanity/`, gitignore, dev routes 404 in production | `git status` is clean of line-ending noise |
| 3.8 | **Analytics plumbing** — `/wa`, `/yol-tarifi`, `/telefon` routes so clicks count on the free tier | Each records as a page view and forwards correctly |
| 3.9 | **Runbook proven** — add one product end to end following `TECHNICAL.md` §11 | The runbook works as written, without improvisation |

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
| 9 | Vercel Analytics on the free tier, with `/wa` and `/yol-tarifi` giving click counts | `TECHNICAL.md` §9 |

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
