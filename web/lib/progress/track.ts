export type ProgressEventType =
  | 'breathing_completed'
  | 'lesson_completed'
  | 'meditation_completed'
  | 'quiz_completed'
  | 'focus_garden_completed'
  | 'challenge_completed'
  | 'quest_completed'
  | 'streak_milestone'
  | 'achievement_unlocked'

export type TrackProgressInput = {
  type: ProgressEventType
  metadata?: Record<string, unknown>
  path?: string
}

export async function trackProgress(input: TrackProgressInput): Promise<void> {
  try {
    if (typeof window === 'undefined') return

    const stored = window.localStorage?.getItem('nb_active_subject')
    const activeSubjectId = typeof stored === 'string' && stored.trim() ? stored.trim() : 'me'

    const body = {
      type: input.type,
      ...(input.path ? { path: input.path } : {}),
      ...(input.metadata ? { metadata: input.metadata } : {}),
      subjectId: activeSubjectId,
    }

    await fetch('/api/progress/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
      credentials: 'include',
    }).catch(() => null)
  } catch {
    // never throw
  }
}
