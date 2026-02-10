#!/usr/bin/env tsx
/**
 * Trust Governance Check Script
 * 
 * Validates route governance registry to ensure:
 * 1. All production routes are present in registry
 * 2. No reviews are overdue
 * 3. Hubs/pathways have Tier A sources
 * 4. Pathways have resource packs
 * 5. All filesystem routes are registered
 * 
 * Run: yarn trust:check
 * CI: Fails if critical errors found
 */

declare const process: {
  exit: (code: number) => never;
  cwd?: () => string;
};

// @ts-ignore - Node.js built-in modules available in tsx runtime
import { readdirSync, statSync } from 'fs';
// @ts-ignore - Node.js built-in modules available in tsx runtime
import { join, sep } from 'path';
import { ROUTE_REGISTRY, validateAllRoutes, getAllOverdueRoutes, getRoutesRequiringTierA } from '../web/lib/trust/routeRegistry.js';

interface CheckResult {
  passed: boolean;
  warnings: string[];
  errors: string[];
}

const result: CheckResult = {
  passed: true,
  warnings: [],
  errors: [],
};

console.log('🛡️  Trust Governance Check');
console.log('='.repeat(60));
console.log('');

/**
 * Check 1: Validate all routes in registry
 */
console.log('📋 Checking route governance...');
const allErrors = validateAllRoutes();
const errorCount = Object.keys(allErrors).length;

if (errorCount > 0) {
  result.passed = false;
  console.log(`❌ Found ${errorCount} route(s) with governance issues:`);
  
  for (const [route, errors] of Object.entries(allErrors)) {
    console.log(`\n  ${route}:`);
    errors.forEach(error => {
      result.errors.push(`${route}: ${error}`);
      console.log(`    • ${error}`);
    });
  }
  console.log('');
} else {
  console.log(`✅ All ${Object.keys(ROUTE_REGISTRY).length} routes pass governance validation`);
}

/**
 * Check 2: Overdue reviews
 */
console.log('\n📅 Checking review schedules...');
const overdueRoutes = getAllOverdueRoutes();

if (overdueRoutes.length > 0) {
  result.warnings.push(`${overdueRoutes.length} route(s) have overdue reviews`);
  console.log(`⚠️  ${overdueRoutes.length} route(s) need review:`);
  
  overdueRoutes.forEach(route => {
    const daysOverdue = Math.floor(
      (new Date().getTime() - new Date(route.nextReview).getTime()) / (1000 * 60 * 60 * 24)
    );
    console.log(`  • ${route.route} (${daysOverdue} days overdue)`);
  });
  console.log('');
} else {
  console.log('✅ All reviews are up to date');
}

/**
 * Check 3: Tier A sources for required routes
 */
console.log('\n🔬 Checking evidence requirements...');
const tierARoutes = getRoutesRequiringTierA();
const tierAIssues = tierARoutes.filter(r => r.primarySources.length === 0);

if (tierAIssues.length > 0) {
  result.passed = false;
  result.errors.push(`${tierAIssues.length} route(s) require Tier A sources but have none specified`);
  console.log(`❌ ${tierAIssues.length} route(s) require Tier A sources:`);
  
  tierAIssues.forEach(route => {
    console.log(`  • ${route.route}`);
  });
  console.log('');
} else {
  console.log(`✅ All ${tierARoutes.length} Tier A routes have primary sources`);
}

/**
 * Check 4: Pathway resource packs
 */
console.log('\n📦 Checking pathway resource packs...');
const pathways = Object.values(ROUTE_REGISTRY).filter(r => r.category === 'pathway');
const pathwaysWithoutPacks = pathways.filter(p => !p.resourcePack);

if (pathwaysWithoutPacks.length > 0) {
  result.warnings.push(`${pathwaysWithoutPacks.length} pathway(s) missing resource packs`);
  console.log(`⚠️  ${pathwaysWithoutPacks.length} pathway(s) need resource packs:`);
  
  pathwaysWithoutPacks.forEach(pathway => {
    console.log(`  • ${pathway.route}`);
  });
  console.log('');
} else {
  console.log(`✅ All ${pathways.length} pathways have resource packs`);
}

/**
 * Check 5: Filesystem route scanning
 * Scan web/app directory for page.tsx files and verify they're registered
 */
console.log('\n🔍 Scanning filesystem for unregistered routes...');

function scanAppDirectory(dir: string, baseDir: string): string[] {
  const routes: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip special Next.js directories
        if (entry.startsWith('_') || entry === 'api' || entry === 'fonts') {
          continue;
        }
        
        // Recursively scan subdirectories
        routes.push(...scanAppDirectory(fullPath, baseDir));
      } else if (entry === 'page.tsx' || entry === 'page.ts') {
        // Convert filesystem path to route path
        const relativePath = fullPath.replace(baseDir, '').replace(/\\/g, '/');
        const routePath = relativePath
          .replace(/\/page\.tsx?$/, '')
          .replace(/\(.*?\)/g, '') // Remove route groups like (auth)
          || '/';
        
        routes.push(routePath);
      }
    }
  } catch (error) {
    console.log(`⚠️  Could not scan directory: ${dir}`);
  }
  
  return routes;
}

const appDir = join(process.cwd ? process.cwd() : '.', 'web', 'app');
const discoveredRoutes = scanAppDirectory(appDir, appDir);

// Exclude routes that shouldn't be in registry (dynamic routes, special pages, etc.)
const excludePatterns = [
  /\/\[.*\]/, // Dynamic routes like [id]
  /\/loading$/,
  /\/error$/,
  /\/not-found$/,
  /\/layout$/,
  /\/template$/,
  /^\/uk\//, // Regional routes (handled separately)
  /^\/us\//,
];

const relevantRoutes = discoveredRoutes.filter(route => {
  return !excludePatterns.some(pattern => pattern.test(route));
});

const unregisteredRoutes = relevantRoutes.filter(route => {
  return !ROUTE_REGISTRY[route];
});

if (unregisteredRoutes.length > 0) {
  result.warnings.push(`${unregisteredRoutes.length} route(s) found in filesystem but not registered`);
  console.log(`⚠️  ${unregisteredRoutes.length} unregistered route(s) found:`);
  
  unregisteredRoutes.forEach(route => {
    console.log(`  • ${route}`);
  });
  console.log('');
  console.log('  To fix: Add these routes to web/lib/trust/routeRegistry.ts');
  console.log('  Note: Routes not in registry will show fallback trust badges');
  console.log('');
} else {
  console.log(`✅ All ${relevantRoutes.length} filesystem routes are registered`);
}

console.log(`   (${discoveredRoutes.length - relevantRoutes.length} routes excluded: dynamic, special, or regional)`);

/**
 * Summary
 */
console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log(`  Routes in registry: ${Object.keys(ROUTE_REGISTRY).length}`);
console.log(`  Errors: ${result.errors.length}`);
console.log(`  Warnings: ${result.warnings.length}`);
console.log('');

if (!result.passed) {
  console.log('❌ Trust check FAILED');
  console.log('');
  console.log('Critical issues must be fixed before deployment.');
  console.log('Run this script again after making changes.');
  process.exit(1);
}

if (result.warnings.length > 0) {
  console.log('⚠️  Trust check PASSED with warnings');
  console.log('');
  console.log('Warnings should be addressed but do not block deployment.');
  process.exit(0);
}

console.log('✅ Trust check PASSED');
console.log('');
console.log('All routes are properly governed. Safe to deploy! 🚀');
process.exit(0);
