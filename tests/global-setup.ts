/* Warm every route once, serially, before the suite runs.
 *
 * The dev server compiles a route on its first request. On a cold .next that
 * first compile can take well over ten seconds, which blows past assertion
 * timeouts and produces failures that vanish on a re-run — the worst kind,
 * because they train you to ignore red.
 *
 * Warming here is deterministic and costs a few seconds once, rather than
 * adding retries that would also hide real regressions.
 */
const ROUTES = [
  "/",
  "/urunler",
  "/galeri",
  "/urunler/pirlanta",
  "/urunler/altin-seti",
  "/urunler/kupe-modelleri",
  "/urunler/tek-tas-modelleri",
  "/urunler/ozel-tasarim-takilar",
  "/dev/tokens",
  "/dev/placeholders",
  "/dev/grid",
];

export default async function globalSetup() {
  const base = "http://localhost:3000";

  for (const route of ROUTES) {
    try {
      await fetch(`${base}${route}`);
    } catch {
      // The webServer config is responsible for the server being up; a failure
      // here should surface as a test failure, not as a confusing setup crash.
    }
  }
}
