import type { EvidenceManifest } from './types';

export const evidenceByRoute: Record<string, EvidenceManifest> = {
  '/adhd': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 90,
    citations: ['nice_ng87', 'nhs_adhd', 'pubmed_31411903', 'pubmed_10517495'],
    notes: 'Educational guidance; not medical advice.',
  },
  '/autism': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nice_cg128', 'nice_cg142', 'nhs_autism', 'pubmed_28545751'],
    notes: 'Educational guidance; not diagnostic.',
  },
  '/breathing': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 90,
    citations: ['nhs_breathing_stress', 'pubmed_29616846', 'pubmed_28974862', 'pubmed_11744522'],
    notes: 'Breathing guidance for wellbeing support only.',
  },
  '/anxiety': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 90,
    citations: ['nice_cg113', 'nhs_gad', 'pubmed_30301513'],
  },
  '/sleep': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nhs_insomnia', 'pubmed_26447429'],
  },
  '/tools/adhd-tools': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nice_ng87', 'nhs_adhd', 'pubmed_31411903'],
  },
  '/tools/autism-tools': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nice_cg128', 'nice_cg142', 'nhs_autism'],
  },
  '/tools/anxiety-tools': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 90,
    citations: ['nice_cg113', 'nhs_gad', 'pubmed_30301513'],
  },
  '/tools/breath-tools': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 90,
    citations: ['nhs_breathing_stress', 'pubmed_29616846', 'pubmed_28974862', 'pubmed_11744522'],
    notes: 'Breathing tools support wellbeing routines only; not medical advice.',
  },
  '/tools/mood-tools': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nhs_depression', 'nice_ng222', 'nhs_breathing_stress', 'nhs_insomnia', 'pubmed_27470975'],
    notes: 'Mood tools are educational supports only; not medical advice or treatment.',
  },
  '/tools/sleep-tools': {
    reviewedAt: '2026-01-20',
    reviewIntervalDays: 120,
    citations: ['nhs_insomnia', 'nice_mtg70', 'nhs_breathing_stress', 'pubmed_26447429', 'pubmed_28974862'],
    notes: 'Sleep tools support sleep hygiene routines only; not medical advice or treatment. For persistent insomnia, consider CBT-I.',
  },
  '/tools/depression-tools': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nice_ng222', 'nhs_depression', 'pubmed_16551270', 'pubmed_27470975'],
  },
  '/dyslexia-reading-training': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nhs_dyslexia', 'rose_review_2009', 'pubmed_25638728'],
  },
  '/conditions/anxiety': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nice_cg113', 'nhs_gad', 'pubmed_30301513'],
  },
  '/conditions/depression': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nice_ng222', 'nhs_depression', 'pubmed_16551270'],
  },
  '/conditions/dyslexia': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    citations: ['nhs_dyslexia', 'rose_review_2009', 'pubmed_25638728'],
  },
  '/': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nhs_breathing_stress', 'nhs_adhd', 'nhs_autism', 'nhs_gad'],
  },
  '/blog': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 120,
    citations: ['nhs_breathing_stress', 'nhs_adhd', 'nhs_autism'],
  },
  '/trust/evidence-policy': {
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    citationsByRegion: {
      UK: ['nhs_breathing_stress', 'nice_ng87', 'nice_cg113'],
      US: ['cdc_stress', 'nimh_adhd', 'medlineplus_anxiety'],
      GLOBAL: ['pubmed_29616846'],
    },
    notes: 'Policy-level references only.',
  },
};
