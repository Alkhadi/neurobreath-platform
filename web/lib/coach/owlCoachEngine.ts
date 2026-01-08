/**
 * Owl Coach Engine (v1)
 * 
 * Duolingo-style habit companion with mood states and daily quests.
 * Family-friendly, supportive, never shaming.
 * 
 * Mood States:
 * - GENIUS: Helpful tips and insights
 * - HAPPY: On track, encouraging
 * - CONCERNED: Streak at risk (1 day warning)
 * - FIRM: Playfully strict when streak about to break
 * - CELEBRATE: Milestones achieved
 */

import { getStreak, getProfileStats, isDailyQuestAvailable, practicedToday } from '@/lib/progress/progressStore'

// ============================================================================
// TYPES
// ============================================================================

export type OwlMood = 'GENIUS' | 'HAPPY' | 'CONCERNED' | 'FIRM' | 'CELEBRATE'

export type OwlTone = 'gentle' | 'standard' | 'firm'

export interface DailyQuest {
  id: string
  title: string
  description: string
  progress: number // 0-100
  target: number
  reward: {
    xp: number
    coins: number
  }
}

export interface OwlState {
  mood: OwlMood
  message: string
  action?: {
    label: string
    route: string
  }
  quest?: DailyQuest
}

// ============================================================================
// QUEST DEFINITIONS
// ============================================================================

const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'practice-3min',
    title: 'Daily Practice',
    description: 'Complete 3 minutes of any activity',
    progress: 0,
    target: 3,
    reward: { xp: 50, coins: 10 },
  },
  {
    id: 'complete-1-activity',
    title: 'Get Started',
    description: 'Complete 1 activity today',
    progress: 0,
    target: 1,
    reward: { xp: 30, coins: 5 },
  },
  {
    id: 'breathing-session',
    title: 'Breathing Practice',
    description: 'Complete a breathing session',
    progress: 0,
    target: 1,
    reward: { xp: 40, coins: 8 },
  },
]

/**
 * Get a random daily quest
 */
function getRandomQuest(): DailyQuest {
  const index = Math.floor(Math.random() * DAILY_QUESTS.length)
  return { ...DAILY_QUESTS[index] }
}

// ============================================================================
// OWL MESSAGES (BY TONE & MOOD)
// ============================================================================

const OWL_MESSAGES = {
  gentle: {
    GENIUS: [
      "💡 Did you know? Just 2 minutes of focused breathing can help improve concentration.",
      "🌟 You're doing great! Small, consistent steps make the biggest difference.",
      "✨ Remember: Progress, not perfection. Every practice counts!",
    ],
    HAPPY: [
      "😊 You're on track! Keep up the wonderful work.",
      "🌈 Great job staying consistent! You're building a healthy habit.",
      "⭐ You're doing fantastic! Every session makes a difference.",
    ],
    CONCERNED: [
      "🦉 Your streak is at risk tomorrow if we don't practice today. Let's do a quick 2-minute session?",
      "💚 I believe in you! A short practice today keeps your streak going.",
      "🌱 You've built something great—let's keep it growing with a quick session.",
    ],
    FIRM: [
      "🦉 Your streak ends tomorrow without practice today. Can we do just 2 minutes together?",
      "💪 You've worked hard on this streak! Let's protect it with a quick session now.",
      "🔥 Don't let that streak slip away! A fast practice will save it.",
    ],
    CELEBRATE: [
      "🎉 Amazing! You've reached a new milestone!",
      "🏆 Incredible work! You should be proud of your consistency.",
      "✨ Fantastic achievement! You're building something truly special.",
    ],
  },
  standard: {
    GENIUS: [
      "💡 Pro tip: Practicing at the same time each day builds stronger habits.",
      "🧠 Fun fact: Consistent practice rewires your brain for better focus.",
      "⚡ Quick tip: Even 2 minutes counts as a win!",
    ],
    HAPPY: [
      "🎯 You're doing great! Keep that momentum going.",
      "🌟 Solid progress! You're on the right track.",
      "👏 Nice work! Consistency is key, and you've got it.",
    ],
    CONCERNED: [
      "🦉 Heads up! Practice today to keep your streak alive.",
      "⚠️ Your streak needs you! Let's do a quick session now.",
      "🔔 Don't break the chain! A short practice today keeps it going.",
    ],
    FIRM: [
      "🦉 Listen up! Your streak is about to break. Practice NOW to save it!",
      "⏰ Time's running out! Your streak ends tomorrow without practice today.",
      "🚨 Emergency! Quick practice needed to protect that hard-earned streak!",
    ],
    CELEBRATE: [
      "🎉 Milestone unlocked! You're a practice champion!",
      "🏆 Streak record broken! You're unstoppable!",
      "💯 Epic achievement! Keep crushing it!",
    ],
  },
  firm: {
    GENIUS: [
      "💡 Here's the deal: Consistent practice = better results. Science says so.",
      "🧠 Listen: Even champions practice daily. That's what separates the best from the rest.",
      "⚡ Truth bomb: Showing up daily matters more than being perfect.",
    ],
    HAPPY: [
      "💪 That's what I'm talking about! Keep pushing!",
      "🔥 You're crushing it! This is how winners train.",
      "⚡ Excellent! You're building champion habits.",
    ],
    CONCERNED: [
      "🦉 Real talk: You're about to lose everything you've built. Practice today!",
      "⚠️ I'm not playing around—your streak dies tomorrow without practice today.",
      "🚨 This is serious! Get in there and practice before it's too late!",
    ],
    FIRM: [
      "🦉 WAKE UP! Your streak is on life support! Practice RIGHT NOW or lose it all!",
      "⏰ NO EXCUSES! You've got one chance to save that streak—GO!",
      "🔥 This is your final warning! Practice now or watch that streak burn!",
    ],
    CELEBRATE: [
      "🎉 NOW WE'RE TALKING! That's a champion milestone!",
      "🏆 BEAST MODE! You've earned legendary status!",
      "💯 UNSTOPPABLE! You're in the elite club now!",
    ],
  },
}

