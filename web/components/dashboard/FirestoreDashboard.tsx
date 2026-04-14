'use client'

/**
 * FirestoreDashboard — Firestore-backed progress summary cards.
 *
 * Reads from the central progress engine (users/{uid}/progress/current)
 * and displays: active habit, streak, XP/level, weekly gains,
 * recent sessions, condition tags, quick resume, and tier status.
 *
 * Designed to be injected into the existing /progress page.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Flame,
  Zap,
  Trophy,
  Clock,
  Calendar,
  Star,
  ArrowRight,
  Leaf,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import { useProgress } from '@/hooks/useProgress'
import { useUserProfile } from '@/hooks/useUserProfile'

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function xpBarPercent(totalXp: number, xpPerLevel: number): number {
  return Math.min(100, Math.round(((totalXp % xpPerLevel) / xpPerLevel) * 100))
}

// ── Component ──────────────────────────────────────────────────────────────────

export function FirestoreDashboard() {
  const { uid, status, signInAsGuest } = useAuth()
  const { progress, recentSessions, loading, level, xpToNext } = useProgress()
  const { profile } = useUserProfile()

  // Auto-create anon session on first visit
  const [autoSignInAttempted, setAutoSignInAttempted] = useState(false)
  useEffect(() => {
    if (status === 'guest' && !uid && !autoSignInAttempted) {
      setAutoSignInAttempted(true)
      signInAsGuest().catch(() => {})
    }
  }, [status, uid, autoSignInAttempted, signInAsGuest])

  // Don't render if Firebase isn't configured
  if (status === 'guest' && !uid && autoSignInAttempted) return null
  if (status === 'loading' || loading) {
    return (
      <div className="mb-8 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-white/60" />
          ))}
        </div>
      </div>
    )
  }
  if (!progress) return null

  const XP_PER_LEVEL = 500

  return (
    <div className="mb-8 space-y-6">
      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="rounded-xl bg-white shadow-sm border border-orange-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-gray-600">Streak</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress.currentStreak}</p>
          <p className="text-xs text-gray-500">
            Best: {progress.longestStreak} day{progress.longestStreak !== 1 ? 's' : ''}
          </p>
        </div>

        {/* XP & Level */}
        <div className="rounded-xl bg-white shadow-sm border border-violet-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-violet-500" />
            <span className="text-sm font-medium text-gray-600">Level {level}</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress.totalXp.toLocaleString()}</p>
          <div className="mt-1">
            <div className="h-1.5 rounded-full bg-violet-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${xpBarPercent(progress.totalXp, XP_PER_LEVEL)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{xpToNext} XP to next level</p>
          </div>
        </div>

        {/* Weekly */}
        <div className="rounded-xl bg-white shadow-sm border border-blue-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">This week</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress.weeklySessions}</p>
          <p className="text-xs text-gray-500">
            {progress.weeklyMinutes} min &middot; {progress.weeklyXp} XP
          </p>
        </div>

        {/* Sessions */}
        <div className="rounded-xl bg-white shadow-sm border border-emerald-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-medium text-gray-600">All-time</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{progress.totalSessions}</p>
          <p className="text-xs text-gray-500">{progress.totalMinutes} min total</p>
        </div>
      </div>

      {/* ── Active habit + condition tags + tier ── */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Active habit */}
        {profile?.activeHabitId && (
          <Link
            href="/my-plan"
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            <Leaf className="h-3.5 w-3.5" />
            Active habit
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}

        {/* Condition tags */}
        {profile?.conditionTags?.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-violet-50 text-violet-700 px-3 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}

        {/* Tier */}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            profile?.tier === 'premium'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {profile?.tier === 'premium' ? (
            <>
              <Star className="h-3 w-3" /> Premium
            </>
          ) : (
            'Free'
          )}
        </span>
      </div>

      {/* ── Recent sessions ── */}
      {recentSessions.length > 0 && (
        <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            Recent sessions
          </h3>
          <ul className="space-y-2">
            {recentSessions.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-800 truncate max-w-[60%]">{s.label}</span>
                <span className="flex items-center gap-3 text-gray-500 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 text-violet-600 font-medium">
                    <Sparkles className="h-3 w-3" />+{s.xpAwarded} XP
                  </span>
                  <span className="text-xs">{formatRelativeTime(s.occurredAt)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Quick resume cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/autism/focus-garden"
          className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">Focus Garden</span>
          </div>
          <p className="text-xs text-emerald-600">Continue growing your habits</p>
          <ArrowRight className="h-4 w-4 text-emerald-400 mt-2 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/breathing"
          className="rounded-xl bg-blue-50 border border-blue-100 p-4 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🌬️</span>
            <span className="text-sm font-semibold text-blue-800">Breathing</span>
          </div>
          <p className="text-xs text-blue-600">Pick up where you left off</p>
          <ArrowRight className="h-4 w-4 text-blue-400 mt-2 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/my-plan"
          className="rounded-xl bg-violet-50 border border-violet-100 p-4 hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">📋</span>
            <span className="text-sm font-semibold text-violet-800">My Plan</span>
          </div>
          <p className="text-xs text-violet-600">View your personalised plan</p>
          <ArrowRight className="h-4 w-4 text-violet-400 mt-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
