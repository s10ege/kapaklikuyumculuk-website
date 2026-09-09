/* Rasterise the brand icons from app/icon.svg.
 *
 *   npm run icons
 *
 * app/icon.svg is the artwork — the vector original of the shop badge, which
 * components/Lockup.tsx spent stage 1 assuming did not exist. Everything below
 * is generated from it, so there is exactly one copy of the drawing in the repo
 * and the rasters can never drift from it.
 *
 * The outputs are COMMITTED, for the same reason scripts/og.mjs commits its
 * cards: they are the artefact Soner reviews, and generating them inside
 * `next build` would put image work on the critical path of every deploy.
 * Re-run this whenever app/icon.svg changes — nothing else regenerates them.
 *
 * No browser here, unlike og.mjs. That script needs Chrome because its cards
 * are typeset in webfonts; this badge draws its -KK- monogram as stroked lines
 * rather than <text>, so it has no font dependency at all and sharp can render
 * it directly.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { readFile } from "node:fs/promises";

import sharp from "sharp";

const SOURCE = "app/icon.svg";

const svg = await readFile(SOURCE, "utf8");

/* The Apple touch icon must be a full-bleed square.
 *
 * iOS masks whatever you give it with its own squircle, so an icon that is
 * already rounded gets rounded twice and shows four dark notches at the corners
 * on the home screen. Every other size keeps the rounded badge, which is right
 * for a browser tab and for Google's search results.
 *
 * This rewrites the corner radius on the <rect> elements ONLY. The two <ellipse>
 * elements that draw the double oval also carry an `rx`, and it means something
 * completely different there — a blanket replace turns the ovals into circles
 * and ruins the mark. Hence the element-scoped match, and the count assertion
 * below: if the artwork ever gains or loses a rect, this fails loudly instead of
 * silently shipping a double-rounded icon.
 */
const EXPECTED_RECTS = 3;
let rects = 0;
const squared = svg.replace(/<rect\b[^>]*>/g, (tag) => {
  rects += 1;
  return tag.replace(/\brx="[^"]*"/, 'rx="0"');
});

if (rects !== EXPECTED_RECTS) {
  console.error(
    `${SOURCE}: expected ${EXPECTED_RECTS} <rect> elements, found ${rects}. ` +
      "The badge artwork changed shape — check which rects carry the corner " +
      "radius before trusting this script.",
  );
  process.exit(1);
}

const png = (source, size) =>
  sharp(Buffer.from(source)).resize(size, size).png().toBuffer();

/* ICO, containing three PNGs.
 *
 * A 6-byte ICONDIR, then one 16-byte ICONDIRENTRY per image, then the image
 * data. Embedded PNG (rather than BMP) has been readable by every browser since
 * Vista, and by Googlebot, which is the reader that matters here.
 *
 * A 256px entry would be written as 0 in the width/height bytes — that is the
 * format's escape hatch for its one-byte fields. Not needed: the .ico exists for
 * the bare /favicon.ico that browsers and crawlers probe, and app/icon.svg
 * serves anything that wants a large icon.
 */
function ico(images) {
  const HEADER = 6;
  const ENTRY = 16;

  const dir = Buffer.alloc(HEADER);
  dir.writeUInt16LE(0, 0); // reserved
  dir.writeUInt16LE(1, 2); // 1 = icon
  dir.writeUInt16LE(images.length, 4);

  let offset = HEADER + ENTRY * images.length;
  const entries = [];

  for (const { size, data } of images) {
    const entry = Buffer.alloc(ENTRY);
    entry.writeUInt8(size, 0); // width
    entry.writeUInt8(size, 1); // height
    entry.writeUInt8(0, 2); // palette size, 0 for truecolour
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // colour planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += data.length;
  }

  return Buffer.concat([dir, ...entries, ...images.map((i) => i.data)]);
}

await mkdir("public/brand", { recursive: true });

/* 16 · 32 · 48. Google renders favicons at 48; the other two are what a browser
   tab and a bookmark bar ask for. */
const faviconSizes = [16, 32, 48];
const faviconImages = await Promise.all(
  faviconSizes.map(async (size) => ({ size, data: await png(svg, size) })),
);

const outputs = [
  ["app/favicon.ico", ico(faviconImages)],
  ["app/apple-icon.png", await png(squared, 180)],
  ["public/brand/logo-512.png", await png(svg, 512)],
];

for (const [file, data] of outputs) {
  await writeFile(file, data);
  console.log(`${file}  ${Math.round(data.length / 1024)} KB`);
}
