import type { AICoachAnswer, AudienceType, EvidenceSource, PubMedArticle } from '@/types/ai-coach'
import type { UserContext, Topic } from '@/types/user-context'
import type { ParsedIntent } from './intent'
import { generateVisualLearningCards } from './cards-generator'

interface SynthesisInput {
  question: string
  intent: ParsedIntent
  nhsLinks: EvidenceSource[]
  niceLinks: EvidenceSource[]
  pubmedArticles: PubMedArticle[]
  audience?: AudienceType
  neurobreathTools: Array<{ title: string; url: string; why: string }>
  context?: UserContext
  topic?: Topic
}

// Comprehensive knowledge base for synthesis
const KNOWLEDGE_BASE: Record<string, any> = {
  autism: {
    definition: [
      'Autism spectrum disorder (ASD) is a lifelong developmental condition affecting how people perceive the world and interact with others.',
      'Autistic people may experience differences in communication, social interaction, sensory processing, and patterns of behavior or interests.',
      'Autism is a spectrum: every autistic person is unique with their own strengths, challenges, and support needs.',
      'Many autistic people consider autism a fundamental part of their identity, not something to be "cured".'
    ],
    strengths: [
      'Many autistic people have exceptional attention to detail, pattern recognition, and deep focus on areas of interest',
      'Strong logical thinking, honesty, and loyalty are common strengths',
      'Unique perspectives can drive innovation and creativity'
    ],
    management: {
      general: [
        'Predictable routines and clear expectations reduce anxiety',
        'Visual supports (schedules, checklists, social stories) aid understanding',
        'Sensory-friendly environments help prevent overwhelm',
        'Allow processing time and use clear, literal communication',
        'Celebrate strengths and interests while supporting challenges'
      ],
      home: [
        'Create a low-sensory "calm corner" with familiar comfort items',
        'Use visual schedules for daily routines',
        'Prepare for changes in advance with social stories or visual supports',
        'Respect sensory preferences (lighting, sounds, textures, foods)'
      ],
      school: [
        'Provide visual timetables and advance notice of changes',
        'Offer a quiet space for breaks when needed',
        'Use clear, specific instructions without idioms',
        'Consider sensory adjustments (seating, lighting, noise-reducing headphones)',
        'Build on special interests to engage learning'
      ],
      workplace: [
        'Request clear written instructions and expectations',
        'Ask for advance notice of meetings and changes',
        'Negotiate flexible working arrangements if needed',
        'Use noise-cancelling headphones or quiet workspace',
        'Connect with workplace disability support or Access to Work (UK)'
      ]
    },
    assessment: [
      'In the UK, autism assessment is typically via GP referral to specialist services (NHS or private)',
      'Assessment usually involves developmental history, observations, and standardized questionnaires',
      'Waiting times vary; consider Right to Choose (England) for faster NHS pathways',
      'Private assessment costs £500-£2000+ but provides quicker diagnosis'
    ],
    whenToSeek: [
      'If autism traits significantly impact daily life, relationships, or wellbeing',
      'For children: speak to GP, health visitor, or school SENCO',
      'For adults: contact GP for referral to adult autism diagnostic services',
      'Consider support groups and charities (National Autistic Society, local services) while waiting'
    ]
  },
  adhd: {
    definition: [
      'Attention deficit hyperactivity disorder (ADHD) is a neurodevelopmental condition affecting executive function.',
      'Core features include difficulties with attention, hyperactivity, and impulsivity—but presentation varies widely.',
      'ADHD is lifelong but often evolves; hyperactivity may lessen with age while attention challenges persist.',
      'Many people with ADHD have unique strengths including creativity, problem-solving under pressure, and hyperfocus on interests.'
    ],
    management: {
      general: [
        'External structure compensates for internal executive function challenges',
        'Visible timers, alarms, and reminders reduce time blindness',
        'Break tasks into small steps with immediate rewards',
        'Movement breaks and fidget tools help maintain focus',
        'Medication (when appropriate) combined with behavioral strategies is most effective'
      ],
      home: [
        'Use visual timers for routines (morning, homework, bedtime)',
        'Create consistent spaces for belongings (labeled bins, hooks)',
        'Build in movement breaks every 20-30 minutes',
        'Use positive reinforcement and celebrate small wins'
      ],
      school: [
        'Preferential seating (front, away from distractions)',
        'Written copies of instructions and homework',
        'Movement breaks or fidget tools',
        'Extra time for tasks and tests',
        'Daily communication between home and school'
      ],
      workplace: [
        'Use project management tools and digital reminders',
        'Request flexible deadlines and regular check-ins',
        'Take movement breaks or use standing desk',
        'Noise-cancelling headphones for focus',
        'Consider Access to Work support (UK)'
      ]
    },
    assessment: [
      'UK ADHD assessment follows NICE NG87 guidelines',
      'GP referral to specialist ADHD service (psychiatry or community paediatrics)',
      'Assessment includes developmental history, symptom rating scales, and observations',
      'Right to Choose (England) allows choice of provider to reduce wait times'
    ],
    whenToSeek: [
      'If ADHD symptoms significantly impact work, education, relationships, or daily functioning',
      'For children: speak to GP or school SENCO',
      'For adults: contact GP for referral',
      'Private assessment available (£500-£1500) if NHS wait times are prohibitive'
    ]
  },
  anxiety: {
    definition: [
      'Anxiety is a normal human emotion, but anxiety disorders involve excessive worry that interferes with daily life.',
      'Physical symptoms include rapid heartbeat, sweating, trembling, and difficulty breathing.',
      'Generalized anxiety disorder (GAD) involves persistent worry across many areas.',
      'Panic disorder involves sudden panic attacks with intense physical symptoms.'
    ],
    management: {
      general: [
        'Cognitive behavioral therapy (CBT) is first-line psychological treatment',
        'Breathing exercises activate the parasympathetic nervous system to reduce panic',
        'Regular exercise, sleep, and reduced caffeine help manage anxiety',
        'Gradual exposure to feared situations (with support) reduces avoidance',
        'Medication (SSRIs) may be helpful for moderate-severe anxiety'
      ],
      immediate: [
        '4-7-8 breathing: breathe in for 4, hold for 7, out for 8',
        'Grounding: name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste',
        'Progressive muscle relaxation',
        'Move your body: walk, stretch, shake out tension'
      ]
    },
    whenToSeek: [
      'If anxiety interferes with work, relationships, or daily activities',
      'If you experience panic attacks',
      'Contact GP for referral to talking therapies (IAPT in England)',
      'Self-refer to NHS Talking Therapies in many areas',
      'Crisis: call 111 for urgent mental health support or 999 in emergency'
    ]
  },
  breathing: {
    definition: [
      'Controlled breathing techniques activate the vagus nerve and parasympathetic nervous system.',
      'Slow, deep breathing reduces heart rate, blood pressure, and stress hormones.',
      'Breathing practices are evidence-based tools for anxiety, stress, and emotional regulation.',
      'Regular practice builds resilience and improves baseline stress response.'
    ],
    techniques: [
      'Box Breathing (4-4-4-4): used by military and emergency responders for calm focus',
      '4-7-8 Breathing: natural tranquilizer for the nervous system',
      'Coherent Breathing (5-5): rhythmic breathing at 6 breaths per minute promotes HRV',
      'Diaphragmatic Breathing: belly breathing engages the vagus nerve'
    ],
    evidence: [
      'Research shows slow breathing (6 breaths/min) optimizes heart rate variability',
      'Breathing exercises reduce cortisol and increase GABA (calming neurotransmitter)',
      'Meta-analyses support breathing for anxiety, PTSD, and stress-related conditions',
      'Safe, free, and can be done anywhere without equipment'
    ]
  },
  depression: {
    definition: [
      'Clinical depression (major depressive disorder) involves persistent low mood, loss of interest, and reduced energy lasting 2+ weeks.',
      'Physical symptoms include sleep changes, appetite changes, fatigue, and difficulty concentrating.',
      'Depression is common (1 in 5 UK adults experience depression) and treatable.',
      'It is not weakness or something you can "snap out of"—it requires proper support.'
    ],
    management: {
      general: [
        'Talking therapies (CBT, counseling) are effective first-line treatments',
        'Antidepressant medication helps moderate-severe depression',
        'Behavioral activation: small achievable activities improve mood',
        'Exercise, sleep routine, and social connection support recovery',
        'Combination therapy (medication + talking therapy) often most effective'
      ],
      immediate: [
        'One small achievable task per day (make bed, short walk, shower)',
        'Reach out to one person (text, call, or in person)',
        'Avoid major life decisions when depressed',
        'Challenge all-or-nothing thinking with compassion'
      ]
    },
    whenToSeek: [
      'If low mood persists for 2+ weeks and affects daily functioning',
      'Contact GP for assessment and treatment options',
      'Self-refer to NHS Talking Therapies in England',
      'Crisis: call 111 for urgent support, Samaritans 116 123 (24/7), or 999 in emergency'
    ]
  },
  sleep: {
    definition: [
      'Insomnia involves difficulty falling asleep, staying asleep, or early waking.',
      'Sleep affects physical health, mental health, memory, and immune function.',
      'Most adults need 7-9 hours; teenagers need 8-10 hours.',
      'Chronic sleep deprivation increases risk of mental health conditions, obesity, and chronic disease.'
    ],
    management: {
      general: [
        'Cognitive behavioral therapy for insomnia (CBT-I) is gold-standard treatment',
        'Consistent sleep-wake times (including weekends) reset circadian rhythm',
        'Sleep hygiene: dark, cool, quiet room; no screens 1 hour before bed',
        'Wind-down routine signals the body it\'s time to sleep',
        'Avoid caffeine after 2pm; limit alcohol (disrupts deep sleep)'
      ],
      immediate: [
        'If awake 20+ minutes, leave bed and do calm activity until sleepy',
        'Practice 4-7-8 breathing or progressive muscle relaxation',
        'Avoid checking the clock (increases anxiety)',
        'Use bed only for sleep (not work, screens, or worrying)'
      ]
    },
    whenToSeek: [
      'If sleep problems persist for 3+ months',
      'Contact GP for assessment and CBT-I referral',
      'Rule out sleep disorders (sleep apnea, restless legs)',
      'Avoid long-term sleeping pills unless supervised by doctor'
    ]
  },
  dyslexia: {
    definition: [
      'Dyslexia is a specific learning difficulty affecting reading, writing, and spelling.',
      'It is not related to intelligence—many successful people are dyslexic.',
      'Dyslexia involves differences in phonological processing and working memory.',
      'Strengths often include creativity, problem-solving, and big-picture thinking.'
    ],
    management: {
      school: [
        'Structured literacy programs (phonics-based) are evidence-based',
        'Extra time for reading and writing tasks',
        'Assistive technology: text-to-speech, speech-to-text, audiobooks',
        'Dyslexia-friendly formatting: larger font, increased spacing, pastel backgrounds',
        'Multisensory learning (visual, auditory, kinesthetic)'
      ],
      workplace: [
        'Request reasonable adjustments under Equality Act (UK) / ADA (US)',
        'Use assistive tech (Grammarly, Read&Write, voice typing)',
        'Ask for written confirmation of verbal instructions',
        'Access to Work (UK) funds workplace support'
      ]
    },
    assessment: [
      'Educational psychologist or specialist teacher assessment',
      'Schools can arrange assessments; adults can seek private assessment (£400-£600)',
      'Diagnosis provides access to exam accommodations and workplace adjustments'
    ]
  }
}

