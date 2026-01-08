/**
 * Identify Specific Overflowing Element
 */

import { test } from '@playwright/test';

test('identify exact overflow source', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.waitForTimeout(2000);
  
  // Add CSS to visualize
  await page.addStyleTag({
    content: `
      * {
        outline: 1px solid rgba(255, 0, 0, 0.1) !important;
      }
      *:hover {
        outline: 2px solid rgba(255, 0, 0, 0.5) !important;
      }
    `
  });
  
  // Get detailed element info
  const overflowing = await page.evaluate(() => {
    const vw = window.innerWidth;
    const results: any[] = [];
    
    document.querySelectorAll('*').forEach((el: any) => {
      const rect = el.getBoundingClientRect();
      if (rect.width > vw) {
        const styles = window.getComputedStyle(el);
        results.push({
          tag: el.tagName,
          id: el.id || 'no-id',
          classes: el.className.toString(),
          width: Math.round(rect.width),
          text: el.textContent?.substring(0, 50) || '',
          overflow: styles.overflow,
          overflowX: styles.overflowX,
          display: styles.display,
        });
      }
    });
    
    return results.sort((a, b) => a.width - b.width).slice(0, 5);
  });
  
  console.log('OVERFLOWING ELEMENTS:', JSON.stringify(overflowing, null, 2));
  
  await page.screenshot({
    path: 'tests/screenshots/overflow-debug-320.png',
    fullPage: true,
  });
});
