import { test, expect } from "@playwright/test";

/* Gate for iteration 1.3 of design.md — the coin wired into the real hero.
 *
 * Every fallback path resolves to the same thing: the <video> never plays and
 * shows its `poster` still. That means "no JS" and "reduced motion" are the
 * same assertion — the video stays paused — which is the point of the design.
 */

test("hero headline and CTAs render and work with JavaScript disabled", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: /Trakya Kapaklı/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: /Ürünlerimiz/ }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("main").getByRole("link", { name: "İletişim" }).first(),
  ).toBeVisible();

  // D2/D5 — the coin still renders (as its poster still), decorative and
  // inert, without a single line of JS running.
  const video = page.locator("video");
  await expect(video).toHaveAttribute("aria-hidden", "true");
  await expect(video).toHaveAttribute("poster", /coin-still-420\.webp/);
  await expect(video).toHaveJSProperty("paused", true);

  await context.close();
});

test("the coin is decorative, not interactive", async ({ page }) => {
  await page.goto("/");
  const video = page.locator("video");

  await expect(video).toHaveAttribute("aria-hidden", "true");
  // Checked as DOM properties, not markup attributes — React does not always
  // reflect boolean media attributes like `muted` into the rendered HTML,
  // even though it reliably sets the property the browser actually reads.
  await expect(video).toHaveJSProperty("muted", true);
  await expect(video).toHaveJSProperty("loop", true);
});

test("prefers-reduced-motion keeps the coin on its still frame", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const video = page.locator("video");
  await expect(video).toBeVisible();

  // Long enough to clear the 500ms on-load delay other visitors get.
  await page.waitForTimeout(1200);
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);
});

test("without a motion preference, the coin starts turning after the on-load still", async ({
  page,
}) => {
  await page.goto("/");
  const video = page.locator("video");
  await expect(video).toBeVisible();

  // D3 — still for ~0.5s, then it turns. Still at 200ms...
  await page.waitForTimeout(200);
  await expect(video).toHaveJSProperty("paused", true);

  // ...playing well after the 500ms mark, with margin for the video to
  // actually start loading — it is `preload="none"` until this point.
  await expect(video).toHaveJSProperty("paused", false, { timeout: 5000 });
});
