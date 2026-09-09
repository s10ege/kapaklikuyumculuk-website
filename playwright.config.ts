import { defineConfig } from "@playwright/test";

/* Uses the system Chrome via `channel`, so no browser download is needed.
 * Run `npx playwright install chromium` only if a clean machine lacks Chrome.
 *
 * TWO PROJECTS since 2026-09-08, and the reason is not tidiness.
 *
 * Everything used to run against `npm run dev`, which meant "the redirects
 * work" and "the build is static" — both claims about production — were proven
 * on a dev server. The CSP pass made the gap concrete in both directions at
 * once: a policy that was correct in production took the entire dev site down
 * (React uses `eval` in development), and a production sweep came back clean
 * while thirteen dev tests timed out. Either half alone would have been
 * missed.
 *
 *   dev   — everything, against `next dev`, including the app/dev/* routes.
 *   prod  — against `next build && next start`. The dev routes 404 there by
 *           design, so the specs that drive them are excluded rather than
 *           made conditional; see PROD_IGNORE.
 *
 * E2E_BASE_URL points either project at an already-running server and turns
 * `webServer` off. FINAL.md 4.2 needs exactly that to run the redirect suite
 * against the live domain, which it could not do at all before.
 */

const EXTERNAL = process.env.E2E_BASE_URL;
const PORT = process.env.E2E_PORT ?? "3000";
const LOCAL = `http://localhost:${PORT}`;
const baseURL = EXTERNAL ?? LOCAL;

/* Specs that cannot run against a production build, with the reason each.
 *
 * lightbox.spec.ts drives /dev/grid — a decision from iteration 8, when the
 * catalogue was empty and there was no real grid to open a lightbox from.
 * That is no longer true, so moving it onto a real category page would remove
 * this exclusion entirely. Worth doing; not worth doing inside the change that
 * introduces the project split. tests/a11y.spec.ts already exercises the same
 * lightbox on /urunler/yuzuk, so the controls are not unproven in production. */
const PROD_IGNORE = ["**/lightbox.spec.ts"];

/* Vercel's deployment protection puts preview deployments behind SSO, so an
   automated run cannot reach one without this header. The secret comes from
   the project's "Protection Bypass for Automation" setting and lives only in
   a gitignored .env.local — never committed, never in CI. Unset, the header
   is absent and nothing changes, which is the case for every local run and
   for the live domain (production deployments are not protected). */
const BYPASS = process.env.E2E_BYPASS_SECRET;
/* Spread rather than assigned, so an unset secret leaves the key absent
   altogether. Passing `extraHTTPHeaders: undefined` is not the same thing to
   Playwright and is not worth finding out the hard way twice. */
const bypassHeader = BYPASS
  ? { extraHTTPHeaders: { "x-vercel-protection-bypass": BYPASS } }
  : {};

const webServer = EXTERNAL
  ? undefined
  : {
      url: LOCAL,
      reuseExistingServer: true,
      timeout: 180_000,
    };

export default defineConfig({
  testDir: "./tests",
  globalSetup: "./tests/global-setup.ts",
  /* Only .spec.ts is Playwright's. Unit tests are .test.mts and run under
   * node:test, which needs no framework and no browser. Without this,
   * Playwright's default testMatch would also claim the .test files. */
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  /* The dev server compiles routes on first request. With four Playwright
   * workers asking for five dynamic category routes at once, Next's render
   * worker pool intermittently died ("Jest worker encountered 2 child process
   * exceptions"), returning 500s for pages that build and serve fine. Capping
   * concurrency keeps compilation serial enough to be stable; it is a limit of
   * the dev server, not of the pages. */
  workers: 2,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, channel: "chrome", ...bypassHeader },

  projects: [
    { name: "dev", use: { baseURL } },
    { name: "prod", use: { baseURL }, testIgnore: PROD_IGNORE },
  ],

  /* One webServer for whichever project runs; the command differs, so it is
     chosen by E2E_TARGET rather than per-project — Playwright's webServer is
     config-level, not project-level. */
  webServer: webServer && {
    ...webServer,
    command:
      process.env.E2E_TARGET === "prod"
        ? `npm run build && npx next start -p ${PORT}`
        : `npx next dev -p ${PORT}`,
  },
});
