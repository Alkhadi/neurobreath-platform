'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, Clock, Flame, RefreshCw, Target, Filter, X, ExternalLink } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ProgressCalendar } from '@/components/progress/ProgressCalendar'
import { Badge } from '@/components/ui/badge'

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
  recent: Array<{ occurredAt: string; type: string; label: string; minutes?: number; path?: string | null }>
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

function labelForEventType(type: string): string {
  switch (type) {
    case 'breathing_completed':
      return 'Breathing session completed'
    case 'lesson_completed':
      return 'Lesson completed'
    case 'quiz_completed':
      return 'Quiz completed'
    case 'focus_garden_completed':
      return 'Focus Garden action'
    case 'challenge_completed':
      return 'Challenge completed'
    case 'quest_completed':
      return 'Quest progress'
    case 'meditation_completed':
      return 'Meditation completed'
    default:
      return type.replace(/_/g, ' ')
  }
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

type ActivityFilter = 'all' | 'breathing' | 'lesson' | 'quiz' | 'focus_garden'

export default function ProgressPage() {
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
      } finally {
        // leave loading state to the summary fetch
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

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
      } catch {
        if (!cancelled) setError('Could not load progress right now.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void run()

    // BroadcastChannel for real-time cross-tab updates
    let channel: BroadcastChannel | null = null
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        channel = new BroadcastChannel('nb_progress_channel')
        channel.onmessage = (event) => {
          if (event.data?.type === 'progress:event' && autoRefresh) {
            // Another tab recorded progress - refresh immediately
            if (!cancelled) void run()
          }
        }
      } catch {
        // BroadcastChannel not supported - no problem
      }
    }

    // Polling fallback: refresh every 60 seconds (for cross-device updates)
    let interval: NodeJS.Timeout | null = null
    if (autoRefresh) {
      interval = setInterval(() => {
        if (!cancelled) {
          void run()
        }
      }, 60_000)
    }

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
      if (channel) {
        try {
          channel.close()
        } catch {
          // ignore
        }
      }
    }
  }, [activeSubjectId, range, reloadKey, autoRefresh])

  const totals = data?.totals
  const streak = data?.streak
  const dailySeries = useMemo(() => data?.dailySeries ?? [], [data?.dailySeries])
  const recent = useMemo(() => data?.recent ?? [], [data?.recent])

  const completionCount = useMemo(() => {
    if (!totals) return 0
    return (totals.lessonsCompleted ?? 0) + (totals.quizzesCompleted ?? 0) + (totals.focusGardenCompletions ?? 0)
  }, [totals])

  // Compute additional stats for context
  const stats = useMemo(() => {
    if (!totals || !dailySeries.length) return null
    
    const activeDays = dailySeries.filter(d => d.count > 0).length
    const totalDays = dailySeries.length
    const consistencyPercent = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0
    
    const avgMinutesPerDay = totalDays > 0 ? Math.round(totals.minutesBreathing / totalDays) : 0
    
    return {
      activeDays,
      totalDays,
      consistencyPercent,
      avgMinutesPerDay,
    }
  }, [totals, dailySeries])

  // Filter recent activity
  const filteredRecent = useMemo(() => {
    if (activityFilter === 'all') return recent
    
    const typeMap: Record<ActivityFilter, string[]> = {
      all: [],
      breathing: ['breathing_completed'],
      lesson: ['lesson_completed'],
      quiz: ['quiz_completed'],
      focus_garden: ['focus_garden_completed', 'quest_completed'],
    }
    
    const allowedTypes = typeMap[activityFilter] || []
    return recent.filter(e => allowedTypes.includes(e.type))
  }, [recent, activityFilter])

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    const dateStr = selectedDate.split('T')[0] // YYYY-MM-DD
    return recent.filter(e => e.occurredAt.startsWith(dateStr))
  }, [selectedDate, recent])

  const selectedDayStats = useMemo(() => {
    if (!selectedDate || !dailySeries.length) return null
    const dateStr = selectedDate.split('T')[0]
    const dayData = dailySeries.find(d => d.date === dateStr)
    return dayData || { date: dateStr, count: 0, minutesBreathing: 0 }
  }, [selectedDate, dailySeries])

  // Smart description based on context
  const smartDescription = useMemo(() => {
    if (!data) return 'See your recent activity and streaks.'
    
    const subjectName = data.subject.displayName
    const isMe = data.subject.id === 'me'
    const isGuest = data.identity.kind === 'guest'
    
    if (isGuest) {
      return 'Tracking this device only. Sign in to sync across devices.'
    }
    
    if (isMe) {
      return 'Tracking your activity across devices (breathing, learning, and Focus Garden).'
    }
    
    return `Tracking ${subjectName}'s activity across breathing, learning, and Focus Garden.`
  }, [data])

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Progress</h1>
          <p className="text-lg text-gray-600">{smartDescription}</p>
        </div>

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
              {(subjects.length ? subjects : [{ id: 'me', kind: 'self', displayName: 'Me' }]).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
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
          </div>

          {data?.identity?.kind === 'guest' && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tip:</span> <Link className="underline" href="/login">Sign in</Link> to sync across devices.
            </div>
          )}
        </div>

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

                  // Refresh subjects list and select new learner
                  const subjectsRes = await fetch('/api/subjects', { cache: 'no-store' })
                  const subjectsJson = (await subjectsRes.json().catch(() => null)) as SubjectsResponse | null
                  if (subjectsRes.ok && subjectsJson && ('ok' in subjectsJson) && subjectsJson.ok === true) {
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
                {creatingLearner ? 'Creating…' : 'Add learner'}
              </Button>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <p className="text-gray-700 mb-4">{error}</p>
            <Button onClick={() => setReloadKey((k) => k + 1)} variant="outline">Try again</Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                <p className="text-3xl font-bold text-gray-900">{totals?.breathingSessions ?? 0}</p>
                {stats && (
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.activeDays > 0 ? `Avg ${Math.round((totals?.breathingSessions ?? 0) / stats.activeDays)} per active day` : 'No active days'}
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Completed</p>
          </div>

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
                <p className="text-3xl font-bold text-gray-900">{totals?.minutesBreathing ?? 0}</p>
                {stats && (
                  <p className="text-xs text-gray-500 mt-1">
                    Avg {stats.avgMinutesPerDay} min/day
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Time practiced</p>
          </div>

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
                <p className="text-3xl font-bold text-gray-900">{streak?.currentStreakDays ?? 0}</p>
                {streak && streak.bestStreakDays > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Best: {streak.bestStreakDays} days
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Days in a row</p>
          </div>

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
                    L:{totals.lessonsCompleted} • Q:{totals.quizzesCompleted} • FG:{totals.focusGardenCompletions}
                  </p>
                )}
              </>
            )}
            <p className="text-sm text-gray-500 mt-1">Lessons • quizzes • Focus Garden</p>
          </div>
        </div>

        {/* Calendar View */}
        {!loading && data?.dailySeries && (
          <div className="space-y-4">
            <ProgressCalendar
              dailySeries={data.dailySeries}
              range={range}
              onDateClick={(date) => setSelectedDate(date)}
            />
            {stats && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Consistency:</span> {stats.consistencyPercent}% 
                  <span className="text-gray-400">({stats.activeDays} active days / {stats.totalDays} total)</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Day Details Drawer */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-6 shadow-xl border-2 border-purple-200 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                {selectedDayStats && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedDayStats.count} activities • {selectedDayStats.minutesBreathing || 0} minutes
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
                {selectedDateEvents.map((e, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{e.label}</p>
                      <p className="text-xs text-gray-500">{formatWhen(e.occurredAt)}</p>
                    </div>
                    {e.path && (
                      <Button asChild size="sm" variant="outline">
                        <Link href={e.path}>
                          Resume <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl p-8 shadow-lg mb-8 mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="flex gap-2">
                {(['all', 'breathing', 'lesson', 'quiz', 'focus_garden'] as const).map((filter) => (
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
                    {filter === 'all' ? 'All' : 
                     filter === 'breathing' ? 'Breathing' :
                     filter === 'lesson' ? 'Lessons' :
                     filter === 'quiz' ? 'Quizzes' : 'Focus Garden'}
                  </button>
                ))}
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
                <p className="text-sm text-gray-400 mb-4">Try a 60-second SOS breathing reset.</p>
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
                const durationText = e.minutes ? ` • ${e.minutes} min` : ''
                
                return (
                  <div key={`${e.occurredAt}_${idx}`} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {e.label || labelForEventType(e.type)}{durationText}
                        </p>
                        <p className="text-sm text-gray-500">{formatWhen(e.occurredAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {e.type === 'breathing_completed' && (
                          <Badge variant="secondary" className="text-xs">
                            Breathing
                          </Badge>
                        )}
                        {e.type === 'quiz_completed' && (
                          <Badge variant="secondary" className="text-xs">
                            Quiz
                          </Badge>
                        )}
                        {(e.type === 'focus_garden_completed' || e.type === 'quest_completed') && (
                          <Badge variant="secondary" className="text-xs">
                            Focus Garden
                          </Badge>
                        )}
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
