#!/usr/bin/env node

/**
 * Performance Comparison Engine
 * Compares current results against baseline
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import budgetsModule from '../../perf/budgets.config.ts';

const PERFORMANCE_BUDGET = budgetsModule?.default ?? budgetsModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = path.resolve(__dirname, '..', '..');
const reportsDir = path.join(webDir, 'reports', 'perf');
const baselineDir = path.join(webDir, 'perf', 'baseline');

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function main() {
  const baseline = loadJSON(path.join(baselineDir, 'baseline.lighthouse.json'));
  const current = loadJSON(path.join(reportsDir, 'lighthouse.current.json'));
  
  if (!baseline) {
    console.warn('⚠️  No baseline found. Run with --baseline first.');
    console.log('✓ Skipping comparison (no baseline)');
    return;
  }
  
  if (!current) {
    console.error('❌ No current results found');
    process.exit(1);
  }
  
  const failures = [];
  const warnings = [];
  const improvements = [];
  
  // Compare each route
  for (const currentRoute of current) {
    const baselineRoute = baseline.find((r) => r.route === currentRoute.route);
    if (!baselineRoute) continue;
    
    const { lighthouseBudgets, webVitalsProxies } = PERFORMANCE_BUDGET;
    
    // Check Lighthouse scores
    const scores = currentRoute.scores;
    if (scores.performance < lighthouseBudgets.performanceScoreMin) {
      failures.push({
        route: currentRoute.route,
        metric: 'Performance Score',
        current: scores.performance,
        threshold: lighthouseBudgets.performanceScoreMin,
        type: 'score',
      });
    }
    if (scores.accessibility < lighthouseBudgets.accessibilityScoreMin) {
      failures.push({
        route: currentRoute.route,
        metric: 'Accessibility Score',
        current: scores.accessibility,
        threshold: lighthouseBudgets.accessibilityScoreMin,
        type: 'score',
      });
    }
    if (scores.bestPractices < lighthouseBudgets.bestPracticesScoreMin) {
      failures.push({
        route: currentRoute.route,
        metric: 'Best Practices Score',
        current: scores.bestPractices,
        threshold: lighthouseBudgets.bestPracticesScoreMin,
        type: 'score',
      });
    }
    if (scores.seo < lighthouseBudgets.seoScoreMin) {
      failures.push({
        route: currentRoute.route,
        metric: 'SEO Score',
        current: scores.seo,
        threshold: lighthouseBudgets.seoScoreMin,
        type: 'score',
      });
    }
    
    // Check Web Vitals
    const vitals = currentRoute.vitals;
    if (vitals.tbt > webVitalsProxies.maxTotalBlockingTimeMs) {
      failures.push({
        route: currentRoute.route,
        metric: 'Total Blocking Time',
        current: Math.round(vitals.tbt),
        threshold: webVitalsProxies.maxTotalBlockingTimeMs,
        type: 'vital',
        unit: 'ms',
      });
    }
    if (vitals.lcp > webVitalsProxies.maxLargestContentfulPaintMs) {
      failures.push({
        route: currentRoute.route,
        metric: 'Largest Contentful Paint',
        current: Math.round(vitals.lcp),
        threshold: webVitalsProxies.maxLargestContentfulPaintMs,
        type: 'vital',
        unit: 'ms',
      });
    }
    if (vitals.cls > webVitalsProxies.maxCumulativeLayoutShift) {
      failures.push({
        route: currentRoute.route,
        metric: 'Cumulative Layout Shift',
        current: vitals.cls.toFixed(3),
        threshold: webVitalsProxies.maxCumulativeLayoutShift,
        type: 'vital',
        unit: '',
      });
    }
    if (vitals.fcp > webVitalsProxies.maxFirstContentfulPaintMs) {
      warnings.push({
        route: currentRoute.route,
        metric: 'First Contentful Paint',
        current: Math.round(vitals.fcp),
        threshold: webVitalsProxies.maxFirstContentfulPaintMs,
        type: 'vital',
        unit: 'ms',
      });
    }
    
    // Check for improvements
    if (scores.performance > baselineRoute.scores.performance + 5) {
      improvements.push({
        route: currentRoute.route,
        metric: 'Performance Score',
        baseline: baselineRoute.scores.performance,
        current: scores.performance,
        delta: scores.performance - baselineRoute.scores.performance,
      });
    }
  }
  
  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    passed: failures.length === 0,
    failures,
    warnings,
    improvements,
  };
  
  fs.writeFileSync(
    path.join(reportsDir, 'perf-gate.summary.json'),
    JSON.stringify(summary, null, 2)
  );
  
  // Generate markdown
  const lines = [
    '# Performance Budget Gate Summary',
    '',
    `Generated: ${summary.timestamp}`,
    `Status: ${summary.passed ? '✓ PASSED' : '❌ FAILED'}`,
    '',
    `- Failures: ${failures.length}`,
    `- Warnings: ${warnings.length}`,
    `- Improvements: ${improvements.length}`,
    '',
  ];
  
  if (failures.length > 0) {
    lines.push('## ❌ Failures');
    lines.push('');
    for (const f of failures) {
      lines.push(
        `- **${f.route}** - ${f.metric}: ${f.current}${f.unit || ''} (threshold: ${f.threshold}${f.unit || ''})`
      );
    }
    lines.push('');
  }
  
  if (warnings.length > 0) {
    lines.push('## ⚠️  Warnings');
    lines.push('');
    for (const w of warnings) {
      lines.push(
        `- **${w.route}** - ${w.metric}: ${w.current}${w.unit || ''} (threshold: ${w.threshold}${w.unit || ''})`
      );
    }
    lines.push('');
  }
  
  if (improvements.length > 0) {
    lines.push('## ✨ Improvements');
    lines.push('');
    for (const i of improvements) {
      lines.push(`- **${i.route}** - ${i.metric}: +${i.delta} (${i.baseline} → ${i.current})`);
    }
    lines.push('');
  }
  
  if (failures.length > 0) {
    lines.push('## Remediation Hints');
    lines.push('');
    lines.push('1. Run `npm run perf:autoplan` to get optimization recommendations');
    lines.push('2. Check bundle sizes with `npm run analyze`');
    lines.push('3. Review new dependencies with deps report');
    lines.push('4. See PERFORMANCE_BUDGETS.md for optimization playbook');
    lines.push('');
  }
  
  fs.writeFileSync(path.join(reportsDir, 'perf-gate.summary.md'), lines.join('\n'));
  
  // Console output
  console.log('\n⚡ Performance Budget Gate Summary');
  console.log(`  Failures: ${failures.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Improvements: ${improvements.length}`);
  
  if (failures.length > 0) {
    console.error('\n❌ Performance budget failures detected');
    failures.forEach((f) => {
      console.error(
        `  ${f.route}: ${f.metric} = ${f.current}${f.unit || ''} (threshold: ${f.threshold}${f.unit || ''})`
      );
    });
    
    if (PERFORMANCE_BUDGET.ciConfig.failOnRegression) {
      process.exit(1);
    }
  }
  
  console.log('\n✓ Performance budget checks completed');
}

main();
