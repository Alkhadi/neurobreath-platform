# NeuroBreath Platform Strategic Roadmap 2026

**Status:** Planning Phase  
**Date:** 19 January 2026  
**Foundation:** Evidence system complete (commits: a0dd5c6, eb92e81, 1c9303a)

---

## Executive Summary

This roadmap transforms NeuroBreath from a content platform into a **credible, unique, and legally compliant UK health resource** with evidence-backed tools and visible governance.

**Key Insight:** Health and neurodiversity content is YMYL (Your Money or Your Life). Google expects very high quality standards and strong trust signals. Users need to see evidence, review dates, and UK-specific guidance.

**Core Strategy:** Make credibility visible, protect legally, and deliver unique value through evidence-backed plans.

---

## 🎯 Highest-Value Next Action

**If you do only one thing next:**

✅ **Ship the Trust Centre + reviewed pathway pages (ADHD + Autism) with visible "last reviewed" metadata and UK signposting.**

**Why:** Immediately increases user trust, protects on safety/compliance, and supports SEO expectations for health topics.

**Timeline:** 1 week  
**Impact:** High credibility, legal protection, SEO boost

---

## 📋 Six Strategic Initiatives

### 1. Lock the Buddy/Evidence System (1–2 days)

**Goal:** Prevent regression of the evidence system just deployed

#### A. Finish Playwright Suite ✅ (Partially Complete)

**Current State:**
- 8/8 original Buddy tests passing
- Multi-viewport tests added but need minor fix

**Tasks:**
- [ ] Fix viewport tests to use `sendMessage()` instead of `sendMessageAndWaitForBuddyApi()` when API is mocked
- [ ] Re-run full suite without interruption
- [ ] Update "chips not found" test to either:
  - Navigate to `/uk` (guaranteed to have chips), or
  - Assert "chips exist OR fallback quick actions exist"

**Acceptance Criteria:**
- [ ] All Buddy tests pass on 3 viewports (375x667, 768x1024, 1280x800)
- [ ] No flaky tests (run 3 times, all pass)
- [ ] Tests complete in <5 minutes

#### B. Add CI Gate

**Implementation:**
```yaml
# .github/workflows/ci.yml
name: CI Quality Gate
on: [pull_request, push]
jobs:
  quality-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: yarn install
      - run: yarn lint          # Block on lint errors
      - run: yarn typecheck     # Block on TS errors
      - run: yarn build         # Block on build failures
      - run: yarn test:e2e      # Block on test failures
```

**Tasks:**
- [ ] Create `.github/workflows/ci.yml` with lint + typecheck + build + test:e2e
- [ ] Add global Playwright hook for console errors:
  ```typescript
  // playwright.config.ts
  use: {
    ...
    page: {
      onPageError: (error) => {
        throw new Error(`Page error: ${error.message}`);
      }
    }
  }
  ```
- [ ] Require CI pass before merging to main (GitHub branch protection)

**Acceptance Criteria:**
- [ ] CI runs on every PR
- [ ] Cannot merge if CI fails
- [ ] Console errors fail tests

#### C. Add Buddy Contract Test

**Purpose:** Validate `/api/ai-assistant` response shape so UI refactors don't break integration

**Test Implementation:**
```typescript
// tests/api-contract.spec.ts
test('Buddy API contract: response structure', async ({ request }) => {
  const response = await request.post('/api/ai-assistant', {
    data: {
      query: 'What is ADHD?',
      role: 'buddy',
      jurisdiction: 'UK',
      messages: [],
    }
  });
  
  const data = await response.json();
  
  // Core fields
  expect(data).toHaveProperty('answer');
  expect(typeof data.answer).toBe('string');
  
  // Evidence fields
  expect(data).toHaveProperty('citations');
  expect(data).toHaveProperty('references');
  expect(Array.isArray(data.references)).toBe(true);
  
  // Safety fields
  expect(data).toHaveProperty('safety');
  expect(data.safety).toHaveProperty('level');
  
  // Action fields
  expect(data).toHaveProperty('recommendedActions');
  expect(Array.isArray(data.recommendedActions)).toBe(true);
});
```

**Tasks:**
- [ ] Create `web/tests/api-contract.spec.ts`
- [ ] Test all required response fields (answer, citations, references, safety, recommendedActions)
- [ ] Test jurisdiction-aware responses (UK vs US vs EU)
- [ ] Test error cases (invalid role, missing query)

