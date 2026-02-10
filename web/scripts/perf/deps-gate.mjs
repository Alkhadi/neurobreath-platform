#!/usr/bin/env node

/**
 * Dependency Budget Gate
 * Checks for new dependencies and enforces size limits
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import budgetsModule from '../../perf/budgets.config.ts';

const PERFORMANCE_BUDGET = budgetsModule?.default ?? budgetsModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = path.resolve(__dirname, '..', '..');
const reportsDir = path.join(webDir, 'reports', 'perf');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Get installed package sizes from node_modules
function getPackageSize(packageName) {
  const packagePath = path.join(webDir, 'node_modules', packageName);
  if (!fs.existsSync(packagePath)) return 0;
  
  try {
    const result = execSync(`du -sk "${packagePath}"`, { encoding: 'utf-8' });
    const sizeKB = parseInt(result.split('\t')[0], 10);
    return sizeKB;
  } catch {
    return 0;
  }
}

// Get current dependencies from package.json
function getCurrentDeps() {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(webDir, 'package.json'), 'utf-8')
  );
  return {
    dependencies: Object.keys(packageJson.dependencies || {}),
    devDependencies: Object.keys(packageJson.devDependencies || {}),
  };
}

// Get baseline dependencies if they exist
function getBaselineDeps() {
  const baselinePath = path.join(webDir, 'perf', 'baseline', 'baseline.deps.json');
  if (!fs.existsSync(baselinePath)) {
    return { dependencies: [], devDependencies: [] };
  }
  return JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
}

// Check if package is allowed
function isAllowed(packageName) {
  return PERFORMANCE_BUDGET.dependencyBudgets.allowlist.some(
    (entry) => entry.package === packageName
  );
}

// Main check
function main() {
  ensureDir(reportsDir);
  
  const current = getCurrentDeps();
  const baseline = getBaselineDeps();
  const { blocklist, maxNewDependenciesCount, maxSingleDependencySizeKB } =
    PERFORMANCE_BUDGET.dependencyBudgets;
  
  // Find new dependencies
  const newDeps = current.dependencies.filter(
    (dep) => !baseline.dependencies.includes(dep)
  );
  const newDevDeps = current.devDependencies.filter(
    (dep) => !baseline.devDependencies.includes(dep)
  );
  
  const violations = [];
  const warnings = [];
  
  // Check blocklist (new dependencies only)
  for (const dep of [...newDeps, ...newDevDeps]) {
    if (blocklist.includes(dep)) {
      violations.push({
        type: 'blocklist',
        package: dep,
        message: `New package "${dep}" is on the blocklist`,
      });
    }
  }
  
  // Check new dependencies count
  if (newDeps.length > maxNewDependenciesCount) {
    violations.push({
      type: 'count',
      message: `Too many new dependencies: ${newDeps.length} (max: ${maxNewDependenciesCount})`,
      packages: newDeps,
    });
  }
  
  // Check size of new dependencies
  for (const dep of newDeps) {
    const sizeKB = getPackageSize(dep);
    if (sizeKB > maxSingleDependencySizeKB && !isAllowed(dep)) {
      violations.push({
        type: 'size',
        package: dep,
        sizeKB,
        message: `Package "${dep}" is ${sizeKB}KB (max: ${maxSingleDependencySizeKB}KB). Add to allowlist with justification if needed.`,
      });
    } else if (sizeKB > maxSingleDependencySizeKB / 2) {
      warnings.push({
        type: 'size-warning',
        package: dep,
        sizeKB,
        message: `Package "${dep}" is ${sizeKB}KB (approaching limit)`,
      });
    }
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    baseline: {
      dependencies: baseline.dependencies.length,
      devDependencies: baseline.devDependencies.length,
    },
    current: {
      dependencies: current.dependencies.length,
      devDependencies: current.devDependencies.length,
    },
    new: {
      dependencies: newDeps,
      devDependencies: newDevDeps,
    },
    violations,
    warnings,
    passed: violations.length === 0,
  };
  
  // Save JSON
  fs.writeFileSync(
    path.join(reportsDir, 'deps.current.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Save markdown
  const lines = [
    '# Dependency Budget Report',
    '',
    `Generated: ${report.timestamp}`,
    '',
    '## Summary',
    `- Current dependencies: ${report.current.dependencies}`,
    `- Current devDependencies: ${report.current.devDependencies}`,
    `- New dependencies: ${newDeps.length}`,
    `- New devDependencies: ${newDevDeps.length}`,
    '',
  ];
  
  if (newDeps.length > 0) {
    lines.push('## New Dependencies');
    for (const dep of newDeps) {
      const sizeKB = getPackageSize(dep);
      lines.push(`- ${dep} (${sizeKB}KB)`);
    }
    lines.push('');
  }
  
  if (violations.length > 0) {
    lines.push('## ❌ Violations');
    for (const v of violations) {
      lines.push(`- **${v.type}**: ${v.message}`);
    }
    lines.push('');
  }
  
  if (warnings.length > 0) {
    lines.push('## ⚠️  Warnings');
    for (const w of warnings) {
      lines.push(`- ${w.message}`);
    }
    lines.push('');
  }
  
  if (violations.length === 0 && warnings.length === 0) {
    lines.push('## ✓ All checks passed');
  }
  
  fs.writeFileSync(path.join(reportsDir, 'deps.current.md'), lines.join('\n'));
  
  // Console output
  console.log('\n📦 Dependency Budget Gate');
  console.log(`  New dependencies: ${newDeps.length}`);
  console.log(`  Violations: ${violations.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  
  if (violations.length > 0) {
    console.error('\n❌ Dependency budget violations found');
    process.exit(PERFORMANCE_BUDGET.ciConfig.failOnRegression ? 1 : 0);
  }
  
  console.log('\n✓ Dependency budget checks passed');
}

main();
