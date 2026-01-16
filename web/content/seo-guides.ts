import type { RelatedContentItem, FAQItem } from '@/lib/seo/content-seo';

export interface SeoGuide {
  slug: string;
  title: string;
  description: string;
  pillar: {
    label: string;
    href: string;
  };
  intent: 'guide' | 'tool' | 'faq';
  intro: string;
  steps: string[];
  practicalTips: string[];
  tryNow: {
    label: string;
    href: string;
  };
  related: RelatedContentItem[];
  faqs: FAQItem[];
}

export const SEO_GUIDES: SeoGuide[] = [
  {
    slug: 'quick-calm-in-5-minutes',
    title: 'Quick calm in 5 minutes',
    description: 'A short, practical reset using breathing, grounding, and gentle movement.',
    pillar: { label: 'Stress & Calm Support', href: '/stress' },
    intent: 'guide',
    intro:
      'Use this short routine when you feel overwhelmed or distracted. It is designed to lower stress quickly without needing special equipment.',
    steps: [
      'Find a comfortable seat and place your feet flat on the floor.',
      'Use a 4-count inhale and 6-count exhale for five rounds.',
      'Name three things you can see, two you can feel, and one you can hear.',
      'Stand and stretch your shoulders, neck, and hands.',
      'Finish with one slow breath and a simple next step: “I can do the next small thing.”',
    ],
    practicalTips: [
      'If you feel light-headed, slow the exhale and pause for a moment.',
      'Repeat this routine before meetings, exams, or transitions.',
      'Keep it brief — the consistency matters more than duration.',
    ],
    tryNow: {
      label: 'Try a 60-second reset',
      href: '/tools/roulette',
    },
    related: [
      {
        href: '/tools/stress-tools',
        label: 'Stress Tools',
        description: 'Breathing, grounding, and tracking in one hub.',
        typeBadge: 'Tool',
      },
      {
        href: '/breathing/techniques/sos-60',
        label: 'SOS 60 Setup',
        description: 'Fast breathing routine for acute stress.',
        typeBadge: 'Guide',
      },
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short practices for steady attention.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Can I use this routine during a panic spike?',
        answer: 'It can help you slow down, but seek professional support if panic is frequent.',
      },
      {
        question: 'Should I sit or stand?',
        answer: 'Either is fine. Choose a posture that feels stable and safe.',
      },
      {
        question: 'How often should I repeat this?',
        answer: 'Use it as needed and consider a daily practice for prevention.',
      },
    ],
  },
  {
    slug: 'body-scan-for-stress',
    title: 'Body scan for stress relief',
    description: 'A simple body scan to release tension and reset your attention.',
    pillar: { label: 'Stress & Calm Support', href: '/stress' },
    intent: 'guide',
    intro:
      'A body scan helps you notice where tension sits and gently relax those areas. It is useful after long work sessions or emotional moments.',
    steps: [
      'Start at your forehead and soften your jaw and shoulders.',
      'Breathe slowly and scan down to the chest and abdomen.',
      'Notice your hands and let them unclench.',
      'Scan down to hips, legs, and feet, releasing any tightness.',
      'Finish with one slow inhale and exhale.',
    ],
    practicalTips: [
      'If scanning feels difficult, try one area at a time.',
      'Pair the scan with a short breathing timer.',
      'Use the scan before sleep or after a stressful event.',
    ],
    tryNow: {
      label: 'Open Stress Tools',
      href: '/tools/stress-tools',
    },
    related: [
      {
        href: '/tools/anxiety-tools',
        label: 'Anxiety Toolkit',
        description: 'Grounding and calming prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/techniques/box-breathing',
        label: 'Box Breathing',
        description: 'Steady counted breathing for calm.',
        typeBadge: 'Technique',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick Calm in 5 Minutes',
        description: 'Short reset routine for busy days.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Is a body scan the same as meditation?',
        answer: 'It is a simple mindful practice, but you do not need to meditate to use it.',
      },
      {
        question: 'Can I do this at my desk?',
        answer: 'Yes, it can be done sitting down with minimal movement.',
      },
      {
        question: 'How long should it take?',
        answer: 'Start with 2–3 minutes and extend if it feels useful.',
      },
    ],
  },
  {
    slug: 'wind-down-routine',
    title: 'Wind-down routine for better sleep',
    description: 'A gentle evening routine to help you settle and switch off.',
    pillar: { label: 'Sleep Support', href: '/sleep' },
    intent: 'guide',
    intro:
      'A consistent wind-down routine signals that sleep is coming. Keep it simple and repeat it nightly.',
    steps: [
      'Dim lights and reduce screen time 30 minutes before bed.',
      'Use a short breathing practice with a calm pace.',
      'Do a brief tidy-up or prepare tomorrow’s essentials.',
      'Write down any worries or tasks for the next day.',
      'Finish with a gentle stretch or a warm drink.',
    ],
    practicalTips: [
      'Aim for the same routine even on weekends.',
      'Use calm audio or white noise if it helps.',
      'Keep the routine achievable on busy nights.',
    ],
    tryNow: {
      label: 'Open Sleep Tools',
      href: '/tools/sleep-tools',
    },
    related: [
      {
        href: '/techniques/4-7-8',
        label: '4-7-8 Breathing',
        description: 'Counted breathing for sleep onset.',
        typeBadge: 'Technique',
      },
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short calming practice before bed.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/sleep-reset-for-shift-workers',
        label: 'Sleep Reset for Shift Workers',
        description: 'Gentle adjustments for changing schedules.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Is the routine the same for everyone?',
        answer: 'No. Start with a few steps and adapt to your lifestyle.',
      },
      {
        question: 'What if I only have 10 minutes?',
        answer: 'Focus on breathing and a quick plan for the next day.',
      },
      {
        question: 'Should I avoid naps?',
        answer: 'Short naps are fine for some people, but late naps can disrupt sleep.',
      },
    ],
  },
  {
    slug: 'sleep-reset-for-shift-workers',
    title: 'Sleep reset for shift workers',
    description: 'Small steps to manage sleep when your schedule changes.',
    pillar: { label: 'Sleep Support', href: '/sleep' },
    intent: 'guide',
    intro:
      'Shift work can make sleep feel unpredictable. Use small changes to create a sense of rhythm.',
    steps: [
      'Choose a short pre-sleep routine you can repeat after any shift.',
      'Use blackout curtains or an eye mask for daytime sleep.',
      'Keep caffeine earlier in your shift if possible.',
      'Try a short breathing reset before bed.',
      'Track sleep patterns to notice what works.',
    ],
    practicalTips: [
      'Even small routines help your body recognise bedtime.',
      'Ask your employer about predictable scheduling where possible.',
      'If fatigue is severe, seek professional advice.',
    ],
    tryNow: {
      label: 'Use Breath Tools',
      href: '/tools/breath-tools',
    },
    related: [
      {
        href: '/tools/sleep-tools',
        label: 'Sleep Tools',
        description: 'Wind-down timers and calming prompts.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/wind-down-routine',
        label: 'Wind-down Routine',
        description: 'A consistent evening plan.',
        typeBadge: 'Guide',
      },
      {
        href: '/techniques/4-7-8',
        label: '4-7-8 Breathing',
        description: 'Counted breathing for relaxation.',
        typeBadge: 'Technique',
      },
    ],
    faqs: [
      {
        question: 'Is shift work harmful to sleep?',
        answer: 'It can be challenging, but routines and light management can help.',
      },
      {
        question: 'Should I use sleep trackers?',
        answer: 'They can help you notice patterns, but are not essential.',
      },
      {
        question: 'When should I seek help?',
        answer: 'If persistent fatigue affects safety or wellbeing, consult a professional.',
      },
    ],
  },
  {
    slug: 'focus-sprints-for-adhd',
    title: 'Focus sprints for ADHD',
    description: 'Short focus blocks with recovery breaks for sustained attention.',
    pillar: { label: 'Focus & ADHD Support', href: '/adhd' },
    intent: 'guide',
    intro:
      'Focus sprints are short, timed work blocks paired with planned breaks. They reduce overwhelm and make tasks feel more manageable.',
    steps: [
      'Pick one small task and set a 10–15 minute timer.',
      'Remove one distraction you can control (e.g. phone, tabs).',
      'Work until the timer ends, then take a 3–5 minute break.',
      'Use a breathing reset before the next sprint.',
      'Repeat for 2–4 cycles, then stop and review progress.',
    ],
    practicalTips: [
      'Start short and increase only if it feels sustainable.',
      'Use visual timers to reduce time blindness.',
      'Celebrate completion, not perfection.',
    ],
    tryNow: {
      label: 'Open Focus Training',
      href: '/tools/focus-training',
    },
    related: [
      {
        href: '/tools/adhd-focus-lab',
        label: 'ADHD Focus Lab',
        description: 'Short focus games and breathing cues.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/adhd-break-planning',
        label: 'ADHD Break Planning',
        description: 'Plan helpful breaks quickly.',
        typeBadge: 'Guide',
      },
      {
        href: '/breathing/focus',
        label: 'Focus Breathing',
        description: 'Breathing routines for attention stability.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Do focus sprints work for everyone?',
        answer: 'Many people find them helpful, but adjust timing to your needs.',
      },
      {
        question: 'What if I cannot start?',
        answer: 'Use a 2-minute starter task to get momentum.',
      },
      {
        question: 'Can I use focus sprints at school?',
        answer: 'Yes, with teacher agreement and clear break plans.',
      },
    ],
  },
  {
    slug: 'adhd-break-planning',
    title: 'ADHD break planning',
    description: 'Plan movement and reset breaks to sustain focus.',
    pillar: { label: 'Focus & ADHD Support', href: '/adhd' },
    intent: 'guide',
    intro:
      'Planned breaks make focus more sustainable. Keep them short and purposeful.',
    steps: [
      'Decide on a simple break menu (stretch, water, short walk).',
      'Set a timer for your focus block and a separate timer for breaks.',
      'Use breathing cues to shift between work and rest.',
      'Track which break types help you return to focus.',
    ],
    practicalTips: [
      'Movement breaks often help with attention.',
      'Keep breaks short so re-starting is easier.',
      'Use a visual cue to mark when a break starts.',
    ],
    tryNow: {
      label: 'Try Focus Tiles',
      href: '/tools/focus-tiles',
    },
    related: [
      {
        href: '/tools/adhd-tools',
        label: 'ADHD Tools & Focus Hub',
        description: 'Timers, routines, and focus supports.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/focus-sprints-for-adhd',
        label: 'Focus Sprints for ADHD',
        description: 'Short focus blocks with recovery cues.',
        typeBadge: 'Guide',
      },
      {
        href: '/breathing/focus',
        label: 'Focus Breathing',
        description: 'Breathing routines for attention stability.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How long should a break be?',
        answer: 'Many people start with 3–5 minutes and adjust as needed.',
      },
      {
        question: 'What if I lose focus after breaks?',
        answer: 'Use a quick breathing reset before starting again.',
      },
      {
        question: 'Can breaks be social?',
        answer: 'Yes, but keep them short so you can return to the task.',
      },
    ],
  },
  {
    slug: 'autism-sensory-reset',
    title: 'Autism sensory reset',
    description: 'A gentle plan for sensory overload moments.',
    pillar: { label: 'Autism Support', href: '/autism' },
    intent: 'guide',
    intro:
      'Sensory overload can be exhausting. This short plan helps create a calmer environment and predictable steps.',
    steps: [
      'Move to a quieter space if possible.',
      'Lower lights or reduce visual stimulation.',
      'Use a slow breathing pattern or a weighted item for grounding.',
      'Offer a simple choice: sit, walk, or use a calming tool.',
      'Re-enter the environment gradually when ready.',
    ],
    practicalTips: [
      'Keep a sensory kit ready (headphones, fidget, water).',
      'Use visual cues to signal what happens next.',
      'Adjust the plan based on the individual’s preferences.',
    ],
    tryNow: {
      label: 'Open Autism Tools',
      href: '/tools/autism-tools',
    },
    related: [
      {
        href: '/autism/focus-garden',
        label: 'Focus Garden',
        description: 'Gentle focus training with visual progress.',
        typeBadge: 'Tool',
      },
      {
        href: '/tools/colour-path',
        label: 'Colour-Path Breathing',
        description: 'Visual breathing cues for calm.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/autism-transition-support',
        label: 'Autism Transition Support',
        description: 'Predictable steps for transitions.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'What if the person does not want to move?',
        answer: 'Offer a calm choice and reduce sensory input where they are.',
      },
      {
        question: 'Are breathing exercises suitable for everyone?',
        answer: 'Many people find them helpful, but adapt to sensory preferences.',
      },
      {
        question: 'When should I seek professional advice?',
        answer: 'If overload is frequent or severe, consult a qualified professional.',
      },
    ],
  },
  {
    slug: 'autism-transition-support',
    title: 'Autism transition support',
    description: 'Predictable steps to make transitions smoother.',
    pillar: { label: 'Autism Support', href: '/autism' },
    intent: 'guide',
    intro:
      'Transitions can be difficult without clear steps. This guide focuses on predictability and gentle pacing.',
    steps: [
      'Give a simple warning (e.g. “5 minutes left”).',
      'Use a visual countdown or timer.',
      'Offer a clear next activity and choice if possible.',
      'Use a calming cue such as a breathing prompt.',
      'Praise the transition effort, not just the outcome.',
    ],
    practicalTips: [
      'Keep language consistent across caregivers.',
      'Use visuals or icons for the next step.',
      'Allow extra time when routines change.',
    ],
    tryNow: {
      label: 'Try Focus Garden',
      href: '/autism/focus-garden',
    },
    related: [
      {
        href: '/tools/autism-tools',
        label: 'Autism Tools & Support Hub',
        description: 'Visual supports and routines.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/autism-sensory-reset',
        label: 'Autism Sensory Reset',
        description: 'A gentle plan for overload moments.',
        typeBadge: 'Guide',
      },
      {
        href: '/resources',
        label: 'Resources Hub',
        description: 'Printable templates and guides.',
        typeBadge: 'Resource',
      },
    ],
    faqs: [
      {
        question: 'Do transitions get easier over time?',
        answer: 'Many people find predictability and practice helpful.',
      },
      {
        question: 'Should I use rewards?',
        answer: 'Positive reinforcement can help, but keep it simple and consistent.',
      },
      {
        question: 'What if a transition is unavoidable?',
        answer: 'Use clear cues and allow recovery time afterwards.',
      },
    ],
  },
  {
    slug: 'reading-routine-at-home',
    title: 'Reading routine at home',
    description: 'Short daily reading routines for dyslexia support.',
    pillar: { label: 'Dyslexia & Reading Support', href: '/conditions/dyslexia' },
    intent: 'guide',
    intro:
      'Short, consistent routines can build reading confidence. Keep sessions manageable and encouraging.',
    steps: [
      'Choose a consistent time and a quiet space.',
      'Start with a 3-minute warm-up (sounds, syllables, or word review).',
      'Read a short passage together, taking turns.',
      'Highlight one success and one goal for next time.',
    ],
    practicalTips: [
      'Use multisensory tools such as coloured overlays if helpful.',
      'Short daily practice is more effective than long sessions.',
      'Celebrate effort and persistence, not speed.',
    ],
    tryNow: {
      label: 'Start Reading Training',
      href: '/dyslexia-reading-training',
    },
    related: [
      {
        href: '/conditions/dyslexia-parent',
        label: 'Dyslexia Parent Support',
        description: 'Home routines and confidence building.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/reading-confidence-in-class',
        label: 'Reading Confidence in Class',
        description: 'Classroom confidence tips.',
        typeBadge: 'Guide',
      },
      {
        href: '/downloads',
        label: 'Downloads & Resources',
        description: 'Printable reading aids.',
        typeBadge: 'Resource',
      },
    ],
    faqs: [
      {
        question: 'How long should a reading session be?',
        answer: 'Start with 10–15 minutes and adjust to energy levels.',
      },
      {
        question: 'What if my child resists reading?',
        answer: 'Shorten sessions and use topics they enjoy.',
      },
      {
        question: 'Do I need specialist tools?',
        answer: 'No. Simple routines and encouragement help a lot.',
      },
    ],
  },
  {
    slug: 'reading-confidence-in-class',
    title: 'Reading confidence in class',
    description: 'Classroom strategies to support reading confidence and participation.',
    pillar: { label: 'Dyslexia & Reading Support', href: '/conditions/dyslexia' },
    intent: 'guide',
    intro:
      'Confidence grows when learners feel supported. These strategies help reduce anxiety around reading tasks.',
    steps: [
      'Give advance notice before reading aloud.',
      'Offer paired reading or silent preview time.',
      'Use clear, accessible fonts and spacing.',
      'Praise effort and progress rather than speed.',
    ],
    practicalTips: [
      'Offer choices for demonstrating understanding.',
      'Keep instructions short and repeat key steps.',
      'Work with SEND staff to align support.',
    ],
    tryNow: {
      label: 'Open Teacher Quick Pack',
      href: '/teacher-quick-pack',
    },
    related: [
      {
        href: '/conditions/dyslexia-teacher',
        label: 'Dyslexia Teacher Support',
        description: 'Classroom adaptations and scaffolding.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/reading-routine-at-home',
        label: 'Reading Routine at Home',
        description: 'Short daily reading plan.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/focus-tiles',
        label: 'Focus Tiles',
        description: 'Quick focus prompts for reading sessions.',
        typeBadge: 'Tool',
      },
    ],
    faqs: [
      {
        question: 'Should learners read aloud every day?',
        answer: 'Not necessarily. Variety helps, including silent reading and paired reading.',
      },
      {
        question: 'How do I reduce classroom anxiety?',
        answer: 'Use predictability, clear cues, and supportive feedback.',
      },
      {
        question: 'Do accommodations help all learners?',
        answer: 'Many adjustments benefit the whole class, not only dyslexic learners.',
      },
    ],
  },
  {
    slug: 'breathing-before-exams',
    title: 'Breathing before exams',
    description: 'A short breathing routine to steady focus before tests or assessments.',
    pillar: { label: 'Breathing Exercises', href: '/breathing' },
    intent: 'guide',
    intro:
      'Use this routine before an exam, interview, or performance to calm the body and focus attention.',
    steps: [
      'Sit upright and place your feet on the floor.',
      'Inhale for 4 counts, exhale for 6 counts (repeat five times).',
      'Use a brief shoulder roll to release tension.',
      'Finish with one slow breath and a simple plan for the first question.',
    ],
    practicalTips: [
      'Practise the routine once a day so it feels familiar.',
      'Keep your exhale longer than your inhale for calm.',
      'Use a silent count to stay focused.',
    ],
    tryNow: {
      label: 'Open Breath Tools',
      href: '/tools/breath-tools',
    },
    related: [
      {
        href: '/techniques/box-breathing',
        label: 'Box Breathing',
        description: 'Counted breathing for focus and calm.',
        typeBadge: 'Technique',
      },
      {
        href: '/breathing/focus',
        label: 'Focus Breathing',
        description: 'Breathing cues for concentration.',
        typeBadge: 'Guide',
      },
      {
        href: '/guides/quick-calm-in-5-minutes',
        label: 'Quick Calm in 5 Minutes',
        description: 'Short reset routine for busy days.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'How close to an exam should I do this?',
        answer: 'Try it 5–10 minutes before you begin.',
      },
      {
        question: 'Can I use it during the exam?',
        answer: 'Yes, use a slow exhale to reset between questions.',
      },
      {
        question: 'Will it make me sleepy?',
        answer: 'It should calm you without making you drowsy if kept brief.',
      },
    ],
  },
  {
    slug: 'breathing-for-sensory-overload',
    title: 'Breathing for sensory overload',
    description: 'Gentle breathing steps to support regulation during sensory overwhelm.',
    pillar: { label: 'Breathing Exercises', href: '/breathing' },
    intent: 'guide',
    intro:
      'When sensory input feels too much, short, gentle breathing can help reduce intensity and bring focus back to the body.',
    steps: [
      'Find a quieter spot or reduce sensory input if possible.',
      'Breathe in through the nose for 3 counts, out for 5 counts.',
      'Use a visual cue (colour path or timer) if helpful.',
      'Repeat for 60–90 seconds and pause to check how you feel.',
    ],
    practicalTips: [
      'Keep breathing soft — avoid forcing a deep breath.',
      'Pair breathing with a calming object or weighted item.',
      'Adapt pace based on comfort.',
    ],
    tryNow: {
      label: 'Try Colour-Path Breathing',
      href: '/tools/colour-path',
    },
    related: [
      {
        href: '/breathing/mindfulness',
        label: 'Mindfulness Breathing',
        description: 'Short grounding practices.',
        typeBadge: 'Guide',
      },
      {
        href: '/tools/colour-path',
        label: 'Colour-Path Breathing',
        description: 'Visual cue breathing tool.',
        typeBadge: 'Tool',
      },
      {
        href: '/guides/autism-sensory-reset',
        label: 'Autism Sensory Reset',
        description: 'A calm plan for sensory overload.',
        typeBadge: 'Guide',
      },
    ],
    faqs: [
      {
        question: 'Should breathing be slow or deep?',
        answer: 'Keep it gentle and steady; comfort comes first.',
      },
      {
        question: 'Can I use music or headphones?',
        answer: 'Yes, if it helps reduce sensory input.',
      },
      {
        question: 'What if breathing feels hard?',
        answer: 'Stop and use other grounding methods such as pressure or movement.',
      },
    ],
  },
];

export const SEO_GUIDES_MAP = new Map(SEO_GUIDES.map(guide => [guide.slug, guide]));
