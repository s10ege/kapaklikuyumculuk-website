# Trakya Kapaklı Kuyumculuk — Build Plan

> Approved 2026-08-19. Progress is tracked by ticking iterations in the Roadmap table.
> Facts come from `docs/`; the spec (v1.0) is referenced as §n throughout.

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

Spec v1.0 (§ references throughout) is the contract. `docs/` supplies the verified
facts. Where they disagree, this plan records the resolution.

---

## Decisions locked

| # | Decision |
|---|---|
| 1 | **Brand name: `Trakya Kapaklı Kuyumculuk`** — per §2, reaffirmed after review (see Risk 1) |
| 2 | **Palette: alternating charcoal/cream bands, ~50/50** — extends §3's logic down the page |
| 3 | **Hours: publish 09:00–20:00, owner-editable in phase two** — closing shifts winter↔summer |
| 4 | **No photo rescue** — SVG placeholders only per §12; real photography in phase two |
| 5 | **Scaffold in place**, `git init` here, keep `holding-page/` as reference |
| 6 | **`vercel.json` wildcard rules are the redirect map** — verified against `docs/old-urls.txt` |

---

## How the work is split

Three rules produced the iteration boundaries below:

1. **Every iteration ends somewhere you can look at or run.** No iteration finishes in
   a state whose only proof is "the code exists".
2. **Things that must change together stay together; things that merely happen nearby
   are split.** Tokens and fonts ship as one unit because a token change without the
   font is untestable. `config.ts` and `content.ts` are split despite both being "the
   data layer" — they have different consumers, different failure modes, and one is
   business facts while the other is catalogue structure.
3. **Anything whose failure is silent gets its own iteration and its own gate.** The
   redirect map, the `latin-ext` font subset and the pending mechanism all fail
   invisibly — a wrong redirect looks like a working site, and a missing subset looks
   like a font choice. Each is isolated so its verification can't be skipped.

Iterations are sequential unless marked ⇄ (independent — order free, or parallel).

---

## Roadmap

| Milestone | Iterations | Ends when |
|---|---|---|
| **M1 Foundation** | 0–5 | `npm run build` passes; tokens, fonts, images, and both data modules are typed and tested. Nothing user-visible yet. |
| **M2 Shell & template** | 6–8 | Chrome and the category template work at all breakpoints, with the empty state and lightbox proven. This is the riskiest UI and it lands before any page depends on it. |
| **M3 Pages** | 9–12 | All nine routes exist with real Turkish copy. |
| **M4 Launch infrastructure** | 13–15 | Redirects, SEO and phase-two schemas in place. |
| **M5 Ship** | 16 | Verified and deployed. |

**Gate between M1 and M2:** run `frontend-design` + `ui-ux-pro-max` on the token set
before building chrome. Cheap to redirect the look here, expensive after iteration 9.

**Gate between M3 and M4:** the redirect table must be written *before* deploy but
verified *after* — iteration 13 builds it, iteration 16 proves it.

---

# M1 — Foundation

### Iteration 0 · Environment & skills
No app code.

- `git init`; initial commit of the existing planning workspace as-is.
- Delete `holding-page/_to_delete/` (two stray write-test files that would otherwise ship).
- `.claude/settings.json` → `"enabledPlugins": { "frontend-design@claude-plugins-official": true }`.
  If the scope pin in `~/.claude/plugins/installed_plugins.json` (currently bound to
  `projects/portfolio`) blocks it, install fresh instead:
  `npx skills add anthropics/skills@frontend-design`
- Copy `projects/JobPilot/.claude/skills/ui-ux-pro-max/` → `.claude/skills/`
- `npx skills add vercel-labs/agent-skills@vercel-react-best-practices`
  · `@vercel-composition-patterns` · `@web-design-guidelines`
- `npx skills add anthropics/skills@webapp-testing`

**Done when:** all four skills resolve in this project, and `git log` has one commit.

**Where each skill earns its keep** — not uniformly:
- `frontend-design` + `ui-ux-pro-max` → the M1→M2 gate.
  ⚠️ `frontend-design` explicitly names *cream + serif + gold* as a clichéd AI
  aesthetic. §3 picks exactly that, and it is correct here because it comes from the
  logo. Read the skill for its calibration section, not its palette advice — the job is
  making the execution (sharp corners, hairline grid gaps, no shadows) read as
  deliberate rather than default.
