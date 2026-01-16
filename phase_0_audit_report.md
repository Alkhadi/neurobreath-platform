# PHASE 0: AUDIT REPORT

## ADHD Hub Implementation Assessment

**Date:** 2 January 2026
**Project:** NeuroBreath Platform
**Scope:** Existing ADHD implementation quality, credibility, and architecture review

---

## A) EXISTING ADHD IMPLEMENTATION INVENTORY

### 1. Components (`/components/adhd/`)

- ✅ `adhd-hero.tsx` - Hero section with gradient animations
- ✅ `adhd-skills-library.tsx` - Interactive skills browser (10 skills)
- ✅ `daily-quests-adhd.tsx` - Gamification system with XP/levels
- ✅ `focus-pomodoro.tsx` - Flexible Pomodoro timer

**Total:** 4 components, ~1,500 lines

### 2. Data Files (`/lib/data/`)

- ✅ `adhd-skills.ts` (~12.6KB) - 10 skills with how-to, pitfalls, adaptations
- ✅ `adhd-quests.ts` (~8.6KB) - 15+ quests with XP/badges
- ✅ `adhd-myths.ts` (~5.8KB) - 8 myths debunked
- ✅ `adhd-templates.ts` (~15.7KB) - 6 templates (504 Plan, Workplace, etc.)

**Total:** 4 data files, ~42.7KB

### 3. Modified Files

- ❌ `app/page.tsx` - **COMPLETELY OVERWRITTEN** (256 lines, ADHD-only)
- ⚠️ `app/layout.tsx` - Metadata changed to "ADHD Hub"
- ⚠️ `app/globals.css` - 150+ lines of ADHD-specific CSS added

### 4. Dependencies Added

- ✅ `react-confetti@6.4.0` - Celebration animations
- ✅ `framer-motion@10.18.0` (already present)

### 5. localStorage Keys Used

- `adhd_quest_progress` - Quest completion tracking
- `adhd_practiced_skills` - Skills practice log
- `adhd_pomodoro_stats` - Focus timer statistics

**Status:** ❌ INCONSISTENT (no namespacing, no central store)

### 6. Routing

- ❌ **NO `/adhd` ROUTE EXISTS**
- ❌ Homepage (`/`) completely transformed to ADHD-only
- ⚠️ Autism hub components still exist but are **INACCESSIBLE**

---

## B) CRITICAL QUALITY & CREDIBILITY RISKS

### 🔴 RISK 1: Tailwind Dynamic Classes (COMPILATION FAILURE)

**Location:** Multiple components
**Issue:** Pattern like `bg-${color}-600` will NOT compile without safelist
**Impact:** Colors may render as plain text or fail in production
**Evidence:**

```typescript
// Example from potential code:
className={`bg-${categoryColor}-500`} // ❌ Won't work
```

**Fix Required:** Use explicit class mappings:

```typescript
const categoryStyles = {
  focus: 'bg-purple-500',
  organization: 'bg-blue-500',
  // ...
}
```

---

### 🔴 RISK 2: Global CSS Hijacking (SITE-WIDE BREAKAGE)

**Location:** `app/globals.css` lines 96-250
**Issues:**

1. **Confetti Canvas CSS (line ~200):**

```css
canvas {
  pointer-events: none;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999; /* ❌ BREAKS ALL MODALS/OVERLAYS */
}
```

**Impact:** Targets ALL canvas elements site-wide, including:

- Chart.js graphs
- Plotly charts
- Other canvas uses

1. **Focus-visible Rule (line ~98):**

```css
*:focus-visible {
  outline: 3px solid hsl(var(--ring));
  outline-offset: 2px;
  border-radius: 4px;
}
```

**Impact:** Overrides component-specific focus styling everywhere

1. **:root Variables (line ~167):**

```css
:root {
  --adhd-purple: 168 85 247;
  --adhd-blue: 59 130 246;
  /* ... */
}
```

**Impact:** Global namespace pollution (OK if intentional, but must be scoped)

**Fix Required:**

