import fs from 'node:fs/promises'
import path from 'node:path'

import lighthouse from 'lighthouse'
import type { Config, Flags } from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

import { withLocalServer } from './utils/local-server'

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'tools', path: '/tools' },
  { name: 'hub-conditions-uk', path: '/uk/conditions' },
  { name: 'settings', path: '/settings' },
  { name: 'adhd-tools', path: '/tools/adhd-tools' },
]

type Profile = 'mobile' | 'desktop'

function slugify(input: string) {
  return input.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()
}

async function runOnce(url: string, profile: Profile) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  })

  try {
    const options: Flags = {
      logLevel: 'info',
      output: ['json', 'html'],
      port: chrome.port,
    }

    const config: Config = {
      extends: 'lighthouse:default',
      settings: {
        formFactor: profile,
        screenEmulation:
          profile === 'mobile'
            ? {
                mobile: true,
                width: 390,
                height: 844,
                deviceScaleFactor: 2,
                disabled: false,
              }
            : {
                mobile: false,
                width: 1440,
                height: 900,
                deviceScaleFactor: 1,
                disabled: false,
              },
        throttlingMethod: 'simulate',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
      },
    }

    const runnerResult = await lighthouse(url, options, config)
    if (!runnerResult) throw new Error('Lighthouse returned no result')

    const lhr = runnerResult.lhr
    const reportJson = runnerResult.report[0]
    const reportHtml = runnerResult.report[1]

    return { lhr, reportJson, reportHtml }
  } finally {
    await chrome.kill()
  }
}

async function main() {
  await withLocalServer(async (baseURL) => {
    const outDir = path.resolve(process.cwd(), 'reports', 'lighthouse')
    await fs.mkdir(outDir, { recursive: true })

    const summary: Array<{
      profile: Profile
      page: string
      url: string
      performance: number
      accessibility: number
      bestPractices: number
      seo: number
      html: string
      json: string
    }> = []

    for (const profile of ['mobile', 'desktop'] as const) {
      const profileDir = path.join(outDir, profile)
      await fs.mkdir(profileDir, { recursive: true })

      for (const page of PAGES) {
        const url = `${baseURL}${page.path}`
        // eslint-disable-next-line no-console
        console.log(`[perf:lighthouse] ${profile} ${url}`)

        const { lhr, reportJson, reportHtml } = await runOnce(url, profile)

        const baseName = `${slugify(page.name)}__${slugify(page.path === '/' ? 'root' : page.path)}`
        const jsonPath = path.join(profileDir, `${baseName}.json`)
        const htmlPath = path.join(profileDir, `${baseName}.html`)

        await fs.writeFile(jsonPath, reportJson, 'utf8')
        await fs.writeFile(htmlPath, reportHtml, 'utf8')

        summary.push({
          profile,
          page: page.path,
          url,
          performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
          accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
          bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
          seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
          html: path.relative(process.cwd(), htmlPath),
          json: path.relative(process.cwd(), jsonPath),
        })
      }
    }

    const summaryPath = path.join(outDir, 'summary.json')
    await fs.writeFile(summaryPath, JSON.stringify({ generatedAt: new Date().toISOString(), baseURL, summary }, null, 2) + '\n', 'utf8')

    // eslint-disable-next-line no-console
    console.log(`[perf:lighthouse] Done. Summary: reports/lighthouse/summary.json`)
  })
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[perf:lighthouse] Error:', err)
  process.exit(1)
})
