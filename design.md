# design.md — Anasayfa hero and the Ata Lirası

> **Stage 1 of 4 — ✅ approved by Soner in writing, 2026-08-29.** Baseline is commit
> `a48f740`. Spec §n references remain valid; where this file and the spec disagree,
> this file wins. [`CATALOGUE.md`](CATALOGUE.md) has not been opened; stage 2 starts
> only on Soner's explicit go.

## Where the hero stood before

A static SVG line-art diamond at `public/placeholder/hero.svg`, right of centre, behind a
charcoal gradient from the left, `min-h-[78vh]`. There was no motion anywhere in the
codebase — the "diamond animation" was a still drawing.

## The asset

`ata_animation/turkey_coin3.glb` (3.2 MB), with `front.png` and `back.png` (~1.7 MB each)
as the face textures.

It is the **Ata Lirası** — obverse: Atatürk, `HAKİMİYET MİLLETİNDİR / ANKARA`; reverse: a
wreath with `TÜRKİYE CUMHURİYETİ 1923 / 96`. This is the right object for this shop in a
way a diamond is not: ata altını is what people in Turkey actually walk into a kuyumcu to
buy — çeyiz, düğün, doğum, birikim. A diamond says "jewellery brand". The coin says
"kuyumcu in Tekirdağ".

**The tension to solve.** The coin is photoreal, warm, reflective and round. Everything
else on the page is flat, matte, hairline and square. Done well that contrast is the whole
idea — one real object in a room of line drawings, the way a single lit piece sits in a
dark vitrin. Done badly it looks pasted on. Every decision below follows from that.

## Decisions

