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

    /* And nothing else is blocked either. `/studio` was disallowed here from
     * the first commit, reserved for a Sanity Studio phase two would mount;
     * the CMS decision was overturned, sanity/ was deleted, and the rule
     * outlived it. Asserting the absence rather than deleting the assertion,
     * because a Disallow for a route that does not exist is a public statement
     * that something at /studio is worth hiding. */
    expect(txt).not.toContain("Disallow: /studio");
    expect(txt).not.toMatch(/Disallow:\s*\S/);

    expect(txt).toContain("Sitemap: https://www.kapaklikuyumculuk.com/sitemap.xml");
  });
});

/* ------------------------------------------------------------------ */
/* BreadcrumbList on every indexed page                                */
/* ------------------------------------------------------------------ */

/* §5 says "BreadcrumbList on every page". Until 2026-09-08 only the category
 * pages emitted one, while these five rendered the visible strip and no
 * schema — the visitor got the trail and the crawler did not.
 *
 * Both halves now come out of one `trail` prop in <Breadcrumb>, so the real
 * assertion is that they cannot disagree: every crumb name must appear in the
 * rendered nav, and the last crumb must be the page's own canonical URL.
 * A BreadcrumbList that does not match the visible trail is a mismatch to
 * Google, and it fails silently — the rich result just stops appearing. */
const TRAILS: [path: string, last: string][] = [
  ["/urunler", "Ürünlerimiz"],
  ["/galeri", "Galeri"],
  ["/hizmetler", "Hizmetler"],
  ["/hakkimizda", "Hakkımızda"],
  ["/iletisim", "İletişim"],
];

for (const [path, last] of TRAILS) {
  test(`${path} emits a BreadcrumbList matching its visible trail`, async ({
    page,
  }) => {
    await page.goto(path);

    const crumbs = await jsonLd(page, "BreadcrumbList");
    expect(crumbs, `${path} emits no BreadcrumbList`).not.toBeNull();
    expect(crumbs.itemListElement).toHaveLength(2);

    expect(crumbs.itemListElement[0].name).toBe("Anasayfa");
    expect(crumbs.itemListElement[0].item).toBe(
      "https://www.kapaklikuyumculuk.com/",
    );

    expect(crumbs.itemListElement[1].name).toBe(last);
    expect(crumbs.itemListElement[1].item).toBe(
      `https://www.kapaklikuyumculuk.com${path}`,
    );

    /* The visible half, from the same trail. */
    const nav = page.locator('nav[aria-label="Sayfa yolu"]');
    await expect(nav).toContainText("Anasayfa");
    await expect(nav).toContainText(last);
    await expect(nav.locator('[aria-current="page"]')).toHaveText(last);
  });
}

/* ------------------------------------------------------------------ */
/* Open Graph — every shared link previews as something                */
/* ------------------------------------------------------------------ */

/* There was no og:image anywhere until 2026-09-08, so every share of every
 * page previewed blank — and sharing a link is how this shop's customers pass
 * it on, whatever they share it in.
 *
 * The assertion is deliberately "every indexed route", not "the six that have
 * cards": app/opengraph-image.png is a root-segment file, so pages without
 * their own card inherit it. If that inheritance ever breaks, this catches the
 * pages nobody remembered to wire up rather than only the ones we did. */
const INDEXED = [
  "/",
  "/urunler",
  "/urunler/altin-seti",
  "/urunler/kupe-modelleri",
  "/urunler/yuzuk",
  "/urunler/ozel-tasarim-takilar",
  "/galeri",
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
];

