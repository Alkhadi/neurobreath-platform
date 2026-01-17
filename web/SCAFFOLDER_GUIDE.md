# NeuroBreath Scaffolder Guide

**Version:** 1.0  
**Last Updated:** January 2026

---

## Overview

The NeuroBreath Route Scaffolder generates new routes/pages based on standardized templates for each route type. It ensures consistency, enforces engineering standards, and accelerates development.

---

## Route Types

The scaffolder supports the following route types:

| Type | Purpose | Use When |
|------|---------|----------|
| `home-landing` | Homepage sections | Creating main landing areas |
| `hub` | Collection pages | Browsing conditions/tools/guides |
| `condition` | Condition pages | New condition content |
| `tool` | Interactive tools | Creating breathing exercises, timers, etc. |
| `guide` | Content-heavy guides | Educational articles and how-tos |
| `journey` | Multi-step flows | Starter journeys within conditions |
| `glossary` | Term definitions | Adding glossary entries |
| `printable` | Downloadable resources | Teacher packs, worksheets |
| `trust` | Trust/credibility | About, trust centre pages |

---

## Installation & Setup

The scaffolder is included in `/web/scripts/scaffold/`. No additional setup required.

**Package scripts available:**
```json
{
  "scaffold:route": "node scripts/scaffold/scaffold-route.mjs",
  "scaffold:journey": "node scripts/scaffold/scaffold-journey.mjs"
}
```

---

## Usage

### Basic Command

```bash
npm run scaffold:route -- --type=<type> --slug=<slug>
```

### Examples

**Create a condition page:**
```bash
npm run scaffold:route -- --type=condition --slug=adhd
```

**Create a nested tool:**
```bash
npm run scaffold:route -- --type=tool --slug=breathing/box-breathing
```

**Create a guide:**
```bash
npm run scaffold:route -- --type=guide --slug=dyslexia/reading-strategies
```

**Create a glossary term:**
```bash
npm run scaffold:route -- --type=glossary --slug=executive-function
```

**Overwrite existing route:**
```bash
npm run scaffold:route -- --type=condition --slug=adhd --force
```

### Advanced Options

```bash
npm run scaffold:route -- \
  --type=condition \
  --slug=adhd \
  --title="ADHD: Understanding Attention Challenges" \
  --summary="Evidence-based guidance for understanding and managing ADHD" \
  --regionMode=split \
  --force
```

**Options:**

- `--type=<type>` (required) - Route type
- `--slug=<slug>` (required) - URL slug (lowercase, hyphenated)
- `--title=<title>` (optional) - Page title (defaults to TODO)
- `--summary=<summary>` (optional) - Meta description (defaults to TODO)
- `--regionMode=split|shared` (optional, default: split) - Region handling
- `--force` (optional) - Overwrite existing files

---

## Generated Files

### For `--regionMode=split` (default)

```
web/
├── app/
│   ├── uk/
│   │   └── <slug>/
│   │       └── page.tsx           # UK route
│   └── us/
│       └── <slug>/
│           └── page.tsx           # US route
└── content/
    └── <type>/
        └── <slug>.content.ts      # Shared content
```

### For `--regionMode=shared`

```
web/
├── app/
│   └── [region]/
│       └── <slug>/
│           └── page.tsx           # Region-aware route
└── content/
    └── <type>/
        └── <slug>.content.ts      # Shared content
```

---

## Templates

Templates are located in `/web/scripts/scaffold/templates/` and define the structure for each route type.

### Template Structure

Each template exports:

```typescript
export default {
  // Generate page component
  generatePage(context) { return string; },
  
  // Generate shared page (for [region] routes)
  generateSharedPage(context) { return string; },
  
  // Generate content module
  generateContent(context) { return string; },
};
```

### Context Object

```typescript
{
  slug: string;      // URL slug
  type: string;      // Route type
  title: string;     // Page title
  summary: string;   // Meta description
  region?: string;   // UK or US (for split mode)
}
```

---

## Customizing Generated Content

### Step 1: Generate Route

```bash
npm run scaffold:route -- --type=condition --slug=adhd
```

### Step 2: Update Content File

Edit `web/content/condition/adhd.content.ts`:

```typescript
export const contentUK = {
  title: 'ADHD: Understanding Attention Challenges',
  summary: 'Evidence-based guidance for understanding ADHD...',
  hero: {
    headline: 'Understanding ADHD',
    subheadline: 'Evidence-based support for attention challenges',
  },
  sections: [
    // Add your content sections
  ],
};

export const contentUS = {
  title: 'ADHD: Understanding Attention Challenges',
  summary: 'Evidence-based guidance for understanding ADHD...',
  // US-specific content
};
```

### Step 3: Customize Page Component

Edit `web/app/uk/adhd/page.tsx` if needed:

