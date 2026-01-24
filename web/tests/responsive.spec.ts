import { expect, test } from '@playwright/test'

const VIEWPORTS = [
  { name: 'small-phone', width: 360, height: 740 },
  { name: 'iphone-12-class', width: 390, height: 844 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'large', width: 1920, height: 1080 },
  { name: 'tesla-like', width: 1100, height: 800 },
  { name: 'foldable-folded', width: 673, height: 841 },
  { name: 'foldable-unfolded', width: 1346, height: 841 },
] as const

const KEY_PAGES = ['/', '/settings', '/uk/conditions', '/tools']

async function assertNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(() => {
    const root = document.documentElement
    const innerWidth = window.innerWidth
    const scrollWidth = root.scrollWidth

    if (scrollWidth <= innerWidth + 1) {
      return null
    }

    const candidates = Array.from(document.querySelectorAll<HTMLElement>('body *'))
    let worst: {
      tag: string
      id: string | null
      className: string | null
      right: number
      left: number
      width: number
    } | null = null

    for (const el of candidates) {
      const rect = el.getBoundingClientRect()
      if (!rect || rect.width === 0 || rect.height === 0) continue

      const right = rect.right
      if (right <= innerWidth + 1) continue

      if (!worst || right > worst.right) {
        worst = {
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className ? String(el.className).slice(0, 120) : null,
          right,
          left: rect.left,
          width: rect.width,
        }
      }
    }

    return { innerWidth, scrollWidth, worst }
  })

  expect(overflow).toBeNull()
}

test.describe('Responsive layout guardrails', () => {
  for (const vp of VIEWPORTS) {
    test.describe(vp.name, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } })

      for (const url of KEY_PAGES) {
        test(`no horizontal overflow: ${url}`, async ({ page }) => {
          await page.goto(url)
          await assertNoHorizontalOverflow(page)
        })
      }
    })
  }
})

test.describe('Mega nav positioning (Tesla regression)', () => {
  test.use({ viewport: { width: 1100, height: 800 } })

  test('Conditions dropdown stays within viewport', async ({ page }) => {
    await page.goto('/settings')

    const trigger = page.getByRole('button', { name: /conditions/i })
    await trigger.click()

    const menu = page.locator('.nb-mega-menu--floating')
    await expect(menu).toBeVisible()

    const box = await menu.boundingBox()
    expect(box).toBeTruthy()

    if (box) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(1100)
      expect(box.y + box.height).toBeLessThanOrEqual(800)
    }

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
  })
})
