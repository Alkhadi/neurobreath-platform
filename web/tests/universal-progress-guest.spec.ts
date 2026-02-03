import { expect, test } from '@playwright/test'

async function seedConsent(page: import('@playwright/test').Page, functional: boolean) {
  await page.addInitScript((value) => {
    try {
      const seededKey = 'nb_test_seeded_consent'
      if (window.sessionStorage.getItem(seededKey) === '1') return
      window.sessionStorage.setItem(seededKey, '1')

      window.localStorage.setItem(
        'nb_consent_prefs',
        JSON.stringify({
          essential: true,
          functional: value,
          analytics: false,
          timestamp: Date.now(),
          version: '1.0',
        })
      )
      window.localStorage.removeItem('nb_progress_v1')
    } catch {
      // ignore
    }
  }, functional)
}

async function completeMuscleRelaxationViaSkips(page: import('@playwright/test').Page) {
  // The Stress Tools page includes the Progressive Muscle Relaxation card.
  const pmrTab = page.getByRole('tab', { name: /muscle relaxation/i })
  if (!(await pmrTab.isVisible().catch(() => false))) {
    await page.locator('#interactive-tools').scrollIntoViewIfNeeded().catch(() => null)
  }
  await pmrTab.click()

  await page.getByRole('button', { name: /begin session/i }).click()

  // Skip through all steps quickly.
  const skip = page.getByRole('button', { name: /^skip$/i })
  for (let i = 0; i < 20; i++) {
    if (!(await skip.isVisible().catch(() => false))) break
    await skip.click()
  }

  await expect(page.getByRole('heading', { name: /session complete/i })).toBeVisible()
}

async function openMuscleRelaxationTab(page: import('@playwright/test').Page) {
  const pmrTab = page.getByRole('tab', { name: /muscle relaxation/i })
  if (!(await pmrTab.isVisible().catch(() => false))) {
    await page.locator('#interactive-tools').scrollIntoViewIfNeeded().catch(() => null)
  }
  await pmrTab.click()
}

test.describe('Universal progress (guest)', () => {
  test('decline consent => progress not persisted after reload', async ({ page }) => {
    await seedConsent(page, false)
    await page.goto('/tools/stress-tools')

    await completeMuscleRelaxationViaSkips(page)

    await page.reload()

    await openMuscleRelaxationTab(page)

    await expect(page.getByTestId('nb-universal-progress-completed-badge')).toHaveCount(0)
  })

  test('accept consent => progress persists after reload (localStorage)', async ({ page }) => {
    await seedConsent(page, true)
    await page.goto('/tools/stress-tools')

    await completeMuscleRelaxationViaSkips(page)

    await page.reload()

    await openMuscleRelaxationTab(page)

    await expect(page.getByTestId('nb-universal-progress-completed-badge')).toBeVisible({ timeout: 10_000 })
  })
})