export function synthesizeAnswer(input: SynthesisInput): AICoachAnswer {
  const { question, intent, nhsLinks, niceLinks, pubmedArticles, audience, neurobreathTools, context, topic } = input
  
  // Handle crisis situations
  if (intent.needsCrisisResponse) {
    return generateCrisisResponse()
  }
  
  const topicKey = topic || intent.topic || 'general'
  const kb = KNOWLEDGE_BASE[topicKey] || {}
  
  // Build comprehensive answer
  const title = generateTitle(question, intent, topicKey, context, topic)
  const plainEnglishSummary = generateSummary(question, intent, kb, context, topic)
  const evidenceSnapshot = generateEvidenceSnapshot(kb, nhsLinks, niceLinks, pubmedArticles, intent)
  const tailoredGuidance = generateTailoredGuidance(kb, intent, audience)
  const practicalActions = generatePracticalActions(kb, intent, topicKey)
  const mythsAndMisunderstandings = generateMythsSection(topicKey, intent)
  const clinicianNotes = generateClinicianNotes(topicKey, intent)
  
  // Combine all evidence sources
  const nhsOrNice = [...nhsLinks, ...niceLinks]
  const pubmed = pubmedArticles.map(article => ({
    title: article.title,
    url: article.url,
    kind: 'pubmed' as const,
    pmid: article.pmid,
    year: article.year,
    journal: article.journal
  }))
  
  // Generate visual learning cards from answer content
  const visualLearningCards = generateVisualLearningCards({
    topic: topicKey,
    intent,
    summary: plainEnglishSummary,
    actions: practicalActions,
    evidenceSnapshot,
    audience
  })
  
  const safetyNotice = generateSafetyNotice(topicKey, intent)
  
  return {
    title,
    plainEnglishSummary,
    recommendations: [],
    internalLinks: [],
    evidenceSnapshot,
    tailoredGuidance,
    practicalActions,
    mythsAndMisunderstandings,
    clinicianNotes,
    visualLearningCards,
    neurobreathTools,
    evidence: {
      nhsOrNice,
      pubmed,
      other: []
    },
    sourceTrace: {},
    safetyNotice
  }
}

