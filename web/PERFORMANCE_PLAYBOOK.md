# NeuroBreath Performance Playbook

**Version:** 1.0  
**Last Updated:** January 2026  
**Applies to:** Next.js App Router (web/)

---

## Purpose

This playbook defines NeuroBreath's performance standards and provides actionable optimisation patterns for each route type. It ensures consistent, fast user experiences while maintaining educational credibility and accessibility.

---

## Section 1: NeuroBreath Performance Principles

### Platform-Wide Standards

**1. Server Components First**
- Default to Server Components for all pages
- Only use Client Components for interactive UI elements
- Keep client-side JavaScript minimal and purposeful

**2. Client Islands Strategy**
- Isolate interactive widgets as small Client Components
- Avoid wrapping entire pages in "use client"
- Use dynamic imports for heavy interactive features
- Example: Timer UI, form validation, animations

**3. Dependency Governance**
- Justify every new dependency with size/benefit analysis
- Prefer lightweight alternatives or custom utilities
- Check bundle impact before adding packages
- Update dependency allowlist with approval

**4. Stable Layouts for CLS Protection**
- Reserve space for dynamic content and images
- Use skeleton loaders with accurate dimensions
- Avoid layout shifts from late-loading fonts/images
- Test with reduced motion preferences

**5. Image Strategy**
- Always use next/image for photos and graphics
- Define sizes prop for responsive images
- Use priority only for above-fold hero images
- Compress images appropriately (WebP/AVIF preferred)

**6. Accessibility + Performance Together**
- Support prefers-reduced-motion
- Maintain semantic HTML and focus order
- Optimise for keyboard navigation
- Keep interactive elements accessible and fast

---

## Section 2: Route-Type Optimisation Patterns

### 2.1 Home Page

**Primary Goals:** Fast first impression, clear value proposition, immediate engagement

**Rendering Approach:**
- Server Component for static content
- Client Component for hero CTA only if interactive
- Defer secondary sections below fold

**Performance Risks:**
- Heavy animations causing high CLS/TBT
- Large hero images blocking LCP
- Over-eager prefetching

**Proven Patterns:**

```typescript
// ✅ Good: Server Component with minimal client island
export default async function HomePage() {
  return (
    <main>
      <HeroSection priority /> {/* Server Component */}
      <CTAButton /> {/* Small client island */}
      <BenefitsGrid /> {/* Server Component */}
    </main>
  );
}
```

```typescript
// ✅ Good: Deferred secondary content
import dynamic from 'next/dynamic';

const Testimonials = dynamic(() => import('@/components/Testimonials'), {
  loading: () => <TestimonialsSkeleton />,
});
```

**Anti-Patterns:**
- ❌ Entire page wrapped in "use client"
- ❌ Multiple large videos/animations auto-playing
- ❌ Hero image without priority prop
- ❌ Heavy JS libraries for simple interactions

**Target Budgets:**
- Max client JS: **120 KB**
- Max largest chunk: **50 KB**
- Lighthouse Performance: **≥ 90**
- CLS: **< 0.1**
- LCP: **< 2.5s**
- TBT: **< 200ms**

**Verification:**
```bash
npm run perf:gate
npm run test:visual
```

---

### 2.2 Hub Pages (Conditions/Tools/Guides)

**Primary Goals:** Fast browsing, clear categorisation, easy navigation

**Rendering Approach:**
- Server Component for card grids
- Pagination or "Load More" for large lists
- Client Component only for search/filter if needed

**Performance Risks:**
- Rendering 50+ cards on initial load
- Heavy images in all cards
- Expensive client-side filtering

**Proven Patterns:**

```typescript
// ✅ Good: Paginated hub with server-rendered cards
export default async function ConditionsHub({ searchParams }: Props) {
  const page = searchParams.page ?? 1;
  const conditions = await getConditions({ page, limit: 12 });
  
  return (
    <main>
      <HubHeader />
      <ConditionGrid conditions={conditions} />
      <Pagination currentPage={page} total={conditions.total} />
    </main>
  );
}
```

