import { defineConfig } from "@playwright/test";

/* Uses the system Chrome via `channel`, so no browser download is needed.
 * Run `npx playwright install chromium` only if a clean machine lacks Chrome. */
export default defineConfig({
  testDir: "./tests",
  /* Only .spec.ts is Playwright's. Unit tests are .test.mts and run under
   * node:test, which needs no framework and no browser. Without this,
   * Playwright's default testMatch would also claim the .test files. */
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    channel: "chrome",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
