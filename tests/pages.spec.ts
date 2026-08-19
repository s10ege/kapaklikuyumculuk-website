import { test, expect } from "@playwright/test";

/* Gates for iterations 10–12 of plan.md — the remaining pages. */

const CATEGORY_NAMES = [
  "Pırlanta",
  "Altın Seti",
  "Küpe Modelleri",
  "Tek Taş Modelleri",
  "Özel Tasarım Takılar",
];

/* ------------------------------------------------------------------ */
/* Iteration 10 — Ürünlerimiz + Galeri                                 */
/* ------------------------------------------------------------------ */

test.describe("/urunler", () => {
  test("reclaims the indexed path with a real page", async ({ page }) => {
    /* §4: an already-indexed address, live rather than redirected. If this
     * ever 301s again the index history it carries is thrown away. */
    const response = await page.goto("/urunler");
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole("heading", { level: 1, name: "Ürünlerimiz" }),
    ).toBeVisible();
  });

  test("lists all five categories and drops the Tüm Ürünler tile", async ({
    page,
  }) => {
    await page.goto("/urunler");
    const main = page.getByRole("main");

    for (const name of CATEGORY_NAMES) {
      await expect(
        main.getByRole("link", { name: new RegExp(name) }),
      ).toBeVisible();
    }

    // This page is "all products", so the tile pointing here would be circular.
    await expect(page.getByRole("link", { name: /Tüm Ürünler/ })).toHaveCount(0);
  });
});

test.describe("/galeri", () => {
  test("reclaims the indexed path with a real page", async ({ page }) => {
    /* One of the six URLs confirmed still in Google's index, currently serving
     * a 404 under the old title. */
    const response = await page.goto("/galeri");
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("falls back to the Yakında panel while empty", async ({ page }) => {
    await page.goto("/galeri");

    /* Exact: "Yakında" is a substring of "yakından", which appears in this
     * page's own intro copy ("daha yakından görmek için"). */
    await expect(page.getByText("Yakında", { exact: true })).toBeVisible();
    await expect(page.getByText(/Galerimiz vitrinimizde/)).toBeVisible();
  });

  test("offers a route onward, so an old search result does not dead-end", async ({
    page,
  }) => {
    await page.goto("/galeri");

    const categories = page.getByRole("navigation", { name: "Kategoriler" });
    for (const name of CATEGORY_NAMES) {
      await expect(
        categories.getByRole("link", { name: new RegExp(name) }).first(),
      ).toBeVisible();
    }
  });
});