```typescript
// ✅ Good: "Load More" pattern for progressive loading
'use client';

export function LoadMoreButton({ onLoad }: Props) {
  const [loading, setLoading] = useState(false);
  
  async function handleLoad() {
    setLoading(true);
    await onLoad();
    setLoading(false);
  }
  
  return (
    <Button onClick={handleLoad} disabled={loading}>
      {loading ? 'Loading...' : 'Load More'}
    </Button>
  );
}
```

**Anti-Patterns:**
- ❌ Rendering entire catalog (100+ items) on mount
- ❌ Client-side data fetching with loading spinners
- ❌ Large card images without optimisation
- ❌ Complex client-side search without debouncing

**Target Budgets:**
- Max client JS: **150 KB**
- Max largest chunk: **60 KB**
- Lighthouse Performance: **≥ 85**
- CLS: **< 0.1**
- LCP: **< 2.8s**
- TBT: **< 250ms**

**Verification:**
```bash
npm run perf:gate
npm run test:visual -- hubs
```

---

### 2.3 Condition Pages

**Primary Goals:** Fast content delivery, clear starter journeys, trust signals

**Rendering Approach:**
- Server Component for main content
- Client islands for interactive widgets only
- Keep journey links server-rendered

**Performance Risks:**
- Heavy interactive assessments blocking render
- Large images in symptoms sections
- Client-side state management overhead

**Proven Patterns:**

```typescript
// ✅ Good: Server Component with client widget islands
export default async function ConditionPage({ params }: Props) {
  const condition = await getCondition(params.slug);
  
  return (
    <main>
      <ConditionHeader condition={condition} />
      <SymptomsSection symptoms={condition.symptoms} /> {/* Server */}
      <StarterJourneys journeys={condition.journeys} /> {/* Server */}
      <InteractiveAssessment /> {/* Client island */}
      <RecommendedTools tools={condition.tools} /> {/* Server */}
      <TrustBlock lastReviewed={condition.lastReviewed} />
    </main>
  );
}
```

```typescript
// ✅ Good: Memoized client component with stable boundaries
'use client';
import { memo } from 'react';

export const InteractiveAssessment = memo(function InteractiveAssessment() {
  const [responses, setResponses] = useState({});
  
  return <AssessmentForm responses={responses} onChange={setResponses} />;
});
```

**Anti-Patterns:**
- ❌ Entire page client-rendered for one widget
- ❌ Global state provider wrapping whole app
- ❌ Excessive re-renders from unoptimised state
- ❌ Heavy charting libraries for simple visualisations

**Target Budgets:**
- Max client JS: **180 KB**
- Max largest chunk: **70 KB**
- Lighthouse Performance: **≥ 85**
- CLS: **< 0.1**
- LCP: **< 2.5s**
- TBT: **< 300ms**

**Verification:**
```bash
npm run perf:gate -- --route=/uk/conditions/adhd
npm run test:visual -- conditions
```

---

### 2.4 Tool Pages (Interactive)

**Primary Goals:** Fast interaction, stable timer/animation performance, minimal rerender lag

**Rendering Approach:**
- Client Component for tool UI (necessary)
- Server Component for instructions/wrapper
- Isolate timer/animation logic to prevent global rerenders

**Performance Risks:**
- Excessive rerenders causing UI lag
- Heavy animation libraries
- Global providers needed only for one tool

**Proven Patterns:**

```typescript
// ✅ Good: Tool wrapped in server component
export default async function ToolPage({ params }: Props) {
  const tool = await getTool(params.slug);
  
  return (
    <main>
      <ToolHeader tool={tool} /> {/* Server */}
      <Instructions instructions={tool.instructions} /> {/* Server */}
      <ToolClient config={tool.config} /> {/* Client island */}
      <RelatedTools tools={tool.related} /> {/* Server */}
    </main>
  );
}
```

