# CATALOGUE.md — product images, content, and how they get in

> **Stage 2 of 4.** Begins only after [`design.md`](design.md) is approved. Ends when the
> catalogue is live, the `Yakında` panels have retired themselves, and Soner has signed off
> on the contact sheet.
>
> **Status: ⏳ awaiting approval** — final iteration 2026-09-08 (§7 below). Nothing in this
> file marks the stage approved or closed; that is Soner's call in writing, and stage 3 does
> not begin before it.

## 1 · Photography brief

> **Revised 2026-08-29.** No professional photographer, and no cut-out step. The
> photographs ship as they are, polished — cropped, straightened and exposure-corrected
> with Claude — with their backgrounds kept. That makes these rules the entire quality
> bar: what the phone captures is what the visitor sees.

**Equipment** — the phone you already have · a window · a stack of books to brace the
phone · something to shoot on that you can reuse every time.

**Rules, in order of how much they matter:**

1. **Take the piece out of the vitrin.** Shooting through display glass is unfixable in
   software — reflections, colour cast, soft focus. Still the single most expensive
   mistake available.
2. **The background ships now. Choose it once.** Same spot, same surface, same backdrop
   for every photo in a sitting. A sheet of light paper still works best — see why below —
   but whatever it is, keep it consistent and uncluttered: no price tags, no till, no
   stray tools.
3. **No flash.** It burns a white hotspot into gold and flattens the form. Window light,
   out of direct sun.
4. **One light source.** Shop LEDs mixed with daylight gives a split colour cast that
   cannot be corrected in a single pass. Either shoot during the day with the shop lights
   off, or after hours with them on — pick one and never mix.
5. **Same distance, same angle, every time.** Consistency across fifty photos reads as
   professional far more than any single photo does.
6. **Leave a clear margin** around the piece in frame — the square crop needs room on
   every side.
7. **Clean the piece first.** Fingerprints and dust are invisible at arm's length and
   glaring at 1200px.
8. **Stand slightly off-axis.** Polished gold mirrors the room, including the
   photographer. Dark clothing, and do not shoot straight down over the piece.

**Why a light background still wins.** A phone's auto-exposure meters the whole frame.
Point it at gold on something dark and it brightens the scene, blowing out exactly the
highlights that make gold look like gold. Against a light neutral surface the metal
exposes correctly and keeps the reflections that read as shine. The *shoot light* half of
the old principle survives on its own merits; the *composite onto espresso* half is dead.

**Shot list.** One photo per product is the requirement. A second angle is welcome but
optional. Scale shots on a hand are a phase-two nicety.

**File naming** — this feeds the pipeline directly:

```
yuzuk_baget-yuzuk_01.jpg
altin-seti_burma-bilezik_01.jpg
kupe-modelleri_halka-kupe_01.jpg
```

Category slug, piece, number. The four published slugs are `altin-seti`,
`kupe-modelleri`, `yuzuk`, `ozel-tasarim-takilar`. *(Five until 2026-09-08 — see §5.)*

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

> **Revised 2026-08-29.** Background removal is gone — no rembg, no BiRefNet, no venv, no
> ~3.5 minutes per image. What remains is mechanical preparation by the script plus a
> polish pass done with Claude. The rembg design and its measurements stay in this file's
> git history.

The folders and the loop are unchanged:

```
catalogue/raw/     ← phone photos, named as above (git-ignored; originals stay yours)
catalogue/fixed/   ← polished repairs from the Claude pass
public/urunler/    ← finished images, committed
```

**The script** (`scripts/catalogue.mjs`, `catalogue.bat`, or `npm run catalogue`), per
image: EXIF orientation corrected · centred square crop with consistent padding ·
exported as one **1200px opaque WebP** master. Still idempotent — keyed on the source
bytes, `--force` overrides — and still emits the **contact sheet**, which is now the
review surface for the polish pass rather than a cut-out failure detector.

**The polish pass, with Claude.** After a batch runs, review the contact sheet in a
Cowork session with this folder connected. Claude fixes what needs fixing, per image:

- **Crop placement** — re-centring the square on the piece. This is the manual version of
  the CMS hotspot idea, done once at ingest.
- **Straightening** and small rotations.
- **Exposure and white balance**, normalised across the batch so tiles match. The old
  paper-border auto-correction is gone with the paper guarantee, so this is a judged,
  per-sitting correction now — which is also why rule 4 (one light source) matters more
  than ever.
