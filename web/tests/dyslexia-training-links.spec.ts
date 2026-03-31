import { expect, test } from '@playwright/test'

async function seedTrainingState(page: import('@playwright/test').Page) {
  await page.addInitScript(() => {
    try {
      window.localStorage.setItem(
        'nb_consent_prefs',
        JSON.stringify({
          essential: true,
          functional: true,
          analytics: false,
          timestamp: Date.now(),
          version: '1.0',
        })
      )

      window.localStorage.setItem(
        'dyslexia_assessment_result',
        JSON.stringify({
          ageGroup: 'adult',
          scoreLevel: 'high',
          answers: {
            a1: 'often',
            a2: 'often',
            a3: 'sometimes',
            a4: 'often',
            a5: 'sometimes',
            a6: 'sometimes',
            a7: 'often',
            a8: 'often',
            a9: 'sometimes',
            a10: 'often',
          },
          categoryBreakdown: [
            { category: 'reading', pct: 80 },
            { category: 'writing', pct: 70 },
            { category: 'executive', pct: 60 },
          ],
          completedAt: '2026-03-30T12:00:00.000Z',
          totalQuestions: 10,
        })
      )
    } catch {
      // ignore
    }
  })
}

test.describe('Dyslexia training support links', () => {
  test('routine resources open the dedicated support pages', async ({ page }) => {
    await seedTrainingState(page)
    await page.goto('/conditions/dyslexia/training')

    await expect(page.getByRole('heading', { name: /my dyslexia programme/i })).toBeVisible()

    const audioLibrary = page.getByRole('link', { name: /audio & podcast library/i }).first()
    const practiceLibrary = page.getByRole('link', { name: /practice library/i }).first()

    await expect(audioLibrary).toHaveAttribute('href', /\/conditions\/dyslexia\/training\/audio-library$/)
    await expect(practiceLibrary).toHaveAttribute('href', /\/conditions\/dyslexia\/training\/practice-library$/)

    await audioLibrary.click()
    await expect(page).toHaveURL(/\/conditions\/dyslexia\/training\/audio-library$/)
    await expect(page.getByRole('heading', { name: /trusted listening support for dyslexia/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /ted talks daily/i })).toBeVisible()

    await page.goto('/conditions/dyslexia/training')
    await practiceLibrary.click()
    await expect(page).toHaveURL(/\/conditions\/dyslexia\/training\/practice-library$/)
    await expect(page.getByRole('heading', { name: /routine examples and reading support by age/i })).toBeVisible()
    await expect(page.getByText(/three-sentence start/i)).toBeVisible()
  })
})