| # | Decision |
|---|---|
| D1 | The Ata Lirası replaces the diamond motif. **Homepage hero only.** |
| D2 | **Pre-rendered seamless loop** rendered offline from the GLB. Live three.js only if cursor interaction is ever wanted — see "Rendering" below. |
| D3 | Rotation **R2+R3**: tilted axis (~15° on X, ~6° on Z), eased dwell on each face, ~16s per revolution, specular sweep, still for 0.5s on load before it starts turning. |
| D4 | Hero stays ~78vh. **No pin, no scroll-linked motion, no scroll-jacking.** |
| D5 | The coin is decorative and **not clickable**. |
| D6 | **Espresso body** `#17120E`, panels `#241C15`, **cream header and footer** `#F4F0E8`. Overturns the alternating charcoal/cream band decision. |
| D7 | A warm radial **glow** under the coin, not a shadow. No vitrin plate — unneeded on a dark ground. |
| D8 | **Ibarra Real Nova is the display face — display-only, ≥32px, weight 500.** Jost carries all body text. *Sole exemption: the KK monogram inside the logo mark (`Lockup.tsx` SVG) — it is the logo, not typography, and renders on cream. The 1.6 QA pass caught it rendering at weight 400 (the SVG set no font-weight) while headings are 500 — invisible under single-weight faces, real under a variable one. At Soner's direction it now carries an explicit `fontWeight="500"`, matching the headings.* *Revised at the 1.6 review through a real selection: Bodoni Moda fell at 400 and again at 600 — the Didone thick/thin contrast itself read as lost on espresso, not the weight; Marcellus was rejected in situ; live in-site trials against EB Garamond and Cormorant Garamond (both too ornate) settled on Ibarra Real Nova at 500 — a formal transitional serif with moderate contrast and a large x-height. The ≥32px display-only rule stays.* |
| D9 | Body text `#E8E3DA` on dark. **Never pure white** — it causes halation on near-black. |
| D10 | **Cream reading band** for the body copy on Hakkımızda and Hizmetler only. Long-form prose is measurably harder to read on dark, and those two pages are where trust is decided. |
| D11 | Sections separate by spacing and hairline rules. The panel colour is used **3–4 times per page maximum**, not for every section. |
| D12 | Gold may be a **fill for primary buttons only**, one per section. Everywhere else gold stays a hairline accent. |
| D13 | Hero composition: **headline left, coin right.** |
| D14 | Coin diameter **≈1.2× the headline block height**, capped at 46% of hero width, minimum 280px. Visibly the larger element, not dominant. *Revised at the 1.3 review: Soner judged the ratio-correct 386px too small in the browser and set 580px (1.5×) at lg+, waiving the width cap; the 280px floor and mobile sizes stand.* |
| D15 | Mobile: **headline and CTAs first, coin below.** Both hero buttons must be reachable without scrolling. *(Read "the phone and WhatsApp buttons" until 2026-09-08, when WhatsApp was removed and the phone became the only channel.)* |
| D16 | Category tiles: cut-out image on the panel colour, hairline border, gold label, border turns gold on hover. *Revised 2026-08-29 (stage-2 change of plan, per Soner): no cut-outs — no professional photography, and the rembg pipeline is retired. The tile is filled by the polished photograph itself (`object-cover`), hairline border and gold label unchanged, plus the smallest scrim the label needs to stay legible over a photo. Code change pending in `CategoryTiles.tsx` / `lib/content.ts`; reviewed at the stage-2 contact-sheet gate.* |
| D17 | The mobile menu panel is **cream**, reading as the header expanding. |
| D18 | Focus rings are **gold**, verified visible on both espresso and cream. |
| D19 | **The homepage is coin-first and deliberately sparse.** Öne Çıkanlar shows at most four products, then a `Tüm Ürünler →` button. Homepage Hakkımızda compresses to two sentences and a link; Hizmetler to two compact panels of one line each. Full copy lives on its own page. |
| D20 | The favicon keeps the original logo tile — gold KK on near-black — the one place it works unchanged. *Carried out 2026-09-09, and not before: the site went live on the canonical URL still serving Next.js's starter favicon, a black circle with a white triangle. This decision had stood unimplemented since stage 1 and no test looked at it. The vector original that `Lockup.tsx` recorded as missing turned up and is now `app/icon.svg`; `npm run icons` rasterises the favicon, the Apple touch icon and the knowledge-panel logo from it. The badge's gold gradient runs brighter than the `gold` tokens and its ground is `#171310` rather than `#17120E` — accepted as a logo exemption on the same reasoning D8 gives for the monogram, and reviewed rather than overlooked.* |

## Palette

```
ground       #17120E   espresso — page background, the dominant colour
panel        #241C15   raised surfaces, cards, bands
frame        #F4F0E8   cream — header and footer, and the two reading bands
ink-text     #1A1816   text on cream
cream-text   #E8E3DA   body text on dark
muted        #9A958D   secondary text on dark
line-dark    #262B31   hairlines on espresso
line-light   #E4DED2   hairlines on cream
gold         #B8964F   hairline accent
gold-soft    #CBAE72   gold on dark, where it needs to lift
gold-deep    #77602A   gold on cream — the only version legible there
                       (darkened from #8A6D2F at the 1.2 gate: the original
                       measured 4.29:1 on frame, under the 4.5:1 AA minimum
                       for the small text that uses it)
ink-muted    #5F5A52   secondary text on cream — added at the 1.2 gate; the
                       frame had no muted token and alpha improvisations
                       measured as low as 2.9:1
```

The logo appears on cream in both the header and the footer, so both use the **gold-deep**
KK oval. `components/Lockup.tsx` draws the mark in `currentColor`, so this is a one-word
change, not a redraw.

**Never name a token `base`** (§12 — it collides with `text-base`).

## The motion, in detail

Reference for the staging: <https://codepen.io/mrrain/pen/wbEBVo> — a pure-CSS coin, 16
stacked circles faking a rim, `spin 10s linear`, a shine sweep on a separate cycle, and a
blurred ground shadow. What is worth taking from it is the **staging**, not the technique:
the visible rim, the travelling shine, and the sense that the coin sits in space rather
than floating in a void. Our GLB gives all three at higher fidelity.

