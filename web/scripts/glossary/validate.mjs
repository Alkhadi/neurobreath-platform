#!/usr/bin/env node

import { writeFile, mkdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import * as glossary from '../../lib/glossary/glossary.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '../..');
const reportDir = resolve(rootDir, 'reports');
const jsonReportPath = resolve(reportDir, 'glossary-validation.json');
const mdReportPath = resolve(reportDir, 'glossary-validation.md');

const errors = [];
const warnings = [];

const idSet = new Set();
const { GLOSSARY_TERMS } = glossary.default ?? glossary;

const requiredFields = [
  'id',
  'term',
  'plainEnglishDefinition',
  'extendedDefinition',
  'whyItMattersHere',
  'commonMisunderstandings',
  'relatedTerms',
  'tags',
  'recommendedNextLinks',
  'citationsByRegion',
  'reviewedAt',
  'reviewIntervalDays',
];

GLOSSARY_TERMS.forEach(term => {
  requiredFields.forEach(field => {
    if (term[field] === undefined || term[field] === null) {
      errors.push({ id: term.id, code: 'MISSING_FIELD', message: `Missing ${field}.` });
    }
  });

  if (idSet.has(term.id)) {
    errors.push({ id: term.id, code: 'DUPLICATE_ID', message: `Duplicate id ${term.id}.` });
  }
  idSet.add(term.id);

  term.relatedTerms.forEach(related => {
    if (!GLOSSARY_TERMS.find(item => item.id === related)) {
      errors.push({ id: term.id, code: 'MISSING_RELATED', message: `Related term ${related} not found.` });
    }
  });

  if (term.tags.includes('evidence')) {
    const citations = term.citationsByRegion;
    const hasCitation =
      citations.global.length > 0 || citations.uk.length > 0 || citations.us.length > 0;
    if (!hasCitation) {
      errors.push({ id: term.id, code: 'MISSING_CITATION', message: 'Evidence term lacks citations.' });
    }
  }

  if (term.commonMisunderstandings.length < 2) {
    warnings.push({ id: term.id, code: 'LOW_MISUNDERSTANDINGS', message: 'Add 2–4 misunderstandings.' });
  }
});

const report = {
  generatedAt: new Date().toISOString(),
  termCount: GLOSSARY_TERMS.length,
  errors,
  warnings,
};

const mdLines = [
  '# Glossary validation report',
  '',
  `Generated: ${report.generatedAt}`,
  `Total terms: ${report.termCount}`,
  '',
  `Errors: ${errors.length}`,
  `Warnings: ${warnings.length}`,
  '',
  '## Errors',
  ...(errors.length
    ? errors.map(err => `- **${err.id}** (${err.code}): ${err.message}`)
    : ['- None']),
  '',
  '## Warnings',
  ...(warnings.length
    ? warnings.map(err => `- **${err.id}** (${err.code}): ${err.message}`)
    : ['- None']),
];

await mkdir(reportDir, { recursive: true });
await writeFile(jsonReportPath, JSON.stringify(report, null, 2));
await writeFile(mdReportPath, mdLines.join('\n'));

if (errors.length) {
  console.error('Glossary validation failed with errors.');
  process.exit(1);
}

console.log('Glossary validation passed.');
