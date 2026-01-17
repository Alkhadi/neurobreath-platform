# Performance AutoPlan Guide

## Overview

AutoPlan is an intelligent system that analyzes performance failures and generates prioritized, actionable optimization recommendations.

## When AutoPlan Runs

Automatically triggered when:
- Performance budgets fail
- Performance budgets warn
- Bundle budgets exceeded
- New large dependencies detected

## How to Use

### Generate AutoPlan
```bash
cd web
npm run perf:autoplan
```

### Review outputs
- `reports/perf/autoplan.md` - Human-readable recommendations
- `reports/perf/autoplan.json` - Machine-readable data
- `reports/perf/autoplan.safe-patches.diff` - Example code snippets

## Understanding Recommendations

Each recommendation includes:

### 1. Category
What type of optimization:
- JS/Bundle reduction
- Rendering and hydration
- Layout stability (CLS)
- Images and media
- Network and caching
- Dependency governance

### 2. Why This Helps
Brief explanation of the performance impact.

### 3. Risk Level
- **Low:** Safe to implement, unlikely to break anything
- **Medium:** Requires testing, may affect functionality
- **High:** Complex change, thorough testing needed

### 4. Effort
- **S (Small):** < 1 hour
- **M (Medium):** 1-4 hours
- **L (Large):** 1+ days

### 5. Expected Impact
- **Small:** 5-10% improvement
- **Medium:** 10-30% improvement
- **Large:** 30%+ improvement

### 6. Where to Change
File paths or component names to focus on.

### 7. Verification Steps
How to confirm the optimization worked.

## Example AutoPlan Output

```markdown
### 1. Split large components into dynamic imports

**Category:** JS/Bundle reduction
**Why this helps:** High Total Blocking Time indicates too much JavaScript execution blocking the main thread
**Risk:** low | **Effort:** M | **Expected Impact:** large

**Where to change:** Heavy client components in route

**Verification steps:** Re-run perf gate and check TBT reduced by 30%+
```

## Recommendation Taxonomy

### High TBT (Total Blocking Time)

**Issue:** Too much JavaScript execution blocks main thread

**Recommendations:**
1. Split large components into dynamic imports
2. Move non-critical UI to client-only islands
3. Reduce client JS on page (more server components)

**Example fix:**
```typescript
// Before
'use client';
import { HeavyComponent } from './heavy';

export function Page() {
  return <HeavyComponent />;
}

// After
'use client';
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./heavy'), {
  loading: () => <Skeleton />,
  ssr: false,
});

export function Page() {
  return <HeavyComponent />;
}
```

### High LCP (Largest Contentful Paint)

**Issue:** Largest visible element takes too long to render

**Recommendations:**
1. Optimize hero images with next/image priority
2. Preconnect to critical domains
3. Reduce above-the-fold client components

**Example fix:**
```typescript
// Before
<Image src="/hero.jpg" alt="Hero" fill />

// After
<Image 
  src="/hero.jpg" 
  alt="Hero" 
  width={1200} 
  height={600}
  priority
  quality={85}
/>
```

### High CLS (Cumulative Layout Shift)

**Issue:** Layout shifts during page load

**Recommendations:**
1. Reserve space for images with explicit width/height
2. Use font-display: swap with fallback metrics
3. Ensure dialogs/modals don't cause reflow

**Example fix:**
```typescript
// Before
<Image src="/card.jpg" alt="Card" fill className="object-cover" />

// After
<Image 
  src="/card.jpg" 
  alt="Card" 
  width={400} 
  height={300}
  className="object-cover"
/>
```

### Low Performance Score

**Issue:** Overall performance below threshold

**Recommendations:**
1. Audit and remove unused dependencies
2. Implement code-splitting for heavy routes
3. Replace heavy libraries with lighter alternatives

**Example fix:**
```typescript
// Before: Heavy charting library for all users
import { Chart } from 'heavy-charts';

// After: Load only when needed
const Chart = dynamic(() => import('heavy-charts').then(m => m.Chart), {
  ssr: false,
});

// Or: Replace with lighter alternative
import { LineChart } from '@/components/simple-charts';
```

### Large Bundle

**Issue:** Route bundle exceeds budget

**Recommendations:**
1. Use dynamic imports for non-critical components
2. Ensure tree-shaking with named imports
3. Move server-only logic out of client components

**Example fix:**
```typescript
// Before: Barrel import (entire module)
import { Button, Dialog, Tabs, Accordion } from '@/components/ui';

// After: Direct imports (tree-shaking)
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

// Dynamic for heavy components
const Tabs = dynamic(() => import('@/components/ui/tabs').then(m => m.Tabs));
const Accordion = dynamic(() => import('@/components/ui/accordion').then(m => m.Accordion));
```

## Safe Patch Suggestions

AutoPlan generates example code snippets in `autoplan.safe-patches.diff`.

### Important:
- ❌ **DO NOT** apply automatically
- ✅ **DO** use as reference
- ✅ **DO** adapt to your specific code
- ✅ **DO** test thoroughly

## Applying Recommendations

### Step-by-step process:

1. **Read AutoPlan output**
   ```bash
   cat reports/perf/autoplan.md
   ```

