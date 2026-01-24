import fs from 'node:fs/promises'
import path from 'node:path'

import { chromium } from '@playwright/test'

const DEFAULT_BASE_URL = 'http://localhost:3000'

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

const PAGES = ['/', '/settings', '/uk/conditions', '/tools']

type ScanResult = {
  viewport: string
  page: string
  scrollWidth: number
  innerWidth: number
  overflowPx: number
  ok: boolean
  screenshotPath?: string
}

async function main() {
  const baseURL = (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
  const outDir = path.resolve(process.cwd(), 'reports', 'responsive')
  await fs.mkdir(outDir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ baseURL })

  const results: ScanResult[] = []

  try {
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      for (const url of PAGES) {
        await page.goto(url, { waitUntil: 'domcontentloaded' })

        const metrics = await page.evaluate(() => {
          const root = document.documentElement
          return {
            scrollWidth: root.scrollWidth,
            innerWidth: window.innerWidth,
          }
        })

        const overflowPx = Math.max(0, Math.round(metrics.scrollWidth - metrics.innerWidth))
        const ok = overflowPx <= 1

        const safeName = url === '/' ? 'home' : url.replace(/^\//, '').replace(/\//g, '_')
        const shot = path.join(outDir, `${vp.name}__${safeName}.png`)
        await page.screenshot({ path: shot, fullPage: true })

        results.push({
          viewport: `${vp.width}x${vp.height} (${vp.name})`,
          page: url,
          scrollWidth: metrics.scrollWidth,
          innerWidth: metrics.innerWidth,
          overflowPx,
          ok,
          screenshotPath: path.relative(process.cwd(), shot),
        })
      }
    }
  } finally {
    await page.close()
    await browser.close()
  }

  const report = {
    startedAt: new Date().toISOString(),
    baseURL,
    results,
    failures: results.filter((r) => !r.ok),
  }

  await fs.writeFile(path.join(outDir, 'responsive-scan.json'), JSON.stringify(report, null, 2) + '\n', 'utf8')

  const failures = report.failures
  // eslint-disable-next-line no-console
  console.log(`[responsive:scan] Scanned ${results.length} page+viewport combos. Failures: ${failures.length}. Report: reports/responsive/responsive-scan.json`)

  if (failures.length) {
    failures.slice(0, 20).forEach((f) => {
      // eslint-disable-next-line no-console
      console.error(` - ${f.viewport} ${f.page} overflow ${f.overflowPx}px (scrollWidth ${f.scrollWidth}, innerWidth ${f.innerWidth})`) 
    })
    process.exit(1)
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[responsive:scan] Error:', err)
  process.exit(1)
})
