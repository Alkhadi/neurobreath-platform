import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Visual Regression Test Suite
 * Tests for layout stability, overflow detection, and visual consistency
 */

interface RouteConfig {
  url: string;
  name: string;
  region: 'uk' | 'us';
  waitFor?: string; // Selector to wait for
  fullPage?: boolean; // Full page screenshot vs viewport
  testDialog?: boolean; // Test dialog interactions
}

// Curated route list for both regions
const ROUTES: RouteConfig[] = [
  // Homepages
  { url: '/uk', name: 'homepage', region: 'uk', waitFor: 'main', fullPage: false },
  { url: '/us', name: 'homepage', region: 'us', waitFor: 'main', fullPage: false },
  
  // Hubs
  { url: '/uk/conditions', name: 'conditions-hub', region: 'uk', waitFor: 'h1', fullPage: false },
  { url: '/us/conditions', name: 'conditions-hub', region: 'us', waitFor: 'h1', fullPage: false },
  { url: '/uk/tools', name: 'tools-hub', region: 'uk', waitFor: 'h1', fullPage: false },
  { url: '/us/tools', name: 'tools-hub', region: 'us', waitFor: 'h1', fullPage: false },
  { url: '/uk/guides', name: 'guides-hub', region: 'uk', waitFor: 'h1', fullPage: false },
  { url: '/us/guides', name: 'guides-hub', region: 'us', waitFor: 'h1', fullPage: false },
  
  // Breathing tool
  { url: '/breathing', name: 'breathing-timer', region: 'uk', waitFor: 'main', fullPage: false, testDialog: true },
  
  // Trust Centre
  { url: '/uk/trust', name: 'trust-hub', region: 'uk', waitFor: 'h1', fullPage: false },
  { url: '/us/trust', name: 'trust-hub', region: 'us', waitFor: 'h1', fullPage: false },
  
  // Glossary
  { url: '/uk/glossary', name: 'glossary', region: 'uk', waitFor: 'h1', fullPage: false },
  { url: '/us/glossary', name: 'glossary', region: 'us', waitFor: 'h1', fullPage: false },
  
  // Help me choose
  { url: '/uk/help-me-choose', name: 'help-me-choose', region: 'uk', waitFor: 'main', fullPage: false },
];

// Console errors collector
const consoleErrors: Array<{ url: string; device: string; message: string; type: string }> = [];

/**
 * Disable CSS animations in test context only
 */
async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
}

/**
 * Wait for page to be stable and fonts loaded
 */
async function waitForStability(page: Page, selector?: string) {
  // Wait for fonts
  await page.evaluate(() => document.fonts.ready);
  
  // Wait for selector if provided
  if (selector) {
    await page.waitForSelector(selector, { timeout: 30000 });
  }
  
  // Wait for network idle
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {
    // Fallback: just wait a bit
  });
  
  // Additional settling time
  await page.waitForTimeout(1000);
}

/**
 * Check for horizontal overflow
 */
async function checkNoHorizontalOverflow(page: Page): Promise<boolean> {
  const hasOverflow = await page.evaluate(() => {
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    return scrollWidth > clientWidth + 1; // Allow 1px tolerance
  });
  return !hasOverflow;
}

/**
 * Check if primary CTA is visible above the fold
 */
async function checkCtaVisible(page: Page): Promise<boolean> {
  try {
    const root = page.locator('main').first();

    // Look for common CTA patterns
    const ctaSelectors = [
      'a[href*="breathing"]',
      'a[href*="help-me-choose"]',
      'a[href*="/journeys"]',
      'a:has-text("Help me choose")',
      'a:has-text("Starter journeys")',
      'button:has-text("Start")',
      'a:has-text("Get started")',
      'a:has-text("Try")',
    ];
    
    for (const selector of ctaSelectors) {
      const cta = root.locator(selector).first();
      const count = await cta.count();
      if (count > 0) {
        const isVisible = await cta.isVisible();
        if (isVisible) {
          const box = await cta.boundingBox();
          if (box && box.y < 900) { // Above the fold
            return true;
          }
        }
      }
    }
    return false;
  } catch {
    return false;
  }
}

