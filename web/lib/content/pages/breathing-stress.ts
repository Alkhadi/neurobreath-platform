import type { ContentPage } from '@/lib/content/canonical-schema';

export const breathingStressPage: ContentPage = {
  id: 'breathing-stress',
  slugs: { UK: 'breathing-exercises-for-stress', US: 'breathing-exercises-for-stress' },
  seo: {
    title: {
      base: 'Breathing exercises for stress',
      UK: 'Breathing exercises for stress',
      US: 'Breathing exercises for stress',
    },
    description: {
      base: 'A calm, practical breathing routine to support stress regulation. Educational guidance only.',
      UK: 'A calm, practical breathing routine to support stress regulation. Educational guidance only.',
      US: 'A calm, practical breathing routine to support stress regulation. Educational guidance only.',
    },
  },
  h1: {
    base: 'Breathing exercises for stress',
    UK: 'Breathing exercises for stress',
    US: 'Breathing exercises for stress',
  },
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
        { base: 'Sit comfortably and place one hand on your chest and one on your abdomen.' },
        { base: 'Inhale for a slow count of 4, feeling the lower hand rise.' },
        { base: 'Exhale for a slow count of 6, keeping shoulders relaxed.' },
        { base: 'Repeat for 8–12 breaths.' },
      ],
    },
    {
      id: 'tips',
      type: 'bullets',
      items: [
        { base: 'If you feel light‑headed, shorten the count and slow the pace.' },
        { base: 'Try this before a meeting, commute, or study block.' },
        { base: 'Pair the routine with a quiet space and dimmer light if possible.' },
      ],
    },
    {
      id: 'callout',
      type: 'callout',
      text: {
        base: 'Educational information only. This routine is not a replacement for professional support.',
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
  },
  citationsByRegion: {
    UK: ['nhs_breathing_stress'],
    US: ['cdc_stress'],
    GLOBAL: ['pubmed_29616846'],
  },
  reviewedAt: '2026-01-16',
  reviewIntervalDays: 90,
};
