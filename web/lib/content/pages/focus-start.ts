import type { ContentPage } from '@/lib/content/canonical-schema';

export const focusStartPage: ContentPage = {
  id: 'focus-start',
  slugs: { UK: 'focus-start', US: 'focus-start' },
  seo: {
    title: {
      base: 'Focus starter routine',
      UK: 'Focus starter routine',
      US: 'Focus starter routine',
      requireOverride: true,
    },
    description: {
      base: 'A short focus routine to help you begin a task with clarity and a steady pace. Educational guidance only.',
      UK: 'A short focus routine to help you begin a task with clarity and a steady pace. Educational guidance only.',
      US: 'A short focus routine to help you begin a task with clarity and a steady pace. Educational guidance only.',
      requireOverride: true,
    },
  },
  h1: {
    base: 'Focus starter routine',
    UK: 'Focus starter routine',
    US: 'Focus starter routine',
  },
  plainEnglish: {
    summary: {
      base: 'A 10‑minute focus routine that helps you start one task with less overwhelm. It is a gentle, practical step, not a clinical tool.',
      UK: 'A 10‑minute focus routine that helps you start one task with less overwhelm. It is a gentle, practical step, not a clinical tool.',
      US: 'A 10‑minute focus routine that helps you start one task with less overwhelm. It is a gentle, practical step, not a clinical tool.',
    },
    bullets: [
      { base: 'Pick one small task and define the first step.' },
      { base: 'Set a 10‑minute timer and remove one distraction.' },
      { base: 'Stop, review progress, and decide on the next step.' },
    ],
  },
  enableGlossaryTooltips: true,
  keyTerms: ['executive-function', 'working-memory', 'time-blindness', 'reasonable-adjustments'],
  blocks: [
    {
      id: 'intro',
      type: 'paragraph',
      text: {
        base: 'This routine helps you begin with a small, clear step. It can support executive function without overloading your day.',
        UK: 'This routine helps you begin with a small, clear step. It can support executive function without overloading your day.',
        US: 'This routine helps you begin with a small, clear step. It can support executive function without overloading your day.',
      },
    },
    {
      id: 'step-heading',
      type: 'heading',
      level: 'h2',
      text: { base: 'The 10‑minute start' },
    },
    {
      id: 'steps',
      type: 'steps',
      items: [
        {
          base: 'Name one task and write a single sentence describing the first step.',
          UK: 'Name one task and write a single sentence describing the first step.',
          US: 'Name one task and write a single sentence describing the first step.',
          requireOverride: true,
        },
        {
          base: 'Set a 10‑minute timer and remove one distraction.',
          UK: 'Set a 10‑minute timer and remove one distraction.',
          US: 'Set a 10‑minute timer and remove one distraction.',
        },
        {
          base: 'Work until the timer ends, then decide whether to continue or reset.',
          UK: 'Work until the timer ends, then decide whether to continue or reset.',
          US: 'Work until the timer ends, then decide whether to continue or reset.',
        },
      ],
    },
    {
      id: 'bullets',
      type: 'bullets',
      items: [
        {
          base: 'If you use support at school or work, ask your {term:primary_care} or adviser what accommodations are available.',
          UK: 'If you use support at school or work, ask your {term:primary_care} or adviser what adjustments are available.',
          US: 'If you use support at school or work, ask your {term:primary_care} or advisor what accommodations are available.',
          requireOverride: true,
        },
        {
          base: 'Short focus sprints can be repeated 2–3 times with breaks.',
          UK: 'Short focus sprints can be repeated 2–3 times with breaks.',
          US: 'Short focus sprints can be repeated 2–3 times with breaks.',
        },
      ],
    },
    {
      id: 'callout',
      type: 'callout',
      text: {
        base: 'This is educational guidance only and not a diagnostic or clinical tool.',
        UK: 'This is educational guidance only and not a diagnostic or clinical tool.',
        US: 'This is educational guidance only and not a diagnostic or clinical tool.',
      },
    },
    {
      id: 'cta',
      type: 'cta',
      cta: {
        href: '/tools/focus-training',
        label: { base: 'Start focus training', UK: 'Start focus training', US: 'Start focus training' },
      },
    },
  ],
  faqs: {
    base: [
      {
        question: { base: 'Is this helpful for ADHD?' },
        answer: { base: 'It may support task initiation, but it is not a treatment. If you need clinical advice, speak with a qualified professional.' },
      },
    ],
    UK: [
      {
        question: { base: 'Is this helpful for ADHD?' },
        answer: { base: 'It may support task initiation, but it is not a treatment. If you need clinical advice, speak with a qualified professional.' },
      },
    ],
    US: [
      {
        question: { base: 'Is this helpful for ADHD?' },
        answer: { base: 'It may support task initiation, but it is not a treatment. If you need clinical advice, speak with a qualified professional.' },
      },
    ],
  },
  citationsByRegion: {
    UK: ['nice_ng87', 'nhs_adhd'],
    US: ['nimh_adhd'],
    GLOBAL: ['pubmed_31411903'],
  },
  reviewedAt: '2026-01-16',
  reviewIntervalDays: 120,
  primaryPillar: 'focus-adhd',
  tags: ['focus', 'adhd', 'task-start', 'routine'],
  summary: 'A short routine that helps you start tasks with a clear first step.',
  pageType: 'cluster',
};
