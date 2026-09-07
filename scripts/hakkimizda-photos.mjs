#!/usr/bin/env node
/* Hakkımızda photographs — founder, owner, shopfront.
 *
 * Reads the three originals from images/hakkimizda/ (gitignored: originals never
 * enter the repo) and writes the page assets to public/hakkimizda/ (tracked —
 * these are page furniture, not catalogue, so the /public/urunler/ rule does
 * not apply). Re-runnable: every crop and tone value is here, not in a
 * one-off editor session.
 *
 *   npm run about-photos
 *
 * Decisions (Soner, 2026-09-07): the founder's framed print loses its black
 * frame AND its printed caption line — the page captions him itself. The
 * lapel pin stays. The owner's portrait only loses the enhancer watermark in
 * the corner. The shopfront gets a contrast lift and is cropped to the shop.
 */

import { mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "images/hakkimizda";
const OUT = "public/hakkimizda";
mkdirSync(OUT, { recursive: true });

/* Crop expressed as [x1, y1, x2, y2] in source pixels, then forced to the
 * target aspect by trimming — never padding — the longer side about its centre. */
function fit([x1, y1, x2, y2], aspect) {
  let w = x2 - x1;
  let h = y2 - y1;
  if (w / h > aspect) {
    const nw = Math.round(h * aspect);
    x1 += Math.round((w - nw) / 2);
    w = nw;
  } else {
    const nh = Math.round(w / aspect);
    y1 += Math.round((h - nh) / 2);
    h = nh;
  }
  return { left: x1, top: y1, width: w, height: h };
}

async function report(file) {
  const { width, height } = await sharp(file).metadata();
  const kb = Math.round(statSync(file).size / 1024);
  console.log(`${file}  ${width}×${height}  ${kb} KB`);
}

/* ---- Nuri Eroğlu — phone photo of the framed print ---------------------- */
{
  const src = join(SRC, "nuri-eroglu.jpeg");
  /* The frame is keystoned (the phone was not square to the wall), which a
   * rotation cannot fix and only drags a frame corner into the crop. The
   * sitter himself is upright, so: no rotation, and a crop that stays inside
   * the mat on every side and stops above the printed caption line. */
  const region = fit([70, 60, 850, 975], 4 / 5);
  await sharp(src, { failOn: "none" })
    .extract(region)
    .normalise()
    .linear(1.08, -10)
    .modulate({ saturation: 1.12 })
    .sharpen({ sigma: 0.8 })
    .webp({ quality: 84 })
    .toFile(join(OUT, "nuri-eroglu.webp"));
  await report(join(OUT, "nuri-eroglu.webp"));
}

/* ---- Filiz Eroğlu ------------------------------------------------------- */
{
  const src = join(SRC, "filiz-eroglu.jpeg");
  /* 4:5 from the top edge so the face stays where it is and the bottom strip
   * with the enhancer's sparkle mark falls away. */
  const region = fit([0, 0, 896, 1100], 4 / 5);
  await sharp(src, { failOn: "none" })
    .extract(region)
    .sharpen({ sigma: 0.6 })
    .webp({ quality: 84 })
    .toFile(join(OUT, "filiz-eroglu.webp"));
  await report(join(OUT, "filiz-eroglu.webp"));
}

/* ---- Shopfront ---------------------------------------------------------- */
{
  const src = join(SRC, "magaza.tiff");
  /* 16-bit RGBA scan → 8-bit sRGB. The crop keeps the KK sign, the whole
   * fascia and the vitrin down to its sill, and drops the neighbour's tables
   * on the right. The neighbour's posters still peek in under our own
   * fascia — no crop that keeps the fascia can lose them — so the right
   * edge gets a photographic burn: a gradient to half-black over the last
   * fifth of the width, which reads as the shade under the awning and
   * keeps the eye on the gold. */
  /* 1080 wide keeps the master under the 250 KB ceiling the catalogue
   * masters live by; next/image serves it at 448 px (lg) or viewport width,
   * so nothing larger is ever delivered. */
  const W = 1080;
  const H = 1440;
  const region = fit([0, 480, 2290, 3533], 3 / 4);
  const burn = Buffer.from(
    `<svg width="${W}" height="${H}">
       <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
         <stop offset="0.72" stop-color="#000" stop-opacity="0"/>
         <stop offset="1" stop-color="#000" stop-opacity="0.65"/>
       </linearGradient></defs>
       <rect width="${W}" height="${H}" fill="url(#g)"/>
     </svg>`,
  );
  await sharp(src, { failOn: "none", limitInputPixels: false })
    .flatten({ background: "#ffffff" })
    .toColourspace("srgb")
    .extract(region)
    .resize({ width: W, height: H, fit: "cover" })
    .linear(1.16, -22)
    .modulate({ saturation: 1.15 })
    .sharpen({ sigma: 1 })
    .composite([{ input: burn }])
    .webp({ quality: 68, effort: 6, smartSubsample: true })
    .toFile(join(OUT, "magaza.webp"));
  await report(join(OUT, "magaza.webp"));
}