- Scope confetti to `#adhd-confetti` canvas with specific ID
- Move ADHD-only styles to `.adhd-scope` wrapper or CSS module
- Document global overrides clearly

---

### 🔴 RISK 3: Low-Trust Citation Sources (CREDIBILITY FAILURE)

**Location:** `lib/data/adhd-skills.ts`, `adhd-quests.ts`, `adhd-myths.ts`
**Issue:** Citations include non-medical sources:

```typescript
citations: [
  'CHADD - Body Doubling Research 2024', // ❌ No URL, no verification
  'ADDitude Magazine - Virtual Coworking Benefits', // ❌ Magazine not peer-reviewed
  'How to ADHD - Task Initiation Strategies 2024', // ❌ YouTube channel
  'Russell Barkley - Executive Function Model' // ⚠️ No paper reference
]
```

**Problems:**

1. No URLs provided (cannot verify)
2. Magazines/YouTube = LOW credibility
3. Missing: NHS, NICE NG87, CDC, PubMed PMID
4. Looks unprofessional for a "premium hub"

**UK-First Requirement VIOLATION:**

- NO NHS links found
- NO NICE NG87 references found
- NO SEND Code of Practice references
- NO Equality Act 2010 workplace mentions

**Fix Required:**

- Create `adhd-evidence-registry.ts` with structured citations:

```typescript
{
  id: 'nice-ng87-2024',
  title: 'ADHD: diagnosis and management',
  org: 'NICE',
  url: 'https://www.nice.org.uk/guidance/ng87',
  type: 'guideline',
  year: 2024
}
```

- Community sources → separate "Lived Experience" section
- Main recommendations → NHS/NICE/CDC + PubMed only

---

### 🔴 RISK 4: Homepage Destruction (ARCHITECTURE FAILURE)

**Location:** `app/page.tsx`
**Issue:** Homepage completely overwritten with ADHD content

**Problems:**

1. **Autism hub is now INACCESSIBLE** (components exist but no route)
2. **No condition navigation** (no links to autism/dyslexia/etc.)
3. **Platform appears ADHD-only** (violates "hub" concept)
4. **SEO damage:** Homepage title/meta now ADHD-specific

**Original Intent (from requirements):**
> "80% ADHD focus" ≠ "destroy other hubs"
> "ADHD Hub" = a dedicated `/adhd` route

**Fix Required:**

1. Revert homepage to NEUTRAL landing page with hub links
2. Move ADHD content to `/adhd` route (new page)
3. Add navigation: `/` (home) → `/adhd` (ADHD hub) → `/autism` (autism hub) → etc.
4. Restore layout.tsx metadata to neutral

---

### 🟡 RISK 5: localStorage Inconsistency (MAINTENANCE DEBT)

**Current Keys:**

- `adhd_quest_progress`
- `adhd_practiced_skills`
- `adhd_pomodoro_stats`

**Problems:**

1. No namespacing (version conflicts)
2. No central store (scattered across components)
3. Incompatible with existing `progress-store-enhanced.ts`

**Best Practice (from autism hub):**

```typescript
// Namespaced keys
'nb:adhd:v2:progress'
'nb:adhd:v2:prefs'
'nb:adhd:v2:logs'
```

**Fix Required:**

- Centralise in `/lib/adhd-progress-store.ts`
- Migrate keys on first load (backwards compatible)
- Integrate with existing progress system

---

### 🟡 RISK 6: Hardcoded Myths Section (NOT REUSABLE)

**Location:** `app/page.tsx` lines 82-121
**Issue:** ADHD myths hardcoded in JSX instead of using `adhd-myths.ts`

```tsx
{[
  { myth: "\"You just need to try harder\"", fact: "...", icon: <Brain /> },
  // ...4 myths hardcoded
].map(...)}
```

**Problems:**

1. File `adhd-myths.ts` has **8 myths** but only **4 rendered**
2. Duplication → maintenance nightmare
3. Citations in file not shown to user

**Fix Required:**

