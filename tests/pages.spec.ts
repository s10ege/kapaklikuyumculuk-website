import { test, expect } from "@playwright/test";

import { getProducts } from "../lib/content.ts";

/* Gates for iterations 10–12 of plan.md — the remaining pages. */

const CATEGORY_NAMES = [
  "Altın Setleri",
  "Küpe Modelleri",
  "Yüzük",
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

  test("lists all four categories and carries no filler tile", async ({
    page,
  }) => {
    await page.goto("/urunler");
    const main = page.getByRole("main");

    for (const name of CATEGORY_NAMES) {
      await expect(
        main.getByRole("link", { name: new RegExp(name) }).first(),
      ).toBeVisible();
    }

    const tiles = main.locator('ul li a[href^="/urunler/"]');
    await expect(tiles).toHaveCount(4);

    // This page is "all products", so the tile pointing here would be circular
    // — and the ask-cell that used to complete a six-cell grid retired with the
    // fifth category, because four leaves no hole to plug.
    await expect(page.getByRole("link", { name: /Tüm Ürünler/ })).toHaveCount(0);
    await expect(
      main.getByRole("link", { name: /Aradığınız burada yoksa/ }),
    ).toHaveCount(0);
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

  test("shows one card per product, or the Yakında panel while empty", async ({
    page,
  }) => {
    /* State-agnostic: /galeri aggregates every category, so the expected
     * state is the unfiltered reader — the same one the build uses. Empty →
     * the Yakında panel with Galeri's own headline (the "{subject}
     * vitrinimizde" template produced "Galerimiz vitrinimizde", which is
     * nonsense — 1.5 review). Populated → one card per product, no panel. */
    const products = getProducts();

    await page.goto("/galeri");

    const yakinda = page.getByText("Yakında", { exact: true });
    const cards = page.locator('button[aria-haspopup="dialog"]');

    if (products.length === 0) {
      await expect(yakinda).toBeVisible();
      await expect(page.getByText(/Galeri hazırlanıyor/)).toBeVisible();
      await expect(cards).toHaveCount(0);
    } else {
      await expect(cards).toHaveCount(products.length);
      await expect(yakinda).toHaveCount(0);
    }
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

/* ------------------------------------------------------------------ */
/* Iteration 11 — Hizmetler + Hakkımızda                               */
/* ------------------------------------------------------------------ */

test.describe("/hizmetler", () => {
  test("covers both services with four points each", async ({ page }) => {
    await page.goto("/hizmetler");

    for (const name of ["Altın Alım–Satım", "Sipariş Üzerine Üretim"]) {
      await expect(page.getByRole("heading", { name })).toBeVisible();
    }

    for (const slug of ["altin-alim-satim", "siparis-uzerine-uretim"]) {
      const points = page.locator(`#${slug} li`);
      expect(await points.count()).toBe(4);
    }
  });

  test("answers the two things a customer actually worries about", async ({
    page,
  }) => {
    await page.goto("/hizmetler");

    /* §6.5 names these explicitly: the rate and the weighing. Both promises
     * are load-bearing trust claims, so they are asserted rather than left to
     * survive a future copy edit by luck. */
    await expect(page.getByText(/gözünüzün önünde/).first()).toBeVisible();
    await expect(page.getByText(/işlemden önce söylenir/)).toBeVisible();
  });
});

test.describe("/hakkimizda", () => {
  test("reclaims the indexed path and makes the returns argument", async ({
    page,
  }) => {
    const response = await page.goto("/hakkimizda");
    expect(response?.status()).toBe(200);

    // §6.6 — a jeweller sells things that come back.
    await expect(page.getByText(/geri gelir/)).toBeVisible();
  });

  test("never revives the retired two-branch claim", async ({ page }) => {
    await page.goto("/hakkimizda");

    /* The old site said "iki şube ile". The partnership ended and the second
     * address belongs to a different business now; repeating it would feed the
     * exact name-to-two-addresses confusion this project exists to undo. */
    const html = await page.content();
    expect(html).not.toContain("iki şube");
  });

  test("shows a two-cell fact grid", async ({ page }) => {
    await page.goto("/hakkimizda");

    const facts = page.locator("dl dt");
    expect(await facts.count()).toBe(2);
  });
});

/* ------------------------------------------------------------------ */
/* Iteration 12 — İletişim + 404                                       */
/* ------------------------------------------------------------------ */

test.describe("/iletisim", () => {
  test("offers no form and no mailto, because no email exists", async ({
    page,
  }) => {
    await page.goto("/iletisim");

    /* docs/business-facts.md: the domain has no MX records, verified by DNS
     * lookup. A contact form here would silently swallow every message a
     * customer sent — the most damaging possible bug on this page. */
    expect(await page.locator("form").count()).toBe(0);
    expect(await page.locator('input[type="email"]').count()).toBe(0);
    expect(await page.locator('a[href^="mailto:"]').count()).toBe(0);
  });

  test("lists address, both phones, hours and Instagram", async ({ page }) => {
    await page.goto("/iletisim");
    const main = page.getByRole("main");

    await expect(
      main.getByText("Cumhuriyet Mah., Pınar Bulvarı No: 56/A"),
    ).toBeVisible();
    await expect(main.getByText("0282 717 21 31").first()).toBeVisible();
    await expect(main.getByText("0282 717 55 62")).toBeVisible();
    /* Both seasons, always — the page is static, so publishing only the
     * "current" one would freeze an August build's answer into a December
     * visit. */
    await expect(main.getByText("09:00 – 19:00").first()).toBeVisible();
    await expect(main.getByText("09:00 – 18:00").first()).toBeVisible();
    await expect(main.getByText(/Yaz \(Mayıs–Eylül\)/).first()).toBeVisible();
    await expect(main.getByText(/Kış \(Ekim–Nisan\)/).first()).toBeVisible();
    await expect(main.getByText("@kuyumculukkapakli")).toBeVisible();
  });

  test("marks today's season, and only after hydration", async ({ page }) => {
    await page.goto("/iletisim");

    /* The server cannot know the visitor's date, so nothing date-dependent may
     * render on the first pass — that would be a hydration mismatch. The label
     * arrives with the effect. */
    // Scoped to main: the footer renders the same component, correctly.
    const now = page.getByRole("main").getByText("Şu an geçerli");
    await expect(now).toHaveCount(1);

    /* And it lands on the season that actually covers today, in Istanbul. */
    const month = Number(
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Europe/Istanbul",
        month: "numeric",
      }).format(new Date()),
    );
    const expected = [5, 6, 7, 8, 9].includes(month) ? "summer" : "winter";

    const rows = page.getByRole("main").locator("dd [data-season]");
    await expect(rows).toHaveCount(2);

    // Exactly one row is current, and it is the right one.
    await expect(page.getByRole("main").locator('[data-current="true"]'))
      .toHaveAttribute("data-season", expected);

    // ...and it is listed first, once hydration has reordered them.
    expect(
      await rows.evaluateAll((els) =>
        els.map((el) => el.getAttribute("data-season")),
      ),
    ).toEqual([expected, expected === "summer" ? "winter" : "summer"]);
  });

  test("embeds a keyless map keyed on the address, not coordinates", async ({
    page,
  }) => {
    await page.goto("/iletisim");

    const src = await page.locator("iframe").getAttribute("src");
    expect(src).toContain("output=embed");
    // Coordinates are graded ❌ (~150 m disagreement), so none may be emitted.
    expect(src).not.toMatch(/@?4[01]\.\d{3,}/);
  });
});

test.describe("404", () => {
  test("returns 404 and reads like a shop, not an error screen", async ({
    page,
  }) => {
    const response = await page.goto("/wp-admin");
    expect(response?.status()).toBe(404);

    await expect(page.getByText(/Web sitemiz yenilendi/)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Ürünlerimiz/ }).first(),
    ).toBeVisible();
    await expect(page.getByText("0282 717 21 31").first()).toBeVisible();
  });

  test("carries the address, for a visitor who only wanted the location", async ({
    page,
  }) => {
    await page.goto("/gerçekten-olmayan-bir-sayfa");

    /* Scoped to main: the footer carries the same address, which is the point
     * — both render from the one value in lib/config.ts. */
    await expect(
      page
        .getByRole("main")
        .getByText("Cumhuriyet Mah., Pınar Bulvarı No: 56/A"),
    ).toBeVisible();
  });
});
