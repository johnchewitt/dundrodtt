import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4173/dundrodtt/',
    // CHROME_PATH lets CI or a sandboxed environment point at a
    // system Chrome instead of a downloaded browser.
    launchOptions: process.env.CHROME_PATH
      ? { executablePath: process.env.CHROME_PATH }
      : undefined,
  },
  webServer: {
    // Always build first and never reuse a stray server: e2e must test
    // the code as it stands, not whatever an old preview was serving.
    command: 'npm run build && npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/dundrodtt/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
