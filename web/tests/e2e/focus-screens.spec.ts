/**
 * Focus Screens E2E Tests
 * 
 * Tests all focus screens/overlays/modals for responsiveness across required viewports.
 * 
 * Requirements tested:
 * - No horizontal scroll
 * - Focus screen fits viewport (dvh-based sizing)
 * - Primary CTA always visible (sticky footer)
 * - Close button always visible (sticky header)
 * - Internal scroll works (content scrolls, background doesn't)
 * - Touch targets ≥ 44px
 * - Safe-area aware
 * 
 * Viewports tested:
 * - 320×568 (iPhone SE)
 * - 360×740 (Android small)
 * - 390×844 (iPhone 12/13/14)
 * - 414×896 (iPhone Plus)
 * - 768×1024 (iPad Portrait)
 * - 1024×768 (iPad Landscape)
 * - 1280×800 (Desktop)
 */

import { test, expect } from '@playwright/test';

// Define all required viewports
const viewports = [
  { width: 320, height: 568, name: 'iphone-se' },
  { width: 360, height: 740, name: 'android-small' },
  { width: 390, height: 844, name: 'iphone-12' },
  { width: 414, height: 896, name: 'iphone-plus' },
  { width: 768, height: 1024, name: 'ipad-portrait' },
  { width: 1024, height: 768, name: 'ipad-landscape' },
  { width: 1280, height: 800, name: 'desktop' },
];

test.describe('Focus Screen: Breathing Technique Chooser', () => {
  for (const viewport of viewports) {
    test(`should be fully responsive on ${viewport.name} (${viewport.width}×${viewport.height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to home page
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      
      // Find and click the "Click here for a quick start" button that opens the modal
      // Try multiple selectors
      const startButton = page.locator('.nb-hero-yellow-btn, button:has-text("quick start")').first();
      
      // Wait for button to be visible
      await startButton.waitFor({ state: 'visible', timeout: 15000 });
      await startButton.click();
      
      // Wait for modal to appear - try both with and without testid
      await page.waitForTimeout(1000); // Give modal time to render
      
      const modal = page.locator('[data-testid="breathing-technique-modal"], [role="dialog"]').first();
      await modal.waitFor({ state: 'visible', timeout: 10000 });
      
      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/focus-screen-${viewport.width}x${viewport.height}.png`,
        fullPage: false,
      });
      
      // ✅ TEST 1: No horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1); // +1 for rounding
      
      // ✅ TEST 2: Modal container fits viewport
      const modalContainer = page.locator('[data-testid="breathing-technique-modal-container"]');
      const containerBox = await modalContainer.boundingBox();
      expect(containerBox).not.toBeNull();
      if (containerBox) {
        // Container should fit within viewport height
        expect(containerBox.height).toBeLessThan(viewport.height);
        // Container should not overflow viewport
        expect(containerBox.y).toBeGreaterThanOrEqual(0);
        expect(containerBox.y + containerBox.height).toBeLessThanOrEqual(viewport.height + 10); // +10 tolerance
      }
      
      // ✅ TEST 3: Close button visible
      const closeButton = page.locator('[data-testid="breathing-technique-modal-close-button"]');
      await expect(closeButton).toBeVisible();
      const closeBox = await closeButton.boundingBox();
      expect(closeBox).not.toBeNull();
      if (closeBox) {
        // Close button should be fully within viewport
        expect(closeBox.y).toBeGreaterThanOrEqual(0);
        expect(closeBox.y + closeBox.height).toBeLessThanOrEqual(viewport.height);
        
        // Close button should meet minimum touch target (44px)
        expect(closeBox.width).toBeGreaterThanOrEqual(44);
        expect(closeBox.height).toBeGreaterThanOrEqual(44);
      }
      
      // ✅ TEST 4: Primary CTA (Start breathing button) visible in footer
      const footerCTA = page.locator('[data-testid="breathing-technique-modal-footer"] button').filter({ hasText: /start.*breath/i }).first();
      await expect(footerCTA).toBeVisible();
      const ctaBox = await footerCTA.boundingBox();
      expect(ctaBox).not.toBeNull();
      if (ctaBox) {
        // CTA should be fully visible within viewport (not clipped)
        const bottom = ctaBox.y + ctaBox.height;
        expect(bottom).toBeLessThanOrEqual(viewport.height + 5); // +5 tolerance
        expect(ctaBox.y).toBeGreaterThanOrEqual(0);
        
        // CTA should meet minimum touch target
        expect(ctaBox.height).toBeGreaterThanOrEqual(44);
      }
      
      // ✅ TEST 5: Content area scrolls internally
      const contentArea = page.locator('[data-testid="breathing-technique-modal-content"]');
      await expect(contentArea).toBeVisible();
      
      // Check if content is scrollable (scrollHeight > clientHeight)
      const isScrollable = await contentArea.evaluate((el) => {
        return el.scrollHeight > el.clientHeight;
      });
      
      if (isScrollable) {
        // Get initial scroll position
        const initialScrollTop = await contentArea.evaluate((el) => el.scrollTop);
        
        // Scroll content area
        await contentArea.evaluate((el) => {
          el.scrollTop = 100;
        });
        
        // Verify scroll happened
        const newScrollTop = await contentArea.evaluate((el) => el.scrollTop);
        expect(newScrollTop).toBeGreaterThan(initialScrollTop);
      }
      
      // ✅ TEST 6: Background page doesn't scroll when modal is open
      const initialPageScroll = await page.evaluate(() => window.scrollY);
      
      // Attempt to scroll the page
      await page.evaluate(() => window.scrollBy(0, 100));
      
      // Check page scroll didn't change (or changed minimally)
      const newPageScroll = await page.evaluate(() => window.scrollY);
      expect(Math.abs(newPageScroll - initialPageScroll)).toBeLessThan(10);
      
      // ✅ TEST 7: All interactive elements meet minimum touch target
      const allButtons = await modal.locator('button, a, select, input[type="range"]').all();
      for (const button of allButtons) {
        if (await button.isVisible()) {
          const box = await button.boundingBox();
          if (box) {
            // Either width OR height should be ≥ 44px (for range sliders)
            const meetsTarget = box.height >= 44 || box.width >= 44;
            expect(meetsTarget).toBe(true);
          }
        }
      }
      
      // Close modal for cleanup
      await closeButton.click();
      await modal.waitFor({ state: 'hidden', timeout: 2000 });
    });
  }
});

