/* Render the Open Graph cards to PNG.
 *
 *   npm run og                       # against a server on :3000
 *   OG_BASE=http://localhost:3001 npm run og
 *
 * Photographs the five cards laid out by app/dev/og and writes them to
 * public/og/. The PNGs are committed: they are the artefact, and generating
 * them at build time would put a Google Fonts fetch inside `next build`.
 * Re-run this whenever the lockup, the palette or a category cover changes —
 * nothing else regenerates them, which is the one cost of this approach and
 * the reason it is written down here rather than assumed.
 *
 * Uses the system Chrome, like scripts/shots.mjs, so it needs no browser
 * download. It screenshots each card *element* rather than the viewport, so
 * the surrounding page chrome never lands in the file.
 */
import { mkdir } from "node:fs/promises";

import { chromium } from "@playwright/test";

const BASE = process.env.OG_BASE ?? "http://localhost:3000";

/* All five cards go to public/og/ and are named explicitly through
   openGraph() in lib/metadata.ts.

   The site-wide one was briefly app/opengraph-image.png — Next's file
   convention, which emits og:image and its dimensions with no wiring and is
   inherited by every route that does not override it. That inheritance is
   exactly what made it unusable: openGraph is replaced *wholesale* by any page
   that declares one, and every page has to declare one to get its own og:url
   right. The five interior pages ended up with a correct og:url and no card at
   all. Two mechanisms, each cancelling the other.

   So: one mechanism. The alt text lives with the URL in lib/metadata.ts rather
   than in a sidecar .txt, and Next still derives the twitter:* tags from the
   openGraph block. */
const OUT = "public/og";

/* Facebook caps og:image at 8 MB and X at 5 MB, and both downscale anything
   larger than 1200x630 anyway. A card of flat espresso and one photograph
   lands far under this; the check exists to catch a card that has quietly
   become a full-bleed photograph. */
const MAX_BYTES = 400 * 1024;

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({
  viewport: { width: 1400, height: 900 },
  /* 1, not 2. These are consumed at exactly 1200x630 by every platform that
     reads them; a 2x card is four times the bytes for a size nothing renders. */
  deviceScaleFactor: 1,
});

await page.goto(`${BASE}/dev/og`, { waitUntil: "domcontentloaded" });

/* Playwright's element screenshot clips the viewport to the element's box, so
   anything `position: fixed` that overlaps that box lands in the file. Two
   things do: Next's dev-tools button, bottom-left, which put a stray dark
   rounded badge into the first run of these cards; and the site's own CallFab,
   bottom-right, which is rendered site-wide from the root layout. Neither is
   part of the card. */
await page.addStyleTag({
  content: `
    nextjs-portal,
    [data-nextjs-dev-tools-button],
    [data-nextjs-toast],
    #__next-build-watcher,
    a[href^="tel:"][class*="fixed"] { display: none !important; }
  `,
});

/* Fonts before pixels. The wordmark is letter-spaced uppercase Jost and the
   headline is Ibarra Real Nova — a fallback-face capture would look almost
   right, which is the worst kind of wrong to commit. */
await page.evaluate(() => document.fonts.ready);

await page.evaluate(
  () =>
    new Promise((resolve) => {
      const pending = [...document.images].filter((i) => !i.complete);
      if (pending.length === 0) return resolve(undefined);
      let left = pending.length;
      const done = () => --left === 0 && resolve(undefined);
      for (const image of pending) {
        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      }
      setTimeout(resolve, 5000);
    }),
);

const cards = await page.locator("[id^='og-']").all();

if (cards.length === 0) {
  console.error(
    "No cards found at /dev/og. Is the server running, and is NODE_ENV not production?",
  );
  process.exit(1);
}

let failed = false;

for (const card of cards) {
  const id = await card.getAttribute("id");
  const name = id.replace(/^og-/, "");
  const file = `${OUT}/${name}.png`;

  /* Scrolled into view first: the card images are eager, but a card far down
     the page can still be mid-decode when its turn comes. */
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);

  const buffer = await card.screenshot({ path: file });
  const kb = Math.round(buffer.length / 1024);

  if (buffer.length > MAX_BYTES) {
    console.error(`${file}  ${kb} KB — over the ${MAX_BYTES / 1024} KB budget`);
    failed = true;
  } else {
    console.log(`${file}  ${kb} KB`);
  }
}

await browser.close();

if (failed) process.exit(1);
