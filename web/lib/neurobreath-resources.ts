/**
 * NeuroBreath Resource Registry
 * 
 * Internal catalog of all NeuroBreath tools, trainings, and resources
 * for deterministic recommendation matching
 */

import type { Topic, MainChallenge, Goal, AgeGroup } from '@/types/user-context'

export interface NeuroBreathResource {
  id: string
  title: string
  type: 'breathing' | 'training' | 'challenge' | 'tool' | 'article'
  url: string
  tags: {
    topics: Topic[]
    challenges: MainChallenge[]
    goals: Goal[]
  }
  audience: AgeGroup[]
  whenToUse: string
  description: string
}

/**
 * Complete registry of NeuroBreath resources
 */
export const NEUROBREATH_RESOURCES: NeuroBreathResource[] = [
  {
    id: 'focus-garden',
    title: 'Focus Garden',
    type: 'tool',
    url: '/autism/focus-garden',
    tags: {
      topics: ['autism', 'adhd'],
      challenges: ['focus', 'behaviour', 'routines'],
      goals: ['improve-focus', 'improve-routines']
    },
    audience: ['children', 'adolescence', 'parent-caregiver'],
    whenToUse: 'When needing visual focus support and routine building',
    description: 'Interactive visual tool to build focus and routines'
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing Timer',
    type: 'breathing',
    url: '/breathing/techniques',
    tags: {
      topics: ['anxiety', 'stress'],
      challenges: ['anxiety', 'meltdowns', 'sensory'],
      goals: ['reduce-stress', 'de-escalation', 'today']
    },
    audience: ['children', 'adolescence', 'youth', 'adult', 'parent-caregiver', 'teacher'],
    whenToUse: 'For immediate calm, pre-test anxiety, or daily regulation',
    description: '4-4-4-4 breathing used by military and emergency responders'
  },
  {
    id: '4-7-8-breathing',
    title: '4-7-8 Breathing Exercise',
    type: 'breathing',
    url: '/breathing/techniques',
    tags: {
      topics: ['anxiety', 'sleep', 'stress'],
      challenges: ['anxiety', 'sleep', 'meltdowns'],
      goals: ['reduce-stress', 'improve-sleep', 'de-escalation', 'today']
    },
    audience: ['adolescence', 'youth', 'adult', 'parent-caregiver'],
    whenToUse: 'Bedtime wind-down or panic attack management',
    description: 'Natural tranquilizer for the nervous system'
  },
  {
    id: 'coherent-breathing',
    title: 'Coherent 5-5 Breathing',
    type: 'breathing',
    url: '/breathing/techniques',
    tags: {
      topics: ['stress', 'anxiety'],
      challenges: ['anxiety', 'focus'],
      goals: ['reduce-stress', 'improve-focus', 'this-week', 'long-term']
    },
    audience: ['adolescence', 'youth', 'adult'],
    whenToUse: 'Daily practice for building stress resilience',
    description: 'Rhythmic breathing at 6 breaths/min to optimize HRV'
  },
  {
    id: 'sos-60-calm',
    title: 'SOS-60 Quick Calm',
    type: 'breathing',
    url: '/breathing/breath',
    tags: {
      topics: ['anxiety', 'stress'],
      challenges: ['anxiety', 'meltdowns'],
      goals: ['reduce-stress', 'de-escalation', 'today']
    },
    audience: ['children', 'adolescence', 'youth', 'adult', 'parent-caregiver', 'teacher'],
    whenToUse: 'Emergency meltdown prevention or acute stress',
    description: '60-second rapid calm protocol'
  },
  {
    id: 'calm-challenge',
    title: '30-Day Calm Challenge',
    type: 'challenge',
    url: '/blog#calm-challenge',
    tags: {
      topics: ['anxiety', 'stress'],
      challenges: ['anxiety', 'routines'],
      goals: ['reduce-stress', 'improve-routines', 'this-week', 'long-term']
    },
    audience: ['adolescence', 'youth', 'adult', 'parent-caregiver'],
    whenToUse: 'Building consistent calm practice over time',
    description: 'Structured 30-day breathing and mindfulness streak'
  },
  {
    id: 'sleep-wind-down',
    title: 'Sleep Wind-Down Routine',
    type: 'tool',
    url: '/sleep',
    tags: {
      topics: ['sleep'],
      challenges: ['sleep'],
      goals: ['improve-sleep', 'this-week']
    },
    audience: ['children', 'adolescence', 'youth', 'adult', 'parent-caregiver'],
    whenToUse: 'Establishing bedtime routine for better sleep',
    description: 'CBT-I informed sleep hygiene and wind-down tools'
  },
  {
    id: 'dyslexia-reading-training',
    title: 'Dyslexia Reading Training Hub',
    type: 'training',
    url: '/dyslexia-reading-training',
    tags: {
      topics: ['dyslexia'],
      challenges: ['learning', 'focus'],
      goals: ['support-learning', 'this-week', 'long-term']
    },
    audience: ['children', 'adolescence', 'parent-caregiver', 'teacher'],
    whenToUse: 'Structured phonics and reading practice',
    description: 'Evidence-based multisensory reading support'
  },
  {
    id: 'autism-support-toolkit',
    title: 'Autism Support Toolkit',
    type: 'article',
    url: '/autism',
    tags: {
      topics: ['autism'],
      challenges: ['routines', 'sensory', 'communication', 'behaviour'],
      goals: ['improve-routines', 'better-communication', 'de-escalation']
    },
    audience: ['children', 'adolescence', 'parent-caregiver', 'teacher'],
    whenToUse: 'Understanding autism and accessing supports',
    description: 'Visual supports, routines, and sensory strategies'
  },
  {
    id: 'adhd-focus-toolkit',
    title: 'ADHD Focus Toolkit',
    type: 'article',
    url: '/adhd',
    tags: {
      topics: ['adhd'],
      challenges: ['focus', 'routines', 'learning'],
      goals: ['improve-focus', 'improve-routines', 'support-learning']
    },
    audience: ['children', 'adolescence', 'youth', 'adult', 'parent-caregiver', 'teacher'],
    whenToUse: 'Managing ADHD symptoms at home, school, or work',
    description: 'Timers, planners, and executive function supports'
  },
  {
    id: 'anxiety-management',
    title: 'Anxiety Management Tools',
    type: 'article',
    url: '/anxiety',
    tags: {
      topics: ['anxiety'],
      challenges: ['anxiety', 'meltdowns'],
      goals: ['reduce-stress', 'de-escalation', 'today', 'this-week']
    },
    audience: ['adolescence', 'youth', 'adult', 'parent-caregiver'],
    whenToUse: 'Understanding and managing anxiety symptoms',
    description: 'Evidence-based anxiety reduction strategies'
  },
  {
    id: 'stress-first-aid',
    title: 'Stress First Aid Kit',
    type: 'article',
    url: '/stress',
    tags: {
      topics: ['stress'],
      challenges: ['anxiety', 'focus'],
      goals: ['reduce-stress', 'today']
    },
    audience: ['adolescence', 'youth', 'adult', 'parent-caregiver'],
    whenToUse: 'Acute stress or overwhelm',
    description: 'Grounding cues, breath ladders, workplace tips'
  },
  {
    id: 'mindfulness-practices',
    title: 'Mindfulness Micro-Practices',
    type: 'breathing',
    url: '/breathing/mindfulness',
    tags: {
      topics: ['stress', 'anxiety'],
      challenges: ['anxiety', 'focus', 'routines'],
      goals: ['reduce-stress', 'improve-focus', 'this-week', 'long-term']
    },
    audience: ['children', 'adolescence', 'youth', 'adult', 'parent-caregiver', 'teacher'],
    whenToUse: 'Daily mindfulness practice or classroom integration',
    description: '2-minute classroom scripts and sensory walks'
  },
  {
    id: 'breathing-training',
    title: 'Breathing Training Hub',
    type: 'training',
    url: '/breathing/training',
    tags: {
      topics: ['anxiety', 'stress'],
      challenges: ['anxiety', 'meltdowns', 'focus'],
      goals: ['reduce-stress', 'de-escalation', 'this-week']
    },
    audience: ['children', 'adolescence', 'youth', 'adult', 'parent-caregiver', 'teacher'],
    whenToUse: 'Learning and practicing breathing techniques',
    description: 'Interactive breathing exercises and visual guides'
  },
  {
    id: 'mood-tools',
    title: 'Mood Boost Micro-Actions',
    type: 'tool',
    url: '/tools/mood-tools',
    tags: {
      topics: ['mood', 'stress'],
      challenges: ['behaviour', 'routines'],
      goals: ['reduce-stress', 'improve-routines', 'this-week']
    },
    audience: ['adolescence', 'youth', 'adult'],
    whenToUse: 'Low mood or depression support',
    description: 'Behavioural activation checklists and mood trackers'
  }
]

/**
 * Get resource by ID
 */
export function getResourceById(id: string): NeuroBreathResource | undefined {
  return NEUROBREATH_RESOURCES.find(r => r.id === id)
}

/**
 * Get all resources matching a topic
 */
export function getResourcesByTopic(topic: Topic): NeuroBreathResource[] {
  return NEUROBREATH_RESOURCES.filter(r => r.tags.topics.includes(topic))
}

/**
 * Get all resources matching a challenge
 */
export function getResourcesByChallenge(challenge: MainChallenge): NeuroBreathResource[] {
  return NEUROBREATH_RESOURCES.filter(r => r.tags.challenges.includes(challenge))
}

/**
 * Get all resources matching a goal
 */
export function getResourcesByGoal(goal: Goal): NeuroBreathResource[] {
  return NEUROBREATH_RESOURCES.filter(r => r.tags.goals.includes(goal))
}



