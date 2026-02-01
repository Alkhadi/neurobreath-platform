import type { EvidenceSource } from '@/types/ai-coach'

// Safe NHS URL mapping - NO scraping, only canonical NHS.uk pages
const NHS_URL_MAP: Record<string, EvidenceSource[]> = {
  autism: [
    { title: 'NHS: What is autism?', url: 'https://www.nhs.uk/conditions/autism/', kind: 'NHS' },
    { title: 'NHS: Getting an autism assessment', url: 'https://www.nhs.uk/conditions/autism/getting-diagnosed/', kind: 'NHS' },
    { title: 'NHS: Autism support', url: 'https://www.nhs.uk/conditions/autism/support/', kind: 'NHS' }
  ],
  adhd: [
    { title: 'NHS: ADHD overview', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/', kind: 'NHS' },
    { title: 'NHS: ADHD symptoms', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/symptoms/', kind: 'NHS' },
    { title: 'NHS: ADHD treatment', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/treatment/', kind: 'NHS' }
  ],
  dyslexia: [
    { title: 'NHS: Dyslexia', url: 'https://www.nhs.uk/conditions/dyslexia/', kind: 'NHS' },
    { title: 'NHS: Getting help for dyslexia', url: 'https://www.nhs.uk/conditions/dyslexia/getting-help/', kind: 'NHS' }
  ],
  anxiety: [
    { title: 'NHS: Generalised anxiety disorder', url: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/', kind: 'NHS' },
    { title: 'NHS: Self-help for anxiety', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-cope-with-anxiety/', kind: 'NHS' }
  ],
  depression: [
    { title: 'NHS: Clinical depression', url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/', kind: 'NHS' },
    { title: 'NHS: Depression support', url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/getting-help/', kind: 'NHS' }
  ],
  stress: [
    { title: 'NHS: Stress', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/', kind: 'NHS' },
    { title: 'NHS: 10 stress busters', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/tips-to-reduce-stress/', kind: 'NHS' }
  ],
  sleep: [
    { title: 'NHS: Insomnia', url: 'https://www.nhs.uk/conditions/insomnia/', kind: 'NHS' },
    { title: 'NHS: How to get to sleep', url: 'https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/', kind: 'NHS' }
  ],
  breathing: [
    { title: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/', kind: 'NHS' },
    { title: 'NHS Every Mind Matters', url: 'https://www.nhs.uk/every-mind-matters/', kind: 'NHS' }
  ],
  mindfulness: [
    { title: 'NHS: Mindfulness', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/', kind: 'NHS' }
  ],
  bipolar: [
    { title: 'NHS: Bipolar disorder', url: 'https://www.nhs.uk/mental-health/conditions/bipolar-disorder/', kind: 'NHS' }
  ],
  mood: [
    { title: 'NHS: Low mood and depression', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/low-mood-and-depression/', kind: 'NHS' }
  ]
}

export function getNHSLinks(question: string, topic?: string): EvidenceSource[] {
  const questionLower = question.toLowerCase()
  const links: EvidenceSource[] = []
  
  // Try topic-specific match first
  if (topic) {
    const topicKey = topic.toLowerCase()
    if (NHS_URL_MAP[topicKey]) {
      links.push(...NHS_URL_MAP[topicKey])
    }
  }
  
  // Match keywords in question
  for (const [key, urls] of Object.entries(NHS_URL_MAP)) {
    if (questionLower.includes(key) && !links.some(l => urls.some(u => u.url === l.url))) {
      links.push(...urls.slice(0, 2)) // Max 2 per keyword
    }
  }
  
  return links.slice(0, 5) // Max 5 total
}

export function getNHSCrisisLinks(): EvidenceSource[] {
  return [
    { title: 'NHS: Getting urgent help for mental health', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/', kind: 'NHS' }
  ]
}