- Occasionally, cloning out a distraction at the edge of frame.

Fixed files land in `catalogue/fixed/`; the script prefers a fixed file over the raw one,
and the loop re-runs. The same repair mechanic as before, with Claude in Photopea's chair.

**One master, not three sizes** — unchanged. `next/image` derives every delivered size
from the single 1200px source; the ≤80 KB card / ≤250 KB lightbox budgets are met on
delivery.

**What is in the repo.** `/public/urunler/` — the masters and `catalogue.json` — has been
committed since 2026-09-07, when Soner called stage 2 over and the temporary ignore came
out. `catalogue/raw/`, `catalogue/fixed/` and the `images/` drop folder stay gitignored: the
originals and the polished repairs live on Soner's machine and nowhere else. A deploy now
shows the full catalogue.

**Opaque, not transparent.** The old rule — *transparent, never pre-composited* — existed
so cut-outs could float on any panel colour. With backgrounds kept it is moot. Masters
are ordinary opaque WebPs, and the espresso ground shows around them as the card frame,
not through them.

### Pending rework (code, not this document)

1. ✅ **2026-08-29.** `scripts/catalogue.mjs` — rembg step and its flags (`--alpha`,
   `--fast`, `--model`, `--no-wb`) removed along with the venv discovery, the working-size
   cap, the scratch-PNG handoff and the paper-border white balance; `PIPELINE_VERSION`
   bumped to 3. `squareFrame` is now a centred `fit: "cover"` crop — an opaque photograph
   has no transparent margin to trim, so crop placement moves to the polish pass.
2. ✅ **2026-08-29.** `components/CategoryTiles.tsx` + the `withCover` comment in
   `lib/content.ts` — revised D16: the tile is filled by the photograph (`object-cover`),
   with the smallest scrim that keeps the gold label legible. Measured behind the label:
   4.6–8.1:1 against the 3:1 bar for text this size.
   `.claude/skills/catalogue-pipeline/SKILL.md` was rewritten with it — it is the
   operational mirror of §2 and still described the cut-out flow end to end.
3. ✅ **2026-08-29.** Cleanup done: the rembg venv (`%LOCALAPPDATA%\kk-catalogue`, 618 MB)
   and the four ONNX model files under `~/.rembg` — `birefnet-general`,
   `birefnet-general-lite`, `bria-rmbg`, `isnet-general-use` — deleted. **2.84 GB back.**
   Verified afterwards by forcing a real re-encode with no venv present: identical output,
   no Python involved anywhere. Recoverable if it is ever wanted again — the venv is one
   `pip install "rembg[cli,cpu]"` and the weights re-download on first run — but nothing in
   this repo reads either path any more.

## 3 · Content model

**No CMS.** The catalogue is folder-driven:

```
public/urunler/yuzuk/baget-yuzuk_01.webp
public/urunler/altin-seti/burma-bilezik_01.webp
```

The build reads the folders. Drop an image in and the product appears in that category, its
name derived from the filename — `Baget Yuzuk` from `baget-yuzuk`.

Anything a filename cannot carry goes in one small `catalogue.json` beside the folders, and
only for the products that need it:

```
name       "Baget Yüzük"         — the display name
spec       "22 ayar · 38.5 gr"   — ayar and gram only
alt        Turkish alt text, written by hand
note       a short line under the spec
featured   true | false          — max four appear on the homepage
order      optional sort override
```

**`name` is not optional in practice.** The slug is ASCII, and no transformation restores
`ş`, `ü` or `ı` — `baget-yuzuk` cannot become `Baget Yüzük` by rule. A Title-Cased slug is
the fallback so a freshly dropped-in image still appears rather than being silently skipped,
but anything a customer reads gets a real name here.

A malformed `catalogue.json` costs the display names and the featured flags, not the build:
it is parsed defensively and a bad file logs a warning and is ignored.

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

