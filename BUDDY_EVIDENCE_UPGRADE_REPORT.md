# NeuroBreath Buddy Restoration & Evidence Upgrade - Implementation Report

**Date:** 19 January 2026  
**Project:** neurobreath-platform  
**Branch:** main  
**Current HEAD:** 91a4ad3

---

## PHASE 0-1: Root Cause Analysis

### Timeline Analysis

**Last Known Good Commit:**
- **Hash:** `8b2e2b9`
- **Date:** Saturday, 17 January 2026, 18:44:27 UTC (~23:44 local UK time)
- **Message:** "feat: Phase 3 - Site-Wide Integration"
- **Status:** Buddy confirmed working at ~23:30 local time

**First Breaking Commit:**
- **Hash:** `0242bac`
- **Date:** Sunday, 18 January 2026, 20:17:43 UTC
- **Message:** "Professionally enhance NeuroBreath Buddy dialog: API fixes, accessibility, error handling, performance"
- **Changes:** 196 insertions, 35 deletions
- **Files affected:** `web/components/page-buddy.tsx`, `web/app/api/api-ai-chat-buddy/route.ts`

**Current State:**
- **Hash:** `91a4ad3`
- **Date:** Monday, 19 January 2026, 21:35:30 UTC
- **Message:** "fix(buddy): improve degraded API mode and stabilize e2e tests"
- **Status:** Partial fixes applied, but user reports Buddy still "not working accurately"

### Root Cause Hypothesis

Based on git diff analysis between `8b2e2b9` (good) and `0242bac` (breaking):

1. **Multiple Conflicting API Routes**
   - Three separate routes exist: `/api/ai-chat`, `/api/ai-coach`, `/api/api-ai-chat-buddy`
   - No shared evidence layer or consistent response format
   - Duplication leads to inconsistent behavior

2. **No Evidence System**
   - Responses lack NHS/NICE/PubMed citations
   - No guardrails against fabricated health claims
   - No crisis signposting for safeguarding concerns

3. **Focus Management Side Effects**
   - New focus trap logic added in breaking commit
   - May interfere with dialog interactions on certain devices/browsers
   - `useEffect` dependency array changes could cause stale closures

4. **Component State Complexity**
   - Multiple `useEffect` hooks with overlapping concerns
   - `generateDynamicWelcome` moved after `scanPageContent`, potential race condition
   - Auto-scroll logic duplicated

5. **Missing Unified Preferences**
   - Each AI system (Buddy/Coach/Blog) manages its own state
   - No single source of truth for TTS, region, accessibility settings

---

## PHASE 2-4: Evidence System Implementation (COMPLETED)

### Deliverables Created

#### 1. Evidence Source Registry
**File:** `web/lib/evidence/sourceRegistry.ts`

**Features:**
- Canonical registry of 12+ authoritative sources
- Tier A (clinical/research): NHS, NICE, RCPsych, PubMed, Cochrane, WHO, CDC
- Tier B (support orgs, clearly labeled): NAS, ADHD Foundation, Mind, YoungMinds, BDA
- Topic tagging (ADHD, autism, dyslexia, anxiety, etc.)
- URL validation against domain allowlists
- Citation format metadata

**Exports:**
- `EVIDENCE_SOURCES` - Complete source registry
- `getSourcesByTopic()` - Filter by topic and tier
- `getSourceById()` - Lookup by ID
- `validateSourceUrl()` - Security validation
- `getClinicalSources()` - All Tier A sources
- `getUKSources()` / `getUSSources()` - Regional filters

#### 2. Evidence Policy Module
**File:** `web/lib/evidence/evidencePolicy.ts`

**Features:**
- Safeguarding keyword detection (emergency, urgent, crisis, safeguarding)
- Crisis signposting by jurisdiction (UK: 999/NHS 111, US: 911/988, EU: 112)
- Educational disclaimer enforcement
- Answer validation rules (citation requirements, cautious language)
- Topic-specific guidelines

