import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { canonicalPages } from '../../lib/content/pages';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const output = path.join(rootDir, 'CONTENT_LOCALISATION_AUDIT.md');

const issues: Array<{ level: 'critical' | 'warning'; message: string }> = [];

const checkString = (value: string | undefined, message: string, level: 'critical' | 'warning' = 'critical') => {
  if (!value || value.trim().length === 0) {
    issues.push({ level, message });
  }
};

canonicalPages.forEach(page => {
  checkString(page.id, `[${page.id}] Missing page id`);
  checkString(page.h1?.base, `[${page.id}] Missing base H1`);
  checkString(page.seo?.title?.base, `[${page.id}] Missing base SEO title`);
  checkString(page.seo?.description?.base, `[${page.id}] Missing base SEO description`);

  if (!page.seo?.title?.UK) {
    issues.push({ level: 'warning', message: `[${page.id}] Missing UK SEO title override` });
  }
  if (!page.seo?.title?.US) {
    issues.push({ level: 'warning', message: `[${page.id}] Missing US SEO title override` });
  }

  if (!page.citationsByRegion?.UK?.length) {
    issues.push({ level: 'critical', message: `[${page.id}] Missing UK citations` });
  }
  if (!page.citationsByRegion?.US?.length) {
    issues.push({ level: 'critical', message: `[${page.id}] Missing US citations` });
  }

  page.blocks.forEach(block => {
    if (block.type === 'heading' || block.type === 'paragraph' || block.type === 'callout') {
      checkString(block.text?.base, `[${page.id}] Missing base text for block ${block.id}`);
    }
    if (block.type === 'bullets' || block.type === 'steps') {
      if (!block.items?.length) {
        issues.push({ level: 'critical', message: `[${page.id}] Missing items for block ${block.id}` });
      }
    }
  });
});

const criticalCount = issues.filter(issue => issue.level === 'critical').length;
const warningCount = issues.filter(issue => issue.level === 'warning').length;

const lines = [
  '# Content Localisation Audit',
  '',
  `Critical issues: ${criticalCount}`,
  `Warnings: ${warningCount}`,
  '',
  '## Issues',
];

if (issues.length === 0) {
  lines.push('No issues found.');
} else {
  issues.forEach(issue => {
    lines.push(`- **${issue.level.toUpperCase()}** ${issue.message}`);
  });
}

fs.writeFileSync(output, lines.join('\n'));

if (criticalCount > 0) {
  console.error('Content localisation audit failed.');
  process.exit(1);
}

console.log('Content localisation audit completed.');
