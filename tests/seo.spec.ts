import { test, expect, type Page } from "@playwright/test";

import { getProducts } from "../lib/content.ts";

/* Gate for iteration 14 of plan.md.
 *
 * §10 notes that a Google Business Profile is worth more traffic than this
 * entire website for a shop like this, and must carry the same name, address
 * and phone character-for-character. The structured data below is what those
 * values have to match, so the facts are asserted, not just the shape.
 */

async function jsonLd(page: Page, type: string) {
  const blocks = await page.locator('script[type="application/ld+json"]').all();

  for (const block of blocks) {
    const raw = await block.textContent();
    if (!raw) continue;
    const parsed = JSON.parse(raw);
    if (parsed["@type"] === type) return parsed;
  }

  return null;
}

test.describe("JewelryStore", () => {
  test("carries the canonical NAP, character for character", async ({
    page,
  }) => {
    await page.goto("/");
    const shop = await jsonLd(page, "JewelryStore");
    expect(shop).not.toBeNull();

    expect(shop.name).toBe("Trakya Kapaklı Kuyumculuk");
    expect(shop.telephone).toBe("+902827172131");
    expect(shop.address.streetAddress).toBe(
      "Cumhuriyet Mah., Pınar Bulvarı No: 56/C",
    );
    expect(shop.address.postalCode).toBe("59510");
    expect(shop.address.addressLocality).toBe("Kapaklı");
    expect(shop.address.addressRegion).toBe("Tekirdağ");
  });

  test("carries the pin from the shop's own listing, and links to it", async ({
    page,
  }) => {
    await page.goto("/");
    const shop = await jsonLd(page, "JewelryStore");

    /* Absent until 2026-09-08, when the coordinates stopped being ❌ — they
     * come from the shop's Google Maps listing now, so the pin, the street
     * number and the place ID describe one door. */
    expect(shop.geo["@type"]).toBe("GeoCoordinates");
    expect(shop.geo.latitude).toBe(41.326459);
    expect(shop.geo.longitude).toBe(27.976502);

    // hasMap names the place; a search URL would ask Google to guess again.
    expect(shop.hasMap).toContain("place_id:ChIJSQxn1KkptRQRLtfCCLZCYLk");
  });

  test("links only accounts that are genuinely ours", async ({ page }) => {
    await page.goto("/");
    const shop = await jsonLd(page, "JewelryStore");

    expect(shop.sameAs).toContain(
      "https://www.instagram.com/kuyumculukkapakli/",
    );
    /* @kapaklikuyumculuk matches our domain but is a jeweller in Şanlıurfa.
     * At least one directory already makes this mistake; confirming it in our
     * own structured data would be actively harmful. */
    expect(JSON.stringify(shop.sameAs)).not.toContain(
      "instagram.com/kapaklikuyumculuk",
    );
  });

  test("publishes the six open days and never Sunday", async ({ page }) => {
    await page.goto("/");
    const shop = await jsonLd(page, "JewelryStore");

    for (const spec of shop.openingHoursSpecification) {
      expect(spec.opens).toBe("09:00");
      expect(spec.dayOfWeek).toHaveLength(6);
      /* A dayOfWeek list that omits a day means closed. An explicit Sunday
       * entry with equal opens/closes is the other convention, and mixing the
       * two is how a shop gets listed as open 00:00–00:00. */
      expect(spec.dayOfWeek).not.toContain("Sunday");
    }
  });

  test("publishes both seasons, with the winter span split at New Year", async ({
    page,
  }) => {
    await page.goto("/");
    const shop = await jsonLd(page, "JewelryStore");
    const specs = shop.openingHoursSpecification;

    /* Three, not two. validFrom/validThrough are dates rather than a
     * recurrence rule, so October→April cannot be one range without asserting
     * a span that runs backwards — it ships as the two calendar halves it
     * actually occupies. */
    expect(specs).toHaveLength(3);

    const spans = specs.map(
      (s: { opens: string; closes: string; validFrom: string; validThrough: string }) =>
        `${s.validFrom.slice(5)}→${s.validThrough.slice(5)} ${s.closes}`,
    );

    expect(spans).toEqual([
      "05-01→09-30 19:00",
      "01-01→04-30 18:00",
      "10-01→12-31 18:00",
    ]);

    // Every entry is stamped with the same year, and it is a real one.
    const years = new Set(
      specs.map((s: { validFrom: string }) => s.validFrom.slice(0, 4)),
    );
    expect(years.size).toBe(1);
    expect(Number([...years][0])).toBeGreaterThanOrEqual(2026);
  });
});

