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

async function setProgressSaving(page: import('@playwright/test').Page, enabled: boolean) {
  await page.request.post('/api/progress/consent', {
    data: { enabled },
    headers: { 'content-type': 'application/json' },
  })
}

async function hasCookie(page: import('@playwright/test').Page, name: string) {
  const cookies = await page.context().cookies()
  return cookies.some((c) => c.name === name)
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
  test('first progress action prompts; decline => no persistence and no re-prompt', async ({ page }) => {
    await seedConsent(page, true)
    await page.goto('/tools/stress-tools')

    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toHaveCount(0)

    await completeMuscleRelaxationViaSkips(page)

    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue without saving' }).click()
    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toHaveCount(0)

    await expect.poll(async () => await hasCookie(page, 'nb_device_id')).toBeTruthy()

    await page.reload()
    await completeMuscleRelaxationViaSkips(page)

    // Consent cookie is now explicitly declined; do not re-prompt.
    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toHaveCount(0)

    await page.reload()
    await openMuscleRelaxationTab(page)
    await expect(page.getByTestId('nb-universal-progress-completed-badge')).toHaveCount(0)
  })

  test('enable saving => progress persists after reload (localStorage)', async ({ page }) => {
    await seedConsent(page, true)
    await setProgressSaving(page, true)
    await page.goto('/tools/stress-tools')

    await expect.poll(async () => await hasCookie(page, 'nb_progress_consent')).toBeTruthy()
    await expect.poll(async () => await hasCookie(page, 'nb_device_id')).toBeTruthy()

    await completeMuscleRelaxationViaSkips(page)

    await page.reload()
    await openMuscleRelaxationTab(page)

    await expect(page.getByTestId('nb-universal-progress-completed-badge')).toBeVisible({ timeout: 10_000 })
  })

  test('decline then enable via notice => progress persists', async ({ page }) => {
    await seedConsent(page, true)
    await page.goto('/tools/stress-tools')

    await completeMuscleRelaxationViaSkips(page)
    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toBeVisible()
    await page.getByRole('button', { name: 'Continue without saving' }).click()

    await expect.poll(async () => await hasCookie(page, 'nb_device_id')).toBeTruthy()

    await page.reload()
    await completeMuscleRelaxationViaSkips(page)

    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toHaveCount(0)
    await page.getByRole('button', { name: 'Enable saving' }).click()
    await expect(page.getByRole('heading', { name: 'Save your progress?' })).toBeVisible()
    await page.getByRole('dialog').getByRole('button', { name: 'Enable saving' }).click()

    await expect.poll(async () => await hasCookie(page, 'nb_device_id')).toBeTruthy()

    await page.reload()
    await openMuscleRelaxationTab(page)
    await expect(page.getByTestId('nb-universal-progress-completed-badge')).toBeVisible({ timeout: 10_000 })
  })
})
