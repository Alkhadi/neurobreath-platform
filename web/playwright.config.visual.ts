import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Visual Regression Configuration
 * For stable screenshot-based testing with minimal flakiness
 */
export default defineConfig({
  testDir: './tests/visual',
  fullyParallel: false, // Run sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1, // Single worker for consistent results
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
    toHaveScreenshot: {
      maxDiffPixels: 100, // Allow minor anti-aliasing differences
      threshold: 0.2,
    },
  },
  reporter: [
    ['html', { outputFolder: 'reports/visual/playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/visual/results.json' }],
    ['list'],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Stability settings
    locale: 'en-GB',
    timezoneId: 'Europe/London',
    
    // Consistent color scheme
    colorScheme: 'light',
    
    // Wait for fonts
    actionTimeout: 15 * 1000,
  },

  projects: [
    {
      name: 'mobile',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
      },
    },
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
      },
    },
  ],

  webServer: {
    command: process.env.CI ? 'yarn start' : 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    env: {
      NODE_ENV: process.env.CI ? 'production' : 'development',
      NEXTAUTH_DEBUG: 'false',
    },
  },
});
