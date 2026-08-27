# CATALOGUE.md — product images, content, and how they get in

> **Stage 2 of 4.** Begins only after [`design.md`](design.md) is approved. Ends when the
> catalogue is live, the `Yakında` panels have retired themselves, and Soner has signed off
> on the contact sheet.

## 1 · Photography brief

**The principle: shoot light, display dark.**

A phone's auto-exposure meters the whole frame. Point it at gold on a dark cloth and it
decides the scene is underexposed, brightens everything, and blows out exactly the
highlights that make gold look like gold — you get a pale yellow blob with no detail.
Photographed against a light neutral background, the same phone exposes the metal correctly
and holds the reflections that read as shine.

So: photograph on white or light grey, and let the site composite onto espresso. The
photography happens in the easiest possible conditions; the site stays dark.

**Equipment** — the phone you already have · a sheet of A3 white or light grey paper,
curved up the back so there is no visible corner · a window · a stack of books to brace the
phone · something small to lift the piece off the paper so its own shadow does not touch it.

**Rules, in order of how much they matter:**

1. **Take the piece out of the vitrin.** Shooting through display glass is unfixable in
   software — reflections, colour cast, soft focus. This one thing costs more quality than
   everything else combined.
2. **No flash.** It burns a white hotspot into gold and flattens the form. Window light,
   out of direct sun.
3. **One light source.** Shop LEDs mixed with daylight gives a split colour cast that
   cannot be corrected in a single step. Either shoot during the day with the shop lights
   off, or after hours with them on — pick one and never mix.
4. **Same distance, same angle, every time.** Consistency across fifty photos reads as
   professional far more than any single photo does.
5. **Leave a clear margin** around the piece in frame. Tight crops give the cut-out model
   no edge to find.
6. **Clean the piece first.** Fingerprints and dust are invisible at arm's length and
   glaring at 1200px.
7. **Stand slightly off-axis.** Polished gold mirrors the room, including the photographer.
   Dark clothing, and do not shoot straight down over the piece.

**Shot list.** One photo per product is the requirement. A second angle is welcome but
optional. Scale shots on a hand are a phase-two nicety.

**File naming** — this feeds the pipeline directly:

```
pirlanta_tektas-yuzuk_01.jpg
altin-seti_burma-bilezik_01.jpg
kupe-modelleri_halka-kupe_01.jpg
```

Category slug, piece, number. The five published slugs are `pirlanta`, `altin-seti`,
`kupe-modelleri`, `tek-tas-modelleri`, `ozel-tasarim-takilar`.

**How many.** No minimum is set — decided as we go. Below roughly six pieces a category
still reads as empty, and in that case the `Yakında` panel is the more honest state; it
retires itself automatically once products exist.

**What not to photograph:**

- Anything not reliably in stock. The site sets an expectation the counter has to meet.
- Pieces with visible price tags.
- **Supplier or manufacturer catalogue images.** They carry rights that are not yours, and
  Google treats images appearing on fifty other jewellers' sites as duplicate content —
  which works directly against the ranking problem this project exists to fix.

## 2 · The processing pipeline

Local, free, offline. No API keys, no per-image cost, no third-party service in the loop.
`scripts/catalogue.mjs` plus a `catalogue.bat` so it is a double-click.

```
catalogue/raw/     ← phone photos, named as above (git-ignored; originals stay yours)
catalogue/fixed/   ← manual repairs, if any
public/urunler/    ← finished images, committed
```

Per image: EXIF orientation corrected · white balance normalised · background removed with
**rembg + BiRefNet** (the model that survives thin chains and filigree, where older cut-out
tools smear them into a blob) · alpha matting on the edges · square crop with consistent
padding · exported at three sizes — 1200px for the lightbox, 600px for cards, 300px for
thumbnails — as **WebP with transparency**.

**Transparent, never pre-composited onto the panel colour.** The glow and the background
come from CSS, so a palette change needs no re-export, and the same image works on the cream
reading bands if it is ever wanted there.

The script is **idempotent** — same input, same output, safe to re-run — and emits a
**contact sheet**: every processed image on one page at card size, so failures are visible
in ten seconds rather than by clicking through fifty files.

**Setup:** Python, then `pip install "rembg[cli]"`. The model downloads itself on first run.
A few seconds per image on CPU.

**The repair loop.** Roughly one in ten cut-outs needs a hand, usually a thin chain crossing
a highlight. Fix that one file in [Photopea](https://www.photopea.com) — free, browser,
works like Photoshop — drop it in `catalogue/fixed/`, run again. The script prefers a fixed
file over the raw one.

## 3 · Content model

**No CMS.** The catalogue is folder-driven:

```
public/urunler/pirlanta/tektas-yuzuk_01.webp
public/urunler/altin-seti/burma-bilezik_01.webp
```

The build reads the folders. Drop an image in and the product appears in that category, its
name derived from the filename — `Tek Taş Yüzük` from `tektas-yuzuk`.

Anything a filename cannot carry goes in one small `catalogue.json` beside the folders, and
only for the products that need it:

```
spec       "22 ayar · 38.5 gr"   — ayar and gram only
alt        Turkish alt text, written by hand
featured   true | false          — max four appear on the homepage
order      optional sort override
```

**No prices, ever.** They track the gold rate; the lightbox already says so.

**Alt text is written per product, in Turkish**, not auto-generated. It is the only text a
search engine can read about an image, and this site competes on local intent.

**No individual product pages.** Category pages carry the SEO; the lightbox carries the
detail. Forty thin pages of two sentences each read as low quality to Google and go stale
the moment a piece sells.

`lib/content.ts` remains the single seam — only that file knows where products come from.

## 4 · What retires automatically

- A category's `Yakında` panel disappears as soon as it has products. No code change.
- `/galeri` fills from every category at once.
- Öne Çıkanlar appears on the homepage as soon as anything is flagged `featured`, capped at
  four, followed by the `Tüm Ürünler →` button.

## 5 · Done when

- Contact sheet reviewed and approved by Soner.
- Every image has Turkish alt text.
- Card images ≤80 KB; lightbox masters ≤250 KB.
- Lightbox verified with real images at 390 / 768 / 1440 — arrows, Esc, focus return, and
  swipe on touch.
- `npm run build` — all routes still statically generated.
- Homepage LCP unchanged with real images in place.

## 6 · Risks

1. **Stock churn.** Photographed pieces get sold. Mitigation: shoot representative pieces
   you can re-make or usually carry, and frame the catalogue as *vitrinimizden örnekler*
   rather than an inventory.
2. **Inconsistency between sessions.** The single biggest quality risk. Mitigation: shoot
   each category in one sitting, same spot, same time of day.
3. **Supplier images.** Rights plus duplicate content. Worth repeating because it is the
   tempting shortcut.
4. **Scope creep into a shop.** No cart, no prices, no accounts. The catalogue's job is to
   get someone to WhatsApp or walk in.