**Acceptance Criteria:**
- [ ] Contract test passes
- [ ] Test fails if response shape changes
- [ ] Documented in [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)

---

### 2. Make Credibility Visible: Governance + Trust Centre (1 week)

**Goal:** Users and Google can verify NeuroBreath's quality standards

**Impact:** High credibility, legal protection, SEO boost for YMYL content

#### A. Create Trust Centre (`/trust`)

**Structure:**
```
/trust
  /evidence-policy       - What we cite, uncertainty rules
  /editorial-policy      - Review intervals, editorial standards
  /sources               - Source tiers (A/B), credibility criteria
  /safeguarding          - Crisis signposting, urgent help
  /privacy               - Data protection, GDPR
  /terms                 - Terms of service
  /disclaimer            - Medical disclaimer, educational only
```

**Content Requirements:**

**`/trust/evidence-policy`**
- What we cite (NHS, NICE, Cochrane, PubMed = Tier A)
- What we refuse to answer without citations (diagnosis, medication advice, severe symptoms)
- Uncertainty rules ("current evidence suggests" vs. "proven to treat")
- When we signpost to professionals (GP, 111, 999)
- Last updated date

**`/trust/editorial-policy`**
- Review intervals per hub (ADHD: quarterly, Sleep: biannually)
- Editorial process (research → draft → review → publish → maintain)
- Reviewer qualifications (educational psychologists, SEND specialists, lived experience advisors)
- Changelog (what changed, when, why)
- Versioning (v1.0, v1.1, etc.)

**`/trust/sources`**
```markdown
## Source Tiers

### Tier A: Authoritative Clinical/Research
- NHS (National Health Service)
- NICE (National Institute for Health and Care Excellence)
- Cochrane Collaboration
- PubMed/peer-reviewed journals
- WHO (World Health Organization)
- CDC (Centers for Disease Control and Prevention)
- RCPsych (Royal College of Psychiatrists)

### Tier B: Reputable Support Organizations
- National Autistic Society (NAS)
- ADHD Foundation
- Mind (mental health charity)
- YoungMinds (children's mental health)
- British Dyslexia Association

### Usage Rules
- Tier A preferred for clinical claims
- Tier B used for support resources, lived experience
- All sources clearly labeled in content
- URLs provided for verification
```

**Implementation:**
```tsx
// web/app/trust/layout.tsx
export default function TrustLayout({ children }) {
  return (
    <div>
      <nav>
        <Link href="/trust/evidence-policy">Evidence Policy</Link>
        <Link href="/trust/editorial-policy">Editorial Policy</Link>
        <Link href="/trust/sources">Sources</Link>
        <Link href="/trust/safeguarding">Safeguarding</Link>
      </nav>
      {children}
    </div>
  );
}
```

**Tasks:**
- [ ] Create `/trust` directory structure
- [ ] Write evidence policy (reference existing `web/lib/evidence/evidencePolicy.ts`)
- [ ] Write editorial policy with review intervals
- [ ] Document source tiers (import from `web/lib/evidence/sourceRegistry.ts`)
- [ ] Add safeguarding page (UK crisis contacts: 999, 111, Samaritans)
- [ ] Add privacy policy (GDPR compliant)
- [ ] Add terms of service
- [ ] Add medical disclaimer

**Acceptance Criteria:**
- [ ] All pages live at `/trust/*`
- [ ] Last updated dates visible
- [ ] Mobile-responsive
- [ ] Linked from footer
- [ ] Schema.org markup for trust signals

#### B. Add Route-Level Trust Badges

**Visual Design:**
```tsx
// web/components/trust-badge.tsx
export function TrustBadge({ route }: { route: string }) {
  const review = getReviewMetadata(route);
  
  return (
    <div className="trust-badge">
      <Badge variant="outline">
        <CheckCircle className="h-3 w-3" />
        Evidence-linked
      </Badge>
      <Badge variant="outline">
        <Shield className="h-3 w-3" />
        Reviewed {review.date}
      </Badge>
      <Badge variant="outline">
        <Info className="h-3 w-3" />
        Educational only
      </Badge>
    </div>
  );
}
```

