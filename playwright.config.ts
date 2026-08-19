import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: process.env.CI ? 2 : undefined,
  use: { baseURL: 'http://127.0.0.1:4321', channel: 'chrome', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop-chrome', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile-touch', use: { viewport: { width: 390, height: 844 }, hasTouch: true } },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    port: 4321,
    reuseExistingServer: true,
  },
});
