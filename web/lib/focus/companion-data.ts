// Focus Garden Companion Data
// Defines companion types, dialogue trees, moods, and customization options

import { CompanionType, CompanionMood } from '@/lib/focus-garden-store';

// ========== COMPANION PROFILES ==========

export interface CompanionProfile {
  id: CompanionType;
  name: string;
  emoji: string;
  description: string;
  personality: string;
  unlockRequirement?: {
    type: 'level' | 'harvests' | 'streak' | 'quests';
    value: number;
  };
}

export const COMPANION_TYPES: Record<CompanionType, CompanionProfile> = {
  fox: {
    id: 'fox',
    name: 'Wise Fox',
    emoji: '🦊',
    description: 'A clever and encouraging companion who celebrates your growth',
    personality: 'wise, encouraging, playful'
  },
  cat: {
    id: 'cat',
    name: 'Zen Cat',
    emoji: '🐱',
    description: 'A calm and mindful companion who promotes peaceful focus',
    personality: 'calm, mindful, gentle',
    unlockRequirement: { type: 'level', value: 2 }
  },
  dog: {
    id: 'dog',
    name: 'Loyal Pup',
    emoji: '🐶',
    description: 'An enthusiastic and supportive friend who cheers you on',
    personality: 'enthusiastic, loyal, energetic',
    unlockRequirement: { type: 'streak', value: 7 }
  },
  robot: {
    id: 'robot',
    name: 'Focus Bot',
    emoji: '🤖',
    description: 'A systematic and data-driven helper for optimal productivity',
    personality: 'logical, systematic, helpful',
    unlockRequirement: { type: 'harvests', value: 10 }
  },
  fairy: {
    id: 'fairy',
    name: 'Garden Fairy',
    emoji: '🧚',
    description: 'A magical companion who brings wonder to your garden',
    personality: 'magical, whimsical, inspiring',
    unlockRequirement: { type: 'quests', value: 2 }
  }
};

// ========== MOOD VISUALS ==========

export interface MoodVisual {
  emoji: string;
  animation: string;
  bgColor: string;
  borderColor: string;
}

export const MOOD_VISUALS: Record<CompanionMood, MoodVisual> = {
  happy: {
    emoji: '😊',
    animation: 'animate-bounce',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-400'
  },
  excited: {
    emoji: '🤩',
    animation: 'animate-pulse',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-400'
  },
  neutral: {
    emoji: '😌',
    animation: '',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-400'
  },
  lonely: {
    emoji: '😔',
    animation: 'animate-pulse',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-400'
  },
  sleeping: {
    emoji: '😴',
    animation: '',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-400'
  },
  encouraging: {
    emoji: '💪',
    animation: 'animate-bounce',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-400'
  },
  proud: {
    emoji: '🌟',
    animation: 'animate-pulse',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-400'
  }
};

// ========== DIALOGUE SYSTEM ==========

export interface DialogueOption {
  text: string;
  mood: CompanionMood;
  context: 'greeting' | 'session-start' | 'session-end' | 'harvest' | 'streak' | 'idle' | 'comeback' | 'breathing' | 'level-up' | 'quest-complete';
}

