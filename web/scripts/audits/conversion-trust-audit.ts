import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, relative, sep } from 'path';

type Severity = 'critical' | 'warning' | 'info';

interface RouteEntry {
  path: string;
  url: string;
  pattern: string;
  isDynamic: boolean;
  file: string;
}

interface AuditIssue {
  routePattern: string;
  routeFile: string;
  severity: Severity;
  code: string;
  message: string;
}

interface RouteAudit {
  routePattern: string;
  routeFile: string;
  checks: {
    hasGenerateMetadata: boolean;
    hasTitle: boolean;
    hasDescription: boolean;
    hasCanonical: boolean;
    hasHreflang: boolean;
    hasJsonLd: boolean;
    hasTrustSignals: boolean;
    hasPrimaryCta: boolean;
    hasRelatedResources: boolean;
    hasTrackingHook: boolean;
    internalLinkCount: number;
  };
  issues: AuditIssue[];
  score: number;
}

interface ConversionTrustAuditOutput {
  generatedAt: string;
  applyFixes: boolean;
  appDirectory: string;
  totals: {
    routes: number;
    critical: number;
    warning: number;
    info: number;
  };
  audits: RouteAudit[];
  issues: AuditIssue[];
  appliedFixes: string[];
}

const PAGE_FILES = ['page.tsx', 'page.jsx', 'page.ts', 'page.js', 'page.mdx'];
const EXCLUDED_FILES = ['layout', 'template', 'loading', 'error', 'not-found', 'route', 'default', 'middleware'];

function isSpecialSegment(segment: string) {
  if (/^\([^)]+\)$/.test(segment)) return { exclude: true };
  if (segment.startsWith('@')) return { exclude: true };

  if (segment.startsWith('[') && segment.endsWith(']')) {
    const isOptional = segment.startsWith('[[') && segment.endsWith(']]');
    const isCatchAll = segment.includes('...');
    const paramName = segment.replace(/[\[\]\.]/g, '');

    return {
      exclude: false,
      isDynamic: true,
      isOptional,
      isCatchAll,
      paramName,
      pattern: isOptional ? `[[...${paramName}]]` : isCatchAll ? `[...${paramName}]` : `[${paramName}]`,
    };
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

    if (analysis.isDynamic) {
      urlSegments.push(`:${analysis.paramName}`);
    } else {
      urlSegments.push(segment);
    }
  }

  const url = '/' + urlSegments.join('/');
  return url === '/' ? '/' : url.replace(/\/$/, '');
}

async function scanDirectoryForRoutes(appDir: string, dir: string = appDir): Promise<RouteEntry[]> {
  const routes: RouteEntry[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'api') continue;
      routes.push(...(await scanDirectoryForRoutes(appDir, fullPath)));
      continue;
    }

    if (!entry.isFile()) continue;

    const isPageFile = PAGE_FILES.includes(entry.name);
    const isExcluded = EXCLUDED_FILES.some(excluded => entry.name.startsWith(excluded));
    if (!isPageFile || isExcluded) continue;

    const relPath = relative(appDir, fullPath);
    const url = pathToUrl(relPath);

    routes.push({
      path: relPath,
      url,
      pattern: url,
      isDynamic: url.includes(':'),
      file: entry.name,
    });
  }

  return routes;
}

