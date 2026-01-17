#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');
const reportDir = resolve(rootDir, 'reports', 'about');
const jsonReportPath = resolve(reportDir, 'about-validation.json');
const mdReportPath = resolve(reportDir, 'about-validation.md');

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

const aboutRoutes = [
  '/uk/about',
  '/us/about',
  '/uk/about/mission',
  '/us/about/mission',
  '/uk/about/methodology',
  '/us/about/methodology',
  '/uk/about/who-its-for',
  '/us/about/who-its-for',
  '/uk/about/use-responsibly',
  '/us/about/use-responsibly',
  '/uk/about/how-we-update',
  '/us/about/how-we-update',
  '/uk/about/faq',
  '/us/about/faq',
  '/uk/about/language',
  '/us/about/language',
];

const issues = [];

const addIssue = (level, message, route) => {
  issues.push({ level, message, route });
};

const hasSingleH1 = html => {
  const matches = html.match(/<h1[^>]*>/g) || [];
  return matches.length === 1;
};

const hasMetadata = html => /<title>/.test(html) && /<meta name="description"/.test(html) && /<link rel="canonical"/.test(html);

const countInternalLinks = html => {
  const matches = html.match(/href="\/(?!_next|api)[^"#?\s]+/g) || [];
  return new Set(matches.map(match => match.replace('href="', ''))).size;
};

const hasTrustLink = html => /\/trust/.test(html);

for (const route of aboutRoutes) {
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

  const internalLinkCount = countInternalLinks(html);
  if (internalLinkCount < 8) {
    addIssue('warning', `Internal links below minimum: ${internalLinkCount}`, route);
  }

  if (!hasTrustLink(html)) {
    addIssue('warning', 'Missing Trust Centre link', route);
  }
}

const summary = {
  critical: issues.filter(issue => issue.level === 'critical').length,
  warning: issues.filter(issue => issue.level === 'warning').length,
  totalRoutes: aboutRoutes.length,
};

const report = {
  generatedAt: new Date().toISOString(),
  summary,
  issues,
};

await mkdir(reportDir, { recursive: true });
await writeFile(jsonReportPath, JSON.stringify(report, null, 2));

const markdown = `# About Validation Report\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `## Summary\n` +
  `- Total routes: ${report.summary.totalRoutes}\n` +
  `- Critical issues: ${report.summary.critical}\n` +
  `- Warnings: ${report.summary.warning}\n\n` +
  `## Issues\n` +
  (issues.length
    ? issues.map(issue => `- [${issue.level.toUpperCase()}] ${issue.route}: ${issue.message}`).join('\n')
    : 'No issues found.');

await writeFile(mdReportPath, markdown);

if (summary.critical > 0) {
  process.exit(1);
}