- **Axis.** Tilted ~15° on X and ~6° on Z. The tilt is not decoration: a coin spinning on
  an upright axis passes edge-on twice per revolution and briefly becomes a thin sliver.
  Tilted, the edge-on moment shows a real rim with thickness.
- **Speed.** ~16s per revolution. 10s reads as lively and competes with the headline;
  beyond ~24s it reads as broken.
- **Easing.** The coin slows and dwells ~1.5s as each face comes square to the viewer, then
  accelerates through the edge. This is what a jeweller's turntable does, and it is the only
  variant where a visitor actually reads the coin — sees the profile, sees
  `TÜRKİYE CUMHURİYETİ 1923`.
- **On load.** Still, obverse facing the viewer, for ~0.5s. The first impression should be a
  coin, not an animation already in progress.
- **Off-screen.** Rotation pauses when the hero leaves the viewport. Battery, on phones.
- **The glow.** A warm radial pool beneath the coin at low opacity. On near-black a shadow
  is invisible, so the pen's staging inverts. This is the one deliberate exception to the
  no-shadows rule, and it applies to this element alone.

## Rendering

Continuous rotation makes the cheapest option also the best one.

**Primary — pre-rendered loop.** Render the GLB offline to a seamless loop against a flat
background at two sizes (desktop ~800px, mobile ~420px). No 3D library, no WebGL, identical
on every device, cannot drop frames, degrades to a still image. Estimated ~300–700 KB.

**Upgrade path — live 3D (react-three-fiber).** Only justified if the coin should ever
respond to the cursor, or if the hero background later becomes a photograph. Costs ~150 KB
gzipped of JS on top of the 3.2 MB model and needs a low-end fallback.

**Fallback — CSS 3D flip** of the two PNGs, if both of the above look wrong. Reads as a flat
disc rather than struck metal; kept in reserve only.

`ata_animation/` stays **out of `public/`**. The 3.2 MB GLB must never reach a visitor's
browser; only the rendered loop ships.

## Performance budget — gates, not guidelines

- Animation payload ≤ **1.5 MB desktop / 500 KB mobile**, total.
- Added JS ≤ 40 KB gz for the loop; ≤ 200 KB gz if live 3D is ever chosen.
- **LCP stays the H1**, not the coin. **CLS 0.**
- The build stays **fully static, no server rendering**.

## Accessibility

- `prefers-reduced-motion: reduce` → a single still frame of the obverse, no rotation, hero
  layout unchanged. Not "motion off and the layout broken".
- `prefers-reduced-data` → same still frame.
- The coin is decorative: `aria-hidden`, empty alt.
- The headline, both CTAs and the phone number render and work with JavaScript disabled.
- Contrast measured for `#E8E3DA` and `#9A958D` on espresso, and for gold wherever it
  carries meaning rather than decoration.

## Copy during this stage

Turkish filler, never Latin lorem ipsum — filler must carry `ı İ ğ ş ç ö ü` so the font
fallback checks stay meaningful. The existing real Turkish copy is preserved in
[`docs/original-copy.md`](docs/original-copy.md) before filler replaces it.

> **Superseded 2026-09-08.** There is no filler left. `lib/filler.ts` was replaced by
> `lib/copy.ts`, which holds the real copy for every page in the *sade esnaf sesi* voice,
> and the gate that used to look for placeholder markers is now the voice gate described in
> `TECHNICAL.md` §3. The Turkish glyph coverage this paragraph was protecting is asserted
> directly instead, by `tests/fonts.spec.ts`.

## What else changes on the homepage

