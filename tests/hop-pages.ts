import type { Page } from "@playwright/test";

/* /yol-tarifi and /telefon exist to navigate away from themselves, which makes
 * them awkward to measure: any test that inspects the page after load races
 * the handoff and loses.
 *
 * It only started losing against a production build. Under `next dev` the page
 * hydrates slowly enough that assertions ran first, so the overflow, noindex
 * and tap-target checks on those two routes were passing for a reason that had
 * nothing to do with what they assert. The production project surfaced six of
 * them on its first run.
 *
 * TWO THINGS THAT DO NOT WORK, both tried:
 *
 *   Stubbing `location.replace`. It cannot be done in Chrome —
 *   `Object.getOwnPropertyDescriptor(window.location, "replace")` reports
 *   `configurable: false, writable: false`, defineProperty throws, plain
 *   assignment is ignored, and overriding `Location.prototype.replace` does not
 *   help because the call is resolved internally. The first version of this
 *   helper did exactly that inside a try/catch, so it swallowed the TypeError
 *   and silently did nothing — and one test still passed, by racing.
 *
 *   Aborting the request with `route.abort()`. The navigation still commits and
 *   the tab lands on `chrome-error://chromewebdata/`. The page under test is
 *   gone either way.
 *
 * WHAT WORKS: answer the navigation with **204 No Content**. A 204 means "there
 * is nothing to render, stay where you are", so the browser abandons the
 * navigation and leaves the current document intact — which is precisely what
 * these measurements need.
 *
 * Only for tests that need the page to sit still. Tests asserting the handoff
 * HAPPENS must not use this: they catch the outbound URL with `route.abort()`
 * instead, which is the right tool when the navigation is the thing under test.
 *
 * That distinction is per test, not per file. This note used to exclude all of
 * tests/directions.spec.ts, which was too broad: its "stays out of the index"
 * test asserts a meta tag rather than the handoff, so it needs the page to sit
 * still and now uses this helper. Until 2026-09-09 it passed by winning the
 * race, and an unrelated playwright.config change was enough to make it lose.
 */
/* The two DIRECTIONS destinations only — deliberately not `maps.google.com`
 * wholesale. The /iletisim embed lives at maps.google.com/maps?…output=embed,
 * and tests/layout.spec.ts applies this to every route it walks; a broader
 * pattern would blank that map and quietly change what the overflow suite is
 * measuring on the one page that has an iframe.
 *
 * /telefon needs no entry: it hands off to a `tel:` URL, which is not an HTTP
 * request Playwright can route — and which does nothing in Chrome anyway,
 * since there is no handler. */
const OUTBOUND = /maps\.apple\.com|google\.[a-z.]+\/maps\/dir/;

export async function stayOnHopPage(page: Page): Promise<void> {
  await page.route(OUTBOUND, (route) =>
    route.fulfill({ status: 204, body: "" }),
  );
}
