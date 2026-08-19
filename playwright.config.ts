import { defineConfig } from "@playwright/test";

/* Uses the system Chrome via `channel`, so no browser download is needed.
 * Run `npx playwright install chromium` only if a clean machine lacks Chrome. */
export default defineConfig({
  testDir: "./tests",
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
