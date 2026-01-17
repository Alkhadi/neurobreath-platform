import path from 'path';
import { fileURLToPath } from 'url';
import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import { writeReport } from '../seo/sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const targets = {
  lcp: 2500,
  inp: 200,
  cls: 0.1,
};

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

for (const url of pages) {
  const runnerResult = await lighthouse(url, {
    port: chrome.port,
    onlyCategories: ['performance'],
    formFactor: 'mobile',
  });

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

  if (!pageResult.meetsTargets.lcp) {
    critical.push(`LCP target missed on ${url} (${lcp ? Math.round(lcp) : 'n/a'}ms)`);
  }
  if (!pageResult.meetsTargets.cls) {
    critical.push(`CLS target missed on ${url} (${cls ?? 'n/a'})`);
  }
  if (!pageResult.meetsTargets.inp) {
    critical.push(`INP target missed on ${url} (${inp ? Math.round(inp) : 'n/a'}ms)`);
  }
}

await chrome.kill();

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  targets,
  results,
  counts: {
    pages: results.length,
    critical: critical.length,
  },
  critical,
};

const reportMd = `# Core Web Vitals audit\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\n## Targets\n- LCP: < ${targets.lcp}ms\n- INP: < ${targets.inp}ms\n- CLS: < ${targets.cls}\n\n## Results\n${results
  .map(result => `- ${result.url}\n  - LCP: ${result.lcp ? Math.round(result.lcp) : 'n/a'}ms\n  - INP: ${result.inp ? Math.round(result.inp) : 'n/a'}ms\n  - CLS: ${result.cls ?? 'n/a'}`)
  .join('\n')}\n\n## Critical issues\n${critical.length ? critical.map(item => `- ${item}`).join('\n') : '- None'}\n`;

await writeReport(path.join(projectRoot, 'reports', 'search-console', 'perf-cwv.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'search-console', 'perf-cwv.md'), reportMd);

if (critical.length) {
  process.exit(1);
}