```typescript
// ✅ Good: Isolated timer with minimal scope
'use client';

export function BreathingTimer({ duration }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div className="timer-ui">
      <TimerDisplay time={timeLeft} />
      <Button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Pause' : 'Start'}
      </Button>
    </div>
  );
}
```

**Anti-Patterns:**
- ❌ Wrapping app with provider for single tool
- ❌ Heavy animation lib for simple transitions
- ❌ Unoptimised renders on every timer tick
- ❌ Large bundle for rarely-used tools

**Target Budgets:**
- Max client JS: **200 KB** (interactive exception)
- Max largest chunk: **80 KB**
- Lighthouse Performance: **≥ 80**
- CLS: **< 0.1**
- LCP: **< 2.8s**
- TBT: **< 350ms**

**Verification:**
```bash
npm run perf:gate -- --route=/uk/tools/breathing/box-breathing
npm run test:visual -- tools
```

---

### 2.5 Guide Pages (Content-Heavy)

**Primary Goals:** Fast reading experience, stable layout, minimal client JS

**Rendering Approach:**
- Server Component for all content
- Client Component only for bookmark/save if needed
- Prioritise readability and stable headings

**Performance Risks:**
- Large images interrupting reading flow
- Late-loading fonts causing text reflow
- Heavy syntax highlighting libraries
- Client-side table of contents logic

**Proven Patterns:**

```typescript
// ✅ Good: Pure server component guide
export default async function GuidePage({ params }: Props) {
  const guide = await getGuide(params.slug);
  
  return (
    <article>
      <GuideHeader guide={guide} />
      <TableOfContents headings={guide.headings} /> {/* Server */}
      <GuideContent content={guide.content} /> {/* Server */}
      <RelatedGuides guides={guide.related} /> {/* Server */}
      <TrustBlock lastReviewed={guide.lastReviewed} />
    </article>
  );
}
```

```typescript
// ✅ Good: Optimised images in content
import Image from 'next/image';

export function GuideContent({ content }: Props) {
  return (
    <div className="prose">
      {content.sections.map((section) => (
        <section key={section.id}>
          <h2>{section.title}</h2>
          {section.image && (
            <Image
              src={section.image}
              alt={section.imageAlt}
              width={800}
              height={450}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: section.html }} />
        </section>
      ))}
    </div>
  );
}
```

**Anti-Patterns:**
- ❌ Client-side markdown parsing
- ❌ Heavy syntax highlighting for simple code blocks
- ❌ Images without width/height causing CLS
- ❌ Unnecessary client-side TOC scrollspy

**Target Budgets:**
- Max client JS: **100 KB**
- Max largest chunk: **40 KB**
- Lighthouse Performance: **≥ 90**
- CLS: **< 0.05**
- LCP: **< 2.3s**
- TBT: **< 200ms**

**Verification:**
```bash
npm run perf:gate -- --route=/uk/guides/adhd/reading-strategies
npm run test:visual -- guides
```

---

### 2.6 Trust/About Pages

**Primary Goals:** Fast, credible, minimal JS, clear trust signals

**Rendering Approach:**
- Server Component for all content
- Minimal or zero client JS
- Focus on clarity and credibility

**Performance Risks:**
- Over-engineering simple pages
- Unnecessary animations
- Heavy footer components

**Proven Patterns:**

```typescript
// ✅ Good: Pure server component
export default async function AboutPage() {
  const team = await getTeam();
  const reviewPolicy = await getReviewPolicy();
  
  return (
    <main>
      <AboutHeader />
      <MissionSection />
      <TeamSection team={team} />
      <ReviewPolicySection policy={reviewPolicy} />
      <ContactSection />
    </main>
  );
}
```

**Anti-Patterns:**
- ❌ Client-side animations on static content
- ❌ Heavy libraries for simple layouts
- ❌ Unnecessary JavaScript for static pages

**Target Budgets:**
- Max client JS: **60 KB**
- Max largest chunk: **30 KB**
- Lighthouse Performance: **≥ 95**
- CLS: **< 0.05**
- LCP: **< 2.0s**
- TBT: **< 150ms**

