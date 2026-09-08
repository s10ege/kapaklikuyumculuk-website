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

  test("names the founder and the owner under their portraits", async ({
    page,
  }) => {
    await page.goto("/hakkimizda");

    /* Two faces and two names — the proof behind "aynı ailenin elinde". Both
     * come from lib/config.ts, so this also catches a caption that has been
     * typed in by hand and can drift. */
    const portraits = page.locator("figure figcaption");
    await expect(portraits).toHaveCount(2);
    await expect(portraits.nth(0)).toContainText("Nuri Eroğlu");
    await expect(portraits.nth(0)).toContainText("Kurucu");
    await expect(portraits.nth(1)).toContainText("Filiz Eroğlu");
    await expect(portraits.nth(1)).toContainText("Mağaza sahibi");
  });

  for (const width of [1024, 1280, 1440]) {
    test(`the photo and the prose end on the same line at ${width}px`, async ({
      page,
    }) => {
      /* The bug this replaces: the shop photograph was taller than the prose
       * beside it, so the cream band finished on a ragged edge. Padding cannot
       * fix that — it can only be right at one viewport width, which is why
       * this is asserted at three.
       *
       * The fix is structural: items-stretch plus h-full on the figure, so the
       * photograph is exactly as tall as whatever is next to it. That holds
       * when the copy changes, and this test is what says so. */
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/hakkimizda");
      await page.evaluate(() => document.fonts.ready);

      const delta = await page.evaluate(() => {
        const figure = document.querySelector(
          "section.bg-frame figure",
        ) as HTMLElement;
        const grid = figure.parentElement as HTMLElement;
        const prose = grid.children[1] as HTMLElement;
        return (
          figure.getBoundingClientRect().bottom -
          prose.getBoundingClientRect().bottom
        );
      });

      // 1px of tolerance for sub-pixel rounding on fractional layouts.
      expect(Math.abs(delta), `bottom edges differ by ${delta}px`).toBeLessThanOrEqual(1);
    });
  }
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
      main.getByText("Cumhuriyet Mah., Pınar Bulvarı No: 56/C"),
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

  test("embeds a keyless coordinate pin, not a route", async ({ page }) => {
    await page.goto("/iletisim");

    const frame = page.locator("iframe");
    const src = (await frame.getAttribute("src")) ?? "";

    // Still keyless — no Maps API key anywhere on this site.
    expect(src).toContain("output=embed");

    /* The pin, by coordinate. This was keyed on the address string until
     * 2026-09-08, and Google resolved that as a *destination*: the embed drew
     * a route from "Kapaklı" to the shop, which is a trip planner, not a
     * location. Any of these params means the route is back. */
    expect(src).toContain("q=41.326459,27.976502");
    for (const routeParam of ["saddr", "daddr", "/dir/", "origin=", "&dir"]) {
      expect(src, `${routeParam} means this is a route again`).not.toContain(
        routeParam,
      );
    }

    // D-rules: hairline border, no radius, and lazy so it never blocks paint.
    await expect(frame).toHaveAttribute("loading", "lazy");
    await expect(frame).toHaveAttribute(
      "referrerpolicy",
      "no-referrer-when-downgrade",
    );
    await expect(frame).toHaveAttribute(
      "title",
      "Trakya Kapaklı Kuyumculuk konumu",
    );

    const box = frame.locator("xpath=..");
    expect(await box.evaluate((el) => getComputedStyle(el).borderRadius)).toBe(
      "0px",
    );
    expect(await box.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe(
      "1px",
    );
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
        .getByText("Cumhuriyet Mah., Pınar Bulvarı No: 56/C"),
    ).toBeVisible();
  });
});