**Exports:**
- `SAFEGUARDING_KEYWORDS` - Crisis detection patterns
- `CRISIS_SIGNPOSTS` - UK/US/EU emergency guidance
- `EDUCATIONAL_DISCLAIMER` - Required disclaimer text
- `DEFAULT_EVIDENCE_POLICY` - Strict evidence rules
- `detectSafeguardingConcerns()` - Query safety check
- `getCrisisSignposting()` - Emergency response text
- `validateAnswer()` - Policy compliance check
- `formatAnswerWithPolicy()` - Wrap answer with disclaimers
- `getTopicGuideline()` - Topic-specific guidance

#### 3. Unified AI Core System
**Location:** `web/lib/ai/core/`

**Modules Created:**

**a) `systemPrompts.ts`** - Shared AI behavior
- Role-specific prompts (buddy, coach, blog, narrator)
- Evidence guidelines embedded in all prompts
- Topic and jurisdiction awareness
- User role adaptation (parent, teacher, carer, individual, professional)
- Exports: `generateSystemPrompt()`, `generateBuddyPrompt()`, `generateCoachPrompt()`, `generateBlogPrompt()`

**b) `answerRouter.ts`** - Intelligent query routing
- Detect query type (emergency, health_evidence, navigation, tool_help, general_info)
- Topic detection from natural language
- Source recommendation (NHS, NICE, PubMed, knowledge base)
- Priority assignment (immediate, high, normal)
- Exports: `routeQuery()`, `needsLLM()`, `formatRoutingDebug()`

**c) `citations.ts`** - Citation formatting
- Create citations with validation
- Group by type (clinical, research, support)
- Format as markdown or plain text
- Deduplicate and validate URLs
- Exports: `createCitation()`, `formatCitationGroup()`, `createNHSCitation()`, `createNICECitation()`, `createPubMedCitation()`

**d) `safety.ts`** - Safety & guardrails
- Query safety checks with signposting
- Emergency response generation
- Answer wrapping with crisis info
- Fabrication detection (uncited claims)
- Input sanitization (XSS prevention)
- Exports: `checkQuerySafety()`, `generateEmergencyResponse()`, `wrapAnswerWithSafety()`, `detectFabricatedClaims()`, `validateResponseSafety()`

**e) `userPreferences.ts`** - Unified preferences
- Single source of truth for all settings
- TTS preferences (rate, pitch, volume, voice, auto-speak)
- Accessibility preferences (reduced motion, high contrast, font size, dyslexia font)
- Regional preferences (jurisdiction, language, timezone)
- AI preferences (verbosity, citation style, show evidence, role)
- localStorage persistence with versioning
- Migration support for schema changes
- Exports: `loadPreferences()`, `savePreferences()`, `updatePreferences()`, `resetPreferences()`, `DEFAULT_PREFERENCES`

**f) `index.ts`** - Central export point
- Re-exports all core modules
- Type definitions aggregated
- Single import for all AI features

---

## Architecture Benefits

### Before (Current State)
```
┌─────────────┐    ┌──────────────┐    ┌──────────┐
│   Buddy     │───►│ /api/        │    │  No      │
│             │    │ api-ai-chat- │───►│ Evidence │
│             │    │ buddy        │    │  Layer   │
└─────────────┘    └──────────────┘    └──────────┘

┌─────────────┐    ┌──────────────┐    ┌──────────┐
│  AI Coach   │───►│ /api/        │    │  No      │
│             │    │ ai-coach     │───►│ Evidence │
│             │    │              │    │  Layer   │
└─────────────┘    └──────────────┘    └──────────┘

┌─────────────┐    ┌──────────────┐    ┌──────────┐
│   Blog      │───►│ /api/        │    │  No      │
│             │    │ ai-chat      │───►│ Evidence │
│             │    │              │    │  Layer   │
└─────────────┘    └──────────────┘    └──────────┘

❌ No shared preferences
❌ No citation enforcement
❌ No crisis detection
❌ Inconsistent responses
```

