/**
 * Quick Intents Mapping for NeuroBreath Buddy
 * Hard-maps all 17 quick question buttons to internal pages
 */

import { QuickIntent } from './types';

export const quickIntents: QuickIntent[] = [
  {
    id: 'what_is_neurobreath',
    label: 'What is NeuroBreath?',
    intentType: 'information',
    primaryInternalPaths: ['/'],
    audiences: ['all'],
    description: 'Introduction to NeuroBreath mission and features'
  },
  {
    id: 'tools_available',
    label: 'What tools are available?',
    intentType: 'tool',
    primaryInternalPaths: ['/tools'],
    audiences: ['neurodivergent', 'parents', 'teachers', 'carers'],
    description: 'Overview of all NeuroBreath tools and resources'
  },
  {
    id: 'adhd_hub',
    label: 'Take me to the ADHD Hub',
    intentType: 'navigation',
    primaryInternalPaths: ['/adhd'],
    audiences: ['neurodivergent', 'parents', 'teachers', 'carers'],
    description: 'ADHD-specific hub with tools and resources'
  },
  {
    id: 'autism_hub',
    label: 'Take me to the Autism Hub',
    intentType: 'navigation',
    primaryInternalPaths: ['/autism'],
    audiences: ['neurodivergent', 'parents', 'teachers', 'carers'],
    description: 'Autism-specific hub with tools and resources'
  },
  {
    id: 'dyslexia_support',
    label: 'Tell me about Dyslexia support',
    intentType: 'information',
    primaryInternalPaths: ['/conditions/dyslexia'],
    audiences: ['neurodivergent', 'parents', 'teachers', 'carers'],
    description: 'Dyslexia resources and reading training'
  },
  {
    id: 'breathing_techniques',
    label: 'Show me breathing techniques',
    intentType: 'tool',
    primaryInternalPaths: ['/techniques'],
    anchorHints: ['box-breathing', '4-7-8', 'coherent', 'sos'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    description: 'Evidence-based breathing exercises and techniques'
  },
  {
    id: 'anxiety_help',
    label: 'Help with Anxiety',
    intentType: 'support',
    primaryInternalPaths: ['/conditions/anxiety'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    fallbackExternalQuery: 'anxiety management neurodivergent',
    description: 'Anxiety support tools and strategies'
  },
  {
    id: 'depression_support',
    label: 'Depression support',
    intentType: 'support',
    primaryInternalPaths: ['/conditions/depression'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    fallbackExternalQuery: 'depression support neurodivergent',
    description: 'Depression resources and coping strategies'
  },
  {
    id: 'stress_management',
    label: 'Stress management tools',
    intentType: 'tool',
    primaryInternalPaths: ['/conditions/stress'],
    audiences: ['neurodivergent', 'parents', 'teachers', 'carers'],
    description: 'Tools for managing stress and overwhelm'
  },
  {
    id: 'sleep_support',
    label: 'Sleep support',
    intentType: 'support',
    primaryInternalPaths: ['/conditions/sleep'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    description: 'Sleep hygiene tips and rest tools'
  },
  {
    id: 'bipolar_support',
    label: 'What about Bipolar?',
    intentType: 'information',
    primaryInternalPaths: ['/conditions/bipolar'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    fallbackExternalQuery: 'bipolar disorder support',
    description: 'Bipolar disorder resources and tools'
  },
  {
    id: 'low_mood_burnout',
    label: 'Low mood & burnout help',
    intentType: 'support',
    primaryInternalPaths: ['/conditions/low-mood-burnout'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    description: 'Support for low mood and burnout'
  },
  {
    id: 'parent_support',
    label: 'Parent support available?',
    intentType: 'support',
    primaryInternalPaths: ['/support/parents'],
    audiences: ['parents'],
    description: 'Resources and guides for parents'
  },
  {
    id: 'teacher_resources',
    label: 'Teacher resources',
    intentType: 'support',
    primaryInternalPaths: ['/support/teachers'],
    audiences: ['teachers'],
    description: 'Classroom strategies and educational resources'
  },
  {
    id: 'carer_support',
    label: 'Carer support tools',
    intentType: 'support',
    primaryInternalPaths: ['/support/carers'],
    audiences: ['carers'],
    description: 'Tools and guidance for carers'
  },
  {
    id: 'evidence_based',
    label: 'How is this evidence-based?',
    intentType: 'information',
    primaryInternalPaths: ['/evidence'],
    audiences: ['all'],
    description: 'Evidence sources and editorial governance'
  },
  {
    id: 'ask_about_page',
    label: 'Ask me about this page...',
    intentType: 'information',
    primaryInternalPaths: ['/'],
    audiences: ['all'],
    description: 'Context-aware questions about the current page'
  },
  {
    id: 'ptsd_support',
    label: 'Tell me about PTSD',
    intentType: 'information',
    primaryInternalPaths: ['/conditions/ptsd'],
    audiences: ['neurodivergent', 'parents', 'carers'],
    fallbackExternalQuery: 'PTSD post-traumatic stress disorder neurodivergent',
    description: 'PTSD resources, grounding techniques, and recovery tools for neurodivergent individuals'
  }
];

export function getQuickIntent(id: string): QuickIntent | undefined {
  return quickIntents.find((intent) => intent.id === id);
}

export function getQuickIntentByLabel(label: string): QuickIntent | undefined {
  return quickIntents.find((intent) => intent.label === label);
}

export function getQuickIntentsByAudience(audience: string): QuickIntent[] {
  return quickIntents.filter((intent) => intent.audiences.includes(audience) || intent.audiences.includes('all'));
}
