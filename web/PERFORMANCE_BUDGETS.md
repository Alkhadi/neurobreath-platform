# Performance Budgets Guide

## Overview

Automated performance budget enforcement system that prevents performance regressions through CI-integrated gates.

## What Gets Measured

### 1. Lighthouse Scores
- **Performance:** Min 75
- **Accessibility:** Min 90
- **Best Practices:** Min 85
- **SEO:** Min 85

### 2. Core Web Vitals Proxies (CI)
- **TBT (Total Blocking Time):** Max 300ms
- **LCP (Largest Contentful Paint):** Max 2500ms
- **CLS (Cumulative Layout Shift):** Max 0.1
- **FCP (First Contentful Paint):** Max 1800ms
- **Speed Index:** Max 3000

### 3. Bundle Size Budgets
- **Home pages:** 250 KB client JS
- **Hub pages:** 200 KB client JS
- **Tool pages:** 300 KB client JS
- **Guide pages:** 180 KB client JS
- **Trust pages:** 150 KB client JS
- **Largest chunk:** 150 KB
- **Total client JS:** 500 KB
- **Delta limit:** 10% growth vs baseline

### 4. Dependency Budgets
- **Max new dependencies:** 3 per PR
- **Max single dep size:** 500 KB
- **Blocklist:** moment, jquery, bootstrap (use alternatives)
- **Require allowlist:** For large deps with justification

## Running Performance Tests

### Full performance gate
```bash
cd web
npm run perf:gate
```

This will:
1. Build Next.js in production mode
2. Start production server
3. Run Lighthouse audits on all key routes
4. Generate reports in `reports/perf/`

### Check dependencies only
```bash
npm run perf:deps
```

### Compare against baseline
```bash
npm run perf:compare
```

### Generate optimization recommendations
```bash
npm run perf:autoplan
```

## Creating a Baseline

First time setup or after intentional improvements:

```bash
# Capture new baseline
npm run perf:baseline

# This creates:
# - perf/baseline/baseline.lighthouse.json
# - perf/baseline/baseline.deps.json
# - perf/baseline/baseline.meta.json
```

**Important:** Commit baseline files to git!

## Interpreting Results

### Reports generated:
1. **lighthouse.current.json** - Current scores and metrics
2. **perf-gate.summary.json** - Pass/fail status and violations
3. **perf-gate.summary.md** - Human-readable summary
4. **deps.current.json** - Dependency analysis
5. **deps.current.md** - Dependency report
6. **Lighthouse HTML reports** - Full audit details per route

### Example failure output:
```
⚡ Performance Budget Gate Summary
  Failures: 2
  Warnings: 1
  Improvements: 0

❌ Performance budget failures detected
  uk-tools: Total Blocking Time = 450ms (threshold: 300ms)
  us-home: Performance Score = 68 (threshold: 75)
```

## How to Fix Failures

### Step 1: Generate AutoPlan
```bash
npm run perf:autoplan
```

Read `reports/perf/autoplan.md` for specific recommendations.

### Step 2: Apply optimizations incrementally

Common fixes:

#### High TBT (Total Blocking Time)
```typescript
// ❌ Before: Heavy client component
'use client';
import { HeavyChart } from '@/components/heavy-chart';

export function Dashboard() {
  return <HeavyChart data={data} />;
}

// ✅ After: Dynamic import
'use client';
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/heavy-chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});

export function Dashboard() {
  return <HeavyChart data={data} />;
}
```

#### High LCP (Largest Contentful Paint)
```typescript
// ❌ Before: No priority on hero image
<Image src="/hero.jpg" alt="Hero" fill />

// ✅ After: Priority for above-the-fold
<Image 
  src="/hero.jpg" 
  alt="Hero" 
  width={1200} 
  height={600}
  priority
/>
```

#### High CLS (Cumulative Layout Shift)
```typescript
// ❌ Before: No dimensions
<Image src="/card.jpg" alt="Card" fill />

// ✅ After: Explicit dimensions
<Image 
  src="/card.jpg" 
  alt="Card" 
  width={400} 
  height={300}
/>
```

#### Large bundles
```typescript
// ❌ Before: Barrel import (imports entire module)
import { Button, Card, Dialog } from '@/components/ui';

// ✅ After: Direct imports (tree-shaking friendly)
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
```

#### Convert to Server Component
```typescript
// ❌ Before: Client component fetching data
'use client';
import { useState, useEffect } from 'react';

export function DataComponent() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  
  return <div>{data?.title}</div>;
}

// ✅ After: Server component (no client JS)
async function DataComponent() {
  const data = await fetch('http://localhost:3000/api/data').then(r => r.json());
  return <div>{data.title}</div>;
}
```