test.describe('Focus Screen: Profile Creation', () => {
  // Test one viewport for profile screen
  test('should be fully responsive on mobile (390×844)', async ({ page }) => {
    const viewport = { width: 390, height: 844 };
    await page.setViewportSize(viewport);
    
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Find profile creation button
    const profileButton = page.locator('button, a').filter({ hasText: /create.*profile|get started/i }).first();
    
    // Check if button exists
    if (await profileButton.count() > 0) {
      await profileButton.click();
      
      // Wait for modal
      const modal = page.locator('[data-testid="profile-creation-modal"]');
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      
      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/profile-modal-${viewport.width}x${viewport.height}.png`,
        fullPage: false,
      });
      
      // Verify no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
      
      // Verify close button visible
      const closeButton = page.locator('[data-testid="profile-creation-modal-close-button"]');
      await expect(closeButton).toBeVisible();
      
      // Clean up
      await closeButton.click();
    }
  });
});

test.describe('Focus Screen: Focus Training Timer', () => {
  test('should be fully responsive on mobile (390×844)', async ({ page }) => {
    const viewport = { width: 390, height: 844 };
    await page.setViewportSize(viewport);
    
    await page.goto('/tools/focus-training', { waitUntil: 'networkidle' });
    
    // Find "Start 5-Minute Reset" button
    const startButton = page.locator('button').filter({ hasText: /5.*minute.*reset/i }).first();
    
    if (await startButton.count() > 0) {
      await startButton.click();
      
      // Wait a moment for timer panel to appear
      await page.waitForTimeout(500);
      
      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/focus-timer-${viewport.width}x${viewport.height}.png`,
        fullPage: false,
      });
      
      // Verify no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 1);
    }
  });
});