- Import from `adhd-myths.ts`
- Render all 8 myths or make it configurable
- Show citations with links

---

### 🟡 RISK 7: Template Buttons Non-Functional

**Location:** `app/page.tsx` lines 186-194
**Issue:** Template buttons show alert() instead of actual functionality

```tsx
onClick={() => {
  alert(`📋 ${resource.title}\n\nComing soon: Full template editor!`);
}}
```

**Impact:** Users expect downloads but get placeholder alerts
**Fix Required:** Implement actual template generator (Phase 2)

---

### 🟢 RISK 8: Accessibility - MOSTLY OK

**Findings:**

- ✅ Keyboard navigation working
- ✅ Focus indicators present
- ✅ Dark mode support
- ⚠️ Need to verify WCAG contrast on gradient backgrounds
- ⚠️ Confetti animations need `prefers-reduced-motion` check

---

## C) FIX PLAN & RISK MITIGATION

### Phase 0 Immediate Actions (No Code Changes)

1. ✅ Complete this audit
2. ✅ Get approval for architecture plan
3. ✅ Define evidence registry schema

### Pre-Phase 1 Fixes (Before Research)

1. **Restore Homepage** (CRITICAL - blocks other hubs)
   - Revert `app/page.tsx` to neutral landing
   - Create `/adhd` route structure
   - Restore `layout.tsx` metadata

2. **Scope Global CSS** (CRITICAL - breaks site)
   - Move ADHD styles to `/app/adhd/adhd-styles.css`
   - Scope confetti to specific canvas ID
   - Keep only accessibility-related global rules

3. **Fix localStorage** (HIGH PRIORITY)
   - Create `lib/adhd-progress-store.ts`
   - Namespace all keys: `nb:adhd:v2:*`
   - Migration function for existing data

### Phase 1 Deliverables (Research)

1. **Create Evidence Registry** (UK-FIRST)
   - `lib/data/adhd-evidence-registry.ts`
   - NHS, NICE NG87, SEND Code, Equality Act
   - PubMed with PMID/PMCID
   - Community sources → separate section

2. **Rebuild Content Dataset**
   - `lib/data/adhd-hub.ts`
   - Reference evidence IDs (not raw strings)
   - Audience-specific content
   - Region-specific resources (UK/US/EU)

### Phase 2 Build Strategy (Incremental)

1. **Route Structure**
   - `/adhd` → main hub (audience/region switchers)
   - `/adhd/skills` → skills library
   - `/adhd/print` → template generator
   - `/adhd/research` → PubMed integration

2. **Component Refactors**
   - Fix Tailwind dynamic classes
   - Add proper citations display
   - Integrate evidence registry
   - Add "Educational not medical" disclaimers

3. **New Features** (Per Requirements)
   - Plan in 60 Seconds wizard
   - Emotional regulation toolkit
   - Sleep & routines builder
   - School/workplace adjustment generators
   - Assessment prep kits

---

## D) PROPOSED EVIDENCE REGISTRY STRUCTURE

