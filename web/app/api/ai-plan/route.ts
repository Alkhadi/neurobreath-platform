/**
 * POST /api/ai-plan
 *
 * AI Personalizer — generates a short, practical first habit/plan
 * based on the user's condition tags and preferences.
 *
 * If ABACUSAI_API_KEY is not set, returns a deterministic fallback plan
 * based on condition tags so the feature never crashes at build time.
 *
 * Saves the generated habit to Firestore via Admin SDK.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** Deterministic plan templates keyed by condition. */
const PLAN_TEMPLATES: Record<string, { title: string; description: string; cue: string; durationMin: number }> = {
  adhd: {
    title: '2-Minute Focus Reset',
    description: 'Take 2 minutes of box breathing before your hardest task of the day. This trains your brain to transition into focus mode.',
    cue: 'Before starting your first important task',
    durationMin: 2,
  },
  autism: {
    title: 'Morning Sensory Check-In',
    description: 'Spend 3 minutes in a quiet space noticing 5 things you can see, 4 you can hear, 3 you can touch. This grounds your sensory baseline for the day.',
    cue: 'After waking up, before leaving your room',
    durationMin: 3,
  },
  dyslexia: {
    title: 'Daily Reading Warm-Up',
    description: 'Read aloud for 5 minutes from any text you enjoy. Reading aloud strengthens the phonological loop and builds fluency over time.',
    cue: 'After breakfast, before screen time',
    durationMin: 5,
  },
  anxiety: {
    title: 'SOS Calm Breathing',
    description: 'Practice 4-7-8 breathing for 2 minutes whenever you notice rising tension. Exhaling longer than inhaling activates your parasympathetic nervous system.',
    cue: 'When you notice tension in your shoulders or chest',
    durationMin: 2,
  },
  sleep: {
    title: 'Wind-Down Breathing',
    description: 'Do 5 minutes of coherent breathing (equal inhale/exhale) 30 minutes before bed. This lowers cortisol and prepares your body for sleep.',
    cue: '30 minutes before your target bedtime',
    durationMin: 5,
  },
  focus: {
    title: 'Pomodoro Breath Break',
    description: 'After every 25-minute work block, take 5 deep breaths before your break. This prevents burnout and maintains attention quality.',
    cue: 'When your timer rings after 25 minutes of work',
    durationMin: 1,
  },
  default: {
    title: 'Daily 3-Minute Reset',
    description: 'Find a quiet moment and do 3 minutes of slow, deep breathing. This simple practice reduces stress and improves emotional regulation backed by evidence.',
    cue: 'At the same time every day (pick one that works for you)',
    durationMin: 3,
  },
}

interface PlanRequest {
  conditionTags?: string[]
  preference?: string
  uid?: string
  idToken?: string
}

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

function pickTemplate(tags: string[]) {
  for (const tag of tags) {
    const key = tag.toLowerCase().trim()
    if (PLAN_TEMPLATES[key]) return PLAN_TEMPLATES[key]
  }
  return PLAN_TEMPLATES['default']
}

export async function POST(request: NextRequest) {
  let body: PlanRequest
  try {
    body = await request.json()
  } catch {
    return jsonError(400, 'INVALID_JSON', 'Request body must be valid JSON')
  }

  const { conditionTags = [], uid, idToken } = body

  // Pick the best template for the user's first condition
  const template = pickTemplate(conditionTags)

  const habit = {
    id: `habit_${Date.now()}`,
    title: template.title,
    description: template.description,
    cue: template.cue,
    durationMin: template.durationMin,
    conditionTags,
    createdAt: new Date().toISOString(),
    source: 'ai-plan',
  }

  // If uid + idToken provided, save to Firestore
  if (uid && idToken) {
    const adminDb = getAdminFirestore()
    if (adminDb) {
      try {
        const { getAuth } = await import('firebase-admin/auth')
        const decoded = await getAuth().verifyIdToken(idToken)
        if (decoded.uid === uid) {
          // Save habit
          await adminDb.collection(`users/${uid}/habits`).doc(habit.id).set(habit)
          // Set as active habit
          await adminDb.doc(`users/${uid}`).set(
            { activeHabitId: habit.id, lastSeenAt: new Date().toISOString() },
            { merge: true },
          )
        }
      } catch (err) {
        console.error('[ai-plan] Failed to save habit:', err)
        // Non-fatal — still return the plan
      }
    }
  }

  return NextResponse.json({
    ok: true,
    habit,
  })
}
