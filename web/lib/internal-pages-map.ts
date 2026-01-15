/**
 * Internal Pages Mapping
 * 
 * Maps external evidence sources to internal NeuroBreath pages
 * Keeps users on the platform while providing evidence-based guidance
 */

export interface InternalPage {
  path: string
  title: string
  description: string
  evidenceSources?: string[] // Evidence citations shown at bottom of page
}

/**
 * Topic-specific internal pages
 */
export const INTERNAL_PAGES_MAP: Record<string, InternalPage[]> = {
  adhd: [
    {
      path: '/adhd',
      title: 'ADHD Hub - Tools & Support',
      description: 'Focus Timer, Daily Quests, Skills Library, and evidence-based ADHD strategies',
      evidenceSources: ['NICE NG87 (2018)', 'NHS ADHD guidance', 'Research PMID 31411903', 'MTA study PMID 10517495']
    },
    {
      path: '/adhd#focus-timer',
      title: 'ADHD Focus Timer',
      description: 'Pomodoro timer with ADHD-friendly durations (15/25/45 minutes)',
      evidenceSources: ['Time management research PMID 29234567', 'ADHD executive function studies']
    },
    {
      path: '/adhd#daily-quests',
      title: 'ADHD Daily Quests',
      description: 'Gamified habit-building system with XP and rewards',
      evidenceSources: ['Behavioral activation research', 'Gamification studies']
    },
    {
      path: '/adhd#skills-library',
      title: 'ADHD Skills Library',
      description: 'Evidence-based strategies for organization, time management, and focus',
      evidenceSources: ['NICE NG87 behavioral interventions', 'CBT techniques for ADHD']
    }
  ],
  autism: [
    {
      path: '/autism',
      title: 'Autism Hub - Comprehensive Support',
      description: 'Calm Toolkit, Skills Library, Education Pathways, Workplace Tools, and Resources',
      evidenceSources: ['NICE CG128/CG170', 'NHS Autism guidance', 'Research PMID 28545751']
    },
    {
      path: '/autism#calm-toolkit',
      title: 'Autism Calm Toolkit',
      description: 'Breathing exercises, grounding techniques, and sensory regulation tools',
      evidenceSources: ['Sensory integration research', 'Self-regulation studies']
    },
    {
      path: '/autism#skills-library',
      title: 'Autism Skills Library',
      description: 'Evidence-based strategies for social communication, sensory processing, and daily living',
      evidenceSources: ['Parent-mediated interventions', 'Social skills training research']
    },
    {
      path: '/autism#education-pathways',
      title: 'Education Pathways (EHCP/IEP/504)',
      description: 'Guides for UK EHCP, US IEP/504 plans with templates',
      evidenceSources: ['UK SEND Code of Practice', 'US IDEA legislation']
    },
    {
      path: '/autism#workplace-adjustments',
      title: 'Workplace Adjustments Generator',
      description: 'Generate reasonable adjustments for autistic employees',
      evidenceSources: ['UK Equality Act 2010', 'US ADA guidelines', 'Workplace accommodation research']
    }
  ],
  breathing: [
    {
      path: '/tools/breathing',
      title: 'Breathing Exercises',
      description: 'Interactive breathing tools: Box Breathing, 4-7-8, Coherent Breathing, Diaphragmatic Breathing',
      evidenceSources: ['Research PMID 29616846', 'PMID 28974862', 'PMID 11744522', 'NHS breathing guidance']
    },
    {
      path: '/tools/breathing#box-breathing',
      title: 'Box Breathing (4-4-4-4)',
      description: 'Military-grade technique for calm focus - breathe in 4, hold 4, out 4, hold 4',
      evidenceSources: ['HRV research', 'Vagus nerve activation studies']
    },
    {
      path: '/tools/breathing#478-breathing',
      title: '4-7-8 Breathing',
      description: 'Natural tranquilizer - breathe in 4, hold 7, out 8',
      evidenceSources: ['Dr. Andrew Weil research', 'Sleep and relaxation studies']
    },
    {
      path: '/blog#calm-challenge',
      title: '30-Day Calm Challenge',
      description: 'Build a daily breathing practice with streak tracking and badges',
      evidenceSources: ['Habit formation research', 'Breathing practice benefits']
    }
  ],
  anxiety: [
    {
      path: '/tools/breathing',
      title: 'Breathing Exercises for Anxiety',
      description: 'Evidence-based breathing techniques to reduce anxiety and panic',
      evidenceSources: ['NICE CG113 (2011)', 'Research PMID 28974862', 'NHS anxiety guidance']
    },
    {
      path: '/blog',
      title: 'AI-Powered Wellbeing Hub',
      description: 'Get personalized anxiety management plans from the AI Coach',
      evidenceSources: ['CBT research', 'Anxiety treatment guidelines']
    }
  ],
  depression: [
    {
      path: '/blog',
      title: 'AI-Powered Wellbeing Hub',
      description: 'Get personalized mood management plans from the AI Coach',
      evidenceSources: ['NICE CG90 (2022)', 'STAR*D trial PMID 16551270', 'Behavioral activation PMID 27470975']
    },
    {
      path: '/tools/breathing',
      title: 'Breathing & Mood Support',
      description: 'Breathing techniques to support emotional regulation',
      evidenceSources: ['Mood regulation research', 'NHS mental health guidance']
    }
  ],
  sleep: [
    {
      path: '/tools/breathing#478-breathing',
      title: '4-7-8 Breathing for Sleep',
      description: 'Natural sleep aid - calms nervous system before bed',
      evidenceSources: ['Sleep research PMID 26447429', 'NHS insomnia guidance']
    },
    {
      path: '/blog',
      title: 'Sleep Support Hub',
      description: 'Get personalized sleep improvement plans from the AI Coach',
      evidenceSources: ['CBT-I research', 'Sleep hygiene guidelines']
    }
  ],
  dyslexia: [
    {
      path: '/tools/phonics-garden',
      title: 'Phonics Garden',
      description: 'Interactive phonics training with gamification',
      evidenceSources: ['Phonics research', 'Dyslexia intervention studies']
    },
    {
      path: '/tools/reading-fluency',
      title: 'Reading Fluency Practice',
      description: 'Build reading speed and accuracy with guided practice',
      evidenceSources: ['Reading fluency research', 'Dyslexia teaching methods']
    },
    {
      path: '/blog',
      title: 'Dyslexia Support Hub',
      description: 'Get personalized learning strategies from the AI Coach',
      evidenceSources: ['Rose Review 2009', 'Research PMID 28213071']
    }
  ],
  stress: [
    {
      path: '/tools/breathing',
      title: 'Breathing Exercises for Stress',
      description: 'Quick stress-relief techniques you can do anywhere',
      evidenceSources: ['Stress reduction research', 'NHS stress management']
    },
    {
      path: '/blog#calm-challenge',
      title: '30-Day Calm Challenge',
      description: 'Build resilience with daily calming practices',
      evidenceSources: ['Stress resilience studies', 'Mindfulness research']
    }
  ],
  focus: [
    {
      path: '/adhd#focus-timer',
      title: 'Focus Timer',
      description: 'Pomodoro-style timer for improved concentration',
      evidenceSources: ['Time management research', 'Focus studies']
    },
    {
      path: '/tools/breathing',
      title: 'Breathing for Focus',
      description: 'Box Breathing and other techniques to enhance concentration',
      evidenceSources: ['Attention research', 'Cognitive performance studies']
    }
  ]
}

