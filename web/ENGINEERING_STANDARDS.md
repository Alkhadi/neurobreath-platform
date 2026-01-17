# NeuroBreath Engineering Standards

**Quick Reference** | Last Updated: January 2026

This document provides a quick checklist of engineering standards for the NeuroBreath platform. For detailed guidance, see the [Performance Playbook](./PERFORMANCE_PLAYBOOK.md).

---

## Core Principles

### Non-Negotiables

1. **No inline CSS** - Never use `style=` or `<style>` blocks in components
2. **No ad-hoc JS hacks** - Build reusable hooks/modules/components
3. **Zero prominent console errors** - Fix all errors before merging
4. **Lint + typecheck + build must pass** - No exceptions
5. **Preserve design tokens** - Use existing Tailwind/CSS variables
6. **Educational only** - External citations must be copy-only (not clickable)
7. **UK/US localisation** - Support both regions with correct spelling/terms

---

## Before Every Commit

### Quick Checks

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Build
npm run build

# Visual regression (if UI changes)
npm run test:visual

# Performance gate (if performance-critical route)
npm run perf:gate
```

---

## Performance Standards

### Route-Type Budgets

| Route Type | Max Client JS | Max Chunk | Min Lighthouse |
|------------|---------------|-----------|----------------|
| Home | 120 KB | 50 KB | 90 |
| Hub | 150 KB | 60 KB | 85 |
| Condition | 180 KB | 70 KB | 85 |
| Tool | 200 KB | 80 KB | 80 |
| Guide | 100 KB | 40 KB | 90 |
| Trust/About | 60 KB | 30 KB | 95 |

### Performance Gates

**Always run before merge:**
```bash
npm run perf:gate          # Check budgets
npm run perf:deps          # Verify dependencies
npm run perf:autoplan      # Get optimization suggestions
```

**Refer to:** [PERFORMANCE_PLAYBOOK.md](./PERFORMANCE_PLAYBOOK.md)

---

## Component Architecture

### Server Components First

```typescript
// ✅ Default: Server Component
export default async function Page() {
  const data = await getData();
  return <Content data={data} />;
}
```

```typescript
// ✅ Client islands only when needed
'use client';
export function InteractiveWidget() {
  const [state, setState] = useState();
  return <Widget state={state} />;
}
```

### Anti-Patterns

```typescript
// ❌ Never wrap entire page in "use client"
'use client';
export default function Page() { /* ... */ }

// ❌ Never use inline styles
<div style={{ color: 'red' }}>Bad</div>

// ❌ Never import entire icon packs
import * as Icons from 'lucide-react';
```

---

## Accessibility Checklist

- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`)
- [ ] Heading hierarchy (single H1, logical H2/H3)
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Reduced motion respected
- [ ] No emoji in screen-reader text
- [ ] Alt text for all images
- [ ] ARIA labels where appropriate

---

## SEO Checklist

- [ ] `generateMetadata()` with title/description
- [ ] Canonical URL correct
- [ ] Hreflang for UK/US variants
- [ ] Open Graph + Twitter metadata
- [ ] Appropriate robots/noindex rules
- [ ] Structured data where applicable (FAQ, BreadcrumbList)

---

## Localisation Checklist

- [ ] UK variant created with UK spelling/terms
- [ ] US variant created with US spelling/terms
- [ ] Evidence sources appropriate per region (NHS for UK, CDC/NIH for US)
- [ ] No hardcoded domain names (use env vars)
- [ ] Educational framing maintained (no medical claims)

---

## Image/Icon/Font Standards

### Images

```typescript
// ✅ Always use next/image
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Descriptive alt"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  priority={isHero} // Only for above-fold
/>
```

### Icons

```typescript
// ✅ Import specific icons only
import { ChevronRight, Check } from 'lucide-react';

// ❌ Never import entire pack
import * as Icons from 'lucide-react';
```

### Fonts

```typescript
// ✅ Use next/font with fallback
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  adjustFontFallback: true, // Reduces CLS
});
```

