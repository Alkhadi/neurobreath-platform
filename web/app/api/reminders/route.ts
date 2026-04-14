/**
 * POST /api/reminders — save/update reminder settings.
 * GET  /api/reminders — read current reminder settings.
 *
 * Also supports an optional external webhook (e.g. Zapier) that can
 * be triggered when reminders are enabled, allowing integration with
 * Proton Mail or any email provider.
 */

import { NextRequest, NextResponse } from 'next/server'
import { getAdminFirestore } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

async function verifyToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization') || ''
  const idToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''
  if (!idToken) return null

  try {
    const admin = await import('firebase-admin')
    const decoded = await admin.default.auth().verifyIdToken(idToken)
    return decoded.uid
  } catch {
    return null
  }
}

// ── GET ────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) return jsonError(401, 'UNAUTHORIZED', 'Invalid or missing token.')

  const db = getAdminFirestore()
  if (!db) return jsonError(500, 'DB_UNAVAILABLE', 'Firestore not configured.')

  const snap = await db.doc(`users/${uid}/settings/reminders`).get()
  if (!snap.exists) {
    return NextResponse.json({ ok: true, data: null })
  }
  return NextResponse.json({ ok: true, data: snap.data() })
}

// ── POST ───────────────────────────────────────────────────────────────────────

interface ReminderBody {
  enabled: boolean
  channels?: ('push' | 'email')[]
  preferredTime?: string
  timezone?: string
  activeDays?: number[]
  email?: string
}

export async function POST(req: NextRequest) {
  const uid = await verifyToken(req)
  if (!uid) return jsonError(401, 'UNAUTHORIZED', 'Invalid or missing token.')

  const db = getAdminFirestore()
  if (!db) return jsonError(500, 'DB_UNAVAILABLE', 'Firestore not configured.')

  let body: ReminderBody
  try {
    body = await req.json()
  } catch {
    return jsonError(400, 'BAD_JSON', 'Invalid JSON body.')
  }

  if (typeof body.enabled !== 'boolean') {
    return jsonError(400, 'INVALID_BODY', '"enabled" must be a boolean.')
  }

  // Validate preferredTime format (HH:MM).
  if (body.preferredTime && !/^\d{2}:\d{2}$/.test(body.preferredTime)) {
    return jsonError(400, 'INVALID_TIME', '"preferredTime" must be HH:MM.')
  }

  // Validate activeDays (0-6).
  if (body.activeDays) {
    if (
      !Array.isArray(body.activeDays) ||
      body.activeDays.some((d) => typeof d !== 'number' || d < 0 || d > 6)
    ) {
      return jsonError(400, 'INVALID_DAYS', '"activeDays" must be numbers 0-6.')
    }
  }

  const data = {
    enabled: body.enabled,
    channels: body.channels ?? [],
    preferredTime: body.preferredTime ?? '09:00',
    timezone:
      body.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? 'Europe/London',
    activeDays: body.activeDays ?? [1, 2, 3, 4, 5],
    ...(body.email ? { email: body.email } : {}),
    updatedAt: new Date().toISOString(),
  }

  await db.doc(`users/${uid}/settings/reminders`).set(data, { merge: true })

  // Optional: Fire Zapier webhook when reminders are enabled.
  if (body.enabled) {
    const webhookUrl = process.env.REMINDER_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid, ...data }),
        })
      } catch {
        // Non-blocking — don't fail the request if the webhook is down.
      }
    }
  }

  return NextResponse.json({ ok: true })
}
