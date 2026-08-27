---
name: catalogue-pipeline
description: The photograph → background-removal → publish loop for product images on the Trakya Kapaklı Kuyumculuk site. Use when shooting, processing, adding, replacing or removing product images, or when building or debugging scripts/catalogue.mjs.
---

# Catalogue pipeline

Turns amateur phone photographs into a consistent catalogue on a dark site. Full reasoning
in `CATALOGUE.md`; this is the operational version.

## The principle: shoot light, display dark

A phone's auto-exposure meters the whole frame. Gold on a dark cloth reads as an
underexposed scene, so the phone brightens everything and blows out the highlights that
make gold look like gold. Photograph on **white or light grey paper**; the site composites
onto espresso.

## Shooting rules, in order of impact

1. **Out of the vitrin.** Shooting through display glass is unfixable in software.
2. **No flash.** Window light, out of direct sun.
3. **One light source.** Never mix shop LEDs with daylight — the split colour cast cannot
   be corrected in one step.
4. Same distance and angle every time. Consistency beats any individual photo.
5. Clear margin around the piece — tight crops give the cut-out model no edge to find.
6. Clean the piece. Fingerprints are invisible at arm's length and glaring at 1200px.
7. Stand slightly off-axis; polished gold mirrors the room.

## Naming

```
<kategori-slug>_<parca-adi>_<nn>.jpg
pirlanta_tektas-yuzuk_01.jpg
```

Slugs: `pirlanta` · `altin-seti` · `kupe-modelleri` · `tek-tas-modelleri` ·
`ozel-tasarim-takilar`.

## Folders

```
catalogue/raw/     phone photos (git-ignored — originals stay with Soner)
catalogue/fixed/   manual repairs
public/urunler/    finished images, committed
```

## Processing — `scripts/catalogue.mjs`, run via `catalogue.bat`

Per image: EXIF orientation · white balance · background removal with **rembg + BiRefNet**
(the model that survives thin chains and filigree) · alpha matting · square crop with
consistent padding · export at 1200 / 600 / 300px as **WebP with transparency**.

**Transparent, never pre-composited onto the panel colour.** The glow and background come
from CSS, so a palette change needs no re-export.

The script is **idempotent** and emits a **contact sheet** — every processed image on one
page at card size, so failures are visible in ten seconds.

Setup: `pip install "rembg[cli]"`. The model downloads on first run. Seconds per image on CPU.

## Repair loop

Roughly one in ten cut-outs needs a hand, usually a thin chain crossing a highlight. Fix
that file in Photopea, drop it in `catalogue/fixed/`, re-run. The script prefers a fixed
file over the raw one.

## Publishing a product

1. Photograph per the rules above.
2. Drop into `catalogue/raw/`, run `catalogue.bat`.
3. Check the contact sheet; repair failures.
4. Move the output into `public/urunler/<kategori>/`.
5. Add a line to `catalogue.json` only if it needs a `spec`, custom `alt`, `featured` or
   `order`.
6. Commit and push. Vercel rebuilds itself.

Removing a product: delete the image, commit, push.

## Constraints

- Card images ≤80 KB; lightbox masters ≤250 KB.
- **Turkish alt text per product, written by hand.** It is the only text a search engine can
  read about the image.
- **Never use supplier or manufacturer catalogue images** — rights you do not own, and
  duplicate content that works against the ranking problem the project exists to fix.
- No prices anywhere.