### After (New Architecture - Partially Implemented)
```
┌─────────────┐                         ┌────────────────┐
│   Buddy     │───┐                     │  Evidence      │
│             │   │                     │  Registry      │
└─────────────┘   │                     │  (12+ sources) │
                  │                     └────────────────┘
┌─────────────┐   │    ┌──────────┐           ▲
│  AI Coach   │───┼───►│ Unified  │───────────┤
│             │   │    │ AI Core  │           │
└─────────────┘   │    └──────────┘           │
                  │         │                  │
┌─────────────┐   │         ▼                  │
│   Blog      │───┘    ┌──────────┐    ┌──────────────┐
│             │        │ Safety   │    │  Evidence    │
└─────────────┘        │ Checks   │───►│  Policy      │
                       └──────────┘    │  (UK crisis  │
┌───────────────────┐                  │  signpost)   │
│ User Preferences  │                  └──────────────┘
│ (TTS, Region,     │
│  Accessibility)   │
└───────────────────┘

✅ Shared preferences (TTS, region, accessibility)
✅ Evidence citations enforced
✅ Crisis detection & signposting
✅ Consistent, safe responses
✅ Tier A sources (NHS, NICE, PubMed)
✅ Educational disclaimers
```

---

## PHASE 5-8: REMAINING WORK

### Critical Path to Completion

#### PHASE 5: Unified API Route (IN PROGRESS)
**File to create:** `web/app/api/ai-assistant/route.ts`

**Requirements:**
- Accept requests from Buddy, Coach, and Blog
- Use `routeQuery()` to determine query type
- Apply safety checks via `checkQuerySafety()`
- Generate answers with evidence citations
- Wrap responses with `wrapAnswerWithSafety()`
- Return structured format: `{ answer, citations, recommendedActions, references }`
- Maintain backward compatibility with existing API contracts

**Pseudocode:**
```typescript
export async function POST(request: NextRequest) {
  const { query, role, topic, jurisdiction, pageContext } = await request.json();
  
  // 1. Sanitize input
  const sanitized = sanitizeInput(query);
  
  // 2. Route query
  const routing = routeQuery(sanitized, { role, jurisdiction });
  
  // 3. Safety check
  if (routing.safetyCheck.level === 'emergency') {
    return generateEmergencyResponse(routing.safetyCheck.level, jurisdiction);
  }
  
  // 4. Generate system prompt
  const systemPrompt = generateSystemPrompt({ role, topic, jurisdiction, pageContext });
  
  // 5. Call LLM (if needed) or use knowledge base
  const rawAnswer = await generateAnswer(sanitized, systemPrompt, routing);
  
  // 6. Wrap with safety + citations
  const safeAnswer = wrapAnswerWithSafety(rawAnswer, routing.safetyCheck, jurisdiction);
  
  // 7. Return structured response
  return NextResponse.json({
    answer: safeAnswer,
    citations: extractedCitations,
    recommendedActions,
    routing: formatRoutingDebug(routing), // Debug only
  });
}
```

#### PHASE 6: Update PageBuddy Component
**File:** `web/components/page-buddy.tsx`

**Changes Required:**
1. Import unified AI core: `import { loadPreferences, checkQuerySafety } from '@/lib/ai/core';`
2. Call new unified API: `/api/ai-assistant` instead of `/api/api-ai-chat-buddy`
3. Use `loadPreferences()` for TTS/region settings
4. Handle structured response with citations
5. Render citations using existing `<ReferencesSection />` component
6. Preserve existing layout and behavior (no UI changes)

**Key Code Changes:**
- Line ~650: Update fetch URL to `/api/ai-assistant`
- Line ~40: Add `const prefs = loadPreferences();` in component
- Line ~680: Parse structured response: `const { answer, citations, recommendedActions } = await res.json();`
- Line ~700: Pass `citations` to message object

#### PHASE 7: E2E Tests Enhancement
**File:** `web/tests/buddy.spec.ts`

**Add Tests:**
1. **Multi-Viewport Layout Tests**
   - Mobile (375x667): Dialog fits viewport, no off-screen content
   - Tablet (768x1024): Responsive sizing, all controls visible
   - Desktop (1280x800): Optimal layout, proper spacing

2. **Regression Tests**
   - Buddy opens/closes correctly
   - Input field accepts text
   - Send button enables when input has content
   - Quick question chips trigger correct API calls
   - Messages render in order
   - Auto-scroll works
   - Focus management doesn't block interactions

