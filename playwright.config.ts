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
    command: 'npm run preview -- --port 4173 --strictPort',
    url: 'http://localhost:4173/dundrodtt/',
    reuseExistingServer: !process.env.CI,
  },
});