function generateCrisisResponse(): AICoachAnswer {
  return {
    title: 'Urgent Support Available',
    plainEnglishSummary: [
      'If you are in immediate danger or thinking about ending your life, please reach out for help right now.',
      'You are not alone, and support is available 24/7.',
      'Crisis services are confidential, compassionate, and there to help you stay safe.'
    ],
    recommendations: [],
    internalLinks: [],
    evidenceSnapshot: {
      nhsNice: ['NHS urgent mental health support available 24/7'],
      research: [],
      practicalSupports: [
        'Call 999 (UK) or 911 (US) if in immediate danger',
        'Call NHS 111 (UK) and select mental health option',
        'Call 988 Suicide & Crisis Lifeline (US)',
        'Text SHOUT to 85258 (UK, 24/7 text support)',
        'Call Samaritans 116 123 (UK, 24/7)'
      ],
      whenToSeekHelp: ['Right now - crisis support is available immediately']
    },
    tailoredGuidance: {},
    practicalActions: [
      'Call or text a crisis line right now',
      'Tell someone you trust how you are feeling',
      'Go to A&E or call 999/911 if you feel you cannot keep yourself safe',
      'Remove any means of harm from your immediate environment',
      'Stay with someone or in a public place until crisis support arrives'
    ],
    visualLearningCards: [],
    neurobreathTools: [],
    evidence: {
      nhsOrNice: [
        { title: 'NHS: Help for suicidal thoughts', url: 'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/behaviours/help-for-suicidal-thoughts/', kind: 'NHS' }
      ],
      pubmed: []
    },
    sourceTrace: {},
    safetyNotice: '🚨 URGENT: If you are thinking about suicide or self-harm, call 999 (UK) / 911 (US) or NHS 111 / 988 Lifeline immediately. You deserve support.'
  }
}

