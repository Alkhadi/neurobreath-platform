import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, relative, sep } from 'path';

type Severity = 'critical' | 'warning' | 'info';

interface HubIssue {
  hub: string;
  routeFile: string;
  severity: Severity;
  code: string;
  message: string;
}

interface HubAudit {
  hub: string;
  routeFile: string;
  checks: Record<string, boolean | number>;
  issues: HubIssue[];
  pass: boolean;
}

const PAGE_FILES = ['page.tsx', 'page.jsx', 'page.ts', 'page.js', 'page.mdx'];
const EXCLUDED_FILES = ['layout', 'template', 'loading', 'error', 'not-found', 'route', 'default', 'middleware'];

function isSpecialSegment(segment: string) {
  if (/^\([^)]+\)$/.test(segment)) return { exclude: true };
  if (segment.startsWith('@')) return { exclude: true };

  if (segment.startsWith('[') && segment.endsWith(']')) {
    const paramName = segment.replace(/[\[\]\.]/g, '');
    return { exclude: false, isDynamic: true, paramName };
  }

  return { exclude: false, isDynamic: false };
}

function pathToUrl(relativePath: string) {
  const segments = relativePath.split(sep);
  const urlSegments: string[] = [];

  for (const segment of segments) {
    if (PAGE_FILES.includes(segment)) continue;
    const analysis = isSpecialSegment(segment);
    if (analysis.exclude) continue;
    if (analysis.isDynamic) urlSegments.push(`:${analysis.paramName}`);
    else urlSegments.push(segment);
  }

  const url = '/' + urlSegments.join('/');
  return url === '/' ? '/' : url.replace(/\/$/, '');
}

