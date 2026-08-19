import { test, expect } from "@playwright/test";

/* Gate for iteration 6 of plan.md: the chrome works at every breakpoint, tap
 * targets clear §7's 44px floor, and the pending mechanism keeps the primary
 * CTA alive. */

const CATEGORY_NAMES = [
  "Pırlanta",
  "Altın Seti",
  "Küpe Modelleri",
  "Tek Taş Modelleri",
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

test.describe("the pending WhatsApp mechanism", () => {
  test("the floating button dials instead of linking to a dead wa.me", async ({
    page,
  }) => {
    await page.goto("/");

    // contact.whatsapp.pending is true, so §9 requires the tel: fallback.
    const fab = page.getByRole("link", { name: "Bizi Arayın" }).last();
    await expect(fab).toBeVisible();
    await expect(fab).toHaveAttribute("href", "tel:+902827172131");
  });

  test("no dead wa.me link appears anywhere on the page", async ({ page }) => {
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
