/**
 * Quick Test - Breathing Modal
 * Simple test to verify modal opens
 */

import { test, expect } from '@playwright/test';

test('breathing modal opens on mobile', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  
  // Navigate
  await page.goto('/');
  
  // Wait for hero section
  await page.waitForSelector('.nb-hero-yellow-btn', { timeout: 10000 });
  
  // Wait for any animations to settle
  await page.waitForTimeout(2000);
  
  //Take screenshot before click
  await page.screenshot({
    path: 'tests/screenshots/before-modal.png',
  });
  
  // Click the button - force if needed
  await page.click('.nb-hero-yellow-btn', { force: true });
  
  // Wait a moment
  await page.waitForTimeout(2000);
  
  // Take screenshot after click
  await page.screenshot({
    path: 'tests/screenshots/after-modal-click.png',
  });
  
  // Look for modal indicators
  const hasDialog = await page.locator('[role="dialog"]').count();
  const hasTitle = await page.locator('text=Choose a breathing technique').count();
  const hasOverlay = await page.locator('[data-testid="breathing-technique-modal"]').count();
  
  console.log(`Dialog count: ${hasDialog}`);
  console.log(`Title count: ${hasTitle}`);
  console.log(`Overlay count: ${hasOverlay}`);
  
  // At least one should be present
  expect(hasDialog + hasTitle + hasOverlay).toBeGreaterThan(0);
});
