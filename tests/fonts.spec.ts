import { test, expect } from "@playwright/test";

/* The `latin-ext` subset is the site's classic silent failure: without it the
 * Turkish glyphs ı İ ğ Ğ ş Ş ç Ç ö Ö ü Ü fall back to another face mid-word,
 * which reads as a font choice rather than a bug. Screenshots are a poor guard
 * — the difference is a few pixels of stroke weight — so it is asserted here.
 */

const TURKISH = "ıİğĞşŞçÇöÖüÜâÂîÎûÛ";
const DISPLAY = "Ibarra Real Nova";
const BODY = "Jost";

test("both faces actually load", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const loaded = await page.evaluate(() =>
    Array.from(document.fonts).map((f) => f.family),
  );

  expect(loaded.join(",")).toContain(DISPLAY);
  expect(loaded.join(",")).toContain(BODY);
});

for (const family of [DISPLAY, BODY]) {
  test(`${family} covers every Turkish glyph`, async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    /* document.fonts.check returns false if any character in the string would
     * need a fallback, which is precisely the condition we care about. */
    const covered = await page.evaluate(
      ([fam, text]) => document.fonts.check(`16px "${fam}"`, text),
      [family, TURKISH] as const,
    );

    expect(covered, `${family} would fall back for: ${TURKISH}`).toBe(true);
  });
}

test("headings resolve to the display face, not the body face", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  /* Guards the trap found in iteration 2: a size-only utility leaves the
   * element in the body font, which looks wrong rather than broken. */
  const family = await page
    .getByRole("heading", { level: 1 })
    .evaluate((el) => getComputedStyle(el).fontFamily);

  expect(family).toContain(DISPLAY);
});

test("body copy resolves to the body face", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);

  const family = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );

  expect(family).toContain(BODY);
});

test("no stylesheet is fetched from a third-party font host", async ({
  page,
}) => {
  /* §3 wants the faces self-hosted so no request reaches Google from a Turkish
   * visitor's browser. next/font does that at build time — this proves it, and
   * would catch a stray <link> to fonts.googleapis.com being reintroduced. */
  const external: string[] = [];
  page.on("request", (req) => {
    const url = req.url();
    if (url.includes("fonts.googleapis.com") || url.includes("fonts.gstatic.com")) {
      external.push(url);
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });

  expect(external, external.join(" | ")).toEqual([]);
});