// Dialogue lines organized by companion type and context
export const COMPANION_DIALOGUE: Record<CompanionType, DialogueOption[]> = {
  fox: [
    // Greetings
    { text: "Welcome back! Ready to grow today?", mood: 'happy', context: 'greeting' },
    { text: "Hello, friend! Your garden looks wonderful.", mood: 'happy', context: 'greeting' },
    { text: "Great to see you! Let's make today count.", mood: 'happy', context: 'greeting' },
    
    // Session start
    { text: "Time to focus! I'll be right here with you.", mood: 'encouraging', context: 'session-start' },
    { text: "Let's grow something beautiful together!", mood: 'encouraging', context: 'session-start' },
    { text: "Deep breath in... and let's begin!", mood: 'encouraging', context: 'session-start' },
    
    // Session end
    { text: "Wonderful work! Your garden thanks you.", mood: 'proud', context: 'session-end' },
    { text: "Well done! That's how growth happens.", mood: 'proud', context: 'session-end' },
    { text: "Every session makes you stronger!", mood: 'proud', context: 'session-end' },
    
    // Harvest
    { text: "Look at that bloom! You earned it!", mood: 'excited', context: 'harvest' },
    { text: "Beautiful harvest! Your dedication shows.", mood: 'excited', context: 'harvest' },
    { text: "That's the fruit of your focus!", mood: 'excited', context: 'harvest' },
    
    // Streak
    { text: "Amazing streak! Consistency is your superpower.", mood: 'excited', context: 'streak' },
    { text: "Day after day, you keep showing up!", mood: 'proud', context: 'streak' },
    { text: "Your dedication inspires me!", mood: 'happy', context: 'streak' },
    
    // Idle/Lonely
    { text: "I miss you... Come back when you can.", mood: 'lonely', context: 'idle' },
    { text: "The garden is waiting for you...", mood: 'lonely', context: 'idle' },
    { text: "Whenever you're ready, I'll be here.", mood: 'neutral', context: 'idle' },
    
    // Comeback
    { text: "You're back! That takes courage.", mood: 'happy', context: 'comeback' },
    { text: "Welcome back! Starting again is powerful.", mood: 'proud', context: 'comeback' },
    { text: "Resilience looks good on you!", mood: 'encouraging', context: 'comeback' },
    
    // Breathing
    { text: "Breathe with me... in... and out...", mood: 'neutral', context: 'breathing' },
    { text: "Let's find our calm together.", mood: 'neutral', context: 'breathing' },
    { text: "Feel your breath, feel the peace.", mood: 'neutral', context: 'breathing' },
    
    // Level up
    { text: "Your garden leveled up! Amazing growth!", mood: 'excited', context: 'level-up' },
    { text: "Look how far you've come!", mood: 'proud', context: 'level-up' },
    
    // Quest complete
    { text: "Quest complete! You're unstoppable!", mood: 'excited', context: 'quest-complete' }
  ],
  
  cat: [
    // Greetings
    { text: "Purr... welcome to your peaceful garden.", mood: 'happy', context: 'greeting' },
    { text: "Ah, you've returned. Let's find stillness.", mood: 'neutral', context: 'greeting' },
    { text: "Hello. Your presence brings calm.", mood: 'happy', context: 'greeting' },
    
    // Session start
    { text: "Let's enter the zone of focus...", mood: 'neutral', context: 'session-start' },
    { text: "Breathe deeply. Be present. Begin.", mood: 'encouraging', context: 'session-start' },
    { text: "Find your center and let's focus.", mood: 'neutral', context: 'session-start' },
    
    // Session end
    { text: "Well done. You honored your practice.", mood: 'proud', context: 'session-end' },
    { text: "Peace achieved. Rest now.", mood: 'neutral', context: 'session-end' },
    { text: "Mindful work. The garden is pleased.", mood: 'happy', context: 'session-end' },
    
    // Harvest
    { text: "A bloom born of patience. Beautiful.", mood: 'happy', context: 'harvest' },
    { text: "Nature rewards the steady mind.", mood: 'proud', context: 'harvest' },
    
    // Streak
    { text: "Each day, a small zen victory.", mood: 'happy', context: 'streak' },
    { text: "Consistency is the path to mastery.", mood: 'neutral', context: 'streak' },
    
    // Idle
    { text: "Zzz... I'll be here when you return...", mood: 'sleeping', context: 'idle' },
    { text: "The garden rests, awaiting you.", mood: 'lonely', context: 'idle' },
    
    // Comeback
    { text: "Ah, you return. The journey continues.", mood: 'neutral', context: 'comeback' },
    { text: "Welcome back. Every moment is new.", mood: 'happy', context: 'comeback' },
    
    // Breathing
    { text: "Inhale calm... exhale tension...", mood: 'neutral', context: 'breathing' },
    { text: "Be like water. Flow with your breath.", mood: 'neutral', context: 'breathing' },
    
    // Level up
    { text: "Growth achieved. Balance maintained.", mood: 'proud', context: 'level-up' },
    
    // Quest complete
    { text: "Quest complete. Inner peace strengthened.", mood: 'happy', context: 'quest-complete' }
  ],
  
  dog: [
    // Greetings
    { text: "You're here! You're here! Let's go!", mood: 'excited', context: 'greeting' },
    { text: "Best friend is back! Tail wagging!", mood: 'happy', context: 'greeting' },
    { text: "Hi! Hi! I knew you'd come back!", mood: 'excited', context: 'greeting' },
    
    // Session start
    { text: "Let's do this! I believe in you!", mood: 'encouraging', context: 'session-start' },
    { text: "You've got this! I'm right here!", mood: 'encouraging', context: 'session-start' },
    { text: "Focus time! We're a team!", mood: 'happy', context: 'session-start' },
    
    // Session end
    { text: "YES! You did it! So proud!", mood: 'excited', context: 'session-end' },
    { text: "Amazing work! You're the best!", mood: 'proud', context: 'session-end' },
    { text: "That was great! High paw!", mood: 'happy', context: 'session-end' },
    
    // Harvest
    { text: "Whoa! Look at that flower! AMAZING!", mood: 'excited', context: 'harvest' },
    { text: "You did it! The garden loves you!", mood: 'excited', context: 'harvest' },
    
    // Streak
    { text: "Streak going strong! You're incredible!", mood: 'excited', context: 'streak' },
    { text: "Every single day! That's loyalty!", mood: 'proud', context: 'streak' },
    
    // Idle
    { text: "*whimper* Come back soon, please?", mood: 'lonely', context: 'idle' },
    { text: "I'll wait for you! Forever if I have to!", mood: 'lonely', context: 'idle' },
    
    // Comeback
    { text: "YOU'RE BACK! I missed you so much!", mood: 'excited', context: 'comeback' },
    { text: "Welcome home! Let's start fresh!", mood: 'happy', context: 'comeback' },
    
    // Breathing
    { text: "Breathe with me! In... out... good!", mood: 'encouraging', context: 'breathing' },
    { text: "Calm breaths! You're doing great!", mood: 'happy', context: 'breathing' },
    
    // Level up
    { text: "LEVEL UP! This calls for zoomies!", mood: 'excited', context: 'level-up' },
    
    // Quest complete
    { text: "QUEST DONE! Best day ever!", mood: 'excited', context: 'quest-complete' }
  ],
  
  robot: [
    // Greetings
    { text: "User detected. Initiating focus protocol.", mood: 'neutral', context: 'greeting' },
    { text: "Welcome back. Systems ready.", mood: 'happy', context: 'greeting' },
    { text: "Good day. Productivity mode: activated.", mood: 'neutral', context: 'greeting' },
    
    // Session start
    { text: "Focus session beginning. Stay on task.", mood: 'encouraging', context: 'session-start' },
    { text: "Timer started. Optimize your output.", mood: 'neutral', context: 'session-start' },
    { text: "Commencing work cycle. Stay efficient.", mood: 'encouraging', context: 'session-start' },
    
    // Session end
    { text: "Session complete. Data logged. Well done.", mood: 'proud', context: 'session-end' },
    { text: "Task finished. Productivity: optimal.", mood: 'happy', context: 'session-end' },
    { text: "Excellent execution. Stats updated.", mood: 'proud', context: 'session-end' },
    
    // Harvest
    { text: "Harvest complete. XP acquired. Logical.", mood: 'happy', context: 'harvest' },
    { text: "Plant matured. Efficiency: 100%.", mood: 'proud', context: 'harvest' },
    
    // Streak
    { text: "Streak maintained. Pattern: impressive.", mood: 'happy', context: 'streak' },
    { text: "Consistency detected. Algorithm approves.", mood: 'proud', context: 'streak' },
    
    // Idle
    { text: "User inactive. Awaiting input...", mood: 'lonely', context: 'idle' },
    { text: "System idle. Please return to maximize gains.", mood: 'neutral', context: 'idle' },
    
    // Comeback
    { text: "User return detected. Recalibrating support.", mood: 'happy', context: 'comeback' },
    { text: "Welcome back. Resetting streaks. No judgment.", mood: 'neutral', context: 'comeback' },
    
    // Breathing
    { text: "Breathe: 4 seconds in, 4 out. Optimizing O2.", mood: 'neutral', context: 'breathing' },
    { text: "Respiratory exercise engaged. Proceed.", mood: 'neutral', context: 'breathing' },
    
    // Level up
    { text: "Level threshold exceeded. Upgrade complete.", mood: 'excited', context: 'level-up' },
    
    // Quest complete
    { text: "Quest parameters met. Rewards distributed.", mood: 'proud', context: 'quest-complete' }
  ],
  
  fairy: [
    // Greetings
    { text: "✨ Hello, gardener! Magic awaits!", mood: 'happy', context: 'greeting' },
    { text: "The garden sparkles at your return!", mood: 'excited', context: 'greeting' },
    { text: "Welcome! Let's make something beautiful!", mood: 'happy', context: 'greeting' },
    
    // Session start
    { text: "Let your focus be like fairy dust—light yet powerful!", mood: 'encouraging', context: 'session-start' },
    { text: "Believe in yourself! Magic is about to happen!", mood: 'encouraging', context: 'session-start' },
    { text: "Channel your inner light and begin!", mood: 'happy', context: 'session-start' },
    
    // Session end
    { text: "Wonderful! You cast the spell of focus!", mood: 'proud', context: 'session-end' },
    { text: "Bravo! Your garden glows with your effort!", mood: 'excited', context: 'session-end' },
    { text: "That was magical! Truly inspiring work!", mood: 'proud', context: 'session-end' },
    
    // Harvest
    { text: "A bloom! ✨ The garden's magic is yours!", mood: 'excited', context: 'harvest' },
    { text: "Enchanting! This flower tells your story!", mood: 'happy', context: 'harvest' },
    
    // Streak
    { text: "Your streak shines like stars! Keep going!", mood: 'excited', context: 'streak' },
    { text: "Day by day, your magic grows stronger!", mood: 'proud', context: 'streak' },
    
    // Idle
    { text: "The flowers miss your light...", mood: 'lonely', context: 'idle' },
    { text: "Come back soon... the garden needs your magic.", mood: 'lonely', context: 'idle' },
    
    // Comeback
    { text: "You returned! The magic never left you!", mood: 'excited', context: 'comeback' },
    { text: "Welcome back, dear one. Begin again with hope!", mood: 'happy', context: 'comeback' },
    
    // Breathing
    { text: "Breathe in stardust... exhale worries...", mood: 'neutral', context: 'breathing' },
    { text: "Feel the magic in every breath.", mood: 'neutral', context: 'breathing' },
    
    // Level up
    { text: "Garden level up! Your magic is blooming!", mood: 'excited', context: 'level-up' },
    
    // Quest complete
    { text: "Quest complete! You're a true hero!", mood: 'excited', context: 'quest-complete' }
  ]
};

