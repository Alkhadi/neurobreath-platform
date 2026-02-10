import type { RelatedContentItem } from '@/components/seo/RelatedContent';
import type { FaqItem } from '@/lib/seo/faq-schema';

export type PillarKey =
  | 'breathing'
  | 'focus-adhd'
  | 'anxiety-stress'
  | 'sleep'
  | 'dyslexia-reading'
  | 'autism-support';

export type ContentSection = { heading: string; body: string[] };

export type Cluster = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  sections: ContentSection[];
  tryNow: { href: string; label: string };
  siblingSlugs: string[];
  miniFaqs?: FaqItem[];
};

export type Pillar = {
  key: PillarKey;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  startHere: { href: string; label: string };
  clusters: Cluster[];
  faqs: FaqItem[];
  relatedAcrossSite: RelatedContentItem[];
};

const tools = {
  breathTools: { href: '/tools/breath-tools', label: 'Try the Breathing Tools' },
  breathLadder: { href: '/tools/breath-ladder', label: 'Use the Breath Ladder' },
  focusTraining: { href: '/tools/focus-training', label: 'Start Focus Training' },
  adhdTools: { href: '/tools/adhd-tools', label: 'Explore ADHD Tools' },
  adhdFocusLab: { href: '/tools/adhd-focus-lab', label: 'Open the ADHD Focus Lab' },
  anxietyTools: { href: '/tools/anxiety-tools', label: 'Open the Anxiety Toolkit' },
  stressTools: { href: '/tools/stress-tools', label: 'Open Stress Tools' },
  sleepTools: { href: '/tools/sleep-tools', label: 'Open Sleep Tools' },
  autismTools: { href: '/tools/autism-tools', label: 'Explore Autism Tools' },
  dyslexiaTraining: { href: '/dyslexia-reading-training', label: 'Open Dyslexia Reading Training' },
};

