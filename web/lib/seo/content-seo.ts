export interface RelatedContentItem {
  href: string;
  label: string;
  description: string;
  typeBadge?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContentSeoPageBlock {
  relatedTitle?: string;
  related?: RelatedContentItem[];
  nextSteps?: RelatedContentItem[];
  faqs?: FAQItem[];
  disclaimer?: string;
}

interface PillarConfig {
  key: string;
  title: string;
  path: string;
  description: string;
  clusters: RelatedContentItem[];
  nextSteps: RelatedContentItem[];
  faqs: FAQItem[];
}

const EDUCATIONAL_DISCLAIMER =
  'Educational information only. It does not replace medical, psychological, or educational advice.';

export const PILLARS: PillarConfig[] = [
  {
    key: 'breathing',
    title: 'Breathing Exercises',
    path: '/breathing',
    description: 'Guided breathing techniques and timers for calm, focus, and sleep support.',
    clusters: [
      {
        href: '/breathing/breath',
        label: 'Breathing Basics',
        description: 'Posture, pacing, and setup for everyday practice.',
        typeBadge: 'Guide',
      },
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short, grounding practices for steady attention.',
        typeBadge: 'Guide',
      },
      {
        href: '/breathing/focus',
        label: 'Focus Breathing',
        description: 'Breathing sprints and recovery to support concentration.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/box-breathing',
        label: 'Box Breathing',
        description: 'Four-count rhythm for calm and composure.',
        typeBadge: 'Technique',
      },
      {
        href: '/techniques/4-7-8',
        label: '4-7-8 Breathing',
        description: 'Evening pacing for relaxation and sleep readiness.',
        typeBadge: 'Technique',
      },
      {
        href: '/techniques/coherent',
        label: 'Coherent Breathing',
        description: 'Slow, steady breathing for balance and resilience.',
        typeBadge: 'Technique',
      },
      {
        href: '/techniques/sos',
        label: '60-second SOS Breathing',
        description: 'Rapid reset technique for acute stress moments.',
        typeBadge: 'Technique',
      },
      {
        href: '/breathing/techniques/sos-60',
        label: 'SOS 60 Setup',
        description: 'Short setup guide for the one-minute SOS routine.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/breath-tools',
        label: 'Breath Tools & Timers',
        description: 'Interactive breathing timers and visuals.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/breath-ladder',
        label: 'Breath Ladder',
        description: 'Progressive pacing practice with structured steps.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/colour-path',
        label: 'Colour-Path Breathing',
        description: 'Visual breathing cues for calm and focus.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/roulette',
        label: 'Micro-Reset Roulette',
        description: 'Quick one-minute breathing resets.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/breathing-before-exams',
        label: 'Breathing Before Exams',
        description: 'Short routine to steady focus before tests.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/breathing-for-sensory-overload',
        label: 'Breathing for Sensory Overload',
        description: 'Gentle breathing steps for overload moments.',
        typeBadge: 'Guide',
      },
    ],
    nextSteps: [
      {
        href: '/tools/breath-tools',
        label: 'Start with Breath Tools',
        description: 'Pick a timer and begin a short, guided practice.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/focus-training',
        label: 'Try Focus Training',
        description: 'Pair breathing with short focus sprints.',
        typeBadge: 'Tool',
      },
      {
        href: '/stress',
        label: 'Stress Support Hub',
        description: 'Build a broader calm routine with grounding tools.',
        typeBadge: 'Hub',
      },
    ],
    faqs: [
      {
        question: 'How long should a breathing session last?',
        answer: 'Most people start with 2–5 minutes. Longer sessions can be added once the rhythm feels comfortable.',
      },
      {
        question: 'Which breathing technique is best for quick calm?',
        answer: 'Short, counted patterns such as SOS or box breathing can help settle the body quickly.',
      },
      {
        question: 'Is it normal to feel light-headed?',
        answer: 'Mild light-headedness can happen if you breathe too fast. Slow down and pause if needed.',
      },
      {
        question: 'Can children use these exercises?',
        answer: 'Yes, with age-appropriate pacing and adult guidance.',
      },
      {
        question: 'How often should I practise?',
        answer: 'Aim for short daily practice. Consistency matters more than duration.',
      },
      {
        question: 'Do I need special equipment?',
        answer: 'No. A quiet space and a timer or visual guide is enough.',
      },
      {
        question: 'What if I have a health condition?',
        answer: 'Speak with a clinician if you have concerns about breathing exercises and your health.',
      },
      {
        question: 'Can breathing support focus?',
        answer: 'Steady breathing can reduce stress and help the mind stay on task.',
      },
    ],
  },
  {
    key: 'stress',
    title: 'Stress & Calm Support',
    path: '/stress',
    description: 'Tools and guidance to reduce overwhelm and build resilience.',
    clusters: [
      {
        href: '/tools/stress-tools',
        label: 'Stress Tools',
        description: 'Breathing, grounding, and tracking tools in one place.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/anxiety-tools',
        label: 'Anxiety Toolkit',
        description: 'Grounding, breathing, and CBT-inspired prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/mood-tools',
        label: 'Mood Tools',
        description: 'Track patterns and practise steady regulation.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/techniques/sos-60',
        label: 'SOS 60 Setup',
        description: 'Fast calming routine you can use anywhere.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/box-breathing',
        label: 'Box Breathing',
        description: 'Structured breathing for stress recovery.',
        typeBadge: 'Technique',
      },
      {
        href: '/tools/roulette',
        label: 'Micro-Reset Roulette',
        description: 'One-minute resets when you feel overloaded.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short, centring practices for daily calm.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/low-mood-burnout',
        label: 'Low Mood & Burnout Support',
        description: 'Gentle routines for recovery and energy pacing.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick Calm in 5 Minutes',
        description: 'A short reset plan for busy days.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/body-scan-for-stress',
        label: 'Body Scan for Stress',
        description: 'A simple scan to release tension safely.',
        typeBadge: 'Guide',
      },
    ],
    nextSteps: [
      {
        href: '/tools/stress-tools',
        label: 'Open the Stress Toolkit',
        description: 'Start with breathing, grounding, and tracking.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/breath-tools',
        label: 'Use Breath Tools',
        description: 'Pick a short timer to steady your breathing.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing',
        label: 'Breathing Exercises Hub',
        description: 'Explore structured techniques for calm and focus.',
        typeBadge: 'Hub',
      },
    ],
    faqs: [
      {
        question: 'What is the fastest way to calm down?',
        answer: 'A short breathing reset or grounding exercise can help your body settle quickly.',
      },
      {
        question: 'How often should I practise stress tools?',
        answer: 'Short daily practice helps build resilience over time.',
      },
      {
        question: 'Is stress always harmful?',
        answer: 'Short-term stress can be useful, but persistent stress needs recovery time.',
      },
      {
        question: 'Can these tools replace therapy?',
        answer: 'No. They are supportive strategies and not a replacement for professional care.',
      },
      {
        question: 'What if stress affects my sleep?',
        answer: 'Try wind-down routines and breathing before bed. Seek support if sleep issues persist.',
      },
      {
        question: 'How do I track my stress?',
        answer: 'Use short check-ins to note triggers, intensity, and recovery steps.',
      },
      {
        question: 'Do I need to be calm before practising?',
        answer: 'No. These tools can be used in the moment or as daily prevention.',
      },
      {
        question: 'Are these tools suitable for young people?',
        answer: 'Yes, with age-appropriate guidance and support from an adult.',
      },
    ],
  },
  {
    key: 'sleep',
    title: 'Sleep Support',
    path: '/sleep',
    description: 'Wind-down routines, sleep hygiene support, and calming tools.',
    clusters: [
      {
        href: '/tools/sleep-tools',
        label: 'Sleep Tools',
        description: 'Wind-down timers and calming prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/breath-tools',
        label: 'Breath Tools & Timers',
        description: 'Slow breathing to ease into sleep.',
        typeBadge: 'Tool',
      },
      {
        href: '/techniques/4-7-8',
        label: '4-7-8 Breathing',
        description: 'Evening pacing for relaxation.',
        typeBadge: 'Technique',
      },
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short calm practices before bed.',
        typeBadge: 'Guide',
      },
      {
        href: '/breathing/breath',
        label: 'Breathing Basics',
        description: 'Simple posture and pacing tips.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/roulette',
        label: 'Micro-Reset Roulette',
        description: 'Quick wind-down resets for restless evenings.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/techniques/sos-60',
        label: 'SOS 60 Setup',
        description: 'Rapid reset for anxious moments at night.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/wind-down-routine',
        label: 'Wind-down Routine',
        description: 'A short routine to help your mind slow down.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/sleep-reset-for-shift-workers',
        label: 'Sleep Reset for Shift Workers',
        description: 'Gentle steps for changing schedules.',
        typeBadge: 'Guide',
      },
    ],
    nextSteps: [
      {
        href: '/tools/sleep-tools',
        label: 'Open Sleep Tools',
        description: 'Use a wind-down timer and calming prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/techniques/4-7-8',
        label: 'Practise 4-7-8 Breathing',
        description: 'Try a short counted routine before bed.',
        typeBadge: 'Technique',
      },
      {
        href: '/breathing',
        label: 'Breathing Exercises Hub',
        description: 'Explore more calming techniques.',
        typeBadge: 'Hub',
      },
    ],
    faqs: [
      {
        question: 'How long should a wind-down routine be?',
        answer: 'Aim for 15–30 minutes of gentle, consistent steps before bed.',
      },
      {
        question: 'What if I wake up during the night?',
        answer: 'Try a short breathing reset and keep lighting low before returning to bed.',
      },
      {
        question: 'Can breathing help with sleep onset?',
        answer: 'Slow, steady breathing can help the body settle for rest.',
      },
      {
        question: 'Should I avoid screens before bed?',
        answer: 'Reducing screen time can help your body wind down.',
      },
      {
        question: 'Do naps affect night-time sleep?',
        answer: 'Long or late naps can make sleep onset harder for some people.',
      },
      {
        question: 'Is sleep tracking essential?',
        answer: 'It can help spot patterns, but simple notes are also useful.',
      },
      {
        question: 'What if sleep problems persist?',
        answer: 'Seek support from a healthcare professional if issues continue.',
      },
      {
        question: 'Are these tools suitable for young people?',
        answer: 'Yes, with age-appropriate routines and support from a caregiver.',
      },
    ],
  },
  {
    key: 'adhd',
    title: 'Focus & ADHD Support',
    path: '/adhd',
    description: 'Focus tools, routines, and evidence-informed ADHD guidance.',
    clusters: [
      {
        href: '/tools/adhd-tools',
        label: 'ADHD Tools & Focus Hub',
        description: 'Timers, routines, and focus supports.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/adhd-focus-lab',
        label: 'ADHD Focus Lab',
        description: 'Short focus games and breathing cues.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/focus-training',
        label: 'Focus Training',
        description: 'Structured focus sprints with recovery breaks.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/focus-tiles',
        label: 'Focus Tiles',
        description: 'Context-based focus suggestions.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/focus',
        label: 'Focus Breathing',
        description: 'Breathing patterns for attention stability.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/breath-tools',
        label: 'Breath Tools & Timers',
        description: 'Short breathing resets between tasks.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/adhd-deep-dive/what-is-adhd',
        label: 'What is ADHD?',
        description: 'Clear explanations and common misconceptions.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/adhd-deep-dive/support-at-home',
        label: 'ADHD Support at Home',
        description: 'Routines and practical home strategies.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/focus-sprints-for-adhd',
        label: 'Focus Sprints for ADHD',
        description: 'Short focus blocks with recovery cues.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/adhd-break-planning',
        label: 'ADHD Break Planning',
        description: 'Plan movement and reset breaks quickly.',
        typeBadge: 'Guide',
      },
    ],
    nextSteps: [
      {
        href: '/tools/adhd-focus-lab',
        label: 'Open ADHD Focus Lab',
        description: 'Try quick focus games and breathing prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/adhd-tools',
        label: 'Explore ADHD Tools',
        description: 'Find timers, routines, and visual supports.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/focus-sprints-for-adhd',
        label: 'Focus Sprints Guide',
        description: 'Short focus blocks with recovery cues.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/adhd-break-planning',
        label: 'Break Planning Guide',
        description: 'Plan simple, sustainable breaks.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'What is the best way to start focus training?',
        answer: 'Begin with short, timed focus blocks and clear break plans.',
      },
      {
        question: 'Can breathing help with ADHD focus?',
        answer: 'Steady breathing can reduce stress and support attention.',
      },
      {
        question: 'How long should a focus sprint be?',
        answer: 'Many people start with 10–15 minutes and adjust as needed.',
      },
      {
        question: 'Do I need a formal diagnosis to use these tools?',
        answer: 'No. These strategies are supportive and open to anyone who finds them helpful.',
      },
      {
        question: 'What if I struggle to keep routines?',
        answer: 'Keep routines small and flexible, and celebrate small wins.',
      },
      {
        question: 'Are these tools suitable for young people?',
        answer: 'Yes, with age-appropriate guidance from a caregiver or teacher.',
      },
      {
        question: 'Do these tools replace clinical support?',
        answer: 'No. They are educational tools and not a substitute for professional care.',
      },
      {
        question: 'Can I share progress with a teacher?',
        answer: 'You can use printable resources or summaries to share strategies.',
      },
    ],
  },
  {
    key: 'autism',
    title: 'Autism Support',
    path: '/autism',
    description: 'Evidence-informed autism tools, routines, and resources.',
    clusters: [
      {
        href: '/tools/autism-tools',
        label: 'Autism Tools & Support Hub',
        description: 'Visual supports, routines, and calming tools.',
        typeBadge: 'Tool',
      },
      {
        href: '/autism/focus-garden',
        label: 'Focus Garden',
        description: 'Gentle focus training with visual progress.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short grounding practices for sensory overload.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/colour-path',
        label: 'Colour-Path Breathing',
        description: 'Visual breathing cues for calm transitions.',
        typeBadge: 'Tool',
      },
      {
        href: '/resources',
        label: 'Resources Hub',
        description: 'Printable guides and templates.',
        typeBadge: 'Resource',
      },
      {
        href: '/downloads',
        label: 'Downloads & Resources',
        description: 'Downloadable routines and visual supports.',
        typeBadge: 'Resource',
      },
      {
        href: '/teacher-quick-pack',
        label: 'Teacher Quick Pack',
        description: 'Classroom-ready strategies and checklists.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/autism-sensory-reset',
        label: 'Autism Sensory Reset',
        description: 'A gentle plan for sensory overload moments.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/autism-transition-support',
        label: 'Autism Transition Support',
        description: 'Predictable steps for difficult transitions.',
        typeBadge: 'Guide',
      },
    ],
    nextSteps: [
      {
        href: '/tools/autism-tools',
        label: 'Open Autism Tools',
        description: 'Find visual supports and calming tools.',
        typeBadge: 'Tool',
      },
      {
        href: '/autism/focus-garden',
        label: 'Try Focus Garden',
        description: 'Practice focus skills with gentle tasks.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/autism-sensory-reset',
        label: 'Sensory Reset Guide',
        description: 'A gentle plan for overload moments.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/autism-transition-support',
        label: 'Transition Support Guide',
        description: 'Predictable steps for smoother transitions.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Are these tools suitable for all ages?',
        answer: 'Many tools can be adapted for children, teens, and adults.',
      },
      {
        question: 'Do the resources replace professional support?',
        answer: 'No. They are educational tools that can sit alongside professional guidance.',
      },
      {
        question: 'How can I support transitions?',
        answer: 'Use visual schedules, countdowns, and clear next steps.',
      },
      {
        question: 'What if sensory overload is frequent?',
        answer: 'Consider discussing support strategies with a qualified professional.',
      },
      {
        question: 'Can breathing help with regulation?',
        answer: 'Slow breathing can support calm and steadying the body.',
      },
      {
        question: 'Are the tools UK-focused?',
        answer: 'Yes, with UK context and references where available.',
      },
      {
        question: 'Do I need to log in to use tools?',
        answer: 'Many tools are available without logging in.',
      },
      {
        question: 'How do I choose the right tool?',
        answer: 'Start with the calm toolkit or the Focus Garden and adjust from there.',
      },
    ],
  },
  {
    key: 'dyslexia',
    title: 'Dyslexia & Reading Support',
    path: '/conditions/dyslexia',
    description: 'Reading support tools, routines, and classroom strategies.',
    clusters: [
      {
        href: '/dyslexia-reading-training',
        label: 'Dyslexia Reading Training',
        description: 'Multisensory reading practice and routines.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/dyslexia-parent',
        label: 'Dyslexia Parent Support',
        description: 'Home routines and confidence building.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/dyslexia-teacher',
        label: 'Dyslexia Teacher Support',
        description: 'Classroom adaptations and scaffolding.',
        typeBadge: 'Guide',
      },
      {
        href: '/conditions/dyslexia-carer',
        label: 'Dyslexia Carer Support',
        description: 'Daily routines and encouragement.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/focus-tiles',
        label: 'Focus Tiles',
        description: 'Quick focus prompts for reading practice.',
        typeBadge: 'Tool',
      },
      {
        href: '/downloads',
        label: 'Downloads & Resources',
        description: 'Printable reading and study aids.',
        typeBadge: 'Resource',
      },
      {
        href: '/teacher-quick-pack',
        label: 'Teacher Quick Pack',
        description: 'Classroom strategies in one pack.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/reading-routine-at-home',
        label: 'Reading Routine at Home',
        description: 'Short daily reading plan for families.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/reading-confidence-in-class',
        label: 'Reading Confidence in Class',
        description: 'Classroom confidence and participation tips.',
        typeBadge: 'Guide',
      },
    ],
    nextSteps: [
      {
        href: '/dyslexia-reading-training',
        label: 'Start Reading Training',
        description: 'Begin with multisensory reading routines.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/focus-tiles',
        label: 'Use Focus Tiles',
        description: 'Short prompts to keep reading sessions steady.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/reading-routine-at-home',
        label: 'Home Reading Guide',
        description: 'Short daily reading plan for families.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/reading-confidence-in-class',
        label: 'Classroom Confidence Guide',
        description: 'Support participation and confidence.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'What is dyslexia?',
        answer: 'Dyslexia is a common learning difference that affects reading and language processing.',
      },
      {
        question: 'Can dyslexia be diagnosed online?',
        answer: 'No. Only qualified professionals can provide a formal diagnosis.',
      },
      {
        question: 'What helps reading confidence?',
        answer: 'Short, consistent practice with supportive feedback works well.',
      },
      {
        question: 'Are the tools suitable for adults?',
        answer: 'Yes. Many strategies are useful across age groups.',
      },
      {
        question: 'What if school support is limited?',
        answer: 'Use home routines and share practical strategies with teachers where possible.',
      },
      {
        question: 'Do these resources replace specialist teaching?',
        answer: 'No. They are educational aids that can sit alongside specialist support.',
      },
      {
        question: 'How often should reading practice happen?',
        answer: 'Short daily practice is often more effective than long sessions.',
      },
      {
        question: 'Can breathing help reading focus?',
        answer: 'Calm breathing can help reduce anxiety before reading tasks.',
      },
    ],
  },
];

