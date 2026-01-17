/**
 * Unit tests for sanitizeForTTS
 *
 * Run with: npx tsx lib/speech/sanitizeForTTS.test.ts
 */

import { strict as assert } from 'assert';
import { sanitizeForTTS } from './sanitizeForTTS';

const cases: Array<{ input: string; expected: string; label: string }> = [
  {
    label: 'removes emoji and keeps punctuation',
    input: 'Welcome to Breathing Exercises! 🌬️✨',
    expected: 'Welcome to Breathing Exercises!'
  },
  {
    label: 'converts bullets and separators to sentences',
    input: 'Welcome to Breathing Exercises! 🌬️✨ • Box Breathing - Equal counts for calm',
    expected: 'Welcome to Breathing Exercises! Box Breathing. Equal counts for calm'
  },
  {
    label: 'removes svg/icon artefacts',
    input: 'Start <svg><path d="M0 0" /></svg> lucide-sparkles guidance.',
    expected: 'Start guidance.'
  },
  {
    label: 'preserves 4-7-8 numbering',
    input: '4-7-8 breathing technique',
    expected: '4 7 8 breathing technique'
  },
  {
    label: 'preserves 60-second',
    input: 'SOS 60-Second Calm 🚨',
    expected: 'SOS 60 Second Calm'
  },
  {
    label: 'collapses repeated punctuation',
    input: 'Hello!!! Are you okay... Yes??',
    expected: 'Hello! Are you okay. Yes?'
  },
  {
    label: 'removes html tags safely',
    input: 'Use <strong>bold</strong> text.',
    expected: 'Use bold text.'
  },
  {
    label: 'removes aria/radix tokens',
    input: 'Click aria-hidden radix-portal for details',
    expected: 'Click for details'
  },
  {
    label: 'fallback for empty result',
    input: '✨🚨💫',
    expected: 'No readable text available.'
  }
];

cases.forEach(({ input, expected, label }) => {
  const result = sanitizeForTTS(input);
  assert.equal(result, expected, label);
});

console.log('sanitizeForTTS tests passed.');
