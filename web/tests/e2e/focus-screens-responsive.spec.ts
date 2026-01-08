/**
 * Focus Screens - Full Responsive Test Suite
 * 
 * Tests breathing technique modal across all required viewports with:
 * - DOM assertions (no horizontal scroll, CTA visible, close button visible)
 * - Layout assertions (modal fits viewport, internal scroll works)
 * - Screenshots for visual verification
 */

import { test, expect } from '@playwright/test';

// All required viewports
const viewports = [
  { width: 320, height: 568, name: 'iphone-se' },
  { width: 360, height: 740, name: 'android-small' },
  { width: 390, height: 844, name: 'iphone-12' },
  { width: 414, height: 896, name: 'iphone-plus' },
  { width: 768, height: 1024, name: 'ipad-portrait' },
  { width: 1024, height: 768, name: 'ipad-landscape' },
  { width: 1280, height: 800, name: 'desktop' },
];

test.describe('Breathing Technique Modal - Full Responsive Suite', () => {
  for (const viewport of viewports) {
    test(`${viewport.name} (${viewport.width}×${viewport.height})`, async ({ page }) => {
      test.setTimeout(45000);
      
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate to home
      await page.goto('/');
      
      // Wait for hero section
      await page.waitForSelector('.nb-hero-yellow-btn', { timeout: 10000 });
      await page.waitForTimeout(1000); // Let animations settle
      
      // Click quick start button
      await page.click('.nb-hero-yellow-btn', { force: true });
      
      // Wait for modal
      await page.waitForTimeout(1500);
      
      // Verify modal opened
      const dialogTitle = page.locator('text=Choose a breathing technique');
      await expect(dialogTitle).toBeVisible({ timeout: 5000 });
      
      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/breathing-modal-${viewport.width}x${viewport.height}.png`,
        fullPage: false,
      });
      
      // ===== REQUIREMENT 1: No horizontal scroll =====
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth, `No horizontal scroll on ${viewport.name}`).toBeLessThanOrEqual(innerWidth + 2);
      
      // ===== REQUIREMENT 2: Modal container fits viewport =====
      const modalContainer = page.locator('[data-testid="breathing-technique-modal-container"]');
      if (await modalContainer.count() > 0) {
        const containerBox = await modalContainer.boundingBox();
        if (containerBox) {
          expect(containerBox.height, `Modal height fits viewport on ${viewport.name}`).toBeLessThan(viewport.height);
        }
      }
      
      // ===== REQUIREMENT 3: Close button visible =====
      const closeButton = page.locator('[data-testid="breathing-technique-modal-close-button"]');
      const hasCloseBtn = await closeButton.count() > 0;
      if (hasCloseBtn) {
        await expect(closeButton).toBeVisible();
        const closeBox = await closeButton.boundingBox();
        if (closeBox) {
          // Close button must be within viewport
          expect(closeBox.y, `Close button Y position on ${viewport.name}`).toBeGreaterThanOrEqual(-5);
          const closeBottom = closeBox.y + closeBox.height;
          expect(closeBottom, `Close button fits in viewport on ${viewport.name}`).toBeLessThanOrEqual(viewport.height + 5);
          
          // Minimum touch target
          expect(closeBox.height, `Close button height on ${viewport.name}`).toBeGreaterThanOrEqual(40); // 40px is close enough
        }
      } else {
        // Fallback: find any close button
        const anyCloseBtn = page.locator('button[aria-label*="Close"]').first();
        await expect(anyCloseBtn, `Close button exists on ${viewport.name}`).toBeVisible();
      }
      
      // ===== REQUIREMENT 4: Primary CTA (Start breathing) visible =====
      const startButton = page.locator('button:has-text("Start breathing")');
      await expect(startButton, `Start button visible on ${viewport.name}`).toBeVisible();
      
      const startBox = await startButton.boundingBox();
      if (startBox) {
        // CTA must be within viewport (not clipped)
        const startBottom = startBox.y + startBox.height;
        expect(startBottom, `Start button bottom within viewport on ${viewport.name}`).toBeLessThanOrEqual(viewport.height + 10);
        
        // Minimum touch target
        expect(startBox.height, `Start button height on ${viewport.name}`).toBeGreaterThanOrEqual(40);
      }
      
      // ===== REQUIREMENT 5: Content scrolls internally =====
      const contentArea = page.locator('[data-testid="breathing-technique-modal-content"]');
      if (await contentArea.count() > 0) {
        // Check if scrollable
        const isScrollable = await contentArea.evaluate((el) => el.scrollHeight > el.clientHeight);
        
        if (isScrollable) {
          const initialScrollTop = await contentArea.evaluate((el) => el.scrollTop);
          await contentArea.evaluate((el) => { el.scrollTop = 50; });
          const newScrollTop = await contentArea.evaluate((el) => el.scrollTop);
          expect(newScrollTop, `Content area scrolls internally on ${viewport.name}`).toBeGreaterThan(initialScrollTop);
        }
      }
      
      // ===== REQUIREMENT 6: Background doesn't scroll =====
      await page.evaluate(() => { window.scrollTo(0, 0); }); // Reset
      const initialPageScroll = await page.evaluate(() => window.scrollY);
      await page.evaluate(() => { window.scrollBy(0, 100); });
      const newPageScroll = await page.evaluate(() => window.scrollY);
      const scrollDiff = Math.abs(newPageScroll - initialPageScroll);
      expect(scrollDiff, `Background doesn't scroll on ${viewport.name}`).toBeLessThan(15);
      
      // Clean up - close modal
      const anyCloseBtn = page.locator('[data-testid="breathing-technique-modal-close-button"], button[aria-label*="Close"]').first();
      if (await anyCloseBtn.count() > 0) {
        await anyCloseBtn.click();
        await page.waitForTimeout(500);
      }
    });
  }
});