// ============================================================================
// OWL COACH ENGINE
// ============================================================================

/**
 * Get random message for mood and tone
 */
function getRandomMessage(mood: OwlMood, tone: OwlTone): string {
  const messages = OWL_MESSAGES[tone][mood]
  const index = Math.floor(Math.random() * messages.length)
  return messages[index]
}

/**
 * Determine owl mood based on profile stats
 */
function determineOwlMood(
  profileId: string,
  tone: OwlTone
): { mood: OwlMood; reason: string } {
  const stats = getProfileStats(profileId)
  const streak = getStreak(profileId)
  const today = practicedToday(profileId)
  
  // Check for milestones (CELEBRATE)
  if (streak.current === 7 || streak.current === 14 || streak.current === 30) {
    return { mood: 'CELEBRATE', reason: `${streak.current}-day streak milestone` }
  }
  
  if (stats.totalActivities === 10 || stats.totalActivities === 50 || stats.totalActivities === 100) {
    return { mood: 'CELEBRATE', reason: `${stats.totalActivities} activities completed` }
  }
  
  // Check streak status
  if (streak.current > 0 && !today) {
    // Has a streak but hasn't practiced today
    if (tone === 'firm') {
      return { mood: 'FIRM', reason: 'Streak at risk, firm tone' }
    } else if (streak.current >= 7) {
      return { mood: 'CONCERNED', reason: 'Valuable streak at risk' }
    } else {
      return { mood: 'CONCERNED', reason: 'Streak at risk' }
    }
  }
  
  // Practiced today and has good streak
  if (today && streak.current >= 3) {
    return { mood: 'HAPPY', reason: 'Good streak, practiced today' }
  }
  
  // Default: helpful tips
  return { mood: 'GENIUS', reason: 'Default helpful mode' }
}

/**
 * Get suggested action based on mood
 */
function getSuggestedAction(mood: OwlMood): { label: string; route: string } | undefined {
  switch (mood) {
    case 'CONCERNED':
    case 'FIRM':
      return {
        label: 'Quick 2-Min Practice',
        route: '/breathing/techniques/sos-60',
      }
    case 'GENIUS':
    case 'HAPPY':
      return {
        label: 'Start Practice',
        route: '/get-started',
      }
    case 'CELEBRATE':
      return {
        label: 'See Progress',
        route: '/progress',
      }
    default:
      return undefined
  }
}

/**
 * Calculate quest progress
 */
function calculateQuestProgress(profileId: string, quest: DailyQuest): number {
  const stats = getProfileStats(profileId)
  const today = practicedToday(profileId)
  
  switch (quest.id) {
    case 'practice-3min':
      // Calculate minutes today (simplified - uses total for demo)
      return Math.min(100, (stats.totalMinutes / quest.target) * 100)
    
    case 'complete-1-activity':
      return today ? 100 : 0
    
    case 'breathing-session':
      return today ? 100 : 0
    
    default:
      return 0
  }
}

/**
 * Get Owl Coach state for a profile
 * Main entry point for the Owl Coach engine
 */
export function getOwlCoachState(profileId: string, tone: OwlTone = 'standard'): OwlState {
  // Determine mood
  const { mood } = determineOwlMood(profileId, tone)
  
  // Get message
  const message = getRandomMessage(mood, tone)
  
  // Get suggested action
  const action = getSuggestedAction(mood)
  
  // Get daily quest (if available)
  let quest: DailyQuest | undefined = undefined
  if (isDailyQuestAvailable(profileId)) {
    quest = getRandomQuest()
    quest.progress = calculateQuestProgress(profileId, quest)
  }
  
  return {
    mood,
    message,
    action,
    quest,
  }
}

/**
 * Check if currently in quiet hours
 */
export function isQuietHours(quietStart?: string, quietEnd?: string): boolean {
  if (!quietStart || !quietEnd) return false
  
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 60 + minutes
  
  const [startHours, startMinutes] = quietStart.split(':').map(Number)
  const [endHours, endMinutes] = quietEnd.split(':').map(Number)
  
  const startTime = startHours * 60 + startMinutes
  const endTime = endHours * 60 + endMinutes
  
  // Handle overnight quiet hours
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime
  }
  
  return currentTime >= startTime && currentTime <= endTime
}