**Review Registry:**
```typescript
// web/lib/trust/reviewRegistry.ts
export interface ReviewMetadata {
  route: string;
  lastReviewed: string; // ISO date
  reviewedBy: string; // Role (e.g., "Educational Psychologist")
  nextReview: string; // ISO date
  version: string; // e.g., "1.2"
  changelog: string;
}

export const REVIEW_REGISTRY: Record<string, ReviewMetadata> = {
  '/adhd': {
    route: '/adhd',
    lastReviewed: '2026-01-15',
    reviewedBy: 'SEND Specialist',
    nextReview: '2026-04-15',
    version: '1.0',
    changelog: 'Initial NICE-aligned content',
  },
  '/autism': {
    route: '/autism',
    lastReviewed: '2026-01-15',
    reviewedBy: 'Educational Psychologist',
    nextReview: '2026-04-15',
    version: '1.0',
    changelog: 'Initial content with NAS guidance',
  },
};
```

**Tasks:**
- [ ] Create `web/lib/trust/reviewRegistry.ts`
- [ ] Add review metadata for ADHD, Autism, Anxiety, Dyslexia hubs
- [ ] Create `TrustBadge` component
- [ ] Add badges to all hub pages
- [ ] Add "Last reviewed" footer to hub pages

**Acceptance Criteria:**
- [ ] Badges visible on all hub pages
- [ ] Review dates accurate and updated
- [ ] Registry maintained monthly
- [ ] Changelog visible in Trust Centre

---

### 3. Upgrade Evidence Base (UK-First, 2–4 weeks)

**Goal:** Systematic, pathway-based evidence for each condition hub

**Impact:** SEO boost, user trust, clinical credibility

#### A. Build "Care Pathway" Pages Per Condition Hub

**Template Structure:**
```markdown
# [Condition] Care Pathway

**Last reviewed:** [Date]  
**Next review:** [Date]  
**Reviewed by:** [Role]

## What it is
Plain language definition + Tier A citations (NHS/NICE)

## Common difficulties
Age-banded: Child (5-11), Teen (12-17), Adult (18+)

## What helps (evidence-linked)
- Intervention 1 (Tier A citation)
- Intervention 2 (Tier B citation)
- ...

## What to avoid / myths
Harm reduction + myth-busting

## When to seek help
- GP referral criteria
- NHS 111 (urgent but not emergency)
- 999 (emergency)

## School & workplace supports
- SEND support (UK Education Act 1996)
- Workplace adjustments (Equality Act 2010)
- EHC Plan process (England/Wales)
```

**Implementation:**
```tsx
// web/app/[region]/[condition]/pathway/page.tsx
export default function ConditionPathway({ params }) {
  const pathway = getPathwayContent(params.condition);
  
  return (
    <div>
      <TrustBadge route={`/${params.condition}`} />
      <PathwayContent content={pathway} />
      <EvidenceFooter citations={pathway.citations} />
      <CrisisSignposting region={params.region} />
    </div>
  );
}
```

**Content Sources:**
- **ADHD:** NICE guideline NG87 (Attention deficit hyperactivity disorder)
- **Autism:** NICE guideline CG170 (Autism spectrum disorder in adults)
- **Anxiety:** NICE guideline CG113 (Generalised anxiety disorder and panic disorder)
- **Dyslexia:** British Dyslexia Association + Rose Review (2009)
- **Sleep:** NHS sleep advice + RCPsych guidance

**Tasks:**
- [ ] Create pathway template (`web/lib/content/pathwayTemplate.ts`)
- [ ] Write ADHD pathway (anchor to NICE NG87)
- [ ] Write Autism pathway (anchor to NICE CG170, NAS guidance)
- [ ] Write Anxiety pathway (anchor to NICE CG113)
- [ ] Write Dyslexia pathway (BDA + Rose Review)
- [ ] Write Sleep pathway (NHS + RCPsych)
- [ ] Add age-banded difficulties for each
- [ ] Add UK-specific school/workplace supports
- [ ] Add crisis signposting per pathway

**Acceptance Criteria:**
- [ ] All 5 pathways live
- [ ] Every claim has Tier A/B citation
- [ ] "Last reviewed" dates visible
- [ ] Mobile-responsive
- [ ] Schema.org MedicalWebPage markup

#### B. Implement Crisis/Urgent Mental Health Signposting

**Current State:** Crisis signposting exists in `web/lib/evidence/evidencePolicy.ts`

**Tasks:**
- [ ] Create `CrisisSignposting` component for consistent UI
- [ ] Add to all hub pages (visible in sidebar/footer)
- [ ] Add to Buddy/Coach/Blog responses (already implemented in API)
- [ ] Test keyword detection (emergency, urgent, crisis, self-harm, suicidal)
- [ ] Add "Urgent Help" quick access button in main nav

