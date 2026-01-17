import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evidenceByRoute } from '../../lib/evidence/page-evidence';
import { evidenceSources } from '../../lib/evidence/evidence-registry';
import { canonicalPages } from '../../lib/content/pages';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const outputDir = path.join(rootDir, '.evidence');
const jsonOutput = path.join(outputDir, 'evidence-audit.json');
const summaryOutput = path.join(rootDir, 'EVIDENCE_AUDIT_SUMMARY.md');

const now = new Date();

const readAllFiles = (dir: string, extList: string[], fileList: string[] = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      readAllFiles(fullPath, extList, fileList);
    } else if (extList.some(ext => entry.name.endsWith(ext))) {
      fileList.push(fullPath);
    }
  });
  return fileList;
};

const appDir = path.join(rootDir, 'app');
const appFiles = readAllFiles(appDir, ['.tsx', '.ts']);
const evidenceUsage = new Set<string>();

const evidenceRegex = /evidenceByRoute\[['"]([^'"]+)['"]\]/g;
appFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  let match: RegExpExecArray | null;
  while ((match = evidenceRegex.exec(content)) !== null) {
    evidenceUsage.add(match[1]);
  }
});

const issues: Array<{ route: string; level: 'critical' | 'warning'; message: string }> = [];
const results: Array<{ route: string; reviewedAt?: string; reviewIntervalDays?: number; citations: string[]; issues: unknown[] }> = [];

Object.entries(evidenceByRoute).forEach(([route, manifest]) => {
  const routeIssues: Array<{ level: 'critical' | 'warning'; message: string }> = [];

  if (!manifest.reviewedAt) {
    routeIssues.push({ level: 'critical', message: 'Missing reviewedAt' });
  }

  if (!manifest.reviewIntervalDays || manifest.reviewIntervalDays <= 0) {
    routeIssues.push({ level: 'critical', message: 'Missing or invalid reviewIntervalDays' });
  }

  const citationIds = manifest.citationsByRegion
    ? [
        ...(manifest.citationsByRegion.UK || []),
        ...(manifest.citationsByRegion.US || []),
        ...(manifest.citationsByRegion.GLOBAL || []),
      ]
    : manifest.citations || [];

  if (citationIds.length === 0) {
    routeIssues.push({ level: 'critical', message: 'Missing citations' });
  }

  citationIds.forEach(id => {
    if (!evidenceSources[id]) {
      routeIssues.push({ level: 'critical', message: `Invalid citation ID: ${id}` });
    }
  });

  if (manifest.reviewedAt && manifest.reviewIntervalDays) {
    const reviewedDate = new Date(manifest.reviewedAt);
    const nextReview = new Date(reviewedDate);
    nextReview.setDate(nextReview.getDate() + manifest.reviewIntervalDays);
    const overdueDays = Math.ceil((now.getTime() - nextReview.getTime()) / (1000 * 60 * 60 * 24));

    if (overdueDays > 0) {
      const criticalThreshold = manifest.reviewIntervalDays * 2;
      if (overdueDays > criticalThreshold) {
        routeIssues.push({ level: 'critical', message: `Overdue by ${overdueDays} days` });
      } else {
        routeIssues.push({ level: 'warning', message: `Overdue by ${overdueDays} days` });
      }
    }
  }

  results.push({
    route,
    reviewedAt: manifest.reviewedAt,
    reviewIntervalDays: manifest.reviewIntervalDays,
    citations: citationIds,
    issues: routeIssues,
  });

  routeIssues.forEach(issue => issues.push({ route, ...issue }));
});

canonicalPages.forEach(page => {
  const route = `/guides/${page.slugs.UK}`;
  const citationIds = [
    ...(page.citationsByRegion.UK || []),
    ...(page.citationsByRegion.US || []),
    ...(page.citationsByRegion.GLOBAL || []),
  ];

  const routeIssues: Array<{ level: 'critical' | 'warning'; message: string }> = [];
  if (!page.reviewedAt) {
    routeIssues.push({ level: 'critical', message: 'Missing reviewedAt' });
  }
  if (!page.reviewIntervalDays || page.reviewIntervalDays <= 0) {
    routeIssues.push({ level: 'critical', message: 'Missing or invalid reviewIntervalDays' });
  }
  if (citationIds.length === 0) {
    routeIssues.push({ level: 'critical', message: 'Missing citations' });
  }
  citationIds.forEach(id => {
    if (!evidenceSources[id]) {
      routeIssues.push({ level: 'critical', message: `Invalid citation ID: ${id}` });
    }
  });

  results.push({
    route,
    reviewedAt: page.reviewedAt,
    reviewIntervalDays: page.reviewIntervalDays,
    citations: citationIds,
    issues: routeIssues,
  });

  routeIssues.forEach(issue => issues.push({ route, ...issue }));
});

const missingRoutes = [...evidenceUsage].filter(route => !evidenceByRoute[route]);
missingRoutes.forEach(route => issues.push({ route, level: 'critical', message: 'Evidence manifest missing for page usage' }));

const criticalCount = issues.filter(issue => issue.level === 'critical').length;
const warningCount = issues.filter(issue => issue.level === 'warning').length;

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(jsonOutput, JSON.stringify({ generatedAt: now.toISOString(), results, issues }, null, 2));

const summaryLines = [
  '# Evidence Audit Summary',
  '',
  `Generated: ${now.toISOString()}`,
  '',
  `Critical issues: ${criticalCount}`,
  `Warnings: ${warningCount}`,
  '',
  '## Issues',
];

if (issues.length === 0) {
  summaryLines.push('No issues found.');
} else {
  issues.forEach(issue => {
    summaryLines.push(`- **${issue.level.toUpperCase()}** ${issue.route}: ${issue.message}`);
  });
}

fs.writeFileSync(summaryOutput, summaryLines.join('\n'));

if (criticalCount > 0) {
  console.error('Evidence audit failed with critical issues.');
  process.exit(1);
}

console.log('Evidence audit completed.');
