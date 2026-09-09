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

test("redirect responses: bare locally, carrying headers on Vercel", async ({
  request,
}) => {
  /* `headers()` in next.config.ts does not apply to redirect responses — the
   * redirect short-circuits before the header layer, so a 308 from a local
   * server arrives with none of the five. That mattered more here than on most
   * sites: 26 of this domain's URLs ARE redirects, and they are what an old
   * inbound link hits first, so the first response a returning visitor got
   * would carry no HSTS.
   *
   * THE ANSWER, measured against the live domain on 2026-09-09 (FINAL.md 4.2,
   * which this test was written to hand the question to): **Vercel's routing
   * layer applies them itself.** A 308 in production carries all five plus the
   * CSP. So the limitation is local-only and costs a returning visitor
   * nothing.
   *
   * Both halves are asserted rather than the inconvenient one being dropped:
   * against a live host the headers must be PRESENT, and locally they must
   * still be ABSENT — so if Next ever starts applying them, the local branch
   * goes red and this comment gets revisited instead of quietly rotting. */
  /* /kurumsal, deliberately. The first version of this test used one of the
     retired category paths as its 308 source — which works, and which put this
     file outside the scripts/retired-terms.mjs allowlist and broke
     `npm run gate:terms` for three commits. Any redirect source proves the
     same point, so the fix is a different source rather than a wider
     allowlist; that script's own guidance is "never silently widen the
     pattern". Note it greps raw source, comments included, so naming the path
     even in this comment would trip it again. */
  const response = await request.get("/kurumsal", { maxRedirects: 0 });

  expect(response.status()).toBe(308);

  if (process.env.E2E_BASE_URL) {
    expect(
      response.headers()["x-content-type-options"],
      "Vercel stopped applying headers to redirects — a returning visitor's " +
        "first response now carries no HSTS",
    ).toBe("nosniff");
    expect(response.headers()["strict-transport-security"]).toBeTruthy();
  } else {
    expect(
      response.headers()["x-content-type-options"],
      "Next now applies headers to redirects — the comment above is out of date",
    ).toBeUndefined();
  }
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

    /* Infer from the server being talked to, never from the test process.
       NODE_ENV was the first version of this mistake: unset here, it read as
       "dev" and demanded 'unsafe-eval' from a production build.

       E2E_TARGET fixed that and then repeated it one level up. Pointing the
       suite at the live domain with E2E_BASE_URL alone leaves E2E_TARGET
       unset, so this read "dev" again and demanded 'unsafe-eval' from
       production — found on 2026-09-09, the first time this ran against the
       real deployment. An external base URL is by definition not `next dev`,
       so it settles the question on its own. */
    const dev =
      !process.env.E2E_BASE_URL && process.env.E2E_TARGET !== "prod";

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
