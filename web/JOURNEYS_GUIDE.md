# NeuroBreath Journeys Guide

**Version:** 1.0  
**Last Updated:** January 2026

---

## Overview

Starter Journey Flows are multi-step guided experiences (3–5 pages each) that help users navigate specific situations or goals. They provide structured pathways through NeuroBreath's content and tools.

---

## What Are Journeys?

**Journeys are:**
- Multi-step flows (landing + 3-5 steps + completion)
- Goal-oriented and audience-specific
- Connected to relevant conditions, tools, and guides
- UK/US localised
- SEO-friendly and indexable

**Examples:**
- "New to ADHD" - For newly diagnosed adults
- "Parent Supporting Autistic Child" - For parents
- "Adult Dyslexia at Work" - For workplace challenges

---

## Journey Structure

Each journey consists of:

1. **Landing Page** - Overview, audience, what to expect
2. **Step Pages** (3-5) - Sequential guidance with actions
3. **Completion Page** - Next steps, related resources
4. **Navigation** - Progress indicator, prev/next buttons
5. **CTAs** - Contextual links to tools/guides/help-me-choose

---

## Creating a Journey

### Step 1: Define in Config

Edit `/web/journeys/journeys.config.ts`:

```typescript
export const journeys = [
  {
    id: 'new-to-adhd',
    slug: 'new-to-adhd',
    titleUK: 'New to ADHD: Your Starting Guide',
    titleUS: 'New to ADHD: Your Starting Guide',
    audience: ['adult'],
    primaryConditions: ['adhd'],
    recommendedTools: ['breathing/box-breathing', 'pomodoro'],
    recommendedGuides: ['adhd/understanding-basics'],
    steps: [
      {
        stepId: 'understand-adhd',
        titleUK: 'Understanding ADHD',
        titleUS: 'Understanding ADHD',
        summaryUK: 'Learn what ADHD is and how it affects daily life',
        summaryUS: 'Learn what ADHD is and how it affects daily life',
        keyActions: [
          'Read about ADHD fundamentals',
          'Identify your main challenges',
          'Recognise your strengths',
        ],
        suggestedTools: ['breathing/box-breathing'],
        suggestedGuides: ['adhd/understanding-basics'],
        faq: [
          {
            q: 'Is ADHD a real condition?',
            a: 'Yes, ADHD is a recognized neurodevelopmental condition...',
          },
        ],
      },
      // ... more steps
    ],
    completion: {
      titleUK: 'You're On Your Way',
      titleUS: 'You're On Your Way',
      nextSteps: [
        {
          title: 'Build Your Routine',
          link: '/uk/tools',
          description: 'Explore tools to support daily life',
        },
        {
          title: 'Dive Deeper',
          link: '/uk/guides/adhd',
          description: 'Read comprehensive guides',
        },
      ],
    },
  },
];
```

### Step 2: Generate Routes

```bash
npm run scaffold:journey -- --journey=new-to-adhd
```

This creates:
- `/web/app/uk/journeys/new-to-adhd/page.tsx` (Landing)
- `/web/app/uk/journeys/new-to-adhd/step/1/page.tsx` (Step 1)
- `/web/app/uk/journeys/new-to-adhd/step/2/page.tsx` (Step 2)
- ... (Steps 3-5)
- `/web/app/uk/journeys/new-to-adhd/complete/page.tsx` (Completion)
- Same for `/us/`
- `/web/content/journeys/new-to-adhd.content.ts` (Content module)

### Step 3: Customise Content

Edit generated content file to refine copy and add details.

### Step 4: Test & Verify

```bash
npm run lint
npm run typecheck
npm run build
npm run test:visual
npm run perf:gate
```

---

## Journey Components

### Landing Page

**Purpose:** Orient user, set expectations

**Elements:**
- Hero with journey title
- Audience indicator
- Journey overview (steps)
- Estimated time
- "Start Journey" CTA
- Trust disclaimer

**Example:**
```typescript
<section>
  <h1>{journey.title}</h1>
  <p>Perfect for: {journey.audience.join(', ')}</p>
  <ol>
    {journey.steps.map((step, idx) => (
      <li key={idx}>Step {idx + 1}: {step.title}</li>
    ))}
  </ol>
  <Button asChild>
    <Link href={`/uk/journeys/${journey.slug}/step/1`}>
      Start Journey
    </Link>
  </Button>
</section>
```

### Step Pages

**Purpose:** Guide user through specific action or concept

**Elements:**
- Step indicator ("Step 2 of 4")
- Step title and summary
- Key actions (bulleted)
- Suggested tools (cards)
- Suggested guides (links)
- Optional FAQ
- Prev/Next navigation
- Progress bar