**Design:**
```tsx
// web/components/crisis-signposting.tsx
export function CrisisSignposting({ region }: { region: 'UK' | 'US' | 'EU' }) {
  const contacts = getCrisisContacts(region);
  
  return (
    <Alert variant="destructive" className="border-red-500">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Need urgent help?</AlertTitle>
      <AlertDescription>
        {region === 'UK' && (
          <>
            <strong>Emergency:</strong> Call 999<br />
            <strong>Urgent (non-emergency):</strong> Call NHS 111<br />
            <strong>Mental health crisis:</strong> Call Samaritans 116 123
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

**Acceptance Criteria:**
- [ ] Crisis component visible on all pages
- [ ] Buddy/Coach/Blog detect crisis keywords
- [ ] Regional contacts correct (UK/US/EU)
- [ ] Tested with safeguarding scenarios

#### C. Use Cochrane-Style "Plain Language Summaries"

**Purpose:** Widely respected, readable, evidence-based format

**Template:**
```markdown
## What did we want to find out?
[Research question in plain language]

## What did we do?
[Study methods briefly]

## What did we find?
[Key findings with certainty rating]

## What does this mean?
[Practical implications]

## How up to date is this review?
[Search date]

**Source:** Cochrane Review [DOI]
```

**Tasks:**
- [ ] Create plain language summary component
- [ ] Add summaries for ADHD interventions (e.g., CBT, medication, exercise)
- [ ] Add summaries for Autism supports (e.g., sensory strategies, social skills)
- [ ] Link to full Cochrane reviews
- [ ] Add certainty ratings (High/Moderate/Low/Very Low)

**Acceptance Criteria:**
- [ ] 3+ summaries per hub
- [ ] Linked to original Cochrane reviews
- [ ] Certainty ratings visible
- [ ] Last updated dates shown

---

### 4. Protect Legally & Reputationally (UK Compliance, 1–2 weeks)

**Goal:** Avoid ASA complaints, CQC scrutiny, and legal liability

**Impact:** Legal safety, professional credibility

#### A. Make Health-Claim Boundaries Explicit

**Current Risk:**
- Marketing-style claims ("treats depression", "cures ADHD") attract ASA enforcement
- Therapeutic claims require robust evidence (RCT-level, not anecdotal)

**ASA Guidelines (CAP Code):**
- Section 12: Medicines, medical devices, health-related products
- Must not discourage essential medical treatment
- Must not offer diagnosis/treatment without qualification
- Evidence must be robust, published, peer-reviewed

**Implementation:**

**Content Audit Checklist:**
```markdown
## Prohibited Language
❌ "treats [condition]"
❌ "cures [condition]"
❌ "diagnoses [condition]"
❌ "proven to fix"
❌ "clinically proven" (without RCT evidence)

## Permitted Language
✅ "may help manage symptoms" (with evidence)
✅ "research suggests" (with citations)
✅ "some people find" (lived experience, labeled)
✅ "evidence-based strategies include"
✅ "speak to your GP about"
```

**Tasks:**
- [ ] Audit all hub pages for prohibited language
- [ ] Replace claims with evidence-qualified statements
- [ ] Add disclaimers to tool pages ("educational only, not therapy")
- [ ] Add GP referral prompts for diagnostic/treatment questions
- [ ] Document claim guidelines in `/trust/editorial-policy`

**Acceptance Criteria:**
- [ ] No prohibited claims on site
- [ ] All therapeutic claims have RCT-level evidence
- [ ] GP referral prompts added
- [ ] Legal review passed (if budget allows)

#### B. Add Medical Safety Layer in UX

**Purpose:** Clear boundaries between education and medical advice

**Implementation:**

**Persistent Disclaimer:**
```tsx
// web/components/medical-disclaimer.tsx
export function MedicalDisclaimer() {
  return (
    <Alert className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Educational content only</AlertTitle>
      <AlertDescription>
        This is not medical advice. Always consult your GP or qualified healthcare professional for diagnosis and treatment.
      </AlertDescription>
    </Alert>
  );
}
```

**Add to:**
- [ ] All hub pages (top of content)
- [ ] All tool pages
- [ ] Buddy/Coach/Blog AI responses (already implemented in API)
- [ ] Email/PDF exports

**Red Flag Routing:**
```typescript
// web/lib/safety/redFlags.ts
export const RED_FLAG_KEYWORDS = [
  // Physical emergency
  'chest pain', 'difficulty breathing', 'severe headache', 'unconscious',
  
  // Mental health crisis
  'suicide', 'suicidal', 'self-harm', 'end my life', 'kill myself',
  
  // Safeguarding
  'abuse', 'being hurt', 'unsafe at home', 'scared of',
  
  // Medical emergency
  'severe pain', 'bleeding heavily', 'allergic reaction',
];

