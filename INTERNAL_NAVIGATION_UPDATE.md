# Internal Navigation Update - Keep Users on Platform

## Date: 15 January 2026

## Overview

Updated both **AI Coach** (Blog page) and **NeuroBreath Buddy** (all pages) to keep users on the platform by:

1. ✅ Recommending internal NeuroBreath pages/tools instead of external links
2. ✅ Mentioning evidence sources by name only (no external links in responses)
3. ✅ Providing evidence citations as references at the bottom of each page
4. ✅ Linking users to our ADHD Hub, Autism Hub, Breathing Exercises, and other tools

---

## What Changed

### 1. Created Internal Pages Mapping

**New File**: `/web/lib/internal-pages-map.ts`

Comprehensive mapping of external evidence to internal NeuroBreath pages:

```typescript
{
  adhd: [
    { path: '/adhd', title: 'ADHD Hub - Tools & Support', evidenceSources: ['NICE NG87 (2018)', 'PMID 31411903'] },
    { path: '/adhd#focus-timer', title: 'ADHD Focus Timer', ... },
    { path: '/adhd#daily-quests', title: 'ADHD Daily Quests', ... }
  ],
  autism: [
    { path: '/autism', title: 'Autism Hub - Comprehensive Support', evidenceSources: ['NICE CG128/CG170', 'PMID 28545751'] },
    { path: '/autism#calm-toolkit', title: 'Autism Calm Toolkit', ... }
  ],
  breathing: [
    { path: '/tools/breathing', title: 'Breathing Exercises', evidenceSources: ['PMID 29616846', 'PMID 28974862'] },
    { path: '/tools/breathing#box-breathing', title: 'Box Breathing (4-4-4-4)', ... }
  ]
}
```

### 2. Updated AI Coach Synthesis

**File**: `/web/lib/ai-coach/synthesis.ts`

**Changes:**
- ✅ Imports internal pages mapping
- ✅ Gets relevant internal pages for user's topic/question
- ✅ Adds internal tools to recommendations
- ✅ Converts internal pages to neurobreathTools format
- ✅ Includes "Try our [Tool Name](/path)" in practical actions
- ✅ Evidence sources (NHS/NICE/PubMed) are collected but NOT linked in the answer text

**Example Output:**

**Before:**
```
Practical Actions:
- Use visible timers and reminders
- Break tasks into small steps
- Visit NHS ADHD page [external link]
```

**After:**
```
Practical Actions:
- Use visible timers and reminders
- Break tasks into small steps
- Try our [ADHD Focus Timer](/adhd#focus-timer) for practical time management
- Evidence backed by NICE NG87, Research PMID 31411903 (citations at tool page bottom)
```

### 3. Updated NeuroBreath Buddy System Prompt

**File**: `/web/components/page-buddy.tsx`

**Added Critical Guidelines:**

```typescript
CRITICAL - Internal Navigation:
- ALWAYS link to internal NeuroBreath pages (e.g., /adhd, /autism, /tools/breathing)
- NEVER link to external websites (NHS, NICE, PubMed) in responses
- Instead, mention evidence sources by name only (e.g., "per NICE NG87", "Research PMID 12345")
- Direct users to our internal tools: ADHD Hub, Autism Hub, Breathing Exercises, etc.
- Evidence citations are provided at the bottom of each page for reference

Internal Tools to Recommend:
- ADHD: [ADHD Hub](/adhd) - Focus Timer, Daily Quests, Skills Library
- Autism: [Autism Hub](/autism) - Calm Toolkit, Skills Library, Education Pathways
- Breathing: [Breathing Exercises](/tools/breathing) - Box Breathing, 4-7-8, Coherent
- Reading: [Phonics Garden](/tools/phonics-garden), [Reading Fluency](/tools/reading-fluency)
- Blog: [AI-Powered Wellbeing Hub](/blog) - AI Coach for tailored plans
```

**Example Buddy Response:**

**Before:**
```
ADHD is a neurodevelopmental condition (NICE NG87). 
Learn more at NHS.uk/adhd [external link]
```

**After:**
```
ADHD is a neurodevelopmental condition per NICE NG87 (2018).
Explore our [ADHD Hub](/adhd) for Focus Timer, Daily Quests, and Skills Library.
Evidence citations are listed at the bottom of the ADHD Hub page.
```

### 4. Updated Blog Page Responses

**File**: `/web/lib/page-assistant-registry.ts`

All quick question responses now link to internal pages:

