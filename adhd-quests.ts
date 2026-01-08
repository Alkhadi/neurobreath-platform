// ADHD Daily Quests & Challenges
// Gamified daily tasks and weekly challenges

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  category: 'starter' | 'main' | 'bonus' | 'epic';
  xp: number;
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completionTips: string[];
}

export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  goal: string;
  xp: number;
  badge?: string;
  trackingMetric: string;
}

// Daily rotating quests
export const dailyQuests: DailyQuest[] = [
  // STARTER QUESTS (Quick wins)
  {
    id: 'morning-win',
    title: '🌅 Morning Victory',
    description: 'Complete one productive task within 30 minutes of waking',
    category: 'starter',
    xp: 50,
    duration: '5-30 min',
    difficulty: 'easy',
    completionTips: [
      'Prepare task the night before',
      'Make it small: make bed, shower, eat breakfast',
      'Set phone alarm with task name'
    ]
  },
  {
    id: 'hydration-hero',
    title: '💧 Hydration Hero',
    description: 'Drink 3 full glasses of water today',
    category: 'starter',
    xp: 30,
    duration: 'All day',
    difficulty: 'easy',
    completionTips: [
      'Fill water bottle in morning',
      'Link to existing habits (after coffee, before meals)',
      'Use visual tracking (marks on bottle)'
    ]
  },
  {
    id: 'movement-moment',
    title: '🏃 Movement Moment',
    description: 'Take a 10-minute walk or dance break',
    category: 'starter',
    xp: 40,
    duration: '10 min',
    difficulty: 'easy',
    completionTips: [
      'Put on favorite high-energy playlist',
      'Walk around block or do YouTube workout',
      'Count it as break between tasks'
    ]
  },
  {
    id: 'dopamine-dose',
    title: '✨ Dopamine Dose',
    description: 'Do something from your Dopamine Menu',
    category: 'starter',
    xp: 35,
    duration: '5-15 min',
    difficulty: 'easy',
    completionTips: [
      'Choose based on current mood and energy',
      'Set a timer if it\'s a "dessert" activity',
      'No guilt - this is self-care'
    ]
  },

  // MAIN QUESTS (Core ADHD management)
  {
    id: 'task-crusher',
    title: '💪 Task Crusher',
    description: 'Complete 3 items from your to-do list',
    category: 'main',
    xp: 100,
    duration: '30-90 min',
    difficulty: 'medium',
    completionTips: [
      'Pick your 3 most important tasks the night before',
      'Start with smallest task first',
      'Use body doubling or Pomodoro technique'
    ]
  },
  {
    id: 'focus-session',
    title: '🎯 Deep Focus Session',
    description: 'Complete a 25-minute focused work block',
    category: 'main',
    xp: 80,
    duration: '25-30 min',
    difficulty: 'medium',
    completionTips: [
      'Use website blocker (Freedom, Cold Turkey)',
      'Phone in another room or Do Not Disturb',
      'Tell someone you\'re going into focus mode'
    ]
  },
  {
    id: 'body-double',
    title: '👥 Body Doubling Win',
    description: 'Work alongside someone for 30+ minutes',
    category: 'main',
    xp: 90,
    duration: '30-60 min',
    difficulty: 'medium',
    completionTips: [
      'Schedule Focusmate session in advance',
      'Join virtual coworking space',
      'Work at coffee shop or library'
    ]
  },
  {
    id: 'brain-dump',
    title: '🧠 Brain Dump',
    description: 'Capture all thoughts and tasks into external system',
    category: 'main',
    xp: 70,
    duration: '15-20 min',
    difficulty: 'medium',
    completionTips: [
      'Set timer for 10 minutes',
      'Write everything down without organizing',
      'Process and categorize afterward'
    ]
  },
  {
    id: 'meal-master',
    title: '🍽️ Meal Master',
    description: 'Eat 3 balanced meals at regular times',
    category: 'main',
    xp: 85,
    duration: 'All day',
    difficulty: 'medium',
    completionTips: [
      'Prep easy meals night before',
      'Set alarms for mealtimes',
      'Keep protein bars/snacks as backup'
    ]
  },

  // BONUS QUESTS (Extra challenges)
  {
    id: 'email-ninja',
    title: '📧 Email Ninja',
    description: 'Achieve inbox zero (or inbox 10)',
    category: 'bonus',
    xp: 120,
    duration: '20-40 min',
    difficulty: 'hard',
    completionTips: [
      'Use "2-minute rule" - reply immediately if under 2 min',
      'Archive everything you can',
      'Unsubscribe from 5 newsletters'
    ]
  },
  {
    id: 'clean-sweep',
    title: '🧹 5-Minute Clean Sweep',
    description: 'Set timer and tidy one surface or area',
    category: 'bonus',
    xp: 60,
    duration: '5 min',
    difficulty: 'easy',
    completionTips: [
      'Choose one surface (desk, kitchen counter, bedside table)',
      'Use "body doubling" - call a friend while cleaning',
      'Play upbeat music'
    ]
  },
  {
    id: 'social-connection',
    title: '💬 Social Connection',
    description: 'Reach out to a friend or family member',
    category: 'bonus',
    xp: 75,
    duration: '10-30 min',
    difficulty: 'medium',
    completionTips: [
      'Text, call, or video chat',
      'Schedule hangout for future',
      'Join ADHD support group meeting'
    ]
  },

  // EPIC QUESTS (Major accomplishments)
  {
    id: 'hyperfocus-harvest',
    title: '⚡ Hyperfocus Harvest',
    description: 'Ride a hyperfocus wave for 2+ hours on important work',
    category: 'epic',
    xp: 200,
    duration: '2+ hours',
    difficulty: 'hard',
    completionTips: [
      'Don\'t fight it when it happens',
      'Set up bathroom break reminders',
      'Have snacks and water nearby'
    ]
  },
  {
    id: 'admin-annihilator',
    title: '📋 Admin Annihilator',
    description: 'Complete 3 "boring but important" admin tasks',
    category: 'epic',
    xp: 250,
    duration: '60-120 min',
    difficulty: 'hard',
    completionTips: [
      'Use body doubling',
      'Reward yourself after each task',
      'Break each task into micro-steps'
    ]
  },
  {
    id: 'consistent-sleep',
    title: '😴 Sleep Schedule Victory',
    description: 'Go to bed within 30 min of target time',
    category: 'epic',
    xp: 150,
    duration: 'Evening',
    difficulty: 'hard',
    completionTips: [
      'Set "start bedtime routine" alarm',
      'Use app blockers after 10 PM',
      'Prepare tomorrow\'s clothes and tasks'
    ]
  }
];

