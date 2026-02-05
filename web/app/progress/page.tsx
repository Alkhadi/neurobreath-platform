'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, Clock, Flame, RefreshCw, Target } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { ProgressCalendar } from '@/components/progress/ProgressCalendar'

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

    // Real-time polling: refresh every 30 seconds
    const interval = setInterval(() => {
      if (!cancelled) {
        void run()
      }
    }, 30_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [activeSubjectId, range, reloadKey])

  const totals = data?.totals
  const streak = data?.streak

  const completionCount = useMemo(() => {
    if (!totals) return 0
    return (totals.lessonsCompleted ?? 0) + (totals.quizzesCompleted ?? 0) + (totals.focusGardenCompletions ?? 0)
  }, [totals])

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Progress</h1>
          <p className="text-lg text-gray-600">See your recent activity and streaks.</p>
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

          <Button
            type="button"
            variant="outline"
            onClick={() => setReloadKey((k) => k + 1)}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>

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
              <p className="text-3xl font-bold text-gray-900">{totals?.breathingSessions ?? 0}</p>
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
              <p className="text-3xl font-bold text-gray-900">{totals?.minutesBreathing ?? 0}</p>
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
              <p className="text-3xl font-bold text-gray-900">{streak?.currentStreakDays ?? 0}</p>
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
              <p className="text-3xl font-bold text-gray-900">{completionCount}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Lessons • quizzes • Focus Garden</p>
          </div>
        </div>

        {/* Calendar View */}
        {!loading && data?.dailySeries && (
          <ProgressCalendar
            dailySeries={data.dailySeries}
            range={range}
            onDateClick={(date) => {
              console.log('Clicked date:', date)
              // Could show day detail modal in future
            }}
          />
        )}

        <div className="bg-white rounded-xl p-8 shadow-lg mb-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

          {!loading && data?.empty ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No activity yet for this range.</p>
              <div className="flex flex-wrap justify-center gap-3">
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
              {(loading ? Array.from({ length: 6 }) : (data?.recent ?? [])).map((item, idx) => {
                if (loading) {
                  return (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                      <div className="h-4 w-56 bg-gray-100 rounded animate-pulse mb-2" />
                      <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
                    </div>
                  )
                }

                const e = item as SummaryResponse['recent'][number]
                return (
                  <div key={`${e.occurredAt}_${idx}`} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">{e.label || labelForEventType(e.type)}</p>
                        <p className="text-sm text-gray-500">{formatWhen(e.occurredAt)}</p>
                      </div>
                      {e.type === 'breathing_completed' && (
                        <span className="text-xs font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                          Breathing
                        </span>
                      )}
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
