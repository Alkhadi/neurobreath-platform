# Content SEO Map — NeuroBreath

Generated: 2026-01-16

## Overview

This map defines the pillar/cluster structure for the guides library. It is designed for long-term topical authority, with structured internal linking and FAQ coverage. UK English, professional tone, educational only.

## Pillars & Cluster Pages

### Pillar 1 — Breathing Exercises

**URL:** /guides/breathing
**Intent:** Informational + tool next step
**Clusters (6):**

1. /guides/breathing/box-breathing
2. /guides/breathing/4-7-8-breathing
3. /guides/breathing/coherent-breathing
4. /guides/breathing/sos-breathing-60
5. /guides/breathing/breathing-for-focus
6. /guides/breathing/breathing-for-sleep

### Pillar 2 — Focus & ADHD Support

**URL:** /guides/focus-adhd
**Intent:** Informational + routines + tools
**Clusters (6):**

1. /guides/focus-adhd/adhd-focus-basics
2. /guides/focus-adhd/focus-sprints
3. /guides/focus-adhd/distraction-reset
4. /guides/focus-adhd/planning-with-adhd
5. /guides/focus-adhd/working-with-school-adhd
6. /guides/focus-adhd/adhd-parent-support

### Pillar 3 — Anxiety & Stress Support

**URL:** /guides/anxiety-stress
**Intent:** Informational + calming routines
**Clusters (6):**

1. /guides/anxiety-stress/grounding-5-4-3-2-1
2. /guides/anxiety-stress/panic-what-to-do-first
3. /guides/anxiety-stress/breathing-for-anxiety
4. /guides/anxiety-stress/stress-reset-routine
5. /guides/anxiety-stress/worry-time-technique
6. /guides/anxiety-stress/when-to-seek-support-uk

### Pillar 4 — Sleep Support

**URL:** /guides/sleep
**Intent:** Informational + routines
**Clusters (6):**

1. /guides/sleep/sleep-basics
2. /guides/sleep/wind-down-routine
3. /guides/sleep/breathing-for-sleep
4. /guides/sleep/screen-time-and-sleep
5. /guides/sleep/night-waking-reset
6. /guides/sleep/sleep-and-anxiety

### Pillar 5 — Dyslexia & Reading Support

**URL:** /guides/dyslexia-reading
**Intent:** Informational + home/school routines
**Clusters (6):**

1. /guides/dyslexia-reading/what-is-dyslexia
2. /guides/dyslexia-reading/reading-confidence
3. /guides/dyslexia-reading/phonics-at-home
4. /guides/dyslexia-reading/support-at-school
5. /guides/dyslexia-reading/assistive-tech-uk
6. /guides/dyslexia-reading/parent-carer-next-steps

### Pillar 6 — Autism Support

**URL:** /guides/autism-support
**Intent:** Informational + practical support
**Clusters (6):**

1. /guides/autism-support/autism-basics
2. /guides/autism-support/sensory-overload-plan
3. /guides/autism-support/meltdown-vs-shutdown
4. /guides/autism-support/routines-and-transitions
5. /guides/autism-support/school-support-uk-send
6. /guides/autism-support/parent-carer-support

## Internal Linking Rules (strict)

- Each pillar links to:
  - One “Start here” tool CTA
  - All cluster pages
  - 2–3 cross-pillar links
- Each cluster links to:
  - Its pillar hub
  - 2–4 sibling clusters
  - One tool CTA

## FAQ & Schema

- FAQPage JSON-LD renders only on pages that display FAQs.
- Pillar pages include 10 FAQs.
- Cluster pages may include 3–5 mini FAQs when relevant.

## No Orphan Pages

- Every cluster is linked from its pillar and linked to at least 2 sibling pages.
- Every cluster includes a tool CTA and a link back to its pillar.

## Implementation Notes

- Guides content lives in /lib/content/content-seo-map.ts.
- Guides routes are /guides, /guides/[pillar], /guides/[pillar]/[slug].