// Weekly challenges with bigger rewards
export const weeklyChallenges: WeeklyChallenge[] = [
  {
    id: 'streak-master',
    title: '🔥 Streak Master',
    description: 'Complete at least one quest every day for 7 days',
    goal: '7 consecutive days with quest completion',
    xp: 500,
    badge: 'streak-champion',
    trackingMetric: 'consecutive_days'
  },
  {
    id: 'focus-warrior',
    title: '🎯 Focus Warrior',
    description: 'Complete 10 focused work sessions this week',
    goal: '10 Pomodoro/focus sessions',
    xp: 400,
    badge: 'focus-master',
    trackingMetric: 'focus_sessions'
  },
  {
    id: 'organization-champion',
    title: '📦 Organization Champion',
    description: 'Complete 5 brain dumps and organize your system',
    goal: '5 brain dump sessions',
    xp: 350,
    badge: 'organization-guru',
    trackingMetric: 'brain_dumps'
  },
  {
    id: 'self-care-superstar',
    title: '💝 Self-Care Superstar',
    description: 'Complete all "starter" quests 5 days this week',
    goal: '5 days with all starter quests done',
    xp: 450,
    badge: 'self-care-hero',
    trackingMetric: 'starter_quest_days'
  },
  {
    id: 'social-butterfly',
    title: '🦋 Social Butterfly',
    description: 'Complete 5 social connection quests this week',
    goal: '5 social interactions',
    xp: 300,
    badge: 'connection-champion',
    trackingMetric: 'social_connections'
  }
];

// Quest rotation logic
export function getTodaysQuests(date: Date = new Date()): DailyQuest[] {
  const dayOfWeek = date.getDay();
  
  // Rotate quests based on day of week
  const starterQuests = dailyQuests.filter(q => q.category === 'starter');
  const mainQuests = dailyQuests.filter(q => q.category === 'main');
  const bonusQuests = dailyQuests.filter(q => q.category === 'bonus');
  const epicQuests = dailyQuests.filter(q => q.category === 'epic');
  
  return [
    starterQuests[dayOfWeek % starterQuests.length],
    starterQuests[(dayOfWeek + 1) % starterQuests.length],
    mainQuests[dayOfWeek % mainQuests.length],
    mainQuests[(dayOfWeek + 2) % mainQuests.length],
    bonusQuests[dayOfWeek % bonusQuests.length],
    epicQuests[dayOfWeek % epicQuests.length]
  ];
}
