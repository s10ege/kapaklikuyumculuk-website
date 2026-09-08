import { expect, test, type Page } from "@playwright/test";

import { stayOnHopPage } from "./hop-pages";

/* §7 — accessibility on a dark ground, in a browser.
 *
 * tests/contrast.test.mts does the arithmetic on the palette; this does the
 * half arithmetic cannot reach: what the browser actually paints when a
 * keyboard user tabs, and whether the things a finger has to hit are big
 * enough on the routes nothing has ever measured.
 */

/* D18 — the ring is gold, and it is verified on BOTH grounds because it is not
 * the same gold. globals.css paints `outline-color: var(--color-gold)`
 * globally and overrides it to gold-deep inside `.bg-frame`, because plain
 * gold measures 2.46:1 on cream — below the 3:1 a focus indicator needs. The
 * unit test asserts that rule exists in the stylesheet; this asserts the
 * browser resolves it. */
const GOLD = "rgb(184, 150, 79)";
const GOLD_DEEP = "rgb(119, 96, 42)";

async function focusRing(page: Page, selector: string) {
  const el = page.locator(selector).first();
  await el.focus();
  return el.evaluate((node) => {
    const s = getComputedStyle(node);
    return {
      color: s.outlineColor,
      style: s.outlineStyle,
      width: s.outlineWidth,
      offset: s.outlineOffset,
    };
  });
}

test.describe("focus rings", () => {
  test("are gold-deep on the cream header", async ({ page }) => {
    await page.goto("/");

    const ring = await focusRing(page, "header a[href='/urunler']");
    expect(ring.color).toBe(GOLD_DEEP);
    expect(ring.style).toBe("solid");
    expect(ring.width).toBe("2px");
    expect(ring.offset).toBe("3px");
  });

  test("are gold on the espresso body", async ({ page }) => {
    await page.goto("/urunler");

    const ring = await focusRing(page, "main a[href^='/urunler/']");
    expect(ring.color).toBe(GOLD);
    expect(ring.style).toBe("solid");
    expect(ring.width).toBe("2px");
  });

  test("the skip link opts out to the darker gold on purpose", async ({
    page,
  }) => {
    /* Its own focus fill IS gold, so a gold ring on it would be invisible
       against itself. app/layout.tsx sets gold-deep inline for that reason. */
    await page.goto("/");
    await page.keyboard.press("Tab");

    const ring = await focusRing(page, "a[href='#icerik']");
    expect(ring.color).toBe(GOLD_DEEP);
  });

  test("tabbing reaches the skip link first, and it works", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");

    const skip = page.locator("a[href='#icerik']");
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#icerik$/);
  });
});

/* ------------------------------------------------------------------ */
/* Tap targets on the routes nothing measured                          */
/* ------------------------------------------------------------------ */

/* chrome.spec.ts checks the header, the footer and the FAB at 390px. It never
 * looked inside a page. These are the three surfaces a thumb actually uses:
 * the lightbox controls, and the two hop pages, which did not exist or were
 * not tested until this stage. */
async function undersized(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const bad: string[] = [];
    for (const el of Array.from(document.querySelectorAll(sel))) {
      const r = el.getBoundingClientRect();
      if (r.width <= 1 || r.height <= 1) continue;
      if (r.height < 44) {
        bad.push(`${el.textContent?.trim().slice(0, 30) || el.nodeName} h=${Math.round(r.height)}`);
      }
    }
    return bad;
  }, selector);
}

test.describe("tap targets at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the lightbox controls are thumb-sized", async ({ page }) => {
    /* A real category page, not /dev/grid where lightbox.spec.ts drives it —
       the controls are the same, but the card that opens them is the one a
       visitor actually taps. */
    await page.goto("/urunler/yuzuk");
    await page.locator("#icerik button").first().click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    const bad = await undersized(page, "dialog button, dialog a");
    expect(bad, bad.join(" | ")).toEqual([]);
  });

  test("/telefon is usable with a thumb", async ({ page }) => {
    await page.goto("/telefon");
    const bad = await undersized(page, "#icerik a");
    expect(bad, bad.join(" | ")).toEqual([]);
  });

  test("/yol-tarifi is usable with a thumb", async ({ page }) => {
    /* This page forwards to Google Maps on load, so it has to be held still
       before anything can be measured on it. Aborting the request is not
       enough — the navigation destroys the execution context either way. */
    await stayOnHopPage(page);
    await page.goto("/yol-tarifi");
    const bad = await undersized(page, "#icerik a");
    expect(bad, bad.join(" | ")).toEqual([]);
  });
});

/* ------------------------------------------------------------------ */
/* §6.8 — the user's own text size                                     */
/* ------------------------------------------------------------------ */

test("nothing blocks pinch-zoom", async ({ page }) => {
  /* The Next docs show `maximumScale: 1, userScalable: false` in the same
     example as the viewport fields this site does set, and either one would
     break zoom. Older customers are a real share of this shop's audience, and
     a viewport meta that forbids zoom is the single most common way a site
     locks them out. */
  await page.goto("/");

  const content = await page
    .locator('meta[name="viewport"]')
    .getAttribute("content");

  expect(content).not.toContain("user-scalable=no");
  expect(content).not.toMatch(/maximum-scale=1\b/);
  expect(content).toContain("viewport-fit=cover");
});

test("the page survives 200% text scaling without overflowing", async ({
  page,
}) => {
  /* Not the same as zoom: this is the browser's font-size setting, which
     scales rem-based type and leaves fixed px alone. Anything laid out in
     fixed px stops fitting around the text — §6.8. */
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    document.documentElement.style.fontSize = "32px"; // 200% of 16px
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(
    overflow.scrollWidth,
    "the homepage scrolls sideways at 200% text size",
  ).toBeLessThanOrEqual(overflow.clientWidth + 1);
});
