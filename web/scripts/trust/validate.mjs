#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');
const reportDir = resolve(rootDir, 'reports', 'trust');

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const trustRoutes = [
  '/uk/trust',
  '/us/trust',
  '/uk/trust/evidence-policy',
  '/us/trust/evidence-policy',
  '/uk/trust/citations',
  '/us/trust/citations',
  '/uk/trust/editorial-standards',
  '/us/trust/editorial-standards',
  '/uk/trust/safeguarding',
  '/us/trust/safeguarding',
  '/uk/trust/privacy',
  '/us/trust/privacy',
  '/uk/trust/accessibility',
  '/us/trust/accessibility',
  '/uk/trust/last-reviewed',
  '/us/trust/last-reviewed',
  '/uk/trust/disclaimer',
  '/us/trust/disclaimer',
  '/uk/trust/contact',
  '/us/trust/contact',
];

const issues = [];

const addIssue = (level, message, route) => {
  issues.push({ level, message, route });
};

const hasSingleH1 = html => {
  const matches = html.match(/<h1[^>]*>/g) || [];
  return matches.length === 1;
};

const hasMetadata = html => {
  return /<title>/.test(html) && /<meta name="description"/.test(html) && /<link rel="canonical"/.test(html);
};

const checkCitations = html => {
  const sectionMatch = html.match(/<section[^>]*data-citation-list[^>]*>([\s\S]*?)<\/section>/i);
  if (!sectionMatch) return { hasCitationList: false };
  const sectionContent = sectionMatch[1];
  const hasExternalAnchor = /href="https?:\/\//i.test(sectionContent);
  const hasCopyButton = /Copy link/i.test(sectionContent);
  return { hasCitationList: true, hasExternalAnchor, hasCopyButton };
};

await import('./review-report.mjs');

for (const route of trustRoutes) {
  const response = await fetch(`${BASE_URL}${route}`);
  if (!response.ok) {
    addIssue('critical', `Route returned ${response.status}`, route);
    continue;
  }
  const html = await response.text();

  if (!hasMetadata(html)) {
    addIssue('critical', 'Missing title/description/canonical metadata', route);
  }

  if (!hasSingleH1(html)) {
    addIssue('critical', 'Expected exactly one H1', route);
  }

  const citationCheck = checkCitations(html);
  if (citationCheck.hasCitationList && citationCheck.hasExternalAnchor) {
    addIssue('critical', 'Citations contain external anchor links', route);
  }
  if (citationCheck.hasCitationList && !citationCheck.hasCopyButton) {
    addIssue('warning', 'Citations list missing copy button text', route);
  }
}

const summary = {
  critical: issues.filter(issue => issue.level === 'critical').length,
  warning: issues.filter(issue => issue.level === 'warning').length,
  totalRoutes: trustRoutes.length,
};

const report = {
  generatedAt: new Date().toISOString(),
  summary,
  issues,
};

await mkdir(reportDir, { recursive: true });
await writeFile(resolve(reportDir, 'trust-validation.json'), JSON.stringify(report, null, 2));

if (summary.critical > 0) {
  process.exit(1);
}