async function scanRoutes(appDir: string, dir: string = appDir): Promise<Array<{ pattern: string; path: string }>> {
  const routes: Array<{ pattern: string; path: string }> = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'api') continue;
      routes.push(...(await scanRoutes(appDir, fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;

    const isPageFile = PAGE_FILES.includes(entry.name);
    const isExcluded = EXCLUDED_FILES.some(excluded => entry.name.startsWith(excluded));
    if (!isPageFile || isExcluded) continue;

    const relPath = relative(appDir, fullPath);
    routes.push({ pattern: pathToUrl(relPath), path: relPath });
  }

  return routes;
}

function countInternalLinks(source: string) {
  const hrefAttrMatches = source.match(/\bhref\s*=\s*[{]?["'`]/g) ?? [];
  const hrefPropMatches = source.match(/\bhref\s*:\s*["'`]/g) ?? [];
  return hrefAttrMatches.length + hrefPropMatches.length;
}

function hasAny(source: string, needles: string[]) {
  return needles.some(n => source.includes(n));
}

function toMarkdown(result: { generatedAt: string; audits: HubAudit[]; issues: HubIssue[] }) {
  const lines: string[] = [];
  lines.push('# Growth Hub Audit');
  lines.push('');
  lines.push(`Generated: ${result.generatedAt}`);
  lines.push('');

  lines.push('## Hubs');
  lines.push('');
  lines.push('| Hub | Pass | Critical | Warnings | Source |');
  lines.push('|---|---:|---:|---:|---|');
  for (const a of result.audits) {
    const critical = a.issues.filter(i => i.severity === 'critical').length;
    const warning = a.issues.filter(i => i.severity === 'warning').length;
    lines.push(`| ${a.hub} | ${a.pass ? 'yes' : 'no'} | ${critical} | ${warning} | ${a.routeFile} |`);
  }
  lines.push('');

  if (result.issues.length) {
    lines.push('## Issues');
    lines.push('');
    lines.push('| Severity | Hub | Code | Message |');
    lines.push('|---|---|---|---|');
    for (const issue of result.issues) {
      lines.push(`| ${issue.severity} | ${issue.hub} | ${issue.code} | ${issue.message} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const webRoot = process.cwd();
  const appDir = join(webRoot, 'app');
  const reportsDir = join(webRoot, 'reports', 'growth');

  const targets = new Map<string, string>([
    ['/:region', 'Home'],
    ['/:region/conditions', 'Conditions hub'],
    ['/:region/tools', 'Tools hub'],
    ['/:region/guides', 'Guides hub'],
    ['/:region/trust', 'Trust hub'],
  ]);

  const routes = await scanRoutes(appDir);
  const audits: HubAudit[] = [];
  const issues: HubIssue[] = [];

  for (const [pattern, label] of targets.entries()) {
    const match = routes.find(r => r.pattern === pattern);
    if (!match) {
      const issue: HubIssue = {
        hub: label,
        routeFile: '(missing)',
        severity: 'critical',
        code: 'hub_route_missing',
        message: `Expected localized hub route ${pattern} was not found in app directory.`,
      };
      issues.push(issue);
      audits.push({ hub: label, routeFile: '(missing)', checks: {}, issues: [issue], pass: false });
      continue;
    }

    const routeFile = `app/${match.path}`;
    const source = await readFile(join(appDir, match.path), 'utf8');

    const internalLinks = countInternalLinks(source);

    const checks = {
      hasTitleOrMetadataHelper: /\btitle\s*:/.test(source) || hasAny(source, ['generatePageMetadata({', 'generateHubMetadata({']),
      hasDescriptionOrMetadataHelper: /\bdescription\s*:/.test(source) || hasAny(source, ['generatePageMetadata({', 'generateHubMetadata({']),
      hasCanonicalAlternates: /\balternates\s*:\s*\{[\s\S]*?\bcanonical\b/m.test(source),
      hasHreflang: /\blanguages\s*:\s*\{[\s\S]*?'en-GB'[\s\S]*?'en-US'[\s\S]*?\}/m.test(source),
      hasJsonLd: hasAny(source, ['application/ld+json', 'BreadcrumbList', 'WebSite', 'WebPage']),
      hasTrustSignals: hasAny(source, ['TrustMiniPanel', 'CredibilityFooter', 'TrustHubPage', 'TrustHubPage']),
      hasPrimaryCta: source.includes('PrimaryCtaBlock'),
      hasRelatedResources: source.includes('RelatedResources'),
      internalLinkCount: internalLinks,
      hasTrackingHook: hasAny(source, ['trackEvent(', '<TrackClick']),
      hasAudienceSelector: source.includes('HomeAudienceSelector'),
    };

    const hubIssues: HubIssue[] = [];

    if (!checks.hasTitleOrMetadataHelper) {
      hubIssues.push({ hub: label, routeFile, severity: 'critical', code: 'seo_missing_title', message: 'Missing title metadata (or metadata helper).' });
    }

    if (!checks.hasDescriptionOrMetadataHelper) {
      hubIssues.push({ hub: label, routeFile, severity: 'critical', code: 'seo_missing_description', message: 'Missing description metadata (or metadata helper).' });
    }

    if (!checks.hasCanonicalAlternates) {
      hubIssues.push({ hub: label, routeFile, severity: 'critical', code: 'seo_missing_canonical', message: 'Missing canonical alternates on localized hub.' });
    }

    if (!checks.hasHreflang) {
      hubIssues.push({ hub: label, routeFile, severity: 'warning', code: 'seo_missing_hreflang', message: 'Missing hreflang alternates for en-GB/en-US.' });
    }

    // Hub-specific conversion/trust expectations.
    if (label !== 'Trust hub' && !checks.hasPrimaryCta) {
      hubIssues.push({ hub: label, routeFile, severity: 'warning', code: 'conversion_missing_primary_cta', message: 'Missing PrimaryCtaBlock on hub.' });
    }

    if (label !== 'Trust hub' && !checks.hasTrustSignals) {
      hubIssues.push({ hub: label, routeFile, severity: 'warning', code: 'trust_missing_signals', message: 'Missing explicit trust panel/footer reference.' });
    }

    if (label !== 'Trust hub' && !checks.hasRelatedResources) {
      hubIssues.push({ hub: label, routeFile, severity: 'info', code: 'conversion_missing_related_resources', message: 'Missing RelatedResources module.' });
    }

    const minLinks = label === 'Home' ? 12 : 10;
    if (internalLinks < minLinks) {
      hubIssues.push({
        hub: label,
        routeFile,
        severity: 'warning',
        code: 'internal_links_low',
        message: `Internal link count looks low (${internalLinks}); target is >= ${minLinks}.`,
      });
    }

    if (label === 'Home' && !checks.hasAudienceSelector) {
      hubIssues.push({ hub: label, routeFile, severity: 'info', code: 'conversion_missing_audience_selector', message: 'Home missing HomeAudienceSelector module.' });
    }

    const pass = hubIssues.every(i => i.severity !== 'critical');

    audits.push({ hub: label, routeFile, checks, issues: hubIssues, pass });
    issues.push(...hubIssues);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    appDirectory: relative(webRoot, appDir),
    audits,
    issues,
    totals: {
      hubs: audits.length,
      critical: issues.filter(i => i.severity === 'critical').length,
      warning: issues.filter(i => i.severity === 'warning').length,
      info: issues.filter(i => i.severity === 'info').length,
    },
  };

  await mkdir(reportsDir, { recursive: true });
  await writeFile(join(reportsDir, 'hub-audit.json'), JSON.stringify(output, null, 2));
  await writeFile(join(reportsDir, 'hub-audit.md'), toMarkdown(output));

  if (output.totals.critical > 0) {
    // eslint-disable-next-line no-console
    console.error(`❌ Growth hub audit failed: ${output.totals.critical} critical issue(s).`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Growth hub audit complete. Hubs: ${output.totals.hubs}, warnings: ${output.totals.warning}.`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('❌ Hub audit failed:', err);
  process.exit(1);
});