export function detectRedFlag(query: string): boolean {
  return RED_FLAG_KEYWORDS.some(keyword => 
    query.toLowerCase().includes(keyword)
  );
}
```

**Tasks:**
- [ ] Add `MedicalDisclaimer` to all health pages
- [ ] Implement red flag detection (use existing `detectSafeguardingConcerns` in `evidencePolicy.ts`)
- [ ] Add "Uncertainty mode" to AI responses (already in `answerRouter.ts`)
- [ ] Test with safeguarding scenarios

**Acceptance Criteria:**
- [ ] Disclaimer visible on all health content
- [ ] Red flags trigger crisis signposting
- [ ] No definitive language without citations
- [ ] AI says "I don't know" when uncertain

---

### 5. Make NeuroBreath Unique: The "One-Stop Plan Engine" (4–8 weeks)

**Goal:** Transform from content site to actionable planning platform

**Impact:** User retention, unique value proposition, monetization potential

#### A. NeuroBreath Plans (Core Differentiator)

**Concept:** Personalized, evidence-backed weekly plans combining breathing exercises + behavioural supports

**User Flow:**
1. User selects condition (ADHD, Anxiety, Sleep, etc.)
2. User selects role (Parent, Teacher, Adult, Workplace)
3. System generates 4-week plan with daily 5-10 minute activities
4. User tracks progress (simple checklist, local storage)
5. System adapts based on feedback (optional)

**Plan Structure:**
```typescript
// web/lib/plans/planTypes.ts
export interface Plan {
  id: string;
  title: string;
  condition: 'adhd' | 'autism' | 'anxiety' | 'sleep' | 'dyslexia';
  role: 'parent' | 'teacher' | 'adult' | 'workplace';
  duration: number; // weeks
  weeks: Week[];
  evidenceBase: EvidenceReference[];
  lastReviewed: string;
}

export interface Week {
  number: number;
  theme: string;
  days: Day[];
}

export interface Day {
  number: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  type: 'breathing' | 'movement' | 'reflection' | 'practice';
  evidenceTier: 'A' | 'B';
  citation: string;
  completed?: boolean;
}
```

**Example Plan (ADHD, Parent Role):**
```markdown
# 4-Week ADHD Support Plan for Parents

**Evidence base:** NICE NG87, Cochrane Review (Behavioural interventions)

## Week 1: Understanding & Routine
**Theme:** Building structure

### Day 1: Morning Routine
- Activity 1: Box Breathing (5 min)
- Activity 2: Visual Schedule Setup (5 min)
- Evidence: NICE NG87 (structured routines reduce symptoms)

### Day 2: Transitions
- Activity 1: Coherent Breathing (5 min)
- Activity 2: Transition Warning System (5 min)
...

## Week 2: Attention & Focus
...

## Week 3: Emotional Regulation
...

## Week 4: Review & Adapt
...
```

**Implementation:**
```tsx
// web/app/[region]/plans/[condition]/page.tsx
export default function PlanGenerator({ params }) {
  const [selectedRole, setSelectedRole] = useState<Role>('parent');
  const [plan, setPlan] = useState<Plan | null>(null);
  
  const generatePlan = () => {
    const plan = createPlan(params.condition, selectedRole);
    setPlan(plan);
    savePlanToLocalStorage(plan);
  };
  
  return (
    <div>
      <RoleSelector value={selectedRole} onChange={setSelectedRole} />
      <Button onClick={generatePlan}>Generate My Plan</Button>
      {plan && <PlanView plan={plan} />}
    </div>
  );
}
```

**Tasks:**
- [ ] Create plan data structure (`planTypes.ts`)
- [ ] Create plan generator (`planGenerator.ts`)
- [ ] Create plans for ADHD (Parent, Teacher, Adult)
- [ ] Create plans for Anxiety (Parent, Adult)
- [ ] Create plans for Sleep (Parent, Adult)
- [ ] Add progress tracking (local storage)
- [ ] Add plan export (PDF/print)
- [ ] Add evidence citations per activity

**Acceptance Criteria:**
- [ ] Plans generate in <1 second
- [ ] Progress persists across sessions
- [ ] All activities evidence-linked
- [ ] Plans printable
- [ ] Mobile-friendly checklist UI

#### B. Printable "Resource Packs" (Trust Lever)

**Purpose:** Offline resources increase trust and practical value

**Pack Structure:**
```markdown
# ADHD Support Resource Pack (UK)

