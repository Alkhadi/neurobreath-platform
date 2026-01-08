/**
 * NeuroBreath Resource Catalog (Internal Site Map)
 * 
 * This catalog defines all available tools, pages, and resources on the NeuroBreath platform.
 * The AI Coach uses this to recommend specific, actionable next steps with exact internal links.
 */

export interface NeuroBreathResource {
  title: string
  path: string
  type: 'breathing' | 'focus' | 'reading' | 'sleep' | 'mood' | 'workplace' | 'education' | 'challenge' | 'card'
  tags: string[]
  timeToUseMin: number
  difficulty: 'easy' | 'medium' | 'advanced'
  whatItDoes: string
  contraindications?: string
  ctaLabel: string
}

export const NEUROBREATH_RESOURCE_CATALOG: NeuroBreathResource[] = [
  {
    title: 'Box Breathing (4–4–4–4)',
    path: '/tools/breathing/box',
    type: 'breathing',
    tags: ['anxiety', 'focus', 'adhd', 'transitions', 'workplace'],
    timeToUseMin: 2,
    difficulty: 'easy',
    whatItDoes: 'A simple paced breath to steady attention and reduce stress.',
    contraindications: 'Avoid breath holds if you feel faint or have serious breathing issues; speak to a clinician if unsure.',
    ctaLabel: 'Start Box Breathing'
  },
  {
    title: 'Coherent Breathing (5–5)',
    path: '/tools/breathing/coherent-5-5',
    type: 'breathing',
    tags: ['anxiety', 'sleep', 'stress', 'autism', 'regulation'],
    timeToUseMin: 5,
    difficulty: 'easy',
    whatItDoes: 'Steady 5s inhale / 5s exhale to support calm regulation.',
    contraindications: 'Stop if dizzy; breathe normally.',
    ctaLabel: 'Start 5–5 Breathing'
  },
  {
    title: '4–7–8 Wind-Down',
    path: '/tools/breathing/4-7-8',
    type: 'breathing',
    tags: ['sleep', 'night-anxiety'],
    timeToUseMin: 3,
    difficulty: 'medium',
    whatItDoes: 'A wind-down breath pattern often used before sleep.',
    contraindications: 'May cause dizziness; reduce holds or choose 5–5 if sensitive.',
    ctaLabel: 'Try 4–7–8'
  },
  {
    title: 'Focus Garden (Attention Training)',
    path: '/tools/focus-garden',
    type: 'focus',
    tags: ['adhd', 'executive-function', 'study', 'workplace'],
    timeToUseMin: 3,
    difficulty: 'easy',
    whatItDoes: 'Short focus reps to build consistency without overwhelm.',
    contraindications: '',
    ctaLabel: 'Open Focus Garden'
  },
  {
    title: 'Dyslexia Reading Micro-Practice',
    path: '/reading/dyslexia-training',
    type: 'reading',
    tags: ['dyslexia', 'confidence', 'literacy'],
    timeToUseMin: 5,
    difficulty: 'easy',
    whatItDoes: 'Short, structured reading practice with low stress and clear steps.',
    contraindications: '',
    ctaLabel: 'Start Reading Practice'
  },
  {
    title: '30-Day Calm Challenge',
    path: '/challenges/30-day-calm',
    type: 'challenge',
    tags: ['habits', 'anxiety', 'sleep', 'stress'],
    timeToUseMin: 1,
    difficulty: 'easy',
    whatItDoes: 'Daily streak-based calm practice with badges.',
    contraindications: '',
    ctaLabel: 'Join the Challenge'
  }
]

/**
 * Filter resources by tags
 */
export function findResourcesByTags(tags: string[], limit = 3): NeuroBreathResource[] {
  const scored = NEUROBREATH_RESOURCE_CATALOG.map(resource => {
    const matches = resource.tags.filter(tag => 
      tags.some(searchTag => 
        tag.toLowerCase().includes(searchTag.toLowerCase()) ||
        searchTag.toLowerCase().includes(tag.toLowerCase())
      )
    ).length
    return { resource, score: matches }
  })
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.resource)
}

/**
 * Get resource by exact path
 */
export function getResourceByPath(path: string): NeuroBreathResource | undefined {
  return NEUROBREATH_RESOURCE_CATALOG.find(r => r.path === path)
}

/**
 * Get resources by type
 */
export function getResourcesByType(type: NeuroBreathResource['type']): NeuroBreathResource[] {
  return NEUROBREATH_RESOURCE_CATALOG.filter(r => r.type === type)
}

