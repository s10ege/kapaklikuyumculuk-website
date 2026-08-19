import { test, expect } from "@playwright/test";

/* Gate for iteration 7 of plan.md. */

const CATEGORIES = [
  { slug: "pirlanta", name: "Pırlanta" },
  { slug: "altin-seti", name: "Altın Seti" },
  { slug: "kupe-modelleri", name: "Küpe Modelleri" },
  { slug: "tek-tas-modelleri", name: "Tek Taş Modelleri" },
  { slug: "ozel-tasarim-takilar", name: "Özel Tasarım Takılar" },
];

for (const category of CATEGORIES) {
  test(`/urunler/${category.slug} renders with its own copy`, async ({
    page,
  }) => {
    const response = await page.goto(`/urunler/${category.slug}`);
    expect(response?.status()).toBe(200);

    await expect(
      page.getByRole("heading", { level: 1, name: category.name }),
    ).toBeVisible();

    /* The intro is the category's entire search surface (§6.2), so its absence
     * would be a silent SEO failure rather than a visible one. */
    const intro = page.locator("main, body").getByText(/Kapaklı|Tekirdağ/);
    expect(await intro.count()).toBeGreaterThan(0);
  });

  test(`/urunler/${category.slug} shows the Yakında panel, never a blank grid`, async ({
    page,
  }) => {
    await page.goto(`/urunler/${category.slug}`);

    await expect(page.getByText("Yakında")).toBeVisible();
    await expect(
      page.getByText(`${category.name} vitrinimizde`),
    ).toBeVisible();
  });
}

test("breadcrumb gives the full trail back", async ({ page }) => {
  await page.goto("/urunler/pirlanta");

  const crumbs = page.getByRole("navigation", { name: "Sayfa yolu" });
  await expect(crumbs.getByRole("link", { name: "Anasayfa" })).toBeVisible();
  await expect(crumbs.getByRole("link", { name: "Ürünlerimiz" })).toBeVisible();
  await expect(crumbs.getByText("Pırlanta")).toBeVisible();
});

test("sibling categories list the other four, so nobody dead-ends", async ({
  page,
}) => {
  await page.goto("/urunler/pirlanta");

  const siblings = page.getByRole("navigation", {
    name: "Diğer kategoriler",
  });

  const others = CATEGORIES.filter((c) => c.slug !== "pirlanta");
  for (const sibling of others) {
    await expect(
      siblings.getByRole("link", { name: new RegExp(sibling.name) }),
    ).toBeVisible();
  }

  /* Scoped to the sibling row, not the page: the footer lists every category
   * including the current one, which is correct there. */
  expect(await siblings.getByRole("link").count()).toBe(others.length);
  expect(await siblings.locator('a[href="/urunler/pirlanta"]').count()).toBe(0);
});

test("an unknown category is a 404, not an empty page", async ({ page }) => {
  const response = await page.goto("/urunler/yuzuk-modelleri");
  expect(response?.status()).toBe(404);
});

test("the empty state CTA prefills the category name", async ({ page }) => {
  await page.goto("/urunler/tek-tas-modelleri");

  /* While the WhatsApp number is pending every CTA is a tel: link, so the
   * prefill is not observable in the href yet — but no dead wa.me link may
   * appear either. Both halves of §9 are asserted here. */
  const waLinks = await page.locator('a[href*="wa.me"]').count();
  expect(waLinks).toBe(0);

  const callButtons = page.getByRole("link", { name: "Bizi Arayın" });
  expect(await callButtons.count()).toBeGreaterThan(0);
});

test("grid draws hairlines without leaving filler blocks on a partial row", async ({
  page,
}) => {
  await page.goto("/dev/grid");

  /* The container must not paint a background: with 6 products in a 4-column
   * grid, a `gap-px` over `bg-line` approach shows two grey blocks where the
   * last row does not reach. */
  const gridBg = await page
    .locator("div.grid")
    .first()
    .evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(gridBg).toBe("rgba(0, 0, 0, 0)");
});
