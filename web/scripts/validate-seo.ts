/**
 * SEO Validation Script
 * 
 * Validates that all pages have proper SEO metadata, structured data, and accessibility features.
 * Run with: npx tsx scripts/validate-seo.ts
 */

import { promises as fs } from 'fs';
import path from 'path';

interface PageValidation {
  path: string;
  hasMetadata: boolean;
  hasTitle: boolean;
  hasDescription: boolean;
  hasH1: boolean;
  hasStructuredData: boolean;
  issues: string[];
}

const APP_DIR = path.join(process.cwd(), 'app');

// Routes that should have metadata
const INDEXABLE_ROUTES = [
  '/',
  '/about',
  '/about-us',
  '/adhd',
  '/anxiety',
  '/autism',
  '/breathing',
  '/blog',
  '/coach',
  '/contact',
  '/downloads',
  '/dyslexia-reading-training',
  '/get-started',
  '/resources',
  '/schools',
  '/sleep',
  '/stress',
  '/support-us',
  '/teacher-quick-pack',
  '/conditions/adhd-parent',
  '/conditions/adhd-teacher',
  '/conditions/adhd-carer',
  '/conditions/autism-parent',
  '/conditions/autism-teacher',
  '/conditions/autism-carer',
  '/conditions/anxiety-parent',
  '/conditions/anxiety-carer',
  '/conditions/dyslexia-parent',
  '/conditions/dyslexia-teacher',
  '/conditions/dyslexia-carer',
  '/conditions/low-mood-burnout',
  '/conditions/depression',
  '/conditions/bipolar',
  '/techniques/4-7-8',
  '/techniques/box-breathing',
  '/techniques/coherent',
  '/techniques/sos',
  '/breathing/breath',
  '/breathing/focus',
  '/breathing/mindfulness',
  '/breathing/training/focus-garden',
  '/tools',
  '/tools/adhd-tools',
  '/tools/autism-tools',
  '/tools/anxiety-tools',
];

async function findPageFiles(): Promise<string[]> {
  const pageFiles: string[] = [];

  async function walk(dir: string): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('_') && entry.name !== 'api') {
        await walk(fullPath);
      } else if (entry.name === 'page.tsx' || entry.name === 'page.ts') {
        pageFiles.push(fullPath);
      }
    }
  }

  await walk(APP_DIR);
  return pageFiles;
}

async function validatePage(filePath: string): Promise<PageValidation> {
  const content = await fs.readFile(filePath, 'utf-8');
  const relativePath = path.relative(APP_DIR, filePath);
  const routePath = '/' + relativePath.replace(/\/(page\.tsx|page\.ts)$/, '').replace(/\\/g, '/');

  const issues: string[] = [];

  // Check for metadata export
  const hasMetadata = /export\s+(const|let|var)\s+metadata\s*[:=]/.test(content) ||
                       /generateMetadata/.test(content);

  // Check for title
  const hasTitle = /title\s*[:\=]/.test(content) || hasMetadata;

  // Check for description
  const hasDescription = /description\s*[:\=]/.test(content) || hasMetadata;

  // Check for H1
  const hasH1 = /<h1[\s>]/.test(content) || /<H1[\s>]/.test(content);

  // Check for structured data
  const hasStructuredData = /JsonLd/.test(content) ||
                              /generateWebPageSchema/.test(content) ||
                              /generateBreadcrumbSchema/.test(content);

  // Determine if this route should have metadata
  const shouldHaveMetadata = INDEXABLE_ROUTES.some(route => 
    routePath === route || routePath === route.replace(/^\//, '')
  );

  if (shouldHaveMetadata) {
    if (!hasMetadata) issues.push('Missing metadata export');
    if (!hasTitle) issues.push('Missing title');
    if (!hasDescription) issues.push('Missing description');
    if (!hasH1) issues.push('Missing H1 heading');
    if (!hasStructuredData) issues.push('Missing structured data');
  }

  return {
    path: routePath || '/',
    hasMetadata,
    hasTitle,
    hasDescription,
    hasH1,
    hasStructuredData,
    issues,
  };
}

async function main() {
  console.log('🔍 NeuroBreath SEO Validation\n');
  console.log('=' .repeat(80));

  const pageFiles = await findPageFiles();
  console.log(`\n📄 Found ${pageFiles.length} page files\n`);

  const validations: PageValidation[] = [];

  for (const file of pageFiles) {
    const validation = await validatePage(file);
    validations.push(validation);
  }

  // Sort by path
  validations.sort((a, b) => a.path.localeCompare(b.path));

  // Display results
  const criticalIssues = validations.filter(v => v.issues.length > 0);
  const passing = validations.filter(v => v.issues.length === 0);

  console.log(`✅ Passing: ${passing.length} pages`);
  console.log(`❌ Issues: ${criticalIssues.length} pages\n`);

  if (criticalIssues.length > 0) {
    console.log('=' .repeat(80));
    console.log('\n⚠️  Pages with Issues:\n');

    for (const page of criticalIssues) {
      console.log(`\n📍 ${page.path}`);
      console.log(`   Metadata: ${page.hasMetadata ? '✅' : '❌'}`);
      console.log(`   Title: ${page.hasTitle ? '✅' : '❌'}`);
      console.log(`   Description: ${page.hasDescription ? '✅' : '❌'}`);
      console.log(`   H1: ${page.hasH1 ? '✅' : '❌'}`);
      console.log(`   Structured Data: ${page.hasStructuredData ? '✅' : '❌'}`);

      if (page.issues.length > 0) {
        console.log(`   Issues:`);
        page.issues.forEach(issue => console.log(`     • ${issue}`));
      }
    }
  }

  // Summary statistics
  console.log('\n' + '=' .repeat(80));
  console.log('\n📊 Summary Statistics:\n');

  const stats = {
    totalPages: validations.length,
    withMetadata: validations.filter(v => v.hasMetadata).length,
    withTitle: validations.filter(v => v.hasTitle).length,
    withDescription: validations.filter(v => v.hasDescription).length,
    withH1: validations.filter(v => v.hasH1).length,
    withStructuredData: validations.filter(v => v.hasStructuredData).length,
  };

  console.log(`Total Pages: ${stats.totalPages}`);
  console.log(`With Metadata: ${stats.withMetadata} (${Math.round(stats.withMetadata / stats.totalPages * 100)}%)`);
  console.log(`With Title: ${stats.withTitle} (${Math.round(stats.withTitle / stats.totalPages * 100)}%)`);
  console.log(`With Description: ${stats.withDescription} (${Math.round(stats.withDescription / stats.totalPages * 100)}%)`);
  console.log(`With H1: ${stats.withH1} (${Math.round(stats.withH1 / stats.totalPages * 100)}%)`);
  console.log(`With Structured Data: ${stats.withStructuredData} (${Math.round(stats.withStructuredData / stats.totalPages * 100)}%)`);

  console.log('\n' + '=' .repeat(80));

  // Exit with error code if there are critical issues
  if (criticalIssues.length > 0) {
    console.log('\n❌ SEO validation failed. Please address the issues above.\n');
    process.exit(1);
  } else {
    console.log('\n✅ SEO validation passed!\n');
    process.exit(0);
  }
}

main().catch(error => {
  console.error('Error during SEO validation:', error);
  process.exit(1);
});