### Step 3: Verify fixes
```bash
# Run perf gate again
npm run perf:gate

# Run visual regression (ensure no layout breaks)
npm run test:visual

# Check console errors
# Check bundle size change
```

### Step 4: Update baseline if intentional
```bash
# If improvements are real and should be the new baseline
npm run perf:baseline
git add perf/baseline/
git commit -m "chore: update performance baseline after optimizations"
```

## Optimization Playbook

### Bundle Size Reduction

1. **Audit dependencies**
   ```bash
   npm run analyze  # If configured
   # Or check reports/perf/*.html
   ```

2. **Dynamic imports for heavy features**
   - Charts (recharts, chart.js)
   - Modals/dialogs (when not critical)
   - Accordions/tabs content
   - Below-the-fold components

3. **Tree-shaking**
   - Use named imports
   - Avoid barrel files where possible
   - Check webpack bundle analyzer

4. **Server components**
   - Move data fetching server-side
   - Remove 'use client' where not needed
   - Keep interactivity islands small

### Rendering Performance

1. **Code splitting by route**
   - Next.js does this automatically
   - Verify with bundle analysis

2. **Lazy load non-critical**
   - Use `next/dynamic` with `ssr: false`
   - Load heavy components on interaction

3. **Memoization** (when proven needed)
   - Use React.memo for expensive renders
   - useMemo for expensive computations
   - Don't over-optimize

### Image Optimization

1. **Always use next/image**
   - Automatic optimization
   - Responsive sizes
   - Lazy loading

2. **Set explicit dimensions**
   - Reduces CLS
   - Better initial render

3. **Priority for hero images**
   - Use `priority` prop
   - Only for above-the-fold

4. **Appropriate formats**
   - WebP with fallbacks
   - Correct compression

### Network & Caching

1. **API response caching**
   - Cache on server (Redis, etc.)
   - Revalidate strategies

2. **Reduce waterfalls**
   - Parallel requests
   - Prefetch critical data

3. **Preconnect** (sparingly)
   - Only for critical third-party domains
   - Don't overuse

### Dependency Management

1. **Before adding a dependency:**
   - Check if already available (lodash vs native)
   - Check bundle size impact
   - Consider alternatives

2. **Regularly audit**
   ```bash
   npm outdated
   npm run perf:deps
   ```

3. **Remove unused**
   ```bash
   npx depcheck
   ```

4. **Prefer smaller alternatives**
   - date-fns over moment
   - zustand over redux
   - Native APIs over libraries

## Allowlist Process

If you need a large dependency:

1. Add to `perf/budgets.config.ts`:
```typescript
allowlist: [
  {
    package: '@heavy/package',
    justification: 'Required for X feature, no lighter alternative exists',
    approvedBy: 'tech-lead',
    date: '2026-01-17',
  },
],
```

2. Document in PR why it's needed
3. Get approval from tech lead
4. Commit allowlist update

## CI Integration

### Workflow runs on:
- Every PR to main/develop
- Every push to main
- Manual trigger

### Artifacts:
- `performance-reports/` - All JSON/MD reports
- `lighthouse-reports/` - HTML reports with visualizations
- PR comment with summary

### On failure:
- CI job fails (blocks merge)
- AutoPlan generated
- Artifacts uploaded for review

## Configuration

Edit `perf/budgets.config.ts` to adjust thresholds:

```typescript
export const PERFORMANCE_BUDGET: PerformanceBudget = {
  lighthouseBudgets: {
    performanceScoreMin: 75,  // Adjust as needed
    // ...
  },
  bundleBudgets: {
    maxRouteClientJsKB: {
      home: 250,  // Adjust per page type
      // ...
    },
  },
  // ...
};
```

## Troubleshooting

### Tests fail in CI but pass locally
- CI uses production build (more accurate)
- Run locally with: `npm run build && npm run start`
- Check CI environment differences

### Lighthouse scores vary
- Expected variation: ±5 points
- CI throttling is consistent
- Multiple runs may be needed for stability

### Baseline not found
- Run `npm run perf:baseline` first
- Commit baseline files to git

### Server won't start
- Check port 3000 is free
- Verify build completed successfully
- Check logs for errors

## Best Practices

1. **Monitor continuously** - Don't wait for failures
2. **Incremental changes** - One optimization at a time
3. **Measure impact** - Before/after comparisons
4. **Document decisions** - Why certain deps are allowed
5. **Keep baselines updated** - After intentional improvements
6. **Review AutoPlan** - Don't ignore recommendations
7. **Balance performance vs features** - Sometimes trade-offs are needed

## Related Documentation

- [QA_VISUAL_REGRESSION.md](./QA_VISUAL_REGRESSION.md) - Visual testing
- [PERF_AUTOPLAN.md](./PERF_AUTOPLAN.md) - AutoPlan details
- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