const buildRelatedForCluster = (pillar: PillarConfig, current: RelatedContentItem): RelatedContentItem[] => {
  const siblings = pillar.clusters.filter(item => item.href !== current.href).slice(0, 3);
  return [
    {
      href: pillar.path,
      label: pillar.title,
      description: pillar.description,
      typeBadge: 'Pillar',
    },
    ...siblings,
  ];
};

const NEXT_STEPS_OVERRIDES: Record<string, RelatedContentItem[]> = {
  '/tools/breath-tools': [
    {
      href: '/techniques/box-breathing',
      label: 'Box Breathing',
      description: 'Structured rhythm for calm and focus.',
      typeBadge: 'Technique',
    },
    {
      href: '/tools/focus-training',
      label: 'Focus Training',
      description: 'Pair breathing with short focus sprints.',
      typeBadge: 'Tool',
    },
    {
      href: '/breathing',
      label: 'Breathing Exercises Hub',
      description: 'Explore more guided techniques.',
      typeBadge: 'Hub',
    },
  ],
  '/tools/breath-ladder': [
    {
      href: '/techniques/coherent',
      label: 'Coherent Breathing',
      description: 'Slow, steady pacing for balance.',
      typeBadge: 'Technique',
    },
    {
      href: '/tools/focus-training',
      label: 'Focus Training',
      description: 'Short focus sprints with recovery.',
      typeBadge: 'Tool',
    },
    {
      href: '/breathing',
      label: 'Breathing Exercises Hub',
      description: 'Find more techniques and guides.',
      typeBadge: 'Hub',
    },
  ],
  '/tools/colour-path': [
    {
      href: '/breathing/mindfulness',
      label: 'Mindfulness Breathing',
      description: 'Short grounding practices.',
      typeBadge: 'Guide',
    },
    {
      href: '/tools/focus-training',
      label: 'Focus Training',
      description: 'Structured focus sprints with cues.',
      typeBadge: 'Tool',
    },
    {
      href: '/breathing',
      label: 'Breathing Exercises Hub',
      description: 'Explore more guided routines.',
      typeBadge: 'Hub',
    },
  ],
  '/tools/roulette': [
    {
      href: '/techniques/sos',
      label: '60-second SOS Breathing',
      description: 'Rapid reset technique for stress.',
      typeBadge: 'Technique',
    },
    {
      href: '/tools/focus-training',
      label: 'Focus Training',
      description: 'Pair resets with steady focus blocks.',
      typeBadge: 'Tool',
    },
    {
      href: '/breathing',
      label: 'Breathing Exercises Hub',
      description: 'Build a broader breathing routine.',
      typeBadge: 'Hub',
    },
  ],
};

export const CONTENT_SEO_PAGE_BLOCKS: Record<string, ContentSeoPageBlock> = PILLARS.reduce(
  (acc, pillar) => {
    acc[pillar.path] = {
      relatedTitle: `${pillar.title} cluster guides`,
      related: pillar.clusters,
      nextSteps: pillar.nextSteps,
      faqs: pillar.faqs,
      disclaimer: EDUCATIONAL_DISCLAIMER,
    };

    pillar.clusters.forEach(cluster => {
      acc[cluster.href] = {
        relatedTitle: `Related ${pillar.title} content`,
        related: buildRelatedForCluster(pillar, cluster),
        nextSteps: NEXT_STEPS_OVERRIDES[cluster.href] || pillar.nextSteps,
      };
    });

    return acc;
  },
  {} as Record<string, ContentSeoPageBlock>
);
