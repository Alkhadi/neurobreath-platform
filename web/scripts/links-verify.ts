import fs from 'node:fs/promises'
import path from 'node:path'

import { chromium } from '@playwright/test'

import { expandRoutePattern, loadRouteInventory } from '@/lib/seo/route-registry'

type LinkCheck = {
  url: string
  status: number | 'timeout' | 'error'
  ok: boolean
}

type LinksVerifyReport = {
  startedAt: string
  baseURL: string
  summary: {
    totalChecked: number
    ok: number
    failed: number
    invalidHrefCount: number
    routeInventoryTotal: number
    routeInventoryExpanded: number
    discoveredFromDom: number
  }
  invalidHrefs: string[]
  failures: LinkCheck[]
  checks: LinkCheck[]
}

const DEFAULT_BASE_URL = 'http://localhost:3000'

const NAV_DISCOVERY_PAGES = ['/', '/settings']

function applyConsentSeed(page: import('@playwright/test').Page) {
  return page.addInitScript(() => {
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
    } catch {
      // ignore
    }
  })
}

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items))
}

function normalizeInternalPath(href: string): string | null {
  if (!href) return null
  const trimmed = href.trim()
  if (!trimmed) return null
  if (trimmed === '#') return '#'

  // Absolute URL pointing at same origin still counts
  try {
    const asUrl = new URL(trimmed, DEFAULT_BASE_URL)
    if (asUrl.origin !== new URL(DEFAULT_BASE_URL).origin) {
      return null
    }
    return asUrl.pathname + asUrl.search + asUrl.hash
  } catch {
    return null
  }
}

async function checkUrl(url: string, timeoutMs = 12_000): Promise<LinkCheck> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const head = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    }).catch(() => null)

    const response = head ?? (await fetch(url, { method: 'GET', redirect: 'follow', signal: controller.signal }))
    const ok = response.status >= 200 && response.status < 400

    return { url, status: response.status, ok }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    const status = message.toLowerCase().includes('abort') ? 'timeout' : 'error'
    return { url, status, ok: false }
  } finally {
    clearTimeout(timeoutId)
  }
}

async function discoverInternalLinksFromDom(baseURL: string): Promise<{ links: string[]; invalidHrefs: string[] }> {
  const browser = await chromium.launch()
  const page = await browser.newPage({ baseURL })

  await applyConsentSeed(page)

  const invalidHrefs: string[] = []
  const internalPaths = new Set<string>()

  const collectAnchors = async () => {
    const hrefs = await page.$$eval('a[href]', (els) => els.map((a) => (a as HTMLAnchorElement).getAttribute('href') || ''))

    for (const raw of hrefs) {
      const normalized = normalizeInternalPath(raw)
      if (!normalized) continue
      if (normalized === '#') {
        invalidHrefs.push(raw)
        continue
      }
      if (normalized.startsWith('/')) internalPaths.add(normalized)
    }
  }

  try {
    for (const url of NAV_DISCOVERY_PAGES) {
      await page.goto(url, { waitUntil: 'domcontentloaded' })
      await collectAnchors()

      // Open mega menus to reveal their links
      for (const name of ['Conditions', 'Breathing & Focus', 'Tools', 'Resources']) {
        const trigger = page.getByRole('button', { name: new RegExp(`^${name}$`, 'i') })
        if (await trigger.count()) {
          await trigger.first().click()
          await page.waitForTimeout(100)
          await collectAnchors()
          await page.keyboard.press('Escape')
        }
      }
    }
  } finally {
    await page.close()
    await browser.close()
  }

  return { links: Array.from(internalPaths), invalidHrefs: uniq(invalidHrefs) }
}

async function getInternalUrlsFromRouteInventory(): Promise<{ urls: string[]; total: number; expanded: number }> {
  const { routes } = await loadRouteInventory()

  const out: string[] = []
  let expanded = 0

  for (const r of routes) {
    if (!r.isDynamic) {
      out.push(r.url)
      continue
    }

    const fixtures = expandRoutePattern(r.pattern)
    if (fixtures.length) {
      expanded += fixtures.length
      out.push(...fixtures)
    }
  }

  return { urls: uniq(out), total: routes.length, expanded }
}

async function main() {
  const baseURL = (process.env.BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '')
  const startedAt = new Date().toISOString()

  const [{ urls: inventoryUrls, total: inventoryTotal, expanded: inventoryExpanded }, dom] = await Promise.all([
    getInternalUrlsFromRouteInventory(),
    discoverInternalLinksFromDom(baseURL),
  ])

  const invalidHrefs = dom.invalidHrefs

  const internalPaths = uniq([
    ...inventoryUrls,
    ...dom.links,
    // sanity endpoints
    '/robots.txt',
    '/sitemap.xml',
  ])
    .filter((p) => p.startsWith('/'))
    .filter((p) => !p.includes(':'))

  // Basic concurrency without extra deps
  const checks: LinkCheck[] = []
  const failures: LinkCheck[] = []
  const queue = internalPaths.map((p) => `${baseURL}${p}`)
  const CONCURRENCY = 8

  let idx = 0
  async function worker() {
    while (idx < queue.length) {
      const current = queue[idx++]
      const result = await checkUrl(current)
      checks.push(result)
      if (!result.ok) failures.push(result)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

  const report: LinksVerifyReport = {
    startedAt,
    baseURL,
    summary: {
      totalChecked: checks.length,
      ok: checks.filter((c) => c.ok).length,
      failed: failures.length,
      invalidHrefCount: invalidHrefs.length,
      routeInventoryTotal: inventoryTotal,
      routeInventoryExpanded: inventoryExpanded,
      discoveredFromDom: dom.links.length,
    },
    invalidHrefs,
    failures,
    checks,
  }

  const reportDir = path.resolve(process.cwd(), 'reports')
  await fs.mkdir(reportDir, { recursive: true })
  await fs.writeFile(path.join(reportDir, 'links-verification.json'), JSON.stringify(report, null, 2) + '\n', 'utf8')

  // eslint-disable-next-line no-console
  console.log(`[links:verify] Checked ${report.summary.totalChecked} URLs (${report.summary.failed} failed). Report: reports/links-verification.json`)

  if (invalidHrefs.length > 0) {
    // eslint-disable-next-line no-console
    console.error(`[links:verify] Found invalid hrefs ("#" or empty) in DOM: ${invalidHrefs.join(', ')}`)
    process.exit(1)
  }

  if (failures.length > 0) {
    // eslint-disable-next-line no-console
    console.error('[links:verify] Failed URLs:')
    failures.slice(0, 30).forEach((f) => {
      // eslint-disable-next-line no-console
      console.error(` - ${f.url} (${f.status})`)
    })
    if (failures.length > 30) {
      // eslint-disable-next-line no-console
      console.error(` ...and ${failures.length - 30} more`)
    }
    process.exit(1)
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[links:verify] Error:', err)
  process.exit(1)
})
