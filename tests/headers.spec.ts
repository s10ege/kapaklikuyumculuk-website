import { expect, test } from "@playwright/test";

/* Security headers.
 *
 * There were none at all until 2026-09-08 — no CSP, no HSTS, no
 * X-Content-Type-Options, nothing. These are the mechanical ones; the
 * Content-Security-Policy is a separate pass because it has to account for the
 * inline JSON-LD, the Maps iframe, the analytics script and _next/image, and
 * because getting it wrong blanks the map on a page that otherwise looks
 * perfect.
 *
 * Asserted against a response rather than against next.config.ts, because the
 * config being right and the header arriving are different claims — and the
 * second is the one that matters.
 */

const EXPECTED: [key: string, value: string | RegExp][] = [
  ["strict-transport-security", /max-age=63072000/],
  ["x-content-type-options", "nosniff"],
  ["x-frame-options", "SAMEORIGIN"],
  ["referrer-policy", "strict-origin-when-cross-origin"],
  ["permissions-policy", /geolocation=\(\)/],
];

for (const [key, expected] of EXPECTED) {
  test(`${key} is set on a page response`, async ({ request }) => {
    const response = await request.get("/");
    const value = response.headers()[key];

    expect(value, `${key} is absent`).toBeTruthy();
    if (typeof expected === "string") expect(value).toBe(expected);
    else expect(value).toMatch(expected);
  });
}

test("redirect responses carry no custom headers — recorded, not desired", async ({
  request,
}) => {
  /* This test asserts a limitation, which is unusual, so: why.
   *
   * `headers()` in next.config.ts does not apply to redirect responses. The
   * redirect short-circuits before the header layer, so a 308 arrives with
   * none of the five. That matters more here than on most sites — 26 of this
   * domain's URLs ARE redirects, and they are what an old inbound link hits
   * first, so the very first response a returning visitor gets carries no
   * HSTS.
   *
   * The practical cost is one response: the destination is the same origin and
   * does carry HSTS, so the browser learns it a hop later. Not worth working
   * around, and there is no clean way to in next.config.ts anyway.
   *
   * Pinned so the behaviour is known rather than assumed, and so this test
   * FAILS if it ever changes — at which point the comment is wrong and the
   * assertion above it should become the ordinary one. Measured against
   * `next dev`; Vercel's routing layer may well apply headers to redirects
   * itself, which is a question for FINAL.md 4.2 against the live domain and
   * not something to guess at from here. */
  const response = await request.get("/urunler/pirlanta", {
    maxRedirects: 0,
  });

  expect(response.status()).toBe(308);
  expect(
    response.headers()["x-content-type-options"],
    "redirects now carry headers — update the comment above and this assertion",
  ).toBeUndefined();
});

test("nothing here blocks the analytics referrer §9 depends on", async ({
  request,
}) => {
  /* `no-referrer` would be the tidier-looking policy and would throw away the
     one analytics dimension that is genuinely useful for this shop —
     Instagram versus Google. strict-origin-when-cross-origin keeps it. */
  const policy = (await request.get("/")).headers()["referrer-policy"];
  expect(policy).not.toContain("no-referrer");
});

/* ------------------------------------------------------------------ */
/* Content-Security-Policy                                             */
/* ------------------------------------------------------------------ */

test.describe("the page CSP", () => {
  test("is enforcing, not report-only", async ({ request }) => {
    const headers = (await request.get("/")).headers();

    expect(headers["content-security-policy"], "no CSP on a page").toBeTruthy();
    expect(
      headers["content-security-policy-report-only"],
      "the report-only header is still set — it was a step, not the destination",
    ).toBeUndefined();
  });

  test("names both Google Maps origins, because one redirects to the other", async ({
    request,
  }) => {
    /* The embed URL in lib/config.ts is maps.google.com, which 301s to
       www.google.com/maps/embed. CSP re-checks frame-src against the redirect
       target, so a policy listing only the URL we write would blank the map on
       /iletisim while every other page looked perfect. This is the assertion
       that would catch somebody "tidying" the duplicate away. */
    const csp = (await request.get("/")).headers()["content-security-policy"];

    expect(csp).toContain("https://maps.google.com");
    expect(csp).toContain("https://www.google.com");
  });

  test("closes the directives a static site can actually close", async ({
    request,
  }) => {
    /* No nonce is possible — the local Next docs are explicit that nonces need
       dynamic rendering, and hard rule 9 keeps every route static. So
       script-src carries 'unsafe-inline' and this CSP does NOT stop an
       injected inline script. These are the directives that do real work here,
       and the test exists so a future edit cannot quietly drop them and leave
       a CSP that is all compromise and no protection. */
    const csp = (await request.get("/")).headers()["content-security-policy"];

    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("base-uri 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).toContain("upgrade-insecure-requests");
  });

  test("agrees with X-Frame-Options rather than contradicting it", async ({
    request,
  }) => {
    /* Two headers making different claims about who may frame this site is how
       one of them gets "corrected" later, in whichever direction the person
       happens to read first. */
    const headers = (await request.get("/")).headers();

    expect(headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(headers["content-security-policy"]).toContain(
      "frame-ancestors 'self'",
    );
  });

  test("carries no third-party script origin in a production build", async ({
    request,
  }) => {
    /* The dev server allows 'unsafe-eval' and va.vercel-scripts.com, both
       genuinely needed there and neither wanted in production. This suite runs
       against `next dev`, so it can only assert the shape of the exception —
       that it is conditional at all — rather than the production value.
       Asserting the production string from here would be a test that passes by
       describing an environment it is not running in. */
    const csp = (await request.get("/")).headers()["content-security-policy"];
    const dev = process.env.NODE_ENV !== "production";

    if (dev) {
      expect(csp).toContain("'unsafe-eval'");
      expect(csp).toContain("https://va.vercel-scripts.com");
    } else {
      expect(csp).not.toContain("'unsafe-eval'");
      expect(csp).not.toContain("vercel-scripts.com");
    }
  });

  test("the map iframe survives the policy", async ({ page }) => {
    /* The whole reason this landed report-only first. A CSP that blanks the
       map looks exactly like a working site on every other page. */
    const violations: string[] = [];
    await page.exposeFunction("__csp", (v: string) => violations.push(v));
    await page.addInitScript(() => {
      document.addEventListener("securitypolicyviolation", (e) =>
        (window as unknown as { __csp?: (v: string) => void }).__csp?.(
          `${e.effectiveDirective} <- ${e.blockedURI}`,
        ),
      );
    });

    await page.goto("/iletisim");

    const frame = page.locator("iframe").first();
    await expect(frame).toBeVisible();

    /* A cross-origin frame cannot be inspected, so the proof is that a child
       frame exists on a Google origin and nothing was blocked getting there. */
    await expect
      .poll(() => page.frames().length, { timeout: 15_000 })
      .toBeGreaterThan(1);

    expect(violations, violations.join(" | ")).toEqual([]);
  });
});

test("the image CSP is untouched and still separate", async ({ request }) => {
  /* next.config.ts carries a SECOND, unrelated CSP —
     `images.contentSecurityPolicy` — which sandboxes SVGs served through
     next/image. It is not a page CSP and must not be confused with the one
     arriving in the next pass. This asserts it still applies where it should. */
  const response = await request.get(
    "/_next/image?url=%2Fplaceholder%2Fkategori-yuzuk.svg&w=640&q=75",
  );

  if (response.status() === 200) {
    expect(response.headers()["content-security-policy"]).toContain(
      "script-src 'none'",
    );
  }
});
