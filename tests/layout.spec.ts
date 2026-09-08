import { test, expect, type Page } from "@playwright/test";

/* Horizontal overflow is the layout bug that survives review: it looks fine on
 * a desktop browser and silently clips copy on the phone that 80%+ of visitors
 * arrive on (§7). Cheaper to assert than to spot.
 *
 * 320 is §6.7's floor and the width this suite was missing until 2026-09-08 —
 * "no horizontal scroll at 320px" was written into TECHNICAL.md as a done-when
 * and never had a test, so the narrowest thing ever checked was 360. It is not
 * a hypothetical size: it is an iPhone SE 1st gen, and it is also what any
 * phone becomes when the visitor sets a larger system font and the browser
 * scales down, which §6.8 says older customers do.
 *
 * 360 is the narrow end of common Android; 390 is iPhone; 1440 is desktop. */
const WIDTHS = [320, 360, 390, 768, 1440] as const;

/* Routes are listed explicitly rather than crawled so a page that fails to
 * render at all shows up as a failure instead of silently not being tested. */
const ROUTES = [
  "/",
  "/urunler",
  "/urunler/yuzuk",
  "/galeri",
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
  "/urunler/ozel-tasarim-takilar",
  "/yol-tarifi",
  "/telefon",
  "/dev/tokens",
  "/dev/placeholders",
  "/dev/grid",
] as const;

async function horizontalOverflow(page: Page) {
  return page.evaluate(() => {
    const doc = document.documentElement;
    const offenders: string[] = [];
    const limit = doc.clientWidth;

    for (const el of Array.from(document.body.querySelectorAll("*"))) {
      const rect = el.getBoundingClientRect();
      // 1px of tolerance absorbs sub-pixel rounding on fractional layouts.
      if (rect.right > limit + 1 && rect.width > 0) {
        const tag = el.tagName.toLowerCase();
        const cls =
          typeof el.className === "string" ? el.className.slice(0, 80) : "";
        offenders.push(`${tag}.${cls} right=${Math.round(rect.right)}`);
      }
    }

    return {
      scrollWidth: doc.scrollWidth,
      clientWidth: limit,
      offenders: offenders.slice(0, 6),
    };
  });
}

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route} does not scroll horizontally at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });

      /* Not networkidle. /iletisim embeds a Google Maps iframe that keeps
       * chattering, so networkidle never fires and the test spent 15–26s
       * waiting out the timeout before passing on luck. Layout depends on
       * fonts, not on map tiles — so wait for exactly that. */
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.evaluate(() => document.fonts.ready);

      const result = await horizontalOverflow(page);

      expect(
        result.scrollWidth,
        `overflowing elements: ${result.offenders.join(" | ") || "none"}`,
      ).toBeLessThanOrEqual(result.clientWidth);
    });
  }
}
