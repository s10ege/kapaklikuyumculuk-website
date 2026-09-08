import { expect, test } from "@playwright/test";

/* /telefon — the analytics hop for the call button (TECHNICAL.md §9).
 *
 * The twin of /yol-tarifi, and tested along the same lines, with one
 * difference that shapes the whole file: a `tel:` handoff cannot be
 * intercepted the way directions.spec.ts intercepts an outbound https URL.
 * `page.route` only sees HTTP requests, and `tel:` is not one.
 *
 * That turns out not to matter, because headless Chrome has no `tel:` handler
 * either — which is precisely the desktop case this page exists to survive.
 * So the assertions below are the desktop experience, verbatim: the dialer
 * does not open, the page says so, and the number is sitting there to be read,
 * tapped or copied. §6.11.
 */

test.describe("/telefon", () => {
  test("is a real prerendered page, not a redirect", async ({ page }) => {
    /* Three reasons it cannot be a redirect, any one sufficient: hard rule 9
     * keeps the build fully static; a redirect renders nothing, so the
     * analytics beacon this route exists to fire would never fire; and
     * browsers disagree about redirecting to a `tel:` URL. */
    const response = await page.goto("/telefon", { waitUntil: "commit" });
    expect(response?.status()).toBe(200);
  });

  test("puts the number in front of you as a working tel: link", async ({
    page,
  }) => {
    await page.goto("/telefon");

    const link = page
      .locator("#icerik")
      .getByRole("link", { name: /0282 717 21 31/ });

    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", "tel:+902827172131");
  });

  test("the number is selectable text, not only a link target", async ({
    page,
  }) => {
    /* §6.11 — `tel:` is a dead end on desktop, so the digits have to be
     * readable and copyable rather than hidden behind a label. */
    await page.goto("/telefon");
    await expect(page.locator("#icerik")).toContainText("0282 717 21 31");
  });

  test("says so when the dialer does not open", async ({ page }) => {
    /* Headless Chrome has no tel: handler, so this is the desktop path. The
     * page must not sit forever on "Arama başlatılıyor" with nothing
     * happening — that is the failure mode of routing a CTA through an extra
     * page, and the reason the forwarder carries a timeout. */
    await page.goto("/telefon");

    /* Generous, and deliberately so. The component's timer is 2500ms, but it
       starts at hydration, and hydration against a loaded dev server running
       two workers is not bounded by anything this test controls — 6000ms
       passed in isolation and failed once in a full run. The contract being
       asserted is "the message arrives", not "it arrives within one budget". */
    await expect(page.getByText(/Telefon uygulaması açılmadı/)).toBeVisible({
      timeout: 20_000,
    });
  });

  test("carries the opening hours, both seasons", async ({ page }) => {
    /* Someone who lands here out of hours should learn that here, rather than
     * from a phone ringing out. */
    await page.goto("/telefon");

    const main = page.locator("#icerik");
    await expect(main).toContainText("09:00");
    await expect(main).toContainText("19:00");
    await expect(main).toContainText("18:00");
    await expect(main).toContainText("Pazar kapalı");
  });

  test("stays out of the index", async ({ page }) => {
    await page.goto("/telefon", { waitUntil: "commit" });

    const robots = await page
      .locator('meta[name="robots"]')
      .getAttribute("content");
    expect(robots).toContain("noindex");
  });

  test("is absent from the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).not.toContain("/telefon");
  });
});

test.describe("with JavaScript off", () => {
  test.use({ javaScriptEnabled: false });

  test("the hop page is still a phone number you can call", async ({ page }) => {
    /* The forwarder never runs, so the page is only worth the paint it costs
       if the number is in the markup. It is. */
    await page.goto("/telefon");

    await expect(
      page.locator("#icerik").getByRole("link", { name: /0282 717 21 31/ }),
    ).toHaveAttribute("href", "tel:+902827172131");
  });

  test("the call button still reaches it", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Bizi Arayın" }).last(),
    ).toHaveAttribute("href", "/telefon");
  });
});