---

## Dependency Management

### Before Adding a Package

1. **Check size:** `npm install <package> && npm run build`
2. **Update allowlist:** Add to `perf/budgets.config.ts`
3. **Run dep gate:** `npm run perf:deps`
4. **Document in PR:** Why needed? Size impact? Alternatives?

### Red Flags (Avoid Without Strong Justification)

- Heavy charting libraries (Chart.js, Recharts)
- Full WYSIWYG editors (TinyMCE, CKEditor)
- Moment.js (use date-fns or native Date)
- Entire Lodash (import specific functions)
- jQuery or legacy libraries
- Multiple UI component libraries

---

## PR Requirements

### Every PR Must Include

**Code Quality:**
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] No inline styles
- [ ] No new console errors

**Performance:**
- [ ] `npm run test:visual` passes (or snapshots updated)
- [ ] `npm run perf:gate` passes (or exception justified)
- [ ] Bundle impact reviewed

**Content:**
- [ ] UK/US variants correct
- [ ] Citations copy-only
- [ ] Educational framing

**Testing:**
- [ ] Manual testing in Chrome/Safari/Firefox
- [ ] Mobile testing
- [ ] Keyboard navigation verified

---

## Tools & Scripts

### Quality Gates

```bash
# Visual regression
npm run test:visual
npm run test:visual:update      # Update baselines
npm run test:visual:report      # View report

# Performance
npm run perf:gate               # Check budgets
npm run perf:baseline           # Set baseline
npm run perf:compare            # Compare to baseline
npm run perf:autoplan           # Get optimization plan
npm run perf:deps               # Check dependencies

# Lint & Type
npm run lint
npm run lint:fix
npm run typecheck
npm run build
```

### Content & SEO

```bash
# SEO audit
npm run seo:audit
npm run seo:guard
npm run seo:sitemap:build

# Content quality
npm run content:quality-gate
npm run content:localisation-audit
npm run content:link-intel

# Evidence audit
npm run evidence:audit

# Trust/last-reviewed
npm run trust:check
```

### Scaffolding (New!)

```bash
# Scaffold new route
npm run scaffold:route -- --type=condition --slug=adhd

# Scaffold journey flow
npm run scaffold:journey -- --journey=new-to-adhd
```

---

## When Things Go Wrong

### Performance Gate Fails

1. **Read the report:** `reports/perf/perf-gate.summary.json`
2. **Get recommendations:** `npm run perf:autoplan`
3. **Follow remediation recipes:** See [PERFORMANCE_PLAYBOOK.md](./PERFORMANCE_PLAYBOOK.md#section-7-when-perf-gate-fails-playbook)

### Common Issues

**High TBT (> 300ms)**
- Reduce client JS
- Move logic to Server Components
- Dynamic import heavy features
- Audit dependencies

**High CLS (> 0.1)**
- Add width/height to images
- Fix font loading (use next/font)
- Reserve space for dynamic content

**Bundle Growth**
- Run `npm run perf:deps`
- Check for duplicate packages
- Move logic server-side
- Use dynamic imports

---

## Documentation

### Required Reading

- **Performance Playbook:** [PERFORMANCE_PLAYBOOK.md](./PERFORMANCE_PLAYBOOK.md)
- **Scaffolder Guide:** [SCAFFOLDER_GUIDE.md](./SCAFFOLDER_GUIDE.md)
- **Journeys Guide:** [JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md)

### Reference

- **PR Template:** [.github/pull_request_template.md](../.github/pull_request_template.md)
- **Performance Budgets:** [perf/budgets.config.ts](./perf/budgets.config.ts)
- **AutoPlan Documentation:** [PERF_AUTOPLAN.md](./PERF_AUTOPLAN.md)
- **Visual Regression:** [QA_VISUAL_REGRESSION.md](./QA_VISUAL_REGRESSION.md)

---

## Questions?

Contact: Engineering Lead

**Last reviewed:** January 2026
