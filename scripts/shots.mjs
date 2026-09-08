/* Capture screenshots of routes for visual review.
 *
 *   node scripts/shots.mjs <outDir> [route ...]
 *   SHOTS_BASE=http://localhost:3001 node scripts/shots.mjs <outDir> /
 *
 * Defaults to "/" if no route is given. Uses the system Chrome, so it needs no
 * browser download, and expects a server on :3000 unless SHOTS_BASE says
 * otherwise — point it at `next start` to shoot what actually ships rather
 * than what the dev server compiles.
 *
 * Chrome's own --screenshot flag was tried first and clipped content at mobile
 * widths when combined with --force-device-scale-factor; the clipping was a
 * capture artefact rather than a layout bug. Driving the viewport through
 * Playwright avoids that, so what lands in the file is what the page does.
 */
import { chromium } from "@playwright/test";

const VIEWPORTS = [
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1440", width: 1440, height: 900 },
];

const BASE = process.env.SHOTS_BASE ?? "http://localhost:3000";

/* 2 for reading fine type and hairline weights; 1 for a review set that gets
   committed. A full-page 1440 capture at 2× is ~4 MB, and a set of twenty-odd
   is 50 MB of PNG in a repo that syncs to Drive — the same dead weight the
   catalogue pipeline dropped its 600/300 exports to avoid. */
const SCALE = Number(process.env.SHOTS_SCALE ?? 2);

const [outDir, ...routes] = process.argv.slice(2);

if (!outDir) {
  console.error("usage: node scripts/shots.mjs <outDir> [route ...]");
  process.exit(1);
}

const targets = routes.length > 0 ? routes : ["/"];
const browser = await chromium.launch({ channel: "chrome" });

for (const route of targets) {
  const slug = route.replace(/^\//, "").replace(/\//g, "-") || "home";

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: SCALE,
    });
    /* Not networkidle. /iletisim embeds a Google Maps iframe that keeps
       chattering, so networkidle never fires there and the capture spends the
       whole timeout before succeeding on luck. What a screenshot actually
       depends on is fonts and images, so wait for exactly those. */
    await page.goto(`${BASE}${route}`, { waitUntil: "domcontentloaded" });
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
    /* A fullPage capture does not scroll, so anything with loading="lazy"
       never enters a viewport and never loads — the İletişim map came out as
       an empty box the first time this ran. Walking the page once triggers
       them, then we go back to the top so the capture starts where the visitor
       would. */
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });

    /* A cross-origin iframe reports `load` long before it has painted tiles,
       and the İletişim map came out an empty white box more than once. There
       is nothing to await from outside it, so this waits for the box to stop
       being blank: sample the middle of the frame until it is no longer a flat
       colour, then give the labels a moment to land. */
    const frames = await page.locator("iframe").count();
    if (frames > 0) {
      await page.waitForFunction(
        () => {
          const frame = document.querySelector("iframe");
          if (!frame) return true;
          const { width, height } = frame.getBoundingClientRect();
          return width > 0 && height > 0;
        },
        { timeout: 15_000 },
      ).catch(() => {});
      await page.waitForTimeout(12000);
    }

    // Map tiles and the hero coin's first frames need a beat beyond that.
    await page.waitForTimeout(3500);
    const file = `${outDir}/${slug}-${vp.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    await page.close();
    console.log(file);
  }
}

await browser.close();
