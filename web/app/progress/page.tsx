
'use client'

import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react'
import {
  Activity,
  Award,
  BookOpen,
  Clock,
  ExternalLink,
  Filter,
  Flame,
  HelpCircle,
  Leaf,
  RefreshCw,
  Target,
  Wind,
  X,
} from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ProgressCalendar } from '@/components/progress/ProgressCalendar'
import { Badge } from '@/components/ui/badge'

// ── Types ──────────────────────────────────────────────────────────────────────

type RangeKey = '7d' | '30d' | '90d'

type SummaryResponse = {
  ok: true
  identity: { kind: 'guest' | 'user' }
  range: RangeKey
  subject: { id: 'me' | string; displayName: string }
  totals: {
    totalEvents: number
    breathingSessions: number
    minutesBreathing: number
    lessonsCompleted: number
    quizzesCompleted: number
    focusGardenCompletions: number
  }
  streak: { currentStreakDays: number; bestStreakDays: number }
  dailySeries: Array<{ date: string; count: number; minutesBreathing?: number }>
  recent: Array<{
    occurredAt: string
    type: string
    label: string
    minutes?: number
    path?: string | null
    metadata?: Record<string, unknown>
  }>
  empty: boolean
}

type SubjectListItem = {
  id: string
  kind: string
  displayName: string
  role?: string
  canWrite?: boolean
}

type SubjectsResponse =
  | { ok: true; subjects: SubjectListItem[] }
  | { ok: false; code?: string; message?: string }

type CreateSubjectResponse =
  | { ok: true; subject: SubjectListItem }
  | { ok: false; code?: string; message?: string }

type ActivityFilter = 'all' | 'breathing' | 'lesson' | 'quiz' | 'focus_garden'

// ── Goals ──────────────────────────────────────────────────────────────────────

type Goals = {
  dailyBreathingMinutes: number
  dailyCompletions: number
  weeklyBreathingMinutes: number
}

const DEFAULT_GOALS: Goals = {
  dailyBreathingMinutes: 5,
  dailyCompletions: 1,
  weeklyBreathingMinutes: 35,
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}

function loadGoals(): Goals {
  try {
    const raw = window.localStorage?.getItem('nb_progress_goals_v1')
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        dailyBreathingMinutes: clamp(Number(parsed.dailyBreathingMinutes) || 5, 1, 240),
        dailyCompletions: clamp(Number(parsed.dailyCompletions) || 1, 1, 50),
        weeklyBreathingMinutes: clamp(Number(parsed.weeklyBreathingMinutes) || 35, 1, 1680),
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_GOALS }
}

function saveGoals(goals: Goals): void {
  try {
    window.localStorage?.setItem('nb_progress_goals_v1', JSON.stringify(goals))
  } catch {
    // ignore
  }
}

// ── Event taxonomy mapper ──────────────────────────────────────────────────────

type EventCategory = 'breathing' | 'learning' | 'focus_garden' | 'achievement' | 'other'

type EventInfo = {
  label: string
  category: EventCategory
  icon: ComponentType<{ className?: string }>
  countsTowardStreak: boolean
  countsTowardCompletions: boolean
}

function techniqueNameFromMetadata(metadata?: Record<string, unknown>): string | null {
  const explicit = typeof metadata?.techniqueName === 'string' ? metadata.techniqueName : null
  if (explicit) return explicit

  const techniqueId = typeof metadata?.techniqueId === 'string' ? metadata.techniqueId : null
  if (!techniqueId) return null

  const key = techniqueId.trim().toLowerCase()
  const lookup: Record<string, string> = {
    coherent: 'Coherent breathing',
    'coherent-5-5': 'Coherent breathing',
    box: 'Box breathing',
    'box-breathing': 'Box breathing',
    '4-7-8': '4-7-8 breathing',
    '4-7-8-breathing': '4-7-8 breathing',
    sos: 'SOS breathing',
    'sos-60': 'SOS breathing',
  }
  return lookup[key] ?? techniqueId
}

