/* The photograph → publish pipeline (CATALOGUE.md §2).
 *
 *   node scripts/catalogue.mjs [--force] [--only <substring>]
 *
 * Reads catalogue/raw/, writes public/urunler/<kategori>/<parça>_<nn>.webp, and
 * emits catalogue/contact-sheet.html — the review surface for the polish pass.
 *
 * WHAT THIS SCRIPT DOES, AND WHAT IT DELIBERATELY LEAVES ALONE
 * Background removal was retired on 2026-08-29 — no rembg, no BiRefNet, no
 * venv, no ~3.5 minutes an image. Photographs ship polished with their
 * backgrounds kept, so all that is left here is the mechanical half:
 * orientation, a square, one master. Everything an eye has to judge — crop
 * placement, straightening, exposure and white balance normalised across a
 * sitting — is the polish pass, and it lands back in catalogue/fixed/, which
 * wins over catalogue/raw/ for the same stem.
 *
 * WHY THE CROP IS DUMB ON PURPOSE
 * A centred square, nothing cleverer. The old version trimmed the transparent
 * margin a cut-out left and re-centred on what remained; an opaque photograph
 * offers no such edge, and guessing at the subject would move the crop
 * unpredictably between two frames of one sitting. A wrong-but-consistent crop
 * is one drag in the polish pass. An inconsistent one is invisible until the
 * grid is assembled, which is the expensive moment to find it.
 *
 * WHY ONE MASTER AND NOT THREE SIZES
 * §2 originally called for 1200 / 600 / 300px exports. next/image already
 * resizes and re-encodes to AVIF/WebP per breakpoint from a single source, and
 * nothing in the code ever referenced the 600 or 300 files — so two thirds of
 * the export was dead weight in a repo that syncs to Drive. One 1200px master
 * per image; the ≤80 KB card / ≤250 KB lightbox budgets are met on delivery.
 *
 * WHY sharp RUNS WITH failOn:"none"
 * Phone JPEGs routinely carry a few extraneous bytes before a marker. libvips
 * treats that as fatal by default, which would reject a photograph that every
 * other program on the machine opens fine.
 */

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join, resolve } from "node:path";

import sharp from "sharp";

import { getCategorySlugs } from "../lib/content.ts";

const ROOT = resolve(import.meta.dirname, "..");
const RAW = join(ROOT, "catalogue", "raw");
const FIXED = join(ROOT, "catalogue", "fixed");
const OUT = join(ROOT, "public", "urunler");
const SHEET = join(ROOT, "catalogue", "contact-sheet.html");
const CACHE = join(ROOT, "catalogue", ".cache.json");

/* Bumping this invalidates every cache entry — do it whenever a processing step
 * below changes, or a re-run will silently keep the old output. 3 is the opaque
 * pipeline; 1 and 2 were the rembg cut-out one, and every master they produced
 * carries an alpha channel this version no longer writes. */
const PIPELINE_VERSION = 3;

const MASTER = 1200;
const MAX_BYTES = 250 * 1024;

const ARGS = process.argv.slice(2);
const FORCE = ARGS.includes("--force");
const ONLY = ARGS.includes("--only") ? ARGS[ARGS.indexOf("--only") + 1] : null;

const SLUGS = new Set(getCategorySlugs());
const NAME_RE = /^([a-z0-9-]+)_([a-z0-9-]+)_(\d{2})$/;
const SOURCE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

/* ── Square framing ───────────────────────────────────────────────────────── */

/* EXIF orientation first: every phone in the first real batch wrote a landscape
 * file with an orientation tag rather than rotating the pixels, so skipping
 * .rotate() would square-crop a sideways frame. Then the centred square, at
 * MASTER on both edges.
 *
 * Opaque, not transparent. The old rule existed so a cut-out could float on any
 * panel colour; with the background kept it is moot, and the espresso ground
 * now shows around the card rather than through the image (CATALOGUE.md §2).
 */
async function squareFrame(raw) {
  return sharp(raw, { failOn: "none" })
    .rotate()
    .resize(MASTER, MASTER, { fit: "cover", position: "centre" })
    .toBuffer();
}

/* Step quality down until the master fits the lightbox budget. Starts high
 * because gold is all gradient and banding shows immediately. */
async function encode(squareBuffer) {
  for (const quality of [84, 78, 72, 66, 60]) {
    const out = await sharp(squareBuffer).webp({ quality, effort: 6 }).toBuffer();
    if (out.length <= MAX_BYTES) return { out, quality };
  }
  const out = await sharp(squareBuffer).webp({ quality: 55, effort: 6 }).toBuffer();
  return { out, quality: 55 };
}

/* ── Sources ──────────────────────────────────────────────────────────────── */

/* A repaired file in catalogue/fixed/ wins over the raw one regardless of
 * extension, so the polish round trip (§2) does not care what it saved as. */
