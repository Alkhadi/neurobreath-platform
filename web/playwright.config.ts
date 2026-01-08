import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for NeuroBreath Focus Screen Testing
 * 
 * Tests focus screens/overlays/modals for responsiveness across all required viewports.
 */

export default defineConfig({
  testDir: './tests/e2e',
  
  // Timeout for each test
  timeout: 60 * 1000,
  
  // Expect timeout
  expect: {
    timeout: 10000,
  },
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: 0, // Disabled for faster local testing
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['list']
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run your local dev server before starting the tests
  // NOTE: Set SKIP_SERVER=1 if server already running
  webServer: process.env.SKIP_SERVER ? undefined : {
    command: 'yarn dev',
    url: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
