import path from 'path';
import { fileURLToPath } from 'url';
import { fetchText, parseRobotsMeta, parseSitemapUrls, writeReport } from '../seo/sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const critical = [];
const warnings = [];

const robotsUrl = `${baseUrl}/robots.txt`;
const robotsResponse = await fetchText(robotsUrl);
if (!robotsResponse.ok) {
  critical.push(`robots.txt fetch failed (${robotsResponse.status})`);
}

const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://neurobreath.co.uk';
const sitemapIndexUrl = `${baseUrl}/sitemap.xml`;
const sitemapUkUrl = `${baseUrl}/sitemap-uk.xml`;
const sitemapUsUrl = `${baseUrl}/sitemap-us.xml`;
const canonicalIndexUrl = `${canonicalBase}/sitemap.xml`;

const sitemapLines = robotsResponse.ok
  ? robotsResponse.text
      .split(/\r?\n/)
      .filter(line => line.toLowerCase().startsWith('sitemap:'))
      .map(line => line.split(':').slice(1).join(':').trim())
  : [];

if (!sitemapLines.includes(sitemapIndexUrl) && !sitemapLines.includes(canonicalIndexUrl)) {
  critical.push('robots.txt missing sitemap index reference');
}

const [indexResponse, ukResponse, usResponse] = await Promise.all([
  fetchText(sitemapIndexUrl),
  fetchText(sitemapUkUrl),
  fetchText(sitemapUsUrl),
]);

if (!indexResponse.ok) critical.push(`sitemap index fetch failed (${indexResponse.status})`);
if (!ukResponse.ok) critical.push(`UK sitemap fetch failed (${ukResponse.status})`);
if (!usResponse.ok) critical.push(`US sitemap fetch failed (${usResponse.status})`);

const ukUrls = ukResponse.ok ? parseSitemapUrls(ukResponse.text) : [];
const usUrls = usResponse.ok ? parseSitemapUrls(usResponse.text) : [];

const allUrls = Array.from(new Set([...ukUrls, ...usUrls]));

for (const url of allUrls) {
  const htmlResponse = await fetchText(url);
  if (!htmlResponse.ok) {
    warnings.push(`Failed to fetch ${url} (${htmlResponse.status})`);
    continue;
  }
  const robotsMeta = parseRobotsMeta(htmlResponse.text);
  if (robotsMeta.includes('noindex')) {
    critical.push(`Noindex URL present in sitemap: ${url}`);
  }
}

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  robots: {
    url: robotsUrl,
    status: robotsResponse.status,
    sitemapReferences: sitemapLines,
  },
  sitemaps: {
    index: { url: sitemapIndexUrl, status: indexResponse.status },
    uk: { url: sitemapUkUrl, status: ukResponse.status, count: ukUrls.length },
    us: { url: sitemapUsUrl, status: usResponse.status, count: usUrls.length },
  },
  counts: {
    urlsChecked: allUrls.length,
    critical: critical.length,
    warnings: warnings.length,
  },
  critical,
  warnings,
};

const reportMd = `# Robots & sitemap readiness check\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\n## Summary\n- URLs checked: ${reportJson.counts.urlsChecked}\n- Critical: ${reportJson.counts.critical}\n- Warnings: ${reportJson.counts.warnings}\n\n## Robots.txt\n- URL: ${robotsUrl}\n- Status: ${robotsResponse.status}\n- Sitemap references:\n${reportJson.robots.sitemapReferences.length ? reportJson.robots.sitemapReferences.map(line => `  - ${line}`).join('\n') : '  - None'}\n\n## Sitemaps\n- Index: ${indexResponse.status}\n- UK: ${ukResponse.status} (${ukUrls.length} URLs)\n- US: ${usResponse.status} (${usUrls.length} URLs)\n\n## Critical issues\n${critical.length ? critical.map(item => `- ${item}`).join('\n') : '- None'}\n\n## Warnings\n${warnings.length ? warnings.map(item => `- ${item}`).join('\n') : '- None'}\n`;

await writeReport(path.join(projectRoot, 'reports', 'search-console', 'robots-sitemap-check.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'search-console', 'robots-sitemap-check.md'), reportMd);

if (critical.length) {
  process.exit(1);
}
