import path from 'path';
import { fileURLToPath } from 'url';
import { fetchText, parseCanonical, parseHreflang, parseRobotsMeta, parseSitemapUrls, writeReport } from './sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const canonicalBase = process.env.NEXT_PUBLIC_SITE_URL || 'https://neurobreath.co.uk';
const canonicalHost = new URL(canonicalBase).host;

const EXCLUDED_PREFIXES = ['/api', '/admin', '/login', '/_next', '/parent', '/teacher', '/progress', '/send-report'];

const isExcluded = pathname => EXCLUDED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
const isLocalized = pathname => pathname.startsWith('/uk') || pathname.startsWith('/us');
const stripLocale = pathname => pathname.replace(/^\/(uk|us)(?=\/|$)/, '') || '/';
const counterpartLocale = pathname => {
  if (pathname.startsWith('/uk')) return `/us${stripLocale(pathname) === '/' ? '' : stripLocale(pathname)}`;
  if (pathname.startsWith('/us')) return `/uk${stripLocale(pathname) === '/' ? '' : stripLocale(pathname)}`;
  return pathname;
};

const critical = [];
const warnings = [];

const sitemapIndexUrl = `${baseUrl}/sitemap.xml`;
const sitemapUkUrl = `${baseUrl}/sitemap-uk.xml`;
const sitemapUsUrl = `${baseUrl}/sitemap-us.xml`;
const canonicalUkUrl = `${canonicalBase}/sitemap-uk.xml`;
const canonicalUsUrl = `${canonicalBase}/sitemap-us.xml`;

const sitemapIndexResponse = await fetchText(sitemapIndexUrl);
if (!sitemapIndexResponse.ok) {
  critical.push(`Sitemap index fetch failed: ${sitemapIndexUrl} (${sitemapIndexResponse.status})`);
}

const sitemapIndexUrls = sitemapIndexResponse.ok ? parseSitemapUrls(sitemapIndexResponse.text) : [];
if (!sitemapIndexUrls.includes(sitemapUkUrl) && !sitemapIndexUrls.includes(canonicalUkUrl)) {
  critical.push(`Sitemap index missing ${canonicalUkUrl}`);
}
if (!sitemapIndexUrls.includes(sitemapUsUrl) && !sitemapIndexUrls.includes(canonicalUsUrl)) {
  critical.push(`Sitemap index missing ${canonicalUsUrl}`);
}

const [ukResponse, usResponse] = await Promise.all([fetchText(sitemapUkUrl), fetchText(sitemapUsUrl)]);
if (!ukResponse.ok) critical.push(`UK sitemap fetch failed: ${sitemapUkUrl} (${ukResponse.status})`);
if (!usResponse.ok) critical.push(`US sitemap fetch failed: ${sitemapUsUrl} (${usResponse.status})`);

const ukUrls = ukResponse.ok ? parseSitemapUrls(ukResponse.text) : [];
const usUrls = usResponse.ok ? parseSitemapUrls(usResponse.text) : [];

const urlsToCheck = Array.from(new Set([...ukUrls, ...usUrls]));

for (const url of urlsToCheck) {
  const parsed = new URL(url);
  const pathname = parsed.pathname;

  if (isExcluded(pathname)) {
    critical.push(`Sitemap contains excluded URL: ${url}`);
    continue;
  }

  const htmlResponse = await fetchText(url);
  if (!htmlResponse.ok) {
    critical.push(`Failed to fetch HTML for ${url} (${htmlResponse.status})`);
    continue;
  }

  const robots = parseRobotsMeta(htmlResponse.text);
  if (robots.includes('noindex')) {
    critical.push(`Noindex URL found in sitemap: ${url}`);
  }

  const canonical = parseCanonical(htmlResponse.text);
  if (!canonical) {
    critical.push(`Missing canonical on ${url}`);
  } else {
    const canonicalUrl = new URL(canonical, url);
    if (canonicalUrl.protocol !== 'https:') {
      critical.push(`Canonical must use https for ${url}`);
    }
    if (canonicalUrl.host !== canonicalHost) {
      critical.push(`Canonical host mismatch for ${url} (found ${canonicalUrl.host})`);
    }
    if (isLocalized(pathname) && canonicalUrl.pathname !== pathname) {
      critical.push(`Canonical locale mismatch for ${url} (found ${canonicalUrl.pathname})`);
    }
    if (!isLocalized(pathname) && canonicalUrl.pathname !== pathname) {
      warnings.push(`Canonical differs from URL for global page ${url} (found ${canonicalUrl.pathname})`);
    }
  }

  const alternates = parseHreflang(htmlResponse.text);
  if (isLocalized(pathname)) {
    const expectedUk = `${canonicalBase}${pathname.startsWith('/uk') ? pathname : counterpartLocale(pathname)}`;
    const expectedUs = `${canonicalBase}${pathname.startsWith('/us') ? pathname : counterpartLocale(pathname)}`;
    if (!alternates['en-GB'] || !alternates['en-US']) {
      critical.push(`Missing hreflang alternates on ${url}`);
    } else {
      if (alternates['en-GB'] !== expectedUk) {
        critical.push(`hreflang en-GB mismatch on ${url}`);
      }
      if (alternates['en-US'] !== expectedUs) {
        critical.push(`hreflang en-US mismatch on ${url}`);
      }
    }
  }
}

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  canonicalBase,
  counts: {
    totalUrls: urlsToCheck.length,
    critical: critical.length,
    warnings: warnings.length,
  },
  critical,
  warnings,
};

const reportMd = `# Sitemap validation report\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\nCanonical base: ${canonicalBase}\n\n## Summary\n- Total URLs checked: ${reportJson.counts.totalUrls}\n- Critical: ${reportJson.counts.critical}\n- Warnings: ${reportJson.counts.warnings}\n\n## Critical issues\n${critical.length ? critical.map(item => `- ${item}`).join('\n') : '- None'}\n\n## Warnings\n${warnings.length ? warnings.map(item => `- ${item}`).join('\n') : '- None'}\n`;

await writeReport(path.join(projectRoot, 'reports', 'sitemap-validation.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'sitemap-validation.md'), reportMd);

if (critical.length) {
  process.exit(1);
}
