import { expect, test } from '@playwright/test'

test.describe('Auth UI wiring', () => {
  test('login controls and links work', async ({ page }) => {
    await page.goto('/uk/login')

    // Show/hide password toggles input type
    const password = page.getByLabel('Password')
    await password.fill('example-password')

    await expect(password).toHaveAttribute('type', 'password')
    await page.getByRole('button', { name: /show password/i }).click()
    await expect(password).toHaveAttribute('type', 'text')
    await page.getByRole('button', { name: /hide password/i }).click()
    await expect(password).toHaveAttribute('type', 'password')

    // Forgot password link navigates to an existing route
    await page.getByRole('link', { name: /forgot password\?/i }).click()
    await expect(page).toHaveURL(/\/uk\/password-reset/)

    // Back to login
    await page.goto('/uk/login')

    // Magic link button is not dead: shows a clear message when SMTP isn't configured
    await page.getByLabel(/email address/i).fill('test@example.com')
    await page.getByRole('button', { name: /email me a sign-in link/i }).click()
    await expect(page.getByText(/email sign-in is not configured yet/i)).toBeVisible()

    // Create account CTA navigates to register
    await page.getByRole('button', { name: /create a free account/i }).click()
    await expect(page).toHaveURL(/\/uk\/register/)
  })
})