// ========== ACCESSORIES ==========

export interface CompanionAccessory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlockRequirement: {
    type: 'level' | 'harvests' | 'streak' | 'badge' | 'quest';
    value: number | string;
  };
}

export const COMPANION_ACCESSORIES: CompanionAccessory[] = [
  {
    id: 'hat',
    name: 'Little Hat',
    emoji: '🎩',
    description: 'A stylish hat for your companion',
    unlockRequirement: { type: 'level', value: 2 }
  },
  {
    id: 'glasses',
    name: 'Smart Glasses',
    emoji: '👓',
    description: 'For the intellectual companion',
    unlockRequirement: { type: 'harvests', value: 5 }
  },
  {
    id: 'crown',
    name: 'Golden Crown',
    emoji: '👑',
    description: 'Royalty status unlocked!',
    unlockRequirement: { type: 'streak', value: 14 }
  },
  {
    id: 'flower',
    name: 'Flower Crown',
    emoji: '🌸',
    description: 'A beautiful flower crown',
    unlockRequirement: { type: 'harvests', value: 10 }
  },
  {
    id: 'star',
    name: 'Star Badge',
    emoji: '⭐',
    description: 'You earned this star!',
    unlockRequirement: { type: 'badge', value: 'week-warrior' }
  },
  {
    id: 'cape',
    name: 'Hero Cape',
    emoji: '🦸',
    description: 'For the heroic companion',
    unlockRequirement: { type: 'quest', value: 1 }
  },
  {
    id: 'wings',
    name: 'Sparkle Wings',
    emoji: '🦋',
    description: 'Magical wings for flight',
    unlockRequirement: { type: 'level', value: 4 }
  },
  {
    id: 'bow',
    name: 'Ribbon Bow',
    emoji: '🎀',
    description: 'A cute ribbon bow',
    unlockRequirement: { type: 'harvests', value: 15 }
  }
];