- `vercel-composition-patterns` → iteration 8 (lightbox).
- `vercel-react-best-practices` → after iteration 8.
- `web-design-guidelines` → audit at the end of each milestone.
- `webapp-testing` → iterations 8 and 16.

---

### Iteration 1 · Scaffold
Next.js App Router + TypeScript + Tailwind. Strict `tsconfig` incl.
`noUncheckedIndexedAccess`. Merge the existing `.gitignore`.

**Done when:** `npm run dev` serves the default page and `npm run build` passes.

---

### Iteration 2 · Tokens & fonts
Split from the scaffold because this is where the silent failure lives.

§3's values verbatim into the Tailwind theme. **Never name a token `base`** (§12 —
collides with `text-base`); the page background token is `cream`.

```
gold #B8964F · gold-deep #8A6D2F · gold-soft #CBAE72 · gold-pale #EFE7D6
charcoal #2A2724 · charcoal-deep #1A1816
cream #FBFAF7 · surface #FFFFFF · ink #1C1917 · ink-muted #6B6560
line #E8E3DA · whatsapp #25D366
```

Self-host Cormorant Garamond (display) + Inter (body) via `@fontsource`.
**The `latin-ext` subset is mandatory** — without it `ı İ ğ ş ç ö ü` fall back to a
different font mid-word, which reads as a font choice rather than a bug.

Rules that carry the whole look: gold is a **hairline accent, never a fill**; radius
0–2px; **no shadows**; grid gaps are 1px of `line` showing through, not margins.

**Done when:** a scratch page renders the full type scale and every Turkish glyph in
both faces, screenshotted at 390px and 1440px with no mid-word fallback.

---

### Iteration 3 · Image pipeline & placeholder motifs ⇄
Before anything that displays an image, so no component is written twice.

`next/image` configured from day one with `dangerouslyAllowSVG` + sandbox CSP (§12).
Draw the placeholder set: gold line-art motifs on charcoal for category tiles, on cream
for product cards. They must read as deliberate — that is what makes it obvious which
images still need replacing, unlike grey boxes.

**Done when:** placeholders render through `next/image`, and swapping one for a JPEG is
a file change with no component edit.

---

### Iteration 4 · `lib/config.ts` — single source of truth ⇄
Every value graded in `docs/business-facts.md`; the grade travels in the comment so
nobody silently promotes a 🟡 to fact.

```ts
shop.name       = 'Trakya Kapaklı Kuyumculuk'      // §2
shop.legalName  = 'Trakya Kapaklı Kuyumculuk Emlak İnşaat … Limited Şirketi'  // ✅
shop.founded    = 2000                             // ✅

contact.phone     = '0282 717 21 31'  pending:false  // ✅ 4+ sources
contact.phoneAlt  = '0282 717 55 62'  pending:false  // ✅ 3 sources
contact.whatsapp  = '0554 915 77 90'  pending:true   // 🟡 Instagram bio only — confirm
contact.instagram = 'kuyumculukkapakli' pending:false
//  ⚠️ NOT @kapaklikuyumculuk — a different jeweller in Şanlıurfa (index-cleanup Step 4)
contact.email     = null                             // ✅ no MX records — no email exists

address.street   = 'Cumhuriyet Mah., Pınar Bulvarı No: 56/A'
address.postal   = '59510'  locality:'Kapaklı'  region:'Tekirdağ'
address.landmark = 'Ziraat Bankası karşısı'          // 🟡
// coordinates absent — sources differ ~150 m (❌). Maps embed keys on the address
// string; JSON-LD omits `geo` rather than asserting a wrong pin.

hours = { days:'Pazartesi – Cumartesi', opens:'09:00', closes:'20:00',
          closed:'Pazar kapalı', seasonal:true }     // closing shifts winter↔summer
```

Address punctuation is load-bearing: `Bulvarı` not `Blv.`, `No: 56/A` with the space,
`Kapaklı / Tekirdağ` with spaces. Must match the footer and the Google profile
character-for-character (§10).