3. **Safety Tests**
   - Emergency keywords trigger crisis signposting
   - Educational disclaimer appears in health answers
   - Citations render correctly

**Example Test Structure:**
```typescript
test.describe('Buddy Layout Stability', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 800 },
  ];

  for (const vp of viewports) {
    test(`${vp.name} viewport layout`, async ({ page }) => {
      await page.setViewportSize(vp);
      await page.goto('/uk');
      
      const dialog = await openBuddyDialog(page);
      
      // Assert dialog is within viewport
      const box = await dialog.boundingBox();
      expect(box.y).toBeGreaterThan(0);
      expect(box.y + box.height).toBeLessThan(vp.height);
      
      // Assert header, messages, input all visible
      await expect(dialog.locator('header')).toBeVisible();
      await expect(dialog.locator('[role="status"]')).toBeVisible();
      await expect(dialog.locator('input')).toBeVisible();
    });
  }
});
```

#### PHASE 8: Full Verification
```bash
cd web

# 1. Type check
yarn typecheck

# 2. Lint
yarn lint

# 3. Build
yarn build

# 4. E2E tests
yarn test:e2e

# 5. Check for console errors in dev
yarn dev
# Open http://localhost:3000/uk
# Open Buddy, send a message, check DevTools for errors
```

---

## Evidence Upgrade: Quick Wins

### 1. Immediate Citations for Quick Questions
Update `web/components/page-buddy.tsx` to include citations for pre-configured quick questions:

```typescript
const quickQuestionResponses = {
  "What is NeuroBreath?": {
    answer: "NeuroBreath is an evidence-based platform...",
    citations: [
      createNHSCitation("ADHD - NHS", "https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/"),
      createNHSCitation("Autism - NHS", "https://www.nhs.uk/conditions/autism/"),
    ],
  },
  // ... more pre-configured responses
};
```

### 2. Crisis Detection in Client
Add client-side check before sending to API:

```typescript
const safetyCheck = checkQuerySafety(input.trim(), prefs.regional.jurisdiction);
if (safetyCheck.level === 'emergency') {
  // Show immediate signposting without API call
  setMessages(prev => [...prev, {
    id: Date.now().toString(),
    role: 'assistant',
    content: getCrisisSignposting(safetyCheck.level, prefs.regional.jurisdiction),
  }]);
  return;
}
```

### 3. Educational Disclaimer Auto-Inject
In PageBuddy, wrap all assistant messages:

```typescript
const formattedAnswer = `${rawAnswer}\n\n---\n\n${EDUCATIONAL_DISCLAIMER}`;
```

---

## Acceptance Criteria (Final Checklist)

### Functional
- [ ] Buddy opens and functions on Home and all pages
- [ ] No runtime console errors
- [ ] Input/send works (enabled when text exists)
- [ ] Quick questions work
- [ ] Layout stays within viewport on mobile/tablet/desktop
- [ ] Focus management doesn't block interactions
- [ ] TTS works (if enabled in preferences)

### Evidence & Safety
- [ ] Health answers include NHS/NICE/PubMed citations OR cautious language
- [ ] Educational disclaimer appears in health answers
- [ ] Emergency keywords trigger crisis signposting (999/NHS 111 for UK)
- [ ] No fabricated claims ("NHS says..." without citation)
- [ ] Tier B sources (charities) clearly labeled as "support organizations"

### Consistency
- [ ] Buddy/Coach/Blog share same preference store
- [ ] All AI systems use unified AI core
- [ ] TTS settings consistent across all features
- [ ] Region settings (UK/US/EU) respected everywhere

### Testing
- [ ] Playwright tests pass in CI
- [ ] No TypeScript errors (`yarn typecheck`)
- [ ] No lint errors (`yarn lint`)
- [ ] Production build succeeds (`yarn build`)

---

## Commit Plan (Recommended)