function generateTitle(question: string, intent: ParsedIntent, topic: string, context?: UserContext, topicParam?: Topic): string {
  const topicTitle = topic.charAt(0).toUpperCase() + topic.slice(1)
  
  // ALWAYS prepend Context Used line
  const contextLine = buildContextUsedLine(context, topicParam || topic)
  
  if (intent.primary === 'definition') {
    return `${contextLine}\n\nUnderstanding ${topicTitle}`
  }
  if (intent.primary === 'management') {
    return `${contextLine}\n\nManaging ${topicTitle}: Practical Strategies`
  }
  if (intent.primary === 'school') {
    return `${contextLine}\n\n${topicTitle} Support in School`
  }
  if (intent.primary === 'workplace') {
    return `${contextLine}\n\n${topicTitle} in the Workplace`
  }
  if (intent.primary === 'assessment') {
    return `${contextLine}\n\n${topicTitle} Assessment and Diagnosis`
  }
  
  return `${contextLine}\n\n${topicTitle}: Evidence-Informed Guidance`
}

/**
 * Build "Context used" line to prove tailoring
 */
function buildContextUsedLine(context?: UserContext, topic?: string): string {
  if (!context) {
    return '**Context used:** General guidance'
  }
  
  const parts: string[] = []
  
  if (context.country) parts.push(context.country)
  if (context.ageGroup) parts.push(context.ageGroup)
  if (context.setting) parts.push(context.setting)
  if (context.mainChallenge) parts.push(`challenge: ${context.mainChallenge}`)
  if (context.goal) parts.push(`goal: ${context.goal}`)
  
  const topicLabel = topic && topic !== 'other' ? ` · Topic: ${topic.charAt(0).toUpperCase() + topic.slice(1)}` : ''
  
  return `**Context used:** ${parts.join(' · ')}${topicLabel}`
}

