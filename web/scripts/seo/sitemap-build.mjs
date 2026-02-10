import path from 'path';
import { fileURLToPath } from 'url';
import { fetchText, parseSitemapUrls, writeReport } from './sitemap-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');

const baseUrl = process.env.SEO_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const targets = [
  { name: 'index', path: '/sitemap.xml' },
  { name: 'uk', path: '/sitemap-uk.xml' },
  { name: 'us', path: '/sitemap-us.xml' },
];

const results = [];
let hasFailure = false;

for (const target of targets) {
  const url = `${baseUrl}${target.path}`;
  const response = await fetchText(url);
  const urls = response.ok ? parseSitemapUrls(response.text) : [];
  results.push({
    name: target.name,
    url,
    status: response.status,
    count: urls.length,
  });
  if (!response.ok) {
    hasFailure = true;
  }

  if (response.ok) {
    const filePath = path.join(projectRoot, 'reports', `sitemap-${target.name}.xml`);
    await writeReport(filePath, response.text);
  }
}

const reportJson = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  results,
  status: hasFailure ? 'failed' : 'ok',
};

const reportMd = `# Sitemap build snapshot\n\nGenerated at: ${reportJson.generatedAt}\n\nBase URL: ${baseUrl}\n\n## Results\n\n${results
  .map(result => `- ${result.name.toUpperCase()}: ${result.status} (${result.count} URLs)`)
  .join('\n')}\n`;

await writeReport(path.join(projectRoot, 'reports', 'sitemap-build.json'), JSON.stringify(reportJson, null, 2));
await writeReport(path.join(projectRoot, 'reports', 'sitemap-build.md'), reportMd);

if (hasFailure) {
  process.exit(1);
}