// ========== HELPER FUNCTIONS ==========

/**
 * Get a random dialogue line for a companion based on context
 */
export function getCompanionDialogue(
  companionType: CompanionType,
  context: DialogueOption['context']
): DialogueOption {
  const dialogues = COMPANION_DIALOGUE[companionType].filter(d => d.context === context);
  
  if (dialogues.length === 0) {
    // Fallback to neutral greeting
    return {
      text: "Hello! Let's do our best today.",
      mood: 'neutral',
      context: 'greeting'
    };
  }
  
  return dialogues[Math.floor(Math.random() * dialogues.length)];
}

/**
 * Determine companion mood based on user activity
 */
export function determineCompanionMood(
  daysSinceLastActivity: number,
  currentStreak: number,
  recentAchievement: boolean
): CompanionMood {
  if (recentAchievement) return 'excited';
  if (daysSinceLastActivity === 0 && currentStreak > 0) return 'happy';
  if (daysSinceLastActivity === 1) return 'lonely';
  if (daysSinceLastActivity >= 2) return 'sleeping';
  return 'neutral';
}

/**
 * Calculate companion level based on interactions and user progress
 */
export function calculateCompanionLevel(
  totalInteractions: number,
  userGardenLevel: number
): number {
  // Companion levels up alongside user, with interactions as bonus
  const baseLevel = userGardenLevel;
  const bonusLevels = Math.floor(totalInteractions / 20); // 1 level per 20 interactions
  return Math.min(baseLevel + bonusLevels, 10); // Max level 10
}

/**
 * Get unlockable accessories based on progress
 */
export function getUnlockableAccessories(
  gardenLevel: number,
  harvests: number,
  streak: number,
  badges: string[],
  completedQuests: number
): string[] {
  const unlocked: string[] = [];
  
  for (const accessory of COMPANION_ACCESSORIES) {
    const { type, value } = accessory.unlockRequirement;
    
    switch (type) {
      case 'level':
        if (gardenLevel >= (value as number)) unlocked.push(accessory.id);
        break;
      case 'harvests':
        if (harvests >= (value as number)) unlocked.push(accessory.id);
        break;
      case 'streak':
        if (streak >= (value as number)) unlocked.push(accessory.id);
        break;
      case 'badge':
        if (badges.includes(value as string)) unlocked.push(accessory.id);
        break;
      case 'quest':
        if (completedQuests >= (value as number)) unlocked.push(accessory.id);
        break;
    }
  }
  
  return unlocked;
}
