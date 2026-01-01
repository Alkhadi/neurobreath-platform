import type { VisualLearningCard, AudienceType } from '@/types/ai-coach'
import type { ParsedIntent } from './intent'

interface CardGeneratorInput {
  topic: string
  intent: ParsedIntent
  summary: string[]
  actions: string[]
  evidenceSnapshot: {
    nhsNice: string[]
    research: string[]
    practicalSupports: string[]
    whenToSeekHelp: string[]
  }
  audience?: AudienceType
}

const ICON_MAP: Record<string, string> = {
  brain: 'Brain',
  heart: 'Heart',
  users: 'Users',
  home: 'Home',
  school: 'GraduationCap',
  briefcase: 'Briefcase',
  clipboard: 'ClipboardCheck',
  stethoscope: 'Stethoscope',
  lightbulb: 'Lightbulb',
  target: 'Target',
  calendar: 'Calendar',
  checkCircle: 'CheckCircle',
  alertCircle: 'AlertCircle',
  wind: 'Wind',
  moon: 'Moon',
  sun: 'Sun',
  book: 'BookOpen',
  shield: 'Shield'
}

export function generateVisualLearningCards(input: CardGeneratorInput): VisualLearningCard[] {
  const { topic, intent, summary, actions, evidenceSnapshot, audience } = input
  const cards: VisualLearningCard[] = []
  let cardIdCounter = 1
  
  // Card 1: What is it?
  if (summary.length > 0 && intent.primary === 'definition') {
    cards.push({
      id: `card-${cardIdCounter++}`,
      title: `What is ${topic}?`,
      lines: [
        summary[0],
        summary[1] || summary[0]
      ].slice(0, 2),
      iconKey: 'brain',
      emoji: '🧠'
    })
  }
  
  // Card 2: Key strengths (if autism/adhd/dyslexia)
  if (['autism', 'adhd', 'dyslexia'].includes(topic) && intent.primary === 'definition') {
    cards.push({
      id: `card-${cardIdCounter++}`,
      title: 'Strengths & Abilities',
      lines: [
        'Unique thinking patterns',
        'Deep focus on interests',
        'Creative problem-solving'
      ],
      iconKey: 'lightbulb',
      emoji: '💡',
      back: {
        title: 'Remember',
        lines: [
          'Neurodiversity is natural variation',
          'Support needs don\'t define worth',
          'Everyone has strengths to celebrate'
        ]
      }
    })
  }
  
  // Card 3-5: Practical supports from actions
  const actionCards = actions.slice(0, 3).map((action, idx) => {
    return {
      id: `card-${cardIdCounter++}`,
      title: `Strategy ${idx + 1}`,
      lines: [action],
      iconKey: idx === 0 ? 'target' : idx === 1 ? 'checkCircle' : 'clipboard',
      emoji: idx === 0 ? '🎯' : idx === 1 ? '✅' : '📋'
    }
  })
  cards.push(...actionCards)
  
  // Card: When to seek help
  if (evidenceSnapshot.whenToSeekHelp.length > 0) {
    cards.push({
      id: `card-${cardIdCounter++}`,
      title: 'When to Seek Help',
      lines: evidenceSnapshot.whenToSeekHelp.slice(0, 2),
      iconKey: 'stethoscope',
      emoji: '🩺',
      back: {
        lines: [
          'UK: Contact GP or NHS 111',
          'Speak to school SENCO (children)',
          'Self-refer to NHS Talking Therapies'
        ]
      }
    })
  }
  
  // Audience-specific card
  if (audience) {
    const audienceCard = generateAudienceCard(topic, audience, cardIdCounter)
    if (audienceCard) {
      cards.push(audienceCard)
      cardIdCounter++
    }
  }
  
  // Evidence card
  cards.push({
    id: `card-${cardIdCounter++}`,
    title: 'Evidence Base',
    lines: [
      'Guidance from NHS & NICE',
      'Peer-reviewed research',
      'Expert clinical consensus'
    ],
    iconKey: 'book',
    emoji: '📚',
    back: {
      title: 'Sources',
      lines: [
        'NHS.uk guidance',
        'NICE clinical guidelines',
        'PubMed research articles',
        'See full citations below'
      ]
    }
  })
  
  return cards.slice(0, 10) // Max 10 cards
}

function generateAudienceCard(topic: string, audience: AudienceType, cardNum: number): VisualLearningCard | null {
  const audienceCards: Record<AudienceType, Partial<VisualLearningCard>> = {
    parents: {
      title: 'For Parents',
      lines: [
        'You know your child best',
        'Seek support early',
        'Connect with other parents'
      ],
      iconKey: 'heart',
      emoji: '❤️',
      audienceTag: 'Parents',
      back: {
        lines: [
          'Speak to school SENCO',
          'Contact GP for assessment',
          'Join parent support groups',
          'Practice self-care too'
        ]
      }
    },
    young_people: {
      title: 'For Young People',
      lines: [
        'Your feelings are valid',
        'Asking for help is brave',
        'Small steps count'
      ],
      iconKey: 'sun',
      emoji: '🌟',
      audienceTag: 'Young people',
      back: {
        lines: [
          'Talk to a trusted adult',
          'School counselor can help',
          'Text SHOUT to 85258 (UK)',
          'You deserve support'
        ]
      }
    },
    teachers: {
      title: 'For Teachers',
      lines: [
        'Individual needs vary',
        'Small adjustments help',
        'Work with SENCO & parents'
      ],
      iconKey: 'school',
      emoji: '🎓',
      audienceTag: 'Teachers/SENCO',
      back: {
        lines: [
          'Provide visual supports',
          'Allow processing time',
          'Celebrate strengths',
          'Regular communication home'
        ]
      }
    },
    adults: {
      title: 'For Adults',
      lines: [
        'Late diagnosis is common',
        'Self-advocacy matters',
        'Support is available'
      ],
      iconKey: 'users',
      emoji: '👥',
      audienceTag: 'Adults',
      back: {
        lines: [
          'Contact GP for referral',
          'Join peer support groups',
          'Consider workplace adjustments',
          'You\'re not alone'
        ]
      }
    },
    workplace: {
      title: 'At Work',
      lines: [
        'Request adjustments',
        'Know your rights',
        'Speak to HR or OH'
      ],
      iconKey: 'briefcase',
      emoji: '💼',
      audienceTag: 'Workplace',
      back: {
        lines: [
          'Equality Act protects you (UK)',
          'Access to Work funding available',
          'Adjustments are reasonable',
          'Disclosure is your choice'
        ]
      }
    }
  }
  
  const cardData = audienceCards[audience]
  if (!cardData) return null
  
  return {
    id: `card-${cardNum}`,
    title: cardData.title || '',
    lines: cardData.lines || [],
    iconKey: cardData.iconKey || 'users',
    emoji: cardData.emoji,
    audienceTag: cardData.audienceTag,
    back: cardData.back
  }
}