```typescript
import { contentUK } from '@/content/condition/adhd.content';

export async function generateMetadata() {
  return {
    title: contentUK.title,
    description: contentUK.summary,
    // ...
  };
}

export default function ADHDPage() {
  return (
    <main>
      {/* Customize layout */}
    </main>
  );
}
```

---

## Integration with Existing Systems

### Search Index

Generated routes should be added to the search index:

```bash
# TODO: Auto-update search index in future version
# Manually add to /web/lib/search/contentIndex.ts for now
```

### Sitemap

Generated routes are automatically included in sitemap generation if indexable.

### Link Intelligence

Use the link intelligence system to connect related content:

```bash
npm run content:link-intel
```

---

## Quality Checklist

After scaffolding, verify:

### Code Quality
- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` succeeds
- [ ] No inline styles in generated code
- [ ] No console errors

### Content
- [ ] UK/US content variants completed
- [ ] Titles and descriptions accurate
- [ ] Educational framing maintained
- [ ] Citations added (copy-only)
- [ ] Last-reviewed date set

### Metadata
- [ ] `generateMetadata()` complete
- [ ] Canonical URLs correct
- [ ] Hreflang tags present
- [ ] Open Graph metadata
- [ ] Appropriate robots/noindex rules

### Performance
- [ ] `npm run test:visual` passes
- [ ] `npm run perf:gate` passes
- [ ] Images optimized (next/image)
- [ ] No unnecessary dependencies
- [ ] Server Components used where possible

### Accessibility
- [ ] Heading hierarchy logical
- [ ] Focus order correct
- [ ] Keyboard navigation works
- [ ] Alt text for images
- [ ] No emoji in TTS text

---

## Route-Type Specific Guidance

### Condition Pages

**Key elements:**
- Hero with condition name
- Symptoms section
- Starter journeys module
- Recommended tools
- Trust block with last-reviewed

**Performance target:**
- Max client JS: 180 KB
- Server Components for content
- Client islands for interactive widgets only

### Tool Pages

**Key elements:**
- Tool instructions
- Interactive UI (client component)
- Related tools
- Trust disclaimer

**Performance target:**
- Max client JS: 200 KB
- Isolate timer/animation logic
- Minimize rerenders

### Guide Pages

**Key elements:**
- Article content
- Table of contents
- Related guides
- Trust block

**Performance target:**
- Max client JS: 100 KB
- Pure server components preferred
- Optimize images in content

### Glossary Pages

**Key elements:**
- Term definition
- Usage examples
- Related terms
- Related guides/conditions

**Performance target:**
- Max client JS: 100 KB
- Server components only

---

## Troubleshooting

### Template Not Found

**Error:** `Failed to load template for type "X"`

**Solution:** Ensure template exists at `/web/scripts/scaffold/templates/X.ts`

### Route Already Exists

**Error:** `Route already exists for slug "X"`

**Solution:** Use `--force` flag to overwrite, or choose a different slug

### Validation Errors

**Error:** `slug must be lowercase, hyphenated`

**Solution:** Use only lowercase letters, numbers, hyphens, and forward slashes

### Build Errors After Scaffolding

**Cause:** Missing imports or incorrect paths

**Solution:**
1. Check import paths in generated files
2. Ensure content file exists
3. Run `npm run typecheck` for details

---

## Creating Custom Templates

### Template Requirements

A template must export a default object with three methods:

```typescript
// web/scripts/scaffold/templates/my-type.ts
export default {
  generatePage(context) {
    return `
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '${context.title}',
    description: '${context.summary}',
  };
}

export default function Page() {
  return (
    <main>
      <h1>${context.title}</h1>
    </main>
  );
}
`;
  },

  generateSharedPage(context) {
    // For [region] routes
    return `...`;
  },

  generateContent(context) {
    return `
export const contentUK = {
  title: '${context.title}',
  summary: '${context.summary}',
};

export const contentUS = {
  title: '${context.title}',
  summary: '${context.summary}',
};
`;
  },
};
```

### Template Best Practices

- Use Server Components by default
- Include `generateMetadata()`
- Add canonical + hreflang in metadata
- Include trust blocks
- Add last-reviewed placeholder
- Use design tokens (no inline styles)
- Import from @/components where possible
- Follow Performance Playbook budgets

---

## Journey Scaffolder

For multi-step flows, use the journey scaffolder:

```bash
npm run scaffold:journey -- --journey=new-to-adhd
```

See [JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md) for details.

---

## Roadmap

**Planned improvements:**
- Auto-update search index on scaffold
- Interactive wizard mode
- Template customization UI
- Batch scaffolding from CSV/JSON
- Integration with CMS preview

---

## Support

**Documentation:**
- [PERFORMANCE_PLAYBOOK.md](./PERFORMANCE_PLAYBOOK.md)
- [ENGINEERING_STANDARDS.md](./ENGINEERING_STANDARDS.md)
- [JOURNEYS_GUIDE.md](./JOURNEYS_GUIDE.md)

**Questions?** Contact: Engineering Lead

---

*Last reviewed: January 2026*