**Verification:**
```bash
npm run perf:gate -- --route=/uk/about
npm run test:visual -- trust
```

---

## Section 3: Dependency Governance

### When to Add a Dependency

**Add a dependency when:**
- Feature is complex and well-tested solution exists
- Implementation would take significant time
- Library is actively maintained and lightweight
- Bundle impact is justified by value

**Build a utility when:**
- Feature is simple (< 50 lines)
- Existing deps are too heavy
- Only need subset of functionality
- Custom logic needed for NeuroBreath patterns

### Red Flags List

**Avoid these without strong justification:**
- Heavy charting libraries (Chart.js, Recharts) → Use lightweight alternatives
- Full WYSIWYG editors (TinyMCE, CKEditor) → Consider Tiptap or custom
- Moment.js → Use date-fns or native Date
- Lodash (entire lib) → Import specific functions
- Heavy animation libs → Prefer CSS animations or Framer Motion (carefully)
- jQuery or legacy libs → Never
- Multiple UI component libraries → Standardise on shadcn/ui
- Duplicate functionality → Check existing utils first

### Approval Process

**Before adding a dependency:**

1. **Check bundle size:**
```bash
npm install <package>
npm run build
# Check .next/analyze/ reports
```

2. **Update allowlist:**
```typescript
// perf/budgets.config.ts
{
  package: 'new-package-name',
  justification: 'Required for X feature, Y KB, no lightweight alternative',
  approvedBy: 'Engineering Lead',
  date: '2026-01-17',
}
```

3. **Verify dependency gate passes:**
```bash
npm run perf:deps
```

4. **Document in PR:**
- Why this dependency?
- Size impact?
- Alternatives considered?
- How to remove in future if needed?

### Measuring Impact

**Bundle Reports:**
```bash
npm run build
# Check .next/analyze/client.html
```

**Dependency Size:**
```bash
npm run perf:deps
```

---

## Section 4: Images/Icons/Fonts Strategy

### next/image Usage Rules

**Always use next/image:**
- ✅ Photos and graphics
- ✅ Responsive images needing multiple sizes
- ✅ Images requiring optimisation

**Image props checklist:**
```typescript
<Image
  src="/path/to/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 800px"
  priority={isAboveFold} // Only for hero images
  quality={85} // Default, reduce for thumbnails
/>
```

**Anti-patterns:**
- ❌ Missing width/height (causes CLS)
- ❌ priority on all images (defeats purpose)
- ❌ No sizes prop for responsive images
- ❌ Using <img> directly

### Icon Strategy

**Tree-shaking is critical:**
```typescript
// ✅ Good: Import specific icons
import { ChevronRight, Check, Info } from 'lucide-react';

// ❌ Bad: Import entire icon pack
import * as Icons from 'lucide-react';
```

**Icon system rules:**
- Use lucide-react for UI icons
- Import only needed icons
- Avoid inline SVG in components (extract to Icon component)
- Never use emoji in TTS-read strings (causes screen reader issues)

### Font Loading Strategy

**Use next/font with fallback metrics:**
```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: true, // Reduces CLS
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Font rules:**
- Use next/font for all custom fonts
- Enable adjustFontFallback to reduce CLS
- Limit font weights (regular + bold typically sufficient)
- Use font-display: swap
- Avoid @font-face directly

### SVG/Emoji in TTS Strings

**Critical accessibility rule:**
```typescript
// ❌ Bad: Emoji in readable text
<p>Great job! 🎉 You completed the exercise.</p>

// ✅ Good: Aria-label for decorative emoji
<p>
  Great job! <span aria-hidden="true">🎉</span> You completed the exercise.
</p>

