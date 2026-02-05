import path from 'path';
import { fileURLToPath } from 'url';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeReport } from '../seo/sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const targets = {
  lcp: 2500,
  inp: 200,
  cls: 0.1,
};

const minPerformanceScore = Number.parseFloat(process.env.SEO_MIN_PERF_SCORE || '0.5');

const pages = [
  `${baseUrl}/uk`,
  `${baseUrl}/breathing`,
  `${baseUrl}/tools/breath-tools`,
  `${baseUrl}/tools/adhd-tools`,
  `${baseUrl}/adhd`,
  `${baseUrl}/autism`,
  `${baseUrl}/us/trust`,
];

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless', '--no-sandbox'],
  chromePath: process.env.CHROME_PATH || undefined,
});

const results = [];
const critical = [];
const warnings = [];

for (const url of pages) {
  let runnerResult;
  try {
    runnerResult = await lighthouse(url, {
      port: chrome.port,
      onlyCategories: ['performance'],
      formFactor: 'mobile',
    });
  } catch (error) {
    critical.push(`Lighthouse failed on ${url}: ${error?.message || String(error)}`);
    continue;
  }

  const audits = runnerResult.lhr.audits;
  const lcp = audits['largest-contentful-paint']?.numericValue ?? null;
  const cls = audits['cumulative-layout-shift']?.numericValue ?? null;
  const inp = audits['interaction-to-next-paint']?.numericValue ?? null;

  const pageResult = {
    url,
    lcp,
    cls,
    inp,
    score: runnerResult.lhr.categories.performance.score,
    meetsTargets: {
      lcp: lcp !== null ? lcp <= targets.lcp : false,
      cls: cls !== null ? cls <= targets.cls : false,
      inp: inp !== null ? inp <= targets.inp : false,
    },
  };

  results.push(pageResult);

  if (pageResult.score !== null && pageResult.score < minPerformanceScore) {
    critical.push(`Performance score below ${minPerformanceScore} on ${url} (${pageResult.score})`);
  }

  // Lighthouse navigation mode does not reliably provide INP; do not fail the gate for null.
  if (lcp !== null && lcp > targets.lcp) {
    warnings.push(`LCP above target on ${url} (${Math.round(lcp)}ms > ${targets.lcp}ms)`);
  }
  if (cls !== null && cls > targets.cls) {
    warnings.push(`CLS above target on ${url} (${cls} > ${targets.cls})`);
  }
  if (inp === null) {
    warnings.push(`INP unavailable in Lighthouse navigation audit on ${url}`);
  } else if (inp > targets.inp) {
    warnings.push(`INP above target on ${url} (${Math.round(inp)}ms > ${targets.inp}ms)`);
  }
}

await chrome.kill();

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  minPerformanceScore,
  targets,
  results,
  counts: {
    pages: results.length,
    critical: critical.length,
    warnings: warnings.length,
  },
  critical,
  warnings,
};

const reportMd = `# Core Web Vitals audit\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\n## Targets\n- Performance score: >= ${minPerformanceScore}\n- LCP: < ${targets.lcp}ms\n- INP: < ${targets.inp}ms (best-effort in Lighthouse nav mode)\n- CLS: < ${targets.cls}\n\n## Results\n${results
  .map(result => `- ${result.url}\n  - LCP: ${result.lcp ? Math.round(result.lcp) : 'n/a'}ms\n  - INP: ${result.inp ? Math.round(result.inp) : 'n/a'}ms\n  - CLS: ${result.cls ?? 'n/a'}`)
  .join('\n')}\n\n## Critical issues\n${critical.length ? critical.map(item => `- ${item}`).join('\n') : '- None'}\n`;

const reportMdWithWarnings = `${reportMd}\n\n## Warnings\n${warnings.length ? warnings.map(item => `- ${item}`).join('\n') : '- None'}\n`;

await writeReport(path.join(projectRoot, 'reports', 'search-console', 'perf-cwv.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'search-console', 'perf-cwv.md'), reportMdWithWarnings);

if (critical.length) {
  process.exit(1);
}