> **Status 2026-09-08 — ⏳ awaiting approval.** A final iteration ran on 2026-09-08 (§7):
> the category restructure, the copy rewrite and its gate, seasonal hours, the canonical
> address, the map and the Hakkımızda layout. The stage is **not** approved or closed —
> that is Soner's call in writing, and stage 3 does not begin before it.
>
> *(Previous status 2026-09-07 — stage 2 over, not sealed.)* Soner called the stage done and the
> catalogue was committed: `/public/urunler/` left `.gitignore`, **60 masters, 57 products,
> all five categories populated**, `catalogue.json` with plain-Turkish names and
> hand-written alt. The Hakkımızda page carries the founder, the owner and the shopfront.
> "Not sealed": Soner will keep adjusting layout and text, and `spec` (ayar · gram) and the
> `featured` four are still his to supply. Earlier the same day: 61 frames from the 28–29 Aug
> shoot arrived on a new machine (the first batch had stayed gitignored on the old one),
> Soner triaged a numbered artifact and dropped 30, multi-piece frames were cropped into
> single products, polish pass in `catalogue/fixed/`; decisions — simple product names
> (Bilezik, Kolye, Küpe, Yüzük, Takım), the 29 Aug box shots shipped with a tight crop.
>
> *(Previous status 2026-08-29 — paused, awaiting photographs: twelve photographs, eight
> products, four categories, masters and originals on Soner's machine only.)*

- ✅ Contact sheet accepted by Soner 2026-09-07 — he called stage 2 over. *(Flags left on
  it as notes, not blockers: hangtags still visible on about six frames, shop background
  around the box shots, the red-velvet rings soft-focus, one blurred-out tag on
  `tek-tas-modelleri/yuzuk-04`.)*
- ✅ **The temporary `/public/urunler/` line removed from `.gitignore` 2026-09-07.** It was
  added in 2.1 so the six trial photographs could not be published by accident; the real
  catalogue is in the repo from this commit on.
- ✅ Every image has Turkish alt text. *(Written by hand for all 57 products, 2026-09-07;
  `spec` stays absent until Soner gives the ayar and gram.)*
- ◐ Card images ≤80 KB as delivered by `next/image`; the 1200px masters ≤250 KB on disk.
  *✅ masters — all 60 within 250 KB (the script steps quality down). ❌ card side — measured
  2026-09-07 at w=750: 11 of 60 exceed 80 KB, worst 129 KB (`pirlanta/takim-01`), every one
  a box/suede background; the paper-sitting shots are 12–50 KB. Stage 3 decides between a
  lower card `quality` and tighter crops on those eleven.*
- ◐ Lightbox verified with real images at 390 / 768 / 1440 — arrows, Esc, focus return, and
  swipe on touch. *✅ 2026-09-07 on a production build: opens from the card, arrows step,
  Esc closes, focus returns to the card, the image loads in the dialog at every width.
  ❌ swipe — needs real touch hardware (stage 3.5).*
- ✅ `npm run build` — all routes still statically generated.
- ❌ Homepage LCP unchanged with real images in place.

## 6 · Risks

1. **Stock churn.** Photographed pieces get sold. Mitigation: shoot representative pieces
   you can re-make or usually carry, and frame the catalogue as *vitrinimizden örnekler*
   rather than an inventory.
2. **Inconsistency between sittings — now the single biggest quality risk.** With
   backgrounds kept, every difference in surface, light and framing ships to the visitor.
   Mitigation: shoot each category in one sitting, same spot, same surface, same time of
   day; Claude's batch exposure pass narrows what remains.
3. **Supplier images.** Rights plus duplicate content. Worth repeating because it is the
   tempting shortcut.
4. **Scope creep into a shop.** No cart, no prices, no accounts. The catalogue's job is to
   get someone to WhatsApp or walk in.

## 7 · Final iteration — 2026-09-08

Branch `final-tweaks`, seven commits. `tsc`, lint, **66 unit** and **210 e2e** green; build
fully static, 20 routes, no `ƒ`. Screenshots at 390 / 768 / 1440 in
[`screenshots/final-tweaks/`](screenshots/final-tweaks/).

### Category restructure — five became four

`altin-seti` (now **Altın Setleri**) · `kupe-modelleri` · **`yuzuk`** · `ozel-tasarim-takilar`

- **`pirlanta` is retired.** Every piece under it is white gold, not diamond, so the name
  was a claim the shop cannot stand behind — and it was in the slug, the H1, the nav, the
  footer, the sitemap and the JSON-LD. Its su yolu takımı moved to `altin-seti` as
  `takim-05`; its five rings to `yuzuk` as `yuzuk-11`…`yuzuk-15`.
- **`tek-tas-modelleri` became `yuzuk`.** The page carried ten rings and most were not
  tek taş; the slug was naming a subset of its own contents. Everything stayed.
- One product renamed with it: *Tektaş Yüzük* → **Çevre Taşlı Yüzük**. It is an oval with a
  set halo, and the old name asserted the stone the category had just stopped asserting.
- Sources renamed, `catalogue.json` rekeyed and reordered, pipeline re-run. **60 masters,
  57 products.** `PIPELINE_VERSION` unchanged — the cache keys on the full stem, which
  carries the category, so every renamed file was already a miss. 59 of 60 re-encoded
  byte-identically.
- ⚠️ **One master was rebuilt rather than moved.** A rename loop overwrote the raw for the
  tek-taş *Örgü Yüzük*; the raws are hand-crops of multi-piece frames, not whole originals,
  so it could not be found in `images/` by search. It was regenerated from the committed
  1200px master — PSNR 44.7 dB, visually lossless, 12 KB smaller — which caps that one
  source at 1200px if `MASTER` is ever raised. Both catalogue folders are gitignored, so
  nothing about this is in the repo; drop the original hand-crop back into `catalogue/raw/`
  whenever it suits.
- Both retired paths **301 to `/urunler/yuzuk`**, and every rule that used to land on them
  now names the final destination. `/urunler/pirlanta` left the reclaimed list — the only
  path ever to make that trip.

### Copy — one voice, and a gate behind it

`lib/filler.ts` is deleted. `lib/copy.ts` holds every sentence a visitor reads, in
*sade esnaf sesi*: the owner talking across the counter, first person plural, short
sentences, concrete over evocative.

`tests/copy.test.mts` is the gate `TECHNICAL.md` §3 specified and nobody had written. It
walks the copy recursively and fails the build on a ~30-word banned list, exclamation marks,
rhetorical questions, sentences opening `Biz,` or `Sizin için`, paragraphs over three
sentences (four on Hakkımızda), the locality appearing other than exactly once per page,
and meta descriptions outside 120–155 characters. It also asserts the copy still answers
what customers actually ask: ayar and gram on the tag, why no price is printed, weighing in
front of you, deductions said before, resizing and repair, how long an order takes.

### Hours, address, map

- **Two seasons, both published all year** — 09:00–19:00 May–September, 09:00–18:00
  October–April, closed Sunday. Today's is emphasised client-side; the page is correct
  whenever it is read, which a static build could not otherwise promise. JSON-LD emits three
  `openingHoursSpecification` entries, because winter crosses New Year.
- **`Cumhuriyet Mah., Pınar Bulvarı No: 56/C`** — the door number was 56/A, carried in from
  a directory. The Ziraat landmark is gone: a landmark is a second address in everything but
  name, and it decays silently when the branch moves.
- **Coordinates published** from the shop's own Maps listing, so the pin, the street number
  and the place ID describe one door. The embed drops to a coordinate pin — the address-keyed
  one it replaced rendered a *route* from "Kapaklı", which is a trip planner where a location
  belonged.
- **Yol Tarifi** asks on Apple platforms and goes straight to Google elsewhere, through a
  prerendered `/yol-tarifi` hop so the click counts as a page view.

### Hakkımızda layout

The shop photograph and the prose now end on the same line, structurally — `items-stretch`
plus `h-full` and `object-cover`, asserted at 1024 / 1280 / 1440 rather than eyeballed. The
portrait pair moved below the two-column grid; in the column it forced the shopfront into a
0.53-aspect sliver. **Names stay under the faces** on Soner's instruction mid-pass.

### What still needs Soner, unchanged from 2026-09-07

- **`spec` — ayar and gram per piece.** Absent on all 57. The copy now promises the tag
  carries it, which makes this the most visible gap on the site.
- **The `featured` four.** Unset, so Öne Çıkanlar stays hidden.
- **The contact-sheet flags** — hangtags on about six frames, the soft-focus velvet rings.

### And one new thing, which is one boolean

`contact.whatsapp.pending` is still `true`, so every button reads "Bizi Arayın" and links to
`tel:`. The new copy is written to name WhatsApp, and the four lines that do ask that flag —
they currently render the phone wording, so the site is consistent either way. Confirming
the number and flipping the boolean switches the buttons and the sentences together.