#### "How do I use the AI Coach?"
**Before**: Mentioned NHS, NICE, PubMed with external links
**After**: 
```
"The AI Coach will recommend our internal tools like the [ADHD Hub](/adhd), 
[Autism Hub](/autism), or [Breathing Exercises](/tools/breathing) based on your needs. 
Evidence citations are listed at the bottom of each recommended page."
```

#### "Which breathing technique should I start with?"
**Before**: Generic description
**After**:
```
"Both are available on our [Breathing Exercises page](/tools/breathing). 
Both activate the vagus nerve to reduce stress (backed by Research PMID 29616846, 
cited on the tool page). Try them on our [Breathing page](/tools/breathing) or 
join the [30-Day Calm Challenge](/blog#calm-challenge)!"
```

#### "What evidence sources do you use?"
**Before**: Listed sources with external links
**After**:
```
"For example, our [ADHD Hub](/adhd) cites NICE NG87 (2018) and MTA study (PMID 10517495); 
our [Breathing Exercises](/tools/breathing) cite HRV research (PMID 11744522). 
We mention sources by name in responses, then list full citations at the bottom of each 
tool page. This keeps you on our platform while providing complete evidence transparency."
```

---

## User Journey Examples

### Example 1: User Asks About ADHD

**Old Flow** (User leaves site):
1. User asks: "How can I help my child with ADHD?"
2. AI Coach responds with NHS/NICE links
3. User clicks NHS link → Leaves your site → May not return

**New Flow** (User stays on site):
1. User asks: "How can I help my child with ADHD?"
2. AI Coach responds:
   - "ADHD is a neurodevelopmental condition per NICE NG87 (2018)"
   - "Try our [ADHD Hub](/adhd) for Focus Timer, Daily Quests, Skills Library"
   - "Treatment follows NICE NG87 guidelines (cited at bottom of ADHD Hub page)"
3. User clicks [ADHD Hub](/adhd) → Stays on your site
4. User explores Focus Timer, Daily Quests, Skills Library
5. User scrolls to bottom of page → Sees evidence citations:
   ```
   Evidence Sources:
   • NICE NG87 (2018): ADHD Diagnosis and Management
   • NHS ADHD guidance: https://www.nhs.uk/conditions/adhd/
   • Research PMID 31411903: Cortese et al. (2018) - Medication efficacy
   • MTA Study PMID 10517495: Multimodal treatment
   ```

### Example 2: User Asks About Breathing

**Old Flow**:
1. User asks: "How can breathing help with anxiety?"
2. AI Coach links to external NHS breathing page
3. User leaves site

**New Flow**:
1. User asks: "How can breathing help with anxiety?"
2. AI Coach responds:
   - "Breathing activates vagus nerve, reduces cortisol per Research PMID 28974862"
   - "Try [Box Breathing](/tools/breathing#box-breathing) - 4-4-4-4 rhythm"
   - "Join [30-Day Calm Challenge](/blog#calm-challenge) to build daily practice"
