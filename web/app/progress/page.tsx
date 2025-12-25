'use client'

import { useEffect, useState } from 'react'
import { Activity, Flame, Target, Clock } from 'lucide-react'
import { getDeviceId } from '@/lib/device-id'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ProgressData {
  totalSessions: number
  totalMinutes: number
  totalBreaths: number
  currentStreak: number
  longestStreak: number
}

interface Session {
  id: string
  technique: string
  label: string
  minutes: number
  breaths: number
  completedAt: string
  category?: string
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData>({
    totalSessions: 0,
    totalMinutes: 0,
    totalBreaths: 0,
    currentStreak: 0,
    longestStreak: 0
  })
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deviceId = getDeviceId()
        
        // Fetch progress
        const progressRes = await fetch(`/api/progress?deviceId=${deviceId}`)
        if (progressRes?.ok) {
          const data = await progressRes.json()
          setProgress(data)
        }

        // Fetch sessions
        const sessionsRes = await fetch(`/api/sessions?deviceId=${deviceId}`)
        if (sessionsRes?.ok) {
          const data = await sessionsRes.json()
          setSessions(data?.sessions ?? [])
        }
      } catch (error) {
        console.error('Failed to fetch progress:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading progress...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📊 Progress Dashboard</h1>
          <p className="text-lg text-gray-600">Track your breathing journey and celebrate your consistency.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Sessions</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{progress?.totalSessions ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Completed sessions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Minutes</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{progress?.totalMinutes ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Time practiced</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Current Streak</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{progress?.currentStreak ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Days in a row</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Longest Streak</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{progress?.longestStreak ?? 0}</p>
            <p className="text-sm text-gray-500 mt-1">Best streak</p>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Sessions</h2>
          {sessions?.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No sessions logged yet.</p>
              <Button asChild>
                <Link href="/">Start Your First Session</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions?.slice(0, 10)?.map((session) => (
                <div
                  key={session?.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{session?.label ?? 'Session'}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(session?.completedAt ?? '').toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{session?.minutes ?? 0} min</p>
                      <p className="text-gray-500">Duration</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{session?.breaths ?? 0}</p>
                      <p className="text-gray-500">Breaths</p>
                    </div>
                    {session?.category && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {session.category}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
            <Link href="/">Continue Practice</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/rewards">View Rewards & Badges</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
