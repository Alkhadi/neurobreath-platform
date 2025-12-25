/**
 * Badge definitions and unlock conditions
 */

export interface BadgeDefinition {
  key: string
  name: string
  icon: string
  description: string
  unlockCondition: {
    type: 'sessions' | 'minutes' | 'streak' | 'challenges'
    value: number
  }
}

export const badgeDefinitions: BadgeDefinition[] = [
  {
    key: 'firstBreath',
    name: 'First Breath',
    icon: '🌬️',
    description: 'Complete your first breathing session',
    unlockCondition: { type: 'sessions', value: 1 }
  },
  {
    key: 'weekWarrior',
    name: 'Week Warrior',
    icon: '🔥',
    description: 'Maintain a 7-day streak',
    unlockCondition: { type: 'streak', value: 7 }
  },
  {
    key: 'steadyNavigator',
    name: 'Steady Navigator',
    icon: '⭐',
    description: 'Complete 30 total sessions',
    unlockCondition: { type: 'sessions', value: 30 }
  },
  {
    key: 'focusedMind',
    name: 'Focused Mind',
    icon: '🧠',
    description: 'Complete 60 minutes of practice',
    unlockCondition: { type: 'minutes', value: 60 }
  },
  {
    key: 'calmExplorer',
    name: 'Calm Explorer',
    icon: '🌊',
    description: 'Complete 10 sessions',
    unlockCondition: { type: 'sessions', value: 10 }
  },
  {
    key: 'sleepGuardian',
    name: 'Sleep Guardian',
    icon: '🌙',
    description: 'Complete 4 sleep-focused sessions',
    unlockCondition: { type: 'challenges', value: 4 }
  },
  {
    key: 'monthMaster',
    name: 'Month Master',
    icon: '🏆',
    description: 'Maintain a 30-day streak',
    unlockCondition: { type: 'streak', value: 30 }
  },
  {
    key: 'centurion',
    name: 'Centurion',
    icon: '💯',
    description: 'Complete 100 total sessions',
    unlockCondition: { type: 'sessions', value: 100 }
  }
]

export function getBadgeByKey(key: string): BadgeDefinition | undefined {
  return badgeDefinitions.find(b => b.key === key)
}
