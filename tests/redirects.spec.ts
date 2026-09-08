import { readFile } from "node:fs/promises";

import { test, expect } from "@playwright/test";

/* Gate for iteration 13 of plan.md — the highest-risk artefact in the project.
 *
 * A wrong redirect looks exactly like a working site, which is why every row of
 * the map is asserted rather than eyeballed. Sources come from
 * docs/old-urls.txt (309 URLs recovered from Archive.org) and the six paths
 * docs/old-site-map.md confirms are still in Google's index today.
 */

/* ------------------------------------------------------------------ */
/* Reclaimed — these must be live pages, never redirects               */
/* ------------------------------------------------------------------ */

/* §4's central insight: a live page at an already-indexed address is worth far
 * more than a 301. If any of these ever answers 301 again, the index history it
 * carries has been thrown away. Two of them are confirmed still indexed. */
const RECLAIMED = [
  "/urunler",
  "/urunler/ozel-tasarim-takilar",
  "/galeri",
  "/hakkimizda",
  "/iletisim",
];

for (const path of RECLAIMED) {
  test(`${path} is a live page, not a redirect`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(
      response.status(),
      `${path} must return 200 — it is an indexed URL being reclaimed`,
    ).toBe(200);
  });
}

/* ------------------------------------------------------------------ */
/* 301s — old path to its successor                                    */
/* ------------------------------------------------------------------ */

const REDIRECTS: [from: string, to: string][] = [
  // §4's table. /urun/tek-tas-modelleri points straight at /urunler/yuzuk —
  // NOT at /urunler/tek-tas-modelleri, which is itself a redirect now. A
  // redirect to a redirect is the shape that hides a broken chain.
  ["/urun/altin-seti", "/urunler/altin-seti"],
  ["/urun/kupe-modelleri", "/urunler/kupe-modelleri"],
  ["/urun/tek-tas-modelleri", "/urunler/yuzuk"],

  // Indexed product paths §4's table missed, found in docs/old-urls.txt
  ["/urun/ozel-tasarim-takilar", "/urunler/ozel-tasarim-takilar"],
  ["/urun/pirlanta-yuzukler", "/urunler/yuzuk"],
  ["/urun/yuzuk-modelleri", "/urunler"],
  ["/urunler/altin", "/urunler/altin-seti"],

  /* Category pages retired 2026-09-08. These two were live, indexed pages —
   * the most valuable sources in this file, because a visitor arriving on
   * either came from a real search result. They go to the page that now holds
   * their rings. */
  ["/urunler/pirlanta", "/urunler/yuzuk"],
  ["/urunler/tek-tas-modelleri", "/urunler/yuzuk"],

  // Unknown product paths fall back to the catalogue rather than 404
  ["/urun/bilinmeyen-bir-model", "/urunler"],

  // Generation-1 pages
  ["/urunlerimiz", "/urunler"],
  ["/urunlerimiz/cici-gold", "/urunler"],
  ["/kurumsal", "/hakkimizda"],
  ["/misyonvizyon", "/hakkimizda"],
  ["/markalar-2", "/hakkimizda"],
  /* Both forms. The bare path is its own rule in next.config.ts and had no
     test until 2026-09-08 — the wildcard sibling below was covering for it,
     which is not the same thing: a rule can be deleted while its neighbour
     keeps the suite green. Found by diffing every `source:` in the config
     against the paths asserted here; it was the only gap in all 25. */
  ["/calistigimiz-firmalar", "/hakkimizda"],
  ["/calistigimiz-firmalar/altin-firmalari", "/hakkimizda"],
  ["/fotograf-galerisi", "/galeri"],
  ["/fotograf-galerisi/kapakli-kuyumculuk-merkez", "/galeri"],
  ["/gallery_plus/haskale", "/galeri"],

  // No successor
  ["/altin-fiyatlari", "/"],
  ["/doviz-kurlari", "/"],
  ["/referanslar", "/"],
  ["/slide-types/referanslar", "/"],
  ["/anasayfa2", "/"],
];

/* 308, not 301. The docs say "301" throughout, but `permanent: true` emits 308
 * in both Next and Vercel — so 308 is also what the live holding page has been
 * serving since the cleanup shipped. Google treats 301 and 308 identically for
 * indexing, and matching what is already live avoids changing a signal Google
 * has begun acting on. Do not "fix" this to 301. */
for (const [from, to] of REDIRECTS) {
  test(`${from} → ${to}`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 });

    expect(response.status(), `${from} should be a permanent redirect`).toBe(
      308,
    );
    expect(response.headers()["location"]).toBe(to);
  });
}

/* ------------------------------------------------------------------ */
/* The host rule — the preview host must never be indexed              */
/* ------------------------------------------------------------------ */

/* Rule 1 in next.config.ts, and the only one that matches on a header rather
 * than a path: any request arriving with a `*.vercel.app` Host is sent to the
 * canonical domain. It exists so a preview deployment cannot be indexed as a
 * duplicate of the whole site — which is the same entity-confusion problem
 * this project exists to fix, self-inflicted.
 *
 * It had no assertion until 2026-09-08. The coverage check below deliberately
 * excludes it (it has no path to exercise), so nothing anywhere would have
 * gone red if the rule were deleted. Found by the 3.4 verification. */