2. **Prioritize by impact/effort**
   - Start with low-risk, high-impact changes
   - Save complex changes for later

3. **Implement one change at a time**
   - Don't batch multiple optimizations
   - Makes it easier to identify what worked

4. **Run verification checklist** (see below)

5. **Measure improvement**
   ```bash
   npm run perf:gate
   ```

6. **Commit if successful**
   ```bash
   git add .
   git commit -m "perf: optimize TBT by dynamic importing charts"
   ```

7. **Move to next recommendation**

## Verification Checklist

After each optimization:

### Performance
- [ ] Run `npm run perf:gate` - All budgets pass
- [ ] Check specific metric improved (TBT/LCP/CLS/etc.)
- [ ] No new performance regressions

### Functionality
- [ ] Feature still works as expected
- [ ] No broken user interactions
- [ ] All routes load correctly

### Visual
- [ ] Run `npm run test:visual` - No layout regressions
- [ ] Check both mobile and desktop
- [ ] Verify responsive behavior

### Console
- [ ] No new console errors
- [ ] No new console warnings
- [ ] Check browser DevTools

### Accessibility
- [ ] Lighthouse A11y score maintained/improved
- [ ] Keyboard navigation works
- [ ] Screen reader tested (if applicable)

### Localization
- [ ] UK/US content still correct
- [ ] No hardcoded text introduced
- [ ] Region switching works

### Code Quality
- [ ] No new lint errors: `npm run lint`
- [ ] No new type errors: `npm run typecheck`
- [ ] Code is clean and maintainable

### Edge Cases
- [ ] Slow network tested
- [ ] Large data sets tested
- [ ] Error states handled

## Route-Specific Intelligence

AutoPlan attempts to identify:

### For each failing route:
1. **Top 5 largest imported modules**
2. **Top 3 components to lazy-load**
3. **Conversion opportunities to server components**
4. **Shared heavy components across routes**

### How to use this:

If AutoPlan identifies:
```
Route: uk-tools
Top imports: recharts (120KB), framer-motion (85KB), react-select (45KB)
Lazy-load candidates: ChartPanel, AnimatedHero, FilterDropdown
```

Then:
1. Dynamic import ChartPanel (largest impact)
2. Consider if AnimatedHero is needed above-the-fold
3. Check if FilterDropdown can be deferred

## Understanding Trade-offs

Not all recommendations should be applied blindly.

### Consider:

**User Experience vs Performance**
- Don't sacrifice UX for milliseconds
- Critical interactions should be fast-loading
- Nice-to-haves can be lazy-loaded

**Maintainability vs Optimization**
- Don't over-complicate code
- Dynamic imports add complexity
- Balance readability with performance

**Feature Completeness vs Bundle Size**
- Some features require heavy libraries
- Document why they're needed
- Use allowlist for approved deps

**Initial Load vs Interaction**
- Optimize critical path first
- Defer less important features
- Progressive enhancement

## Advanced: Creating Custom Recommendations

You can extend AutoPlan by editing:
`scripts/perf/generate-autoplan.mjs`

Add new recommendation types:
```javascript
const RECOMMENDATIONS = {
  'your-new-issue': {
    category: 'Category name',
    why: 'Explanation',
    actions: [
      {
        title: 'What to do',
        risk: 'low',
        effort: 'M',
        impact: 'large',
        where: 'Where to change',
        verify: 'How to verify',
      },
    ],
  },
};
```

## Troubleshooting

### AutoPlan shows no recommendations
- Check if perf gate actually failed
- Review perf-gate.summary.json manually
- May need to add new recommendation types

### Recommendations don't apply to your case
- AutoPlan is generic guidance
- Adapt to your specific code structure
- Use as inspiration, not prescription

### After applying, performance worse
- Revert the change
- Re-read recommendation carefully
- May have been applied incorrectly
- Try alternative approach from AutoPlan

### AutoPlan suggests conflicting changes
- Prioritize by impact
- Test one at a time
- Some may not be compatible

## Best Practices

1. **Trust but verify** - AutoPlan is guidance, not gospel
2. **Incremental changes** - One optimization at a time
3. **Measure everything** - Before/after metrics
4. **Document decisions** - Why you chose certain approaches
5. **Keep learning** - Performance optimization is iterative
6. **Balance trade-offs** - Perfect performance isn't always worth the cost
7. **Update baselines** - After successful optimizations

## Integration with CI

AutoPlan runs automatically in CI when perf gate fails:
- Artifact uploaded: `autoplan.md`
- PR comment includes link to artifacts
- Review before implementing

## Related Documentation

- [PERFORMANCE_BUDGETS.md](./PERFORMANCE_BUDGETS.md) - Budget configuration
- [QA_VISUAL_REGRESSION.md](./QA_VISUAL_REGRESSION.md) - Visual testing
- [Next.js Optimization Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)

## Quick Reference

```bash
# Generate AutoPlan
npm run perf:autoplan

# View recommendations
cat reports/perf/autoplan.md

# Verify changes
npm run perf:gate
npm run test:visual
npm run lint
npm run typecheck

# Update baseline after success
npm run perf:baseline
```
