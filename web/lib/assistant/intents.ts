/**
 * Shared, stable intent IDs across assistant surfaces.
 *
 * IMPORTANT: This module must remain client-safe (no Node/server imports).
 */

import { quickIntents } from '@/lib/buddy/kb/quickIntents';

export type AssistantSurface = 'buddy' | 'blog-ai-coach';

export interface AssistantIntent {
  id: string;
  label: string;
  surface: AssistantSurface;

  /**
   * Optional internal page hints used by the deterministic answer engine.
   * Keep as relative internal paths.
   */
  primaryInternalPaths?: string[];

  /**
   * Canonical question text used when we need to expand terse prompts.
   */
  canonicalQuestion?: string;
}

export const BUDDY_QUICK_INTENTS: AssistantIntent[] = quickIntents.map((i) => ({
  id: i.id,
  label: i.label,
  surface: 'buddy',
  primaryInternalPaths: i.primaryInternalPaths,
  canonicalQuestion: i.label,
}));

export const BLOG_QUICK_PROMPTS: AssistantIntent[] = [
  {
    id: 'blog_explain_simply',
    label: 'Explain simply',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'Explain this simply with practical next steps, and include related NeuroBreath pages.',
  },
  {
    id: 'blog_daily_routines',
    label: 'Daily routines & regulation',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'Suggest daily routines and regulation strategies, and include related NeuroBreath pages.',
  },
  {
    id: 'blog_school_supports',
    label: 'School/classroom supports',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'Suggest school/classroom supports and accommodations, and include related NeuroBreath pages.',
  },
  {
    id: 'blog_workplace_adjustments',
    label: 'Workplace adjustments',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'Suggest workplace adjustments and practical supports, and include related NeuroBreath pages.',
  },
  {
    id: 'blog_assessment_pathway_uk',
    label: 'Assessment pathway (UK)',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'Explain the UK assessment pathway at a high level, and include related NeuroBreath pages.',
  },
  {
    id: 'blog_misunderstandings',
    label: 'Common misunderstandings',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'List common misunderstandings and clarify them briefly, with related NeuroBreath pages.',
  },
  {
    id: 'blog_when_to_seek_help',
    label: 'When to seek help',
    surface: 'blog-ai-coach',
    canonicalQuestion: 'Explain when to seek professional help and what to do next, with related NeuroBreath pages.',
  },
];

export function getAssistantIntentById(id: string): AssistantIntent | undefined {
  return (
    BUDDY_QUICK_INTENTS.find((i) => i.id === id) ||
    BLOG_QUICK_PROMPTS.find((i) => i.id === id)
  );
}

export function getBuddyIntentIdByLabel(label: string): string | undefined {
  const hit = BUDDY_QUICK_INTENTS.find((i) => i.label === label);
  return hit?.id;
}

export function getBlogPromptByLabel(label: string): AssistantIntent | undefined {
  return BLOG_QUICK_PROMPTS.find((p) => p.label === label);
}
