# design.md — Anasayfa hero and the Ata Lirası

> **Stage 1 of 4.** Nothing in [`CATALOGUE.md`](CATALOGUE.md) begins until every element
> here is approved. Baseline is commit `a48f740`. Spec §n references remain valid; where
> this file and the spec disagree, this file wins.

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
| D8 | **Bodoni Moda is display-only, ≥32px.** Its hairlines physically disappear on dark below that. Jost carries all body text. |
| D9 | Body text `#E8E3DA` on dark. **Never pure white** — it causes halation on near-black. |
| D10 | **Cream reading band** for the body copy on Hakkımızda and Hizmetler only. Long-form prose is measurably harder to read on dark, and those two pages are where trust is decided. |
| D11 | Sections separate by spacing and hairline rules. The panel colour is used **3–4 times per page maximum**, not for every section. |
| D12 | Gold may be a **fill for primary buttons only**, one per section. Everywhere else gold stays a hairline accent. |
| D13 | Hero composition: **headline left, coin right.** |
| D14 | Coin diameter **≈1.2× the headline block height**, capped at 46% of hero width, minimum 280px. Visibly the larger element, not dominant. |
| D15 | Mobile: **headline and CTAs first, coin below.** The phone and WhatsApp buttons must be reachable without scrolling. |
| D16 | Category tiles: cut-out image on the panel colour, hairline border, gold label, border turns gold on hover. |
| D17 | The mobile menu panel is **cream**, reading as the header expanding. |
| D18 | Focus rings are **gold**, verified visible on both espresso and cream. |
| D19 | **The homepage is coin-first and deliberately sparse.** Öne Çıkanlar shows at most four products, then a `Tüm Ürünler →` button. Homepage Hakkımızda compresses to two sentences and a link; Hizmetler to two compact panels of one line each. Full copy lives on its own page. |
| D20 | The favicon keeps the original logo tile — gold KK on near-black — the one place it works unchanged. |

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
gold-deep    #8A6D2F   gold on cream — the only version legible there
whatsapp     #25D366
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
[`docs/original-copy.md`](docs/original-copy.md) before filler replaces it; Soner rewrites
it later. A build gate (`TECHNICAL.md` §3) fails if filler survives to launch.

## What else changes on the homepage

- Retire the two concentric circles behind the old diamond motif.
- No new shadows anywhere. No gold gradient text. No bevels. The coin carries the richness.
- No full-bleed product photography anywhere on the site — full-bleed exposes every flaw in
  amateur source material. Images sit in hairline-bordered cards at a fixed size.

## The rest of the site

Deferred until the hero is signed off, then handled in one pass: category tile hover, the
section spacing rhythm across the interior pages, the type scale at 390px, the header
lockup at small sizes, and the `Yakında` empty-state panel's weight now that the homepage is
louder.

## Done when

1. The loop is built and reviewed at 390 / 768 / 1440.
2. It holds 60fps on a mid-range Android.
3. Reduced-motion and reduced-data still frames verified.
4. CLS measured at 0; LCP still the H1.
5. `npm run build` — every route statically generated, no `ƒ` markers.
6. New e2e test: hero headline and CTAs present with JavaScript disabled.
7. Turkish glyph rendering unaffected at 390 and 1440.
8. Soner has approved the design. Explicitly, in writing.

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
