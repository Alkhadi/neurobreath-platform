import { test, expect } from '@playwright/test';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

test.describe('Citations component', () => {
  test('citations are copy-only and support clipboard', async ({ page }) => {
    await page.addInitScript(() => {
      const store = { text: '' };

      // Expose for debugging if needed.
      (window as any).__nbClipboardStore = store;

      // WebKit projects can reject clipboard permissions; stub clipboard API instead.
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            store.text = String(text ?? '');
          },
          readText: async () => store.text,
        },
        configurable: true,
      });
    });

    await page.goto(`${BASE_URL}/uk/printables/daily-routine-planner`);

    const citationList = page.locator('[data-citation-list]');
    await expect(citationList).toBeVisible();

    const externalAnchors = citationList.locator('a[href^="http"]');
    await expect(externalAnchors).toHaveCount(0);

    const urlText = await citationList.locator('li').first().locator('p').nth(1).textContent();
    await citationList.locator('button').first().click();

    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toContain((urlText || '').trim());
  });
});