**Example:**
```typescript
<main>
  <ProgressIndicator current={2} total={4} />
  <h1>{step.title}</h1>
  <p>{step.summary}</p>
  
  <section>
    <h2>Key Actions</h2>
    <ul>
      {step.keyActions.map((action) => (
        <li>{action}</li>
      ))}
    </ul>
  </section>
  
  <section>
    <h2>Recommended Tools</h2>
    {step.suggestedTools.map((tool) => (
      <ToolCard tool={tool} />
    ))}
  </section>
  
  <nav>
    <Button asChild><Link href="../1">← Previous</Link></Button>
    <Button asChild><Link href="../3">Next →</Link></Button>
  </nav>
</main>
```

### Completion Page

**Purpose:** Celebrate completion, guide next actions

**Elements:**
- Completion message
- Journey summary
- Next steps (cards)
- Related journeys
- CTA to explore more

**Example:**
```typescript
<section>
  <h1>Well Done!</h1>
  <p>You've completed the {journey.title} journey.</p>
  
  <h2>What's Next?</h2>
  <div className="grid gap-6 md:grid-cols-2">
    {completion.nextSteps.map((step) => (
      <Card key={step.title}>
        <CardHeader>
          <CardTitle>{step.title}</CardTitle>
          <CardDescription>{step.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild><Link href={step.link}>Explore</Link></Button>
        </CardContent>
      </Card>
    ))}
  </div>
</section>
```

---

## Journey Types

### Understanding Journeys

**Audience:** Newly diagnosed, seeking basics

**Focus:** Education, orientation, reducing overwhelm

**Steps:**
1. What is [condition]?
2. Common experiences
3. Strengths and challenges
4. Where to get support

### Daily Support Journeys

**Audience:** Looking for practical strategies

**Focus:** Tools, routines, actionable techniques

**Steps:**
1. Assess your needs
2. Morning routine
3. Daytime strategies
4. Evening wind-down

### Family/Carer Journeys

**Audience:** Parents, partners, family members

**Focus:** Understanding, communication, support strategies

**Steps:**
1. Understanding their experience
2. Communication tips
3. Building routines together
4. Self-care for carers

### Workplace Journeys

**Audience:** Adults managing condition at work

**Focus:** Accommodations, productivity, advocacy

**Steps:**
1. Assessing workplace challenges
2. Productivity strategies
3. Communicating with colleagues
4. Know your rights

---

## Localisation

### UK vs US Content

**UK Considerations:**
- Reference NHS, NICE guidelines
- UK spelling (e.g., "behaviour", "organisation")
- UK terminology (e.g., "GP", "A-levels")
- School system references (primary, secondary)

**US Considerations:**
- Reference CDC, NIH, ADA
- US spelling (e.g., "behavior", "organization")
- US terminology (e.g., "primary care doctor", "SATs")
- School system references (elementary, middle, high school)

**Implementation:**
```typescript
// Content file
export const contentUK = {
  steps: [
    {
      title: 'Understanding Support at School',
      summary: 'Learn about SEN support and EHCPs',
      // UK-specific content
    },
  ],
};

export const contentUS = {
  steps: [
    {
      title: 'Understanding Support at School',
      summary: 'Learn about IEPs and 504 plans',
      // US-specific content
    },
  ],
};
```

---

## Performance Considerations

### Bundle Size

Journeys should be lightweight:
- Max client JS: **150 KB per page**
- Use Server Components for content
- Client islands only for interactive elements

### Navigation

Implement efficient navigation:
```typescript
// Prefetch next step
<Link href="../2" prefetch={true}>Next →</Link>

// Don't prefetch all steps on landing
<Link href="./step/1" prefetch={false}>Start</Link>
```

### Images

Optimize journey images:
```typescript
<Image
  src="/journeys/adhd-hero.jpg"
  alt="ADHD Journey Hero"
  width={1200}
  height={400}
  sizes="(max-width: 768px) 100vw, 1200px"
  priority={isFirstStep}
/>
```

---

## SEO & Indexing

### Metadata for Journeys

```typescript
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${step.title} - ${journey.title}`,
    description: step.summary,
    robots: 'index, follow', // Journeys are indexable
    alternates: {
      canonical: `/uk/journeys/${journey.slug}/step/${stepNumber}`,
      languages: {
        'en-GB': `/uk/journeys/${journey.slug}/step/${stepNumber}`,
        'en-US': `/us/journeys/${journey.slug}/step/${stepNumber}`,
      },
    },
  };
}
```

### Structured Data

Add BreadcrumbList for journey steps:

```typescript
const breadcrumbs = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Journeys',
      item: `${baseUrl}/uk/journeys`,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: journey.title,
      item: `${baseUrl}/uk/journeys/${journey.slug}`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: step.title,
      item: `${baseUrl}/uk/journeys/${journey.slug}/step/${stepNumber}`,
    },
  ],
};
```

---

## Integration with Other Systems

### Help-Me-Choose Wizard

Journey recommendations can come from Help-Me-Choose results:

```typescript
// After wizard completion
<p>Based on your responses, we recommend:</p>
<Button asChild>
  <Link href="/uk/journeys/new-to-adhd">
    Start: New to ADHD Journey
  </Link>
