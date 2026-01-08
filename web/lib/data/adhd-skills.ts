// ADHD Management Skills Library
// Evidence-based strategies for executive function, focus, and regulation

export interface ADHDSkill {
  id: string;
  title: string;
  category: 'focus' | 'organization' | 'emotion' | 'social' | 'time';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  description: string;
  howTo: string[];
  commonPitfalls: string[];
  ageAdaptations: {
    children: string;
    teens: string;
    adults: string;
  };
  dopamineBoost: number; // 1-5 scale
  citations: string[];
}

export const adhdSkills: ADHDSkill[] = [
  {
    id: 'body-doubling',
    title: 'Body Doubling',
    category: 'focus',
    difficulty: 'beginner',
    duration: '15-60 min',
    description: 'Work alongside someone else (in person or virtually) to boost accountability and reduce task avoidance.',
    howTo: [
      'Find a body doubling partner (friend, family, online community)',
      'Set up a shared workspace (Zoom, Discord, or in-person)',
      'Agree on your individual tasks and time commitment',
      'Work in parallel with minimal conversation',
      'Optional: Brief check-ins at start and end',
      'Celebrate completion together'
    ],
    commonPitfalls: [
      'Talking too much and getting distracted',
      'Comparing yourself to your partner',
      'Not having clear tasks before starting'
    ],
    ageAdaptations: {
      children: 'Homework time with parent nearby doing their own work',
      teens: 'Study groups or virtual Discord study sessions',
      adults: 'Focusmate, Caveday, or coworking spaces'
    },
    dopamineBoost: 4,
    citations: [
      'CHADD - Body Doubling Research 2024',
      'ADDitude Magazine - Virtual Coworking Benefits'
    ]
  },
  {
    id: 'task-breakdown',
    title: 'Task Breakdown (Chunking)',
    category: 'organization',
    difficulty: 'beginner',
    duration: '5-10 min',
    description: 'Break overwhelming tasks into tiny, manageable micro-steps to overcome executive dysfunction and task paralysis.',
    howTo: [
      'Identify the task causing paralysis',
      'Ask: "What\'s the absolute smallest first step?"',
      'Write down 5-7 micro-steps (each under 5 min)',
      'Example: "Clean room" → "Pick up 3 items" → "Put them in drawer"',
      'Complete first micro-step immediately',
      'Reward yourself after each step'
    ],
    commonPitfalls: [
      'Making steps too big',
      'Planning too many steps at once',
      'Not celebrating small wins'
    ],
    ageAdaptations: {
      children: 'Visual picture cards for each step of routine',
      teens: 'Use apps like Habitica to track micro-quests',
      adults: 'Digital task managers with sub-task features'
    },
    dopamineBoost: 5,
    citations: [
      'Russell Barkley - Executive Function Model',
      'How to ADHD - Task Initiation Strategies 2024'
    ]
  },
  {
    id: 'dopamine-menu',
    title: 'Dopamine Menu',
    category: 'emotion',
    difficulty: 'beginner',
    duration: '10-15 min setup',
    description: 'Create a personalized menu of healthy dopamine-boosting activities for different moods and energy levels.',
    howTo: [
      'Divide activities into categories: Starters, Mains, Sides, Desserts',
      'Starters: Quick 5-min boosts (stretch, favorite song, cold water)',
      'Mains: 30-60 min activities (exercise, hobby, creative work)',
      'Sides: Things you can do alongside work (fidget toy, music)',
      'Desserts: Guilt-free rewards (gaming, social media with timer)',
      'Keep list visible and update regularly'
    ],
    commonPitfalls: [
      'Including only "should do" activities',
      'Menu items too time-consuming',
      'Not actually using the menu when needed'
    ],
    ageAdaptations: {
      children: 'Picture-based choice board with parent guidance',
      teens: 'Digital notes app with GIFs and emojis',
      adults: 'Phone widget or sticky note on desk'
    },
    dopamineBoost: 5,
    citations: [
      'ADHD Nutritionist - Dopamine Menu Concept 2023',
      'Research on Dopamine & Motivation in ADHD (PubMed)'
    ]
  },
  {
    id: 'pomodoro-adhd',
    title: 'ADHD-Adapted Pomodoro',
    category: 'time',
    difficulty: 'intermediate',
    duration: 'Flexible cycles',
    description: 'Modified Pomodoro technique with flexible intervals and hyperfocus accommodation for ADHD brains.',
    howTo: [
      'Start with shorter intervals: 10-15 min work, 3-5 min break',
      'Use a visual timer (Time Timer or phone app)',
      'If hyperfocused, allow yourself to continue past timer',
      'If struggling, reduce to 5-min intervals',
      'Break activities: move, drink water, stretch, fidget',
      'Track how many "pomodoros" you complete (gamify it!)'
    ],
    commonPitfalls: [
      'Starting with standard 25-minute intervals (too rigid)',
      'Forcing breaks during hyperfocus',
      'Not actually taking breaks'
    ],
    ageAdaptations: {
      children: '5-10 min work intervals with movement breaks',
      teens: '15-20 min intervals with social media check breaks',
      adults: 'Flexible 10-45 min based on task and energy'
    },
    dopamineBoost: 4,
    citations: [
      'Pomodoro Technique Adaptations for ADHD',
      'Time Management Strategies - ADDitude 2024'
    ]
  },
  {
    id: 'visual-timers',
    title: 'Visual Time Management',
    category: 'time',
    difficulty: 'beginner',
    duration: 'Ongoing',
    description: 'Use visual representations of time to combat time blindness and improve planning.',
    howTo: [
      'Get a visual timer (Time Timer, phone app, or DIY)',
      'Color-code your calendar by activity type',
      'Use analog clocks to see time passing',
      'Set multiple alarms with descriptive labels',
      'Time-block your day visually (paper or digital)',
      'Estimate task duration, then track actual time'
    ],
    commonPitfalls: [
      'Underestimating how long tasks take',
      'Ignoring alarms without action',
      'Over-scheduling without buffer time'
    ],
    ageAdaptations: {
      children: 'Large visual timers with red/yellow/green zones',
      teens: 'Phone apps with widgets and lock screen reminders',
      adults: 'Smart watch notifications + desk timer'
    },
    dopamineBoost: 3,
    citations: [
      'Time Blindness in ADHD - Research Review 2024',
      'Visual Supports for Executive Function'
    ]
  },
  {
    id: 'emotion-regulation',
    title: 'Emotional Regulation Toolbox',
    category: 'emotion',
    difficulty: 'intermediate',
    duration: '5-20 min',
    description: 'Build a personalized toolbox of strategies for managing big emotions and rejection sensitivity.',
    howTo: [
      'Identify your common emotional triggers',
      'Create a "5-4-3-2-1" grounding routine',
      'Practice "Name it to Tame it" - label emotions out loud',
      'Physical strategies: cold water, exercise, pressure',
      'Communication: "I need 10 minutes" script',
      'Debrief after: what worked? what didn\'t?'
    ],
    commonPitfalls: [
      'Trying to suppress emotions instead of processing',
      'Not having strategies ready before overwhelm',
      'Comparing your emotions to others'
    ],
    ageAdaptations: {
      children: 'Emotion zones with visual cues and adult coaching',
      teens: 'Journaling, playlists, and peer support',
      adults: 'Therapy-backed techniques + medication if needed'
    },
    dopamineBoost: 3,
    citations: [
      'Emotional Dysregulation in ADHD - Clinical Review',
      'DBT Skills for ADHD Population'
    ]
  },
  {
    id: 'hyperfocus-harvesting',
    title: 'Hyperfocus Harvesting',
    category: 'focus',
    difficulty: 'advanced',
    duration: 'Variable',
    description: 'Learn to recognize and channel your hyperfocus superpower into productive activities.',
    howTo: [
      'Track when you naturally hyperfocus (time, activity, conditions)',
      'Notice triggers: novelty, challenge, interest, urgency',
      'Set up environment before hyperfocus kicks in',
      'Have water/snacks nearby (you\'ll forget)',
      'Set a vibrating alarm for bio-breaks',
      'Don\'t fight it - ride the wave!'
    ],
    commonPitfalls: [
      'Trying to force hyperfocus (it doesn\'t work)',
      'Hyperfocusing on wrong tasks',
      'Ignoring basic needs during hyperfocus'
    ],
    ageAdaptations: {
      children: 'Adult monitoring with gentle redirects',
      teens: 'Self-awareness building and scheduling',
      adults: 'Strategic task planning around high-interest work'
    },
    dopamineBoost: 5,
    citations: [
      'Hyperfocus as ADHD Superpower - Barkley 2023',
      'Flow States in Neurodivergent Populations'
    ]
  },
  {
    id: 'external-brain',
    title: 'External Brain System',
    category: 'organization',
    difficulty: 'intermediate',
    duration: 'Setup 30-60 min',
    description: 'Create a trusted external system to capture all thoughts, tasks, and commitments.',
    howTo: [
      'Choose ONE system (digital or analog)',
      'Capture everything immediately - don\'t trust memory',
      'Process inbox daily: delete, defer, delegate, do',
      'Use categories: Next Actions, Waiting For, Someday',
      'Weekly review: update lists, celebrate wins',
      'Keep system simple and frictionless'
    ],
    commonPitfalls: [
      'Using multiple systems that don\'t sync',
      'Capturing but never reviewing',
      'Making system too complex to maintain'
    ],
    ageAdaptations: {
      children: 'Picture-based checklists and parent assistance',
      teens: 'Phone apps with notifications and reminders',
      adults: 'GTD system, Notion, or bullet journal'
    },
    dopamineBoost: 4,
    citations: [
      'Getting Things Done (GTD) for ADHD',
      'Working Memory Deficits - Executive Function Research'
    ]
  },
  {
    id: 'social-scripts',
    title: 'Social Scripts & Boundaries',
    category: 'social',
    difficulty: 'intermediate',
    duration: '5-10 min per script',
    description: 'Pre-written scripts for common social situations to reduce anxiety and impulsive responses.',
    howTo: [
      'Identify situations where you struggle (saying no, asking for help)',
      'Write 2-3 sentence scripts for each',
      'Practice scripts out loud or with friend',
      'Save scripts in phone notes for quick access',
      'Example: "I need to check my calendar - I\'ll get back to you"',
      'Adapt scripts based on what works'
    ],
    commonPitfalls: [
      'Sounding too scripted or robotic',
      'Not having scripts ready when needed',
      'Overexplaining or oversharing'
    ],
    ageAdaptations: {
      children: 'Role-play common scenarios with adult',
      teens: 'Practice with friends, video examples',
      adults: 'Professional and personal script libraries'
    },
    dopamineBoost: 2,
    citations: [
      'Social Skills Training for ADHD Adults',
      'Communication Strategies - CHADD Resources'
    ]
  },
  {
    id: 'interest-led-learning',
    title: 'Interest-Led Deep Dives',
    category: 'focus',
    difficulty: 'beginner',
    duration: 'Variable',
    description: 'Leverage your intense interests and curiosity as a learning and motivation tool.',
    howTo: [
      'Identify your current hyperfixation',
      'Connect boring tasks to your interest',
      'Use interest as reward after completing work',
      'Join communities around your interest',
      'Create projects that combine interests with goals',
      'Don\'t judge yourself for interest cycling'
    ],
    commonPitfalls: [
      'Spending ALL time on interest (neglecting responsibilities)',
      'Feeling guilty about "wasting time"',
      'Not documenting what you learn'
    ],
    ageAdaptations: {
      children: 'Incorporate special interests into learning activities',
      teens: 'Career exploration through interest areas',
      adults: 'Side projects and skill-building through hobbies'
    },
    dopamineBoost: 5,
    citations: [
      'Interest-Based Learning in ADHD - Educational Research',
      'Hyperfixations as Motivational Tool'
    ]
  }
];

// Skill categories for filtering
export const skillCategories = [
  { id: 'focus', label: 'Focus & Attention', icon: '🎯', color: 'blue' },
  { id: 'organization', label: 'Organization', icon: '📋', color: 'green' },
  { id: 'emotion', label: 'Emotion Regulation', icon: '💙', color: 'purple' },
  { id: 'social', label: 'Social Skills', icon: '🤝', color: 'pink' },
  { id: 'time', label: 'Time Management', icon: '⏰', color: 'orange' }
];
