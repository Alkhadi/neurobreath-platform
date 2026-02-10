import { expect, test } from '@playwright/test'

async function dismissCookieBannerIfPresent(page: import('@playwright/test').Page) {
  const dialog = page.getByRole('dialog', { name: /we value your privacy/i })
  if (await dialog.count()) {
    const reject = dialog.getByRole('button', { name: /reject all/i })
    if (await reject.isVisible().catch(() => false)) {
      await reject.click()
      await expect(dialog).toBeHidden()
    }
  }
}

test.describe('Navigation integrity', () => {
  test.describe('desktop', () => {
    test.use({ viewport: { width: 1440, height: 900 } })

    test('top-level links and mega menus navigate', async ({ page }) => {
    await page.goto('/settings')
    await dismissCookieBannerIfPresent(page)
    await expect(page.locator('.nb-header')).toBeVisible()

    // Mega menus -> click a representative link from each
    const megaSamples = [
      { id: 'conditions', trigger: 'Conditions', linkText: '🧩 Autism', urlRe: /\/conditions\/autism/ },
      { id: 'breathing', trigger: 'Breathing & Focus', linkText: '🫁 Breath (how-to)', urlRe: /\/breathing\/breath/ },
      { id: 'tools', trigger: 'Tools', linkText: '🎯 ADHD Tools', urlRe: /\/tools\/adhd-tools/ },
      { id: 'resources', trigger: 'Resources', linkText: '✉️ Contact', urlRe: /\/contact/ },
    ]

    for (const sample of megaSamples) {
      await page.goto('/settings')
      await dismissCookieBannerIfPresent(page)
      const trigger = page.getByRole('button', { name: new RegExp(`^${sample.trigger}$`, 'i') })
      await trigger.click()

      const menu = page.locator('.nb-mega-menu--floating')
      await expect(menu).toBeVisible()
      await menu.getByRole('link', { name: sample.linkText, exact: true }).click()

      await expect(page).toHaveURL(sample.urlRe)
      await expect(page.getByRole('main').first()).toBeVisible()
    }

    // Direct links
    const directLinks = [
      { name: '📊 Progress', urlRe: /\/progress/ },
      { name: '📋 My Plan', urlRe: /\/my-plan/ },
      { name: '⚙️ Settings', urlRe: /\/settings/ },
    ]

    for (const link of directLinks) {
      await page.goto('/settings')
      await dismissCookieBannerIfPresent(page)
      await page.getByRole('link', { name: link.name, exact: true }).click()
      await expect(page).toHaveURL(link.urlRe)
      await expect(page.getByRole('main').first()).toBeVisible()
    }
    })
  })

  test.describe('mobile', () => {
    test.use({ viewport: { width: 360, height: 740 } })

    test('drawer traps focus and ESC closes', async ({ page }) => {
    await page.goto('/settings')
    await dismissCookieBannerIfPresent(page)
    await expect(page.locator('.nb-header')).toBeVisible()

    const toggle = page.locator('.nb-mobile-toggle').first()
    await toggle.click()
    const nav = page.locator('#mainNav')
    await expect(nav).toHaveClass(/nb-main-nav--open/)

    // Tab around: focus should remain inside the nav
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab')
      const focusedInside = await page.evaluate(() => {
        const navEl = document.getElementById('mainNav')
        const active = document.activeElement
        return !!(navEl && active && navEl.contains(active))
      })
      expect(focusedInside).toBeTruthy()
    }

    await page.keyboard.press('Escape')
    await expect(nav).not.toHaveClass(/nb-main-nav--open/)

    // Focus returns to the toggle (label may have swapped to Close menu)
    const toggleAfter = page.locator('.nb-mobile-toggle').first()
    await expect(toggleAfter).toBeFocused()
    })
  })
})
