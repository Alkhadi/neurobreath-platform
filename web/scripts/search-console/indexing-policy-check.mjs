import path from 'path';
import { fileURLToPath } from 'url';
import { fetchText, parseSitemapUrls, writeReport } from '../seo/sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// This check is meant to prevent *non-indexable utility pages* from leaking into sitemaps.
// It should not require a brittle allowlist of every legitimate content route.
const NON_INDEXABLE_PREFIXES = [
  '/api',
  '/parent',
  '/progress',
  '/send-report',
  '/teacher',
  '/login',
  '/register',
  '/my-account',
  '/change-password',
  '/password-reset',
  '/_next',
  '/admin',
  '/auth',
  '/rewards',
  '/demo',
];

const stripLocale = pathname => pathname.replace(/^\/(uk|us)(?=\/|$)/, '') || '/';

function isIndexable(pathname) {
  const cleaned = stripLocale(pathname);
  if (NON_INDEXABLE_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) return false;
  return true;
}

const ukResponse = await fetchText(`${baseUrl}/sitemap-uk.xml`);
const usResponse = await fetchText(`${baseUrl}/sitemap-us.xml`);
const ukUrls = ukResponse.ok ? parseSitemapUrls(ukResponse.text) : [];
const usUrls = usResponse.ok ? parseSitemapUrls(usResponse.text) : [];
const urls = Array.from(new Set([...ukUrls, ...usUrls]));

const critical = [];
const warnings = [];

urls.forEach(url => {
  const pathname = new URL(url).pathname;
  if (!isIndexable(pathname)) {
    critical.push(`Non-indexable URL found in sitemap: ${url}`);
  }
});

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  counts: {
    urlsChecked: urls.length,
    critical: critical.length,
    warnings: warnings.length,
  },
  critical,
  warnings,
};

const reportMd = `# Indexing policy check\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\n## Summary\n- URLs checked: ${reportJson.counts.urlsChecked}\n- Critical: ${reportJson.counts.critical}\n- Warnings: ${reportJson.counts.warnings}\n\n## Critical issues\n${critical.length ? critical.map(item => `- ${item}`).join('\n') : '- None'}\n\n## Warnings\n${warnings.length ? warnings.map(item => `- ${item}`).join('\n') : '- None'}\n`;

await writeReport(path.join(projectRoot, 'reports', 'search-console', 'indexing-policy-check.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'search-console', 'indexing-policy-check.md'), reportMd);

if (critical.length) {
  process.exit(1);
}
