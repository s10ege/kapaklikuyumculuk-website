---
name: kk-brand
description: The Trakya Kapaklı Kuyumculuk design system and business-fact rules — palette tokens, typography constraints, gold usage, the canonical NAP block, and where facts are allowed to live. Use whenever writing or reviewing any UI, copy, metadata or structured data for this project.
---

# Trakya Kapaklı Kuyumculuk — brand and facts

Authoritative for colour, type and business facts. Design decisions are numbered D1–D20 in
`design.md`; this file is the machine-readable summary. Where they disagree, `design.md`
wins and this file is stale — say so.

## Palette

```
ground     #17120E   espresso — page background, the dominant colour
panel      #241C15   cards, raised bands — 3-4 uses per page maximum (D11)
frame      #F4F0E8   cream — header, footer, and the reading bands on
                     Hakkımızda and Hizmetler (D10)
ink-text   #1A1816   text on cream
ink-muted  #5F5A52   secondary text on cream (added at the 1.2 gate)
cream-text #E8E3DA   body text on dark — NEVER pure white, it causes halation (D9)
muted      #9A958D   secondary text on dark
line-dark  #262B31   hairlines on espresso
line-light #E4DED2   hairlines on cream
gold       #B8964F   hairline accent
gold-soft  #CBAE72   gold on dark, where it needs to lift
gold-deep  #77602A   gold on cream — the only version legible there
                     (darkened from #8A6D2F at the 1.2 gate for AA contrast)
whatsapp   #25D366
```

Never name a token `base` — it collides with Tailwind's `text-base`.

## Rules that carry the whole look

- **Gold is a hairline accent, never a fill** — except primary buttons, one per section (D12).
- **No shadows.** Only exception: the warm radial glow under the hero coin (D7).
- Radius 0–2px. Grid gaps are 1px of `line` showing through, not margins.
- **Ibarra Real Nova: display only, ≥32px, weight 500** (D8). **Jost** carries all body
  text. Chosen at the 1.6 review after Bodoni Moda (Didone hairlines lost on dark) and
  Marcellus were rejected.
- No gold gradient text, no bevels. The hero coin carries the richness.
- No full-bleed product photography — it exposes flaws in amateur source material. Images
  sit in hairline-bordered cards at fixed sizes.

## The hero coin

Ata Lirası, rendered from `ata_animation/turkey_coin3.glb`. Continuous rotation on a tilted
axis (~15° X, ~6° Z), eased dwell on each face, ~16s per revolution, still for 0.5s on load,
pauses off-screen. Decorative and not clickable (D5). Diameter ≈1.2× the headline block
height, capped at 46% of hero width, minimum 280px (D14). `ata_animation/` stays **out of
`public/`** — the 3.2 MB GLB must never reach a browser.

## Business facts — one source only

Everything below lives in `lib/config.ts` and nowhere else.
`tests/source-invariants.test.mts` fails the build if any of it is inlined.

```
Trakya Kapaklı Kuyumculuk
Cumhuriyet Mah., Pınar Bulvarı No: 56/A
59510 Kapaklı / Tekirdağ
0282 717 21 31
https://www.kapaklikuyumculuk.com
```

- **Title case is the stored form.** Caps are a CSS `text-transform` treatment only —
  ALL-CAPS risks a Google Business Profile name policy violation.
- Punctuation is load-bearing: `Bulvarı` not `Blv.`, `No: 56/A` with the space,
  `Kapaklı / Tekirdağ` with spaces.
- Instagram is **`kuyumculukkapakli`**. **Not** `@kapaklikuyumculuk` — a different jeweller
  in Şanlıurfa.
- WhatsApp `0554 915 77 90` is still `pending: true`; every CTA falls back to `tel:` until
  the family confirms it.
- **No email address exists** — the domain has no MX records. No contact form, ever.
- **No prices.** They track the gold rate.
- No `geo` in structured data — sources differ by ~150 m and a wrong pin is worse than none.

## Copy

Turkish. Placeholder copy is **Turkish filler, never Latin lorem ipsum**, so that
`ı İ ğ ş ç ö ü` fallback checks stay meaningful. The original copy is preserved in
`docs/original-copy.md`; two lines in it are load-bearing — the 2000 founding claim
(*ilçenin ilk kuyumcusu*) and the weighing-on-the-counter promise in Altın Alım–Satım.

Keyword targets are local: `kapaklı kuyumcu`, `tekirdağ pırlanta`, `kapaklı altın`.
Not `pırlanta yüzük` — that competes nationally against chains.