for (const path of INDEXED) {
  test(`${path} previews with a real Open Graph image`, async ({
    page,
    request,
  }) => {
    await page.goto(path);

    const url = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");

    expect(url, `${path} emits no og:image`).toBeTruthy();

    /* Absolute, whatever the origin. A relative og:image is ignored by every
       platform that reads it — they fetch the URL out of context, with no page
       to resolve against. `metadataBase` in app/layout.tsx is what guarantees
       this; the assertion is that it is still doing its job.

       Not asserted against the production host, because the file-convention
       card resolves to the *request* origin under `next dev` and to
       metadataBase in a production build. Asserting the built form here would
       be a test that only passes in an environment this suite does not yet run
       in — which is PR-10's job to fix, not this test's to pretend. */
    expect(url).toMatch(/^https?:\/\/[^/]+\//);

    /* An og:image pointing at a 404 is worse than none: the platform caches
       the miss and the link previews blank for as long as it holds it. */
    const asset = new URL(url!).pathname + new URL(url!).search;
    const response = await request.get(asset);
    expect(response.status(), `${asset} does not resolve`).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/png");

    /* Dimensions matter to the platforms — 1200x630 is what gets rendered as
       a large card rather than a thumbnail beside the text. */
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute(
      "content",
      "1200",
    );
    await expect(
      page.locator('meta[property="og:image:height"]'),
    ).toHaveAttribute("content", "630");
  });
}

/* Meta descriptions, measured where they actually ship.
 *
 * tests/copy.test.mts asserts the 120–155 window, but only over the CATEGORIES
 * in lib/content.ts — the five static pages write theirs inline in page.tsx and
 * were never measured by anything. The stage-3 audit found /hakkimizda sitting
 * at 116, four characters under its own floor, having been that way since it
 * was written.
 *
 * Asserted here rather than in the unit gate because several of these compose
 * from lib/config.ts at render time; the rendered tag is the only place the
 * real length exists. The window is Google's practical truncation range: under
 * 120 wastes the space, over 155 gets cut mid-sentence. */
for (const path of INDEXED) {
  test(`${path} has a meta description in the 120–155 window`, async ({
    page,
  }) => {
    await page.goto(path);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");

    expect(description, `${path} has no meta description`).toBeTruthy();
    expect(
      description!.length,
      `${path} description is ${description!.length} chars: ${description}`,
    ).toBeGreaterThanOrEqual(120);
    expect(
      description!.length,
      `${path} description is ${description!.length} chars: ${description}`,
    ).toBeLessThanOrEqual(155);

    /* §3 — a description in capitals is the shouting the copy gate bans in
       every other string the visitor reads. */
    expect(description).not.toMatch(/[A-ZĞÜŞİÖÇ]{6,}/);
  });
}

/* Nothing asserted og:url before 2026-09-08, which is exactly why five pages
 * shipped announcing themselves as the homepage: openGraph is inherited
 * wholesale from the layout, the layout set `url: shop.url`, and only the
 * category pages overrode it. Each page's canonical was right the whole time,
 * so the two disagreed and nothing noticed. */
for (const path of INDEXED) {
  test(`${path} names itself in og:url, not the homepage`, async ({ page }) => {
    await page.goto(path);

    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      `https://www.kapaklikuyumculuk.com${path === "/" ? "" : path}`,
    );

    /* Site-level fields survive on every page — the category pages lost these
       for as long as they hand-built their own openGraph block. */
    await expect(
      page.locator('meta[property="og:site_name"]'),
    ).toHaveAttribute("content", "Trakya Kapaklı Kuyumculuk");
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "tr_TR",
    );
  });
}

/* A noindex page must not also name a canonical. Pairing them asks Google to
 * drop the page and consolidate its signals onto the canonical target — which,
 * while /yol-tarifi inherited the layout's `canonical: "/"`, was the homepage.
 * The homepage owns that canonical now; this route should have none. */
