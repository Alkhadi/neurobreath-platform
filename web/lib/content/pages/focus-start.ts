import type { ContentPage } from '@/lib/content/canonical-schema';

export const focusStartPage: ContentPage = {
  id: 'focus-start',
  slugs: { UK: 'focus-start', US: 'focus-start' },
  seo: {
    title: {
      base: 'Focus starter routine',
      UK: 'Focus starter routine',
      US: 'Focus starter routine',
    },
    description: {
      base: 'A short focus routine to help you begin a task with clarity and a steady pace. Educational guidance only.',
      UK: 'A short focus routine to help you begin a task with clarity and a steady pace. Educational guidance only.',
      US: 'A short focus routine to help you begin a task with clarity and a steady pace. Educational guidance only.',
    },
  },
  h1: {
    base: 'Focus starter routine',
    UK: 'Focus starter routine',
    US: 'Focus starter routine',
  },
  blocks: [
    {
      id: 'intro',
      type: 'paragraph',
      text: {
        base: 'This routine helps you begin with a small, clear step. It can support executive function without overloading your day.',
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
        { base: 'Name one task and write a single sentence describing the first step.' },
        { base: 'Set a 10‑minute timer and remove one distraction.' },
        { base: 'Work until the timer ends, then decide whether to continue or reset.' },
      ],
    },
    {
      id: 'bullets',
      type: 'bullets',
      items: [
        { base: 'If you use support at school or work, ask your {term:primary_care} or adviser what accommodations are available.' },
        { base: 'Short focus sprints can be repeated 2–3 times with breaks.' },
      ],
    },
    {
      id: 'callout',
      type: 'callout',
      text: {
        base: 'This is educational guidance only and not a diagnostic or clinical tool.',
      },
    },
    {
      id: 'cta',
      type: 'cta',
      cta: {
        href: '/tools/focus-training',
        label: { base: 'Start focus training' },
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
  },
  citationsByRegion: {
    UK: ['nice_ng87', 'nhs_adhd'],
    US: ['nimh_adhd'],
    GLOBAL: ['pubmed_31411903'],
  },
  reviewedAt: '2026-01-16',
  reviewIntervalDays: 120,
};
