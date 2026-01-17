import type { Region } from '@/lib/region/region';

export type PrintableAudience = 'parent-carer' | 'teacher' | 'workplace' | 'individual';
export type PrintableType =
  | 'checklist'
  | 'template'
  | 'worksheet'
  | 'plan'
  | 'prompt-card'
  | 'classroom-resource'
  | 'workplace-resource';
export type SupportNeedTag =
  | 'sleep'
  | 'focus'
  | 'sensory'
  | 'routines'
  | 'reading'
  | 'emotional-regulation'
  | 'communication';
export type ConditionTag = 'ADHD' | 'Autism' | 'Dyslexia' | 'Anxiety' | 'Stress' | 'Sleep' | 'Executive function';

export interface PrintableLocaleText {
  uk: string;
  us: string;
}

export interface PrintableCitation {
  label: string;
  url: string;
}

export interface PrintableBlockParagraph {
  type: 'paragraph';
  text: string;
}

export interface PrintableBlockBullets {
  type: 'bullets';
  items: string[];
}

export interface PrintableBlockSteps {
  type: 'steps';
  steps: string[];
}

export interface PrintableBlockTable {
  type: 'table';
  table: {
    headers: string[];
    rows: string[][];
  };
}

export type PrintableBlock =
  | PrintableBlockParagraph
  | PrintableBlockBullets
  | PrintableBlockSteps
  | PrintableBlockTable;

export interface PrintableSection {
  heading: string;
  pageBreakBefore?: boolean;
  blocks: PrintableBlock[];
}

export interface PrintableEntry {
  id: string;
  title: PrintableLocaleText;
  summary: PrintableLocaleText;
  audience: PrintableAudience;
  type: PrintableType;
  conditionTags: ConditionTag[];
  supportNeedsTags: SupportNeedTag[];
  estimatedTimeToUse: string;
  formatOptions: {
    printPage: boolean;
    pdf: boolean;
  };
  howToUse: string[];
  sections: PrintableSection[];
  citationsByRegion: {
    uk: PrintableCitation[];
    us: PrintableCitation[];
    global: PrintableCitation[];
  };
  reviewedAt: string;
  reviewIntervalDays: number;
  internalLinks: {
    relatedJourneys: string[];
    relatedGuides: string[];
    relatedTools: string[];
    relatedGlossaryTerms?: string[];
    trustLinks: string[];
  };
}

const TRUST_LINKS = ['/trust/evidence-policy', '/trust/citations', '/trust/safeguarding'];

const COMMON_GLOBAL_CITATIONS: PrintableCitation[] = [
  { label: 'World Health Organization: Mental health and wellbeing', url: 'https://www.who.int/teams/mental-health-and-substance-use' },
  { label: 'UNICEF: Supporting mental health and wellbeing', url: 'https://www.unicef.org/mental-health' },
];

const UK_EDUCATION_CITATIONS: PrintableCitation[] = [
  { label: 'UK Department for Education: SEND guidance', url: 'https://www.gov.uk/children-with-special-educational-needs' },
  { label: 'NICE: Autism in under 19s (guidance)', url: 'https://www.nice.org.uk/guidance/cg170' },
];

const US_EDUCATION_CITATIONS: PrintableCitation[] = [
  { label: 'US Department of Education: IDEA overview', url: 'https://sites.ed.gov/idea/' },
  { label: 'CDC: ADHD overview', url: 'https://www.cdc.gov/adhd/' },
];