// Test suite
test.describe('Visual Regression Suite', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'Visual snapshots are maintained for Chromium only');

  test.beforeEach(async ({ page }, testInfo) => {
    // Make snapshots OS-agnostic (avoid -darwin vs -linux)
    testInfo.snapshotSuffix = '';

    // Stub DB-backed endpoints to keep visual tests stable in CI (no DB service).
    await page.route('**/api/quests/today**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ completedQuests: 0, totalPoints: 0 }),
      });
    });

    await page.route('**/api/progress**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totalMinutes: 0,
          totalSessions: 0,
          currentStreak: 0,
          last7Days: 0,
        }),
      });
    });

    await page.route('**/api/challenges**', async (route) => {
      const method = route.request().method();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: method === 'GET' ? JSON.stringify({ challenges: [] }) : JSON.stringify({ ok: true }),
      });
    });

    await page.route('**/api/sessions**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.route('**/api/account/consent**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, consent: null }),
      });
    });

    // Collect console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push({
          url: page.url(),
          device: testInfo.project.name,
          message: msg.text(),
          type: 'console.error',
        });
      }
    });

    // Capture any 5xx responses to pinpoint failing resources.
    page.on('response', (response) => {
      const status = response.status();
      if (status >= 500) {
        consoleErrors.push({
          url: page.url(),
          device: testInfo.project.name,
          message: `${status} ${response.url()}`,
          type: 'http.5xx',
        });
      }
    });
    
    page.on('pageerror', (error) => {
      consoleErrors.push({
        url: page.url(),
        device: testInfo.project.name,
        message: error.message,
        type: 'pageerror',
      });
    });
    
    // Disable animations
    await page.goto('about:blank');
    await disableAnimations(page);
  });
  
  // Main route tests
  for (const route of ROUTES) {
    test(`${route.region}-${route.name}`, async ({ page }, testInfo) => {
      const device = testInfo.project.name;
      
      // Navigate
      await page.goto(route.url);
      await waitForStability(page, route.waitFor);
      
      // Layout assertions
      const noOverflow = await checkNoHorizontalOverflow(page);
      expect(noOverflow, `No horizontal overflow on ${route.url}`).toBe(true);
      
      // Screenshot
      const screenshotName = `${route.region}-${route.name}-${device}.png`;
      await expect(page).toHaveScreenshot(screenshotName, {
        fullPage: route.fullPage ?? false,
        animations: 'disabled',
        maxDiffPixelRatio: 0.02, // Allow up to 2% diff for anti-aliasing across runs
      });
      
      // CTA visibility check for hubs and homepage
      if (['homepage', 'conditions-hub', 'tools-hub', 'guides-hub'].includes(route.name)) {
        const ctaVisible = await checkCtaVisible(page);
        expect(ctaVisible, `Primary CTA visible on ${route.url}`).toBe(true);
      }
    });
  }
  
  // Dialog test
  test('dialog-neurobreath-buddy-mobile', async ({ page }, testInfo) => {
    if (testInfo.project.name !== 'mobile') {
      test.skip();
    }
    
    await page.goto('/uk');
    await waitForStability(page);
    
    // Open buddy dialog (look for trigger button)
    const buddyButton = page.locator('[data-buddy-trigger], button:has-text("Buddy")').first();
    if (await buddyButton.count() > 0) {
      await buddyButton.click();
      await page.waitForTimeout(500);
      
      // Check dialog is visible
      const dialog = page.locator('[role="dialog"]').first();
      await expect(dialog).toBeVisible();
      
      // Check primary button in dialog is visible
      const dialogButton = dialog.locator('button').first();
      await expect(dialogButton).toBeVisible();
      
      // Screenshot dialog state
      await expect(page).toHaveScreenshot('dialog-buddy-mobile.png', {
        fullPage: false,
        animations: 'disabled',
      });
    }
  });
  
  // Save console errors after all tests
  test.afterAll(async () => {
    const reportsDir = path.join(process.cwd(), 'reports', 'visual');
    fs.mkdirSync(reportsDir, { recursive: true });
    
    const errorsFile = path.join(reportsDir, 'console-errors.json');

    // If there are errors, persist them for CI artifacts and fail the suite.
    if (consoleErrors.length > 0) {
      fs.writeFileSync(errorsFile, JSON.stringify(consoleErrors, null, 2));

      console.error(`❌ Found ${consoleErrors.length} console errors`);
      consoleErrors.forEach((err) => {
        console.error(`  ${err.device} | ${err.url}: ${err.message}`);
      });
      throw new Error(`Visual regression suite found ${consoleErrors.length} console errors`);
    }

    // If no errors, ensure we don't leave a stale file that would fail the workflow.
    if (fs.existsSync(errorsFile)) {
      fs.unlinkSync(errorsFile);
    }
  });
});

// Single H1 check
test.describe('Accessibility Smoke Checks', () => {
  const checkRoutes = [
    '/uk',
    '/uk/conditions',
    '/uk/tools',
    '/uk/guides',
  ];
  
  for (const route of checkRoutes) {
    test(`single-h1-${route.replace(/\//g, '-')}`, async ({ page }) => {
      await page.goto(route);
      await waitForStability(page, 'main');
      
      const h1Count = await page.locator('h1').count();
      expect(h1Count, `Single H1 on ${route}`).toBe(1);
    });
  }
});