function mapEvent(type: string, metadata?: Record<string, unknown>): EventInfo {
  switch (type) {
    case 'breathing_completed': {
      const name = techniqueNameFromMetadata(metadata)
      return {
        label: name ? `${name} session` : 'Breathing session completed',
        category: 'breathing',
        icon: Wind,
        countsTowardStreak: true,
        countsTowardCompletions: false,
      }
    }
    case 'meditation_completed':
      return {
        label: 'Meditation completed',
        category: 'breathing',
        icon: Wind,
        countsTowardStreak: true,
        countsTowardCompletions: false,
      }
    case 'lesson_completed': {
      const title = typeof metadata?.title === 'string' ? metadata.title : null
      return {
        label: title ? `Lesson: ${title}` : 'Lesson completed',
        category: 'learning',
        icon: BookOpen,
        countsTowardStreak: false,
        countsTowardCompletions: true,
      }
    }
    case 'quiz_completed': {
      const title = typeof metadata?.title === 'string' ? metadata.title : null
      return {
        label: title ? `Quiz: ${title}` : 'Quiz completed',
        category: 'learning',
        icon: HelpCircle,
        countsTowardStreak: false,
        countsTowardCompletions: true,
      }
    }
    case 'focus_garden_completed':
      return {
        label: 'Focus Garden action',
        category: 'focus_garden',
        icon: Leaf,
        countsTowardStreak: false,
        countsTowardCompletions: true,
      }
    case 'challenge_completed':
      return {
        label: 'Challenge completed',
        category: 'achievement',
        icon: Award,
        countsTowardStreak: false,
        countsTowardCompletions: true,
      }
    case 'quest_completed':
      return {
        label: 'Quest progress',
        category: 'focus_garden',
        icon: Leaf,
        countsTowardStreak: false,
        countsTowardCompletions: true,
      }
    case 'streak_milestone':
      return {
        label: 'Streak milestone',
        category: 'achievement',
        icon: Award,
        countsTowardStreak: false,
        countsTowardCompletions: false,
      }
    case 'achievement_unlocked':
      return {
        label: 'Achievement unlocked',
        category: 'achievement',
        icon: Award,
        countsTowardStreak: false,
        countsTowardCompletions: false,
      }
    default:
      return {
        label: 'Activity completed',
        category: 'other',
        icon: Activity,
        countsTowardStreak: false,
        countsTowardCompletions: false,
      }
  }
}

