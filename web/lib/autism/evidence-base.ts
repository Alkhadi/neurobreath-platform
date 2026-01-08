import type { EvidenceLink, Skill, Badge, CalmTechnique } from '@/types/autism'

// =============================================================================
// EVIDENCE BASE - UK/US/EU
// =============================================================================

export const EVIDENCE_LINKS = {
  // UK
  NICE_CG170: {
    type: 'NICE' as const,
    title: 'NICE CG170: Autism in under 19s - support and management',
    url: 'https://www.nice.org.uk/guidance/cg170',
    citation: 'NICE (2013, updated 2021). Autism spectrum disorder in under 19s: support and management. Clinical Guideline CG170.'
  },
  NICE_CG128: {
    type: 'NICE' as const,
    title: 'NICE CG128: Autism spectrum disorder - recognition, referral and diagnosis',
    url: 'https://www.nice.org.uk/guidance/cg128',
    citation: 'NICE (2011, updated 2024). Autism spectrum disorder in under 19s: recognition, referral and diagnosis. Clinical Guideline CG128.'
  },
  NICE_CG142: {
    type: 'NICE' as const,
    title: 'NICE CG142: Autism spectrum disorder in adults',
    url: 'https://www.nice.org.uk/guidance/cg142',
    citation: 'NICE (2012, updated 2021). Autism spectrum disorder in adults: diagnosis and management. Clinical Guideline CG142.'
  },
  GOV_PINS: {
    type: 'GOV' as const,
    title: 'GOV.UK: Partnerships for Inclusion of Neurodiversity in Schools (PINS)',
    url: 'https://www.gov.uk/government/publications/partnerships-for-inclusion-of-neurodiversity-in-schools-pins',
    citation: 'Department for Education (2024). PINS programme overview and outcomes.'
  },
  SEND_CODE: {
    type: 'GOV' as const,
    title: 'SEND Code of Practice: 0 to 25 years (Updated September 2024)',
    url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25',
    citation: 'DfE & DoH (2015, updated 2024). SEND Code of Practice: 0 to 25 years.'
  },
  EEF_SEND: {
    type: 'GOV' as const,
    title: 'EEF: Special Educational Needs in Mainstream Schools',
    url: 'https://d2tic4wvo1iusb.cloudfront.net/eef-guidance-reports/send/EEF_Special_Educational_Needs_in_Mainstream_Schools_Guidance_Report.pdf',
    citation: 'Education Endowment Foundation (2020). Special Educational Needs in Mainstream Schools: Guidance Report.'
  },
  AET: {
    type: 'Other' as const,
    title: 'Autism Education Trust: Good Autism Practice',
    url: 'https://www.autismeducationtrust.org.uk/',
    citation: 'Autism Education Trust. Good Autism Practice training modules and practitioner guides.'
  },
  NHS_AUTISM: {
    type: 'NHS' as const,
    title: 'NHS: Autism spectrum disorder (ASD)',
    url: 'https://www.nhsinform.scot/illnesses-and-conditions/brain-nerves-and-spinal-cord/autistic-spectrum-disorder-asd',
    citation: 'NHS Inform. Autism spectrum disorder (ASD): Overview and support.'
  },

  // US
  CDC_DATA: {
    type: 'CDC' as const,
    title: 'CDC: Autism Spectrum Disorder Data & Statistics',
    url: 'https://www.cdc.gov/autism/data-research/index.html',
    citation: 'CDC (2024). Autism Spectrum Disorder: Data and Statistics.'
  },
  CDC_PREVALENCE: {
    type: 'CDC' as const,
    title: 'CDC MMWR: Prevalence and Characteristics of Autism',
    url: 'https://www.cdc.gov/mmwr/volumes/72/ss/ss7202a1.htm',
    citation: 'CDC (2023). Prevalence and Characteristics of Autism Spectrum Disorder Among Children Aged 8 Years — ADDM Network.'
  },
  AUTISM_SOCIETY: {
    type: 'Other' as const,
    title: 'Autism Society: Resources and Support',
    url: 'https://autismsociety.org/',
    citation: 'Autism Society of America. National resources and advocacy.'
  },

  // EU
  AUTISM_EUROPE: {
    type: 'Other' as const,
    title: 'Autism-Europe: Rights and Resources',
    url: 'https://www.autismeurope.org/',
    citation: 'Autism-Europe. Pan-European advocacy and support resources.'
  },
  EASNIE: {
    type: 'Other' as const,
    title: 'European Agency for Special Needs and Inclusive Education',
    url: 'https://www.european-agency.org/',
    citation: 'European Agency for Special Needs and Inclusive Education. Resources for inclusive practice.'
  }
}

