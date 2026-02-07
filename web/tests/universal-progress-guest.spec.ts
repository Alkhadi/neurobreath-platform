import { expect, test } from '@playwright/test'

async function settlePage(page: import('@playwright/test').Page) {
  // Best-effort: Next.js can keep connections open in dev; don't hard-fail.
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => null)
}

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

async function ensureMuscleRelaxationPanelOpen(page: import('@playwright/test').Page) {
  const pmrTab = page.getByRole('tab', { name: /muscle relaxation/i })
  const beginSession = page.getByRole('button', { name: /begin session/i })

  await page.locator('#interactive-tools').scrollIntoViewIfNeeded().catch(() => null)
  await settlePage(page)

  // Radix Tabs can focus a tab without switching panels during hydration,
  // especially in Firefox/WebKit. Use the panel content as the readiness signal.
  await expect
    .poll(async () => {
      if (await beginSession.isVisible().catch(() => false)) return true
      await pmrTab.scrollIntoViewIfNeeded().catch(() => null)
      await pmrTab.click()
      await page.waitForTimeout(50)
      return await beginSession.isVisible().catch(() => false)
    }, { timeout: 10_000 })
    .toBeTruthy()
}

async function completeMuscleRelaxationViaSkips(page: import('@playwright/test').Page) {
  await ensureMuscleRelaxationPanelOpen(page)

  const beginSession = page.getByRole('button', { name: /begin session/i })
  await beginSession.click()

  // Skip through all steps quickly.
  const skip = page.getByRole('button', { name: /^skip$/i })
  for (let i = 0; i < 20; i++) {
    if (!(await skip.isVisible().catch(() => false))) break
    await skip.click()
  }

  await expect(page.getByRole('heading', { name: /session complete/i })).toBeVisible()
}

async function openMuscleRelaxationTab(page: import('@playwright/test').Page) {
  await ensureMuscleRelaxationPanelOpen(page)
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

    const consentPost = page
      .waitForResponse(
        (res) => res.url().includes('/api/progress/consent') && res.request().method() === 'POST' && res.ok(),
        { timeout: 10_000 }
      )
      .catch(() => null)

    await page.getByRole('dialog').getByRole('button', { name: 'Enable saving' }).click()
    await consentPost

    // Ensure consent has been persisted before reloading (avoids racing async handler).
    await expect.poll(async () => await hasCookie(page, 'nb_progress_consent')).toBeTruthy()
    await page.waitForFunction(() => !!localStorage.getItem('nb_progress_v1')).catch(() => null)

    await expect.poll(async () => await hasCookie(page, 'nb_device_id')).toBeTruthy()

    await page.reload()
    await openMuscleRelaxationTab(page)
    await expect(page.getByTestId('nb-universal-progress-completed-badge')).toBeVisible({ timeout: 15_000 })
  })
})