// ✅ Better: No emoji in TTS strings
<p>Great job! You completed the exercise.</p>
```

---

## Section 5: Tooling & Quality Gates

### Existing Gates

**Visual Regression:**
```bash
npm run test:visual                # Run all visual tests
npm run test:visual:update         # Update baselines
npm run test:visual:report         # View report
```

**Performance Budget:**
```bash
npm run perf:gate                  # Check against budgets
npm run perf:baseline              # Set new baseline
npm run perf:compare               # Compare to baseline
npm run perf:autoplan              # Generate optimisation plan
```

**Dependency Gate:**
```bash
npm run perf:deps                  # Check new dependencies
```

**Type/Lint/Build:**
```bash
npm run lint                       # ESLint check
npm run lint:fix                   # Auto-fix issues
npm run typecheck                  # TypeScript check
npm run build                      # Production build
```

### CI Integration

All gates run automatically on PR:
- `.github/workflows/visual-regression.yml`
- `.github/workflows/perf-budget.yml`
- Standard Next.js build checks

---

## Section 6: PR Checklist

### Before Merge

Every PR must verify:

**Code Quality:**
- [ ] No inline styles (`style=` or `<style>` blocks)
- [ ] No ad-hoc JS hacks (reusable components/hooks/utils only)
- [ ] No new console errors introduced
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds

**Performance:**
- [ ] Visual regression passes (or snapshots updated with justification)
- [ ] Performance gate passes (or justified exception documented)
- [ ] Bundle deltas reviewed (check .next/analyze/)
- [ ] Largest chunks within budgets
- [ ] No unnecessary dependencies added

**Content & Localisation:**
- [ ] UK/US variants correct and consistent
- [ ] External citations are copy-only (not clickable)
- [ ] Educational framing maintained (no medical claims)
- [ ] Last-reviewed dates updated where applicable

**Accessibility:**
- [ ] Heading hierarchy logical (single H1, nested H2/H3)
- [ ] Focus order makes sense
- [ ] Keyboard navigation works
- [ ] Reduced motion respected
- [ ] No emoji in TTS-read text

**Mobile/Responsive:**
- [ ] No horizontal overflow
- [ ] CTAs visible and tappable
- [ ] Touch targets ≥ 44x44px
- [ ] Text readable without zoom

**SEO & Metadata:**
- [ ] Title and description present and accurate
- [ ] Canonical URL correct
- [ ] Hreflang tags for UK/US where applicable
- [ ] Open Graph and Twitter metadata
- [ ] Appropriate indexing rules (noindex for printables/search)

---

## Section 7: "When Perf Gate Fails" Playbook

### Reading the Perf Gate Report

**Report location:**
```
reports/perf/perf-gate.summary.json
reports/perf/lighthouse-report-*.html
```

**Key metrics to check:**
1. Lighthouse Performance Score
2. Total Blocking Time (TBT)
3. Largest Contentful Paint (LCP)
4. Cumulative Layout Shift (CLS)
5. Bundle sizes (client JS KB)

### Reading the AutoPlan

**Generate optimisation recommendations:**
```bash
npm run perf:autoplan
```

Output: `reports/perf/autoplan.md`

The AutoPlan prioritises fixes by impact/effort ratio.

### Standard Remediation Recipes

#### High TBT (> 300ms)

**Symptoms:**
- Slow interactivity
- Laggy UI responses
- High "Total Blocking Time"

**Remediation:**
1. **Reduce client JS:**
   - Move logic to Server Components
   - Remove unnecessary dependencies
   - Use dynamic imports for heavy features

2. **Split large components:**
```typescript
// ❌ Before: One large client component
'use client';
export function HeavyPage() {
  return (
    <>
      <HeavyChart />
      <HeavyForm />
      <HeavyTable />
    </>
  );
}

// ✅ After: Split into islands
export function OptimisedPage() {
  return (
    <>
      <ServerHeader />
      <HeavyChartClient /> {/* Client island */}
      <ServerContent />
      <HeavyFormClient /> {/* Client island */}
    </>
  );
}
```

3. **Defer non-critical features:**
```typescript
import dynamic from 'next/dynamic';

