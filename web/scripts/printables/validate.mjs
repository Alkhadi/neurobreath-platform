import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import * as printablesModule from '../../lib/printables/printables.ts';
import * as journeysModule from '../../lib/journeys/journeys.ts';
import * as guidesModule from '../../lib/guides/guides.ts';
import * as toolsModule from '../../lib/tools/tools.ts';
import * as pagesModule from '../../lib/content/pages/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const reportsDir = path.resolve(__dirname, '../../reports');

const issues = [];

const { PRINTABLES } = printablesModule.default ?? printablesModule;
const { getJourneyById } = journeysModule.default ?? journeysModule;
const { getGuideById } = guidesModule.default ?? guidesModule;
const { getToolById } = toolsModule.default ?? toolsModule;
const { canonicalPagesBySlug } = pagesModule.default ?? pagesModule;

const addIssue = (level, message, printableId, field) => {
  issues.push({ level, message, printableId, field });
};

const hasValidDate = value => !Number.isNaN(new Date(value).getTime());

const isGuideReferenceValid = value => {
  if (getGuideById(value)) return true;
  if (canonicalPagesBySlug[value]) return true;
  if (value.startsWith('/guides/')) return true;
  return false;
};

for (const printable of PRINTABLES) {
  const requiredFields = [
    'id',
    'title',
    'summary',
    'audience',
    'type',
    'conditionTags',
    'supportNeedsTags',
    'estimatedTimeToUse',
    'formatOptions',
    'sections',
    'citationsByRegion',
    'reviewedAt',
    'reviewIntervalDays',
    'internalLinks',
  ];

  requiredFields.forEach(field => {
    if (!printable[field]) {
      addIssue('critical', `Missing required field: ${field}`, printable.id, field);
    }
  });

  if (!hasValidDate(printable.reviewedAt)) {
    addIssue('critical', 'Invalid reviewedAt date', printable.id, 'reviewedAt');
  }

  const citationsCount =
    printable.citationsByRegion.global.length +
    printable.citationsByRegion.uk.length +
    printable.citationsByRegion.us.length;

  if (printable.conditionTags.length > 0 && citationsCount === 0) {
    addIssue('critical', 'Evidence-tagged printable missing citations', printable.id, 'citationsByRegion');
  }

  const relatedJourneys = printable.internalLinks.relatedJourneys || [];
  const relatedGuides = printable.internalLinks.relatedGuides || [];
  const relatedTools = printable.internalLinks.relatedTools || [];

  const hasMinimumLinks = relatedJourneys.length + relatedTools.length >= 1 || relatedGuides.length >= 3;
  if (!hasMinimumLinks) {
    addIssue('critical', 'Insufficient related resources (needs 1 journey/tool or 3 guides)', printable.id, 'internalLinks');
  }

  relatedJourneys.forEach(id => {
    if (!getJourneyById(id)) {
      addIssue('critical', `Broken journey reference: ${id}`, printable.id, 'internalLinks.relatedJourneys');
    }
  });

  relatedTools.forEach(id => {
    if (!getToolById(id)) {
      addIssue('critical', `Broken tool reference: ${id}`, printable.id, 'internalLinks.relatedTools');
    }
  });

  relatedGuides.forEach(value => {
    if (!isGuideReferenceValid(value)) {
      addIssue('critical', `Broken guide reference: ${value}`, printable.id, 'internalLinks.relatedGuides');
    }
  });

  if (!printable.formatOptions.printPage) {
    addIssue('warning', 'Print page disabled for printable', printable.id, 'formatOptions');
  }
}

const summary = {
  total: PRINTABLES.length,
  critical: issues.filter(issue => issue.level === 'critical').length,
  warning: issues.filter(issue => issue.level === 'warning').length,
};

const report = {
  generatedAt: new Date().toISOString(),
  summary,
  issues,
};

await fs.mkdir(reportsDir, { recursive: true });
await fs.writeFile(path.join(reportsDir, 'printables-validation.json'), JSON.stringify(report, null, 2));

const markdown = `# Printables Validation Report\n\n` +
  `Generated: ${report.generatedAt}\n\n` +
  `## Summary\n` +
  `- Total printables: ${summary.total}\n` +
  `- Critical issues: ${summary.critical}\n` +
  `- Warnings: ${summary.warning}\n\n` +
  `## Issues\n` +
  (issues.length
    ? issues.map(issue => `- [${issue.level.toUpperCase()}] ${issue.printableId}: ${issue.message}`).join('\n')
    : 'No issues found.');

await fs.writeFile(path.join(reportsDir, 'printables-validation.md'), markdown);

if (summary.critical > 0) {
  process.exit(1);
}
