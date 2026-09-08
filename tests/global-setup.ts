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
  "/hizmetler",
  "/hakkimizda",
  "/iletisim",
  "/urunler/altin-seti",
  "/urunler/kupe-modelleri",
  "/urunler/yuzuk",
  "/urunler/ozel-tasarim-takilar",
  "/yol-tarifi",
  "/telefon",
  "/dev/tokens",
  "/dev/placeholders",
  "/dev/grid",
];

export default async function globalSetup() {
  /* Same resolution as playwright.config.ts. Warming localhost while the suite
     runs against a deployed URL would warm nothing and hide nothing. */
  const base =
    process.env.E2E_BASE_URL ?? `http://localhost:${process.env.E2E_PORT ?? "3000"}`;

  /* A production build 404s the dev routes by design; warming them there would
     be fetching four 404s on purpose. And a production build compiles nothing
     on demand, so warming is only actually needed for `next dev` — it is left
     running for both because a first-request warm costs nothing and keeps the
     two paths identical. */
  const routes =
    process.env.E2E_TARGET === "prod"
      ? ROUTES.filter((r) => !r.startsWith("/dev/"))
      : ROUTES;

  for (const route of routes) {
    try {
      await fetch(`${base}${route}`);
    } catch {
      // The webServer config is responsible for the server being up; a failure
      // here should surface as a test failure, not as a confusing setup crash.
    }
  }
}
