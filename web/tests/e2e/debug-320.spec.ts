/**
 * Debug Test for 320px Viewport
 * 
 * Investigates horizontal scroll issue
 */

import { test, expect } from '@playwright/test';

test('debug 320px horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  
  // Navigate
  await page.goto('/');
  
  // Measure before modal
  const scrollWidthBefore = await page.evaluate(() => document.documentElement.scrollWidth);
  const bodyWidthBefore = await page.evaluate(() => document.body.scrollWidth);
  
  console.log(`Before modal - document.scrollWidth: ${scrollWidthBefore}, body.scrollWidth: ${bodyWidthBefore}`);
  
  // Take screenshot before modal
  await page.screenshot({ path: 'tests/screenshots/debug-before-modal-320.png' });
  
  // Wait and click
  await page.waitForSelector('.nb-hero-yellow-btn');
  await page.waitForTimeout(1000);
  await page.click('.nb-hero-yellow-btn', { force: true });
  
  // Wait for modal
  await page.waitForTimeout(1500);
  
  // Measure after modal
  const scrollWidthAfter = await page.evaluate(() => document.documentElement.scrollWidth);
  const bodyWidthAfter = await page.evaluate(() => document.body.scrollWidth);
  
  console.log(`After modal - document.scrollWidth: ${scrollWidthAfter}, body.scrollWidth: ${bodyWidthAfter}`);
  
  // Find what's causing overflow
  const overflowingElements = await page.evaluate(() => {
    const elements: Array<{tag: string; class: string; width: number}> = [];
    document.querySelectorAll('*').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 320) {
        elements.push({
          tag: el.tagName,
          class: el.className.toString().substring(0, 100),
          width: Math.round(rect.width),
        });
      }
    });
    return elements.slice(0, 10); // Top 10 widest
  });
  
  console.log('Elements wider than 320px:', JSON.stringify(overflowingElements, null, 2));
  
  // Take screenshot after modal
  await page.screenshot({ path: 'tests/screenshots/debug-after-modal-320.png', fullPage: true });
});
