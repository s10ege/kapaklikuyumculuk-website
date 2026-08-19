/* Capture screenshots of routes for visual review.
 *
 *   node scripts/shots.mjs <outDir> [route ...]
 *
 * Defaults to "/" if no route is given. Uses the system Chrome, so it needs no
 * browser download, and expects `npm run dev` to already be serving :3000.
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
      deviceScaleFactor: 2,
    });
    await page.goto(`http://localhost:3000${route}`, {
      waitUntil: "networkidle",
    });
    const file = `${outDir}/${slug}-${vp.name}.png`;
    await page.screenshot({ path: file, fullPage: true });
    await page.close();
    console.log(file);
  }
}

await browser.close();
