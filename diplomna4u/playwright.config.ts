import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  use: {
    baseURL: 'http://localhost:8788',
    headless: true,
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
  webServer: {
    command: 'npm run build && npx wrangler pages dev dist --port 8788',
    url: 'http://localhost:8788',
    reuseExistingServer: !process.env.CI,
    timeout: 300000,
  },
});