test("a *.vercel.app host is sent to the canonical domain", async ({
  request,
}) => {
  const response = await request.get("/urunler/yuzuk", {
    headers: { Host: "kapaklikuyumculuk.vercel.app" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(308);
  expect(response.headers()["location"]).toBe(
    "https://www.kapaklikuyumculuk.com/urunler/yuzuk",
  );
});

test("a branch preview host is caught by the same rule", async ({ request }) => {
  /* The pattern is `.*\.vercel\.app`, so branch previews match too — which is
     the acknowledged trade recorded in next.config.ts: preview deployments are
     sent to production rather than being browsable. */
  const response = await request.get("/", {
    headers: { Host: "kapaklikuyumculuk-git-stage3.vercel.app" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(308);
  expect(response.headers()["location"]).toContain(
    "https://www.kapaklikuyumculuk.com",
  );
});

test("the real host is not caught by it, and does not loop", async ({
  request,
}) => {
  /* The control. A host rule that matched its own destination would redirect
     the live site to itself forever, and it would look exactly like the site
     being down. */
  const response = await request.get("/urunler/yuzuk", {
    headers: { Host: "www.kapaklikuyumculuk.com" },
    maxRedirects: 0,
  });

  expect(response.status()).toBe(200);
});

/* ------------------------------------------------------------------ */
/* Every rule in the config is actually exercised                      */
/* ------------------------------------------------------------------ */

/* The gap this closes is the one that hid /calistigimiz-firmalar: a rule can
 * be added to next.config.ts and simply never tested, and nothing goes red.
 * The suite looks comprehensive either way — 58 passing tests is 58 passing
 * tests whether or not they cover the rule somebody added last week.
 *
 * Reads the config as text rather than importing it: next.config.ts is a TS
 * module with a NextConfig type and this file runs in Playwright, so parsing
 * the source is both simpler and closer to what a reviewer would check by eye.
 */
test("every redirect rule in next.config.ts has a test above", async () => {
  const config = await readFile("next.config.ts", "utf8");

  /* Only the redirects() block. next.config.ts also has a headers() rule with
     a `source`, which is not a redirect and must not be counted as one. */
  const block = config.slice(config.indexOf("async redirects()"));
  const sources = [...block.matchAll(/source:\s*"([^"]+)"/g)].map((m) => m[1]!);

  /* RETIRED.pirlanta and RETIRED.tekTas are referenced by identifier, so they
     do not appear as string literals in the block. Named here so the count is
     honest rather than quietly short by two. */
  const byIdentifier = ["/urunler/pirlanta", "/urunler/tek-tas-modelleri"];

  /* The host-level rule matches on a `has` host condition, not on a path, so
     it cannot be covered by a path assertion. It is not unasserted, though —
     the three tests directly above cover it. Excluding it here without those
     would leave the rule with no test at all, which is exactly what the 3.4
     verification found. */
  const paths = [...sources.filter((s) => s !== "/:path*"), ...byIdentifier];

  const covered = (rule: string) =>
    REDIRECTS.some(([from]) =>
      rule.endsWith("/:path*")
        ? from.startsWith(`${rule.slice(0, -"/:path*".length)}/`)
        : from === rule,
    );

  const untested = paths.filter((rule) => !covered(rule));
  expect(untested, `redirect rules with no test: ${untested.join(", ")}`).toEqual(
    [],
  );

  /* And the count itself, so a rule vanishing is as loud as one arriving. */
  expect(paths.length, "expected 25 path-level redirect rules").toBe(25);
});

/* ------------------------------------------------------------------ */
/* No chains: one hop, then a 200                                      */
/* ------------------------------------------------------------------ */

/* The assertions above pin each source to its Location header, which proves
 * the first hop is right and says nothing about where that hop lands. A
 * redirect pointing at another redirect satisfies every one of them while
 * costing an extra round trip on every old link — and it is invisible, because
 * the visitor still arrives somewhere sensible.
 *
 * This is the gate that catches it: follow one redirect, and what is on the
 * other side must be a live page. It became necessary on 2026-09-08, when
 * /urunler/pirlanta and /urunler/tek-tas-modelleri turned from destinations
 * into sources and every rule that named them had to be repointed. */
for (const [from] of REDIRECTS) {
  test(`${from} reaches a 200 in exactly one hop`, async ({ request }) => {
    const first = await request.get(from, { maxRedirects: 0 });
    expect(first.status(), `${from} should redirect`).toBe(308);

    const location = first.headers()["location"];
    expect(location, `${from} has no Location header`).toBeTruthy();

    const second = await request.get(location as string, { maxRedirects: 0 });
    expect(
      second.status(),
      `${from} → ${location} → ${second.status()}: that is a chain, not a hop. ` +
        `Repoint ${from} at the final destination.`,
    ).toBe(200);
  });
}

/* ------------------------------------------------------------------ */
/* Deliberate 404s (§4 rule 3)                                         */
/* ------------------------------------------------------------------ */

/* WordPress internals have no successor. They must 404 so Google drops them,
 * rather than 301 to a page that has nothing to do with them. */
const MUST_404 = [
  "/wp-admin",
  "/wp-login.php",
  "/wp-content/uploads/2015/12/IMG_0312-1024x953.jpg",
  "/author/kapaklikuyumculuk",
];

for (const path of MUST_404) {
  test(`${path} stays a 404 on purpose`, async ({ request }) => {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), `${path} must not be redirected`).toBe(404);
  });
}

test("the branded Turkish 404 is what an old WordPress URL lands on", async ({
  page,
}) => {
  await page.goto("/wp-content/uploads/2015/12/IMG_0312-1024x953.jpg");

  // Not Vercel's English error screen.
  await expect(page.getByText(/Web sitemiz yenilendi/)).toBeVisible();
});