**Done when:** unit tests cover the derived helpers — flipping `whatsapp.pending`
switches the CTA href between `wa.me/…?text=…` and `tel:`, and the label between the
product prompt and `Bizi Arayın`. Tested here, with no UI in the way.

---

### Iteration 5 · `lib/content.ts` + category copy ⇄
The swap seam (§8). Exposes `getCategories()`, `getCategory(slug)`,
`getProducts(categorySlug?)`, `getFeaturedProducts(limit)`, `getCategorySlugs()`.
Reads local files now; when Sanity lands **only this file changes**.

The substantive work is not the module — it is **five Turkish intro paragraphs**. With
no product pages, each is the category's entire SEO payload (§6.2): 2–3 sentences of
real writing a customer would read, mentioning Kapaklı or Tekirdağ once, naturally.
Not keyword soup.

Slugs are published URLs (§4): `pirlanta` · `altin-seti` · `kupe-modelleri` ·
`tek-tas-modelleri` · `ozel-tasarim-takilar`.

**Done when:** `getCategorySlugs()` returns exactly those five, and each carries a
title, description, intro and cover image.

---

# M2 — Shell & template

### Iteration 6 · Chrome — header, footer, WhatsApp FAB
§5. Includes drawing the horizontal lockup as SVG: there is no vector original
(§14 item 5), so the KK oval is redrawn from the PNG, with `TRAKYA KAPAKLI`
letter-spaced beside it and `KUYUMCULUK` in small caps beneath.

- **Header** — sticky, `charcoal-deep`, slim. Nav right at `lg`+. Below `lg`, hamburger
  → full-width panel listing **the five categories first** (display serif,
  hairline-separated), then page links. Instagram traffic arrives wanting products.
  Reserve an empty slot above the header row for the phase-two gold ticker.
- **Footer** — `charcoal-deep`, four columns: lockup + description · categories ·
  contact · hours + Yol Tarifi. Hairline, then copyright + `legalName`.
- **Floating WhatsApp** — 56px, bottom right, every page, above all content.

**Done when:** nav works at 390 / 768 / 1440, every tap target ≥44px (§7), and the FAB
falls back to `tel:` because `whatsapp.pending` is still true.

---

### Iteration 7 · Category template — grid & empty state
`app/urunler/[kategori]/page.tsx`. Built before the homepage (§13) because it is the
piece that must look right with 3 products, 40, or none.

Charcoal breadcrumb → `KOLEKSİYON` label → H1 in Cormorant → gold rule → intro
paragraph → count line + `Görsele tıklayarak büyütün` → grid → charcoal contact band
(*"Vitrinde olmayan modelleri de bulabiliriz"*) → sibling-categories row so nobody
dead-ends.

- **Grid** — 4-up desktop / 2-up mobile, square crops, 1px `line` gaps. Card: image,
  serif name, spec line (`22 ayar · 38.5 gr`), `DETAY`. Hover: `scale(1.04)` + gold border.
- **Empty state** — bordered `Yakında` panel, category name, an invitation to message, a
  button. **Never a blank grid.** This is the launch state for all five categories.

**Done when:** all five URLs statically generate and show the `Yakında` panel; the grid
is proven separately against seeded fixture products, then the fixtures are removed.

---

### Iteration 8 · Lightbox
Split from iteration 7: different interaction surface, and the only part needing
browser-driven testing. Compound-component pattern (`vercel-composition-patterns`).

Image left; name, spec, the note that prices track the gold rate and aren't published,
and a WhatsApp button right. Arrows step through the category; Esc closes.

**Done when:** a `webapp-testing` script opens it from a card, arrows through, closes
on Esc, returns focus to the trigger, and confirms focus is trapped while open.

---

# M3 — Pages

### Iteration 9 · Anasayfa
§6.1, in the band rhythm from decision 2:

```
charcoal  header
charcoal  hero — full-bleed, ~80vh, gradient overlay from the left
cream     kategoriler — 5 tiles + a 6th gold-pale "Tüm Ürünler →" completing the grid
cream     öne çıkanlar — hides itself entirely when nothing is flagged featured
charcoal  hakkımızda band — shop photo left, three paragraphs right
cream     hizmetler — two panels only; two reads deliberate, five reads as filler
charcoal  iletişim / CTA band
charcoal  footer
```