</Button>
```

### Conditions Coverage Matrix

Journeys appear in condition pages:

```typescript
// On condition page
<section>
  <h2>Starter Journeys</h2>
  {condition.journeys.map((journey) => (
    <JourneyCard key={journey.id} journey={journey} />
  ))}
</section>
```

### Search Index

Journeys are searchable:

```bash
npm run content:link-intel
# Auto-updates search index with journey pages
```

---

## Quality Checklist

Before publishing a journey:

### Content
- [ ] All steps complete and accurate
- [ ] UK/US variants reviewed
- [ ] Educational framing maintained
- [ ] No medical claims
- [ ] Citations added (copy-only)
- [ ] Last-reviewed dates set

### Navigation
- [ ] Prev/Next links work
- [ ] Progress indicator accurate
- [ ] Back to journey overview works
- [ ] Completion page links correct

### Performance
- [ ] `npm run perf:gate` passes
- [ ] Images optimized
- [ ] No unnecessary client JS
- [ ] Lazy loading where appropriate

### Accessibility
- [ ] Keyboard navigation works
- [ ] Focus order logical
- [ ] Heading hierarchy correct
- [ ] Alt text for images
- [ ] Progress indicator accessible

### SEO
- [ ] Titles and descriptions unique per step
- [ ] Canonical URLs correct
- [ ] Hreflang tags present
- [ ] Breadcrumbs structured data
- [ ] Sitemap includes journey pages

---

## Example Journey Config

```typescript
// /web/journeys/journeys.config.ts
export const journeys = [
  {
    id: 'parent-autism',
    slug: 'parent-autism',
    titleUK: 'Supporting Your Autistic Child',
    titleUS: 'Supporting Your Autistic Child',
    audience: ['parent'],
    primaryConditions: ['autism'],
    recommendedTools: ['breathing/calm-breathing', 'sensory-toolkit'],
    recommendedGuides: ['autism/parenting-guide'],
    steps: [
      {
        stepId: 'understanding',
        titleUK: 'Understanding Autism',
        titleUS: 'Understanding Autism',
        summaryUK: 'Learn about autism and your child's experience',
        summaryUS: 'Learn about autism and your child's experience',
        keyActions: [
          'Understand autism spectrum',
          'Recognize your child's unique strengths',
          'Learn about sensory needs',
        ],
        suggestedTools: ['sensory-toolkit'],
        suggestedGuides: ['autism/understanding'],
      },
      {
        stepId: 'communication',
        titleUK: 'Communication Strategies',
        titleUS: 'Communication Strategies',
        summaryUK: 'Build effective communication with your child',
        summaryUS: 'Build effective communication with your child',
        keyActions: [
          'Use clear, direct language',
          'Give processing time',
          'Respect communication preferences',
        ],
        suggestedTools: ['visual-schedules'],
        suggestedGuides: ['autism/communication'],
      },
      {
        stepId: 'routines',
        titleUK: 'Building Supportive Routines',
        titleUS: 'Building Supportive Routines',
        summaryUK: 'Create routines that work for your family',
        summaryUS: 'Create routines that work for your family',
        keyActions: [
          'Establish consistent schedules',
          'Use visual supports',
          'Build in flexibility',
        ],
        suggestedTools: ['routine-builder', 'visual-timer'],
        suggestedGuides: ['autism/routines'],
      },
    ],
    completion: {
      titleUK: 'You're Making Great Progress',
      titleUS: 'You're Making Great Progress',
      nextSteps: [
        {
          title: 'School Support',
          link: '/uk/guides/autism/school-support',
          description: 'Navigate education and SEN support',
        },
        {
          title: 'Connect with Community',
          link: '/uk/resources/community',
          description: 'Find local and online support groups',
        },
      ],
    },
  },
];
```

---

## Troubleshooting

### Journey Not Generating

**Check:**
- Journey ID exists in `journeys.config.ts`
- Correct spelling of journey ID
- Config file has no syntax errors

### Step Navigation Broken

**Check:**
- Step numbers are sequential (1, 2, 3...)
- Prev/Next links match step structure
- Progress indicator logic correct

### Performance Gate Fails

**Optimize:**
- Remove unnecessary client components
- Lazy load step images
- Reduce bundle size
- Follow Performance Playbook guidance

---

## Support

**Documentation:**
- [PERFORMANCE_PLAYBOOK.md](./PERFORMANCE_PLAYBOOK.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [SCAFFOLDER_GUIDE.md](./SCAFFOLDER_GUIDE.md)

**Questions?** Contact: Engineering Lead

---

*Last reviewed: January 2026*