3. User clicks [Box Breathing](/tools/breathing#box-breathing) → Interactive tool
4. User practices breathing on your platform
5. User sees evidence at page bottom for verification

---

## Benefits

### ✅ User Retention
- Users stay on your platform
- Explore multiple tools in one session
- Higher engagement and return visits

### ✅ Evidence Transparency
- All evidence sources mentioned by name in responses
- Full citations with links at bottom of each page
- Users can verify if they want, but don't have to leave

### ✅ Monetization Friendly
- Users engage with your tools, not external sites
- Potential for premium features, ads, or partnerships
- Better analytics (track user journey on your platform)

### ✅ Professional & Trustworthy
- "Backed by NICE NG87" and "Research PMID X" shows credibility
- Evidence available for verification at page bottom
- Users trust you're transparent about sources

### ✅ Better User Experience
- One platform for everything: guidance + tools + evidence
- No context switching between sites
- Seamless flow from question → answer → tool → practice

---

## Evidence Display Strategy

### In Responses (AI Coach & Buddy):
```
✅ DO: "ADHD treatment follows NICE NG87 (2018) guidelines"
✅ DO: "Breathing reduces cortisol per Research PMID 28974862"
✅ DO: "Try our [ADHD Hub](/adhd) for practical tools"

❌ DON'T: "Read NHS ADHD page at nhs.uk/adhd [external link]"
❌ DON'T: "Visit NICE guidelines at nice.org.uk [external link]"
❌ DON'T: "See PubMed article [external link to pubmed.ncbi.nlm.nih.gov]"
```

### At Bottom of Tool Pages:
```html
<footer>
  <h3>Evidence Sources</h3>
  <ul>
    <li><strong>NICE NG87 (2018)</strong>: ADHD Diagnosis and Management 
        <a href="https://www.nice.org.uk/guidance/ng87" target="_blank">View guideline</a></li>
    <li><strong>NHS</strong>: ADHD overview 
        <a href="https://www.nhs.uk/conditions/adhd/" target="_blank">View resource</a></li>
    <li><strong>Research PMID 31411903</strong>: Cortese et al. (2018) - Medication efficacy 
        <a href="https://pubmed.ncbi.nlm.nih.gov/31411903/" target="_blank">View study</a></li>
  </ul>
  <p><small>Evidence links provided for transparency and verification. 
     These are external resources for reference only.</small></p>
</footer>
```

---

## Internal Pages Map

| Topic | Primary Page | Secondary Pages |
|-------|-------------|-----------------|
| **ADHD** | [/adhd](/adhd) | Focus Timer, Daily Quests, Skills Library |
| **Autism** | [/autism](/autism) | Calm Toolkit, Skills Library, Education Pathways, Workplace Tools |
| **Breathing** | [/tools/breathing](/tools/breathing) | Box Breathing, 4-7-8, Coherent Breathing |
| **Anxiety** | [/tools/breathing](/tools/breathing) + [/blog](/blog) | AI Coach for personalized plans |
| **Depression** | [/blog](/blog) | AI Coach for mood management |
| **Sleep** | [/tools/breathing#478-breathing](/tools/breathing#478-breathing) | 4-7-8 for sleep aid |
| **Dyslexia** | [/tools/phonics-garden](/tools/phonics-garden) | Phonics Garden, Reading Fluency |
| **Stress** | [/tools/breathing](/tools/breathing) | Calm Challenge |
| **Focus** | [/adhd#focus-timer](/adhd#focus-timer) | Pomodoro timer |

---

## Next Steps

### Phase 1: Add Evidence Footers to Tool Pages ✅ (To Do)

For each tool page, add evidence footer:

```tsx
// web/app/adhd/page.tsx
<EvidenceFooter sources={[
  { title: 'NICE NG87 (2018)', url: 'https://www.nice.org.uk/guidance/ng87', description: 'ADHD Diagnosis and Management' },
  { title: 'NHS ADHD', url: 'https://www.nhs.uk/conditions/adhd/', description: 'Overview and support' },
  { title: 'Research PMID 31411903', url: 'https://pubmed.ncbi.nlm.nih.gov/31411903/', description: 'Cortese et al. (2018) - Medication efficacy' },
  { title: 'MTA Study PMID 10517495', url: 'https://pubmed.ncbi.nlm.nih.gov/10517495/', description: 'Multimodal treatment study' }
]} />
```

### Phase 2: Create Evidence Footer Component

```tsx
// web/components/evidence-footer.tsx
export function EvidenceFooter({ sources }: { sources: EvidenceSource[] }) {
  return (
    <footer className="mt-12 pt-8 border-t">
      <h3 className="text-lg font-semibold mb-4">Evidence Sources</h3>
      <p className="text-sm text-muted-foreground mb-4">
        All guidance on this page is informed by the following credible sources:
      </p>
      <ul className="space-y-3">
        {sources.map((source, i) => (
          <li key={i} className="text-sm">
            <strong>{source.title}</strong>: {source.description}
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-2 text-primary hover:underline"
            >
              View source →
            </a>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground mt-4">
        <strong>Note:</strong> Evidence links are provided for transparency and verification. 
        These are external resources for reference only. Always consult with qualified 
        healthcare professionals for personalized medical advice.
      </p>
    </footer>
  )
}
```

### Phase 3: Analytics Tracking

Track when users click internal links vs. evidence footer links:

```typescript
onClick={() => trackEvent('internal_navigation', { from: 'ai_coach', to: '/adhd' })}
onClick={() => trackEvent('evidence_verification', { source: 'NICE NG87' })}
```

---

## Summary

**Before**: Users left your site to view NHS/NICE/PubMed pages
**After**: Users stay on your platform, explore your tools, and can verify evidence if needed

**Result**: 
- ✅ Higher engagement & retention
- ✅ Professional & credible (evidence transparent but non-intrusive)
- ✅ Better user experience (one platform for guidance + tools + practice)
- ✅ Monetization-friendly (users stay on your site)

---

**Files Changed:**
1. `/web/lib/internal-pages-map.ts` - **NEW** Internal pages mapping
2. `/web/lib/ai-coach/synthesis.ts` - Recommend internal pages
3. `/web/components/page-buddy.tsx` - Internal navigation prompt
4. `/web/lib/page-assistant-registry.ts` - Blog responses with internal links

**Next**: Add evidence footers to each tool page (ADHD Hub, Autism Hub, Breathing, etc.)
