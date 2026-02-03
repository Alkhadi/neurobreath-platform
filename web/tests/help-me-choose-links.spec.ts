import { test, expect } from '@playwright/test'

test.describe('Help-me-choose (tailored plan) links', () => {
  test('Results use modern internal routes and valid landmarks', async ({ page }) => {
    await page.goto('/uk/help-me-choose')

    await page.getByRole('button', { name: /^For me$/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /focus\s*\/\s*attention/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /^Home$/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /short routine/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /mix of tools and guides/i }).click()
    await page.getByRole('button', { name: /continue/i }).click()

    await page.getByRole('button', { name: /^ADHD$/i }).click()
    await page.getByRole('button', { name: /see my plan/i }).click()

    await expect(page).toHaveURL(/\/uk\/help-me-choose\/results$/)

    await expect(page.locator('a[href^="/legacy-assets/"]')).toHaveCount(0)

    const focusTraining = page.getByRole('link', { name: /focus training/i }).first()
    await expect(focusTraining).toHaveAttribute('href', /\/tools\/focus-training$/)

    await expect(page.locator('main')).toHaveCount(1)
  })
})