- Retire the two concentric circles behind the old diamond motif.
- *Added at the 1.6 review:* the small gold eyebrow labels above section titles
  (`Kapaklı · Tekirdağ`, `Koleksiyonlar`, `Öne Çıkanlar`, `Hizmetler`, `Hakkımızda`,
  `İletişim`) are removed from the **homepage only** — interior pages keep theirs for
  now. The homepage Hizmetler section deliberately carries no heading; its two panels
  stand alone.
- No new shadows anywhere. No gold gradient text. No bevels. The coin carries the richness.
- No full-bleed product photography anywhere on the site — full-bleed exposes every flaw in
  amateur source material. Images sit in hairline-bordered cards at a fixed size. *(After
  the 2026-08-29 D16 revision, category tiles are the one exception — a photo filling a
  fixed, hairline-bordered square with a scrim, not a page section.)*

## The rest of the site

Deferred until the hero is signed off, then handled in one pass: category tile hover, the
section spacing rhythm across the interior pages, the type scale at 390px, the header
lockup at small sizes, and the `Yakında` empty-state panel's weight now that the homepage is
louder.

## Done when

Status recorded at the 1.6 verification, 2026-08-29:

1. The loop is built and reviewed at 390 / 768 / 1440. ✅ *Built at 1.1–1.3; the 1.6
   QA pass re-captured all three widths (plus 320) on the final design.*
2. It holds 60fps on a mid-range Android. ⏳ *Never measured on real hardware — no
   record exists in `docs/build-history.md` either. Folded into the stage-3.5 device
   pass; the pre-rendered-video approach makes a failure unlikely but unproven.*
3. Reduced-motion and reduced-data still frames verified. ✅ *Reduced-motion is
   e2e-tested (`tests/hero-coin.spec.ts`, green). Reduced-data shares the same
   still-frame path in `components/HeroCoin.tsx` (media query + `saveData`); code
   path only, no automated test.*
4. CLS measured at 0; LCP still the H1. ⏳ *Not instrumented at 1.6. The layout
   reserves the coin's box and the fonts ship size-adjusted fallbacks, but the
   numbers themselves land with the stage-3.5 Lighthouse pass.*
5. `npm run build` — every route statically generated, no `ƒ` markers. ✅ *Verified
   on the final Ibarra build: exit 0, fully static, zero `ƒ` markers.*
6. New e2e test: hero headline and CTAs present with JavaScript disabled. ✅
   *`tests/hero-coin.spec.ts` — green.*
7. Turkish glyph rendering unaffected at 390 and 1440. ✅ *Canvas fallback probe: all
   of ı İ ğ ş ç ö ü drawn by Ibarra Real Nova in every probed heading at both widths;
   also asserted in `tests/fonts.spec.ts`.*
8. Soner has approved the design. Explicitly, in writing. ✅ **Approved 2026-08-29**
   *("match the monogram to 500, design approved"). The monogram was matched to
   weight 500 in the same breath — see D8.*

Other 1.6 measurements, for the record: heading contrast 14.55:1 (`#E8E3DA` on
`#17120E`); hero h1 and both CTAs inside the first 440px at 390×844 (D15); zero
horizontal overflow at 320px; homepage eyebrows fully absent with headings sitting
exactly on their section padding; `/urunler` keeps its `Koleksiyonlar` eyebrow.
41 unit + 150 e2e tests green; `tsc --noEmit` clean.

## Risks

1. **Photoreal object in a flat system.** Mitigated by quieting everything around it. If it
   still looks pasted on, fall back to a more contrasted render, then to the CSS flip.
2. **Weight, on Turkish mobile networks.** The budget above is a gate. A beautiful hero that
   costs three seconds loses more customers than a plain one.
3. **The imagery deserves care.** Ata Lirası is ordinary stock in every Turkish jeweller, so
   using it is unremarkable — but the treatment stays dignified. Slow, weighty rotation. No
   bouncing, no fast spins, no confetti.
4. **Dark-palette contrast failures** that pass automated checks and fail on a real phone in
   daylight. Only the device pass in `TECHNICAL.md` §6 catches these.