export const PRINTABLES: PrintableEntry[] = [
  {
    id: 'daily-routine-planner',
    title: {
      uk: 'Daily routine planner (morning & evening)',
      us: 'Daily routine planner (morning & evening)',
    },
    summary: {
      uk: 'A calm, visual plan for mornings and evenings to reduce decision load at home.',
      us: 'A calm, visual plan for mornings and evenings to reduce decision load at home.',
    },
    audience: 'parent-carer',
    type: 'plan',
    conditionTags: ['ADHD', 'Autism', 'Executive function'],
    supportNeedsTags: ['routines', 'focus'],
    estimatedTimeToUse: '5–10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: [
      'Print one copy per routine (morning and evening).',
      'Keep the steps short and visible near the relevant space.',
      'Tick or mark steps together to build momentum.',
    ],
    sections: [
      {
        heading: 'Morning routine',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Time', 'Step', 'Notes'],
              rows: [
                ['7:00', 'Wake up + stretch', 'Light on, gentle cue'],
                ['7:10', 'Wash + dress', 'Clothes ready night before'],
                ['7:25', 'Breakfast + water', 'Protein + hydration'],
                ['7:40', 'Pack bag', 'Checklist by the door'],
              ],
            },
          },
        ],
      },
      {
        heading: 'Evening routine',
        pageBreakBefore: true,
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Time', 'Step', 'Notes'],
              rows: [
                ['6:00', 'Dinner + decompress', 'Low-noise environment'],
                ['6:45', 'Homework / quiet activity', 'Use timer blocks'],
                ['7:30', 'Wash + pyjamas', 'Lights down'],
                ['8:00', 'Wind‑down', 'Story, breathing, calm music'],
              ],
            },
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['adhd-break-planning', 'focus-sprints-for-adhd', 'wind-down-routine'],
      relatedTools: ['focus-tiles', 'sleep-tools'],
      relatedGlossaryTerms: ['executive-function', 'time-blindness'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'calm-plan-coping-card',
    title: {
      uk: 'Calm plan & coping card',
      us: 'Calm plan & coping card',
    },
    summary: {
      uk: 'A short, non‑clinical coping card for recognising early stress signs and calming steps.',
      us: 'A short, non‑clinical coping card for recognising early stress signs and calming steps.',
    },
    audience: 'parent-carer',
    type: 'prompt-card',
    conditionTags: ['Anxiety', 'Stress', 'Autism'],
    supportNeedsTags: ['emotional-regulation', 'communication'],
    estimatedTimeToUse: '2–5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: [
      'Fill in together during a calm moment.',
      'Keep the card in a visible place or bag.',
      'Use the same language across home and school where possible.',
    ],
    sections: [
      {
        heading: 'Early signs I need a reset',
        blocks: [
          {
            type: 'bullets',
            items: ['□ I get very quiet', '□ I start pacing', '□ My body feels hot or tight', '□ I stop listening'],
          },
        ],
      },
      {
        heading: 'What helps me most',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Deep breathing', '□ Quiet space', '□ Cold water', '□ Movement break', '□ Hug / pressure'],
          },
          {
            type: 'paragraph',
            text: 'Add any personal strategies you already know work well.',
          },
        ],
      },
      {
        heading: 'Supportive words we can use',
        blocks: [
          {
            type: 'steps',
            steps: ['“You are safe. We can slow down together.”', '“Do you want a break or a quiet corner?”', '“Let’s breathe for 30 seconds.”'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Coping with stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' }],
      us: [{ label: 'CDC: Stress and coping', url: 'https://www.cdc.gov/mentalhealth/stress-coping/index.html' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-emotional-regulation'],
      relatedGuides: ['quick-calm-in-5-minutes', 'body-scan-for-stress', 'breathing-for-sensory-overload'],
      relatedTools: ['quick-calm', 'box-breathing'],
      relatedGlossaryTerms: ['co-regulation', 'grounding'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'sleep-routine-checklist',
    title: {
      uk: 'Sleep routine checklist',
      us: 'Sleep routine checklist',
    },
    summary: {
      uk: 'A gentle evening checklist to make wind‑down steps predictable.',
      us: 'A gentle evening checklist to make wind‑down steps predictable.',
    },
    audience: 'parent-carer',
    type: 'checklist',
    conditionTags: ['Sleep', 'ADHD'],
    supportNeedsTags: ['sleep', 'routines'],
    estimatedTimeToUse: '5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Print one per week.', 'Tick together after each step.', 'Adjust steps to fit your household timing.'],
    sections: [
      {
        heading: 'Tonight’s steps',
        blocks: [
          {
            type: 'bullets',
            items: [
              '□ Dim lights 60 minutes before bed',
              '□ Screens off / quiet activity',
              '□ Wash + toothbrush',
              '□ Calm activity (story / music)',
              '□ Breathing or body scan',
              '□ Lights out',
            ],
          },
        ],
      },
      {
        heading: 'What helped tonight?',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Warm drink', '□ Weighted blanket', '□ White noise', '□ Quiet chat'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Sleep tips for children', url: 'https://www.nhs.uk/live-well/sleep-and-tiredness/' }],
      us: [{ label: 'CDC: Sleep and sleep disorders', url: 'https://www.cdc.gov/sleep/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-sleep'],
      relatedGuides: ['wind-down-routine', 'sleep-reset-for-shift-workers', '/guides/breathing-exercises-for-stress'],
      relatedTools: ['sleep-tools'],
      relatedGlossaryTerms: ['sleep-hygiene'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'sensory-what-helps-tracker',
    title: {
      uk: 'Sensory “what helps” tracker',
      us: 'Sensory “what helps” tracker',
    },
    summary: {
      uk: 'Track triggers, helpful supports, and calming cues to share across home and school.',
      us: 'Track triggers, helpful supports, and calming cues to share across home and school.',
    },
    audience: 'parent-carer',
    type: 'worksheet',
    conditionTags: ['Autism', 'ADHD'],
    supportNeedsTags: ['sensory', 'communication'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Complete together after a calm moment.', 'Share with teachers or carers if helpful.', 'Review monthly and update.'],
    sections: [
      {
        heading: 'Sensory triggers and supports',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Situation', 'Sensory trigger', 'What helps'],
              rows: [
                ['Crowded room', 'Noise / echo', 'Headphones, quiet space'],
                ['Bright classroom', 'Harsh lighting', 'Sunglasses, seating change'],
                ['Transitions', 'Sudden changes', 'Countdown, visual timer'],
              ],
            },
          },
        ],
      },
      {
        heading: 'Preferred calming cues',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Deep pressure', '□ Movement break', '□ Breathing cue', '□ Fidget item'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'National Autistic Society: Sensory differences', url: 'https://www.autism.org.uk/advice-and-guidance/topics/sensory-differences' }],
      us: [{ label: 'Autism Speaks: Sensory issues', url: 'https://www.autismspeaks.org/sensory-issues' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-sensory'],
      relatedGuides: ['autism-sensory-reset', 'breathing-for-sensory-overload', 'autism-transition-support'],
      relatedTools: ['sensory-calm', 'quick-calm'],
      relatedGlossaryTerms: ['sensory-overload'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'homework-support-checklist',
    title: {
      uk: 'Homework support checklist',
      us: 'Homework support checklist',
    },
    summary: {
      uk: 'Keep homework time predictable with short focus blocks and clear cues.',
      us: 'Keep homework time predictable with short focus blocks and clear cues.',
    },
    audience: 'parent-carer',
    type: 'checklist',
    conditionTags: ['ADHD', 'Dyslexia'],
    supportNeedsTags: ['reading', 'focus', 'routines'],
    estimatedTimeToUse: '5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Review before starting homework.', 'Check off steps together.', 'Adjust timing based on energy levels.'],
    sections: [
      {
        heading: 'Homework routine',
        blocks: [
          {
            type: 'bullets',
            items: [
              '□ Clear workspace and reduce distractions',
              '□ Set a 10–15 minute focus sprint',
              '□ Use a visual timer',
              '□ Take a 3–5 minute movement break',
              '□ Celebrate completion',
            ],
          },
        ],
      },
      {
        heading: 'Support cues',
        blocks: [
          {
            type: 'steps',
            steps: ['“We can do just one small piece.”', '“Let’s set a timer and stop when it rings.”', '“Do you want to read aloud or use a helper?”'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'UK Department for Education: Supporting pupils with SEND', url: 'https://www.gov.uk/government/publications/send-code-of-practice-0-to-25' }],
      us: [{ label: 'US Department of Education: Supporting students', url: 'https://www2.ed.gov/about/overview/focus/what_pg2.html' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-learning'],
      relatedGuides: ['reading-routine-at-home', 'focus-sprints-for-adhd', 'reading-confidence-in-class'],
      relatedTools: ['focus-training'],
      relatedGlossaryTerms: ['executive-function'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'classroom-calm-corner-checklist',
    title: {
      uk: 'Classroom calm corner checklist',
      us: 'Classroom calm corner checklist',
    },
    summary: {
      uk: 'A practical setup checklist for a calm, low‑stimulus classroom corner.',
      us: 'A practical setup checklist for a calm, low‑stimulus classroom corner.',
    },
    audience: 'teacher',
    type: 'classroom-resource',
    conditionTags: ['Autism', 'ADHD', 'Anxiety'],
    supportNeedsTags: ['sensory', 'emotional-regulation'],
    estimatedTimeToUse: '10–15 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Use as a setup audit at the start of term.', 'Review monthly to keep supplies calm and tidy.'],
    sections: [
      {
        heading: 'Calm corner essentials',
        blocks: [
          {
            type: 'bullets',
            items: [
              '□ Clear visual boundary (rug, screen, or divider)',
              '□ Soft lighting or lamp',
              '□ Calm toolkit (fidgets, stress balls)',
              '□ Breathing prompt card',
              '□ Seating option (beanbag / chair)',
            ],
          },
        ],
      },
      {
        heading: 'Usage guidance',
        blocks: [
          {
            type: 'steps',
            steps: ['Explain the calm corner is for self‑regulation, not punishment.', 'Set a 3–5 minute timer or check‑in routine.', 'Offer a quiet return plan to class.'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-sensory'],
      relatedGuides: ['autism-sensory-reset', 'breathing-for-sensory-overload', 'quick-calm-in-5-minutes'],
      relatedTools: ['quick-calm', 'sensory-calm'],
      relatedGlossaryTerms: ['sensory-overload'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'visual-schedule-template',
    title: {
      uk: 'Visual schedule template',
      us: 'Visual schedule template',
    },
    summary: {
      uk: 'A flexible visual schedule template for primary and secondary classrooms.',
      us: 'A flexible visual schedule template for primary and secondary classrooms.',
    },
    audience: 'teacher',
    type: 'classroom-resource',
    conditionTags: ['Autism', 'ADHD'],
    supportNeedsTags: ['routines', 'communication'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Print one per day or week.', 'Use icons or short phrases for each block.', 'Update together to reduce surprises.'],
    sections: [
      {
        heading: 'Schedule blocks',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Time', 'Activity', 'Support cue'],
              rows: [
                ['9:00', 'Arrival + settle', 'Quiet start'],
                ['9:30', 'Literacy block', 'Visual timer'],
                ['10:30', 'Movement break', 'Stretch / walk'],
                ['11:00', 'Maths block', 'Chunked tasks'],
              ],
            },
          },
        ],
      },
      {
        heading: 'Transition cues',
        blocks: [
          {
            type: 'bullets',
            items: ['□ 5‑minute warning', '□ Visual timer', '□ “Next up” card'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['autism-transition-support', 'focus-sprints-for-adhd', 'reading-confidence-in-class'],
      relatedTools: ['focus-tiles'],
      relatedGlossaryTerms: ['time-blindness'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'sensory-supports-checklist',
    title: {
      uk: 'Sensory supports checklist (classroom)',
      us: 'Sensory supports checklist (classroom)',
    },
    summary: {
      uk: 'Quick checks to reduce sensory overload in class.',
      us: 'Quick checks to reduce sensory overload in class.',
    },
    audience: 'teacher',
    type: 'classroom-resource',
    conditionTags: ['Autism', 'ADHD'],
    supportNeedsTags: ['sensory', 'communication'],
    estimatedTimeToUse: '5–10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Use at the start of term or after class changes.', 'Tick off adjustments as you try them.'],
    sections: [
      {
        heading: 'Environment checks',
        blocks: [
          {
            type: 'bullets',
            items: [
              '□ Reduce harsh lighting or glare',
              '□ Offer noise‑reducing options',
              '□ Provide a predictable seating spot',
              '□ Allow movement breaks',
            ],
          },
        ],
      },
      {
        heading: 'Communication supports',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Visual instructions', '□ Short, clear directions', '□ Check‑back questions'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-sensory'],
      relatedGuides: ['autism-sensory-reset', 'breathing-for-sensory-overload', 'quick-calm-in-5-minutes'],
      relatedTools: ['sensory-calm'],
      relatedGlossaryTerms: ['sensory-overload'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'teacher-communication-log',
    title: {
      uk: 'Teacher‑carer communication log',
      us: 'Teacher‑family communication log',
    },
    summary: {
      uk: 'A short, respectful log to align support between school and home.',
      us: 'A short, respectful log to align support between school and home.',
    },
    audience: 'teacher',
    type: 'template',
    conditionTags: ['ADHD', 'Autism', 'Dyslexia'],
    supportNeedsTags: ['communication', 'routines'],
    estimatedTimeToUse: '5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Use for brief, factual updates.', 'Focus on what helped and what to try next.'],
    sections: [
      {
        heading: 'Daily notes',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Date', 'Wins', 'Challenges', 'What helped', 'Next step'],
              rows: [
                ['____', '____', '____', '____', '____'],
                ['____', '____', '____', '____', '____'],
              ],
            },
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['autism-transition-support', 'reading-confidence-in-class', 'focus-sprints-for-adhd'],
      relatedTools: ['focus-tiles'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'break-card-template',
    title: {
      uk: 'Break card template',
      us: 'Break card template',
    },
    summary: {
      uk: 'A respectful card for pupils to request a short regulation break.',
      us: 'A respectful card for pupils to request a short regulation break.',
    },
    audience: 'teacher',
    type: 'prompt-card',
    conditionTags: ['ADHD', 'Autism', 'Anxiety'],
    supportNeedsTags: ['emotional-regulation', 'communication'],
    estimatedTimeToUse: '2 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Explain when the card can be used.', 'Pair with a short return routine.'],
    sections: [
      {
        heading: 'Break request card',
        blocks: [
          {
            type: 'paragraph',
            text: '“I need a short break. I will return in __ minutes.”',
          },
          {
            type: 'bullets',
            items: ['□ Quiet corner', '□ Water break', '□ Movement break', '□ Breathing break'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-emotional-regulation'],
      relatedGuides: ['quick-calm-in-5-minutes', 'breathing-for-sensory-overload', 'autism-transition-support'],
      relatedTools: ['quick-calm'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'transition-support-plan',
    title: {
      uk: 'Classroom transition support plan',
      us: 'Classroom transition support plan',
    },
    summary: {
      uk: 'A short plan for smoother transitions and predictable cues.',
      us: 'A short plan for smoother transitions and predictable cues.',
    },
    audience: 'teacher',
    type: 'plan',
    conditionTags: ['Autism', 'ADHD'],
    supportNeedsTags: ['routines', 'communication'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Complete with a pupil where possible.', 'Review weekly and adjust cues.'],
    sections: [
      {
        heading: 'Transition steps',
        blocks: [
          {
            type: 'steps',
            steps: [
              'Give a 5‑minute warning and show the next activity card.',
              'Use a visual timer or countdown.',
              'Offer a small role (carry the notebook, wipe the board).',
              'Confirm the next activity with one short sentence.',
            ],
          },
        ],
      },
      {
        heading: 'Support cues',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Visual timer', '□ “Next up” card', '□ Transition song', '□ Calm corner option'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['autism-transition-support', 'focus-sprints-for-adhd', 'quick-calm-in-5-minutes'],
      relatedTools: ['focus-tiles'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'reasonable-adjustments-request',
    title: {
      uk: 'Reasonable adjustments request template',
      us: 'Workplace accommodations request template',
    },
    summary: {
      uk: 'A respectful template to request reasonable adjustments at work (UK wording).',
      us: 'A respectful template to request workplace accommodations (US wording).',
    },
    audience: 'workplace',
    type: 'workplace-resource',
    conditionTags: ['ADHD', 'Autism', 'Stress'],
    supportNeedsTags: ['communication', 'focus'],
    estimatedTimeToUse: '10–15 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Adapt the language to your workplace policy.', 'Keep requests specific and practical.'],
    sections: [
      {
        heading: 'Request outline',
        blocks: [
          {
            type: 'paragraph',
            text: 'I am requesting adjustments/accommodations to support my work. These are intended to improve focus, reduce overload, and help me meet role expectations.',
          },
          {
            type: 'bullets',
            items: [
              '□ Quiet workspace or noise‑reducing options',
              '□ Written instructions after meetings',
              '□ Flexible start time for regulated routines',
              '□ Meeting agenda shared in advance',
            ],
          },
        ],
      },
      {
        heading: 'Impact summary',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Adjustment', 'Impact on work', 'How success will be measured'],
              rows: [
                ['Quiet space', 'Less sensory overload', 'Fewer interruptions'],
                ['Written summaries', 'Clearer task follow‑through', 'Reduced rework'],
              ],
            },
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'ACAS: Reasonable adjustments', url: 'https://www.acas.org.uk/reasonable-adjustments' }],
      us: [{ label: 'Job Accommodation Network (JAN)', url: 'https://askjan.org/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['focus-sprints-for-adhd', 'adhd-break-planning', 'quick-calm-in-5-minutes'],
      relatedTools: ['focus-training'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'workplace-focus-plan',
    title: {
      uk: 'Workplace focus plan',
      us: 'Workplace focus plan',
    },
    summary: {
      uk: 'A practical plan for building focus blocks, breaks, and reset cues at work.',
      us: 'A practical plan for building focus blocks, breaks, and reset cues at work.',
    },
    audience: 'workplace',
    type: 'plan',
    conditionTags: ['ADHD', 'Executive function'],
    supportNeedsTags: ['focus', 'routines'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Plan your first two focus blocks of the day.', 'Schedule recovery breaks and short resets.'],
    sections: [
      {
        heading: 'Focus block plan',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Focus block', 'Task', 'Time', 'Recovery'],
              rows: [
                ['1', 'Most important task', '25–35 min', '5 min reset'],
                ['2', 'Second priority', '25–35 min', '5 min reset'],
                ['3', 'Admin / email', '15–20 min', '2 min reset'],
              ],
            },
          },
        ],
      },
      {
        heading: 'Reset cues',
        blocks: [
          {
            type: 'bullets',
            items: ['□ 4‑7‑8 breathing', '□ Stand + stretch', '□ Water break', '□ Visual timer'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'HSE: Stress and wellbeing at work', url: 'https://www.hse.gov.uk/stress/' }],
      us: [{ label: 'NIOSH: Work stress and health', url: 'https://www.cdc.gov/niosh/topics/stress/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-focus'],
      relatedGuides: ['focus-sprints-for-adhd', 'adhd-break-planning', 'body-scan-for-stress'],
      relatedTools: ['focus-training', 'focus-tiles'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'meeting-accommodations-checklist',
    title: {
      uk: 'Meeting accommodations checklist',
      us: 'Meeting accommodations checklist',
    },
    summary: {
      uk: 'Practical meeting supports to reduce overload and improve follow‑through.',
      us: 'Practical meeting supports to reduce overload and improve follow‑through.',
    },
    audience: 'workplace',
    type: 'workplace-resource',
    conditionTags: ['ADHD', 'Autism', 'Stress'],
    supportNeedsTags: ['communication', 'focus'],
    estimatedTimeToUse: '5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Select the supports that apply to your role.', 'Share with your manager or meeting organiser.'],
    sections: [
      {
        heading: 'Before the meeting',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Agenda shared in advance', '□ Clear timebox for each topic', '□ Written questions in advance'],
          },
        ],
      },
      {
        heading: 'During the meeting',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Note‑taking support', '□ Clarify action items', '□ Option to join with camera off'],
          },
        ],
      },
      {
        heading: 'After the meeting',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Written summary sent', '□ Clear owner + deadline for tasks'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'ACAS: Managing adjustments', url: 'https://www.acas.org.uk/reasonable-adjustments' }],
      us: [{ label: 'Job Accommodation Network (JAN)', url: 'https://askjan.org/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['focus-sprints-for-adhd', 'adhd-break-planning', 'body-scan-for-stress'],
      relatedTools: ['focus-training'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'disclosure-conversation-planner',
    title: {
      uk: 'Disclosure conversation planner',
      us: 'Disclosure conversation planner',
    },
    summary: {
      uk: 'A thoughtful, non‑legal planning sheet for workplace disclosure conversations.',
      us: 'A thoughtful, non‑legal planning sheet for workplace disclosure conversations.',
    },
    audience: 'workplace',
    type: 'worksheet',
    conditionTags: ['ADHD', 'Autism', 'Stress'],
    supportNeedsTags: ['communication'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Use in a calm moment and keep notes short.', 'Focus on practical supports rather than diagnosis details.'],
    sections: [
      {
        heading: 'What I want to share',
        blocks: [
          {
            type: 'bullets',
            items: ['□ The impact on my work (short)', '□ The support that helps', '□ How we can review it'],
          },
        ],
      },
      {
        heading: 'Suggested wording',
        blocks: [
          {
            type: 'paragraph',
            text: '“I’d like to share that I work best with a few practical adjustments. These help me stay focused and meet expectations.”',
          },
        ],
      },
      {
        heading: 'Next steps',
        blocks: [
          {
            type: 'steps',
            steps: ['Agree adjustments to trial', 'Set a review date', 'Confirm key points in writing'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'ACAS: Talking about disability at work', url: 'https://www.acas.org.uk/disability-at-work' }],
      us: [{ label: 'ADA National Network: Workplace accommodations', url: 'https://adata.org/factsheet/reasonable-accommodations-workplace' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['adhd-break-planning', 'focus-sprints-for-adhd', 'body-scan-for-stress'],
      relatedTools: ['focus-training'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'stress-reset-micro-breaks-card',
    title: {
      uk: 'Stress reset micro‑breaks card',
      us: 'Stress reset micro‑breaks card',
    },
    summary: {
      uk: 'Quick 1–2 minute micro‑break ideas for workdays.',
      us: 'Quick 1–2 minute micro‑break ideas for workdays.',
    },
    audience: 'workplace',
    type: 'prompt-card',
    conditionTags: ['Stress'],
    supportNeedsTags: ['emotional-regulation', 'focus'],
    estimatedTimeToUse: '2 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Print and keep near your desk.', 'Use between focus blocks or after meetings.'],
    sections: [
      {
        heading: 'Micro‑break ideas',
        blocks: [
          {
            type: 'bullets',
            items: ['□ 4‑7‑8 breathing', '□ Shoulder roll + stretch', '□ 60‑second walk', '□ Cold water reset'],
          },
        ],
      },
      {
        heading: 'Quick reminder',
        blocks: [
          {
            type: 'paragraph',
            text: 'Small resets help protect your focus and energy without losing momentum.',
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'HSE: Stress at work', url: 'https://www.hse.gov.uk/stress/' }],
      us: [{ label: 'CDC: Stress at work', url: 'https://www.cdc.gov/niosh/topics/stress/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-calm'],
      relatedGuides: ['body-scan-for-stress', 'quick-calm-in-5-minutes', 'breathing-exercises-for-stress'],
      relatedTools: ['quick-calm', 'box-breathing'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'sensory-workspace-checklist',
    title: {
      uk: 'Sensory‑friendly workspace checklist',
      us: 'Sensory‑friendly workspace checklist',
    },
    summary: {
      uk: 'A short checklist to reduce sensory overload in a work environment.',
      us: 'A short checklist to reduce sensory overload in a work environment.',
    },
    audience: 'workplace',
    type: 'workplace-resource',
    conditionTags: ['Autism', 'ADHD'],
    supportNeedsTags: ['sensory', 'focus'],
    estimatedTimeToUse: '5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Tick the changes that help you stay comfortable.', 'Share with workplace support teams if needed.'],
    sections: [
      {
        heading: 'Environment checks',
        blocks: [
          {
            type: 'bullets',
            items: [
              '□ Reduce glare / harsh lighting',
              '□ Noise‑reducing option available',
              '□ Clear desk with minimal clutter',
              '□ Ability to take short resets',
            ],
          },
        ],
      },
      {
        heading: 'Communication supports',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Written follow‑ups', '□ Clear task priority list', '□ Fewer surprise changes'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'ACAS: Reasonable adjustments', url: 'https://www.acas.org.uk/reasonable-adjustments' }],
      us: [{ label: 'Job Accommodation Network (JAN)', url: 'https://askjan.org/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-sensory'],
      relatedGuides: ['body-scan-for-stress', 'focus-sprints-for-adhd', 'breathing-for-sensory-overload'],
      relatedTools: ['sensory-calm', 'focus-tiles'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: '4-7-8-practice-tracker',
    title: {
      uk: '4‑7‑8 practice tracker',
      us: '4‑7‑8 practice tracker',
    },
    summary: {
      uk: 'Track short 4‑7‑8 breathing practice sessions over two weeks.',
      us: 'Track short 4‑7‑8 breathing practice sessions over two weeks.',
    },
    audience: 'individual',
    type: 'worksheet',
    conditionTags: ['Stress', 'Anxiety'],
    supportNeedsTags: ['emotional-regulation'],
    estimatedTimeToUse: '2 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Print and tick each session completed.', 'Aim for short, consistent practice.'],
    sections: [
      {
        heading: '14‑day tracker',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Day', 'Completed', 'Notes'],
              rows: [
                ['1', '□', ''],
                ['2', '□', ''],
                ['3', '□', ''],
                ['4', '□', ''],
                ['5', '□', ''],
                ['6', '□', ''],
                ['7', '□', ''],
              ],
            },
          },
        ],
      },
      {
        heading: 'Breathing reminder',
        blocks: [
          {
            type: 'steps',
            steps: ['Inhale 4', 'Hold 7', 'Exhale 8', 'Repeat 4 cycles'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' }],
      us: [{ label: 'NIMH: Stress information', url: 'https://www.nimh.nih.gov/health/topics/stress' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-calm'],
      relatedGuides: ['quick-calm-in-5-minutes', 'body-scan-for-stress', '/guides/breathing-exercises-for-stress'],
      relatedTools: ['box-breathing'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'box-breathing-practice-card',
    title: {
      uk: 'Box breathing practice card',
      us: 'Box breathing practice card',
    },
    summary: {
      uk: 'A quick prompt card for box breathing steps.',
      us: 'A quick prompt card for box breathing steps.',
    },
    audience: 'individual',
    type: 'prompt-card',
    conditionTags: ['Stress', 'Anxiety'],
    supportNeedsTags: ['emotional-regulation', 'focus'],
    estimatedTimeToUse: '1 minute',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Keep nearby for quick use.', 'Practice for 60–90 seconds at a time.'],
    sections: [
      {
        heading: 'Box breathing steps',
        blocks: [
          {
            type: 'steps',
            steps: ['Inhale 4', 'Hold 4', 'Exhale 4', 'Hold 4'],
          },
        ],
      },
      {
        heading: 'When to use it',
        blocks: [
          {
            type: 'bullets',
            items: ['Before a meeting', 'After a busy classroom transition', 'Between focus blocks'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Breathing exercises for stress', url: 'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/breathing-exercises-for-stress/' }],
      us: [{ label: 'CDC: Stress and coping', url: 'https://www.cdc.gov/mentalhealth/stress-coping/index.html' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-calm'],
      relatedGuides: ['quick-calm-in-5-minutes', 'body-scan-for-stress', '/guides/breathing-exercises-for-stress'],
      relatedTools: ['box-breathing'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'focus-sprint-plan',
    title: {
      uk: 'Focus sprint plan (Pomodoro)',
      us: 'Focus sprint plan (Pomodoro)',
    },
    summary: {
      uk: 'Plan short focus sprints with breaks and reset cues.',
      us: 'Plan short focus sprints with breaks and reset cues.',
    },
    audience: 'individual',
    type: 'worksheet',
    conditionTags: ['ADHD', 'Executive function'],
    supportNeedsTags: ['focus', 'routines'],
    estimatedTimeToUse: '5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Pick 1–3 tasks only.', 'Use a timer and reset after each sprint.'],
    sections: [
      {
        heading: 'Sprint plan',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['Sprint', 'Task', 'Time', 'Break'],
              rows: [
                ['1', '________', '25 min', '5 min'],
                ['2', '________', '25 min', '5 min'],
                ['3', '________', '20 min', '5 min'],
              ],
            },
          },
        ],
      },
      {
        heading: 'Reset ideas',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Stand + stretch', '□ Water break', '□ 4‑7‑8 breathing'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Managing stress and focus', url: 'https://www.nhs.uk/mental-health/' }],
      us: [{ label: 'NIMH: Stress basics', url: 'https://www.nimh.nih.gov/health/topics/stress' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-focus'],
      relatedGuides: ['focus-sprints-for-adhd', 'adhd-break-planning', 'quick-calm-in-5-minutes'],
      relatedTools: ['focus-training'],
      relatedGlossaryTerms: ['focus-sprints'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'support-needs-reflection',
    title: {
      uk: 'My support needs reflection worksheet',
      us: 'My support needs reflection worksheet',
    },
    summary: {
      uk: 'A non‑diagnostic worksheet to clarify what helps and what gets in the way.',
      us: 'A non‑diagnostic worksheet to clarify what helps and what gets in the way.',
    },
    audience: 'individual',
    type: 'worksheet',
    conditionTags: ['ADHD', 'Autism', 'Dyslexia'],
    supportNeedsTags: ['communication', 'emotional-regulation', 'focus'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Complete in a calm moment.', 'Share with a trusted supporter if you want.'],
    sections: [
      {
        heading: 'What helps me',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Quiet space', '□ Written instructions', '□ Visual reminders', '□ Movement breaks'],
          },
        ],
      },
      {
        heading: 'What makes things harder',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Last‑minute changes', '□ Too many instructions at once', '□ Loud environments'],
          },
        ],
      },
      {
        heading: 'Next steps',
        blocks: [
          {
            type: 'paragraph',
            text: 'One small change I can try this week: _______________________.',
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['focus-sprints-for-adhd', 'adhd-break-planning', 'reading-routine-at-home'],
      relatedTools: ['focus-tiles'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'emotion-check-in-wheel',
    title: {
      uk: 'Emotion check‑in wheel',
      us: 'Emotion check‑in wheel',
    },
    summary: {
      uk: 'A quick check‑in sheet for naming feelings and next‑step supports.',
      us: 'A quick check‑in sheet for naming feelings and next‑step supports.',
    },
    audience: 'individual',
    type: 'worksheet',
    conditionTags: ['Stress', 'Anxiety'],
    supportNeedsTags: ['emotional-regulation', 'communication'],
    estimatedTimeToUse: '3–5 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Circle the closest feeling and note what might help.', 'Share with a trusted adult or colleague if helpful.'],
    sections: [
      {
        heading: 'Feeling check‑in',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Calm', '□ Tired', '□ Overwhelmed', '□ Frustrated', '□ Worried', '□ Excited'],
          },
        ],
      },
      {
        heading: 'What might help now?',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Breathing', '□ Quiet break', '□ Movement', '□ Talk it through'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Mental health self‑help', url: 'https://www.nhs.uk/mental-health/' }],
      us: [{ label: 'NIMH: Coping with stress', url: 'https://www.nimh.nih.gov/health/topics/stress' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-emotional-regulation'],
      relatedGuides: ['quick-calm-in-5-minutes', 'body-scan-for-stress', '/guides/breathing-exercises-for-stress'],
      relatedTools: ['quick-calm', 'box-breathing'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'weekly-routine-reset-review',
    title: {
      uk: 'Weekly routine reset review',
      us: 'Weekly routine reset review',
    },
    summary: {
      uk: 'A short weekly reflection to spot what helped and adjust routines.',
      us: 'A short weekly reflection to spot what helped and adjust routines.',
    },
    audience: 'individual',
    type: 'worksheet',
    conditionTags: ['ADHD', 'Stress'],
    supportNeedsTags: ['routines', 'focus'],
    estimatedTimeToUse: '10 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Complete at the end of the week.', 'Choose one change for next week.'],
    sections: [
      {
        heading: 'Weekly review',
        blocks: [
          {
            type: 'table',
            table: {
              headers: ['What worked', 'What was hard', 'One change for next week'],
              rows: [['____', '____', '____']],
            },
          },
        ],
      },
      {
        heading: 'Support reminders',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Use a visual timer', '□ Short focus blocks', '□ Gentle wind‑down routine'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'NHS: Mental health self‑help', url: 'https://www.nhs.uk/mental-health/' }],
      us: [{ label: 'CDC: Coping with stress', url: 'https://www.cdc.gov/mentalhealth/stress-coping/index.html' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['adhd-break-planning', 'focus-sprints-for-adhd', 'wind-down-routine'],
      relatedTools: ['focus-training'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'communication-prep-cards',
    title: {
      uk: 'Communication prep cards',
      us: 'Communication prep cards',
    },
    summary: {
      uk: 'Short scripts for asking for help, clarifying tasks, and sharing needs.',
      us: 'Short scripts for asking for help, clarifying tasks, and sharing needs.',
    },
    audience: 'individual',
    type: 'prompt-card',
    conditionTags: ['ADHD', 'Autism'],
    supportNeedsTags: ['communication'],
    estimatedTimeToUse: '3 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Cut out the cards and keep one in a notebook.', 'Edit the wording to match your voice.'],
    sections: [
      {
        heading: 'Helpful scripts',
        blocks: [
          {
            type: 'bullets',
            items: [
              '“Can I check I understood the next step?”',
              '“Could we write down the action points?”',
              '“I work best with clear priorities — can we agree the top two?”',
            ],
          },
        ],
      },
      {
        heading: 'When to use',
        blocks: [
          {
            type: 'bullets',
            items: ['After meetings', 'During transitions', 'When tasks feel unclear'],
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: UK_EDUCATION_CITATIONS,
      us: US_EDUCATION_CITATIONS,
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-organisation'],
      relatedGuides: ['adhd-break-planning', 'focus-sprints-for-adhd', 'reading-confidence-in-class'],
      relatedTools: ['focus-tiles'],
      trustLinks: TRUST_LINKS,
    },
  },
  {
    id: 'reading-focus-strategy-card',
    title: {
      uk: 'Reading focus strategy card',
      us: 'Reading focus strategy card',
    },
    summary: {
      uk: 'Short strategies for staying focused during reading tasks.',
      us: 'Short strategies for staying focused during reading tasks.',
    },
    audience: 'individual',
    type: 'prompt-card',
    conditionTags: ['Dyslexia', 'ADHD'],
    supportNeedsTags: ['reading', 'focus'],
    estimatedTimeToUse: '2–3 minutes',
    formatOptions: { printPage: true, pdf: true },
    howToUse: ['Choose one strategy and try it for one page.', 'Swap strategies if attention dips.'],
    sections: [
      {
        heading: 'Try one of these',
        blocks: [
          {
            type: 'bullets',
            items: ['□ Use a ruler or guide', '□ Read aloud in short chunks', '□ Set a 5‑minute timer', '□ Take a 1‑minute break'],
          },
        ],
      },
      {
        heading: 'Reflection',
        blocks: [
          {
            type: 'paragraph',
            text: 'The strategy that helped most today: _______________________.',
          },
        ],
      },
    ],
    citationsByRegion: {
      uk: [{ label: 'British Dyslexia Association: Classroom strategies', url: 'https://www.bdadyslexia.org.uk/advice/educators/classroom-strategies' }],
      us: [{ label: 'International Dyslexia Association: Structured literacy', url: 'https://dyslexiaida.org/structured-literacy/' }],
      global: COMMON_GLOBAL_CITATIONS,
    },
    reviewedAt: '2026-01-16',
    reviewIntervalDays: 180,
    internalLinks: {
      relatedJourneys: ['starter-learning'],
      relatedGuides: ['reading-routine-at-home', 'reading-confidence-in-class', 'focus-sprints-for-adhd'],
      relatedTools: ['focus-training'],
      trustLinks: TRUST_LINKS,
    },
  },
];

export const PRINTABLES_BY_ID = new Map(PRINTABLES.map(item => [item.id, item]));

export const getPrintableById = (id: string) => PRINTABLES_BY_ID.get(id);

export const getPrintableTitle = (printable: PrintableEntry, region: Region) =>
  region === 'US' ? printable.title.us : printable.title.uk;

export const getPrintableSummary = (printable: PrintableEntry, region: Region) =>
  region === 'US' ? printable.summary.us : printable.summary.uk;

export const getPrintableCitationsForRegion = (printable: PrintableEntry, region: Region) => {
  const regional = region === 'US' ? printable.citationsByRegion.us : printable.citationsByRegion.uk;
  return [...printable.citationsByRegion.global, ...regional];
};