test.describe("category pages", () => {
  test("emit a BreadcrumbList matching the visible trail", async ({ page }) => {
    await page.goto("/urunler/yuzuk");
    const crumbs = await jsonLd(page, "BreadcrumbList");

    expect(crumbs).not.toBeNull();
    expect(crumbs.itemListElement).toHaveLength(3);
    expect(crumbs.itemListElement[2].name).toBe("Yüzük");
    expect(crumbs.itemListElement[2].item).toBe(
      "https://www.kapaklikuyumculuk.com/urunler/yuzuk",
    );
  });

  test("emit an ItemList exactly when the category has products", async ({
    page,
  }) => {
    /* An ItemList claiming to list products that do not exist is a
     * structured-data mismatch, not a rich result — and a populated grid
     * missing its ItemList wastes the category's whole search surface. The
     * expected state comes from the same reader the build uses. */
    const products = getProducts("yuzuk");

    await page.goto("/urunler/yuzuk");
    const list = await jsonLd(page, "ItemList");

    if (products.length === 0) {
      expect(list).toBeNull();
    } else {
      expect(list).not.toBeNull();
      expect(list.numberOfItems).toBe(products.length);
      expect(list.itemListElement).toHaveLength(products.length);
    }
  });

  test("carry their own canonical", async ({ page }) => {
    await page.goto("/urunler/yuzuk");

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");

    expect(canonical).toBe("https://www.kapaklikuyumculuk.com/urunler/yuzuk");
  });

  test("keep the title template the old site was indexed under", async ({
    page,
  }) => {
    await page.goto("/urunler/yuzuk");
    await expect(page).toHaveTitle(/0282 717 21 31/);
  });
});

test.describe("sitemap and robots", () => {
  test("sitemap lists every live page and no old paths", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();

    for (const path of [
      "/",
      "/urunler",
      "/galeri",
      "/hizmetler",
      "/hakkimizda",
      "/iletisim",
      "/urunler/altin-seti",
      "/urunler/kupe-modelleri",
      "/urunler/yuzuk",
      "/urunler/ozel-tasarim-takilar",
    ]) {
      expect(xml).toContain(`https://www.kapaklikuyumculuk.com${path}`);
    }

    // A sitemap is a claim about what exists now; redirects belong elsewhere.
    expect(xml).not.toContain("/urun/");
    expect(xml).not.toContain("/kurumsal");
    expect(xml).not.toContain("/dev/");
    // Retired 2026-09-08. Listing a URL that 301s asks Google to crawl a
    // redirect it was about to drop, which is the opposite of the cleanup.
    expect(xml).not.toContain("/urunler/pirlanta");
    expect(xml).not.toContain("/urunler/tek-tas-modelleri");
  });

  test("robots does not block the old paths", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();

    /* §4 rule 4 — the subtlest trap in the whole cleanup. A blocked URL is
     * never crawled, so Google never sees the 301 or 404 underneath and never
     * drops it. Blocking these would stall the cleanup while appearing to
     * help. */
    expect(txt).not.toContain("Disallow: /urun");
    expect(txt).not.toContain("Disallow: /wp-content");
    expect(txt).not.toContain("Disallow: /author");

    // §10 — reserved for the phase-two Sanity Studio.
    expect(txt).toContain("Disallow: /studio");
    expect(txt).toContain("Sitemap: https://www.kapaklikuyumculuk.com/sitemap.xml");
  });
});
