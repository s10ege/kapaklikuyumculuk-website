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

  // Edge and Opera paint hover overlays (PiP, enhance, pop-out) on plain
  // videos; these three are what keep the coin clean there. Chrome can't
  // show those overlays, so the test pins the controls, not the symptom.
  await expect(video).toHaveJSProperty("disablePictureInPicture", true);
  await expect(video).toHaveJSProperty("disableRemotePlayback", true);
  await expect(video).toHaveCSS("pointer-events", "none");
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

test("saveData keeps the coin on its still frame too", async ({ browser }) => {
  /* The third branch of HeroCoin's `reduced` check, and the only one nothing
   * tested until 2026-09-08. Playwright's emulateMedia covers reduced-motion
   * and can be given `prefers-reduced-data`, but it cannot fake
   * `navigator.connection.saveData` — which is the flag that actually fires
   * for a visitor on a Turkish mobile data plan with Data Saver on, i.e. the
   * exact person design.md's reduced-data rule was written for.
   *
   * So it is stubbed before any script runs. Asserting the observable
   * outcome — the video never plays — rather than the branch being taken. */
  const context = await browser.newContext();
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });

  const page = await context.newPage();
  await page.goto("/");

  const video = page.locator("video");
  await expect(video).toBeVisible();

  await page.waitForTimeout(1200);
  await expect(video).toHaveJSProperty("paused", true);
  await expect(video).toHaveJSProperty("currentTime", 0);

  /* preload="none" plus never calling play() is what keeps the 434 KB off a
     metered connection entirely. If this ever regresses, the visitor pays for
     a video they will not see move. */
  await expect(video).toHaveAttribute("preload", "none");

  await context.close();
});

/* NOT TESTED HERE, and the reason is worth writing down rather than
 * rediscovering: `prefers-reduced-data`.
 *
 * HeroCoin checks three things — prefers-reduced-motion, prefers-reduced-data,
 * and navigator.connection.saveData. Only two of them can be exercised in this
 * harness. Chrome parses `(prefers-reduced-data)` as a valid media feature
 * (`matchMedia(...).media` is not "not all"), but the query never matches:
 * `page.emulateMedia({ reducedData: "reduce" })` runs without error and leaves
 * `matches` false, because Chrome never shipped a user-facing setting behind
 * it. A test asserting that branch would fail for a reason that has nothing to
 * do with this site.
 *
 * That is not a gap in coverage so much as a gap in the feature: on Chrome,
 * the flag that actually fires for a visitor with Data Saver on is
 * `saveData`, which is why HeroCoin reads it and why the test above is the one
 * that means something. The media query is there for engines that do implement
 * it. Confirming it on a real Android with Data Saver enabled belongs to 4.2.
 */

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
