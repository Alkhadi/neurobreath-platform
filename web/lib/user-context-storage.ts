import type { UserContext } from '@/types/user-context'

const STORAGE_KEY = 'nb_ai_context_v1'

/**
 * Safely parse JSON from localStorage
 * Returns null if invalid or missing
 */
function safeJSONParse<T>(value: string | null): T | null {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

/**
 * Validate context object has expected shape
 */
function isValidContext(obj: unknown): obj is UserContext {
  if (!obj || typeof obj !== 'object') return false
  // Allow any fields to be optional, but check types if present
  const ctx = obj as Record<string, unknown>
  if (ctx.ageGroup && typeof ctx.ageGroup !== 'string') return false
  if (ctx.setting && typeof ctx.setting !== 'string') return false
  if (ctx.mainChallenge && typeof ctx.mainChallenge !== 'string') return false
  if (ctx.goal && typeof ctx.goal !== 'string') return false
  if (ctx.country && typeof ctx.country !== 'string') return false
  if (ctx.topic && typeof ctx.topic !== 'string') return false
  return true
}

/**
 * Load user context from localStorage
 * Returns empty object if missing or invalid
 */
export function loadContext(): UserContext {
  if (typeof window === 'undefined') return { country: 'UK' }
  
  const stored = safeJSONParse<UserContext>(localStorage.getItem(STORAGE_KEY))
  
  if (stored && isValidContext(stored)) {
    return { country: 'UK', ...stored }
  }
  
  return { country: 'UK' }
}

/**
 * Save user context to localStorage
 */
export function saveContext(context: UserContext): void {
  if (typeof window === 'undefined') return
  
  try {
    // Ensure country defaults to UK
    const toSave = { country: 'UK', ...context }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (error) {
    console.error('Failed to save context:', error)
  }
}

/**
 * Clear user context from localStorage
 */
export function clearContext(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear context:', error)
  }
}

/**
 * Format context for display
 */
export function formatContextSummary(context: UserContext): string {
  const parts: string[] = []
  
  if (context.country) parts.push(context.country)
  if (context.ageGroup) parts.push(context.ageGroup)
  if (context.setting) parts.push(context.setting)
  if (context.mainChallenge) parts.push(context.mainChallenge)
  if (context.goal) parts.push(context.goal)
  
  return parts.length > 0 ? parts.join(' · ') : 'No context set'
}





