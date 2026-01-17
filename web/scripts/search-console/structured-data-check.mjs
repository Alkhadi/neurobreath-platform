import path from 'path';
import { fileURLToPath } from 'url';
import { fetchText, parseJsonLd, parseSitemapUrls, writeReport } from '../seo/sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const sitemapUkUrl = `${baseUrl}/sitemap-uk.xml`;
const sitemapUsUrl = `${baseUrl}/sitemap-us.xml`;

const [ukResponse, usResponse] = await Promise.all([fetchText(sitemapUkUrl), fetchText(sitemapUsUrl)]);
const ukUrls = ukResponse.ok ? parseSitemapUrls(ukResponse.text) : [];
const usUrls = usResponse.ok ? parseSitemapUrls(usResponse.text) : [];
const urls = Array.from(new Set([...ukUrls, ...usUrls]));

const critical = [];
const warnings = [];
const results = [];

function extractTypes(schemaObject) {
  if (!schemaObject) return [];
  if (Array.isArray(schemaObject)) {
    return schemaObject.flatMap(extractTypes);
  }
  if (schemaObject['@graph']) {
    return extractTypes(schemaObject['@graph']);
  }
  const type = schemaObject['@type'];
  if (!type) return [];
  return Array.isArray(type) ? type : [type];
}

for (const url of urls) {
  const response = await fetchText(url);
  if (!response.ok) {
    warnings.push(`Failed to fetch ${url} (${response.status})`);
    continue;
  }

  const jsonLdBlocks = parseJsonLd(response.text);
  const types = new Set();
  jsonLdBlocks.forEach(block => {
    try {
      const parsed = JSON.parse(block);
      extractTypes(parsed).forEach(type => types.add(type));
    } catch {
      critical.push(`Invalid JSON-LD on ${url}`);
    }
  });

  const hasFaqSection = response.text.includes('data-faq-section="true"');
  const hasFaqSchema = types.has('FAQPage');
  if (hasFaqSchema && !hasFaqSection) {
    critical.push(`FAQPage schema without FAQ UI on ${url}`);
  }
  if (!hasFaqSchema && hasFaqSection) {
    warnings.push(`FAQ UI missing FAQPage schema on ${url}`);
  }

  if (types.has('Article') && !new URL(url).pathname.startsWith('/blog')) {
    warnings.push(`Article schema used outside blog on ${url}`);
  }

  ['Organization', 'WebSite', 'WebPage'].forEach(requiredType => {
    if (!types.has(requiredType)) {
      critical.push(`Missing ${requiredType} schema on ${url}`);
    }
  });

  if ((url.includes('/trust') || url.includes('/guides')) && !types.has('BreadcrumbList')) {
    warnings.push(`BreadcrumbList missing on ${url}`);
  }

  results.push({
    url,
    schemaTypes: Array.from(types),
  });
}

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  counts: {
    urlsChecked: results.length,
    critical: critical.length,
    warnings: warnings.length,
  },
  results,
  critical,
  warnings,
};

const reportMd = `# Structured data readiness report\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\n## Summary\n- URLs checked: ${reportJson.counts.urlsChecked}\n- Critical: ${reportJson.counts.critical}\n- Warnings: ${reportJson.counts.warnings}\n\n## Critical issues\n${critical.length ? critical.map(item => `- ${item}`).join('\n') : '- None'}\n\n## Warnings\n${warnings.length ? warnings.map(item => `- ${item}`).join('\n') : '- None'}\n`;

await writeReport(path.join(projectRoot, 'reports', 'search-console', 'structured-data-check.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'search-console', 'structured-data-check.md'), reportMd);

if (critical.length) {
  process.exit(1);
}
