/**
 * Basic Breathing Modal Test
 * 
 * Simplified test to verify modal opens and basic responsiveness works
 */

import { test, expect } from '@playwright/test';

const viewports = [
  { width: 320, height: 568, name: 'iphone-se' },
  { width: 390, height: 844, name: 'iphone-12' },
  { width: 768, height: 1024, name: 'ipad-portrait' },
  { width: 1280, height: 800, name: 'desktop' },
];

test.describe('Breathing Modal - Basic Responsiveness', () => {
  for (const viewport of viewports) {
    test(`opens and displays correctly on ${viewport.name}`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Navigate
      await page.goto('/');
      
      // Wait for page to load
      await page.waitForLoadState('domcontentloaded');
      
      // Find quick start button
      const quickStartBtn = await page.locator('button:has-text("quick start")').first();
      await quickStartBtn.click();
      
      // Wait for modal
      await page.waitForTimeout(1000);
      
      // Check if modal is visible (look for the title)
      const modalTitle = page.locator('text=Choose a breathing technique');
      await expect(modalTitle).toBeVisible({ timeout: 5000 });
      
      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/breathing-modal-${viewport.width}x${viewport.height}.png`,
        fullPage: false,
      });
      
      // Test 1: No horizontal scroll
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const innerWidth = await page.evaluate(() => window.innerWidth);
      expect(scrollWidth).toBeLessThanOrEqual(innerWidth + 2);
      
      // Test 2: Modal fits viewport
      const modal = page.locator('[role="dialog"]').first();
      const modalBox = await modal.boundingBox();
      if (modalBox) {
        expect(modalBox.height).toBeLessThan(viewport.height);
      }
      
      // Test 3: "Start breathing" button is visible
      const startBtn = page.locator('button:has-text("Start breathing")');
      await expect(startBtn).toBeVisible();
      
      // Test 4: Close button is visible
      const closeBtn = page.locator('button[aria-label*="Close"]').first();
      await expect(closeBtn).toBeVisible();
      
      // Close modal
      await closeBtn.click();
      await page.waitForTimeout(500);
    });
  }
});
