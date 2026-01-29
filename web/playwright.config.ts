import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for NeuroBreath Buddy DOM audit
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testIgnore: ['visual/**'],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 4,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    viewport: { width: 1280, height: 800 },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],

  webServer: {
    command: 'yarn dev:e2e',
    url: 'http://localhost:3000',
    // Default to NOT reusing an existing server.
    // Reuse can accidentally point tests at a stale/incorrect process already on :3000.
    // Opt-in via env var if you know what you're doing.
    reuseExistingServer: !!process.env.PW_REUSE_SERVER && !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NEXTAUTH_DEBUG: 'false',
    },
  },
});