## Contents
1. School Support Checklist (SEND Code of Practice aligned)
2. Home Routine Template (visual schedule)
3. "What to Tell Your GP" Notes Page
4. Crisis/Urgent Help Card
5. Evidence Summary (NICE guidance)
6. Useful Contacts (UK)

**Download as PDF** | **Print All**
```

**Templates:**

**1. School Support Checklist:**
```markdown
## SEND Support Checklist (England/Wales)

### Before the meeting
- [ ] List specific difficulties your child faces
- [ ] Note times/situations when difficulties occur
- [ ] Gather evidence (teacher observations, reports)
- [ ] Review SEND Code of Practice (2015)

### At the meeting
- [ ] Request SEN Support Plan
- [ ] Discuss reasonable adjustments
- [ ] Agree review date (termly)
- [ ] Request copies of all documents

### If concerns continue
- [ ] Request EHC Needs Assessment
- [ ] Contact SENDIASS (free, independent advice)
- [ ] Document all communication

**Evidence:** SEND Code of Practice (2015), Education Act 1996
```

**2. Home Routine Template:**
Visual PDF with time-blocked schedule + picture cards

**3. "What to Tell Your GP" Notes:**
```markdown
## Preparing for Your GP Appointment

### What to bring
- List of specific concerns
- Timeline (when symptoms started)
- Impact on daily life (school, home, relationships)
- Family history (if relevant)

### Questions to ask
- [ ] What are the next steps?
- [ ] Do you recommend a specialist referral?
- [ ] Are there any support services available?
- [ ] What can we do while waiting?

### After the appointment
- [ ] Request summary letter
- [ ] Book follow-up
- [ ] Contact school/workplace if appropriate
```

**4. Crisis/Urgent Help Card:**
Wallet-sized, printable card with UK emergency contacts

**Tasks:**
- [ ] Create pack templates for ADHD, Autism, Anxiety, Dyslexia
- [ ] Design printable PDFs (A4, UK standard)
- [ ] Add download buttons to hub pages
- [ ] Track downloads (analytics)
- [ ] Ensure SEND Code of Practice alignment (England/Wales)

**Acceptance Criteria:**
- [ ] 4 packs available (ADHD, Autism, Anxiety, Dyslexia)
- [ ] Professional design, printer-friendly
- [ ] UK-specific (SEND, NHS, GP referral process)
- [ ] Last reviewed dates visible
- [ ] Mobile download works

#### C. Evidence-Backed Tool Library

**Current State:** Tools exist (breathing exercises, phonics, reading fluency) but lack metadata

**Enhanced Tool Structure:**
```typescript
// web/lib/tools/toolMetadata.ts
export interface ToolMetadata {
  id: string;
  title: string;
  purpose: string;
  audience: string[]; // ['child', 'teen', 'adult']
  duration: number; // minutes
  evidenceTier: 'A' | 'B';
  citations: string[];
  lastReviewed: string;
  benefits: string[];
  instructions: string;
}

export const TOOL_REGISTRY: Record<string, ToolMetadata> = {
  'box-breathing': {
    id: 'box-breathing',
    title: 'Box Breathing',
    purpose: 'Reduce anxiety, improve focus',
    audience: ['child', 'teen', 'adult'],
    duration: 5,
    evidenceTier: 'A',
    citations: [
      'Cochrane Review: Breathing exercises for anxiety (2019)',
      'NHS: Breathing exercises for stress',
    ],
    lastReviewed: '2026-01-15',
    benefits: [
      'Activates parasympathetic nervous system',
      'Reduces cortisol (stress hormone)',
      'Improves focus and emotional regulation',
    ],
    instructions: 'Breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 5 times.',
  },
  // ... more tools
};
```

**UI Enhancement:**
```tsx
// web/components/tool-card.tsx
export function ToolCard({ tool }: { tool: ToolMetadata }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tool.title}</CardTitle>
        <Badge variant={tool.evidenceTier === 'A' ? 'default' : 'secondary'}>
          Evidence Tier {tool.evidenceTier}
        </Badge>
      </CardHeader>
      <CardContent>
        <p><strong>Purpose:</strong> {tool.purpose}</p>
        <p><strong>Duration:</strong> {tool.duration} minutes</p>
        <p><strong>For:</strong> {tool.audience.join(', ')}</p>
        <p><strong>Last reviewed:</strong> {tool.lastReviewed}</p>
        <Collapsible>
          <CollapsibleTrigger>View Evidence</CollapsibleTrigger>
          <CollapsibleContent>
            {tool.citations.map(c => <p key={c}>{c}</p>)}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
