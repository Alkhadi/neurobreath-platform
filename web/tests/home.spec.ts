import { test, expect } from '@playwright/test';

test.describe('Homepage (mobile)', () => {
	test('hero renders, main CTA visible, no horizontal overflow', async ({ page }) => {
		await page.setViewportSize({ width: 320, height: 568 });
		await page.goto('/uk');

		await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
			await expect(
				page
					.getByLabel('NeuroBreath homepage hero')
					.getByRole('link', { name: 'Help me choose', exact: true })
			).toBeVisible();

		const hasHorizontalOverflow = await page.evaluate(() => {
			const doc = document.documentElement;
			return doc.scrollWidth > doc.clientWidth;
		});
		expect(hasHorizontalOverflow).toBeFalsy();
	});
});
