import { test, expect } from '@playwright/test';

test.describe('Homepage (proof)', () => {
	test('defaults to UK + hero background image + CTAs visible + no horizontal overflow', async ({ page }, testInfo) => {
		await page.goto('/');
		await expect(page).toHaveURL(/\/uk(\/|$)/);

		const hero = page.getByTestId('home-hero');
		await expect(hero).toBeVisible();
		await expect(hero.getByRole('link', { name: 'Help me choose', exact: true })).toBeVisible();
			await expect(hero.locator('img[srcset*="home-section-bg.png"]').first()).toBeVisible();

		const primaryCards = page.getByTestId('home-primary-cards');
		await expect(primaryCards).toBeVisible();

		const hasHorizontalOverflow = await page.evaluate(() => {
			const doc = document.documentElement;
			return doc.scrollWidth > window.innerWidth + 1;
		});
		expect(hasHorizontalOverflow).toBeFalsy();

		const proofName =
			testInfo.project.name.includes('iPhone')
				? 'proof-home-mobile.png'
				: testInfo.project.name.includes('iPad')
					? 'proof-home-tablet.png'
					: 'proof-home-desktop.png';
		await page.screenshot({
			path: `test-results/${proofName}`,
			fullPage: false,
		});
	});
});
