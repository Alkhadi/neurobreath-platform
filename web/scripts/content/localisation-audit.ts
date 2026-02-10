import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { canonicalPages } from '../../lib/content/pages';
import type { LocalisedString } from '../../lib/content/canonical-schema';

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

const checkRequiredOverride = (value: LocalisedString | undefined, message: string) => {
  if (!value?.requireOverride) return;
  if (!value.UK || value.UK.trim().length === 0) {
    issues.push({ level: 'critical', message: `${message} Missing required UK override` });
  }
  if (!value.US || value.US.trim().length === 0) {
    issues.push({ level: 'critical', message: `${message} Missing required US override` });
  }
  if (value.UK && value.US && value.UK.trim() === value.US.trim()) {
    issues.push({ level: 'warning', message: `${message} UK/US overrides are identical` });
  }
};

canonicalPages.forEach(page => {
  checkString(page.id, `[${page.id}] Missing page id`);
  checkString(page.h1?.base, `[${page.id}] Missing base H1`);
  checkString(page.seo?.title?.base, `[${page.id}] Missing base SEO title`);
  checkString(page.seo?.description?.base, `[${page.id}] Missing base SEO description`);

  checkRequiredOverride(page.seo?.title, `[${page.id}] SEO title`);
  checkRequiredOverride(page.seo?.description, `[${page.id}] SEO description`);

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
      checkRequiredOverride(block.text, `[${page.id}] Block ${block.id}`);
    }
    if (block.type === 'bullets' || block.type === 'steps') {
      if (!block.items?.length) {
        issues.push({ level: 'critical', message: `[${page.id}] Missing items for block ${block.id}` });
      }
      block.items?.forEach((item, index) => {
        checkString(item?.base, `[${page.id}] Missing base text for item ${block.id}[${index}]`);
        checkRequiredOverride(item, `[${page.id}] Item ${block.id}[${index}]`);
      });
    }
  });

  if (page.faqs?.base?.length) {
    page.faqs.base.forEach((faq, index) => {
      checkString(faq.question?.base, `[${page.id}] Missing base FAQ question ${index}`);
      checkString(faq.answer?.base, `[${page.id}] Missing base FAQ answer ${index}`);
      checkRequiredOverride(faq.question, `[${page.id}] FAQ question ${index}`);
      checkRequiredOverride(faq.answer, `[${page.id}] FAQ answer ${index}`);
    });
  }
});

const pagesWithOverrides = canonicalPages.filter(page =>
  page.blocks.some(block => {
    if (block.type === 'heading' || block.type === 'paragraph' || block.type === 'callout') {
      return Boolean(block.text?.requireOverride);
    }
    if (block.type === 'bullets' || block.type === 'steps') {
      return block.items?.some(item => item.requireOverride) ?? false;
    }
    return false;
  }),
);

if (pagesWithOverrides.length === 0) {
  issues.push({ level: 'warning', message: 'No pages use requireOverride; UK/US divergence may be untested.' });
}

const citationDiff = canonicalPages.some(page => {
  const uk = page.citationsByRegion?.UK?.join(',') || '';
  const us = page.citationsByRegion?.US?.join(',') || '';
  return uk !== us;
});

if (!citationDiff) {
  issues.push({ level: 'critical', message: 'UK/US citations are identical across pages; add region-specific evidence.' });
}

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
