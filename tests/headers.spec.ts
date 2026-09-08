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
