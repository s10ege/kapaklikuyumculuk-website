# CATALOGUE.md — product images, content, and how they get in

> **Stage 2 of 4.** Begins only after [`design.md`](design.md) is approved. Ends when the
> catalogue is live, the `Yakında` panels have retired themselves, and Soner has signed off
> on the contact sheet.

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

**Nothing here is in the repo.** `catalogue/raw/`, `catalogue/fixed/`, the `images/` drop
folder and `/public/urunler/` are all gitignored, so the masters and the originals live on
Soner's machine and nowhere else. That is the trial-state guard described in §5, and it
holds until the contact sheet is approved — which means a deploy made today would show
`Yakında` on all five categories regardless of what the local build shows.

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
public/urunler/pirlanta/tektas-yuzuk_01.webp
public/urunler/altin-seti/burma-bilezik_01.webp
```

The build reads the folders. Drop an image in and the product appears in that category, its
name derived from the filename — `Tek Taş Yüzük` from `tektas-yuzuk`.

Anything a filename cannot carry goes in one small `catalogue.json` beside the folders, and
only for the products that need it:

```
name       "Tek Taş Yüzük"        — the display name
spec       "22 ayar · 38.5 gr"   — ayar and gram only
alt        Turkish alt text, written by hand
note       a short line under the spec
featured   true | false          — max four appear on the homepage
order      optional sort override
```

**`name` is not optional in practice.** The slug is ASCII, and no transformation restores
`ş`, `ü` or `ı` — `tektas-yuzuk` cannot become `Tek Taş Yüzük` by rule. A Title-Cased slug is
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

> **Status 2026-08-29 — paused, awaiting photographs.** The first real batch is through:
> twelve photographs, eight products, four categories. It is not the launch catalogue and
> was never meant to be — Soner has more to shoot and will add them later. Three items
> below are green, one is measured and green, and the rest wait on pictures or on Soner.
> Nothing is committed: the masters and the originals all stay on Soner's machine.

- Contact sheet reviewed and approved by Soner.
- **The temporary `/public/urunler/` line removed from `.gitignore`.** It was added in 2.1 so
  the six trial photographs could not be published by accident, and it hides the real
  catalogue just as effectively — the images are not in the repo until it comes out.
- ✅ Every image has Turkish alt text. *(Written by hand for all eight; `spec` stays absent
  until Soner gives the ayar and gram.)*
- ◐ Card images ≤80 KB as delivered by `next/image`; the 1200px masters ≤250 KB on disk.
  *✅ card side — measured 2026-08-29, worst case 54 KB (`pirlanta-set_02` at w=750), most
  6–37 KB. ❌ one master at 272 KB: `pirlanta_pirlanta-set_02`, all blown suede and shop
  background. A tighter crop fixes it; more compression should not have to.*
- ❌ Lightbox verified with real images at 390 / 768 / 1440 — arrows, Esc, focus return, and
  swipe on touch. *Never exercised with photographs; until this batch the catalogue was
  empty.*
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
