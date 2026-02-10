import { test, expect } from '@playwright/test'

test.describe('Focus Training CTAs', () => {
  test('Protocol buttons navigate to modern routes', async ({ page }) => {
    await page.goto('/tools/focus-training')

    const start5 = page.getByRole('link', { name: /start 5-minute/i })
    const adhdTools = page.getByRole('link', { name: /adhd tools/i })
    const anxietyTools = page.getByRole('link', { name: /anxiety tools/i })

    await expect(start5).toHaveAttribute('href', /\/techniques\/coherent\?minutes=5$/)
    await expect(adhdTools).toHaveAttribute('href', /\/tools\/adhd-tools$/)
    await expect(anxietyTools).toHaveAttribute('href', /\/tools\/anxiety-tools$/)

    await start5.click()
    await expect(page).toHaveURL(/\/techniques\/coherent\?minutes=5$/)

    await page.goto('/tools/focus-training')
    await adhdTools.click()
    await expect(page).toHaveURL(/\/tools\/adhd-tools$/)

    await page.goto('/tools/focus-training')
    await anxietyTools.click()
    await expect(page).toHaveURL(/\/tools\/anxiety-tools$/)
  })
})
