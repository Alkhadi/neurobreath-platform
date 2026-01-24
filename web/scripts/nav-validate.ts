import fs from 'node:fs/promises'
import path from 'node:path'

import { loadRouteInventory, expandRoutePattern } from '@/lib/seo/route-registry'

type NavValidateReport = {
  startedAt: string
  summary: {
    navHrefCount: number
    expandedHrefCount: number
    routeInventoryTotal: number
    routeInventoryExpanded: number
    missingCount: number
  }
  missing: string[]
  checked: string[]
}

const NAV_HREFS = [
  // Mega menu links
  '/conditions/autism',
  '/conditions/autism-parent',
  '/conditions/autism-teacher',
  '/conditions/autism-carer',
  '/adhd',
  '/conditions/adhd-parent',
  '/conditions/adhd-teacher',
  '/conditions/adhd-carer',
  '/conditions/dyslexia',
  '/conditions/dyslexia-parent',
  '/conditions/dyslexia-teacher',
  '/conditions/dyslexia-carer',
  '/dyslexia-reading-training',
  '/conditions/anxiety',
  '/conditions/anxiety-parent',
  '/conditions/anxiety-carer',
  '/conditions/depression',
  '/conditions/bipolar',
  '/conditions/ptsd',
  '/stress',
  '/sleep',
  '/conditions/low-mood-burnout',

  '/breathing/breath',
  '/breathing/focus',
  '/breathing/mindfulness',
  '/techniques/sos',
  '/techniques/box-breathing',
  '/techniques/4-7-8',
  '/techniques/coherent',
  '/breathing/training/focus-garden',

  '/tools/adhd-tools',
  '/tools/autism-tools',
  '/tools/anxiety-tools',
  '/tools/stress-tools',
  '/tools/depression-tools',
  '/tools/breath-tools',
  '/tools/mood-tools',
  '/tools/sleep-tools',
  '/tools/breath-ladder',
  '/tools/colour-path',
  '/tools/focus-tiles',
  '/tools/roulette',

  '/schools',
  '/teacher-quick-pack',
  '/downloads',
  '/resources',
  '/:region/about',
  '/:region/trust',
  '/blog',
  '/contact',

  // Top-level nav links
  '/progress',
  '/my-plan',
  '/settings',

  // Auth + CTA
  '/uk/login',
  '/uk/my-account',
  '/get-started',
]

function uniq(items: string[]) {
  return Array.from(new Set(items))
}

function expandRegion(href: string): string[] {
  if (!href.includes(':region')) return [href]
  return [href.replace(':region', 'uk'), href.replace(':region', 'us')]
}

async function main() {
  const startedAt = new Date().toISOString()

  const expandedHrefs = uniq(NAV_HREFS.flatMap(expandRegion)).filter((h) => h.startsWith('/'))

  const { routes } = await loadRouteInventory()

  const routeUrls: string[] = []
  let expanded = 0

  for (const r of routes) {
    if (!r.isDynamic) {
      routeUrls.push(r.url)
      continue
    }

    const fixtures = expandRoutePattern(r.pattern)
    if (fixtures.length) {
      expanded += fixtures.length
      routeUrls.push(...fixtures)
    }
  }

  const known = new Set(routeUrls)

  const missing = expandedHrefs.filter((href) => !known.has(href))

  const report: NavValidateReport = {
    startedAt,
    summary: {
      navHrefCount: NAV_HREFS.length,
      expandedHrefCount: expandedHrefs.length,
      routeInventoryTotal: routes.length,
      routeInventoryExpanded: expanded,
      missingCount: missing.length,
    },
    missing,
    checked: expandedHrefs,
  }

  const outDir = path.resolve(process.cwd(), 'reports')
  await fs.mkdir(outDir, { recursive: true })
  await fs.writeFile(path.join(outDir, 'nav-validation.json'), JSON.stringify(report, null, 2) + '\n', 'utf8')

  // eslint-disable-next-line no-console
  console.log(`[nav:validate] Checked ${expandedHrefs.length} nav hrefs. Missing: ${missing.length}. Report: reports/nav-validation.json`)

  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error('[nav:validate] Missing routes:')
    missing.slice(0, 50).forEach((m) => {
      // eslint-disable-next-line no-console
      console.error(` - ${m}`)
    })
    process.exit(1)
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[nav:validate] Error:', err)
  process.exit(1)
})
