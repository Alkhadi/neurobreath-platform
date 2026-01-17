import path from 'path';
import { fileURLToPath } from 'url';
import { fetchText, parseSitemapUrls, writeReport } from '../seo/sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const INDEXABLE_PILLARS = new Set([
  '/',
  '/conditions',
  '/adhd',
  '/autism',
  '/anxiety',
  '/dyslexia-reading-training',
  '/sleep',
  '/stress',
  '/breathing',
]);

const INDEXABLE_INFO = new Set([
  '/about',
  '/about-us',
  '/contact',
  '/resources',
  '/get-started',
  '/schools',
  '/support-us',
  '/teacher-quick-pack',
]);

const INDEXABLE_TRUST_PREFIXES = ['/trust'];
const INDEXABLE_GUIDE_PREFIXES = ['/guides'];
const BLOG_PREFIXES = ['/blog'];

const INDEXABLE_TOOL_ALLOWLIST = new Set([
  '/tools',
  '/tools/adhd-tools',
  '/tools/autism-tools',
  '/tools/anxiety-tools',
  '/tools/depression-tools',
  '/tools/sleep-tools',
  '/tools/stress-tools',
  '/tools/breath-tools',
  '/breathing',
  '/breathing/breath',
  '/breathing/focus',
  '/breathing/mindfulness',
  '/breathing/techniques/sos-60',
  '/breathing/training/focus-garden',
  '/techniques/4-7-8',
  '/techniques/box-breathing',
  '/techniques/coherent',
  '/techniques/sos',
]);

const UTILITY_PREFIXES = [
  '/api',
  '/parent',
  '/progress',
  '/send-report',
  '/teacher',
  '/login',
  '/_next',
  '/admin',
  '/auth',
  '/rewards',
  '/downloads',
];

const stripLocale = pathname => pathname.replace(/^\/(uk|us)(?=\/|$)/, '') || '/';

function isIndexable(pathname) {
  const cleaned = stripLocale(pathname);
  if (UTILITY_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) return false;
  if (INDEXABLE_TRUST_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) return true;
  if (INDEXABLE_GUIDE_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) return true;
  if (BLOG_PREFIXES.some(prefix => cleaned === prefix || cleaned.startsWith(`${prefix}/`))) return true;
  if (INDEXABLE_PILLARS.has(cleaned)) return true;
  if (INDEXABLE_INFO.has(cleaned)) return true;
  if (cleaned.startsWith('/tools') || cleaned.startsWith('/breathing') || cleaned.startsWith('/techniques')) {
    return INDEXABLE_TOOL_ALLOWLIST.has(cleaned);
  }
  return false;
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
