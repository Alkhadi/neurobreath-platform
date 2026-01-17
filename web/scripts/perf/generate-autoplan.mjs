#!/usr/bin/env node

/**
 * Optimisation AutoPlan Generator
 * Analyzes performance failures and generates actionable recommendations
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webDir = path.resolve(__dirname, '..');
const reportsDir = path.join(webDir, 'reports', 'perf');

// Recommendation taxonomy
const RECOMMENDATIONS = {
  'high-tbt': {
    category: 'JS/Bundle reduction',
    why: 'High Total Blocking Time indicates too much JavaScript execution blocking the main thread',
    actions: [
      {
        title: 'Split large components into dynamic imports',
        risk: 'low',
        effort: 'M',
        impact: 'large',
        where: 'Heavy client components in route',
        verify: 'Re-run perf gate and check TBT reduced by 30%+',
      },
      {
        title: 'Move non-critical UI to client-only islands',
        risk: 'low',
        effort: 'M',
        impact: 'medium',
        where: 'Below-the-fold components',
        verify: 'Check bundle size reduced and TBT improved',
      },
      {
        title: 'Reduce client JS on page (make more server components)',
        risk: 'medium',
        effort: 'L',
        impact: 'large',
        where: 'Convert layout/page to server components where possible',
        verify: 'Bundle analysis shows smaller client JS',
      },
    ],
  },
  'high-lcp': {
    category: 'Rendering and hydration',
    why: 'High LCP means the largest visible element takes too long to render',
    actions: [
      {
        title: 'Optimize hero images with next/image priority',
        risk: 'low',
        effort: 'S',
        impact: 'large',
        where: 'Hero sections on landing pages',
        verify: 'LCP should drop to under 2s',
      },
      {
        title: 'Preconnect to critical domains',
        risk: 'low',
        effort: 'S',
        impact: 'small',
        where: 'Add <link rel="preconnect"> in metadata',
        verify: 'Check network waterfall for earlier connections',
      },
      {
        title: 'Reduce above-the-fold client components',
        risk: 'medium',
        effort: 'M',
        impact: 'medium',
        where: 'Hero/header components',
        verify: 'LCP improved and less hydration work',
      },
    ],
  },
  'high-cls': {
    category: 'Layout stability',
    why: 'High CLS indicates layout shifts during page load',
    actions: [
      {
        title: 'Reserve space for images with explicit width/height',
        risk: 'low',
        effort: 'S',
        impact: 'large',
        where: 'All next/image components',
        verify: 'CLS should drop to < 0.1',
      },
      {
        title: 'Use font-display: swap with fallback metrics',
        risk: 'low',
        effort: 'M',
        impact: 'medium',
        where: 'Global font configuration',
        verify: 'Check for reduced font-loading shifts',
      },
      {
        title: 'Ensure dialogs/modals do not cause reflow',
        risk: 'low',
        effort: 'S',
        impact: 'small',
        where: 'Dialog components (check for body scroll lock)',
        verify: 'Open dialog and check no layout shift',
      },
    ],
  },
  'low-performance-score': {
    category: 'JS/Bundle reduction',
    why: 'Overall performance score is below threshold',
    actions: [
      {
        title: 'Audit and remove unused dependencies',
        risk: 'low',
        effort: 'M',
        impact: 'medium',
        where: 'package.json and imports',
        verify: 'Bundle size reduced',
      },
      {
        title: 'Implement code-splitting for heavy routes',
        risk: 'low',
        effort: 'L',
        impact: 'large',
        where: 'Tool pages and interactive features',
        verify: 'Initial bundle smaller, lazy chunks loaded on demand',
      },
      {
        title: 'Replace heavy libraries with lighter alternatives',
        risk: 'medium',
        effort: 'L',
        impact: 'large',
        where: 'Check chart libraries, date libraries, etc.',
        verify: 'Bundle analysis shows significant reduction',
      },
    ],
  },
  'large-bundle': {
    category: 'JS/Bundle reduction',
    why: 'Route bundle exceeds budget',
    actions: [
      {
        title: 'Use dynamic imports for non-critical components',
        risk: 'low',
        effort: 'M',
        impact: 'large',
        where: 'Charts, modals, accordions, tabs',
        verify: 'Bundle size within budget',
      },
      {
        title: 'Ensure tree-shaking with named imports',
        risk: 'low',
        effort: 'S',
        impact: 'small',
        where: 'Replace barrel imports (index.ts) with direct imports',
        verify: 'Check bundle analysis for unused code',
      },
      {
        title: 'Move server-only logic out of client components',
        risk: 'low',
        effort: 'M',
        impact: 'medium',
        where: 'Data fetching, API calls in components',
        verify: 'Bundle size reduced',
      },
    ],
  },
};

function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function diagnoseFailure(failure) {
  const issues = [];
  
  if (failure.metric.includes('Blocking Time')) {
    issues.push('high-tbt');
  }
  if (failure.metric.includes('Contentful Paint')) {
    issues.push('high-lcp');
  }
  if (failure.metric.includes('Layout Shift')) {
    issues.push('high-cls');
  }
  if (failure.metric.includes('Performance Score')) {
    issues.push('low-performance-score');
  }
  
  return issues;
}

function generateRecommendations(failures) {
  const recommendations = [];
  const seen = new Set();
  
  for (const failure of failures) {
    const issues = diagnoseFailure(failure);
    
    for (const issue of issues) {
      if (seen.has(issue)) continue;
      seen.add(issue);
      
      const rec = RECOMMENDATIONS[issue];
      if (rec) {
        recommendations.push({
          route: failure.route,
          issue,
          ...rec,
        });
      }
    }
  }
  
  return recommendations;
}

function main() {
  const summary = loadJSON(path.join(reportsDir, 'perf-gate.summary.json'));
  
  if (!summary) {
    console.error('❌ No performance summary found. Run perf:gate first.');
    process.exit(1);
  }
  
  if (summary.failures.length === 0) {
    console.log('✓ No performance failures. AutoPlan not needed.');
    return;
  }
  
  const recommendations = generateRecommendations(summary.failures);
  
  // Generate AutoPlan
  const autoplan = {
    timestamp: new Date().toISOString(),
    failingRoutes: [...new Set(summary.failures.map((f) => f.route))],
    recommendations,
  };
  
  fs.writeFileSync(
    path.join(reportsDir, 'autoplan.json'),
    JSON.stringify(autoplan, null, 2)
  );
  
  // Generate markdown report
  const lines = [
    '# Performance Optimisation AutoPlan',
    '',
    `Generated: ${autoplan.timestamp}`,
    '',
    `## Executive Summary`,
    '',
    `Analyzed ${summary.failures.length} performance failures across ${autoplan.failingRoutes.length} routes.`,
    `Generated ${recommendations.length} prioritized recommendations.`,
    '',
    '## Failing Routes',
    '',
    ...autoplan.failingRoutes.map((route) => `- ${route}`),
    '',
    '## Prioritized Recommendations',
    '',
  ];
  
  recommendations.forEach((rec, idx) => {
    lines.push(`### ${idx + 1}. ${rec.actions[0].title}`);
    lines.push('');
    lines.push(`**Category:** ${rec.category}`);
    lines.push(`**Why this helps:** ${rec.why}`);
    lines.push(`**Risk:** ${rec.actions[0].risk} | **Effort:** ${rec.actions[0].effort} | **Expected Impact:** ${rec.actions[0].impact}`);
    lines.push('');
    lines.push(`**Where to change:** ${rec.actions[0].where}`);
    lines.push('');
    lines.push(`**Verification steps:** ${rec.actions[0].verify}`);
    lines.push('');
    
    if (rec.actions.length > 1) {
      lines.push('**Alternative approaches:**');
      for (let i = 1; i < rec.actions.length; i++) {
        const alt = rec.actions[i];
        lines.push(`- ${alt.title} (${alt.effort}/${alt.impact})`);
      }
      lines.push('');
    }
  });
  
  lines.push('## Verification Checklist');
  lines.push('');
  lines.push('After applying optimizations, verify:');
  lines.push('');
  lines.push('- [ ] Performance metrics pass budgets (`npm run perf:gate`)');
  lines.push('- [ ] No console errors (`npm run test:visual`)');
  lines.push('- [ ] Visual regression tests pass (`npm run test:visual`)');
  lines.push('- [ ] Accessibility checks pass (Lighthouse A11y score)');
  lines.push('- [ ] UK/US localization still correct');
  lines.push('- [ ] Citations remain copy-only');
  lines.push('- [ ] No new lint/type errors');
  lines.push('');
  lines.push('## Next Steps');
  lines.push('');
  lines.push('1. Review recommendations above');
  lines.push('2. Implement changes incrementally (one at a time)');
  lines.push('3. Run verification checklist after each change');
  lines.push('4. Update baseline if improvements are intentional: `npm run perf:baseline`');
  lines.push('');
  lines.push('See PERF_AUTOPLAN.md for detailed guidance.');
  lines.push('');
  
  fs.writeFileSync(path.join(reportsDir, 'autoplan.md'), lines.join('\n'));
  
  // Generate safe patches (example snippets)
  const patches = [
    '// Example: Dynamic import for heavy component',
    "const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {",
    "  loading: () => <div>Loading chart...</div>,",
    '  ssr: false,',
    '});',
    '',
    '// Example: Convert to server component (remove "use client")',
    '// Before: "use client" at top of file',
    '// After: Remove "use client" and fetch data at top level',
    'async function MyComponent() {',
    '  const data = await fetchData(); // Server-side',
    '  return <div>{data}</div>;',
    '}',
    '',
    '// Example: Add image dimensions',
    '// Before: <Image src="/hero.jpg" alt="Hero" fill />',
    '// After: <Image src="/hero.jpg" alt="Hero" width={1200} height={600} />',
  ];
  
  fs.writeFileSync(
    path.join(reportsDir, 'autoplan.safe-patches.diff'),
    patches.join('\n')
  );
  
  console.log('\n🤖 Performance Optimisation AutoPlan Generated');
  console.log(`  Failing routes: ${autoplan.failingRoutes.length}`);
  console.log(`  Recommendations: ${recommendations.length}`);
  console.log(`\n  Reports:`);
  console.log(`    - ${path.join(reportsDir, 'autoplan.md')}`);
  console.log(`    - ${path.join(reportsDir, 'autoplan.json')}`);
  console.log(`    - ${path.join(reportsDir, 'autoplan.safe-patches.diff')}`);
}

main();