export const PILLARS: Pillar[] = [
  {
    key: 'breathing',
    title: 'Breathing Exercises',
    description:
      'Practical breathing guidance for calm, focus, stress and sleep. Educational information only with clear next steps.',
    h1: 'Breathing exercises for calm, focus and sleep',
    intro: [
      'These guides explain breathing techniques in plain UK English so you can choose the right method for the moment.',
      'Use the tool first if you want a guided experience, then return to the guides to build a routine.',
    ],
    startHere: tools.breathTools,
    clusters: [
      {
        slug: 'box-breathing',
        title: 'Box breathing step-by-step',
        description: 'A simple four-count pattern for calm and steady focus.',
        h1: 'How to do box breathing',
        intro: [
          'Box breathing uses a consistent rhythm: inhale, hold, exhale, hold. It is easy to learn and reliable for quick resets.',
          'Start with shorter counts if holding feels difficult.',
        ],
        sections: [
          {
            heading: 'The basic pattern',
            body: [
              'Inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat 4–6 rounds.',
              'If 4 feels too long, start with 3 and build up as it becomes comfortable.',
            ],
          },
          {
            heading: 'When to use it',
            body: [
              'Before exams, meetings, or a focused work block.',
              'Use a timer so you can follow prompts rather than counting.',
            ],
          },
        ],
        tryNow: tools.breathTools,
        siblingSlugs: ['4-7-8-breathing', 'coherent-breathing', 'sos-breathing-60'],
        miniFaqs: [
          { question: 'How long should I do box breathing?', answer: 'Start with 1–2 minutes and increase if it feels comfortable.' },
          { question: 'What if I cannot hold my breath?', answer: 'Reduce the count or skip the holds until it feels easier.' },
          { question: 'Can children use this?', answer: 'Yes, with shorter counts and calm guidance.' },
        ],
      },
      {
        slug: '4-7-8-breathing',
        title: '4-7-8 breathing explained',
        description: 'A paced breathing method often used for relaxation at night.',
        h1: '4-7-8 breathing in plain language',
        intro: [
          'This pattern slows the breath and can support relaxation as part of a wind-down routine.',
          'Keep the pace gentle; comfort is more important than perfect counts.',
        ],
        sections: [
          {
            heading: 'How to practise',
            body: [
              'Inhale for 4, hold for 7, exhale for 8. Repeat 3–4 rounds.',
              'Shorten the hold if needed while keeping the exhale longer than the inhale.',
            ],
          },
          {
            heading: 'Best use cases',
            body: [
              'At bedtime, after screen time, or during an evening wind-down.',
              'Avoid forcing your breath if you feel uncomfortable.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['breathing-for-sleep', 'coherent-breathing', 'box-breathing'],
        miniFaqs: [
          { question: 'Will this make me sleepy?', answer: 'It may feel calming, but the effect is different for everyone.' },
          { question: 'Can I use shorter counts?', answer: 'Yes. Keep the exhale longer than the inhale.' },
          { question: 'Is it safe to do daily?', answer: 'For most people it is fine, but stop if you feel dizzy.' },
        ],
      },
      {
        slug: 'coherent-breathing',
        title: 'Coherent breathing for steady calm',
        description: 'A slow, even rhythm designed for steadiness rather than urgency.',
        h1: 'Coherent breathing in a simple rhythm',
        intro: [
          'Coherent breathing is a slow, steady pace that many people find grounding.',
          'It works well as a daily practice to build calm consistency.',
        ],
        sections: [
          {
            heading: 'Start with a steady pace',
            body: [
              'Try inhale for 5, exhale for 5. Continue for 3–5 minutes.',
              'If 5 feels too long, use 4 and build up over time.',
            ],
          },
          {
            heading: 'Make it easier',
            body: [
              'Keep shoulders relaxed and breathe softly through the nose if comfortable.',
              'Use a guided timer so you do not need to count.',
            ],
          },
        ],
        tryNow: tools.breathLadder,
        siblingSlugs: ['box-breathing', 'breathing-for-focus', '4-7-8-breathing'],
        miniFaqs: [
          { question: 'Is coherent breathing the same as box breathing?', answer: 'No. Coherent breathing is a smooth inhale/exhale without holds.' },
          { question: 'How long should I practise?', answer: 'Start with 3–5 minutes and adjust to comfort.' },
          { question: 'Can I do it while walking?', answer: 'Yes, as long as it feels safe and steady.' },
        ],
      },
      {
        slug: 'sos-breathing-60',
        title: '60-second SOS breathing',
        description: 'A quick reset for acute stress or overwhelm.',
        h1: 'A one-minute breathing reset',
        intro: [
          'When you feel overwhelmed, a short reset can help you regain control.',
          'This method is designed to be practical and easy to start.',
        ],
        sections: [
          {
            heading: 'The 60-second pattern',
            body: [
              'Breathe in for 3, breathe out for 5. Repeat for one minute.',
              'Keep the breath soft and allow the exhale to slow down naturally.',
            ],
          },
          {
            heading: 'Add a grounding step',
            body: [
              'Name three things you can see and two things you can feel.',
              'Choose one small next action you can do right now.',
            ],
          },
        ],
        tryNow: { href: '/breathing/techniques/sos-60', label: 'Open the SOS 60 tool' },
        siblingSlugs: ['box-breathing', 'breathing-for-focus', '4-7-8-breathing'],
        miniFaqs: [
          { question: 'Is this a substitute for professional care?', answer: 'No. It is a short self-help tool.' },
          { question: 'Can I repeat it?', answer: 'Yes, repeat for another minute if helpful.' },
          { question: 'What if I feel worse?', answer: 'Stop, return to normal breathing, and seek support if needed.' },
        ],
      },
      {
        slug: 'breathing-for-focus',
        title: 'Breathing for focus',
        description: 'A short routine to reduce mental noise before starting a task.',
        h1: 'Breathing to help you focus',
        intro: [
          'Starting is often the hardest part. A brief breathing reset can lower the friction.',
          'Use this routine before a short focus sprint.',
        ],
        sections: [
          {
            heading: 'Two-minute start routine',
            body: [
              'Take six breaths: inhale 4, exhale 6.',
              'Pick one small task and set a 10–15 minute timer.',
            ],
          },
          {
            heading: 'Keep it realistic',
            body: [
              'Short and repeatable beats long and inconsistent.',
              'Use a visual timer to reduce time blindness.',
            ],
          },
        ],
        tryNow: tools.focusTraining,
        siblingSlugs: ['box-breathing', 'coherent-breathing', 'breathing-for-sleep'],
        miniFaqs: [
          { question: 'Do I need to focus for 25 minutes?', answer: 'No. Start with a shorter sprint that feels doable.' },
          { question: 'Can I use this at school?', answer: 'Yes, with teacher agreement and a quiet cue.' },
          { question: 'Is this helpful for ADHD?', answer: 'Many people find it useful, but adjust to your needs.' },
        ],
      },
      {
        slug: 'breathing-for-sleep',
        title: 'Breathing for sleep',
        description: 'A calm breathing routine to support sleep onset.',
        h1: 'Breathing to support sleep',
        intro: [
          'Sleep routines work best when they are simple and consistent.',
          'This guide explains a gentle breathing wind-down you can repeat nightly.',
        ],
        sections: [
          {
            heading: 'A gentle wind-down pace',
            body: [
              'Try inhale 4, exhale 6 for 3–5 minutes.',
              'Keep the breath soft rather than deep or forced.',
            ],
          },
          {
            heading: 'Support the routine',
            body: [
              'Dim lights and reduce screen time before bed.',
              'If worries appear, write them down and return to the routine.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['4-7-8-breathing', 'coherent-breathing', 'box-breathing'],
        miniFaqs: [
          { question: 'How long before bed should I practise?', answer: 'Try 15–30 minutes before sleep as part of your routine.' },
          { question: 'Is this okay for teens?', answer: 'Yes, with age-appropriate timing.' },
          { question: 'What if I feel restless?', answer: 'Shorten the routine and focus on a slower exhale.' },
        ],
      },
    ],
    faqs: [
      { question: 'Do breathing exercises work for everyone?', answer: 'Many people find them helpful, but responses vary. Start gently and keep it practical.' },
      { question: 'How long should I practise?', answer: 'Aim for 2–5 minutes to begin. Consistency matters more than long sessions.' },
      { question: 'What if I feel light-headed?', answer: 'Stop and return to normal breathing. Use shorter counts next time.' },
      { question: 'Is nose breathing required?', answer: 'Not always. Nose breathing can feel steadier, but comfort comes first.' },
      { question: 'Which method is best for panic?', answer: 'A simple slow exhale and grounding steps are often a practical first option.' },
      { question: 'Can children use these techniques?', answer: 'Yes, with shorter counts and calm guidance.' },
      { question: 'Do I need to sit still?', answer: 'No. Some people prefer walking slowly while breathing evenly.' },
      { question: 'How do I stop overthinking the counts?', answer: 'Use a guided tool or timer so you can follow prompts.' },
      { question: 'How often should I practise?', answer: 'Daily practice helps, especially before predictable stress points.' },
      { question: 'Is this medical advice?', answer: 'No. It is educational information only.' },
    ],
    relatedAcrossSite: [
      { href: '/guides/focus-adhd', label: 'Focus & ADHD support', description: 'Focus routines and tools for attention.', typeBadge: 'Guide' },
      { href: '/guides/anxiety-stress', label: 'Anxiety & stress guides', description: 'Grounding and calm routines.', typeBadge: 'Guide' },
      { href: '/guides/sleep', label: 'Sleep support guides', description: 'Wind-down routines and sleep tools.', typeBadge: 'Guide' },
    ],
  },
  {
    key: 'focus-adhd',
    title: 'Focus & ADHD Support',
    description:
      'Guidance for focus, ADHD routines and classroom support, with practical tools and short steps.',
    h1: 'Focus and ADHD support guides',
    intro: [
      'These guides focus on practical steps: starting tasks, planning breaks, and working with schools.',
      'Use the tools to practise, then return here to build your routine.',
    ],
    startHere: tools.adhdFocusLab,
    clusters: [
      {
        slug: 'adhd-focus-basics',
        title: 'ADHD focus basics',
        description: 'A simple overview of what helps focus when attention is scattered.',
        h1: 'ADHD focus basics you can use today',
        intro: [
          'Focus improves when the task feels smaller and the environment is simpler.',
          'This guide covers the fundamentals and links to short tools.',
        ],
        sections: [
          {
            heading: 'Reduce the starting barrier',
            body: [
              'Pick a task that takes 5 minutes or less to begin.',
              'Remove one distraction you can control (tabs, phone, noise).',
            ],
          },
          {
            heading: 'Use short sprints',
            body: [
              'Set a 10–15 minute timer and focus on one outcome.',
              'Plan the next break before you start.',
            ],
          },
        ],
        tryNow: tools.focusTraining,
        siblingSlugs: ['focus-sprints', 'distraction-reset', 'planning-with-adhd'],
        miniFaqs: [
          { question: 'Do I need long sessions?', answer: 'No. Short, repeatable sprints often work better.' },
          { question: 'What if I lose focus quickly?', answer: 'Reduce the sprint length and add a planned break.' },
          { question: 'Is this only for ADHD?', answer: 'These methods can help many people, not just those with ADHD.' },
        ],
      },
      {
        slug: 'focus-sprints',
        title: 'Focus sprints that feel doable',
        description: 'Short focus blocks with recovery breaks.',
        h1: 'Focus sprints for ADHD',
        intro: [
          'Focus sprints are short blocks of work with planned recovery.',
          'They reduce overwhelm and make starting easier.',
        ],
        sections: [
          {
            heading: 'Choose a sprint length',
            body: [
              'Start with 10–15 minutes and adjust to your energy.',
              'Use a timer so you do not have to monitor the clock.',
            ],
          },
          {
            heading: 'Plan the break',
            body: [
              'Breaks are part of the system, not a reward.',
              'Pick a short reset (stretch, water, breathing).',
            ],
          },
        ],
        tryNow: tools.focusTraining,
        siblingSlugs: ['adhd-focus-basics', 'distraction-reset', 'adhd-parent-support'],
        miniFaqs: [
          { question: 'How many sprints should I do?', answer: 'Start with 2–3 and stop while you still feel okay.' },
          { question: 'Do I need a Pomodoro timer?', answer: 'Any timer works; focus on consistency rather than brand.' },
          { question: 'What if I forget my break?', answer: 'Set a separate timer for breaks.' },
        ],
      },
      {
        slug: 'distraction-reset',
        title: 'Distraction reset plan',
        description: 'A quick routine to reset after a focus slip.',
        h1: 'What to do when you get distracted',
        intro: [
          'Distractions are normal. The key is a quick return plan.',
          'This guide offers a short reset you can repeat.',
        ],
        sections: [
          {
            heading: 'The reset in 60 seconds',
            body: [
              'Stand, breathe out slowly, and name your next tiny action.',
              'Close or move one distraction away before restarting.',
            ],
          },
          {
            heading: 'Prevent repeat slips',
            body: [
              'Keep a visible task list with one active task.',
              'Use a focus timer to support the restart.',
            ],
          },
        ],
        tryNow: tools.adhdTools,
        siblingSlugs: ['adhd-focus-basics', 'focus-sprints', 'planning-with-adhd'],
        miniFaqs: [
          { question: 'Is it bad to get distracted?', answer: 'No. The goal is to return quickly, not to be perfect.' },
          { question: 'Should I block every distraction?', answer: 'Start with one or two that matter most.' },
          { question: 'Can breathing help?', answer: 'Yes, a slow exhale can help you reset.' },
        ],
      },
      {
        slug: 'planning-with-adhd',
        title: 'Planning with ADHD',
        description: 'Simple planning steps that reduce overwhelm.',
        h1: 'Planning routines for ADHD brains',
        intro: [
          'Planning works best when it is short and visible.',
          'Use small steps and revisit the plan daily.',
        ],
        sections: [
          {
            heading: 'Keep plans short',
            body: [
              'Limit your daily plan to 3 key tasks.',
              'Use checklists or visual trackers for quick wins.',
            ],
          },
          {
            heading: 'Link tasks to time',
            body: [
              'Pair tasks with a specific time or routine cue.',
              'Use a timer to avoid time blindness.',
            ],
          },
        ],
        tryNow: tools.adhdTools,
        siblingSlugs: ['adhd-focus-basics', 'focus-sprints', 'working-with-school-adhd'],
        miniFaqs: [
          { question: 'Do I need a full planner?', answer: 'Not necessarily. A short list often works better.' },
          { question: 'What if I forget the plan?', answer: 'Use a visible cue in the space you work in.' },
          { question: 'Can planning reduce anxiety?', answer: 'It can help reduce uncertainty and task overload.' },
        ],
      },
      {
        slug: 'working-with-school-adhd',
        title: 'Working with school (ADHD)',
        description: 'How to collaborate with schools using clear, practical steps.',
        h1: 'ADHD support at school',
        intro: [
          'School support works best when it is specific and collaborative.',
          'This guide helps you prepare clear requests and next steps.',
        ],
        sections: [
          {
            heading: 'Prepare a short summary',
            body: [
              'List the main challenges and what helps at home.',
              'Bring examples of tools or routines that already work.',
            ],
          },
          {
            heading: 'Request practical adjustments',
            body: [
              'Ask for movement breaks, clear instructions, and check-ins.',
              'Agree a review date to see what changes are helping.',
            ],
          },
        ],
        tryNow: tools.adhdTools,
        siblingSlugs: ['adhd-parent-support', 'planning-with-adhd', 'adhd-focus-basics'],
        miniFaqs: [
          { question: 'Do I need a diagnosis?', answer: 'Support can still be discussed without a formal diagnosis.' },
          { question: 'Should I ask for a meeting?', answer: 'Yes, a short structured meeting helps align expectations.' },
          { question: 'What if support is limited?', answer: 'Focus on small, practical changes that are realistic.' },
        ],
      },
      {
        slug: 'adhd-parent-support',
        title: 'ADHD parent support',
        description: 'Practical next steps for parents and carers.',
        h1: 'Support for parents and carers',
        intro: [
          'Parents and carers often need clear, manageable routines.',
          'This guide focuses on structure, communication, and support.',
        ],
        sections: [
          {
            heading: 'Build short routines',
            body: [
              'Keep routines small and repeatable.',
              'Use visual reminders and simple rewards where appropriate.',
            ],
          },
          {
            heading: 'Support your own wellbeing',
            body: [
              'Plan short breaks for yourself and seek support when needed.',
              'Use quick breathing resets in high-stress moments.',
            ],
          },
        ],
        tryNow: tools.adhdFocusLab,
        siblingSlugs: ['adhd-focus-basics', 'working-with-school-adhd', 'planning-with-adhd'],
        miniFaqs: [
          { question: 'Is consistency more important than length?', answer: 'Yes, short routines done often are effective.' },
          { question: 'What if routines fail?', answer: 'Reset and simplify; small steps are still progress.' },
          { question: 'Where can I find more resources?', answer: 'Use school support pages and evidence-based resources.' },
        ],
      },
      {
        slug: 'focus-test-anxiety',
        title: 'Focus & test anxiety support',
        description: 'Practical strategies for managing focus and anxiety during tests and exams.',
        h1: 'Focus and test anxiety: what helps',
        intro: [
          'Test anxiety combines worry, physical tension, and focus challenges.',
          'This guide offers practical steps for before, during, and after tests.',
        ],
        sections: [
          {
            heading: 'What test anxiety feels like',
            body: [
              'Worry about performance, fear of failure, or going blank.',
              'Physical symptoms: racing heart, sweating, nausea, or muscle tension.',
              'Difficulty concentrating, reading questions, or recalling information.',
            ],
          },
          {
            heading: 'Before the test',
            body: [
              'Use short study sprints (15-20 mins) with breaks to avoid burnout.',
              'Practice breathing exercises daily to build a calm routine.',
              'Sleep well the night before and eat a steady meal.',
              'Prepare materials in advance to reduce morning stress.',
            ],
          },
          {
            heading: 'During the test',
            body: [
              'Start with slow breathing: breathe out for 6 counts, repeat 3 times.',
              'Read instructions carefully and mark questions you know first.',
              'If panic rises, pause, breathe, and return when steadier.',
              'Use grounding: press feet to floor, notice your surroundings.',
            ],
          },
          {
            heading: 'After the test',
            body: [
              'Acknowledge the effort, regardless of outcome.',
              'Use a short reset routine: breathe, move, and drink water.',
              'Avoid dwelling on mistakes; focus on recovery and next steps.',
            ],
          },
          {
            heading: 'When to seek help',
            body: [
              'If test anxiety is severe or avoiding exams entirely.',
              'Contact your school, college, or GP for assessment and support options.',
              'Reasonable adjustments (extra time, breaks) may be available.',
            ],
          },
          {
            heading: 'Sources',
            body: [
              'NHS: Exam stress guidance (www.nhs.uk)',
              'YoungMinds: Exam stress support (www.youngminds.org.uk)',
            ],
          },
        ],
        tryNow: tools.focusTraining,
        siblingSlugs: ['adhd-focus-basics', 'focus-sprints', 'distraction-reset'],
        miniFaqs: [
          { question: 'Is test anxiety normal?', answer: 'Yes, many people experience it. Support can help.' },
          { question: 'Can breathing help during a test?', answer: 'Yes, slow breathing can reduce physical arousal and improve focus.' },
          { question: 'Should I ask for accommodations?', answer: 'Yes, if anxiety significantly affects performance.' },
        ],
      },
    ],
    faqs: [
      { question: 'Do I need a diagnosis to use these guides?', answer: 'No. The guidance is educational and can help many people.' },
      { question: 'How long should a focus sprint be?', answer: 'Start with 10–15 minutes and adjust to your energy.' },
      { question: 'Are these tools suitable for teens?', answer: 'Yes, with age-appropriate adjustments and support.' },
      { question: 'Can breathing help focus?', answer: 'Many people find that steady breathing reduces stress and improves concentration.' },
      { question: 'What if I cannot start tasks?', answer: 'Use a two-minute starter task and a short timer.' },
      { question: 'Are breaks part of the plan?', answer: 'Yes. Planned breaks make focus more sustainable.' },
      { question: 'Do these replace clinical support?', answer: 'No. They are educational tools only.' },
      { question: 'Can I share this with school staff?', answer: 'Yes, especially the practical routines and adjustments.' },
      { question: 'What if routines feel overwhelming?', answer: 'Reduce the number of steps and focus on one habit at a time.' },
      { question: 'Is this UK-specific?', answer: 'Yes, references and tone are UK-focused where possible.' },
    ],
    relatedAcrossSite: [
      { href: '/guides/breathing', label: 'Breathing exercises', description: 'Quick breathing routines for calm and focus.', typeBadge: 'Guide' },
      { href: '/guides/anxiety-stress', label: 'Anxiety & stress support', description: 'Grounding and reset routines.', typeBadge: 'Guide' },
      { href: '/guides/sleep', label: 'Sleep support', description: 'Wind-down routines and sleep tools.', typeBadge: 'Guide' },
    ],
  },
  {
    key: 'anxiety-stress',
    title: 'Anxiety & Stress Support',
    description:
      'Calm routines, grounding steps and practical guidance for stress and anxiety. Educational information only.',
    h1: 'Anxiety and stress support guides',
    intro: [
      'Use these guides for quick calming steps and longer-term routines.',
      'If anxiety is persistent or severe, seek professional support.',
    ],
    startHere: tools.stressTools,
    clusters: [
      {
        slug: 'grounding-5-4-3-2-1',
        title: 'Grounding 5-4-3-2-1',
        description: 'A sensory grounding technique for quick calm.',
        h1: 'How to use 5-4-3-2-1 grounding',
        intro: [
          'This method brings attention back to the present using your senses.',
          'It is simple and can be used anywhere.',
        ],
        sections: [
          {
            heading: 'The steps',
            body: [
              'Name 5 things you can see, 4 you can feel, 3 you can hear, 2 you can smell, and 1 you can taste.',
              'Go slowly and stay curious rather than judgemental.',
            ],
          },
          {
            heading: 'Pair with breathing',
            body: [
              'Add a slow exhale to reduce physical tension.',
              'Use a short timer if you prefer guided pacing.',
            ],
          },
        ],
        tryNow: tools.anxietyTools,
        siblingSlugs: ['panic-what-to-do-first', 'breathing-for-anxiety', 'stress-reset-routine'],
        miniFaqs: [
          { question: 'Does this work during a panic spike?', answer: 'It can help reduce intensity, but seek support if panic is frequent.' },
          { question: 'What if I cannot find smells or tastes?', answer: 'Focus on the senses that are available to you.' },
          { question: 'How long does it take?', answer: 'Often 1–3 minutes, depending on your pace.' },
        ],
      },
      {
        slug: 'panic-what-to-do-first',
        title: 'Panic: what to do first',
        description: 'Immediate steps to steady the body during a panic spike.',
        h1: 'What to do first during panic',
        intro: [
          'Panic feels intense but is not dangerous. Small steps can help the body settle.',
          'This guide focuses on practical first actions.',
        ],
        sections: [
          {
            heading: 'First minute steps',
            body: [
              'Slow your exhale and name the moment: “This is panic, it will pass.”',
              'Plant your feet and look around for three neutral objects.',
            ],
          },
          {
            heading: 'After the peak',
            body: [
              'Sip water and sit in a steady position.',
              'Use a gentle breathing timer to ease your body back to baseline.',
            ],
          },
        ],
        tryNow: { href: '/breathing/techniques/sos-60', label: 'Open the SOS 60 breathing tool' },
        siblingSlugs: ['grounding-5-4-3-2-1', 'breathing-for-anxiety', 'when-to-seek-support-uk'],
        miniFaqs: [
          { question: 'Should I call someone?', answer: 'If you feel unsafe or overwhelmed, reach out to a trusted person or professional.' },
          { question: 'Is panic a heart problem?', answer: 'Panic can feel physical; seek medical advice if you are unsure.' },
          { question: 'How long does panic last?', answer: 'Panic peaks quickly for many people and then fades.' },
        ],
      },
      {
        slug: 'breathing-for-anxiety',
        title: 'Breathing for anxiety',
        description: 'Simple breathing steps to reduce tension and worry.',
        h1: 'Breathing routines for anxiety',
        intro: [
          'Breathing can help reduce the physical intensity of anxiety.',
          'Start with gentle, steady exhalations rather than deep breaths.',
        ],
        sections: [
          {
            heading: 'A calm breathing pattern',
            body: [
              'Inhale for 4, exhale for 6. Repeat for 2–4 minutes.',
              'Pause if you feel dizzy and return to a natural pace.',
            ],
          },
          {
            heading: 'Combine with grounding',
            body: [
              'Use the 5-4-3-2-1 grounding method alongside breathing.',
              'This helps shift attention away from racing thoughts.',
            ],
          },
        ],
        tryNow: tools.anxietyTools,
        siblingSlugs: ['grounding-5-4-3-2-1', 'stress-reset-routine', 'worry-time-technique'],
        miniFaqs: [
          { question: 'Should I breathe deeply?', answer: 'Not necessarily. Gentle, steady breathing is often more comfortable.' },
          { question: 'Is box breathing better?', answer: 'Some people prefer box breathing; try both and see what feels best.' },
          { question: 'Can this replace therapy?', answer: 'No. It is a short supportive practice.' },
        ],
      },
      {
        slug: 'stress-reset-routine',
        title: 'Stress reset routine',
        description: 'A short routine for calming the body and mind.',
        h1: 'A simple stress reset routine',
        intro: [
          'This routine combines breathing, movement and a clear next step.',
          'Use it when you feel overloaded or stuck.',
        ],
        sections: [
          {
            heading: 'Reset in 5 steps',
            body: [
              'Breathe out slowly for 10 seconds, then do 4 slow breaths.',
              'Stand, stretch shoulders and hands, and drink water.',
            ],
          },
          {
            heading: 'Choose one next action',
            body: [
              'Pick the smallest task you can complete in 5–10 minutes.',
              'Use a timer to support follow-through.',
            ],
          },
        ],
        tryNow: tools.stressTools,
        siblingSlugs: ['breathing-for-anxiety', 'grounding-5-4-3-2-1', 'worry-time-technique'],
        miniFaqs: [
          { question: 'How often can I use this?', answer: 'As often as needed. Keep it short and gentle.' },
          { question: 'Should I move if I feel tense?', answer: 'Light movement can help release tension for many people.' },
          { question: 'What if I feel overwhelmed again?', answer: 'Repeat the routine and reduce your task size further.' },
        ],
      },
      {
        slug: 'worry-time-technique',
        title: 'Worry time technique',
        description: 'A structured way to reduce constant worry loops.',
        h1: 'How to use worry time',
        intro: [
          'Worry time is a technique that limits worry to a short, planned window.',
          'It can help reduce rumination throughout the day.',
        ],
        sections: [
          {
            heading: 'Set a short window',
            body: [
              'Choose a 10–15 minute slot in the afternoon.',
              'Write worries down and return to them only during that window.',
            ],
          },
          {
            heading: 'End with a next step',
            body: [
              'If action is possible, write one practical step.',
              'If not, write “not solvable today” and close the list.',
            ],
          },
        ],
        tryNow: tools.anxietyTools,
        siblingSlugs: ['stress-reset-routine', 'breathing-for-anxiety', 'when-to-seek-support-uk'],
        miniFaqs: [
          { question: 'Does worry time stop all worry?', answer: 'No, but it can reduce the amount of time you spend in worry loops.' },
          { question: 'What if worries show up at night?', answer: 'Write them down and return to them the next day.' },
          { question: 'Can I do this daily?', answer: 'Yes, short and consistent windows work best.' },
        ],
      },
      {
        slug: 'when-to-seek-support-uk',
        title: 'When to seek support (UK)',
        description: 'Cautious guidance on when to seek professional help.',
        h1: 'When to seek support for anxiety or stress',
        intro: [
          'If anxiety or stress is persistent or severe, professional support can help.',
          'This guide offers cautious signposting rather than diagnosis.',
        ],
        sections: [
          {
            heading: 'Common signs to watch',
            body: [
              'Difficulty sleeping, persistent worry, or feeling unable to cope.',
              'Avoiding daily tasks or feeling overwhelmed most days.',
            ],
          },
          {
            heading: 'Where to seek help in the UK',
            body: [
              'Contact your GP for advice or support options.',
              'In urgent situations, contact NHS 111 or emergency services.',
            ],
          },
        ],
        tryNow: tools.stressTools,
        siblingSlugs: ['panic-what-to-do-first', 'stress-reset-routine', 'breathing-for-anxiety'],
        miniFaqs: [
          { question: 'Is this a diagnosis?', answer: 'No. It is general guidance only.' },
          { question: 'What if I am unsure?', answer: 'It is okay to ask your GP for advice.' },
          { question: 'Can I use tools while waiting for support?', answer: 'Yes, gentle self-help can be useful alongside professional care.' },
        ],
      },
      {
        slug: 'stress-general-anxiety',
        title: 'Stress & general anxiety support',
        description: 'Evidence-based guidance for managing everyday stress and general anxiety.',
        h1: 'Managing stress and general anxiety',
        intro: [
          'Stress and generalised anxiety are common experiences that can affect daily life.',
          'This guide offers practical steps for regulation, not diagnosis or medical advice.',
        ],
        sections: [
          {
            heading: 'What it is',
            body: [
              'General anxiety involves persistent worry that feels hard to control.',
              'Physical signs may include restlessness, tension, fatigue, or difficulty sleeping.',
              'Stress is the body\'s response to demands; it becomes problematic when chronic.',
            ],
          },
          {
            heading: 'Common signs',
            body: [
              'Feeling on edge, muscle tension, racing thoughts, or difficulty relaxing.',
              'Avoiding situations, changes in sleep or appetite, or irritability.',
              'Physical sensations like headaches, rapid heartbeat, or shallow breathing.',
            ],
          },
          {
            heading: 'What can help right now',
            body: [
              'Use slow breathing exercises to reduce physical tension.',
              'Try the 5-4-3-2-1 grounding technique to bring attention to the present.',
              'Take short breaks for movement or a change of environment.',
              'Write down worries to externalise them and reduce mental loops.',
            ],
          },
          {
            heading: 'When to seek help',
            body: [
              'If anxiety is persistent, severe, or affecting daily functioning.',
              'When self-help strategies are not enough or symptoms worsen.',
              'Contact your GP for professional assessment and support options.',
            ],
          },
          {
            heading: 'Sources',
            body: [
              'NHS: Generalised anxiety disorder in adults (www.nhs.uk/mental-health/conditions/generalised-anxiety-disorder)',
              'NICE: Generalised anxiety disorder and panic disorder in adults (www.nice.org.uk)',
            ],
          },
        ],
        tryNow: tools.stressTools,
        siblingSlugs: ['panic-symptoms', 'breathing-for-anxiety', 'stress-reset-routine'],
        miniFaqs: [
          { question: 'Is this medical advice?', answer: 'No. This is educational information only.' },
          { question: 'Can breathing really help anxiety?', answer: 'Controlled breathing can reduce physical arousal and support calm.' },
          { question: 'When should I see a GP?', answer: 'If anxiety is persistent or interfering with daily life.' },
        ],
      },
      {
        slug: 'panic-symptoms',
        title: 'Understanding panic symptoms',
        description: 'What panic symptoms feel like and practical steps for immediate support.',
        h1: 'Recognising and responding to panic symptoms',
        intro: [
          'Panic symptoms can feel intense and frightening but are not dangerous.',
          'This guide helps you recognise panic and offers immediate grounding steps.',
        ],
        sections: [
          {
            heading: 'What panic symptoms feel like',
            body: [
              'Rapid heartbeat, sweating, trembling, shortness of breath, or chest tightness.',
              'Feelings of choking, nausea, dizziness, or feeling detached from reality.',
              'Fear of losing control, passing out, or that something terrible is happening.',
            ],
          },
          {
            heading: 'Common signs',
            body: [
              'Symptoms peak quickly, often within minutes.',
              'Physical sensations can mimic serious medical conditions but are not harmful.',
              'Panic can occur unexpectedly or in response to specific triggers.',
            ],
          },
          {
            heading: 'What can help right now',
            body: [
              'Slow your exhale: breathe out gently for 6-8 counts.',
              'Ground yourself: name 5 things you see, 4 you can touch.',
              'Remind yourself: "This is panic. It will pass. I am not in danger."',
              'Sit or stand in a steady position and sip water when able.',
            ],
          },
          {
            heading: 'When to seek help',
            body: [
              'If panic attacks are frequent or affecting your quality of life.',
              'If you avoid situations or activities because of panic.',
              'If you are unsure whether symptoms are panic or a medical issue, seek assessment.',
            ],
          },
          {
            heading: 'Sources',
            body: [
              'NHS: Panic disorder (www.nhs.uk/mental-health/conditions/panic-disorder)',
              'NICE: Generalised anxiety disorder and panic disorder in adults (www.nice.org.uk)',
            ],
          },
        ],
        tryNow: { href: '/breathing/techniques/sos-60', label: 'Try SOS 60-second breathing' },
        siblingSlugs: ['stress-general-anxiety', 'panic-what-to-do-first', 'grounding-5-4-3-2-1'],
        miniFaqs: [
          { question: 'Are panic symptoms dangerous?', answer: 'Panic feels intense but is not medically dangerous.' },
          { question: 'How long do panic symptoms last?', answer: 'Symptoms typically peak within minutes and then subside.' },
          { question: 'Should I go to A&E?', answer: 'If unsure or experiencing chest pain, seek medical assessment.' },
        ],
      },
      {
        slug: 'ptsd-regulation',
        title: 'PTSD regulation support',
        description: 'Grounding and regulation strategies for post-traumatic stress responses.',
        h1: 'Regulation support for PTSD and trauma responses',
        intro: [
          'Post-traumatic stress can cause overwhelming emotions and physical responses.',
          'This guide offers grounding strategies, not trauma therapy or medical advice.',
        ],
        sections: [
          {
            heading: 'What PTSD involves',
            body: [
              'PTSD is a response to traumatic events that can include flashbacks, nightmares, and hypervigilance.',
              'Emotional regulation, sleep, and concentration may be affected.',
              'Professional support is important for trauma recovery.',
            ],
          },
          {
            heading: 'Common responses',
            body: [
              'Re-experiencing trauma through intrusive memories or flashbacks.',
              'Avoidance of reminders, emotional numbing, or feeling detached.',
              'Hyperarousal: feeling on edge, easily startled, difficulty sleeping.',
            ],
          },
          {
            heading: 'Regulation strategies to try now',
            body: [
              'Grounding: use 5-4-3-2-1 sensory grounding to return to the present.',
              'Slow breathing: focus on gentle, steady exhales to calm the nervous system.',
              'Safe space: identify a physical or mental space that feels secure.',
              'Movement: gentle stretching or walking can help release stored tension.',
            ],
          },
          {
            heading: 'When to seek help',
            body: [
              'PTSD requires professional trauma-informed support.',
              'Contact your GP or mental health service for assessment and therapy options.',
              'In crisis, contact NHS 111, Samaritans (116 123), or emergency services.',
            ],
          },
          {
            heading: 'Sources',
            body: [
              'NHS: Post-traumatic stress disorder (www.nhs.uk/mental-health/conditions/post-traumatic-stress-disorder-ptsd)',
              'NICE: Post-traumatic stress disorder (www.nice.org.uk)',
            ],
          },
        ],
        tryNow: tools.stressTools,
        siblingSlugs: ['grounding-5-4-3-2-1', 'breathing-for-anxiety', 'when-to-seek-support-uk'],
        miniFaqs: [
          { question: 'Can self-help replace trauma therapy?', answer: 'No. Professional trauma therapy is essential for PTSD recovery.' },
          { question: 'Are grounding techniques safe for trauma?', answer: 'Generally yes, but professional guidance is important.' },
          { question: 'What if I feel unsafe?', answer: 'Contact emergency services or crisis support immediately.' },
        ],
      },
    ],
    faqs: [
      { question: 'Can these tools replace therapy?', answer: 'No. They are educational tools and not a substitute for professional care.' },
      { question: 'What is the fastest way to calm down?', answer: 'A slow exhale with grounding steps can help the body settle.' },
      { question: 'How often should I practise?', answer: 'Short daily practice helps build resilience over time.' },
      { question: 'Is stress always harmful?', answer: 'Short-term stress can be useful, but chronic stress needs recovery.' },
      { question: 'Can I use these tools at work or school?', answer: 'Yes, most routines are short and discreet.' },
      { question: 'What if anxiety affects sleep?', answer: 'Try a wind-down routine and breathing before bed.' },
      { question: 'Are these suitable for young people?', answer: 'Yes, with age-appropriate support.' },
      { question: 'What if panic is frequent?', answer: 'Seek professional advice and support.' },
      { question: 'Do I need special equipment?', answer: 'No. A timer and a quiet space are enough.' },
      { question: 'Is this medical advice?', answer: 'No. It is educational information only.' },
    ],
    relatedAcrossSite: [
      { href: '/guides/breathing', label: 'Breathing exercises', description: 'Practical breathing techniques for calm.', typeBadge: 'Guide' },
      { href: '/guides/focus-adhd', label: 'Focus & ADHD support', description: 'Attention routines and tools.', typeBadge: 'Guide' },
      { href: '/guides/sleep', label: 'Sleep support', description: 'Wind-down routines and sleep tools.', typeBadge: 'Guide' },
    ],
  },
  {
    key: 'sleep',
    title: 'Sleep Support',
    description:
      'Guidance for better sleep with wind-down routines, breathing and practical steps. Educational information only.',
    h1: 'Sleep support guides and routines',
    intro: [
      'These guides focus on simple routines and practical changes that support better sleep.',
      'Use the tools to practise, then return to build consistency.',
    ],
    startHere: tools.sleepTools,
    clusters: [
      {
        slug: 'sleep-basics',
        title: 'Sleep basics',
        description: 'A simple overview of sleep foundations and common myths.',
        h1: 'Sleep basics in clear language',
        intro: [
          'Sleep foundations include routine, environment and timing.',
          'This guide focuses on practical basics rather than medical advice.',
        ],
        sections: [
          {
            heading: 'The basics that matter most',
            body: [
              'Keep a consistent wake time where possible.',
              'Use a calm wind-down routine and low light before bed.',
            ],
          },
          {
            heading: 'Common myths',
            body: [
              'Trying harder to sleep can make sleep harder.',
              'Small changes repeated consistently often work better than big changes once.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['wind-down-routine', 'screen-time-and-sleep', 'sleep-and-anxiety'],
        miniFaqs: [
          { question: 'How much sleep do adults need?', answer: 'Many adults need around 7–9 hours, but individual needs vary.' },
          { question: 'Should I nap?', answer: 'Short naps can help some people but may disrupt night sleep for others.' },
          { question: 'Is sleep tracking essential?', answer: 'No, but it can help you notice patterns.' },
        ],
      },
      {
        slug: 'wind-down-routine',
        title: 'Wind-down routine',
        description: 'A short, repeatable routine before bed.',
        h1: 'A simple wind-down routine for sleep',
        intro: [
          'A predictable wind-down routine helps your brain recognise bedtime.',
          'This guide offers a short routine you can adapt.',
        ],
        sections: [
          {
            heading: 'A 15–20 minute routine',
            body: [
              'Dim lights, reduce screens, and use a gentle breathing pace.',
              'Write down any worries so they are not carried into bed.',
            ],
          },
          {
            heading: 'Keep it realistic',
            body: [
              'If time is short, focus on one calming step and a slow exhale.',
              'Consistency matters more than perfection.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['breathing-for-sleep', 'screen-time-and-sleep', 'sleep-and-anxiety'],
        miniFaqs: [
          { question: 'How long should the routine be?', answer: 'Aim for 15–30 minutes, but shorter is still useful.' },
          { question: 'Can I do this with children?', answer: 'Yes, adapt the steps to their age and routine.' },
          { question: 'What if I work late?', answer: 'Use a shorter routine and focus on a gentle exhale.' },
        ],
      },
      {
        slug: 'breathing-for-sleep',
        title: 'Breathing for sleep',
        description: 'Gentle breathing to support sleep onset.',
        h1: 'Breathing routines that support sleep',
        intro: [
          'Breathing can help your body move from alert to rest.',
          'Use a gentle pace rather than forcing deep breaths.',
        ],
        sections: [
          {
            heading: 'A calm breathing pace',
            body: [
              'Inhale for 4, exhale for 6, for 3–5 minutes.',
              'Stop if you feel dizzy and return to normal breathing.',
            ],
          },
          {
            heading: 'Create a sleep cue',
            body: [
              'Use the same breathing routine each night to signal sleep.',
              'Pair it with dim light and quiet surroundings.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['wind-down-routine', 'sleep-and-anxiety', 'screen-time-and-sleep'],
        miniFaqs: [
          { question: 'Is 4-7-8 better?', answer: 'Some people prefer it; try both and use what feels comfortable.' },
          { question: 'Can I use a timer?', answer: 'Yes, a guided timer can make it easier.' },
          { question: 'Will this fix insomnia?', answer: 'It can help, but persistent insomnia needs professional support.' },
        ],
      },
      {
        slug: 'screen-time-and-sleep',
        title: 'Screen time and sleep',
        description: 'How to reduce screen impact on sleep without drastic changes.',
        h1: 'Screen time and sleep: practical steps',
        intro: [
          'Screens can make it harder to switch off, but small changes help.',
          'This guide focuses on realistic adjustments.',
        ],
        sections: [
          {
            heading: 'Timing changes',
            body: [
              'Aim to reduce screens 30–60 minutes before bed.',
              'Use night mode and lower brightness if you must use screens.',
            ],
          },
          {
            heading: 'Replace the habit',
            body: [
              'Swap screen time for a short breathing routine or light reading.',
              'Keep a low-stimulation activity ready.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['wind-down-routine', 'sleep-basics', 'sleep-and-anxiety'],
        miniFaqs: [
          { question: 'Do I need to cut screens completely?', answer: 'No. Reducing and timing screens is often enough.' },
          { question: 'What about blue light glasses?', answer: 'They can help some people but are not essential.' },
          { question: 'Can I listen to audio?', answer: 'Yes, calm audio can support wind-down.' },
        ],
      },
      {
        slug: 'night-waking-reset',
        title: 'Night waking reset',
        description: 'Steps to use if you wake during the night.',
        h1: 'What to do when you wake in the night',
        intro: [
          'Night waking is common. A short reset can help you return to sleep.',
          'Keep light low and avoid stimulating activities.',
        ],
        sections: [
          {
            heading: 'Keep it calm',
            body: [
              'Use slow breathing and keep the environment dark.',
              'Avoid checking the time frequently.',
            ],
          },
          {
            heading: 'If you cannot sleep',
            body: [
              'Get up for a brief calm activity, then return to bed.',
              'Keep the activity low light and quiet.',
            ],
          },
        ],
        tryNow: tools.breathTools,
        siblingSlugs: ['breathing-for-sleep', 'wind-down-routine', 'sleep-basics'],
        miniFaqs: [
          { question: 'Should I check my phone?', answer: 'Try to avoid it, as it can increase alertness.' },
          { question: 'Is night waking normal?', answer: 'Yes, many people experience it occasionally.' },
          { question: 'When should I seek help?', answer: 'If it is frequent and affects daily life, talk to a professional.' },
        ],
      },
      {
        slug: 'sleep-and-anxiety',
        title: 'Sleep and anxiety',
        description: 'How to calm worry that affects sleep.',
        h1: 'How anxiety affects sleep',
        intro: [
          'Anxiety can make sleep harder by keeping the body alert.',
          'Use calm routines and short grounding steps to reduce tension.',
        ],
        sections: [
          {
            heading: 'Create a buffer',
            body: [
              'Plan a 15–20 minute wind-down before bed.',
              'Write down worries to reduce mental load.',
            ],
          },
          {
            heading: 'Use a calming tool',
            body: [
              'Try a slow breathing routine or guided sleep tool.',
              'Keep the pace gentle to avoid overstimulation.',
            ],
          },
        ],
        tryNow: tools.sleepTools,
        siblingSlugs: ['wind-down-routine', 'breathing-for-sleep', 'screen-time-and-sleep'],
        miniFaqs: [
          { question: 'Can worry time help at night?', answer: 'Yes, use worry time earlier in the day.' },
          { question: 'Should I avoid caffeine?', answer: 'Reducing caffeine after early afternoon can help.' },
          { question: 'Is professional help available?', answer: 'Yes, your GP can advise on support options.' },
        ],
      },
    ],
    faqs: [
      { question: 'How long should a wind-down routine be?', answer: 'Aim for 15–30 minutes, but shorter routines are still useful.' },
      { question: 'What if I wake up during the night?', answer: 'Use a short breathing reset and keep lights low.' },
      { question: 'Can breathing help with sleep onset?', answer: 'Slow, steady breathing can help the body settle.' },
      { question: 'Should I avoid screens before bed?', answer: 'Reducing screen time can support sleep.' },
      { question: 'Do naps affect sleep?', answer: 'Long or late naps can affect night sleep for some people.' },
      { question: 'Is sleep tracking essential?', answer: 'No, but it can help spot patterns.' },
      { question: 'What if sleep problems persist?', answer: 'Seek professional advice if issues continue.' },
      { question: 'Are these tools suitable for young people?', answer: 'Yes, with age-appropriate routines and support.' },
      { question: 'Is this medical advice?', answer: 'No. It is educational information only.' },
      { question: 'Can stress affect sleep?', answer: 'Yes, reducing stress can improve sleep quality.' },
    ],
    relatedAcrossSite: [
      { href: '/guides/breathing', label: 'Breathing exercises', description: 'Breathing routines for calm and sleep.', typeBadge: 'Guide' },
      { href: '/guides/anxiety-stress', label: 'Anxiety & stress support', description: 'Grounding and reset routines.', typeBadge: 'Guide' },
      { href: '/guides/focus-adhd', label: 'Focus & ADHD support', description: 'Focus routines and tools.', typeBadge: 'Guide' },
    ],
  },
  {
    key: 'dyslexia-reading',
    title: 'Dyslexia & Reading Support',
    description:
      'Practical reading support for dyslexia, including home routines and school strategies. Educational information only.',
    h1: 'Dyslexia and reading support guides',
    intro: [
      'These guides focus on short, consistent routines and confidence building.',
      'Use the tools and resources to support practice at home or school.',
    ],
    startHere: tools.dyslexiaTraining,
    clusters: [
      {
        slug: 'what-is-dyslexia',
        title: 'What is dyslexia?',
        description: 'A clear overview of dyslexia and common strengths.',
        h1: 'What dyslexia is and is not',
        intro: [
          'Dyslexia is a common learning difference that affects reading and language processing.',
          'It does not reflect intelligence and often comes with strengths in other areas.',
        ],
        sections: [
          {
            heading: 'Key features',
            body: [
              'Difficulties with decoding, spelling, and working memory are common.',
              'Many people have strengths in creativity, problem-solving and visual thinking.',
            ],
          },
          {
            heading: 'Diagnosis and support',
            body: [
              'Only qualified professionals can provide a formal diagnosis.',
              'Support can start before a diagnosis using practical routines.',
            ],
          },
        ],
        tryNow: tools.dyslexiaTraining,
        siblingSlugs: ['reading-confidence', 'phonics-at-home', 'support-at-school'],
        miniFaqs: [
          { question: 'Can dyslexia be diagnosed online?', answer: 'No. Formal diagnosis requires qualified professionals.' },
          { question: 'Does dyslexia affect adults?', answer: 'Yes, it can continue throughout life.' },
          { question: 'Is dyslexia the same as poor vision?', answer: 'No. It is a language processing difference.' },
        ],
      },
      {
        slug: 'reading-confidence',
        title: 'Reading confidence',
        description: 'Short steps to build confidence and reduce reading anxiety.',
        h1: 'Building reading confidence',
        intro: [
          'Confidence grows when practice feels safe and predictable.',
          'This guide focuses on encouragement and short routines.',
        ],
        sections: [
          {
            heading: 'Make practice predictable',
            body: [
              'Use the same time and place for practice when possible.',
              'Keep sessions short and stop before frustration builds.',
            ],
          },
          {
            heading: 'Celebrate effort',
            body: [
              'Praise persistence rather than speed.',
              'Track small wins to show progress over time.',
            ],
          },
        ],
        tryNow: tools.dyslexiaTraining,
        siblingSlugs: ['phonics-at-home', 'support-at-school', 'parent-carer-next-steps'],
        miniFaqs: [
          { question: 'Should children read aloud daily?', answer: 'Not necessarily. Variety helps, including shared reading.' },
          { question: 'What if reading feels stressful?', answer: 'Shorten sessions and focus on supportive topics.' },
          { question: 'Do adults benefit from these tips?', answer: 'Yes, confidence strategies help across ages.' },
        ],
      },
      {
        slug: 'phonics-at-home',
        title: 'Phonics at home',
        description: 'A short daily phonics routine for families.',
        h1: 'Phonics routines you can do at home',
        intro: [
          'Phonics practice works best in short, consistent sessions.',
          'This guide gives a simple routine with low pressure.',
        ],
        sections: [
          {
            heading: 'A 10–15 minute routine',
            body: [
              'Start with sound review, then practise a short word list.',
              'Finish with a short reading passage or game.',
            ],
          },
          {
            heading: 'Keep it multisensory',
            body: [
              'Use tracing, magnetic letters, or coloured overlays if helpful.',
              'Balance practise with encouragement and play.',
            ],
          },
        ],
        tryNow: tools.dyslexiaTraining,
        siblingSlugs: ['what-is-dyslexia', 'reading-confidence', 'parent-carer-next-steps'],
        miniFaqs: [
          { question: 'How often should we practise?', answer: 'Short daily practice is often most effective.' },
          { question: 'What if my child resists?', answer: 'Reduce the length and use topics they enjoy.' },
          { question: 'Do I need specialist materials?', answer: 'No. Simple routines are effective.' },
        ],
      },
      {
        slug: 'support-at-school',
        title: 'Support at school',
        description: 'Practical classroom strategies for dyslexia support.',
        h1: 'Dyslexia support at school',
        intro: [
          'School support is most effective when it is specific and consistent.',
          'This guide outlines practical adjustments and collaboration steps.',
        ],
        sections: [
          {
            heading: 'Practical adjustments',
            body: [
              'Use clear instructions, extra time, and structured scaffolding.',
              'Provide accessible fonts and space for processing.',
            ],
          },
          {
            heading: 'Work with staff',
            body: [
              'Share a short summary of what helps at home.',
              'Agree on review dates to monitor progress.',
            ],
          },
        ],
        tryNow: { href: '/resources', label: 'Open dyslexia resources' },
        siblingSlugs: ['reading-confidence', 'assistive-tech-uk', 'parent-carer-next-steps'],
        miniFaqs: [
          { question: 'Do I need a diagnosis?', answer: 'Support can still be requested without a formal diagnosis.' },
          { question: 'What if support is limited?', answer: 'Focus on a few realistic adjustments first.' },
          { question: 'Can teachers use these tips?', answer: 'Yes, they are designed for practical classroom use.' },
        ],
      },
      {
        slug: 'assistive-tech-uk',
        title: 'Assistive tech (UK)',
        description: 'Accessible tools and software that support reading.',
        h1: 'Assistive technology for dyslexia (UK)',
        intro: [
          'Assistive tech can reduce the load of reading and writing tasks.',
          'This guide offers practical options for home and school.',
        ],
        sections: [
          {
            heading: 'Common tools',
            body: [
              'Text-to-speech, dictation tools, and audiobooks.',
              'Reading overlays and dyslexia-friendly fonts.',
            ],
          },
          {
            heading: 'How to start',
            body: [
              'Begin with one tool and build confidence before adding more.',
              'Ask your school about available assistive technology support.',
            ],
          },
        ],
        tryNow: { href: '/resources', label: 'Explore resources' },
        siblingSlugs: ['support-at-school', 'reading-confidence', 'phonics-at-home'],
        miniFaqs: [
          { question: 'Is assistive tech only for school?', answer: 'No, it can help at home and in work settings too.' },
          { question: 'Do I need specialist training?', answer: 'Many tools are easy to learn with short practice.' },
          { question: 'Are these tools available in the UK?', answer: 'Many are available through schools or online services.' },
        ],
      },
      {
        slug: 'parent-carer-next-steps',
        title: 'Parent and carer next steps',
        description: 'Simple next steps for families supporting dyslexia.',
        h1: 'Next steps for parents and carers',
        intro: [
          'Parents and carers can support progress with short routines and encouragement.',
          'This guide focuses on practical steps and support pathways.',
        ],
        sections: [
          {
            heading: 'Create a simple routine',
            body: [
              'Use a short daily reading routine and a calm environment.',
              'Track small wins to build confidence.',
            ],
          },
          {
            heading: 'Work with school',
            body: [
              'Share home strategies and request specific adjustments.',
              'Ask about local dyslexia support services.',
            ],
          },
        ],
        tryNow: tools.dyslexiaTraining,
        siblingSlugs: ['reading-confidence', 'phonics-at-home', 'support-at-school'],
        miniFaqs: [
          { question: 'What if progress is slow?', answer: 'Progress often takes time; focus on consistency.' },
          { question: 'Should we use rewards?', answer: 'Positive reinforcement can help when kept simple.' },
          { question: 'Is professional support necessary?', answer: 'It can be helpful; speak with your GP or school for advice.' },
        ],
      },
    ],
    faqs: [
      { question: 'What is dyslexia?', answer: 'Dyslexia is a common learning difference affecting reading and language processing.' },
      { question: 'Can dyslexia be diagnosed online?', answer: 'No. Formal diagnosis requires qualified professionals.' },
      { question: 'What helps reading confidence?', answer: 'Short, consistent practice with supportive feedback.' },
      { question: 'Are these tools suitable for adults?', answer: 'Yes. Many strategies help across ages.' },
      { question: 'What if school support is limited?', answer: 'Start with simple adjustments and share clear routines with staff.' },
      { question: 'Do these resources replace specialist teaching?', answer: 'No. They are educational aids alongside specialist support.' },
      { question: 'How often should reading practice happen?', answer: 'Short daily practice is often more effective than long sessions.' },
      { question: 'Can breathing help reading focus?', answer: 'Calm breathing can reduce anxiety before reading tasks.' },
      { question: 'Is this medical advice?', answer: 'No. It is educational information only.' },
      { question: 'Are there UK resources available?', answer: 'Yes, use school support routes and trusted UK organisations.' },
    ],
    relatedAcrossSite: [
      { href: '/guides/breathing', label: 'Breathing exercises', description: 'Calming routines that support focus.', typeBadge: 'Guide' },
      { href: '/guides/focus-adhd', label: 'Focus & ADHD support', description: 'Focus routines and tools.', typeBadge: 'Guide' },
      { href: '/guides/anxiety-stress', label: 'Anxiety & stress support', description: 'Grounding and calm routines.', typeBadge: 'Guide' },
    ],
  },
  {
    key: 'autism-support',
    title: 'Autism Support',
    description:
      'Educational guidance for autism support, routines, and sensory needs with practical tools and resources.',
    h1: 'Autism support guides',
    intro: [
      'These guides focus on routines, sensory support and practical steps for everyday life.',
      'Use the tools to practise, then return to build a personalised plan.',
    ],
    startHere: tools.autismTools,
    clusters: [
      {
        slug: 'autism-basics',
        title: 'Autism basics',
        description: 'A clear overview of autism and common support needs.',
        h1: 'Autism basics in plain language',
        intro: [
          'Autism is a neurodevelopmental difference with a wide range of experiences.',
          'This guide focuses on practical understanding and support.',
        ],
        sections: [
          {
            heading: 'Key principles',
            body: [
              'Autism presents differently in each person.',
              'Support works best when it is personalised and predictable.',
            ],
          },
          {
            heading: 'Everyday support',
            body: [
              'Use clear communication, routines, and sensory-friendly environments.',
              'Build on strengths and preferences.',
            ],
          },
        ],
        tryNow: tools.autismTools,
        siblingSlugs: ['sensory-overload-plan', 'routines-and-transitions', 'parent-carer-support'],
        miniFaqs: [
          { question: 'Is autism the same for everyone?', answer: 'No. Experiences vary widely.' },
          { question: 'Does autism have strengths?', answer: 'Yes, many people have strong skills or interests.' },
          { question: 'Is this a diagnosis guide?', answer: 'No, it is educational information only.' },
        ],
      },
      {
        slug: 'sensory-overload-plan',
        title: 'Sensory overload plan',
        description: 'Steps to help during sensory overload.',
        h1: 'A plan for sensory overload',
        intro: [
          'Sensory overload can be distressing. A short plan can help reduce intensity.',
          'Focus on predictable steps and reduced stimulation.',
        ],
        sections: [
          {
            heading: 'Reduce stimulation',
            body: [
              'Move to a quieter space if possible.',
              'Lower lights and reduce noise or visual input.',
            ],
          },
          {
            heading: 'Offer a simple choice',
            body: [
              'Offer a calm choice: sit, walk, or use a calming tool.',
              'Use a steady breathing cue if helpful.',
            ],
          },
        ],
        tryNow: tools.autismTools,
        siblingSlugs: ['routines-and-transitions', 'meltdown-vs-shutdown', 'parent-carer-support'],
        miniFaqs: [
          { question: 'What if the person cannot move?', answer: 'Reduce stimulation where they are and offer calm choices.' },
          { question: 'Is breathing always helpful?', answer: 'Not always. Adapt to sensory preferences.' },
          { question: 'When should I seek support?', answer: 'If overload is frequent or severe, seek professional advice.' },
        ],
      },
      {
        slug: 'meltdown-vs-shutdown',
        title: 'Meltdown vs shutdown',
        description: 'Understanding different stress responses.',
        h1: 'Meltdown vs shutdown: key differences',
        intro: [
          'People respond to overwhelm in different ways.',
          'This guide explains the difference and practical support steps.',
        ],
        sections: [
          {
            heading: 'What a meltdown can look like',
            body: [
              'Heightened emotions, loud reactions, or movement.',
              'Support with calm, space, and reduced demands.',
            ],
          },
          {
            heading: 'What a shutdown can look like',
            body: [
              'Withdrawal, silence, or reduced responsiveness.',
              'Support with quiet space and gentle reassurance.',
            ],
          },
        ],
        tryNow: tools.autismTools,
        siblingSlugs: ['sensory-overload-plan', 'routines-and-transitions', 'parent-carer-support'],
        miniFaqs: [
          { question: 'Are meltdowns behavioural?', answer: 'They are often stress responses, not deliberate behaviour.' },
          { question: 'Should I talk during a shutdown?', answer: 'Keep language minimal and calm; allow space.' },
          { question: 'Can routines reduce overwhelm?', answer: 'Yes, predictability often helps.' },
        ],
      },
      {
        slug: 'routines-and-transitions',
        title: 'Routines and transitions',
        description: 'Predictable steps that reduce anxiety around change.',
        h1: 'Routines and transitions',
        intro: [
          'Predictable routines can reduce stress and improve transitions.',
          'This guide focuses on simple steps that can be repeated.',
        ],
        sections: [
          {
            heading: 'Make transitions predictable',
            body: [
              'Give a short warning before change.',
              'Use a visual cue or countdown where possible.',
            ],
          },
          {
            heading: 'Keep language consistent',
            body: [
              'Use the same phrases and steps each time.',
              'Celebrate effort rather than speed.',
            ],
          },
        ],
        tryNow: { href: '/autism/focus-garden', label: 'Try Focus Garden' },
        siblingSlugs: ['sensory-overload-plan', 'parent-carer-support', 'school-support-uk-send'],
        miniFaqs: [
          { question: 'Do transitions get easier?', answer: 'Many people find predictability helps over time.' },
          { question: 'Should I use rewards?', answer: 'Positive reinforcement can help when kept simple.' },
          { question: 'What if routines break?', answer: 'Restart with the smallest step possible.' },
        ],
      },
      {
        slug: 'school-support-uk-send',
        title: 'School support (UK SEND)',
        description: 'Practical guidance for school support pathways in the UK.',
        h1: 'School support for autism (UK SEND)',
        intro: [
          'School support works best with clear information and collaborative planning.',
          'This guide offers practical steps and UK context.',
        ],
        sections: [
          {
            heading: 'Prepare a short summary',
            body: [
              'List main needs and what helps at home.',
              'Bring examples of routines or visual supports that work.',
            ],
          },
          {
            heading: 'Work with staff',
            body: [
              'Ask for a review plan and clear adjustments.',
              'Use consistent communication between home and school.',
            ],
          },
        ],
        tryNow: { href: '/teacher-quick-pack', label: 'Open the Teacher Quick Pack' },
        siblingSlugs: ['routines-and-transitions', 'parent-carer-support', 'autism-basics'],
        miniFaqs: [
          { question: 'Do I need a diagnosis?', answer: 'Support can be discussed without a formal diagnosis.' },
          { question: 'What if support is limited?', answer: 'Focus on small, realistic adjustments first.' },
          { question: 'Is this UK-specific?', answer: 'Yes, it references UK SEND contexts.' },
        ],
      },
      {
        slug: 'parent-carer-support',
        title: 'Parent and carer support',
        description: 'Support strategies for parents and carers.',
        h1: 'Support for parents and carers',
        intro: [
          'Parents and carers benefit from short routines and clear support plans.',
          'This guide focuses on practical steps and self-care.',
        ],
        sections: [
          {
            heading: 'Keep routines short',
            body: [
              'Use visual schedules and short steps.',
              'Plan recovery time after transitions or sensory overload.',
            ],
          },
          {
            heading: 'Support your own wellbeing',
            body: [
              'Plan small breaks and ask for support when needed.',
              'Use calming tools for yourself as well.',
            ],
          },
        ],
        tryNow: tools.autismTools,
        siblingSlugs: ['sensory-overload-plan', 'routines-and-transitions', 'school-support-uk-send'],
        miniFaqs: [
          { question: 'How can I reduce stress at home?', answer: 'Predictable routines and calm spaces can help.' },
          { question: 'What if I feel overwhelmed?', answer: 'Seek support from local services or trusted networks.' },
          { question: 'Are there UK resources?', answer: 'Yes, use trusted UK organisations and school pathways.' },
        ],
      },
    ],
    faqs: [
      { question: 'Are these tools suitable for all ages?', answer: 'Many tools can be adapted for children, teens and adults.' },
      { question: 'Do these resources replace professional support?', answer: 'No. They are educational tools only.' },
      { question: 'How can I support transitions?', answer: 'Use visual schedules, countdowns and clear next steps.' },
      { question: 'What if sensory overload is frequent?', answer: 'Consider professional advice and support strategies.' },
      { question: 'Can breathing help with regulation?', answer: 'Slow breathing can support calm for many people.' },
      { question: 'Are these tools UK-focused?', answer: 'Yes, where possible.' },
      { question: 'Do I need to log in to use tools?', answer: 'Many tools are available without login.' },
      { question: 'How do I choose the right tool?', answer: 'Start with the calm toolkit or Focus Garden.' },
      { question: 'Is this medical advice?', answer: 'No. It is educational information only.' },
      { question: 'Can school support help?', answer: 'Yes, practical adjustments can make a difference.' },
    ],
    relatedAcrossSite: [
      { href: '/guides/breathing', label: 'Breathing exercises', description: 'Calming routines for regulation.', typeBadge: 'Guide' },
      { href: '/guides/anxiety-stress', label: 'Anxiety & stress support', description: 'Grounding and reset steps.', typeBadge: 'Guide' },
      { href: '/guides/dyslexia-reading', label: 'Dyslexia & reading support', description: 'Reading confidence and routines.', typeBadge: 'Guide' },
    ],
  },
];

export function getPillar(pillar: string) {
  return PILLARS.find(p => p.key === pillar);
}

export function getCluster(pillarKey: string, slug: string) {
  const pillar = PILLARS.find(p => p.key === pillarKey);
  return pillar?.clusters.find(cluster => cluster.slug === slug);
}

export function listPillars() {
  return PILLARS.map(p => ({ key: p.key, title: p.title, description: p.description }));
}

export function listPillarKeys() {
  return PILLARS.map(p => p.key);
}

export function listClusterParams() {
  return PILLARS.flatMap(pillar =>
    pillar.clusters.map(cluster => ({ pillar: pillar.key, slug: cluster.slug }))
  );
}