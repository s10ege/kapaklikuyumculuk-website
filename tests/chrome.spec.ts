import { test, expect } from "@playwright/test";

/* Gate for iteration 6 of plan.md: the chrome works at every breakpoint, tap
 * targets clear §7's 44px floor, and the pending mechanism keeps the primary
 * CTA alive. */

const CATEGORY_NAMES = [
  "Altın Setleri",
  "Küpe Modelleri",
  "Yüzük",
  "Özel Tasarım Takılar",
];

test.describe("desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("shows the page links inline and hides the hamburger", async ({
    page,
  }) => {
    await page.goto("/");

    const nav = page.getByRole("navigation", { name: "Ana menü" });
    await expect(nav.getByRole("link", { name: "Ürünlerimiz" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "İletişim" })).toBeVisible();

    await expect(page.getByRole("button", { name: /Menüyü/ })).toBeHidden();
  });
});

test.describe("mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens the panel and lists categories before pages", async ({
    page,
  }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Menüyü aç" });
    await expect(toggle).toBeVisible();
    await toggle.click();

    const panel = page.locator("#mobil-menu");
    await expect(panel).toBeVisible();

    /* §5 makes this ordering a requirement, not a preference: someone arriving
     * from Instagram wants pieces, not an About page. Comparing document
     * position proves the categories really do come first. */
    const labels = await panel.getByRole("link").allInnerTexts();
    const trimmed = labels.map((l) => l.trim());

    expect(trimmed.slice(0, CATEGORY_NAMES.length)).toEqual(CATEGORY_NAMES);
    expect(trimmed).toContain("Hakkımızda");
    expect(trimmed.indexOf("Hakkımızda")).toBeGreaterThan(
      trimmed.indexOf("Özel Tasarım Takılar"),
    );
  });

  test("closes on Escape", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menüyü aç" }).click();
    await expect(page.locator("#mobil-menu")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("#mobil-menu")).toBeHidden();
  });

  test("locks background scroll while the panel is open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menüyü aç" }).click();

    const overflow = await page.evaluate(() => document.body.style.overflow);
    expect(overflow).toBe("hidden");
  });
});

test.describe("the call button", () => {
  test("the floating button dials the shop from any page", async ({ page }) => {
    await page.goto("/");

    /* §7 requires the shop to be one tap away from anywhere, and the phone is
     * the only channel — WhatsApp was removed 2026-09-08.
     *
     * The href is /telefon, not tel:, since 2026-09-08: Vercel Analytics on
     * the free tier cannot count a click on an outbound link, so the two
     * clicks worth counting are routed through internal pages that fire the
     * real link on load (§9). One tap still, one page view now. */
    const fab = page.getByRole("link", { name: "Bizi Arayın" }).last();
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute("href", "/telefon");
  });

  test("the hop lands on a page that dials", async ({ page }) => {
    /* The tap has to end at the dialer, not at a page about dialling. This is
     * the assertion that would catch /telefon quietly becoming a dead end —
     * the failure mode of routing a CTA through an extra page. */
    await page.goto("/");
    await page.getByRole("link", { name: "Bizi Arayın" }).last().click();

    await expect(page).toHaveURL(/\/telefon$/);
    /* Scoped to <main>: the footer prints the number on every page, and it is
       a correct tel: link too — but the one that matters here is the one the
       hop page puts in front of someone whose dialer did not open. */
    await expect(
      page.locator("#icerik").getByRole("link", { name: /0282 717 21 31/ }),
    ).toHaveAttribute("href", "tel:+902827172131");
  });

  test("no wa.me link appears anywhere on the page", async ({ page }) => {
    await page.goto("/");

    const waLinks = await page.locator('a[href*="wa.me"]').count();
    expect(waLinks).toBe(0);
  });
});

test.describe("tap targets", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("every link and button in the chrome clears 44px", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menüyü aç" }).click();

    const undersized = await page.evaluate(() => {
      const bad: string[] = [];

      for (const el of Array.from(
        document.querySelectorAll("header a, header button, footer a, body > a"),
      )) {
        const r = el.getBoundingClientRect();
        /* Skip visually hidden elements. The skip link is a 1x1px clipped box
         * until it takes focus, which is correct sr-only behaviour — it is
         * sized properly in the state where it can actually be tapped. */
        if (r.width <= 1 || r.height <= 1) continue;
        if (r.height < 44) {
          bad.push(`${el.textContent?.trim().slice(0, 30)} h=${Math.round(r.height)}`);
        }
      }

      return bad;
    });

    expect(undersized, undersized.join(" | ")).toEqual([]);
  });
});