```

**Tasks:**
- [ ] Create `toolMetadata.ts` registry
- [ ] Add metadata for all existing tools (breathing, phonics, reading, ADHD tools, autism tools)
- [ ] Update tool pages with metadata display
- [ ] Add evidence citations to each tool
- [ ] Add "Last reviewed" dates
- [ ] Create tool library index page (`/tools`)

**Acceptance Criteria:**
- [ ] All tools have metadata
- [ ] Evidence tier visible
- [ ] Last reviewed dates shown
- [ ] Citations expandable
- [ ] Tool library searchable/filterable

---

## 📅 30/60/90 Day Execution Plan

### Next 30 Days (Foundation)

**Week 1 (Jan 20-26):**
- [ ] Fix Buddy E2E tests (viewport + chips)
- [ ] Add CI gate (lint + typecheck + build + test:e2e)
- [ ] Add Buddy contract test
- [ ] Create Trust Centre structure (`/trust`)

**Week 2 (Jan 27 - Feb 2):**
- [ ] Write evidence policy page
- [ ] Write editorial policy page
- [ ] Document source tiers
- [ ] Add safeguarding page

**Week 3 (Feb 3-9):**
- [ ] Create review registry
- [ ] Add trust badges to hub pages
- [ ] Create ADHD pathway (NICE NG87 aligned)

**Week 4 (Feb 10-16):**
- [ ] Create Autism pathway (NICE CG170 aligned)
- [ ] Add crisis signposting component
- [ ] Deploy Trust Centre + pathways

**Deliverables:**
- ✅ Trust Centre live with 4 pages
- ✅ Trust badges on ADHD + Autism hubs
- ✅ NICE-aligned pathways for ADHD + Autism
- ✅ CI gate preventing regressions

### Next 60 Days (Resources + Plans)

**Week 5-6 (Feb 17 - Mar 2):**
- [ ] Create ADHD resource pack (school checklist, routine template, GP notes, crisis card)
- [ ] Create Autism resource pack
- [ ] Create Dyslexia resource pack
- [ ] Design printable PDFs

**Week 7-8 (Mar 3-16):**
- [ ] Build Plan Engine MVP (data structure + generator)
- [ ] Create ADHD plans (Parent, Teacher, Adult)
- [ ] Create Anxiety plans (Parent, Adult)
- [ ] Add progress tracking (local storage)

**Week 9 (Mar 17-23):**
- [ ] Create unified preference store integration (use existing `userPreferences.ts`)
- [ ] Update Buddy to use plans
- [ ] Update Coach to recommend plans
- [ ] Update Blog to link plans

**Deliverables:**
- ✅ 3 resource packs downloadable (ADHD, Autism, Dyslexia)
- ✅ Plan Engine live with 5 plans
- ✅ Progress tracking working
- ✅ All AI surfaces integrated

### Next 90 Days (Scale + Quality)

**Week 10-11 (Mar 24 - Apr 6):**
- [ ] Create Sleep pathway + plan + resource pack
- [ ] Create Anxiety pathway + plan + resource pack
- [ ] Create Executive Function pathway + plan

**Week 12 (Apr 7-13):**
- [ ] Build review registry workflow (monthly/quarterly review triggers)
- [ ] Add "Evidence coverage" dashboard (% of content with citations)
- [ ] Add analytics (track plan usage, resource downloads, Buddy queries)

**Week 13 (Apr 14-20):**
- [ ] Conduct content audit (prohibited language check)
- [ ] Legal review (if budget allows)
- [ ] Update all disclaimers
- [ ] Final QA sweep

**Deliverables:**
- ✅ 5 pathways complete (ADHD, Autism, Anxiety, Sleep, Dyslexia)
- ✅ 10+ plans available
- ✅ Review registry operational
- ✅ Evidence dashboard showing 80%+ coverage
- ✅ Legal compliance verified

---

## 📊 Success Metrics

### Credibility Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Trust Centre pages | 6 | 0 | ⏳ |
| Hub pages with trust badges | 5 | 0 | ⏳ |
| Content with "last reviewed" dates | 100% | 0% | ⏳ |
| Evidence coverage (% with citations) | 80% | ~40% | ⏳ |
| Review registry entries | 10 | 0 | ⏳ |

### Compliance Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Prohibited health claims | 0 | TBD | ⏳ |
| Medical disclaimers | 100% | ~60% | ⏳ |
| Crisis signposting availability | 100% | ~40% | ⏳ |
| Red flag detection accuracy | 95% | ~70% | ⏳ |

### Unique Value Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Plans available | 10 | 0 | ⏳ |
| Resource packs available | 5 | 0 | ⏳ |
| Tools with evidence metadata | 100% | 0% | ⏳ |
| Plan completion rate | 40% | - | ⏳ |
| Resource pack downloads | 500/month | - | ⏳ |

### Technical Quality Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| CI gate pass rate | 100% | - | ⏳ |
| E2E test coverage | 80% | ~20% | ⏳ |
| TypeScript errors | 0 | 0 | ✅ |
| ESLint errors | 0 | 0 | ✅ |
| Build time | <60s | 54s | ✅ |

---

## 🚀 Getting Started

### Immediate Next Steps (This Week)

1. **Lock the evidence system** (1-2 days)
   ```bash
   # Fix viewport tests
   cd web/tests
   # Edit buddy.spec.ts lines 506-510
   
   # Add CI gate
   mkdir -p .github/workflows
   # Create ci.yml
   ```

2. **Create Trust Centre skeleton** (2-3 days)
   ```bash
   cd web/app
   mkdir -p trust/{evidence-policy,editorial-policy,sources,safeguarding}
   # Create page.tsx files
   ```

3. **Write ADHD pathway** (2-3 days)
   - Research NICE NG87
   - Draft content with citations
   - Add last reviewed date
   - Deploy to `/adhd/pathway`

### Resource Allocation

**Developer Time:**
- Week 1-4: 20 hours/week (testing + Trust Centre)
- Week 5-8: 30 hours/week (resource packs + plans)
- Week 9-13: 20 hours/week (scale + QA)

**Content Writer Time:**
- Week 1-4: 15 hours/week (Trust Centre + pathways)
- Week 5-8: 10 hours/week (resource packs)
- Week 9-13: 10 hours/week (additional pathways)

**Total Effort:** ~450 hours over 90 days (5-6 hours/day)

---

## 📚 Reference Documents

1. **NICE Guidelines:**
   - NG87: ADHD (diagnosis & management)
   - CG170: Autism in adults
   - CG113: Generalised anxiety disorder

2. **UK Legislation:**
   - SEND Code of Practice (2015)
   - Children and Families Act 2014
   - Equality Act 2010
   - Education Act 1996

3. **ASA Guidelines:**
   - CAP Code Section 12 (Medicines, medical devices, health)
   - Marketing of health products & services

4. **Existing Implementation:**
   - [BUDDY_EVIDENCE_UPGRADE_REPORT.md](BUDDY_EVIDENCE_UPGRADE_REPORT.md)
   - [INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)
   - `web/lib/evidence/*` (source registry, policy)
   - `web/lib/ai/core/*` (system prompts, citations, safety)

---

## 🎯 Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Evidence system regresses | High | CI gate, contract tests |
| ASA complaint about health claims | High | Content audit, legal review |
| Users expect diagnosis/treatment | Medium | Clear disclaimers, GP referral prompts |
| Pathway content becomes outdated | Medium | Review registry, quarterly updates |
| Plans not evidence-based | Medium | Cite all activities, Tier A/B labels |
| Resource packs legally problematic | Low | Legal review, "educational only" labels |

---

**Next Action:** Start with Trust Centre + ADHD/Autism pathways (highest value, 1 week effort).

This roadmap builds on the evidence system foundation (commits: a0dd5c6, eb92e81, 1c9303a) and transforms NeuroBreath into a credible, compliant, and uniquely valuable UK health resource.