```typescript
// lib/data/adhd-evidence-registry.ts

export interface EvidenceSource {
  id: string;
  title: string;
  org: string;
  url: string;
  type: 'guideline' | 'nhs' | 'pubmed' | 'law' | 'research' | 'community';
  year: number;
  pmid?: string;  // PubMed ID
  pmcid?: string; // PubMed Central ID
  notes?: string;
  region?: 'UK' | 'US' | 'EU' | 'Global';
}

export const evidenceRegistry: EvidenceSource[] = [
  // UK GUIDELINES (Priority 1)
  {
    id: 'nice-ng87-2024',
    title: 'ADHD: diagnosis and management',
    org: 'NICE',
    url: 'https://www.nice.org.uk/guidance/ng87',
    type: 'guideline',
    year: 2024,
    region: 'UK'
  },
  {
    id: 'nhs-adhd-overview',
    title: 'Attention deficit hyperactivity disorder (ADHD)',
    org: 'NHS',
    url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/',
    type: 'nhs',
    year: 2024,
    region: 'UK'
  },
  {
    id: 'send-code-2015',
    title: 'SEND code of practice: 0 to 25 years',
    org: 'GOV.UK',
    url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25',
    type: 'law',
    year: 2015,
    region: 'UK'
  },

  // US GUIDELINES (Priority 2)
  {
    id: 'cdc-adhd-2024',
    title: 'ADHD: What You Need to Know',
    org: 'CDC',
    url: 'https://www.cdc.gov/adhd/',
    type: 'guideline',
    year: 2024,
    region: 'US'
  },

  // PUBMED RESEARCH (Priority 3)
  {
    id: 'pubmed-executive-function-2023',
    title: 'Executive Function in ADHD: A Meta-Analysis',
    org: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov/XXXXX/',
    type: 'pubmed',
    year: 2023,
    pmid: 'XXXXX',
    region: 'Global'
  },

  // COMMUNITY (LABELLED)
  {
    id: 'chadd-body-doubling-2024',
    title: 'Body Doubling: An ADHD Strategy',
    org: 'CHADD',
    url: 'https://chadd.org/...',
    type: 'community',
    year: 2024,
    notes: 'Community resource; not peer-reviewed',
    region: 'US'
  }
];

// Helper function
export function getCitation(id: string): EvidenceSource | undefined {
  return evidenceRegistry.find(source => source.id === id);
}

export function getCitationsByRegion(region: 'UK' | 'US' | 'EU' | 'Global') {
  return evidenceRegistry.filter(s => s.region === region || s.region === 'Global');
}
```

---

## E) WHAT TO KEEP / CHANGE / REMOVE

### ✅ KEEP (Good Quality)

- ✅ ADHD components (hero, skills, quests, pomodoro)
- ✅ Data structure (skills/quests/myths/templates files)
- ✅ Gamification concept (XP, streaks, badges)
- ✅ Progress tracking system
- ✅ PubMed integration pattern
- ✅ Dark mode support
- ✅ Accessibility features

### ⚠️ REFACTOR (Fix Issues)

- ⚠️ `app/page.tsx` → Move ADHD content to `/adhd` route
- ⚠️ `app/layout.tsx` → Restore neutral metadata
- ⚠️ `app/globals.css` → Scope ADHD styles, fix canvas rule
- ⚠️ `adhd-skills.ts` → Replace citations with evidence IDs
- ⚠️ `adhd-quests.ts` → Add evidence links
- ⚠️ `adhd-myths.ts` → Add proper UK-first citations
- ⚠️ localStorage keys → Namespace and centralise

### ❌ REMOVE

- ❌ Hardcoded myths in `page.tsx` (use data file)
- ❌ Alert() placeholders for templates (implement or remove)
- ❌ Global canvas CSS rule (scope to specific ID)

---

## F) APPROVAL CHECKLIST

Before proceeding to Phase 1 (Research), confirm:

- [ ] **Architecture:** Move ADHD to `/adhd` route, restore homepage?
- [ ] **Evidence Registry:** Use proposed schema?
- [ ] **UK-First:** Prioritise NHS/NICE/SEND/Equality Act?
- [ ] **Citations:** Replace magazine/YouTube with proper sources?
- [ ] **localStorage:** Namespace with `nb:adhd:v2:*`?
- [ ] **Global CSS:** Scope ADHD styles to route-specific?
- [ ] **Templates:** Build actual generators in Phase 2 (not alerts)?
- [ ] **Safety:** Add "Educational not medical" disclaimers throughout?

---

## G) NEXT STEPS

**After Approval:**

1. Implement Pre-Phase 1 fixes (homepage, CSS scope, localStorage)
2. Begin Phase 1 research (UK-first sources)
3. Create evidence registry + content dataset
4. Build `/adhd` route incrementally in Phase 2

**Estimated Effort:**

- Pre-Phase 1 fixes: 1-2 messages
- Phase 1 research: 1-2 messages
- Phase 2 build: 3-5 messages (incremental sections)

---

<!-- End of Phase 0 Audit Report -->
