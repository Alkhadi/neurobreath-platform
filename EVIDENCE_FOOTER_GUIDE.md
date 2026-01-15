# Evidence Footer Implementation Guide

## Quick Start

Add evidence sources to any page in just 2 steps:

### Step 1: Import the component

```tsx
import { EvidenceFooter, ADHD_EVIDENCE_SOURCES } from '@/components/evidence-footer'
```

### Step 2: Add to your page

```tsx
export default function ADHDPage() {
  return (
    <div>
      {/* Your page content */}
      
      {/* Add evidence footer at the bottom */}
      <EvidenceFooter sources={ADHD_EVIDENCE_SOURCES} />
    </div>
  )
}
```

---

## Available Preset Collections

Use these ready-made source collections:

```tsx
import {
  ADHD_EVIDENCE_SOURCES,
  AUTISM_EVIDENCE_SOURCES,
  BREATHING_EVIDENCE_SOURCES,
  ANXIETY_EVIDENCE_SOURCES,
  DEPRESSION_EVIDENCE_SOURCES,
  SLEEP_EVIDENCE_SOURCES,
  DYSLEXIA_EVIDENCE_SOURCES
} from '@/components/evidence-footer'
```

---

## Examples

### ADHD Hub Page

```tsx
// web/app/adhd/page.tsx
import { EvidenceFooter, ADHD_EVIDENCE_SOURCES } from '@/components/evidence-footer'

export default function ADHDHubPage() {
  return (
    <div className="container">
      {/* Focus Timer */}
      <section>...</section>
      
      {/* Daily Quests */}
      <section>...</section>
      
      {/* Skills Library */}
      <section>...</section>
      
      {/* Evidence Footer */}
      <EvidenceFooter sources={ADHD_EVIDENCE_SOURCES} />
    </div>
  )
}
```

**Displays:**
- NICE NG87 (2018) guideline
- NHS ADHD guidance
- Research PMID 31411903 (medication efficacy)
- MTA Study PMID 10517495 (multimodal treatment)

---

### Breathing Exercises Page

```tsx
// web/app/tools/breathing/page.tsx
import { EvidenceFooter, BREATHING_EVIDENCE_SOURCES } from '@/components/evidence-footer'

export default function BreathingPage() {
  return (
    <div className="container">
      {/* Box Breathing */}
      <section>...</section>
      
      {/* 4-7-8 Breathing */}
      <section>...</section>
      
      {/* Evidence Footer */}
      <EvidenceFooter sources={BREATHING_EVIDENCE_SOURCES} />
    </div>
  )
}
```

**Displays:**
- NHS breathing exercises guidance
- Research PMID 29616846 (systematic review)
- Research PMID 28974862 (stress reduction)
- Research PMID 11744522 (HRV optimization)

---

### Autism Hub Page

```tsx
// web/app/autism/page.tsx
import { EvidenceFooter, AUTISM_EVIDENCE_SOURCES } from '@/components/evidence-footer'

export default function AutismHubPage() {
  return (
    <div className="container">
      {/* Calm Toolkit */}
      {/* Skills Library */}
      {/* Education Pathways */}
      {/* Workplace Adjustments */}
      
      <EvidenceFooter sources={AUTISM_EVIDENCE_SOURCES} />
    </div>
  )
}
```

---

## Custom Sources

For pages with unique evidence needs:

```tsx
import { EvidenceFooter, type EvidenceSource } from '@/components/evidence-footer'

const CUSTOM_SOURCES: EvidenceSource[] = [
  {
    title: 'NICE Guideline XYZ',
    url: 'https://www.nice.org.uk/guidance/xyz',
    description: 'Description of what this guideline covers',
    type: 'clinical_guideline'
  },
  {
    title: 'Research PMID 12345678',
    url: 'https://pubmed.ncbi.nlm.nih.gov/12345678/',
    description: 'Author et al. (Year) - Study description',
    type: 'research'
  }
]

export default function CustomPage() {
  return (
    <div>
      {/* content */}
      <EvidenceFooter sources={CUSTOM_SOURCES} />
    </div>
  )
}
```

---

## Source Types

Four categories automatically grouped in the footer:

1. **`clinical_guideline`** - NICE, WHO, AAP guidelines
2. **`government_health`** - NHS, CDC official pages
3. **`systematic_review`** - Cochrane reviews, meta-analyses
4. **`research`** - Individual peer-reviewed studies

---

## Priority Implementation

**High Priority** (Add these first):

1. ✅ `/adhd` - ADHD Hub (use `ADHD_EVIDENCE_SOURCES`)
2. ✅ `/autism` - Autism Hub (use `AUTISM_EVIDENCE_SOURCES`)
3. ✅ `/tools/breathing` - Breathing Exercises (use `BREATHING_EVIDENCE_SOURCES`)

**Medium Priority**:

4. ✅ `/blog` - Blog page (use mixed sources)
5. ✅ `/tools/phonics-garden` - Phonics (use `DYSLEXIA_EVIDENCE_SOURCES`)
6. ✅ `/tools/reading-fluency` - Reading (use `DYSLEXIA_EVIDENCE_SOURCES`)

**Optional**:

7. Topic-specific blog posts (create custom sources as needed)

---

## What Users See

### In Page Content:
```
"ADHD treatment follows NICE NG87 (2018) guidelines..."
"Breathing activates vagus nerve per Research PMID 28974862..."
```
↓

### At Page Bottom:
```
📚 Evidence Sources

Clinical Guidelines:
• NICE NG87 (2018): ADHD diagnosis and management... [View source →]

Government Health Resources:
• NHS: ADHD overview and support... [View source →]

Peer-Reviewed Research:
• Research PMID 31411903: Cortese et al. (2018)... [View source →]
• MTA Study PMID 10517495: Multimodal treatment... [View source →]

Transparency Note: External links provided for verification...
Medical Disclaimer: Educational information, not medical advice...
```

---

## Benefits

✅ **Credibility**: Users see you cite proper evidence
✅ **Transparency**: Full sources available for verification
✅ **Retention**: Users don't leave mid-content (evidence at bottom)
✅ **Professional**: Organized, categorized evidence display
✅ **Legal**: Clear medical disclaimer included
✅ **Accessible**: External link indicators for screen readers

---

## Maintenance

**Quarterly Check** (every 3 months):
- Verify all URLs still work
- Check for NICE guideline updates
- Add new landmark studies if published

**When NICE Updates Guidelines**:
- Update title (e.g., "NICE NG87 (2018, updated 2024)")
- Update description if scope changed
- URL usually stays the same

---

## Next Steps

1. Add `<EvidenceFooter>` to ADHD Hub page
2. Add `<EvidenceFooter>` to Autism Hub page
3. Add `<EvidenceFooter>` to Breathing page
4. Test on mobile (footer is responsive)
5. Track clicks on evidence links (optional analytics)

---

See [INTERNAL_NAVIGATION_UPDATE.md](./INTERNAL_NAVIGATION_UPDATE.md) for the full internal navigation strategy.