**Done when:** the page reads as lit display cases between dark frames, and Öne Çıkanlar
is absent (not empty) at launch.

---

### Iteration 10 · Ürünlerimiz + Galeri
Grouped: both are grid reuse over existing components, mechanical once iteration 7 exists.
`/urunler` = breadcrumb, heading, intro, five tiles at 3-up. `/galeri` = every product
across all categories in one grid with the same lightbox; same empty state.

**Done when:** both render, and `/galeri` falls back to `Yakında` at launch.

---

### Iteration 11 · Hizmetler + Hakkımızda
Grouped: both are long-form Turkish copy on charcoal bands — one writing session.

- **Hizmetler** (§6.5) — two panels, each: heading, gold rule, how the service actually
  works, four hairline-separated bullets, closing charcoal CTA. For *Altın Alım–Satım*
  the two customer worries are the rate and the weighing: say plainly that weighing
  happens at the counter in front of them and any deduction is stated beforehand.
- **Hakkımızda** (§6.6) — reuse the recovered original copy from `docs/old-site-map.md`:
  *"2000 yılında Kapaklı ilçesinin merkezinde kurulmuş olup ilçenin ilk kuyumcusudur"* —
  true, verifiable, strong local claim. **Do not reuse "iki şube ile"** — there is one
  shop now. Owners: Filiz Eroğlu · Nuri Eroğlu (✅).

---

### Iteration 12 · İletişim + 404
Grouped: both surface `config.ts` contact data and nothing else.

- **İletişim** (§6.7) — **no contact form, no mailto**: the domain has no MX records, so
  no email address exists. WhatsApp + phone buttons, then a definition grid of address /
  phone / hours / Instagram. Right: Google Maps via the keyless `output=embed` form keyed
  on the **address string**, not coordinates.
- **404** (§6.8) — Turkish, branded, useful. Old WordPress URLs land here, so it must read
  like a shop: says the site was renewed, offers Ürünlerimiz and the phone, address beneath.

---

# M4 — Launch infrastructure

### Iteration 13 · `vercel.json` — highest risk in the project
Own iteration, own gate. A wrong redirect looks exactly like a working site.

Port `holding-page/vercel.json` to the repo root; keep `trailingSlash: false` and the
`*.vercel.app` → real-domain rule. **Verified against `docs/old-urls.txt` (309 URLs):
§4's table is incomplete** — it misses four indexed product URLs and three gen-1 pages
the new site can reclaim.

**Delete these rules — the paths become live pages:**
`/urunler` · `/urunler/pirlanta` · `/urunler/ozel-tasarim-takilar` · `/galeri` ·
`/hakkimizda` · `/iletisim`

**301 old → new:**

| Old | New | Source |
|---|---|---|
| `/urun/altin-seti` | `/urunler/altin-seti` | §4 |
| `/urun/kupe-modelleri` | `/urunler/kupe-modelleri` | §4 |
| `/urun/tek-tas-modelleri` | `/urunler/tek-tas-modelleri` | §4 |
| `/urun/ozel-tasarim-takilar` | `/urunler/ozel-tasarim-takilar` | **missed by §4** |
| `/urun/pirlanta-yuzukler` | `/urunler/pirlanta` | **missed by §4** |
| `/urun/yuzuk-modelleri` | `/urunler` | **missed by §4** |
| `/urunler/altin` | `/urunler/altin-seti` | **missed by §4** |
| `/kurumsal`, `/misyonvizyon`, `/markalar-2`, `/calistigimiz-firmalar/:path*` | `/hakkimizda` | gen-1 |
| `/urunlerimiz`, `/urunlerimiz/:path*` | `/urunler` | gen-1 |
| `/fotograf-galerisi/:path*`, `/gallery_plus/:path*` | `/galeri` | gen-1 |
| `/altin-fiyatlari`, `/doviz-kurlari`, `/referanslar` | `/` | no successor |