function categoryBadgeLabel(cat: EventCategory): string {
  switch (cat) {
    case 'breathing':
      return 'Breathing'
    case 'learning':
      return 'Learning'
    case 'focus_garden':
      return 'Focus Garden'
    case 'achievement':
      return 'Achievement'
    default:
      return 'Activity'
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getLocalDateStr(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function safeGetActiveSubjectId(): string {
  try {
    const v = window.localStorage?.getItem('nb_active_subject')
    if (typeof v === 'string' && v.trim()) return v.trim()
  } catch {
    // ignore
  }
  return 'me'
}

function safeSetActiveSubjectId(subjectId: string) {
  try {
    window.localStorage?.setItem('nb_active_subject', subjectId)
  } catch {
    // ignore
  }
}

function pct(value: number, goal: number): number {
  if (goal <= 0) return 0
  return Math.min(100, Math.round((value / goal) * 100))
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  // Core state
  const [range, setRange] = useState<RangeKey>('30d')
  const [subjects, setSubjects] = useState<SubjectListItem[]>([])
  const [activeSubjectId, setActiveSubjectId] = useState<string>('me')
  const [newLearnerName, setNewLearnerName] = useState('')
  const [creatingLearner, setCreatingLearner] = useState(false)
  const [data, setData] = useState<SummaryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // Goals
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS)
  const [editingGoals, setEditingGoals] = useState(false)

  // Real-time tracking
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load goals from localStorage on mount
  useEffect(() => {
    setGoals(loadGoals())
  }, [])

  // ── Subjects loader ──
  useEffect(() => {
    let cancelled = false

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/subjects', { cache: 'no-store' })
        if (!res.ok) return
        const json = (await res.json()) as SubjectsResponse
        if (!('ok' in json) || json.ok !== true) return

        const list = json.subjects
        const wanted = safeGetActiveSubjectId()
        const inList = list.some((s) => s.id === wanted)
        const activeId = inList ? wanted : 'me'
        safeSetActiveSubjectId(activeId)
        if (cancelled) return

        setSubjects(list)
        setActiveSubjectId(activeId)
      } catch {
        if (!cancelled) {
          setSubjects([{ id: 'me', kind: 'self', displayName: 'Me' }])
          setActiveSubjectId('me')
          setError('Could not load subjects right now.')
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  // ── Summary fetch + real-time listeners (debounced) ──
  useEffect(() => {
    let cancelled = false
    let debounceTimer: NodeJS.Timeout | null = null

    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/progress/summary?range=${range}&subjectId=${encodeURIComponent(activeSubjectId)}`,
          { cache: 'no-store' },
        )
        if (!res.ok) {
          setError('Could not load progress right now.')
          return
        }
        const json = (await res.json()) as SummaryResponse | { ok: false }
        if (cancelled) return
        if (!('ok' in json) || json.ok !== true) {
          setError('Could not load progress right now.')
          return
        }
        setData(json)
        setLastUpdated(new Date())
      } catch {
        if (!cancelled) setError('Could not load progress right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()

    // Debounced handler for real-time events
    const debouncedRun = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        if (!cancelled) void run()
      }, 300)
    }

    // BroadcastChannel listeners
    const channels: BroadcastChannel[] = []
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        ;['nb_progress', 'nb_progress_channel'].forEach((name) => {
          const channel = new BroadcastChannel(name)
          channel.onmessage = (event) => {
            const msgType = event.data?.type
            if (
              (msgType === 'progress:event' || msgType === 'event_recorded') &&
              autoRefresh
            ) {
              if (!cancelled) debouncedRun()
            }
          }
          channels.push(channel)
        })
      } catch {
        // BroadcastChannel not supported
      }
    }

    // CustomEvent fallback
    const handleProgressEvent = () => {
      if (!cancelled && autoRefresh) debouncedRun()
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('nb_progress_event_recorded', handleProgressEvent)
    }

    // localStorage ping listener (cross-tab signal)
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'nb_progress_ping' && autoRefresh) {
        if (!cancelled) debouncedRun()
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageEvent)
    }

    // Polling fallback: refresh every 60 seconds
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        if (!cancelled) void run()
      }, 60_000)
    }

    return () => {
      cancelled = true
      if (debounceTimer) clearTimeout(debounceTimer)
      if (interval) clearInterval(interval)
      channels.forEach((ch) => {
        try {
          ch.close()
        } catch {
          // ignore
        }
      })
      if (typeof window !== 'undefined') {
        window.removeEventListener('nb_progress_event_recorded', handleProgressEvent)
        window.removeEventListener('storage', handleStorageEvent)
      }
    }
  }, [activeSubjectId, range, reloadKey, autoRefresh])

  // ── Computed values ──

  const totals = data?.totals
  const streak = data?.streak
  const dailySeries = useMemo(() => data?.dailySeries ?? [], [data?.dailySeries])
  const recent = useMemo(() => data?.recent ?? [], [data?.recent])

  const completionCount = useMemo(() => {
    if (!totals) return 0
    return (totals.lessonsCompleted ?? 0) + (totals.quizzesCompleted ?? 0) + (totals.focusGardenCompletions ?? 0)
  }, [totals])

  const stats = useMemo(() => {
    if (!totals || !dailySeries.length) return null
    const activeDays = dailySeries.filter((d) => d.count > 0).length
    const totalDays = dailySeries.length
    const consistencyPercent = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0
    const avgMinutesPerDay = totalDays > 0 ? Math.round(totals.minutesBreathing / totalDays) : 0
    return { activeDays, totalDays, consistencyPercent, avgMinutesPerDay }
  }, [totals, dailySeries])

  // Today's date (local timezone)
  const todayStr = useMemo(() => getLocalDateStr(), [])

  // Today's metrics for goals
  const todayMetrics = useMemo(() => {
    const todayDay = dailySeries.find((d) => d.date === todayStr)
    const breathingMinutes = todayDay?.minutesBreathing ?? 0

    const completions = recent.filter((e) => {
      const eventDate = getLocalDateStr(new Date(e.occurredAt))
      if (eventDate !== todayStr) return false
      return mapEvent(e.type, e.metadata).countsTowardCompletions
    }).length

    return { breathingMinutes, completions }
  }, [dailySeries, recent, todayStr])

  // Weekly breathing minutes (last 7 days)
  const weeklyBreathingMinutes = useMemo(() => {
    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    const startStr = getLocalDateStr(sevenDaysAgo)
    return dailySeries
      .filter((d) => d.date >= startStr && d.date <= todayStr)
      .reduce((sum, d) => sum + (d.minutesBreathing ?? 0), 0)
  }, [dailySeries, todayStr])

  // Streak qualification for today
  const streakQualifiedToday = useMemo(() => {
    const todayDay = dailySeries.find((d) => d.date === todayStr)
    if ((todayDay?.minutesBreathing ?? 0) >= 1) return true

    // Fallback: if minutes series is missing, infer from recent breathing events.
    return recent.some((e) => {
      if (getLocalDateStr(new Date(e.occurredAt)) !== todayStr) return false
      if (e.type !== 'breathing_completed' && e.type !== 'meditation_completed') return false
      if (typeof e.minutes === 'number' && e.minutes >= 1) return true
      const dur = (e.metadata as Record<string, unknown> | undefined)?.durationSeconds
      return typeof dur === 'number' && dur >= 60
    })
  }, [dailySeries, recent, todayStr])

  const qualifiedByDate = useMemo(() => {
    const out: Record<string, boolean> = {}
    for (const day of dailySeries) {
      out[day.date] = (day.minutesBreathing ?? 0) >= 1
    }
    for (const e of recent) {
      if (e.type !== 'breathing_completed' && e.type !== 'meditation_completed') continue
      const dateKey = getLocalDateStr(new Date(e.occurredAt))
      if (out[dateKey]) continue

      if (typeof e.minutes === 'number' && e.minutes >= 1) {
        out[dateKey] = true
        continue
      }
      const dur = (e.metadata as Record<string, unknown> | undefined)?.durationSeconds
      if (typeof dur === 'number' && dur >= 60) out[dateKey] = true
    }
    return out
  }, [dailySeries, recent])

  // Filter recent activity
  const filteredRecent = useMemo(() => {
    if (activityFilter === 'all') return recent
    const typeMap: Record<ActivityFilter, string[]> = {
      all: [],
      breathing: ['breathing_completed', 'meditation_completed'],
      lesson: ['lesson_completed'],
      quiz: ['quiz_completed'],
      focus_garden: ['focus_garden_completed', 'quest_completed'],
    }
    const allowedTypes = typeMap[activityFilter] || []
    return recent.filter((e) => allowedTypes.includes(e.type))
  }, [recent, activityFilter])

  // Selected date events (timezone-safe)
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    return recent.filter((e) => getLocalDateStr(new Date(e.occurredAt)) === selectedDate)
  }, [selectedDate, recent])

  const selectedDayStats = useMemo(() => {
    if (!selectedDate || !dailySeries.length) return null
    const dayData = dailySeries.find((d) => d.date === selectedDate)
    return dayData || { date: selectedDate, count: 0, minutesBreathing: 0 }
  }, [selectedDate, dailySeries])

  // Smart description
  const smartDescription = useMemo(() => {
    if (!data) return 'See your recent activity and streaks.'
    const isGuest = data.identity.kind === 'guest'
    const isMe = data.subject.id === 'me'
    if (isGuest) return 'Tracking this device only. Sign in to sync across devices.'
    if (isMe) return 'Tracking your activity across devices (breathing, learning, and Focus Garden).'
    return `Tracking ${data.subject.displayName}'s activity across breathing, learning, and Focus Garden.`
  }, [data])

  // "Updated at" text
  const lastUpdatedText = useMemo(() => {
    if (!lastUpdated) return ''
    const deltaMs = Date.now() - lastUpdated.getTime()
    if (deltaMs >= 0 && deltaMs < 15_000) return 'Updated just now'
    return `Updated ${lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  }, [lastUpdated])

  // Goal updater
  const updateGoal = useCallback(
    (field: keyof Goals, value: number, min: number, max: number) => {
      const clamped = clamp(value, min, max)
      setGoals((prev) => {
        const next = { ...prev, [field]: clamped }
        saveGoals(next)
        return next
      })
    },
    [],
  )

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress</h1>
          <p className="text-lg text-gray-600">{smartDescription}</p>
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex items-center gap-2">
            <label htmlFor="learner" className="text-sm font-medium text-gray-700">
              Learner
            </label>
            <select
              id="learner"
              value={activeSubjectId}
              onChange={(e) => {
                const next = e.target.value
                setActiveSubjectId(next)
                safeSetActiveSubjectId(next)
              }}
              className="h-10 rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm"
              disabled={loading && subjects.length === 0}
            >
              {(subjects.length ? subjects : [{ id: 'me', kind: 'self', displayName: 'Me' }]).map(
                (s) => (
                  <option key={s.id} value={s.id}>
                    {s.displayName}
                  </option>
                ),
              )}
            </select>
          </div>

          <div className="inline-flex rounded-lg bg-white p-1 shadow">
            {(['7d', '30d', '90d'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setRange(key)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  range === key ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {key === '7d' ? '7 days' : key === '90d' ? '90 days' : '30 days'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setReloadKey((k) => k + 1)}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh
            </Button>

            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                autoRefresh
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
            >
              {autoRefresh ? '● Live' : '○ Paused'}
            </button>

            {lastUpdatedText && (
              <span className="text-xs text-gray-400">{lastUpdatedText}</span>
            )}
          </div>

          {data?.identity?.kind === 'guest' && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tip:</span>{' '}
              <Link className="underline" href="/login">
                Sign in
              </Link>{' '}
              to sync across devices.
            </div>
          )}
        </div>

        {/* ── Add learner (signed-in only) ── */}
        {data?.identity?.kind === 'user' && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Add a learner</h2>
            <form
              className="flex flex-wrap gap-3 items-center"
              onSubmit={async (e) => {
                e.preventDefault()
                const name = newLearnerName.trim()
                if (!name) return

                setCreatingLearner(true)
                try {
                  const res = await fetch('/api/subjects', {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ displayName: name }),
                  })
                  const json = (await res.json().catch(() => null)) as CreateSubjectResponse | null
                  if (!res.ok || !json || !('ok' in json) || json.ok !== true) {
                    setError('Could not create learner right now.')
                    return
                  }

                  const subjectsRes = await fetch('/api/subjects', { cache: 'no-store' })
                  const subjectsJson = (await subjectsRes.json().catch(() => null)) as SubjectsResponse | null
                  if (
                    subjectsRes.ok &&
                    subjectsJson &&
                    'ok' in subjectsJson &&
                    subjectsJson.ok === true
                  ) {
                    setSubjects(subjectsJson.subjects)
                  }

                  setNewLearnerName('')
                  setActiveSubjectId(json.subject.id)
                  safeSetActiveSubjectId(json.subject.id)
                  setReloadKey((k) => k + 1)
                } catch {
                  setError('Could not create learner right now.')
                } finally {
                  setCreatingLearner(false)
                }
              }}
            >
              <input
                type="text"
                value={newLearnerName}
                onChange={(e) => setNewLearnerName(e.target.value)}
                placeholder="e.g. Sam"
                maxLength={80}
                className="h-10 w-64 max-w-full rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm"
                disabled={creatingLearner}
              />
              <Button type="submit" disabled={creatingLearner || !newLearnerName.trim()}>
                {creatingLearner ? 'Creating\u2026' : 'Add learner'}
              </Button>
            </form>
          </div>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => setReloadKey((k) => k + 1)} variant="outline">
              Try again
            </Button>
          </div>
        )}

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Breathing Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Breathing Sessions</h3>
            </div>
            {loading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">
                  {totals?.breathingSessions ?? 0}
                </p>
                {stats && (
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeDays > 0
                      ? `Avg ${Math.round((totals?.breathingSessions ?? 0) / stats.activeDays)} per active day`
                      : 'No active days'}
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Completed</p>
          </div>

          {/* Breathing Minutes */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Breathing Minutes</h3>
            </div>
            {loading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">
                  {totals?.minutesBreathing ?? 0}
                </p>
                {stats && (
                  <p className="text-xs text-gray-500 mt-1">
                    Avg {stats.avgMinutesPerDay} min/day
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Time practiced</p>
          </div>

          {/* Current Streak + qualification chip */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Current Streak</h3>
            </div>
            {loading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">
                  {streak?.currentStreakDays ?? 0}
                </p>
                {streak && streak.bestStreakDays > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Best: {streak.bestStreakDays} days
                  </p>
                )}
                <div
                  className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    streakQualifiedToday
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {streakQualifiedToday ? 'Qualified today' : 'Not yet qualified'}
                </div>
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Days in a row</p>
          </div>

          {/* Completions */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Completions</h3>
            </div>
            {loading ? (
              <div className="h-9 w-16 bg-gray-100 rounded animate-pulse" />
            ) : (
              <>
                <p className="text-3xl font-bold text-gray-900">{completionCount}</p>
                {totals && (
                  <p className="text-xs text-gray-500 mt-1">
                    L:{totals.lessonsCompleted} &middot; Q:{totals.quizzesCompleted} &middot; FG:
                    {totals.focusGardenCompletions}
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Lessons &middot; quizzes &middot; Focus Garden</p>
          </div>
        </div>

        {/* ── Goals card ── */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Daily &amp; Weekly Goals</h3>
            <button
              type="button"
              onClick={() => setEditingGoals(!editingGoals)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              {editingGoals ? 'Done' : 'Edit goals'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Daily breathing minutes */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">Daily breathing</span>
                {editingGoals ? (
                  <span className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={240}
                      aria-label="Daily breathing goal in minutes"
                      value={goals.dailyBreathingMinutes}
                      onChange={(e) => {
                        const v = parseInt(e.target.value)
                        if (!isNaN(v)) updateGoal('dailyBreathingMinutes', v, 1, 240)
                      }}
                      className="w-14 h-6 text-right text-xs border border-gray-300 rounded px-1"
                    />
                    <span className="text-xs text-gray-500">min</span>
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {todayMetrics.breathingMinutes}/{goals.dailyBreathingMinutes} min
                  </span>
                )}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <progress
                  value={pct(todayMetrics.breathingMinutes, goals.dailyBreathingMinutes)}
                  max={100}
                  aria-label="Daily breathing goal progress"
                  className={`h-2 w-full rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 ${
                    todayMetrics.breathingMinutes >= goals.dailyBreathingMinutes
                      ? '[&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500'
                      : '[&::-webkit-progress-value]:bg-purple-500 [&::-moz-progress-bar]:bg-purple-500'
                  }`}
                />
              </div>
            </div>

            {/* Daily completions */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">Daily completions</span>
                {editingGoals ? (
                  <span className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={50}
                      aria-label="Daily completions goal"
                      value={goals.dailyCompletions}
                      onChange={(e) => {
                        const v = parseInt(e.target.value)
                        if (!isNaN(v)) updateGoal('dailyCompletions', v, 1, 50)
                      }}
                      className="w-14 h-6 text-right text-xs border border-gray-300 rounded px-1"
                    />
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {todayMetrics.completions}/{goals.dailyCompletions}
                  </span>
                )}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <progress
                  value={pct(todayMetrics.completions, goals.dailyCompletions)}
                  max={100}
                  aria-label="Daily completions goal progress"
                  className={`h-2 w-full rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 ${
                    todayMetrics.completions >= goals.dailyCompletions
                      ? '[&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500'
                      : '[&::-webkit-progress-value]:bg-purple-500 [&::-moz-progress-bar]:bg-purple-500'
                  }`}
                />
              </div>
            </div>

            {/* Weekly breathing minutes */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">Weekly breathing</span>
                {editingGoals ? (
                  <span className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={1680}
                      aria-label="Weekly breathing goal in minutes"
                      value={goals.weeklyBreathingMinutes}
                      onChange={(e) => {
                        const v = parseInt(e.target.value)
                        if (!isNaN(v)) updateGoal('weeklyBreathingMinutes', v, 1, 1680)
                      }}
                      className="w-14 h-6 text-right text-xs border border-gray-300 rounded px-1"
                    />
                    <span className="text-xs text-gray-500">min</span>
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {weeklyBreathingMinutes}/{goals.weeklyBreathingMinutes} min
                  </span>
                )}
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <progress
                  value={pct(weeklyBreathingMinutes, goals.weeklyBreathingMinutes)}
                  max={100}
                  aria-label="Weekly breathing goal progress"
                  className={`h-2 w-full rounded-full [&::-webkit-progress-bar]:bg-gray-100 [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-500 [&::-moz-progress-bar]:transition-all [&::-moz-progress-bar]:duration-500 ${
                    weeklyBreathingMinutes >= goals.weeklyBreathingMinutes
                      ? '[&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500'
                      : '[&::-webkit-progress-value]:bg-purple-500 [&::-moz-progress-bar]:bg-purple-500'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Calendar view ── */}
        {!loading && data?.dailySeries && (
          <div className="space-y-4">
            <ProgressCalendar
              dailySeries={data.dailySeries}
              range={range}
              qualifiedByDate={qualifiedByDate}
              onDateClick={(date) => setSelectedDate(date)}
            />
            {stats && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Consistency:</span> {stats.consistencyPercent}%{' '}
                  <span className="text-gray-400">
                    ({stats.activeDays} active days / {stats.totalDays} total)
                  </span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Day details drawer ── */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-purple-200 mb-8 mt-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </h3>
                {selectedDayStats && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedDayStats.count} activities &middot;{' '}
                    {selectedDayStats.minutesBreathing ?? 0} minutes
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedDateEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No activities on this day</p>
            ) : (
              <div className="space-y-2">
                {selectedDateEvents.map((e, idx) => {
                  const info = mapEvent(e.type, e.metadata)
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-gray-50 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-start gap-2">
                        <info.icon className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{info.label}</p>
                          <p className="text-xs text-gray-500">{formatWhen(e.occurredAt)}</p>
                        </div>
                      </div>
                      {e.path && (
                        <Button asChild size="sm" variant="outline">
                          <Link href={e.path}>
                            Resume <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Recent Activity ── */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex gap-2">
                {(['all', 'breathing', 'lesson', 'quiz', 'focus_garden'] as const).map(
                  (filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActivityFilter(filter)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                        activityFilter === filter
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {filter === 'all'
                        ? 'All'
                        : filter === 'breathing'
                          ? 'Breathing'
                          : filter === 'lesson'
                            ? 'Lessons'
                            : filter === 'quiz'
                              ? 'Quizzes'
                              : 'Focus Garden'}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {!loading && filteredRecent.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">
                {data?.identity?.kind === 'guest'
                  ? 'You have no tracked activity on this device for this range.'
                  : data?.subject.id === 'me'
                    ? 'No tracked activity for this range.'
                    : `No activity for ${data?.subject.displayName} in this range.`}
              </p>
              {data?.identity?.kind === 'user' && data?.subject.id === 'me' && (
                <p className="text-sm text-gray-400 mb-4">
                  Try a 60-second SOS breathing reset.
                </p>
              )}
              <div className="flex flex-wrap justify-center gap-3 mt-4">
                <Button asChild>
                  <Link href="/tools/breath-tools">Start a breathing session</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/breathing/training/focus-garden">Try Focus Garden</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(loading ? Array.from({ length: 6 }) : filteredRecent).map((item, idx) => {
                if (loading) {
                  return (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="h-4 w-56 bg-gray-100 rounded animate-pulse mb-2" />
                      <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                    </div>
                  )
                }

                const e = item as SummaryResponse['recent'][number]
                const eventInfo = mapEvent(e.type, e.metadata)
                const meta = e.metadata

                // Build detail parts (technique, pattern, duration)
                const detailParts: string[] = []
                if (e.type === 'breathing_completed' && meta) {
                  if (typeof meta.pattern === 'string') detailParts.push(meta.pattern)
                }
                if (e.minutes) {
                  detailParts.push(`${e.minutes} min`)
                } else if (typeof meta?.durationSeconds === 'number') {
                  const sec = meta.durationSeconds as number
                  detailParts.push(sec >= 60 ? `${Math.round(sec / 60)} min` : `${sec}s`)
                }
                if (e.type !== 'breathing_completed' && meta) {
                  const slug = typeof meta.slug === 'string' ? meta.slug : null
                  if (slug && !eventInfo.label.includes(slug)) detailParts.push(slug)
                }
                const detailText = detailParts.join(' \u00b7 ')

                return (
                  <div
                    key={`${e.occurredAt}_${idx}`}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 flex items-start gap-2">
                        <eventInfo.icon className="w-4 h-4 mt-0.5 text-gray-500" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{eventInfo.label}</p>
                          {detailText && (
                            <p className="text-xs text-gray-500">{detailText}</p>
                          )}
                          <p className="text-sm text-gray-500">{formatWhen(e.occurredAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {categoryBadgeLabel(eventInfo.category)}
                        </Badge>
                        {e.path && (
                          <Button asChild size="sm" variant="ghost" className="h-8 px-2">
                            <Link href={e.path}>
                              Resume <ExternalLink className="w-3 h-3 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Bottom actions ── */}
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Continue Practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/settings">Progress Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
