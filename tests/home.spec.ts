import { test, expect } from "@playwright/test";

import { getFeaturedProducts } from "../lib/content.ts";

/* Gate for iteration 9 of plan.md. */

test("hero carries the shop name and both CTAs", async ({ page }) => {
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
});

test("category tiles show all four, with no filler tile", async ({ page }) => {
  await page.goto("/");

  for (const name of [
    "Altın Setleri",
    "Küpe Modelleri",
    "Yüzük",
    "Özel Tasarım Takılar",
  ]) {
    await expect(
      page.getByRole("main").getByRole("link", { name: new RegExp(name) }).first(),
    ).toBeVisible();
  }

  /* The pale-gold "Tüm Ürünler" tile retired with the fifth category
   * (2026-09-08): four tiles divide evenly into both 4 and 2, so there is no
   * hole for a filler cell to plug. The route onward is a text link now. */
  await expect(page.getByRole("link", { name: /Tüm Ürünler/ })).toHaveCount(0);
  await expect(
    page.getByRole("main").getByRole("link", { name: /Tüm ürünleri gör/ }),
  ).toBeVisible();
});

test("exactly four category tiles, in the published order", async ({ page }) => {
  await page.goto("/");

  /* Order is the URL strategy's order, not a preference — and a fifth tile
   * reappearing would mean a retired category came back as a live page. */
  const tiles = page.getByRole("main").locator('ul li a[href^="/urunler/"]');
  await expect(tiles).toHaveCount(4);

  expect(await tiles.evaluateAll((els) =>
    els.map((el) => el.getAttribute("href")),
  )).toEqual([
    "/urunler/altin-seti",
    "/urunler/kupe-modelleri",
    "/urunler/yuzuk",
    "/urunler/ozel-tasarim-takilar",
  ]);
});

test("the Seçtiklerimiz shelf mirrors the featured flags — absent or filled, never empty", async ({
  page,
}) => {
  /* §6.1: with nothing flagged featured the section hides itself entirely
   * rather than rendering an empty shelf — absence from the DOM, not just
   * invisibility. With featured products it shows exactly one card each
   * (getFeaturedProducts caps at four). The expected state comes from the
   * same reader the build uses. */
  const featured = getFeaturedProducts();

  await page.goto("/");

  await expect(page.getByText("Öne Çıkanlar")).toHaveCount(0);

  const shelf = page.getByText("Seçtiklerimiz");
  const cards = page.locator('button[aria-haspopup="dialog"]');

  if (featured.length === 0) {
    await expect(shelf).toHaveCount(0);
    await expect(cards).toHaveCount(0);
  } else {
    await expect(shelf).toBeVisible();
    await expect(cards).toHaveCount(featured.length);
  }
});

test("exactly two service panels, because five would read as filler", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Altın Alım–Satım" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Sipariş Üzerine Üretim" }),
  ).toBeVisible();

  const detailLinks = page.getByRole("link", { name: /Ayrıntılar/ });
  expect(await detailLinks.count()).toBe(2);
});

test("Hakkımızda makes a claim the docs actually support", async ({ page }) => {
  await page.goto("/");

  // Recovered from the old site's Kurumsal page — verifiable, unlike anything
  // we could invent. And the retired "iki şube" claim must never come back.
  await expect(page.getByText(/ilk kuyumcusu/).first()).toBeVisible();
  await expect(page.getByText(/iki şube/)).toHaveCount(0);
});

test("contact block shows the canonical address, hours and directions", async ({
  page,
}) => {
  await page.goto("/");

  const main = page.getByRole("main");
  await expect(
    main.getByText("Cumhuriyet Mah., Pınar Bulvarı No: 56/C"),
  ).toBeVisible();
  await expect(main.getByText("59510 Kapaklı / Tekirdağ")).toBeVisible();
  /* Both seasons, always — the page is static, so publishing only the
   * "current" one would freeze an August build's answer into a December
   * visit. */
  await expect(main.getByText("09:00 – 19:00").first()).toBeVisible();
  await expect(main.getByText("09:00 – 18:00").first()).toBeVisible();
  await expect(main.getByText(/Yaz \(Mayıs–Eylül\)/).first()).toBeVisible();
  await expect(main.getByText(/Kış \(Ekim–Nisan\)/).first()).toBeVisible();
  /* "Haritada açın" until 2026-09-08. The row's own label said "Yol tarifi"
   * and the link said something else, which is a stutter one way round and a
   * mismatch the other; the row is "Konum" now and the button is the same
   * "Yol Tarifi Al" that appears in the footer, on /iletisim and on the 404. */
  await expect(
    main.getByRole("link", { name: /Yol Tarifi Al/ }),
  ).toBeVisible();
});

test("the former partner's phone numbers appear nowhere", async ({ page }) => {
  await page.goto("/");

  const html = await page.content();
  // docs/business-facts.md — these belong to a different business entirely.
  expect(html).not.toContain("717 85 88");
  expect(html).not.toContain("7178588");
  expect(html).not.toContain("717 39 87");
  expect(html).not.toContain("7173987");
});