**Leave 404 deliberately (§4 rule 3):** `/wp-admin*` · `/wp-login.php*` ·
`/wp-content/*` · `/author/*` · `/category/*` · `/uncategorized/*` · `/?p=*` ·
`/anasayfa2` · `/slide-types/*`

`robots.txt` must **not** block old paths (§4 rule 4) — a blocked URL is never crawled,
so Google never sees the 301 and never drops it.

---

### Iteration 14 · SEO — metadata, JSON-LD, sitemap
- Per-category title / description / canonical / OG. Title pattern from the old indexed
  template: `%page% - Trakya Kapaklı Kuyumculuk | 0282 717 21 31 | Kapaklı`.
- `JewelryStore` JSON-LD site-wide, generated from `config.ts` — reuse the block already
  in `holding-page/index.html`, updating `name` and **omitting `geo`**.
  `sameAs`: Instagram + `facebook.com/537179436417060` (✅).
- `BreadcrumbList` + `ItemList` of `Product` per category.
- `sitemap.ts` / `robots.ts` generated from `content.ts`, so a new category appears
  automatically. Disallow `/studio`.
- Target **`kapaklı kuyumcu`, `tekirdağ pırlanta`, `kapaklı altın`** — not `pırlanta yüzük`.

---

### Iteration 15 · Sanity schemas, written but unwired ⇄
Write `sanity.config.ts` and `category` / `product` schemas with Turkish labels and
**hotspot enabled on every image**, and leave them unused (§11) — phase two becomes a
swap, not a design exercise. **Add a third `siteSettings` document carrying hours**, so
the seasonal closing time (decision 3) changes without a deploy.
The free-tier dataset is **public** — nothing private goes in it.

---

# M5 — Ship

### Iteration 16 · Verification & deploy

1. `npm run build` → **every** route statically generated, no `ƒ` markers.
2. **Redirects** — `curl -sI` each row of iteration 13; assert 301 + correct `location`.
   Assert `/urunler/pirlanta`, `/urunler/ozel-tasarim-takilar`, `/galeri`, `/hakkimizda`,
   `/iletisim` return **200, not 301**. This is the check that protects index history.
3. **Turkish glyphs** — re-screenshot at 390 / 1440; no mid-word fallback.
4. **Pending mechanism** — flip `whatsapp.pending` true→false→true; every CTA swaps
   between `wa.me` (product name prefilled) and `tel:` on every page, with no layout shift.
5. **Empty state** — five categories + `/galeri` all show `Yakında`. No blank grids.
6. **Lightbox** — `webapp-testing`: open, arrow, Esc, focus return, focus trap.
7. **Structured data** — Rich Results Test on `/` and one category; `JewelryStore` +
   `BreadcrumbList` + `ItemList` validate, no `geo` emitted.
8. **`web-design-guidelines`** audit on built pages; tap targets ≥44px.
9. **NAP consistency** — diff the footer block against `config.ts` and against
   `index-cleanup-plan.md`'s canonical block, character by character.

Then: deploy · point the domain · Search Console (Domain property, not URL-prefix) ·
resubmit sitemap · Google Business Profile.

---

## Risks

1. **Brand name (raised, overruled, proceeding).** `docs/index-cleanup-plan.md` Step 1
   lists `Trakya Kapaklı Kuyumculuk` among the three variants causing the ranking
   problem and recommends `Kapaklı Kuyumculuk`. You chose §2's string. That works **only
   if applied everywhere at once** — Google Business Profile, Instagram bio, and the
   Steps 3–5 directory corrections must all move to `Trakya Kapaklı Kuyumculuk`,
   character-for-character. Otherwise the site adds a *fourth* variant instead of
   replacing three, which is the exact failure the project exists to fix.
   **Launch-blocking, not follow-up.**
2. **The redirect map is the only thing preserving the domain's index history** (§4).
   Port before deleting; verify after deploying.
3. **Hours publish an ❌-graded fact.** Mitigated by phase-two editability; still worth
   confirming via `docs/aile-sorulari.md`.
4. **Wrong Instagram handle.** `@kapaklikuyumculuk` matches the domain and is a different
   shop in Şanlıurfa. One constant, one comment, never inlined.