const HeavyFeature = dynamic(() => import('./HeavyFeature'), {
  loading: () => <Skeleton />,
  ssr: false, // Don't SSR if not needed
});
```

4. **Audit dependencies:**
```bash
npm run perf:deps
# Check allowlist for heavy packages
# Consider lightweight alternatives
```

#### High CLS (> 0.1)

**Symptoms:**
- Layout shifts during load
- Content "jumping" as images/fonts load
- Unstable UI

**Remediation:**
1. **Reserve image space:**
```typescript
// ✅ Always provide width/height
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600} // Prevents CLS
  priority
/>
```

2. **Fix font loading:**
```typescript
// Use next/font with adjustFontFallback
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  adjustFontFallback: true, // Reduces CLS
});
```

3. **Add skeleton loaders:**
```typescript
<Suspense fallback={<ContentSkeleton />}>
  <DynamicContent />
</Suspense>
```

4. **Avoid late-inserted content:**
- No banner injections after load
- No dynamic ads/widgets shifting layout
- Pre-allocate space for dynamic sections

#### Bundle Growth

**Symptoms:**
- Increased client JS size
- Larger chunks
- Dependency count increased

**Remediation:**
1. **Dependency audit:**
```bash
npm run perf:deps
# Review new packages
# Check bundle size impact
```

2. **Move logic server-side:**
```typescript
// ❌ Client-side data processing
'use client';
export function DataPage() {
  const processed = heavyProcessing(rawData);
  return <DataDisplay data={processed} />;
}

// ✅ Server-side processing
export default async function DataPage() {
  const rawData = await getData();
  const processed = heavyProcessing(rawData);
  return <DataDisplay data={processed} />;
}
```

3. **Dynamic imports:**
```typescript
// Only load when needed
const HeavyChart = dynamic(() => import('./HeavyChart'));

export function ConditionalChart({ show }: Props) {
  return show ? <HeavyChart /> : null;
}
```

4. **Check for duplicates:**
```bash
npm run build
# Review .next/analyze/client.html
# Look for duplicate packages in bundles
```

#### High LCP (> 2.5s)

**Symptoms:**
- Slow largest element paint
- Delayed hero image/content

**Remediation:**
1. **Prioritise hero image:**
```typescript
<Image src="/hero.jpg" alt="Hero" priority />
```

2. **Optimise image delivery:**
- Use WebP/AVIF formats
- Compress images appropriately
- Use CDN for static assets

3. **Reduce server response time:**
- Cache frequently accessed data
- Optimise database queries
- Use Edge functions where appropriate

4. **Avoid render-blocking resources:**
- Defer non-critical JS
- Inline critical CSS
- Use next/font for faster font loading

---

## Appendix: Route-Type Inventory

| Route | Type | Primary Goal | Target JS (KB) | Priority |
|-------|------|--------------|----------------|----------|
| `/uk` | home | Fast first impression | 120 | Critical |
| `/uk/conditions` | hub | Browse conditions | 150 | High |
| `/uk/conditions/adhd` | condition | Starter journeys | 180 | High |
| `/uk/tools` | hub | Browse tools | 150 | High |
| `/uk/tools/breathing/box-breathing` | tool | Interactive exercise | 200 | High |
| `/uk/guides` | hub | Browse guides | 150 | High |
| `/uk/guides/adhd/reading-strategies` | guide | Content consumption | 100 | High |
| `/uk/about` | trust | Credibility | 60 | Medium |
| `/uk/trust` | trust | Review policy | 60 | Medium |
| `/uk/glossary/executive-function` | glossary | Quick definition | 100 | Medium |

---

## Enforcement

This playbook is **required reading** for all contributors. PR template includes checklist confirming adherence.

**See also:**
- `ENGINEERING_STANDARDS.md` - Quick reference
- `PERF_AUTOPLAN.md` - Generated optimisation plans
- `perf/budgets.config.ts` - Budget thresholds

**Questions?** Contact: Engineering Lead

---

*Last reviewed: January 2026*