// PubMed Evidence - Pre-selected high-quality articles
export const PUBMED_PRESETS = [
  {
    query: 'autism visual supports visual schedules intervention',
    label: 'Visual Supports & Schedules',
    pmids: ['33298290', '28948102'] // Example PMIDs
  },
  {
    query: 'PECS picture exchange communication autism',
    label: 'PECS & AAC',
    pmids: ['27576244', '23575165']
  },
  {
    query: 'peer mediated intervention autism school',
    label: 'Peer-Mediated Interventions',
    pmids: ['32652683']
  },
  {
    query: 'anxiety autism children cognitive behavioral therapy',
    label: 'Anxiety Treatments in Autism',
    pmids: ['38006659']
  },
  {
    query: 'school based inclusion autism intervention',
    label: 'School Inclusion Interventions',
    pmids: ['35464746']
  }
]

// =============================================================================
// SKILLS LIBRARY
// =============================================================================

export const SKILLS: Skill[] = [
  // Visual Supports
  {
    id: 'visual-schedule',
    title: 'Visual Schedules',
    category: 'Visual Supports',
    tags: ['routines', 'transitions', 'predictability'],
    whyItHelps: 'Reduces anxiety by making the day predictable and supports executive function.',
    howToSteps: [
      'Choose format: photos, symbols (Widgit/PCS), or written words based on age/preference',
      'Start with 3–5 key daily events (morning arrival, break, lunch, home time)',
      'Display at eye level; review together at start of day',
      'Use a "finished" box or turn-over system for completed activities',
      'Gradually increase detail as child becomes comfortable'
    ],
    pitfalls: [
      'Too many items at once can overwhelm—start simple',
      'Forgetting to update when plans change (always warn first)',
      'Using abstract symbols without teaching what they mean'
    ],
    adaptations: {
      'early-years': 'Use real photos or objects. Keep to 3 steps maximum.',
      primary: 'Widgit symbols or simple drawings. 5–7 steps.',
      secondary: 'Written schedule with icons. Can include timings.',
      adult: 'Digital calendars or bullet journal format with reminders.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG170, EVIDENCE_LINKS.AET],
    audience: ['teacher', 'parent']
  },
  {
    id: 'now-next',
    title: 'Now/Next Boards',
    category: 'Visual Supports',
    tags: ['transitions', 'communication'],
    whyItHelps: 'Provides immediate clarity about current and upcoming activity, reducing transition anxiety.',
    howToSteps: [
      'Create a two-column board: "Now" and "Next"',
      'Use symbols or photos that match your visual schedule',
      'Before transitions, place current task in "Now" and upcoming in "Next"',
      'Give 2-minute warning: "Now: reading. Next: break time."',
      'Move symbol to "finished" after completion'
    ],
    pitfalls: [
      'Not giving warning time before transition',
      'Changing "Next" without explanation'
    ],
    adaptations: {
      'early-years': 'Two large picture cards.',
      primary: 'Velcro board with symbols.',
      secondary: 'Small desk card or digital version.',
      adult: 'Checklist or app notification.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG170],
    audience: ['teacher', 'parent']
  },

  // Communication
  {
    id: 'pecs-aac',
    title: 'PECS & AAC Tools',
    category: 'Communication',
    tags: ['communication', 'AAC', 'PECS'],
    whyItHelps: 'Supports expressive communication, reduces frustration, builds language skills.',
    howToSteps: [
      'Start with PECS Phase 1: exchange single picture for desired item',
      'Use core board with high-frequency words (more, help, stop, go, finish)',
      'Model AAC yourself: point to symbols as you speak',
      'Respond immediately to communication attempts',
      'Gradually expand vocabulary based on child\'s interests'
    ],
    pitfalls: [
      'Only using AAC as "last resort"—model it from the start',
      'Not having AAC available in all settings',
      'Waiting for speech—AAC supports spoken language development'
    ],
    adaptations: {
      'early-years': 'PECS book with motivating items. 10–20 symbols.',
      primary: 'Core board + PECS. Introduce simple apps.',
      secondary: 'Full AAC app (Proloquo2Go, TouchChat).',
      adult: 'Text-to-speech apps or low-tech flip books.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG170],
    audience: ['teacher', 'parent']
  },

  // Sensory
  {
    id: 'calm-corner',
    title: 'Calm Corner / Sensory Space',
    category: 'Sensory',
    tags: ['sensory', 'regulation', 'calm'],
    whyItHelps: 'Provides a safe, low-stimulation retreat for regulation before overwhelm escalates.',
    howToSteps: [
      'Choose quiet corner away from main activity and bright lights',
      'Include: cushions, weighted blanket/lap pad, fidgets, noise-cancelling headphones',
      'Add calming visuals: lava lamp, fiber optics, or simple nature poster',
      'Teach when/how to use: "If you feel wobbly, you can go to the calm corner"',
      'Not a punishment—frame as self-care tool'
    ],
    pitfalls: [
      'Using it as "time-out" punishment',
      'Too many stimulating items (keep it simple)',
      'Blocking access when child needs it most'
    ],
    adaptations: {
      'early-years': 'Soft tent or under-table nook. Supervised access.',
      primary: 'Corner with bean bag. Visual "calm menu" of strategies.',
      secondary: 'Quiet room pass system. Student-led.',
      adult: 'Designated break room or outdoor space.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG170, EVIDENCE_LINKS.EEF_SEND],
    audience: ['teacher', 'parent', 'employer']
  },

  // Transitions
  {
    id: 'transition-warnings',
    title: 'Transition Warnings & Timers',
    category: 'Transitions',
    tags: ['transitions', 'routines', 'predictability'],
    whyItHelps: 'Reduces anxiety caused by sudden changes; allows mental preparation.',
    howToSteps: [
      'Give 5-minute warning: "In 5 minutes, we finish this and go to lunch"',
      'Use visual timer (Time Timer) so time is concrete',
      'Give 2-minute follow-up',
      'At transition: "It\'s time now. First shoes, then outside"',
      'Praise cooperation: "You finished the task and got ready—great listening"'
    ],
    pitfalls: [
      'Giving warning but not following through on time',
      'Only verbal warnings (add visual)',
      'Expecting instant transitions without warning'
    ],
    adaptations: {
      'early-years': 'Visual timer + song cue.',
      primary: 'Time Timer + verbal script.',
      secondary: 'Phone timer or watch reminder.',
      adult: 'Calendar alerts + buffer time.'
    },
    evidenceLinks: [EVIDENCE_LINKS.AET],
    audience: ['teacher', 'parent']
  },

  // Social
  {
    id: 'structured-peer-time',
    title: 'Structured Peer Interactions',
    category: 'Social',
    tags: ['social', 'peer-mediated', 'inclusion'],
    whyItHelps: 'Builds social skills in a supported, predictable context with clear roles.',
    howToSteps: [
      'Pair autistic child with trained peer buddy',
      'Choose structured activity: board game, building task, shared art project',
      'Teach peer how to initiate, wait, and offer choices',
      'Supervise initially; fade as skills develop',
      'Rotate buddies to build wider friendships'
    ],
    pitfalls: [
      'Expecting unstructured play without scaffolding',
      'Not training peer buddy',
      'Forcing interaction when child is dysregulated'
    ],
    adaptations: {
      'early-years': 'Parallel play with adult narration.',
      primary: 'Buddy system with structured turn-taking games.',
      secondary: 'Interest-based clubs (LEGO, coding, art).',
      adult: 'Work teams with clear roles; social scripts for meetings.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG170],
    audience: ['teacher', 'parent', 'employer']
  },

  // Anxiety Management
  {
    id: 'calm-breathing',
    title: 'Calm Breathing Techniques',
    category: 'Anxiety',
    tags: ['anxiety', 'regulation', 'breathing'],
    whyItHelps: 'Activates parasympathetic nervous system; reduces fight-or-flight response.',
    howToSteps: [
      'Introduce when calm, not during crisis',
      'Start with simple belly breathing: hand on belly, feel it rise',
      'Add count: in for 4, out for 4 (or 5 out if comfortable)',
      'Use visual cue: trace square or watch bubble animation',
      'Practice 1 minute daily; use proactively before known stressors'
    ],
    pitfalls: [
      'Introducing during meltdown (teach in calm)',
      'Forcing long holds if child dislikes them',
      'Expecting instant calm—needs regular practice'
    ],
    adaptations: {
      'early-years': 'Blow bubbles or feathers.',
      primary: 'Box breathing with hand tracing.',
      secondary: 'App-guided (Calm, Headspace).',
      adult: 'Self-paced coherent breathing or 4-7-8.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG170, EVIDENCE_LINKS.NHS_AUTISM],
    audience: ['teacher', 'parent', 'autistic']
  },

  // Workplace
  {
    id: 'workplace-adjustments',
    title: 'Reasonable Workplace Adjustments',
    category: 'Workplace',
    tags: ['workplace', 'adjustments', 'employment'],
    whyItHelps: 'Removes barriers, enabling autistic employees to demonstrate their strengths.',
    howToSteps: [
      'Request Access to Work assessment (UK) or ADA accommodations (US)',
      'Consider: noise-cancelling headphones, flexible hours, written instructions, quiet workspace',
      'Agree communication preferences: email vs. phone, advance notice for meetings',
      'Provide clear job descriptions and expectations',
      'Regular check-ins with manager; adjust as needed'
    ],
    pitfalls: [
      'Assuming all autistic people need same adjustments',
      'Not documenting agreed adjustments',
      'Treating adjustments as "special treatment" rather than leveling the field'
    ],
    adaptations: {
      'early-years': 'N/A',
      primary: 'N/A',
      secondary: 'Transition planning from Year 9; work experience with support.',
      adult: 'Full workplace adjustments as above.'
    },
    evidenceLinks: [EVIDENCE_LINKS.NICE_CG142, EVIDENCE_LINKS.AUTISM_SOCIETY],
    audience: ['employer', 'autistic']
  }
]

// =============================================================================
// BADGES
// =============================================================================

export const BADGES: Badge[] = [
  {
    id: 'first-calm',
    title: 'First Calm Minute',
    description: 'Completed your first breathing session',
    icon: '🌬️',
    criteria: 'Log 1 breathing session'
  },
  {
    id: 'streak-3',
    title: '3-Day Streak',
    description: 'Practiced 3 days in a row',
    icon: '🔥',
    criteria: '3-day streak'
  },
  {
    id: 'visual-starter',
    title: 'Visual Supports Starter',
    description: 'Practiced visual schedule or Now/Next',
    icon: '📋',
    criteria: 'Log visual supports skill practice'
  },
  {
    id: 'transition-pro',
    title: 'Transition Pro',
    description: 'Used transition warnings 5 times',
    icon: '⏰',
    criteria: 'Log transition skill 5 times'
  },
  {
    id: 'sensory-planner',
    title: 'Sensory Planner',
    description: 'Set up or used a calm corner',
    icon: '🛋️',
    criteria: 'Log sensory skill practice'
  },
  {
    id: 'communication-supporter',
    title: 'Communication Supporter',
    description: 'Used AAC or PECS',
    icon: '💬',
    criteria: 'Log communication skill practice'
  },
  {
    id: 'inclusive-classroom',
    title: 'Inclusive Classroom Builder',
    description: 'Implemented structured peer activity',
    icon: '🤝',
    criteria: 'Log social skill practice'
  },
  {
    id: 'workplace-ally',
    title: 'Workplace Ally',
    description: 'Implemented workplace adjustments',
    icon: '💼',
    criteria: 'Log workplace skill practice'
  },
  {
    id: 'plan-complete',
    title: 'Plan Completer',
    description: 'Finished a Today\'s Plan',
    icon: '✅',
    criteria: 'Complete 1 plan'
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Practiced every day for a week',
    icon: '⭐',
    criteria: '7-day streak'
  }
]

// =============================================================================
// CALM TECHNIQUES
// =============================================================================

export const CALM_TECHNIQUES: CalmTechnique[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing (4-4-4-4)',
    duration: 2,
    description: 'Equal breathing pattern: inhale 4, hold 4, exhale 4, hold 4',
    ageAdaptations: 'Early years: 2-2-2-2. Primary: 3-3-3-3 or 4-4-4-4. Secondary+: full 4-4-4-4.',
    warnings: ['Stop if dizzy', 'Avoid if breath-holding causes anxiety', 'Not during intense physical activity'],
    steps: [
      'Sit comfortably',
      'Breathe in through nose for 4 counts',
      'Hold breath gently for 4 counts',
      'Breathe out through mouth for 4 counts',
      'Hold empty for 4 counts',
      'Repeat 4-5 cycles'
    ]
  },
  {
    id: 'coherent-5-5',
    name: 'Coherent Breathing (5-5)',
    duration: 3,
    description: 'Gentle paced breathing: 5 seconds in, 5 seconds out',
    ageAdaptations: 'Primary+: Start with 4-4, progress to 5-5. Use visual wave or metronome.',
    warnings: ['Stop if uncomfortable', 'No forced holds'],
    steps: [
      'Sit or lie comfortably',
      'Breathe in slowly for 5 counts',
      'Breathe out slowly for 5 counts',
      'Continue for 2-3 minutes',
      'No holds—continuous gentle rhythm'
    ]
  },
  {
    id: 'sos-60',
    name: 'SOS 60-Second Reset',
    duration: 1,
    description: 'Quick grounding: longer exhale with sensory check',
    ageAdaptations: 'All ages. Use concrete language: "breathe out like blowing bubbles".',
    warnings: ['Not a substitute for crisis intervention', 'Use proactively'],
    steps: [
      'Stop and notice your feet on the ground',
      'Breathe in for 4',
      'Breathe out slowly for 6',
      'Look around: name 3 things you can see',
      'Repeat breath 3 times',
      'Notice: do you feel a bit calmer?'
    ]
  },
  {
    id: 'belly-breathing',
    name: 'Belly Breathing (No Holds)',
    duration: 2,
    description: 'Simple diaphragmatic breathing—no holds, good for beginners',
    ageAdaptations: 'All ages. Use stuffed animal on belly for children.',
    warnings: ['Gentlest option', 'Stop if any discomfort'],
    steps: [
      'Lie down or sit comfortably',
      'Place hand on belly',
      'Breathe in slowly through nose—feel belly rise',
      'Breathe out slowly through mouth—feel belly fall',
      'Keep breathing smooth and gentle',
      'Continue for 1-2 minutes'
    ]
  }
]

// =============================================================================
// MYTHS & FACTS
// =============================================================================

export const MYTHS_FACTS = [
  {
    myth: 'Vaccines cause autism',
    fact: 'No. Extensive research has conclusively shown that vaccines do NOT cause autism. The original study claiming a link was fraudulent and has been retracted.',
    sources: [EVIDENCE_LINKS.CDC_DATA, EVIDENCE_LINKS.NHS_AUTISM]
  },
  {
    myth: 'Autistic people lack empathy',
    fact: 'False. Autistic people experience empathy but may express or process it differently. Many report feeling emotions intensely.',
    sources: [EVIDENCE_LINKS.NICE_CG142]
  },
  {
    myth: 'Autism is caused by bad parenting',
    fact: 'Absolutely not. Autism is a neurodevelopmental difference with genetic and neurological origins. Parenting does not cause autism.',
    sources: [EVIDENCE_LINKS.NICE_CG128, EVIDENCE_LINKS.CDC_DATA]
  },
  {
    myth: 'Everyone is "a little bit autistic"',
    fact: 'No. While some traits are common, autism is a specific developmental profile that significantly impacts daily life and requires support.',
    sources: [EVIDENCE_LINKS.NICE_CG128]
  },
  {
    myth: 'Autistic people can\'t work or live independently',
    fact: 'False. With the right support and adjustments, many autistic adults work, live independently, and have fulfilling lives. Support needs vary widely.',
    sources: [EVIDENCE_LINKS.NICE_CG142, EVIDENCE_LINKS.AUTISM_SOCIETY]
  }
]

