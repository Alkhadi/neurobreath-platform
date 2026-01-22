import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for NeuroBreath Buddy DOM audit
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'iPhone 12',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'iPad',
      use: { ...devices['iPad (gen 7)'] },
    },
    {
      name: 'Desktop 1440x900',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  webServer: {
    command: 'npm run dev:clean',
    url: 'http://localhost:3000',
    // Default to NOT reusing an existing server.
    // Reuse can accidentally point tests at a stale/incorrect process already on :3000.
    // Opt-in via env var if you know what you're doing.
    reuseExistingServer: !!process.env.PW_REUSE_SERVER && !process.env.CI,
    timeout: 120 * 1000,
  },
});
