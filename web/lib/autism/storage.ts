import type { ProgressStats, Plan, UserContext } from '@/types/autism'

const STORAGE_PREFIX = 'nb:autism:v2:'

// =============================================================================
// USER CONTEXT (Audience + Country)
// =============================================================================

export function getUserContext(): UserContext {
  if (typeof window === 'undefined') {
    return { audience: 'teacher', country: 'uk' }
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}context`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load user context:', e)
  }

  return { audience: 'teacher', country: 'uk' }
}

export function saveUserContext(context: UserContext): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(`${STORAGE_PREFIX}context`, JSON.stringify(context))
  } catch (e) {
    console.error('Failed to save user context:', e)
  }
}

// =============================================================================
// PROGRESS STATS
// =============================================================================

function defaultProgress(): ProgressStats {
  return {
    streak: 0,
    sessions: 0,
    minutes: 0,
    skillsPracticed: new Set<string>(),
    plansCompleted: 0,
    lastSessionDate: null,
    badges: new Set<string>(),
    weeklyMinutes: {}
  }
}

export function getProgress(): ProgressStats {
  if (typeof window === 'undefined') {
    return defaultProgress()
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}progress`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        ...parsed,
        skillsPracticed: new Set(parsed.skillsPracticed || []),
        badges: new Set(parsed.badges || []),
        weeklyMinutes: parsed.weeklyMinutes || {}
      }
    }
  } catch (e) {
    console.warn('Failed to load progress:', e)
  }

  return defaultProgress()
}

export function saveProgress(progress: ProgressStats): void {
  if (typeof window === 'undefined') return

  try {
    const toSave = {
      ...progress,
      skillsPracticed: Array.from(progress.skillsPracticed),
      badges: Array.from(progress.badges)
    }
    localStorage.setItem(`${STORAGE_PREFIX}progress`, JSON.stringify(toSave))
    
    // Dispatch event for reactive updates
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('nb:autism:progress-updated', {
        detail: { progress }
      }))
    }
  } catch (e) {
    console.error('Failed to save progress:', e)
  }
}

// Update streak logic
export function updateStreak(progress: ProgressStats): ProgressStats {
  const today = new Date().toISOString().split('T')[0]
  const lastDate = progress.lastSessionDate

  if (!lastDate) {
    return { ...progress, streak: 1, lastSessionDate: today }
  }

  const daysDiff = daysBetween(lastDate, today)

  if (daysDiff === 0) {
    // Same day - no change
    return progress
  } else if (daysDiff === 1) {
    // Consecutive day - increment
    return { ...progress, streak: progress.streak + 1, lastSessionDate: today }
  } else {
    // Streak broken
    return { ...progress, streak: 1, lastSessionDate: today }
  }
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA)
  const b = new Date(dateB)
  const diffMs = b.getTime() - a.getTime()
  return Math.floor(diffMs / (1000 * 60 * 60 * 24))
}

// Log a session
export function logSession(minutes: number, skillId?: string): void {
  const progress = getProgress()
  const today = new Date().toISOString().split('T')[0]

  const updated: ProgressStats = {
    ...progress,
    sessions: progress.sessions + 1,
    minutes: progress.minutes + minutes,
    weeklyMinutes: {
      ...progress.weeklyMinutes,
      [today]: (progress.weeklyMinutes[today] || 0) + minutes
    }
  }

  if (skillId) {
    updated.skillsPracticed = new Set([...progress.skillsPracticed, skillId])
  }

  const withStreak = updateStreak(updated)
  const withBadges = checkAndAwardBadges(withStreak)

  saveProgress(withBadges)
}

// Check and award badges
function checkAndAwardBadges(progress: ProgressStats): ProgressStats {
  const newBadges = new Set(progress.badges)

  // First Calm Minute
  if (progress.sessions >= 1 && !newBadges.has('first-calm')) {
    newBadges.add('first-calm')
  }

  // 3-Day Streak
  if (progress.streak >= 3 && !newBadges.has('streak-3')) {
    newBadges.add('streak-3')
  }

  // 7-Day Streak
  if (progress.streak >= 7 && !newBadges.has('week-warrior')) {
    newBadges.add('week-warrior')
  }

  // Skill-specific badges
  const skills = Array.from(progress.skillsPracticed)
  if (skills.some(s => s.includes('visual')) && !newBadges.has('visual-starter')) {
    newBadges.add('visual-starter')
  }
  if (skills.some(s => s.includes('transition')) && skills.filter(s => s.includes('transition')).length >= 5 && !newBadges.has('transition-pro')) {
    newBadges.add('transition-pro')
  }
  if (skills.some(s => s.includes('calm-corner') || s.includes('sensory')) && !newBadges.has('sensory-planner')) {
    newBadges.add('sensory-planner')
  }
  if (skills.some(s => s.includes('pecs') || s.includes('aac')) && !newBadges.has('communication-supporter')) {
    newBadges.add('communication-supporter')
  }
  if (skills.some(s => s.includes('peer')) && !newBadges.has('inclusive-classroom')) {
    newBadges.add('inclusive-classroom')
  }
  if (skills.some(s => s.includes('workplace')) && !newBadges.has('workplace-ally')) {
    newBadges.add('workplace-ally')
  }

  // Plan completer
  if (progress.plansCompleted >= 1 && !newBadges.has('plan-complete')) {
    newBadges.add('plan-complete')
  }

  return { ...progress, badges: newBadges }
}

// =============================================================================
// PLANS
// =============================================================================

export function getPlans(): Plan[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}plans`)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.warn('Failed to load plans:', e)
  }

  return []
}

export function savePlan(plan: Plan): void {
  if (typeof window === 'undefined') return

  try {
    const plans = getPlans()
    plans.unshift(plan)
    // Keep last 10
    if (plans.length > 10) {
      plans.splice(10)
    }
    localStorage.setItem(`${STORAGE_PREFIX}plans`, JSON.stringify(plans))
  } catch (e) {
    console.error('Failed to save plan:', e)
  }
}

export function updatePlan(planId: string, updates: Partial<Plan>): void {
  if (typeof window === 'undefined') return

  try {
    const plans = getPlans()
    const index = plans.findIndex(p => p.id === planId)
    if (index !== -1) {
      plans[index] = { ...plans[index], ...updates }
      localStorage.setItem(`${STORAGE_PREFIX}plans`, JSON.stringify(plans))
    }
  } catch (e) {
    console.error('Failed to update plan:', e)
  }
}

export function completePlan(_planId: string): void {
  if (typeof window === 'undefined') return

  const progress = getProgress()
  const updated = { ...progress, plansCompleted: progress.plansCompleted + 1 }
  const withBadges = checkAndAwardBadges(updated)
  saveProgress(withBadges)
}

// =============================================================================
// RESET
// =============================================================================

export function resetProgress(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}progress`)
    localStorage.removeItem(`${STORAGE_PREFIX}plans`)
    
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('nb:autism:progress-updated', {
        detail: { progress: defaultProgress() }
      }))
    }
  } catch (e) {
    console.error('Failed to reset progress:', e)
  }
}

