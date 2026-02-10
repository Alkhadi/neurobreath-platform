#!/usr/bin/env node

/**
 * Route Inventory Script
 * 
 * Scans the Next.js app directory to discover all routes and their patterns.
 * Handles dynamic segments, route groups, and parallel routes correctly.
 * 
 * Output: .seo/routes.json
 */

import { readdir, mkdir, writeFile } from 'fs/promises';
import { join, relative, sep } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const WEB_ROOT = join(__dirname, '../..');
const APP_DIR = join(WEB_ROOT, 'app');
const OUTPUT_DIR = join(WEB_ROOT, '.seo');
const OUTPUT_FILE = join(OUTPUT_DIR, 'routes.json');

const REPORTS_DIR = join(WEB_ROOT, 'reports', 'audits');
const REPORT_JSON = join(REPORTS_DIR, 'route-inventory.json');
const REPORT_MD = join(REPORTS_DIR, 'route-inventory.md');

const PAGE_FILES = ['page.tsx', 'page.jsx', 'page.ts', 'page.js', 'page.mdx'];
const EXCLUDED_FILES = ['layout', 'template', 'loading', 'error', 'not-found', 'route', 'default', 'middleware'];

/**
 * Check if a directory segment should be excluded from URL path
 */
function isSpecialSegment(segment) {
  // Route groups: (marketing), (auth), etc.
  if (segment.match(/^\([^)]+\)$/)) {
    return { exclude: true, type: 'route-group' };
  }
  
  // Parallel routes: @modal, @sidebar, etc.
  if (segment.startsWith('@')) {
    return { exclude: true, type: 'parallel-route' };
  }
  
  // Dynamic segments: [id], [...slug], [[...slug]]
  if (segment.startsWith('[') && segment.endsWith(']')) {
    const isOptional = segment.startsWith('[[') && segment.endsWith(']]');
    const isCatchAll = segment.includes('...');
    const paramName = segment.replace(/[\[\]\.]/g, '');
    
    return {
      exclude: false,
      type: 'dynamic',
      isDynamic: true,
      isOptional,
      isCatchAll,
      paramName,
      pattern: isOptional 
        ? `[[...${paramName}]]`
        : isCatchAll 
          ? `[...${paramName}]`
          : `[${paramName}]`
    };
  }
  
  return { exclude: false, type: 'static' };
}

/**
 * Convert file path to URL path
 */
function pathToUrl(relativePath) {
  const segments = relativePath.split(sep);
  const urlSegments = [];
  const dynamicSegments = [];
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    
    // Skip page file itself
    if (PAGE_FILES.some(pageFile => segment === pageFile)) {
      continue;
    }
    
    const analysis = isSpecialSegment(segment);
    
    if (analysis.exclude) {
      // Skip route groups and parallel routes
      continue;
    }
    
    if (analysis.isDynamic) {
      // Dynamic segment
      urlSegments.push(`:${analysis.paramName}`);
      dynamicSegments.push({
        name: analysis.paramName,
        pattern: analysis.pattern,
        isOptional: analysis.isOptional,
        isCatchAll: analysis.isCatchAll,
        index: urlSegments.length - 1
      });
    } else {
      // Static segment
      urlSegments.push(segment);
    }
  }
  
  const url = '/' + urlSegments.join('/');
  
  return {
    url: url === '/' ? '/' : url.replace(/\/$/, ''), // Remove trailing slash except root
    isDynamic: dynamicSegments.length > 0,
    dynamicSegments: dynamicSegments.length > 0 ? dynamicSegments : undefined
  };
}

/**
 * Recursively scan directory for page files
 */
async function scanDirectory(dir, baseDir = dir) {
  const routes = [];
  
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      const relativePath = relative(baseDir, fullPath);
      
      if (entry.isDirectory()) {
        // Skip api routes
        if (entry.name === 'api') {
          continue;
        }
        
        // Recursively scan subdirectories
        const subRoutes = await scanDirectory(fullPath, baseDir);
        routes.push(...subRoutes);
      } else if (entry.isFile()) {
        // Check if it's a page file
        const isPageFile = PAGE_FILES.includes(entry.name);
        const isExcluded = EXCLUDED_FILES.some(excluded => entry.name.startsWith(excluded));
        
        if (isPageFile && !isExcluded) {
          const urlInfo = pathToUrl(relativePath);
          
          routes.push({
            path: relativePath,
            url: urlInfo.url,
            pattern: urlInfo.url,
            isDynamic: urlInfo.isDynamic,
            dynamicSegments: urlInfo.dynamicSegments,
            file: entry.name
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}:`, error.message);
  }
  
  return routes;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Scanning Next.js app directory for routes...\n');
  console.log(`App directory: ${APP_DIR}`);
  console.log(`Output: ${OUTPUT_FILE}\n`);
  
  // Scan for routes
  const routes = await scanDirectory(APP_DIR);
  
  // Sort routes
  routes.sort((a, b) => a.url.localeCompare(b.url));
  
  // Statistics
  const staticRoutes = routes.filter(r => !r.isDynamic);
  const dynamicRoutes = routes.filter(r => r.isDynamic);
  
  console.log(`✅ Found ${routes.length} routes:`);
  console.log(`   - ${staticRoutes.length} static routes`);
  console.log(`   - ${dynamicRoutes.length} dynamic routes\n`);
  
  if (dynamicRoutes.length > 0) {
    console.log('📍 Dynamic routes requiring fixtures:');
    dynamicRoutes.forEach(route => {
      console.log(`   - ${route.pattern}`);
      route.dynamicSegments.forEach(seg => {
        console.log(`     ↳ :${seg.name} (${seg.pattern})`);
      });
    });
    console.log();
  }
  
  // Ensure output directory exists
  try {
    await mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }

  try {
    await mkdir(REPORTS_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }
  
  // Write output
  const output = {
    generatedAt: new Date().toISOString(),
    appDirectory: relative(WEB_ROOT, APP_DIR),
    totalRoutes: routes.length,
    staticRoutes: staticRoutes.length,
    dynamicRoutes: dynamicRoutes.length,
    routes
  };
  
  await writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

  const mdLines = [];
  mdLines.push('# Route Inventory');
  mdLines.push('');
  mdLines.push(`Generated: ${output.generatedAt}`);
  mdLines.push('');
  mdLines.push(`- Total routes: ${output.totalRoutes}`);
  mdLines.push(`- Static routes: ${output.staticRoutes}`);
  mdLines.push(`- Dynamic routes: ${output.dynamicRoutes}`);
  mdLines.push('');
  mdLines.push('## Routes');
  mdLines.push('');
  mdLines.push('| URL pattern | Dynamic | Source |');
  mdLines.push('|---|---:|---|');
  for (const r of routes) {
    const dynamicLabel = r.isDynamic ? 'yes' : 'no';
    mdLines.push(`| ${r.pattern} | ${dynamicLabel} | app/${r.path} |`);
  }
  mdLines.push('');

  await writeFile(REPORT_JSON, JSON.stringify(output, null, 2));
  await writeFile(REPORT_MD, mdLines.join('\n'));
  
  console.log(`✅ Route inventory saved to: ${relative(WEB_ROOT, OUTPUT_FILE)}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review the routes.json file`);
  
  if (dynamicRoutes.length > 0) {
    console.log(`   2. Add fixtures for dynamic routes in lib/seo/route-fixtures.ts`);
    console.log(`   3. Run: yarn seo:scan`);
  } else {
    console.log(`   2. Run: yarn seo:scan`);
    console.log(`✅ Route inventory report saved to: ${relative(WEB_ROOT, REPORT_JSON)}`);
  }
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
