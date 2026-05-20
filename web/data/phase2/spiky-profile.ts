export type SpikyCategory = {
  id: string;
  label: string;
  description: string;
  questions: string[];
  supportIdeas: string[];
};

export const SPIKY_SCALE = [
  { value: 1, label: 'Rarely difficult' },
  { value: 2, label: 'Sometimes difficult' },
  { value: 3, label: 'Mixed / depends on the day' },
  { value: 4, label: 'Often difficult' },
  { value: 5, label: 'Very often difficult' },
] as const;

export const SPIKY_CATEGORIES: SpikyCategory[] = [
  {
    id: 'focus',
    label: 'Focus and attention',
    description: 'Holding attention on a chosen task and noticing when attention drifts.',
    questions: [
      'I lose track of what I was doing.',
      'Background noise pulls my attention away.',
      'I switch between tabs or tasks without finishing.',
      'I miss steps in long instructions.',
    ],
    supportIdeas: [
      'Try short focus sprints with deliberate recovery breaks.',
      'Use a single visible next step instead of a long list.',
      'Reduce visual clutter on your screen and desk.',
    ],
  },
  {
    id: 'executive',
    label: 'Executive function and task starting',
    description: 'Getting started, sequencing steps, and finishing tasks.',
    questions: [
      'I know what to do but cannot start.',
      'Breaking a task into smaller steps feels hard.',
      'I underestimate how long things take.',
      'I avoid tasks that feel vague or open-ended.',
    ],
    supportIdeas: [
      'Write the very first 2-minute step, not the whole task.',
      'Use a timer and a visible end point.',
      'Pair task starts with a calm, repeatable cue.',
    ],
  },
  {
    id: 'sensory',
    label: 'Sensory processing',
    description: 'How sound, light, touch, smell, and movement feel during the day.',
    questions: [
      'Bright light, noise, or busy spaces drain me quickly.',
      'Certain textures or smells are hard to tolerate.',
      'I need movement to think clearly.',
      'I feel overwhelmed in crowded environments.',
    ],
    supportIdeas: [
      'Build short sensory resets into your day.',
      'Use noise-reducing headphones for focused work.',
      'Choose lower-stimulation routes and times where possible.',
    ],
  },
  {
    id: 'emotional',
    label: 'Emotional regulation',
    description: 'Noticing emotions and returning to a calm baseline.',
    questions: [
      'Small frustrations escalate quickly.',
      'I find it hard to calm down once upset.',
      'Strong feelings show up before I notice them.',
      'I mask how I feel and feel exhausted later.',
    ],
    supportIdeas: [
      'Use a short SOS breathing routine before responding.',
      'Name the feeling in plain words to lower its intensity.',
      'Plan low-demand recovery time after high-stimulation events.',
    ],
  },
  {
    id: 'communication',
    label: 'Communication and social energy',
    description: 'Conversations, group settings, and the energy they take.',
    questions: [
      'Group conversations are tiring.',
      'I prefer written communication for important things.',
      'I rehearse what I will say in advance.',
      'I need time alone to recover after social events.',
    ],
    supportIdeas: [
      'Request meeting agendas in advance.',
      'Schedule recovery time after high-social days.',
      'Use written follow-ups to confirm shared understanding.',
    ],
  },
  {
    id: 'memory',
    label: 'Memory and organisation',
    description: 'Holding information in mind and keeping track of things.',
    questions: [
      'I forget what I came into a room for.',
      'I lose items like keys, phone, or notes.',
      'I forget commitments unless they are written down.',
      'I cannot hold multi-step instructions in my head.',
    ],
    supportIdeas: [
      'Use one trusted capture place for tasks and reminders.',
      'Keep frequently used items in fixed spots.',
      'Repeat or write down multi-step instructions immediately.',
    ],
  },
  {
    id: 'reading',
    label: 'Reading and processing',
    description: 'Reading text, following dense information, and processing speed.',
    questions: [
      'Dense text tires my eyes quickly.',
      'I re-read the same line without taking it in.',
      'I prefer audio or visual explanations over long text.',
      'I need more time than expected to process new information.',
    ],
    supportIdeas: [
      'Increase line spacing and use a calm font.',
      'Try short reading sprints with breaks.',
      'Ask for written summaries of long meetings.',
    ],
  },
  {
    id: 'routines',
    label: 'Routines and transitions',
    description: 'Starting, stopping, and switching between activities.',
    questions: [
      'Unexpected changes throw off the rest of my day.',
      'Stopping an absorbing task is very hard.',
      'I struggle to start a new activity even when planned.',
      'Mornings or evenings feel chaotic.',
    ],
    supportIdeas: [
      'Use predictable anchor routines at the start and end of the day.',
      'Give yourself a transition warning before changing tasks.',
      'Pre-stage the next activity so starting is easier.',
    ],
  },
];
