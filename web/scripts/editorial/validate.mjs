#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as printablesModule from '../../lib/printables/printables.ts';
import * as glossaryModule from '../../lib/glossary/glossary.ts';
import * as pagesModule from '../../lib/content/pages/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');
const reportDir = resolve(rootDir, 'reports', 'editorial');
const jsonReportPath = resolve(reportDir, 'editorial-validation.json');
const mdReportPath = resolve(reportDir, 'editorial-validation.md');

const issues = [];

const { PRINTABLES } = printablesModule.default ?? printablesModule;
const { GLOSSARY_TERMS } = glossaryModule.default ?? glossaryModule;
const { canonicalPages } = pagesModule.default ?? pagesModule;

const addIssue = (level, message, section, id, field) => {
  issues.push({ level, message, section, id, field });
};

const hasValidDate = value => !Number.isNaN(new Date(value).getTime());

const validateEditorial = (editorial, section, id, citationsCount = 0) => {
  if (!editorial) {
    addIssue('critical', 'Missing editorial metadata', section, id, 'editorial');
    return;
  }

  ['authorId', 'reviewerId', 'createdAt', 'updatedAt', 'reviewedAt', 'reviewIntervalDays'].forEach(field => {
    if (!editorial[field]) {
      addIssue('critical', `Missing required editorial field: ${field}`, section, id, `editorial.${field}`);
    }
  });

  if (!hasValidDate(editorial.createdAt) || !hasValidDate(editorial.updatedAt) || !hasValidDate(editorial.reviewedAt)) {
    addIssue('critical', 'Invalid editorial date field', section, id, 'editorial.dates');
  }

  if (!Array.isArray(editorial.changeLog) || editorial.changeLog.length === 0) {
    addIssue('critical', 'Change log must contain at least one entry', section, id, 'editorial.changeLog');
  }

  if (!editorial.disclaimers?.educationalOnly || !editorial.disclaimers?.notMedicalAdvice) {
    addIssue('critical', 'Missing required disclaimer flags', section, id, 'editorial.disclaimers');
  }

  if (!editorial.citationsSummary) {
    if (citationsCount > 0) {
      addIssue('warning', 'Citations summary missing; computed from sources', section, id, 'editorial.citationsSummary');
    } else {
      addIssue('warning', 'Citations summary missing and no citations detected', section, id, 'editorial.citationsSummary');
    }
  }
};

canonicalPages.forEach(page => {
  const citationsCount =
    page.citationsByRegion.UK.length + page.citationsByRegion.US.length + (page.citationsByRegion.GLOBAL?.length || 0);
  validateEditorial(page.editorial, 'guides', page.id, citationsCount);
});

PRINTABLES.forEach(printable => {
  const citationsCount =
    printable.citationsByRegion.global.length +
    printable.citationsByRegion.uk.length +
    printable.citationsByRegion.us.length;
  validateEditorial(printable.editorial, 'printables', printable.id, citationsCount);
});

GLOSSARY_TERMS.forEach(term => {
  const citationsCount =
    term.citationsByRegion.global.length +
    term.citationsByRegion.uk.length +
    term.citationsByRegion.us.length;
  validateEditorial(term.editorial, 'glossary', term.id, citationsCount);
});

const summary = {
  total: canonicalPages.length + PRINTABLES.length + GLOSSARY_TERMS.length,
  critical: issues.filter(issue => issue.level === 'critical').length,
  warning: issues.filter(issue => issue.level === 'warning').length,
};

const report = {
  generatedAt: new Date().toISOString(),
  summary,
  issues,
};

await mkdir(reportDir, { recursive: true });
await writeFile(jsonReportPath, JSON.stringify(report, null, 2));

const markdown = `# Editorial Validation Report\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `## Summary\n` +
  `- Total items checked: ${summary.total}\n` +
  `- Critical issues: ${summary.critical}\n` +
  `- Warnings: ${summary.warning}\n\n` +
  `## Issues\n` +
  (issues.length
    ? issues.map(issue => `- [${issue.level.toUpperCase()}] ${issue.section}/${issue.id}: ${issue.message}`).join('\n')
    : 'No issues found.');

await writeFile(mdReportPath, markdown);

if (summary.critical > 0) {
  process.exit(1);
}
