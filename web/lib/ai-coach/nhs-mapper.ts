// Safe NHS URL mapping (no scraping, just curated links)
interface NHSLink {
  title: string
  url: string
}

const NHS_URL_MAP: Record<string, NHSLink[]> = {
  autism: [
    { title: 'NHS: What is autism?', url: 'https://www.nhs.uk/conditions/autism/' },
    { title: 'NHS: Getting an autism assessment', url: 'https://www.nhs.uk/conditions/autism/getting-diagnosed/' },
    { title: 'NHS: Autism support', url: 'https://www.nhs.uk/conditions/autism/support/' }
  ],
  adhd: [
    { title: 'NHS: ADHD overview', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/' },
    { title: 'NHS: ADHD symptoms', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/symptoms/' },
    { title: 'NHS: ADHD treatment', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/treatment/' }
  ],
  dyslexia: [
    { title: 'NHS: Dyslexia', url: 'https://www.nhs.uk/conditions/dyslexia/' },
    { title: 'NHS: Getting help for dyslexia', url: 'https://www.nhs.uk/conditions/dyslexia/getting-help/' }
  ],
  anxiety: [
    { title: 'NHS: Generalised anxiety disorder', url: 'https://www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder/' },
    { title: 'NHS: Self-help for anxiety', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/how-to-cope-with-anxiety/' }
  ],
  depression: [
    { title: 'NHS: Clinical depression', url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/' },
    { title: 'NHS: Depression support', url: 'https://www.nhs.uk/mental-health/conditions/clinical-depression/getting-help/' }
  ],
  stress: [
    { title: 'NHS: Stress', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/stress/' },
    { title: 'NHS: 10 stress busters', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/tips-to-reduce-stress/' }
  ],
  sleep: [
    { title: 'NHS: Insomnia', url: 'https://www.nhs.uk/conditions/insomnia/' },
    { title: 'NHS: Sleep tips', url: 'https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/' }
  ],
  breathing: [
    { title: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' },
    { title: 'NHS Every Mind Matters', url: 'https://www.nhs.uk/every-mind-matters/' }
  ],
  mindfulness: [
    { title: 'NHS: Mindfulness', url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/' }
  ],
  bipolar: [
    { title: 'NHS: Bipolar disorder', url: 'https://www.nhs.uk/mental-health/conditions/bipolar-disorder/' }
  ]
}

const NICE_LINKS: Record<string, NHSLink[]> = {
  adhd: [
    { title: 'NICE NG87: ADHD diagnosis and management', url: 'https://www.nice.org.uk/guidance/ng87' }
  ],
  autism: [
    { title: 'NICE CG142: Autism spectrum disorder in adults', url: 'https://www.nice.org.uk/guidance/cg142' },
    { title: 'NICE CG128: Autism spectrum disorder in under 19s', url: 'https://www.nice.org.uk/guidance/cg128' }
  ],
  depression: [
    { title: 'NICE NG222: Depression in adults', url: 'https://www.nice.org.uk/guidance/ng222' }
  ],
  anxiety: [
    { title: 'NICE CG113: Generalised anxiety disorder and panic disorder', url: 'https://www.nice.org.uk/guidance/cg113' }
  ]
}

export function getNHSLinks(question: string, topic?: string): NHSLink[] {
  const questionLower = question.toLowerCase()
  const links: NHSLink[] = []
  
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

export function getNICELinks(question: string, topic?: string): NHSLink[] {
  const questionLower = question.toLowerCase()
  const links: NHSLink[] = []
  
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

export function getCDCLinks(question: string): NHSLink[] {
  const questionLower = question.toLowerCase()
  const links: NHSLink[] = []
  
  if (questionLower.includes('adhd')) {
    links.push({ 
      title: 'CDC: ADHD Information', 
      url: 'https://www.cdc.gov/ncbddd/adhd/index.html' 
    })
  }
  
  if (questionLower.includes('autism')) {
    links.push({ 
      title: 'CDC: Autism Spectrum Disorder', 
      url: 'https://www.cdc.gov/ncbddd/autism/index.html' 
    })
  }
  
  return links
}


