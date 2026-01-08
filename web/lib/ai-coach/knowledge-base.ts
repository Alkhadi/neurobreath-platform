import type { KnowledgeBaseEntry } from '@/types/ai-coach'

// Curated knowledge base for common questions
export const KNOWLEDGE_BASE: Record<string, KnowledgeBaseEntry> = {
  autism_classroom: {
    keywords: ['autism', 'classroom', 'school', 'teacher', 'lesson'],
    summary: [
      'Create predictable daily schedules with visual timetables',
      'Designate low-sensory zones for breaks when overwhelmed',
      'Use clear, literal language and avoid figurative expressions',
      'Provide advance notice before transitions between activities'
    ],
    actions: [
      'Implement visual timers for task management',
      'Offer sensory tools (fidgets, headphones) as needed',
      'Break complex instructions into smaller, sequential steps',
      'Create social stories for new routines or events'
    ],
    clinicianNotes: [
      'Reference UK SEND Code of Practice for reasonable adjustments',
      'Consider ADOS-2 or ADI-R assessments for formal diagnosis',
      'Coordinate with SENCO for Education, Health and Care Plans (EHCPs)'
    ],
    internalLinks: [
      { title: 'Autism Tools', url: '/autism', why: 'Practical autism guidance and tools' },
      { title: 'SEND Support', url: '/schools', why: 'School-based support and strategies' }
    ],
    nhsLinks: [
      { title: 'NHS: Autism support for families', url: 'https://www.nhs.uk/conditions/autism/support/' }
    ],
    niceLinks: [
      { title: 'NICE CG128: Autism in under 19s', url: 'https://www.nice.org.uk/guidance/cg128' }
    ]
  },
  
  adhd_homework: {
    keywords: ['adhd', 'homework', 'study', 'focus', 'concentration'],
    summary: [
      'Use external timers (visual or audible) to combat time blindness',
      'Break tasks into 15–20 minute focused blocks with movement breaks',
      'Create distraction-free zones with minimal visual clutter',
      'Implement consistent routines for starting homework'
    ],
    actions: [
      'Try the Pomodoro Technique (25 min work, 5 min break)',
      'Use checklists to track completed steps',
      'Provide immediate positive reinforcement for task completion',
      'Consider fidget tools or background music for some learners'
    ],
    clinicianNotes: [
      'NICE NG87 recommends environmental modifications before medication',
      'Screen for co-occurring anxiety or learning difficulties',
      'Parent training programmes show strong evidence base'
    ],
    internalLinks: [
      { title: 'ADHD Tools', url: '/adhd', why: 'ADHD-specific tools and strategies' },
      { title: 'Focus Lab', url: '/tools/adhd-focus-lab', why: 'Interactive focus and attention training' }
    ],
    nhsLinks: [],
    niceLinks: [
      { title: 'NICE NG87: ADHD diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng87' },
      { title: 'CDC: ADHD Treatment', url: 'https://www.cdc.gov/ncbddd/adhd/treatment.html' }
    ]
  },
  
  breathing_anxiety: {
    keywords: ['breathing', 'anxiety', 'panic', 'calm', 'stress'],
    summary: [
      'Slow, diaphragmatic breathing activates the parasympathetic nervous system',
      '4-7-8 breathing: inhale for 4, hold for 7, exhale for 8 counts',
      'Box breathing: equal counts for inhale, hold, exhale, hold (e.g., 4-4-4-4)',
      'Coherent breathing: 5 seconds in, 5 seconds out (6 breaths per minute)'
    ],
    actions: [
      'Practice for 2–5 minutes daily, even when calm, to build the skill',
      'Use guided audio or visual aids for pacing',
      'Place one hand on chest, one on belly to feel diaphragm movement',
      'Pair with grounding techniques (5-4-3-2-1 sensory awareness)'
    ],
    clinicianNotes: [
      'Evidence from yoga-based interventions and HRV biofeedback studies',
      'Complement to CBT for anxiety disorders, not a replacement',
      'Contraindicated if respiratory conditions are present (GP clearance advised)'
    ],
    internalLinks: [
      { title: 'Breathing Techniques', url: '/breathing/techniques', why: 'Guided breathing exercises for anxiety' },
      { title: '4-7-8 Breathing', url: '/breathing/techniques', why: 'Step-by-step 4-7-8 breathing guide' },
      { title: 'Anxiety Tools', url: '/anxiety', why: 'Comprehensive anxiety management resources' }
    ],
    nhsLinks: [
      { title: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' }
    ],
    niceLinks: [
      { title: 'NICE CG113: Anxiety disorders', url: 'https://www.nice.org.uk/guidance/cg113' }
    ]
  },
  
  sleep_teens: {
    keywords: ['sleep', 'insomnia', 'teen', 'adolescent', 'bedtime'],
    summary: [
      'Adolescent circadian rhythms naturally shift later (delayed sleep phase)',
      'Aim for 8–10 hours per night, consistent wake time even on weekends',
      'Reduce blue light exposure 1–2 hours before bed',
      'Keep bedroom cool, dark, and quiet'
    ],
    actions: [
      'Set a wind-down routine (reading, stretching, calm music)',
      'Avoid caffeine after 2pm and large meals before bed',
      'Use the bed only for sleep (not homework or screens)',
      'Try progressive muscle relaxation or guided imagery'
    ],
    clinicianNotes: [
      'Screen for anxiety, depression, or circadian rhythm disorders',
      'CBT-I (Cognitive Behavioral Therapy for Insomnia) is first-line treatment',
      'Consider sleep diary or actigraphy for assessment'
    ],
    internalLinks: [
      { title: 'Sleep Tools', url: '/sleep', why: 'Sleep improvement strategies and routines' },
      { title: 'Teen Resources', url: '/resources', why: 'Age-appropriate teen support resources' }
    ],
    nhsLinks: [
      { title: 'NHS: Insomnia', url: 'https://www.nhs.uk/conditions/insomnia/' },
      { title: 'NHS: How to get to sleep', url: 'https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/' }
    ],
    niceLinks: []
  },
  
  default: {
    keywords: [],
    summary: [
      'This is a general educational resource covering neurodevelopmental and mental health topics',
      'We provide evidence-informed guidance from UK and US health authorities',
      'Content is designed to be accessible to families, educators, and individuals'
    ],
    actions: [
      'Use the topic filters to find specific guidance',
      'Explore our breathing exercises and focus tools',
      'Consult your GP, SENCO, or licensed clinician for personalised advice'
    ],
    internalLinks: [
      { title: 'Autism', url: '/autism', why: 'Autism support and understanding' },
      { title: 'ADHD', url: '/adhd', why: 'ADHD management and strategies' },
      { title: 'Breathing Tools', url: '/breathing/techniques', why: 'Evidence-based breathing exercises' },
      { title: 'All Tools', url: '/tools', why: 'Browse all available tools and resources' }
    ],
    nhsLinks: [
      { title: 'NHS.uk', url: 'https://www.nhs.uk' }
    ],
    niceLinks: [
      { title: 'NICE Guidelines', url: 'https://www.nice.org.uk/guidance' }
    ]
  }
}

export function findBestMatch(question: string, topic?: string): KnowledgeBaseEntry {
  const questionLower = question.toLowerCase()
  let bestMatch: { entry: KnowledgeBaseEntry; score: number } | null = null
  
  for (const [key, entry] of Object.entries(KNOWLEDGE_BASE)) {
    if (key === 'default') continue
    
    let score = 0
    
    // Topic match
    if (topic && entry.keywords.some(k => topic.toLowerCase().includes(k))) {
      score += 3
    }
    
    // Keyword matches
    for (const keyword of entry.keywords) {
      if (questionLower.includes(keyword)) {
        score += 2
      }
    }
    
    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { entry, score }
    }
  }
  
  return bestMatch?.entry || KNOWLEDGE_BASE.default
}