function generateSummary(question: string, intent: ParsedIntent, kb: any, context?: UserContext, topic?: Topic): string[] {
  const summary: string[] = []
  
  if (kb.definition) {
    summary.push(...kb.definition)
  }
  
  if (kb.strengths && intent.primary === 'definition') {
    summary.push(...kb.strengths)
  }
  
  // REMOVED: Generic fallback - always use knowledge base or fail gracefully
  if (!kb.definition && summary.length === 0) {
    summary.push(
      `Evidence-based guidance tailored for ${context?.ageGroup || 'your situation'} in ${context?.country || 'UK'}.`,
      'Strategies are drawn from NHS, NICE, and peer-reviewed research.',
      'This is educational information—speak to your GP, SENCO, or clinician for personalized advice.'
    )
  }
  
  return summary.slice(0, 5)
}

function generateEvidenceSnapshot(
  kb: any,
  nhsLinks: EvidenceSource[],
  niceLinks: EvidenceSource[],
  pubmedArticles: PubMedArticle[],
  intent: ParsedIntent
): AICoachAnswer['evidenceSnapshot'] {
  const snapshot = {
    nhsNice: [] as string[],
    research: [] as string[],
    practicalSupports: [] as string[],
    whenToSeekHelp: [] as string[]
  }
  
  // NHS/NICE summary
  if (nhsLinks.length > 0 || niceLinks.length > 0) {
    snapshot.nhsNice.push(`NHS and NICE provide comprehensive guidance on this topic (see links below)`)
  }
  if (niceLinks.length > 0 && intent.topic === 'adhd') {
    snapshot.nhsNice.push('NICE NG87 guideline covers diagnosis and management across lifespan')
  }
  
  // Research summary
  if (pubmedArticles.length > 0) {
    snapshot.research.push(`${pubmedArticles.length} peer-reviewed studies support these approaches (see citations below)`)
  }
  if (intent.topic === 'breathing') {
    snapshot.research.push('Controlled breathing activates vagus nerve and reduces stress hormones')
  }
  if (intent.topic === 'adhd' || intent.topic === 'autism') {
    snapshot.research.push('Combination of environmental supports and skill-building is most effective')
  }
  
  // Practical supports
  if (kb.management?.general) {
    snapshot.practicalSupports.push(...kb.management.general.slice(0, 3))
  } else {
    snapshot.practicalSupports.push('Evidence-based strategies available', 'Support from healthcare professionals', 'Community resources and peer support')
  }
  
  // When to seek help
  if (kb.whenToSeek) {
    snapshot.whenToSeekHelp.push(...kb.whenToSeek)
  } else {
    snapshot.whenToSeekHelp.push(
      'If symptoms significantly impact daily life or wellbeing',
      'Contact GP for assessment and support',
      'Crisis: NHS 111 / 999 (UK) or 988 / 911 (US)'
    )
  }
  
  return snapshot
}