test("/yol-tarifi is noindex and names no canonical", async ({ page }) => {
  await page.goto("/yol-tarifi");

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

/* The JewelryStore image and the homepage og:image must be the same URL.
 * They are declared in two modules — lib/schema.ts cannot import
 * lib/metadata.ts, which pulls in next's Metadata types while schema.ts is
 * walked by node:test with type-stripping only — so nothing but this stops
 * them drifting. A search result and a shared link showing different pictures
 * of the same shop is exactly the inconsistency this project is about. */
test("the JewelryStore image is the card the homepage shares", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const shopSchema = await jsonLd(page, "JewelryStore");
  expect(shopSchema.image, "JewelryStore emits no image").toBeTruthy();

  const og = await page
    .locator('meta[property="og:image"]')
    .first()
    .getAttribute("content");

  expect(new URL(shopSchema.image).pathname).toBe(new URL(og!).pathname);

  const response = await request.get(new URL(shopSchema.image).pathname);
  expect(response.status(), "the schema image does not resolve").toBe(200);
});

test("each category overrides the site-wide card with its own", async ({
  page,
}) => {
  /* The four categories are the pages worth sharing individually, and a share
     of /urunler/yuzuk that previews the generic coin card wastes the one
     chance to show a ring. */
  const seen = new Set<string>();

  for (const slug of [
    "altin-seti",
    "kupe-modelleri",
    "yuzuk",
    "ozel-tasarim-takilar",
  ]) {
    await page.goto(`/urunler/${slug}`);
    const url = await page
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute("content");

    expect(url).toContain(`/og/${slug}.png`);
    seen.add(url!);
  }

  expect(seen.size, "two categories share a card").toBe(4);
});

/* ------------------------------------------------------------------ */
/* Retired terms never reach a visitor                                 */
/* ------------------------------------------------------------------ */

/* The source-level version of this is a grep with a list of exclusions —
 * next.config.ts holds the redirect map, two specs assert it, and the comments
 * explaining the retirement necessarily name what was retired. Exclusions
 * weaken a gate, so this is the assertion that does not need any: whatever the
 * source says, none of these words may be in what a visitor actually reads.
 *
 *   pirlanta   — the category was retired 2026-09-08 because the pieces are
 *                white gold, not diamond. Claiming otherwise is the one thing
 *                on this site that would be a lie.
 *   tek taş    — the slug it replaced, in every spelling.
 *   ziraat     — the landmark, removed the same day.
 *   whatsapp   — removed the same day too. The shop takes calls, and a page
 *                offering a channel nobody watches is worse than one that does
 *                not offer it: the customer messages and hears nothing back.
 */
const RETIRED_TERMS =
  /pırlanta|pirlanta|tek\s?ta[şs]|tekta[şs]|ziraat|whatsapp|wa\.me/i;

const VISITOR_ROUTES = [
  "/",
  "/urunler",
  "/urunler/altin-seti",
  "/urunler/kupe-modelleri",
  "/urunler/yuzuk",
  "/urunler/ozel-tasarim-takilar",
  "/galeri",
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
  "/yol-tarifi",
  "/telefon",
];

for (const route of VISITOR_ROUTES) {
  test(`${route} carries no retired term, anywhere in its markup`, async ({
    page,
  }) => {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    /* The whole document, not just visible text: this has to cover the title,
     * the meta description, the JSON-LD and every alt attribute — the places
     * a stale claim survives a copy edit precisely because nobody looks. */
    const html = await page.content();
    const hit = RETIRED_TERMS.exec(html);

    expect(
      hit,
      hit ? `"${hit[0]}" at …${html.slice(Math.max(0, hit.index - 90), hit.index + 90)}…` : "",
    ).toBeNull();
  });
}

test("the 404 carries no retired term either", async ({ page }) => {
  await page.goto("/wp-admin");
  expect(RETIRED_TERMS.exec(await page.content())).toBeNull();
});

test("the sitemap and robots carry no retired term", async ({ request }) => {
  for (const path of ["/sitemap.xml", "/robots.txt"]) {
    const body = await (await request.get(path)).text();
    expect(RETIRED_TERMS.exec(body), `${path}`).toBeNull();
  }
});
