import { test, expect, type Page } from "@playwright/test";

/* Horizontal overflow is the layout bug that survives review: it looks fine on
 * a desktop browser and silently clips copy on the phone that 80%+ of visitors
 * arrive on (§7). Cheaper to assert than to spot.
 *
 * 360 is the narrow end of common Android; 390 is iPhone; 1440 is desktop. */
const WIDTHS = [360, 390, 768, 1440] as const;

/* Routes are listed explicitly rather than crawled so a page that fails to
 * render at all shows up as a failure instead of silently not being tested. */
const ROUTES = [
  "/",
  "/urunler",
  "/urunler/pirlanta",
  "/galeri",
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
  "/urunler/ozel-tasarim-takilar",
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
      await page.goto(route, { waitUntil: "networkidle" });

      const result = await horizontalOverflow(page);

      expect(
        result.scrollWidth,
        `overflowing elements: ${result.offenders.join(" | ") || "none"}`,
      ).toBeLessThanOrEqual(result.clientWidth);
    });
  }
}
