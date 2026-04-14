'use client'

/**
 * IntakePlanFlow — lightweight intake that asks 2-3 questions,
 * calls /api/ai-plan, saves the first habit, and connects it to
 * the user profile / dashboard.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/FirebaseAuthContext'
import { getFirebaseAuth } from '@/lib/firebase'

// ── Condition options ──────────────────────────────────────────────────────────

const CONDITIONS = [
  { id: 'adhd', label: 'ADHD', emoji: '⚡' },
  { id: 'autism', label: 'Autism', emoji: '🧩' },
  { id: 'dyslexia', label: 'Dyslexia', emoji: '📖' },
  { id: 'anxiety', label: 'Anxiety', emoji: '🦋' },
  { id: 'focus', label: 'Focus & attention', emoji: '🎯' },
  { id: 'sleep', label: 'Sleep', emoji: '🌙' },
  { id: 'stress', label: 'Stress', emoji: '🌊' },
  { id: 'dyspraxia', label: 'Dyspraxia', emoji: '🤸' },
  { id: 'tourettes', label: "Tourette's", emoji: '💪' },
  { id: 'wellbeing', label: 'General wellbeing', emoji: '🌿' },
] as const

interface GeneratedHabit {
  id: string
  title: string
  description: string
  cue: string
  durationMin: number
}

// ── Component ──────────────────────────────────────────────────────────────────

export function IntakePlanFlow({ onComplete }: { onComplete?: () => void }) {
  const { uid, signInAsGuest } = useAuth()
  const [step, setStep] = useState<'select' | 'generating' | 'result'>('select')
  const [selected, setSelected] = useState<string[]>([])
  const [habit, setHabit] = useState<GeneratedHabit | null>(null)
  const [error, setError] = useState<string | null>(null)

  const toggleCondition = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id].slice(0, 3),
    )
  }

  const generatePlan = async () => {
    setStep('generating')
    setError(null)

    // Ensure anon auth
    let currentUid = uid
    if (!currentUid) {
      await signInAsGuest()
      // After signing in, get uid from auth
      const auth = getFirebaseAuth()
      currentUid = auth?.currentUser?.uid ?? null
    }

    const idToken = await getFirebaseAuth()?.currentUser?.getIdToken()

    try {
      const res = await fetch('/api/ai-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conditionTags: selected.length > 0 ? selected : ['wellbeing'],
          uid: currentUid,
          idToken,
        }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.message ?? 'Failed to generate plan')
      setHabit(json.habit)
      setStep('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('select')
    }
  }

  // ── Select conditions ──
  if (step === 'select') {
    return (
      <div className="rounded-2xl bg-white shadow-lg border border-violet-100 p-6 md:p-8 max-w-lg mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-violet-500" />
          <h2 className="text-xl font-bold text-gray-900">Your first habit</h2>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Select up to 3 areas that matter most to you. We&apos;ll create a short, practical daily
          habit just for you.
        </p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {CONDITIONS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => toggleCondition(c.id)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors text-left ${
                selected.includes(c.id)
                  ? 'border-violet-300 bg-violet-50 text-violet-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <Button
          onClick={generatePlan}
          disabled={selected.length === 0}
          className="w-full gap-2"
        >
          Create my habit <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  // ── Generating ──
  if (step === 'generating') {
    return (
      <div className="rounded-2xl bg-white shadow-lg border border-violet-100 p-8 max-w-lg mx-auto text-center">
        <Loader2 className="h-8 w-8 text-violet-500 animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-800">Creating your personalised habit&hellip;</p>
        <p className="text-sm text-gray-500 mt-1">This takes just a moment</p>
      </div>
    )
  }

  // ── Result ──
  return (
    <div className="rounded-2xl bg-white shadow-lg border border-emerald-100 p-6 md:p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <h2 className="text-xl font-bold text-gray-900">Your habit is ready</h2>
      </div>

      {habit && (
        <div className="space-y-4">
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{habit.title}</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{habit.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              ⏱️ {habit.durationMin} min
            </span>
            <span className="flex items-center gap-1">
              🔔 {habit.cue}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            This habit has been saved to your dashboard. You can track it from{' '}
            <Link href="/progress" className="text-violet-600 underline hover:text-violet-700">
              Progress
            </Link>{' '}
            or{' '}
            <Link href="/my-plan" className="text-violet-600 underline hover:text-violet-700">
              My Plan
            </Link>
            .
          </p>

          <Button onClick={onComplete} className="w-full gap-2" variant="outline">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