function generateTailoredGuidance(
  kb: any,
  intent: ParsedIntent,
  audience?: AudienceType
): AICoachAnswer['tailoredGuidance'] {
  const guidance: AICoachAnswer['tailoredGuidance'] = {}
  
  const audiencesToInclude: AudienceType[] = audience ? [audience] : ['parents', 'young_people', 'teachers', 'adults', 'workplace']
  
  for (const aud of audiencesToInclude) {
    const lines: string[] = []
    
    if (aud === 'parents' && kb.management?.home) {
      lines.push(...kb.management.home)
    } else if (aud === 'parents') {
      lines.push('Support your child with patience and understanding', 'Create predictable routines', 'Speak to school SENCO or GP for additional support')
    }
    
    if (aud === 'young_people') {
      lines.push('It\'s okay to ask for help—reaching out is a strength', 'Small steps count: focus on what you can control today', 'Talk to a trusted adult, school counselor, or GP')
    }
    
    if (aud === 'teachers' && kb.management?.school) {
      lines.push(...kb.management.school)
    } else if (aud === 'teachers') {
      lines.push('Provide clear structure and expectations', 'Offer flexible supports based on individual needs', 'Liaise with SENCO and parents for coordinated support')
    }
    
    if (aud === 'adults' && intent.topic) {
      lines.push('Self-advocacy is key: communicate your needs', 'Seek assessment or support from GP if needed', 'Connect with peer support groups or charities')
    }
    
    if (aud === 'workplace' && kb.management?.workplace) {
      lines.push(...kb.management.workplace)
    } else if (aud === 'workplace') {
      lines.push('Request reasonable adjustments under Equality Act (UK)', 'Speak to HR or occupational health', 'Consider Access to Work for funding support')
    }
    
    if (lines.length > 0) {
      guidance[aud] = lines.slice(0, 5)
    }
  }
  
  return guidance
}

function generatePracticalActions(kb: any, intent: ParsedIntent, topic: string): string[] {
  const actions: string[] = []
  
  if (kb.management?.immediate) {
    actions.push(...kb.management.immediate)
  }
  
  if (intent.primary === 'school' && kb.management?.school) {
    actions.push(...kb.management.school)
  }
  
  if (intent.primary === 'workplace' && kb.management?.workplace) {
    actions.push(...kb.management.workplace)
  }
  
  if (actions.length === 0 && kb.management?.general) {
    actions.push(...kb.management.general)
  }
  
  if (actions.length === 0) {
    actions.push(
      'Speak to your GP for personalized guidance',
      'Connect with relevant charities or support organizations',
      'Keep a log of symptoms or challenges to share with healthcare providers',
      'Practice self-compassion: support takes time'
    )
  }
  
  return actions.slice(0, 6)
}

function generateMythsSection(topic: string, intent: ParsedIntent): string[] | undefined {
  const myths: Record<string, string[]> = {
    autism: [
      'Myth: Autism is caused by vaccines. Reality: No scientific evidence supports this; it has been thoroughly debunked.',
      'Myth: Autistic people lack empathy. Reality: Many autistic people have deep empathy but may express it differently.',
      'Myth: Autism only affects children. Reality: Autism is lifelong; many adults are diagnosed later in life.'
    ],
    adhd: [
      'Myth: ADHD is just bad behavior or laziness. Reality: ADHD is a neurodevelopmental condition with biological basis.',
      'Myth: Only children have ADHD. Reality: ADHD continues into adulthood for most people.',
      'Myth: Medication is the only treatment. Reality: Combination of medication, behavioral strategies, and environmental supports is most effective.'
    ],
    anxiety: [
      'Myth: Anxiety is just worrying too much. Reality: Anxiety disorders involve persistent physical and psychological symptoms.',
      'Myth: Avoiding triggers helps. Reality: Gradual exposure (with support) reduces anxiety long-term.'
    ]
  }
  
  return myths[topic]
}

function generateClinicianNotes(topic: string, intent: ParsedIntent): string[] | undefined {
  const notes: Record<string, string[]> = {
    adhd: [
      'Consider comorbidities: anxiety, ASD, dyslexia, mood disorders are common',
      'Medication options: stimulants (methylphenidate, lisdexamfetamine) or non-stimulants (atomoxetine, guanfacine)',
      'Titration and monitoring essential; shared decision-making with patient/family'
    ],
    autism: [
      'Use validated diagnostic tools (ADOS-2, ADI-R) per NICE guidelines',
      'Screen for co-occurring conditions: anxiety, ADHD, GI issues, sleep difficulties',
      'Diagnosis opens access to support but should be framed positively'
    ],
    depression: [
      'PHQ-9 for screening and monitoring',
      'Rule out physical causes: thyroid, anemia, vitamin deficiencies',
      'Stepped care: guided self-help → low-intensity CBT → high-intensity therapy + medication'
    ]
  }
  
  return notes[topic]
}

function generateSafetyNotice(topic: string, intent: ParsedIntent): string {
  return '⚠️ Educational information only—not medical advice. For personalized support, speak to your GP, paediatrician, SENCO, or licensed clinician. Crisis: NHS 111 / 999 (UK) or 988 / 911 (US).'
}