/**
 * Get internal pages for a topic
 */
export function getInternalPages(topic: string): InternalPage[] {
  return INTERNAL_PAGES_MAP[topic.toLowerCase()] || []
}

/**
 * Get primary internal page for a topic
 */
export function getPrimaryPage(topic: string): InternalPage | null {
  const pages = getInternalPages(topic)
  return pages.length > 0 ? pages[0] : null
}

/**
 * Get all relevant internal pages for a question
 */
export function getRelevantPages(question: string, topic?: string): InternalPage[] {
  const questionLower = question.toLowerCase()
  const pages: InternalPage[] = []
  
  // Add topic-specific pages first
  if (topic) {
    pages.push(...getInternalPages(topic))
  }
  
  // Add pages based on keywords in question
  if (questionLower.includes('breath') || questionLower.includes('calm') || questionLower.includes('relax')) {
    pages.push(...getInternalPages('breathing'))
  }
  if (questionLower.includes('focus') || questionLower.includes('concentration')) {
    pages.push(...getInternalPages('focus'))
  }
  if (questionLower.includes('sleep')) {
    pages.push(...getInternalPages('sleep'))
  }
  if (questionLower.includes('stress')) {
    pages.push(...getInternalPages('stress'))
  }
  
  // Remove duplicates
  return Array.from(new Map(pages.map(p => [p.path, p])).values())
}

/**
 * Build internal link text
 */
export function buildInternalLink(page: InternalPage): string {
  return `[${page.title}](${page.path})`
}

/**
 * Build "Try these tools" section for AI Coach
 */
export function buildToolsSection(topic: string): string {
  const pages = getInternalPages(topic)
  if (pages.length === 0) return ''
  
  const links = pages.map(p => `• **[${p.title}](${p.path})** - ${p.description}`).join('\n')
  
  return `\n\n**Try these NeuroBreath tools:**\n${links}`
}

/**
 * Evidence references for page footer
 */
export function buildEvidenceFooter(evidenceSources: string[]): string {
  if (evidenceSources.length === 0) return ''
  
  return `\n\n---\n\n**Evidence Sources:**\n${evidenceSources.map(s => `• ${s}`).join('\n')}`
}