function countInternalLinks(source: string) {
  const hrefAttrMatches = source.match(/\bhref\s*=\s*[{]?["'`]/g) ?? [];
  const hrefPropMatches = source.match(/\bhref\s*:\s*["'`]/g) ?? [];
  return hrefAttrMatches.length + hrefPropMatches.length;
}

function includesAny(source: string, needles: string[]) {
  return needles.some(n => source.includes(n));
}

function computeScore(route: RouteAudit): number {
  // Simple heuristic: each check contributes equally.
  const weights: Array<[keyof RouteAudit['checks'], number]> = [
    ['hasTitle', 2],
    ['hasDescription', 2],
    ['hasCanonical', 2],
    ['hasHreflang', 2],
    ['hasJsonLd', 1],
    ['hasTrustSignals', 1],
    ['hasPrimaryCta', 1],
    ['hasRelatedResources', 1],
    ['hasTrackingHook', 1],
    ['internalLinkCount', 1],
  ];

  let score = 0;
  let max = 0;
  for (const [key, w] of weights) {
    max += w;
    if (key === 'internalLinkCount') {
      if (route.checks.internalLinkCount >= 8) score += w;
      continue;
    }
    if (route.checks[key] === true) score += w;
  }

  return Math.round((score / max) * 100);
}

function toMarkdown(result: ConversionTrustAuditOutput) {
  const lines: string[] = [];
  lines.push('# Conversion & Trust Audit');
  lines.push('');
  lines.push(`Generated: ${result.generatedAt}`);
  lines.push('');
  lines.push(`- Routes scanned: ${result.totals.routes}`);
  lines.push(`- Critical issues: ${result.totals.critical}`);
  lines.push(`- Warnings: ${result.totals.warning}`);
  lines.push(`- APPLY_FIXES: ${result.applyFixes ? 'on' : 'off'}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('| Route | Score | Critical | Warnings | Links |');
  lines.push('|---|---:|---:|---:|---:|');
  for (const a of result.audits) {
    const critical = a.issues.filter(i => i.severity === 'critical').length;
    const warning = a.issues.filter(i => i.severity === 'warning').length;
    lines.push(`| ${a.routePattern} | ${a.score} | ${critical} | ${warning} | ${a.checks.internalLinkCount} |`);
  }
  lines.push('');

  if (result.issues.length) {
    lines.push('## Issues');
    lines.push('');
    lines.push('| Severity | Route | Code | Message |');
    lines.push('|---|---|---|---|');
    for (const issue of result.issues) {
      lines.push(`| ${issue.severity} | ${issue.routePattern} | ${issue.code} | ${issue.message} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

async function main() {
  const webRoot = process.cwd();
  const appDir = join(webRoot, 'app');
  const reportsDir = join(webRoot, 'reports', 'audits');

  const applyFixes = process.env.APPLY_FIXES === '1' || process.env.APPLY_FIXES === 'true' || process.argv.includes('--apply');

  const routes = (await scanDirectoryForRoutes(appDir)).sort((a, b) => a.pattern.localeCompare(b.pattern));

  const audits: RouteAudit[] = [];
  const issues: AuditIssue[] = [];

  for (const route of routes) {
    const routeFile = join(appDir, route.path);
    const source = await readFile(routeFile, 'utf8');

    const isLocalized = route.pattern.includes(':region');
    const isHub =
      route.pattern === '/:region' ||
      route.pattern === '/:region/conditions' ||
      route.pattern === '/:region/tools' ||
      route.pattern === '/:region/guides' ||
      route.pattern === '/:region/trust';

    const definesOwnMetadata = source.includes('generateMetadata') || /export\s+const\s+metadata\b/.test(source);
    const enforceSeoBasics = isHub || definesOwnMetadata;

    const checks: RouteAudit['checks'] = {
      hasGenerateMetadata: source.includes('generateMetadata'),
      hasTitle: /\btitle\s*:/.test(source) || source.includes('generatePageMetadata({') || source.includes('generateHubMetadata({'),
      hasDescription: /\bdescription\s*:/.test(source) || source.includes('generatePageMetadata({') || source.includes('generateHubMetadata({'),
      hasCanonical: /\balternates\s*:\s*\{[\s\S]*?\bcanonical\b/m.test(source),
      hasHreflang: /\blanguages\s*:\s*\{[\s\S]*?'en-GB'[\s\S]*?'en-US'[\s\S]*?\}/m.test(source),
      hasJsonLd: includesAny(source, ['application/ld+json', 'BreadcrumbList', 'WebSite', 'WebPage']),
      hasTrustSignals: includesAny(source, ['TrustMiniPanel', 'CredibilityFooter', 'TrustHubPage', 'TrustHubPage']),
      hasPrimaryCta: includesAny(source, ['PrimaryCtaBlock']),
      hasRelatedResources: includesAny(source, ['RelatedResources']),
      hasTrackingHook: includesAny(source, ['trackEvent(', '<TrackClick']),
      internalLinkCount: countInternalLinks(source),
    };

    const routeIssues: AuditIssue[] = [];

    if (enforceSeoBasics && !checks.hasTitle) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: isHub ? 'critical' : 'warning',
        code: 'seo_missing_title',
        message: 'Missing title metadata (or metadata helper call).',
      });
    }

    if (enforceSeoBasics && !checks.hasDescription) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: isHub ? 'critical' : 'warning',
        code: 'seo_missing_description',
        message: 'Missing description metadata (or metadata helper call).',
      });
    }

    if (isLocalized && enforceSeoBasics && !checks.hasCanonical) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: isHub ? 'critical' : 'warning',
        code: 'seo_missing_canonical',
        message: 'Localized route missing canonical alternates.',
      });
    }

    if (isLocalized && enforceSeoBasics && !checks.hasHreflang) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: 'warning',
        code: 'seo_missing_hreflang',
        message: 'Localized route missing hreflang alternates for en-GB/en-US.',
      });
    }

    if (isHub && !checks.hasTrustSignals) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: 'warning',
        code: 'trust_missing_module',
        message: 'Hub page missing explicit trust module/footer reference.',
      });
    }

    if (isHub && !checks.hasPrimaryCta) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: 'warning',
        code: 'conversion_missing_primary_cta',
        message: 'Hub page missing PrimaryCtaBlock.',
      });
    }

    if (isHub && !checks.hasRelatedResources) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: 'info',
        code: 'conversion_missing_related_resources',
        message: 'Hub page missing RelatedResources module.',
      });
    }

    if (isHub && checks.internalLinkCount < 8) {
      routeIssues.push({
        routePattern: route.pattern,
        routeFile: `app/${route.path}`,
        severity: 'warning',
        code: 'internal_links_low',
        message: `Internal link count looks low (${checks.internalLinkCount}); target is >= 8 on hubs.`,
      });
    }

    const audit: RouteAudit = {
      routePattern: route.pattern,
      routeFile: `app/${route.path}`,
      checks,
      issues: routeIssues,
      score: 0,
    };

    audit.score = computeScore(audit);

    audits.push(audit);
    issues.push(...routeIssues);
  }

  const totals = {
    routes: audits.length,
    critical: issues.filter(i => i.severity === 'critical').length,
    warning: issues.filter(i => i.severity === 'warning').length,
    info: issues.filter(i => i.severity === 'info').length,
  };

  const output: ConversionTrustAuditOutput = {
    generatedAt: new Date().toISOString(),
    applyFixes,
    appDirectory: relative(webRoot, appDir),
    totals,
    audits,
    issues,
    appliedFixes: [] as string[],
  };

  await mkdir(reportsDir, { recursive: true });
  await writeFile(join(reportsDir, 'conversion-trust-audit.json'), JSON.stringify(output, null, 2));
  await writeFile(join(reportsDir, 'conversion-trust-audit.md'), toMarkdown(output));

  // Exit non-zero only on critical issues (quality-gates.ts can be stricter).
  if (totals.critical > 0) {
    // eslint-disable-next-line no-console
    console.error(`❌ Critical issues found: ${totals.critical}`);
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`✅ Conversion & Trust audit complete. Routes: ${totals.routes}, warnings: ${totals.warning}.`);
}

main().catch(err => {
  // eslint-disable-next-line no-console
  console.error('❌ Audit failed:', err);
  process.exit(1);
});
