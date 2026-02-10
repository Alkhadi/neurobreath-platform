#!/usr/bin/env node

/**
 * NeuroBreath Route Scaffolder
 * Generates new routes/pages based on route type templates
 * 
 * Usage:
 *   npm run scaffold:route -- --type=condition --slug=adhd
 *   npm run scaffold:route -- --type=tool --slug=breathing/box-breathing --force
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route types
const ROUTE_TYPES = [
  'home-landing',
  'hub',
  'condition',
  'tool',
  'guide',
  'journey',
  'glossary',
  'printable',
  'trust',
];

// Parse CLI arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    type: null,
    slug: null,
    force: false,
    regionMode: 'split', // 'split' | 'shared'
    title: null,
    summary: null,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--type=')) {
      parsed.type = arg.split('=')[1];
    } else if (arg.startsWith('--slug=')) {
      parsed.slug = arg.split('=')[1];
    } else if (arg === '--force') {
      parsed.force = true;
    } else if (arg.startsWith('--regionMode=')) {
      parsed.regionMode = arg.split('=')[1];
    } else if (arg.startsWith('--title=')) {
      parsed.title = arg.split('=')[1];
    } else if (arg.startsWith('--summary=')) {
      parsed.summary = arg.split('=')[1];
    }
  }

  return parsed;
}

// Validate arguments
function validate(args) {
  const errors = [];

  if (!args.type) {
    errors.push('--type is required');
  } else if (!ROUTE_TYPES.includes(args.type)) {
    errors.push(`--type must be one of: ${ROUTE_TYPES.join(', ')}`);
  }

  if (!args.slug) {
    errors.push('--slug is required');
  } else if (!/^[a-z0-9-/]+$/.test(args.slug)) {
    errors.push('--slug must be lowercase, hyphenated, and may include forward slashes');
  }

  if (!['split', 'shared'].includes(args.regionMode)) {
    errors.push('--regionMode must be "split" or "shared"');
  }

  return errors;
}

// Check if route exists
function routeExists(slug, region = null) {
  const webDir = path.join(__dirname, '../..');
  let routePath;

  if (region) {
    routePath = path.join(webDir, 'app', region, slug, 'page.tsx');
  } else {
    routePath = path.join(webDir, 'app', slug, 'page.tsx');
  }

  return fs.existsSync(routePath);
}

// Load template
async function loadTemplate(type) {
  try {
    const templatePath = path.join(__dirname, 'templates', `${type}.ts`);
    const { default: template } = await import(templatePath);
    return template;
  } catch (error) {
    console.error(`❌ Failed to load template for type "${type}"`);
    console.error(`   Template file: templates/${type}.ts`);
    console.error(`   Error: ${error.message}`);
    throw error;
  }
}

// Generate route files
function generateRouteFiles(args, template) {
  const webDir = path.join(__dirname, '../..');
  const files = [];

  const context = {
    slug: args.slug,
    type: args.type,
    title: args.title || `TODO: Add title for ${args.slug}`,
    summary: args.summary || `TODO: Add summary for ${args.slug}`,
  };

  if (args.regionMode === 'split') {
    // Generate UK and US routes
    ['uk', 'us'].forEach((region) => {
      const routePath = path.join(webDir, 'app', region, args.slug);
      const pagePath = path.join(routePath, 'page.tsx');

      const pageContent = template.generatePage({ ...context, region });

      files.push({ path: pagePath, content: pageContent });
    });

    // Generate shared content file
    const contentPath = path.join(webDir, 'content', args.type, `${args.slug.replace(/\//g, '-')}.content.ts`);
    const contentContent = template.generateContent(context);

    files.push({ path: contentPath, content: contentContent });
  } else {
    // Generate shared route with [region] support
    const routePath = path.join(webDir, 'app/[region]', args.slug);
    const pagePath = path.join(routePath, 'page.tsx');

    const pageContent = template.generateSharedPage(context);

    files.push({ path: pagePath, content: pageContent });

    // Generate content file
    const contentPath = path.join(webDir, 'content', args.type, `${args.slug.replace(/\//g, '-')}.content.ts`);
    const contentContent = template.generateContent(context);

    files.push({ path: contentPath, content: contentContent });
  }

  return files;
}

// Write files
function writeFiles(files, force = false) {
  const created = [];
  const skipped = [];

  files.forEach(({ path: filePath, content }) => {
    if (fs.existsSync(filePath) && !force) {
      skipped.push(filePath);
      return;
    }

    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, content, 'utf8');
    created.push(filePath);
  });

  return { created, skipped };
}

// Main
async function main() {
  console.log('🏗️  NeuroBreath Route Scaffolder\n');

  const args = parseArgs();
  const errors = validate(args);

  if (errors.length > 0) {
    console.error('❌ Validation errors:\n');
    errors.forEach((err) => console.error(`   - ${err}`));
    console.error('\nUsage:');
    console.error('  npm run scaffold:route -- --type=condition --slug=adhd');
    console.error('  npm run scaffold:route -- --type=tool --slug=breathing/box-breathing --force');
    console.error('\nRoute types:', ROUTE_TYPES.join(', '));
    process.exit(1);
  }

  // Check for existing routes (unless --force)
  if (!args.force) {
    const existsUK = routeExists(args.slug, 'uk');
    const existsUS = routeExists(args.slug, 'us');

    if (existsUK || existsUS) {
      console.error(`❌ Route already exists for slug "${args.slug}"`);
      console.error('   Use --force to overwrite');
      process.exit(1);
    }
  }

  console.log(`📋 Type: ${args.type}`);
  console.log(`📁 Slug: ${args.slug}`);
  console.log(`🌍 Region mode: ${args.regionMode}`);
  console.log('');

  // Load template
  console.log(`📦 Loading template for type "${args.type}"...`);
  const template = await loadTemplate(args.type);

  // Generate files
  console.log('🔨 Generating files...');
  const files = generateRouteFiles(args, template);

  // Write files
  const { created, skipped } = writeFiles(files, args.force);

  // Report
  console.log('');
  if (created.length > 0) {
    console.log(`✅ Created ${created.length} file(s):\n`);
    created.forEach((file) => {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   ✓ ${relativePath}`);
    });
  }

  if (skipped.length > 0) {
    console.log(`\n⚠️  Skipped ${skipped.length} existing file(s):`);
    skipped.forEach((file) => {
      const relativePath = path.relative(process.cwd(), file);
      console.log(`   - ${relativePath}`);
    });
    console.log('\n   Use --force to overwrite');
  }

  console.log('\n📚 Next steps:');
  console.log('   1. Update content in generated content file');
  console.log('   2. Run: npm run lint && npm run typecheck');
  console.log('   3. Run: npm run build');
  console.log('   4. Test visually in browser');
  console.log('   5. Run: npm run test:visual');
  console.log('   6. Run: npm run perf:gate');
  console.log('\n📖 See: SCAFFOLDER_GUIDE.md for more details');
}

main().catch((error) => {
  console.error('\n❌ Scaffolder failed:', error.message);
  process.exit(1);
});
