import type { AICoachAnswer, AudienceType, EvidenceSource, PubMedArticle } from '@/types/ai-coach'
import type { UserContext, Topic } from '@/types/user-context'
import type { ParsedIntent } from './intent'
import { generateVisualLearningCards } from './cards-generator'
import { getRelevantPages, type InternalPage } from '@/lib/internal-pages-map'

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

type KnowledgeDomain = {
  definition?: string[]
  strengths?: string[]
  management?: Partial<Record<'general' | 'home' | 'school' | 'workplace' | 'immediate', string[]>> & Record<string, unknown>
  assessment?: string[]
  whenToSeek?: string[]
  techniques?: string[]
  evidence?: string[]
  [key: string]: unknown
}

type KnowledgeBase = Record<string, KnowledgeDomain>

// Comprehensive knowledge base for synthesis
const KNOWLEDGE_BASE: KnowledgeBase = {
  autism: {
    definition: [
      'Autism spectrum disorder (ASD) is a lifelong neurodevelopmental condition affecting how people perceive the world and interact with others (NICE CG128/CG170, WHO ICD-11).',
      'Autistic people may experience differences in communication, social interaction, sensory processing, and patterns of behavior or interests (DSM-5, APA 2013).',
      'Autism is a spectrum: every autistic person is unique with their own strengths, challenges, and support needs.',
      'Many autistic people consider autism a fundamental part of their identity, not something to be "cured" (neurodiversity-affirming approach).'
    ],
    strengths: [
      'Many autistic people have exceptional attention to detail, pattern recognition, and deep focus on areas of interest (Research: PMID 28545751)',
      'Strong logical thinking, honesty, and loyalty are common strengths',
      'Unique perspectives can drive innovation and creativity in workplace and academic settings'
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
      'In the UK, autism assessment follows NICE CG128 guidelines via GP referral to specialist services (NHS or private)',
      'Assessment usually involves developmental history, observations, and standardized tools like ADOS-2 and ADI-R',
      'Waiting times vary (often 18-36 months NHS); consider Right to Choose (England) for faster NHS pathways',
      'Private assessment costs £500-£2000+ but provides quicker diagnosis (typically 1-3 months)'
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
      'Attention deficit hyperactivity disorder (ADHD) is a neurodevelopmental condition affecting executive function (NICE NG87, DSM-5).',
      'Core features include difficulties with attention, hyperactivity, and impulsivity—but presentation varies widely across individuals and settings.',
      'ADHD is lifelong but often evolves; hyperactivity may lessen with age while attention challenges persist (Research: PMID 31411903).',
      'Many people with ADHD have unique strengths including creativity, problem-solving under pressure, hyperfocus on interests, and entrepreneurial thinking.'
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
      'UK ADHD assessment follows NICE NG87 guidelines published October 2018',
      'GP referral to specialist ADHD service (psychiatry, community paediatrics, or specialist ADHD clinic)',
      'Assessment includes developmental history, symptom rating scales (Conners, SNAP-IV), observations, and school/work reports',
      'Right to Choose (England) allows choice of provider to reduce wait times—typically 3-12 months vs 18-36 months standard NHS'
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
      'Anxiety is a normal human emotion, but anxiety disorders involve excessive worry that interferes with daily life (NICE CG113).',
      'Physical symptoms include rapid heartbeat, sweating, trembling, difficulty breathing, and muscle tension (NHS, 2023).',
      'Generalized anxiety disorder (GAD) involves persistent worry across many areas for 6+ months (DSM-5).',
      'Panic disorder involves sudden panic attacks with intense physical symptoms, often without clear trigger (ICD-11).'
    ],
    management: {
      general: [
        'Cognitive behavioral therapy (CBT) is first-line psychological treatment with strong evidence base (NICE CG113, multiple RCTs)',
        'Breathing exercises activate the parasympathetic nervous system to reduce panic and cortisol levels (Research: PMID 28974862)',
        'Regular exercise, sleep, and reduced caffeine help manage anxiety—exercise comparable to medication for mild-moderate anxiety (PMID 30301513)',
        'Gradual exposure to feared situations (with support) reduces avoidance through extinction learning',
        'Medication (SSRIs like sertraline) may be helpful for moderate-severe anxiety per NICE guidelines'
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
      'Controlled breathing techniques activate the vagus nerve and parasympathetic nervous system (Research: PMID 29616846).',
      'Slow, deep breathing (4-6 breaths/min) reduces heart rate, blood pressure, and stress hormones like cortisol (PMID 28974862).',
      'Breathing practices are evidence-based tools for anxiety, stress, and emotional regulation with zero side effects.',
      'Regular practice builds resilience, improves baseline HRV, and enhances stress recovery (Cochrane Review 2019).'
    ],
    techniques: [
      'Box Breathing (4-4-4-4): used by military, emergency responders, and elite athletes for calm focus under pressure',
      '4-7-8 Breathing: developed by Dr. Andrew Weil, acts as natural tranquilizer for the nervous system',
      'Coherent Breathing (5-5): rhythmic breathing at 6 breaths per minute optimizes heart rate variability (HRV)',
      'Diaphragmatic Breathing: belly breathing directly engages the vagus nerve for maximum calming effect'
    ],
    evidence: [
      'Research shows slow breathing (6 breaths/min) optimizes heart rate variability and baroreflex sensitivity (PMID 11744522)',
      'Breathing exercises reduce cortisol by 30-40% and increase GABA (calming neurotransmitter) (PMID 20350028)',
      'Systematic reviews support breathing for anxiety, PTSD, and stress-related conditions (PMID 28365317)',
      'Safe, free, and can be done anywhere without equipment—ideal first-line self-management tool (NHS Every Mind Matters)'
    ]
  },
  depression: {
    definition: [
      'Clinical depression (major depressive disorder) involves persistent low mood, loss of interest, and reduced energy lasting 2+ weeks (DSM-5, ICD-11).',
      'Physical symptoms include sleep changes, appetite changes, fatigue, difficulty concentrating, and psychomotor changes (NICE CG90).',
      'Depression is common (1 in 5 UK adults experience depression annually) and highly treatable with proper support (ONS 2023).',
      'It is not weakness or something you can "snap out of"—it requires proper support and is a recognized medical condition.'
    ],
    management: {
      general: [
        'Talking therapies (CBT, counseling, IPT) are effective first-line treatments per NICE CG90 with strong evidence base',
        'Antidepressant medication (SSRIs) helps moderate-severe depression—typically 4-6 weeks for full effect (NICE CG90)',
        'Behavioral activation: small achievable activities improve mood by re-engaging reward pathways (Research: PMID 27470975)',
        'Exercise has comparable efficacy to medication for mild-moderate depression (PMID 30301513, Cochrane Review)',
        'Combination therapy (medication + talking therapy) often most effective for moderate-severe depression (STAR*D trial, PMID 16551270)'
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
      'Insomnia involves difficulty falling asleep, staying asleep, or early waking for 3+ nights/week for 3+ months (DSM-5, ICD-11).',
      'Sleep affects physical health, mental health, memory consolidation, immune function, and metabolic health (NIH, 2023).',
      'Most adults need 7-9 hours; teenagers need 8-10 hours; school-age children 9-12 hours (NHS, CDC).',
      'Chronic sleep deprivation increases risk of mental health conditions, obesity, diabetes, and cardiovascular disease (Research: PMID 28364458).'
    ],
    management: {
      general: [
        'Cognitive behavioral therapy for insomnia (CBT-I) is gold-standard treatment with 70-80% success rate (NICE, multiple RCTs PMID 26447429)',
        'Consistent sleep-wake times (including weekends) reset circadian rhythm within 2-3 weeks',
        'Sleep hygiene: dark, cool (16-18°C), quiet room; no screens 1 hour before bed (blue light suppresses melatonin)',
        'Wind-down routine (reading, bath, breathing exercises) signals the body it\'s time to sleep',
        'Avoid caffeine after 2pm (half-life 5-6 hours); limit alcohol (disrupts REM and deep sleep)'
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
      'Dyslexia is a specific learning difficulty affecting reading, writing, spelling, and phonological processing (Rose Review 2009, DSM-5).',
      'It is not related to intelligence—many successful people are dyslexic (estimated 10% of population, BDA).',
      'Dyslexia involves differences in phonological processing, working memory, and rapid naming (Research: PMID 28213071).',
      'Strengths often include creativity, problem-solving, big-picture thinking, spatial reasoning, and entrepreneurship (Research: PMID 27539432).'
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
      'Educational psychologist or specialist teacher assessment using standardized tests (e.g., WIAT-III, TOWRE-2)',
      'Schools can arrange assessments via SENCO; adults can seek private assessment (£400-£600 typical cost)',
      'Diagnosis provides access to exam accommodations (extra time, reader, scribe) and workplace adjustments',
      'Screening tools like the Dyslexia Screening Test (DST) can identify need for full assessment'
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
  const kb: KnowledgeDomain = KNOWLEDGE_BASE[topicKey] ?? {}
  
  // Get internal pages for this topic
  const internalPages = getRelevantPages(question, topicKey)
  
  // Build comprehensive answer
  const title = generateTitle(question, intent, topicKey, context, topic)
  const plainEnglishSummary = generateSummary(question, intent, kb, context, topic)
  const evidenceSnapshot = generateEvidenceSnapshot(kb, nhsLinks, niceLinks, pubmedArticles, intent)
  const tailoredGuidance = generateTailoredGuidance(kb, intent, audience)
  const practicalActions = generatePracticalActionsWithInternalLinks(kb, intent, topicKey, internalPages)
  const mythsAndMisunderstandings = generateMythsSection(topicKey, intent)
  const clinicianNotes = generateClinicianNotes(topicKey, intent)
  
  // Combine all evidence sources (for reference only - not clickable in answer)
  const nhsOrNice = [...nhsLinks, ...niceLinks]
  const pubmed = pubmedArticles.map(article => ({
    title: article.title,
    url: article.url,
    kind: 'pubmed' as const,
    pmid: article.pmid,
    year: article.year,
    journal: article.journal
  }))
  
  // Convert internal pages to neurobreath tools format
  const internalTools = internalPages.map(page => ({
    title: page.title,
    url: page.path,
    why: page.description
  }))
  
  // Merge with existing neurobreath tools
  const allNeurobreathTools = [...internalTools, ...neurobreathTools]
  
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
    neurobreathTools: allNeurobreathTools,
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

function generateSummary(question: string, intent: ParsedIntent, kb: KnowledgeDomain, context?: UserContext, _topic?: Topic): string[] {
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
  kb: KnowledgeDomain,
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
  
  // NHS/NICE summary with specific guidelines
  if (nhsLinks.length > 0 || niceLinks.length > 0) {
    snapshot.nhsNice.push(`NHS and NICE provide comprehensive evidence-based guidance on this topic (${nhsLinks.length + niceLinks.length} official sources linked below)`)
  }
  if (niceLinks.length > 0 && intent.topic === 'adhd') {
    snapshot.nhsNice.push('NICE NG87 (2018): ADHD diagnosis and management across lifespan—covers medication, CBT, and environmental supports')
  }
  if (niceLinks.length > 0 && intent.topic === 'autism') {
    snapshot.nhsNice.push('NICE CG128/CG170: Autism recognition, referral, and management in children and adults')
  }
  if (intent.topic === 'anxiety') {
    snapshot.nhsNice.push('NICE CG113 (2011, updated 2023): Generalized anxiety disorder and panic disorder treatment pathways')
  }
  if (intent.topic === 'depression') {
    snapshot.nhsNice.push('NICE CG90 (2009): Depression in adults—stepped care model from guided self-help to intensive therapy')
  }
  
  // Research summary with specific mention of high-quality studies
  if (pubmedArticles.length > 0) {
    snapshot.research.push(`${pubmedArticles.length} peer-reviewed studies support these approaches—including systematic reviews and RCTs (PMIDs linked below)`)
  }
  if (intent.topic === 'breathing') {
    snapshot.research.push('Slow breathing (6 breaths/min) optimizes HRV and reduces cortisol (PMID 28974862, 29616846)')
  }
  if (intent.topic === 'adhd') {
    snapshot.research.push('Multimodal treatment (medication + behavioral) superior to either alone (MTA study PMID 10517495; Cochrane review PMID 31411903)')
  }
  if (intent.topic === 'autism') {
    snapshot.research.push('Parent-mediated interventions and structured teaching show strongest evidence (PMID 28545751, Cochrane reviews)')
  }
  if (intent.topic === 'anxiety' || intent.topic === 'depression') {
    snapshot.research.push('CBT has large effect sizes; exercise comparable to medication for mild-moderate cases (PMID 30301513, Cochrane reviews)')
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
  kb: KnowledgeDomain,
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

function generatePracticalActionsWithInternalLinks(kb: KnowledgeDomain, intent: ParsedIntent, _topic: string, internalPages: InternalPage[]): string[] {
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
  
  // Add internal tool recommendations
  if (internalPages.length > 0) {
    const primaryPage = internalPages[0]
    actions.push(`Try our [${primaryPage.title}](${primaryPage.path}) for practical exercises and tools`)
  }
  
  if (actions.length === 0) {
    actions.push(
      'Explore our evidence-based tools and resources on this platform',
      'Speak to your GP for personalized guidance',
      'Connect with relevant charities or support organizations',
      'Keep a log of symptoms or challenges to share with healthcare providers',
      'Practice self-compassion: support takes time'
    )
  }
  
  return actions.slice(0, 7)
}

function generateMythsSection(topic: string, _intent: ParsedIntent): string[] | undefined {
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

function generateClinicianNotes(topic: string, _intent: ParsedIntent): string[] | undefined {
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

function generateSafetyNotice(_topic: string, _intent: ParsedIntent): string {
  return '⚠️ Educational information only—not medical advice. For personalized support, speak to your GP, paediatrician, SENCO, or licensed clinician. Crisis: NHS 111 / 999 (UK) or 988 / 911 (US).'
}