function collectSources() {
  const found = new Map();

  for (const dir of [RAW, FIXED]) {
    if (!existsSync(dir)) continue;

    for (const file of readdirSync(dir)) {
      const ext = extname(file).toLowerCase();
      if (!SOURCE_EXT.has(ext)) continue;

      const stem = basename(file, extname(file));
      const match = NAME_RE.exec(stem);

      if (!match) {
        console.warn(`  skipped  ${file} — name is not <kategori>_<parça>_<nn>`);
        continue;
      }

      const [, category, piece, index] = match;
      if (!SLUGS.has(category)) {
        console.warn(`  skipped  ${file} — "${category}" is not a published category`);
        continue;
      }

      // FIXED is walked second, so it overwrites RAW's entry for the same stem.
      found.set(stem, { stem, category, piece, index, path: join(dir, file) });
    }
  }

  const sources = [...found.values()].sort((a, b) => a.stem.localeCompare(b.stem));
  return ONLY ? sources.filter((s) => s.stem.includes(ONLY)) : sources;
}

/* ── Contact sheet ────────────────────────────────────────────────────────── */

/* HTML rather than a composited PNG: it can show the real ground colour, the
 * real card size and the real file weight, and it reflows to whatever window it
 * is opened in. Card width matches the site's 4-up desktop grid.
 *
 * This is now the review surface for the polish pass — which crops sit off
 * centre, which frames carry shop background, whether the exposure matches
 * across a sitting — rather than a detector for failed cut-outs. */
function writeContactSheet(entries) {
  const cards = entries
    .map((e) => {
      const rel = `../public/urunler/${e.category}/${e.piece}_${e.index}.webp`;
      return `    <figure>
      <img src="${rel}" alt="${e.stem}" loading="lazy">
      <figcaption>
        <b>${e.piece}_${e.index}</b>
        <span>${e.category}</span>
        <span>${e.kb} KB · q${e.quality}</span>
      </figcaption>
    </figure>`;
    })
    .join("\n");

  writeFileSync(
    SHEET,
    `<!doctype html>
<meta charset="utf-8">
<title>Kontak sayfası — ${entries.length} görsel</title>
<style>
  :root { color-scheme: dark }
  body { margin: 0; padding: 32px; background: #17120E; color: #E8E3DA;
         font: 14px/1.5 "Jost", system-ui, sans-serif }
  h1 { font-size: 20px; font-weight: 500; margin: 0 0 4px }
  p.meta { color: #9A958D; margin: 0 0 28px }
  .grid { display: grid; gap: 1px; background: #262B31;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          border: 1px solid #262B31 }
  figure { margin: 0; background: #241C15 }
  img { display: block; width: 100%; aspect-ratio: 1; object-fit: cover }
  figcaption { display: flex; flex-direction: column; gap: 2px;
               padding: 12px; font-size: 12px; color: #9A958D }
  figcaption b { color: #E8E3DA; font-weight: 500; font-size: 14px }
</style>
<h1>Kontak sayfası</h1>
<p class="meta">${entries.length} görsel · panel #241C15 üzerinde, kart boyutunda · ${new Date().toLocaleString("tr-TR")}</p>
<div class="grid">
${cards}
</div>
`,
    "utf8",
  );
}

/* ── Run ──────────────────────────────────────────────────────────────────── */

mkdirSync(RAW, { recursive: true });
mkdirSync(FIXED, { recursive: true });

const sources = collectSources();

if (sources.length === 0) {
  console.log(`No sources in ${RAW}.`);
  console.log("Name them <kategori-slug>_<parça-adı>_<nn>.jpg — see CATALOGUE.md §1.");
  process.exit(0);
}

const cache = existsSync(CACHE) && !FORCE ? JSON.parse(readFileSync(CACHE, "utf8")) : {};

const entries = [];
let processed = 0;

for (const source of sources) {
  const raw = readFileSync(source.path);
  const key = createHash("sha1")
    .update(raw)
    .update(`v${PIPELINE_VERSION}:${MASTER}`)
    .digest("hex");

  const dir = join(OUT, source.category);
  const target = join(dir, `${source.piece}_${source.index}.webp`);
  const cached = cache[source.stem];

  if (cached?.key === key && existsSync(target)) {
    entries.push({ ...source, ...cached });
    console.log(`  cached      ${source.stem}`);
    continue;
  }

  process.stdout.write(`  processing  ${source.stem} … `);

  try {
    const framed = await squareFrame(raw);
    const { out, quality } = await encode(framed);

    mkdirSync(dir, { recursive: true });
    writeFileSync(target, out);

    const record = { key, kb: Math.round(out.length / 1024), quality };
    cache[source.stem] = record;
    entries.push({ ...source, ...record });
    processed++;

    console.log(`${record.kb} KB`);
  } catch (error) {
    console.log("FAILED");
    console.error(`              ${error.message}`);
  }
}

writeFileSync(CACHE, JSON.stringify(cache, null, 2) + "\n", "utf8");
writeContactSheet(entries);

const oversize = entries.filter((e) => e.kb > 250);
console.log(
  `\n${entries.length} image(s), ${processed} newly processed. ` +
    `Contact sheet: ${SHEET}`,
);
if (oversize.length > 0) {
  console.log(`⚠ over the 250 KB master budget: ${oversize.map((e) => e.stem).join(", ")}`);
}
if (existsSync(join(ROOT, ".gitignore"))) {
  const ignored = readFileSync(join(ROOT, ".gitignore"), "utf8").includes("/public/urunler/");
  if (ignored) {
    console.log("ℹ /public/urunler/ is still gitignored — trial state. See CATALOGUE.md §5.");
  }
}
