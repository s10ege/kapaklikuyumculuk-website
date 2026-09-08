import { test, expect, type Page } from "@playwright/test";

/* "Yol Tarifi Al" — the chooser, the analytics hop, and the no-JS fallback.
 *
 * The behaviour is deliberately different per platform, which makes it exactly
 * the kind of thing that rots silently: it looks right on whatever machine the
 * developer is using and is broken on the other one. Both are driven here.
 */

const GOOGLE_DIR = "https://www.google.com/maps/dir/?api=1";
const APPLE_DIR = "https://maps.apple.com/?daddr=";

/* Stop the suite ever actually navigating to Google or Apple: the forward is
 * asserted from the attempted request instead. Without this the tests need the
 * network and would leave the browser on a third-party page. */
async function catchOutbound(page: Page): Promise<() => string[]> {
  const attempted: string[] = [];

  await page.route(/maps\.(apple|google)\.com|google\.[a-z.]+\/maps/, (route) => {
    attempted.push(route.request().url());
    return route.abort();
  });

  return () => attempted;
}

/* Press the button on /iletisim.
 *
 * The explicit scroll is not decoration. The button sits below the fold on
 * this page, directly under the Google Maps embed — and that embed is a
 * cross-origin iframe, so Chrome hit-tests it in a different process. Clicking
 * straight from Playwright's own scroll lands the event in the iframe, which
 * swallows it: no mousedown and no click ever reach the page's document, and
 * the call still reports success. Scrolling first and letting layout settle
 * puts the pointer where the button actually is. A real visitor scrolls before
 * they click, so this reproduces them rather than working around them. */
async function pressDirections(page: Page) {
  const button = page
    .getByRole("main")
    .getByRole("link", { name: /Yol Tarifi Al/ });

  await button.scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  await button.click();
}

/* ------------------------------------------------------------------ */
/* Everything that is not an Apple platform                            */
/* ------------------------------------------------------------------ */

test.describe("on a non-Apple platform", () => {
  test.use({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      "(KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  });

  test("goes straight to Google, through the counted internal hop", async ({
    page,
  }) => {
    await page.goto("/iletisim");

    const button = page
      .getByRole("main")
      .getByRole("link", { name: /Yol Tarifi Al/ });

    /* The internal hop is what makes the click countable: Vercel Web Analytics
     * is on the free tier, where custom events are Pro-only but page views are
     * free (TECHNICAL.md §9). */
    await expect(button).toHaveAttribute("href", "/yol-tarifi?app=google");
  });

  test("asks nothing — no chooser appears", async ({ page }) => {
    await catchOutbound(page);
    await page.goto("/iletisim");
    await pressDirections(page);

    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page).toHaveURL(/\/yol-tarifi\?app=google/);
  });
});

/* ------------------------------------------------------------------ */
/* Apple platforms                                                     */
/* ------------------------------------------------------------------ */

const APPLE_AGENTS = {
  iPhone:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) " +
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
  /* iPadOS reports a Macintosh user agent, so this string covers the iPad as
   * well as the desktop Mac — both are devices that plausibly have Apple Maps. */
  Macintosh:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 " +
    "(KHTML, like Gecko) Version/18.0 Safari/605.1.15",
};

for (const [name, userAgent] of Object.entries(APPLE_AGENTS)) {
  test.describe(`on ${name}`, () => {
    test.use({ userAgent });

    test("offers both maps apps rather than guessing", async ({ page }) => {
      await page.goto("/iletisim");
      await pressDirections(page);

      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      /* Apple first: on an Apple device it is the app that is definitely
       * installed, and the one the visitor is most likely to want. */
      const rows = sheet.getByRole("link");
      await expect(rows).toHaveCount(2);
      await expect(rows.nth(0)).toHaveText("Apple Haritalar");
      await expect(rows.nth(1)).toHaveText("Google Haritalar");

      // Both go through the counted hop, not straight out.
      await expect(rows.nth(0)).toHaveAttribute("href", "/yol-tarifi?app=apple");
      await expect(rows.nth(1)).toHaveAttribute("href", "/yol-tarifi?app=google");
    });

    test("closes on Escape", async ({ page }) => {
      await page.goto("/iletisim");
      await pressDirections(page);

      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("dialog")).toBeHidden();
    });

    test("closes on a backdrop click", async ({ page }) => {
      await page.goto("/iletisim");
      await pressDirections(page);

      const sheet = page.getByRole("dialog");
      await expect(sheet).toBeVisible();

      // Top-left corner of the viewport is backdrop in both layouts.
      await page.mouse.click(4, 4);
      await expect(sheet).toBeHidden();
    });

    test("choosing Apple Maps hands off in the same tab", async ({ page }) => {
      const attempted = await catchOutbound(page);
      await page.goto("/iletisim");
      await pressDirections(page);

      await page.getByRole("link", { name: "Apple Haritalar" }).click();

      /* Same tab, so the OS can hand off to the native app — a new tab that
       * immediately hands off leaves an empty one behind. */
      expect(page.context().pages()).toHaveLength(1);

      await expect
        .poll(() => attempted().join(" "))
        .toContain(APPLE_DIR);
    });
  });
}

/* ------------------------------------------------------------------ */
/* The hop page itself                                                 */
/* ------------------------------------------------------------------ */

test.describe("/yol-tarifi", () => {
  test("is a real prerendered page, not a redirect", async ({ page }) => {
    /* Hard rule 9 keeps this build fully static, and a 302 would render
     * nothing — so the analytics beacon this route exists to fire would never
     * fire. It has to be a page. */
    const response = await page.goto("/yol-tarifi", { waitUntil: "commit" });
    expect(response?.status()).toBe(200);
  });

  test("forwards to the app named in the query", async ({ page }) => {
    const attempted = await catchOutbound(page);

    await page.goto("/yol-tarifi?app=apple");
    await expect.poll(() => attempted().join(" ")).toContain(APPLE_DIR);
  });

  test("an unknown or missing app falls through to Google", async ({ page }) => {
    const attempted = await catchOutbound(page);

    await page.goto("/yol-tarifi?app=bilinmeyen");
    await expect.poll(() => attempted().join(" ")).toContain(GOOGLE_DIR);
  });

  test("stays out of the index", async ({ page }) => {
    await page.goto("/yol-tarifi", { waitUntil: "commit" });

    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robots).toContain("noindex");
  });

  test("is absent from the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).not.toContain("/yol-tarifi");
  });
});

/* ------------------------------------------------------------------ */
/* Without JavaScript                                                  */
/* ------------------------------------------------------------------ */

test.describe("with JavaScript off", () => {
  test.use({ javaScriptEnabled: false });

  test("the button is an ordinary link to Google's directions", async ({
    page,
  }) => {
    await page.goto("/iletisim");

    /* Before hydration the href is Google's own URL, so the button works as it
     * reads even if the JavaScript never arrives. It loses the analytics hop
     * and the chooser; it does not lose the directions. */
    await expect(
      page.getByRole("main").getByRole("link", { name: /Yol Tarifi Al/ }),
    ).toHaveAttribute("href", new RegExp(GOOGLE_DIR.replace(/[?.]/g, "\\$&")));
  });

  test("the hop page still shows both apps as plain links", async ({ page }) => {
    await page.goto("/yol-tarifi?app=google");

    for (const name of ["Apple Haritalar", "Google Haritalar"]) {
      await expect(page.getByRole("link", { name })).toBeVisible();
    }
  });
});
