#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as guidesModule from '../../lib/guides/guides.ts';
import * as toolsModule from '../../lib/tools/tools.ts';
import * as printablesModule from '../../lib/printables/printables.ts';
import * as glossaryModule from '../../lib/glossary/glossary.ts';
import * as evidenceModule from '../../lib/evidence/page-evidence.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');
const reportDir = resolve(rootDir, 'reports');
const jsonReportPath = resolve(reportDir, 'trust', 'review-report.json');
const mdReportPath = resolve(reportDir, 'trust', 'review-report.md');

const now = new Date();

const nextReviewDate = (reviewedAt, intervalDays) => {
  const reviewed = new Date(reviewedAt);
  const nextReview = new Date(reviewed);
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview;
};

const daysUntil = date => Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

const trackedItems = [];

const { GUIDES } = guidesModule.default ?? guidesModule;
const { TOOLS } = toolsModule.default ?? toolsModule;
const { PRINTABLES } = printablesModule.default ?? printablesModule;
const { GLOSSARY_TERMS } = glossaryModule.default ?? glossaryModule;
const { evidenceByRoute } = evidenceModule.default ?? evidenceModule;

GUIDES.forEach(guide => {
  trackedItems.push({
    id: guide.id,
    section: 'guides',
    path: guide.hrefs.UK,
    reviewedAt: guide.reviewedAt,
    reviewIntervalDays: 180,
  });
});

TOOLS.forEach(tool => {
  trackedItems.push({
    id: tool.id,
    section: 'tools',
    path: tool.href,
    reviewedAt: tool.reviewedAt,
    reviewIntervalDays: 180,
  });
});

PRINTABLES.forEach(printable => {
  trackedItems.push({
    id: printable.id,
    section: 'printables',
    path: `/printables/${printable.id}`,
    reviewedAt: printable.reviewedAt,
    reviewIntervalDays: printable.reviewIntervalDays,
  });
});

GLOSSARY_TERMS.forEach(term => {
  trackedItems.push({
    id: term.id,
    section: 'glossary',
    path: `/glossary/${term.id}`,
    reviewedAt: term.reviewedAt,
    reviewIntervalDays: term.reviewIntervalDays,
  });
});

Object.entries(evidenceByRoute).forEach(([pathKey, evidence]) => {
  const section = pathKey.startsWith('/conditions') || ['/adhd', '/autism', '/anxiety', '/sleep', '/stress', '/breathing', '/dyslexia-reading-training'].includes(pathKey)
    ? 'conditions'
    : pathKey.startsWith('/tools')
      ? 'tools'
      : 'other';

  trackedItems.push({
    id: pathKey,
    section,
    path: pathKey,
    reviewedAt: evidence.reviewedAt,
    reviewIntervalDays: evidence.reviewIntervalDays ?? 180,
  });
});

const overdue = [];
const dueIn30 = [];
const dueIn60 = [];

trackedItems.forEach(item => {
  const dueDate = nextReviewDate(item.reviewedAt, item.reviewIntervalDays);
  const daysRemaining = daysUntil(dueDate);

  if (daysRemaining < 0) {
    overdue.push({ ...item, dueDate: dueDate.toISOString(), daysRemaining });
  } else if (daysRemaining <= 30) {
    dueIn30.push({ ...item, dueDate: dueDate.toISOString(), daysRemaining });
  } else if (daysRemaining <= 60) {
    dueIn60.push({ ...item, dueDate: dueDate.toISOString(), daysRemaining });
  }
});

const sectionStats = ['conditions', 'tools', 'guides', 'printables', 'glossary'].map(section => {
  const items = trackedItems.filter(item => item.section === section);
  return {
    section,
    total: items.length,
    overdue: items.filter(item => overdue.find(over => over.id === item.id)).length,
    dueIn30: items.filter(item => dueIn30.find(due => due.id === item.id)).length,
    dueIn60: items.filter(item => dueIn60.find(due => due.id === item.id)).length,
  };
});

const report = {
  generatedAt: now.toISOString(),
  summary: {
    totalTracked: trackedItems.length,
    overdue: overdue.length,
    dueIn30: dueIn30.length,
    dueIn60: dueIn60.length,
  },
  sections: sectionStats,
  overdue,
  dueIn30,
  dueIn60,
};

await mkdir(resolve(reportDir, 'trust'), { recursive: true });
await writeFile(jsonReportPath, JSON.stringify(report, null, 2));

const markdown = `# Trust Review Report\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `## Summary\n` +
  `- Total tracked pages: ${report.summary.totalTracked}\n` +
  `- Overdue: ${report.summary.overdue}\n` +
  `- Due in 30 days: ${report.summary.dueIn30}\n` +
  `- Due in 60 days: ${report.summary.dueIn60}\n\n` +
  `## Section breakdown\n` +
  sectionStats.map(section => `- ${section.section}: ${section.total} tracked (${section.overdue} overdue, ${section.dueIn30} due in 30 days)`).join('\n') +
  `\n\n` +
  `## Overdue\n` +
  (overdue.length ? overdue.map(item => `- ${item.section}: ${item.path} (due ${item.dueDate})`).join('\n') : 'None') +
  `\n\n` +
  `## Due in 30 days\n` +
  (dueIn30.length ? dueIn30.map(item => `- ${item.section}: ${item.path} (due ${item.dueDate})`).join('\n') : 'None') +
  `\n\n` +
  `## Due in 60 days\n` +
  (dueIn60.length ? dueIn60.map(item => `- ${item.section}: ${item.path} (due ${item.dueDate})`).join('\n') : 'None');

await writeFile(mdReportPath, markdown);

if (report.summary.overdue > 0) {
  process.exit(1);
}
