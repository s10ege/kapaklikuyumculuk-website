---
name: catalogue-pipeline
description: The photograph → polish → publish loop for product images on the Trakya Kapaklı Kuyumculuk site. Use when shooting, processing, adding, replacing or removing product images, or when building or debugging scripts/catalogue.mjs.
---

# Catalogue pipeline

Turns amateur phone photographs into a consistent catalogue on a dark site. Full reasoning
in `CATALOGUE.md`; this is the operational version.

**Revised 2026-08-29: background removal is retired.** No rembg, no BiRefNet, no venv, no
~3.5 minutes an image. Photographs ship polished with their **backgrounds kept**, as opaque
masters. The rembg design and its measurements stay in this file's git history.

## The principle: the background ships, so choose it once

Same spot, same surface, same backdrop for every photo in a sitting. A sheet of light paper
still wins — a phone's auto-exposure meters the whole frame, so gold on a dark cloth reads
as an underexposed scene and the phone blows out the highlights that make gold look like
gold. But whatever the surface is, keep it consistent and uncluttered: no price tags, no
till, no stray tools. Inconsistency between sittings is now the single biggest quality risk.

## Shooting rules, in order of impact

1. **Out of the vitrin.** Shooting through display glass is unfixable in software.
2. **The background ships. Choose it once**, and keep it clean.
3. **No flash.** Window light, out of direct sun.
4. **One light source.** Never mix shop LEDs with daylight — the split colour cast cannot
   be corrected in one pass, and there is no automatic correction any more.
5. Same distance and angle every time. Consistency beats any individual photo.
6. Clear margin around the piece — the square crop needs room on every side.
7. Clean the piece. Fingerprints are invisible at arm's length and glaring at 1200px.
8. Stand slightly off-axis; polished gold mirrors the room.

## Naming

```
<kategori-slug>_<parca-adi>_<nn>.jpg
yuzuk_baget-yuzuk_01.jpg
```

Slugs: `altin-seti` · `kupe-modelleri` · `yuzuk` · `ozel-tasarim-takilar`. Several files sharing a piece name are **one product seen from
several angles**, not several products.

## Folders

```
catalogue/raw/     phone photos (git-ignored — originals stay with Soner)
catalogue/fixed/   polished repairs; a fixed file wins over the raw one
public/urunler/    finished images, committed
```

## Processing — `scripts/catalogue.mjs`, run via `catalogue.bat` or `npm run catalogue`

Per image, and that is all of it: **EXIF orientation** · **centred square crop** · export
**one 1200px opaque WebP**, quality stepped down until it fits 250 KB. Seconds an image,
not minutes.

**One master, not three sizes.** `next/image` generates the card and thumbnail sizes from
it, so exporting them here was dead weight.

**Opaque, not transparent.** With backgrounds kept there is nothing to composite; the
espresso ground shows around the card, not through the image.

**The crop is dumb on purpose.** A plain centred square. Guessing at the subject would move
the crop unpredictably between two frames of one sitting, and a wrong-but-consistent crop
is one drag in the polish pass.

Flags: **`--force`** ignores the cache · **`--only <substring>`** limits the run to matching
stems. The script is idempotent, keyed on the source bytes plus `PIPELINE_VERSION` — **bump
that constant whenever a processing step changes**, or a re-run silently keeps old output.

## The polish pass — with Claude, after the batch runs

Review `catalogue/contact-sheet.html`: every processed image on one page at card size on
espresso. It is no longer a cut-out failure detector; it is where you decide what needs a
hand. Per image:

- **Crop placement** — re-centring the square on the piece. The manual version of the CMS
  hotspot idea, done once at ingest.
- **Straightening** and small rotations.
- **Exposure and white balance**, normalised across the batch so tiles match. Judged
  per sitting now that the paper-border auto-correction is gone.
- Occasionally, cloning out a distraction at the edge of frame.

Fixed files land in `catalogue/fixed/` under the same stem, and the loop re-runs.

## Publishing a product

1. Photograph per the rules above.
2. Drop into `catalogue/raw/`, run `catalogue.bat`.
3. Check the contact sheet; polish what needs it into `catalogue/fixed/` and re-run.
4. The output is already in `public/urunler/<kategori>/` — the script puts it there.
5. Add a line to `catalogue.json` for the Turkish display `name` (the ASCII slug cannot carry
   `ş`, `ü` or `ı`), plus `alt`, `spec`, `featured` or `order` as needed.
6. Commit and push. Vercel rebuilds itself.

Removing a product: delete the image, commit, push.

## Constraints

- Masters ≤250 KB on disk; `next/image` delivers cards under 80 KB.
- **Turkish alt text per product, written by hand.** It is the only text a search engine can
  read about the image.
- **`spec` is ayar and gram only, and only when Soner has given them.** An invented
  `22 ayar · 38.5 gr` is a false business fact on a site whose whole purpose is that the
  shop's facts stop contradicting each other.
- **Never use supplier or manufacturer catalogue images** — rights you do not own, and
  duplicate content that works against the ranking problem the project exists to fix.
- No prices anywhere.
