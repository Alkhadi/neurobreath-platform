import { test, expect } from '@playwright/test';

test.describe('Install page', () => {
  test('renders install instructions and QR section', async ({ page }) => {
    await page.goto('/install');

    await expect(page.getByRole('heading', { name: 'Install NeuroBreath' })).toBeVisible();
    await expect(page.getByText('iPhone / iPad (Safari)')).toBeVisible();
    await expect(page.getByText('Android (Chrome)')).toBeVisible();
    await expect(page.getByText('Desktop (Chrome / Edge)')).toBeVisible();
    await expect(page.getByText('QR code')).toBeVisible();

    // The page prints the computed app URL (origin + /uk).
    await expect(page.getByText(/\/uk\b/)).toBeVisible();
  });
});
