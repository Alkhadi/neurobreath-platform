import type { EvidenceSource } from '@/types/ai-coach'

// Static mapping to canonical NICE guidance URLs
const NICE_LINKS: Record<string, EvidenceSource[]> = {
  adhd: [
    { title: 'NICE NG87: ADHD diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng87', kind: 'NICE' }
  ],
  autism: [
    { title: 'NICE CG142: Autism spectrum disorder in adults', url: 'https://www.nice.org.uk/guidance/cg142', kind: 'NICE' },
    { title: 'NICE CG128: Autism spectrum disorder in under 19s', url: 'https://www.nice.org.uk/guidance/cg128', kind: 'NICE' },
    { title: 'NICE CG170: Autism spectrum disorder in under 19s: support and management', url: 'https://www.nice.org.uk/guidance/cg170', kind: 'NICE' }
  ],
  depression: [
    { title: 'NICE NG222: Depression in adults', url: 'https://www.nice.org.uk/guidance/ng222', kind: 'NICE' }
  ],
  anxiety: [
    { title: 'NICE CG113: Generalised anxiety disorder and panic disorder', url: 'https://www.nice.org.uk/guidance/cg113', kind: 'NICE' }
  ],
  bipolar: [
    { title: 'NICE CG185: Bipolar disorder', url: 'https://www.nice.org.uk/guidance/cg185', kind: 'NICE' }
  ],
  sleep: [
    { title: 'NICE: Insomnia guidance', url: 'https://cks.nice.org.uk/topics/insomnia/', kind: 'NICE' }
  ]
}

export function getNICELinks(question: string, topic?: string): EvidenceSource[] {
  const questionLower = question.toLowerCase()
  const links: EvidenceSource[] = []
  
  if (topic) {
    const topicKey = topic.toLowerCase()
    if (NICE_LINKS[topicKey]) {
      links.push(...NICE_LINKS[topicKey])
    }
  }
  
  for (const [key, urls] of Object.entries(NICE_LINKS)) {
    if (questionLower.includes(key) && !links.some(l => urls.some(u => u.url === l.url))) {
      links.push(...urls)
    }
  }
  
  return links.slice(0, 3)
}

