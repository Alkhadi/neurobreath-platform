import type { ContentPage } from '@/lib/content/canonical-schema';

export const breathingStressPage: ContentPage = {
  id: 'breathing-stress',
  slugs: { UK: 'breathing-exercises-for-stress', US: 'breathing-exercises-for-stress' },
  seo: {
    title: {
      base: 'Breathing exercises for stress',
      UK: 'Breathing exercises for stress',
      US: 'Breathing exercises for stress',
      requireOverride: true,
    },
    description: {
      base: 'A calm, practical breathing routine to support stress regulation. Educational guidance only.',
      UK: 'A calm, practical breathing routine to support stress regulation. Educational guidance only.',
      US: 'A calm, practical breathing routine to support stress regulation. Educational guidance only.',
      requireOverride: true,
    },
  },
  h1: {
    base: 'Breathing exercises for stress',
    UK: 'Breathing exercises for stress',
    US: 'Breathing exercises for stress',
  },
  plainEnglish: {
    summary: {
      base: 'A short breathing routine that helps you slow down and feel steadier. It is for everyday stress support, not emergency care.',
      UK: 'A short breathing routine that helps you slow down and feel steadier. It is for everyday stress support, not emergency care.',
      US: 'A short breathing routine that helps you slow down and feel steadier. It is for everyday stress support, not emergency care.',
    },
    bullets: [
      { base: 'Breathe in for 4 counts and out for 6 counts.' },
      { base: 'Repeat for 8–12 breaths.' },
      { base: 'Use it before meetings, study, or transitions.' },
    ],
  },
  enableGlossaryTooltips: true,
  keyTerms: ['stress', 'grounding', 'coherent-breathing', 'box-breathing'],
  blocks: [
    {
      id: 'intro',
      type: 'paragraph',
      text: {
        base: 'This short routine can help you slow your breathing and steady your focus. It is designed for daily practice, not crisis moments.',
        UK: 'This short routine can help you slow your breathing and steady your focus. It is designed for daily practice, not crisis moments.',
        US: 'This short routine can help you slow your breathing and steady your focus. It is designed for daily practice, not crisis moments.',
      },
    },
    {
      id: 'how',
      type: 'heading',
      level: 'h2',
      text: { base: 'A simple 3‑minute routine' },
    },
    {
      id: 'steps',
      type: 'steps',
      items: [
        {
          base: 'Sit comfortably and place one hand on your chest and one on your abdomen.',
          UK: 'Sit comfortably and place one hand on your chest and one on your abdomen.',
          US: 'Sit comfortably and place one hand on your chest and one on your abdomen.',
          requireOverride: true,
        },
        {
          base: 'Inhale for a slow count of 4, feeling the lower hand rise.',
          UK: 'Inhale for a slow count of 4, feeling the lower hand rise.',
          US: 'Inhale for a slow count of 4, feeling the lower hand rise.',
        },
        {
          base: 'Exhale for a slow count of 6, keeping shoulders relaxed.',
          UK: 'Exhale for a slow count of 6, keeping shoulders relaxed.',
          US: 'Exhale for a slow count of 6, keeping shoulders relaxed.',
        },
        {
          base: 'Repeat for 8–12 breaths.',
          UK: 'Repeat for 8–12 breaths.',
          US: 'Repeat for 8–12 breaths.',
        },
      ],
    },
    {
      id: 'tips',
      type: 'bullets',
      items: [
        {
          base: 'If you feel light‑headed, shorten the count and slow the pace.',
          UK: 'If you feel light‑headed, shorten the count and slow the pace.',
          US: 'If you feel light‑headed, shorten the count and slow the pace.',
        },
        {
          base: 'Try this before a meeting, commute, or study block.',
          UK: 'Try this before a meeting, the school run, or a study block.',
          US: 'Try this before a meeting, the school drop‑off, or a study block.',
          requireOverride: true,
        },
        {
          base: 'Pair the routine with a quiet space and dimmer light if possible.',
          UK: 'Pair the routine with a quiet space and lower lighting if possible.',
          US: 'Pair the routine with a quiet space and lower lighting if possible.',
        },
      ],
    },
    {
      id: 'callout',
      type: 'callout',
      text: {
        base: 'Educational information only. This routine is not a replacement for professional support.',
        UK: 'Educational information only. This routine is not a replacement for professional support.',
        US: 'Educational information only. This routine is not a replacement for professional support.',
      },
    },
    {
      id: 'cta',
      type: 'cta',
      cta: {
        href: '/tools/breath-tools',
        label: { base: 'Open breath tools', UK: 'Open breath tools', US: 'Open breath tools' },
      },
    },
  ],
  faqs: {
    base: [
      {
        question: { base: 'How often should I practise?' },
        answer: { base: 'Daily or a few times per week is a good starting point. Short, consistent practice is more helpful than long, irregular sessions.' },
      },
      {
        question: { base: 'Can I use this for panic?' },
        answer: { base: 'This routine is for everyday stress regulation. If you are in crisis, seek urgent support in your area.' },
      },
    ],
    UK: [
      {
        question: { base: 'How often should I practise?' },
        answer: { base: 'Daily or a few times per week is a good starting point. Short, consistent practice is more helpful than long, irregular sessions.' },
      },
      {
        question: { base: 'Can I use this for panic?' },
        answer: { base: 'This routine is for everyday stress regulation. If you are in crisis, seek urgent support in your area.' },
      },
    ],
    US: [
      {
        question: { base: 'How often should I practice?' },
        answer: { base: 'Daily or a few times per week is a good starting point. Short, consistent practice is more helpful than long, irregular sessions.' },
      },
      {
        question: { base: 'Can I use this for panic?' },
        answer: { base: 'This routine is for everyday stress regulation. If you are in crisis, seek urgent support in your area.' },
      },
    ],
  },
  citationsByRegion: {
    UK: ['nhs_breathing_stress'],
    US: ['cdc_stress'],
    GLOBAL: ['pubmed_29616846'],
  },
  reviewedAt: '2026-01-16',
  reviewIntervalDays: 90,
  primaryPillar: 'stress',
  tags: ['breathing', 'stress', 'calm', 'routine'],
  summary: 'A short daily breathing routine for steadying stress and focus.',
  pageType: 'cluster',
};