```bash
# Branch for this work (if not already created)
git checkout -b fix/buddy-evidence-upgrade

# Commit 1: Evidence foundation
git add web/lib/evidence/
git commit -m "feat(evidence): add source registry and policy module

- Add sourceRegistry.ts with NHS, NICE, PubMed, WHO, RCPsych, and UK/US sources
- Add evidencePolicy.ts with crisis signposting and guardrails
- Tier A (clinical) and Tier B (support) classification
- UK crisis contacts: 999, NHS 111, safeguarding
- Educational disclaimer enforcement"

# Commit 2: Unified AI core
git add web/lib/ai/core/
git commit -m "feat(ai-core): create unified AI system for Buddy/Coach/Blog

- systemPrompts.ts: Shared prompts with evidence guidelines
- answerRouter.ts: Intelligent query routing and topic detection
- citations.ts: NHS/NICE/PubMed citation formatting
- safety.ts: Safeguarding checks and fabrication detection
- userPreferences.ts: Single source of truth for TTS/region/accessibility
- All modules export typed, testable functions"

# Commit 3: Unified API route (when created)
git add web/app/api/ai-assistant/
git commit -m "feat(api): create unified AI assistant route

- Consolidates Buddy/Coach/Blog into single endpoint
- Uses AI core for routing, safety, and citations
- Maintains backward compatibility
- Returns structured responses with evidence"

# Commit 4: Update PageBuddy
git add web/components/page-buddy.tsx
git commit -m "fix(buddy): restore working behavior and add evidence citations

- Use unified AI API endpoint
- Integrate user preferences (TTS, region)
- Display citations in responses
- Improve focus management stability
- Preserve existing UI/UX"

# Commit 5: E2E tests
git add web/tests/buddy.spec.ts
git commit -m "test(buddy): add multi-viewport regression suite

- Test mobile (375x667), tablet (768x1024), desktop (1280x800)
- Assert layout stays within viewport
- Verify all controls function correctly
- Check crisis detection and citations"

# Commit 6: Documentation
git add BUDDY_EVIDENCE_UPGRADE.md
git commit -m "docs: add Buddy evidence upgrade implementation report"

# Push and create PR
git push origin fix/buddy-evidence-upgrade
```

---

## Next Steps (Priority Order)

1. **Create unified API route** (`web/app/api/ai-assistant/route.ts`)
2. **Update PageBuddy** to use new API and preferences
3. **Test manually** (open Buddy, send messages, check citations)
4. **Add E2E tests** for viewport stability
5. **Run full verification** (lint, typecheck, build, e2e)
6. **Commit with proper messages** (see commit plan above)
7. **Create PR** with link to this implementation report

---

## Files Created (Summary)

| File | Purpose | Status |
|------|---------|--------|
| `web/lib/evidence/sourceRegistry.ts` | Canonical evidence sources (NHS, NICE, PubMed, etc.) | ✅ Complete |
| `web/lib/evidence/evidencePolicy.ts` | Health answer guardrails, crisis signposting | ✅ Complete |
| `web/lib/ai/core/systemPrompts.ts` | Shared AI prompts with evidence guidelines | ✅ Complete |
| `web/lib/ai/core/answerRouter.ts` | Query routing and topic detection | ✅ Complete |
| `web/lib/ai/core/citations.ts` | Citation formatting and validation | ✅ Complete |
| `web/lib/ai/core/safety.ts` | Safeguarding checks, fabrication detection | ✅ Complete |
| `web/lib/ai/core/userPreferences.ts` | Unified preferences (TTS, region, accessibility) | ✅ Complete |
| `web/lib/ai/core/index.ts` | Central export point | ✅ Complete |
| `web/app/api/ai-assistant/route.ts` | Unified API endpoint | ⏳ TODO |
| `web/components/page-buddy.tsx` (updated) | Use unified API + preferences | ⏳ TODO |
| `web/tests/buddy.spec.ts` (updated) | Multi-viewport regression tests | ⏳ TODO |

---

## Contact for Questions

- **Root Cause:** Commit `0242bac` introduced focus management and retry logic that may conflict with dialog interactions
- **Last Known Good:** Commit `8b2e2b9` (Jan 17, ~23:30 local time)
- **Evidence System:** Now in place (`web/lib/evidence/`, `web/lib/ai/core/`)
- **Remaining Work:** Unified API route, PageBuddy update, E2E tests, verification

---

**Report Generated:** 19 January 2026  
**Implementation Status:** 60% complete (evidence system done, API integration pending)
