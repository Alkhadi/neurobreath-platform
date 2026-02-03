import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { getDbDownReason, isDbDown, markDbDown, prisma } from '@/lib/db'
import {
  NB_DEVICE_ID_COOKIE,
  clearProgressCookies,
  getDeviceIdFromRequest,
  getProgressConsentFromRequest,
} from './_progressCookies'

export const dynamic = 'force-dynamic'

const ActivityTypeSchema = z.string().min(1).max(50)

const ProgressUpsertSchema = z.object({
  activityType: ActivityTypeSchema,
  activityId: z.string().min(1).max(200),
  completedAt: z.string().datetime().optional(),
  score: z.number().int().min(0).max(1_000_000).optional(),
  durationSeconds: z.number().int().min(0).max(1_000_000).optional(),
  data: z.unknown().optional(),
})

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

async function getOptionalUserId(req: NextRequest): Promise<string | null> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return null

  const token = await getToken({ req, secret }).catch(() => null)
  const userId = (token as { uid?: string } | null)?.uid || token?.sub
  return userId || null
}

function generateUuid(): string {
  const anyCrypto = globalThis.crypto as { randomUUID?: () => string } | undefined
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()
  return `nb_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export async function GET(request: NextRequest) {
  const deviceIdParam = request?.nextUrl?.searchParams?.get('deviceId')

  // If the DB is down, preserve legacy device-totals behaviour, but keep the
  // universal-progress contract stable (200 + empty progress + consent state).
  if (isDbDown()) {
    if (deviceIdParam) {
      return NextResponse.json({
        totalSessions: 0,
        totalMinutes: 0,
        totalBreaths: 0,
        currentStreak: 0,
        longestStreak: 0,
        dbUnavailable: true,
        dbUnavailableReason: getDbDownReason(),
      })
    }

    const userId = await getOptionalUserId(request)
    const consent = getProgressConsentFromRequest(request)

    return NextResponse.json({
      ok: true,
      identity: { kind: userId ? 'user' : 'guest' },
      consent: { granted: userId ? false : consent === '1', required: true, value: consent },
      byType: {},
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason(),
    })
  }

  try {
    // ---------------------------------------------------------------------
    // Back-compat: device totals for existing callers
    // ---------------------------------------------------------------------
    if (deviceIdParam) {
      const cookieDeviceId = getDeviceIdFromRequest(request)
      if (!cookieDeviceId || cookieDeviceId !== deviceIdParam) {
        return jsonError(403, 'FORBIDDEN', 'Device identifier mismatch')
      }
      const progress = await prisma.progress.findUnique({
        where: { deviceId: deviceIdParam }
      })

      if (!progress) {
        return NextResponse.json({
          totalSessions: 0,
          totalMinutes: 0,
          totalBreaths: 0,
          currentStreak: 0,
          longestStreak: 0
        })
      }

      return NextResponse.json(progress)
    }

    // ---------------------------------------------------------------------
    // Universal progress (user/device)
    // ---------------------------------------------------------------------
    const userId = await getOptionalUserId(request)
    const consent = getProgressConsentFromRequest(request)

    if (userId) {
      const user = await prisma.authUser.findUnique({
        where: { id: userId },
        select: { progressConsentAt: true },
      })

      const accountGranted = !!user?.progressConsentAt
      const consentGranted = accountGranted && consent === '1'
      if (!consentGranted) {
        return NextResponse.json({
          ok: true,
          identity: { kind: 'user' },
          consent: { granted: false, required: true, value: consent, accountGranted },
          byType: {},
        })
      }

      const rows = await prisma.universalProgressEvent.findMany({
        where: { userId },
        select: { activityType: true, activityId: true },
      })

      const byType: Record<string, string[]> = {}
      for (const row of rows) {
        if (!byType[row.activityType]) byType[row.activityType] = []
        byType[row.activityType]?.push(row.activityId)
      }

      return NextResponse.json({
        ok: true,
        identity: { kind: 'user' },
        consent: { granted: true, required: true, value: consent, accountGranted },
        byType,
      })
    }

    if (consent !== '1') {
      return NextResponse.json({
        ok: true,
        identity: { kind: 'guest' },
        consent: { granted: false, required: true, value: consent },
        byType: {},
      })
    }

    const deviceId = getDeviceIdFromRequest(request)
    if (!deviceId) {
      return NextResponse.json({
        ok: true,
        identity: { kind: 'guest' },
        consent: { granted: true, required: true, value: consent },
        byType: {},
      })
    }

    const rows = await prisma.universalProgressEvent.findMany({
      where: { deviceId },
      select: { activityType: true, activityId: true },
    })

    const byType: Record<string, string[]> = {}
    for (const row of rows) {
      if (!byType[row.activityType]) byType[row.activityType] = []
      byType[row.activityType]?.push(row.activityId)
    }

    return NextResponse.json({
      ok: true,
      identity: { kind: 'guest' },
      consent: { granted: true, required: true, value: consent },
      byType,
    })
  } catch (error) {
    // If universal progress tables are missing (e.g. local/dev without migrations),
    // keep a stable 200 response so the client can still manage consent + local state.
    const err = error as { code?: string } | null
    if (err?.code === 'P2021') {
      const userId = await getOptionalUserId(request)
      const consent = getProgressConsentFromRequest(request)

      return NextResponse.json({
        ok: true,
        identity: { kind: userId ? 'user' : 'guest' },
        consent: { granted: userId ? false : consent === '1', required: true, value: consent },
        byType: {},
        dbUnavailable: true,
        dbUnavailableReason: 'Missing database table',
      })
    }

    console.error('[Progress API] Failed to fetch progress:', error)

    markDbDown(error)

    // Legacy callers expect a stable 200 response with fallback totals.
    if (deviceIdParam) {
      return NextResponse.json({
        totalSessions: 0,
        totalMinutes: 0,
        totalBreaths: 0,
        currentStreak: 0,
        longestStreak: 0,
        dbUnavailable: true,
        dbUnavailableReason: getDbDownReason() || 'Database error',
        source: 'fallback'
      })
    }

    return NextResponse.json({
      ok: true,
      identity: { kind: 'guest' },
      consent: { granted: false, required: true, value: getProgressConsentFromRequest(request) },
      byType: {},
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason() || 'Database error',
    })
  }
}

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json(
      { ok: false, message: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    )
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = ProgressUpsertSchema.safeParse(body)
  if (!parsed.success) return jsonError(400, 'BAD_REQUEST', 'Invalid request')

  const userId = await getOptionalUserId(request)
  const consent = getProgressConsentFromRequest(request)

  // Logged-in path: require explicit consent marker.
  if (userId) {
    try {
      const user = await prisma.authUser.findUnique({
        where: { id: userId },
        select: { progressConsentAt: true },
      })

      if (!user?.progressConsentAt || consent !== '1') {
        return jsonError(403, 'CONSENT_REQUIRED', 'Progress saving is disabled until you consent.')
      }

      const completedAt = parsed.data.completedAt ? new Date(parsed.data.completedAt) : new Date()

      await prisma.universalProgressEvent.upsert({
        where: {
          userId_activityType_activityId: {
            userId,
            activityType: parsed.data.activityType,
            activityId: parsed.data.activityId,
          },
        },
        create: {
          userId,
          deviceId: null,
          activityType: parsed.data.activityType,
          activityId: parsed.data.activityId,
          completedAt,
          score: parsed.data.score ?? null,
          durationSeconds: parsed.data.durationSeconds ?? null,
          data: (parsed.data.data ?? null) as never,
        },
        update: {
          completedAt,
          score: parsed.data.score ?? null,
          durationSeconds: parsed.data.durationSeconds ?? null,
          data: (parsed.data.data ?? null) as never,
        },
      })

      return NextResponse.json({ ok: true })
    } catch (error) {
      markDbDown(error)
      return jsonError(500, 'SERVER_ERROR', 'Failed to save progress')
    }
  }

  // Guest path: require explicit progress consent cookie.
  if (consent !== '1') {
    return jsonError(403, 'CONSENT_REQUIRED', 'Progress saving is disabled until you consent.')
  }

  try {
    let deviceId = getDeviceIdFromRequest(request)
    const res = NextResponse.json({ ok: true })

    if (!deviceId) {
      deviceId = generateUuid()
      res.cookies.set({
        name: NB_DEVICE_ID_COOKIE,
        value: deviceId,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 365,
      })
    }

    const completedAt = parsed.data.completedAt ? new Date(parsed.data.completedAt) : new Date()

    await prisma.universalProgressEvent.upsert({
      where: {
        deviceId_activityType_activityId: {
          deviceId,
          activityType: parsed.data.activityType,
          activityId: parsed.data.activityId,
        },
      },
      create: {
        userId: null,
        deviceId,
        activityType: parsed.data.activityType,
        activityId: parsed.data.activityId,
        completedAt,
        score: parsed.data.score ?? null,
        durationSeconds: parsed.data.durationSeconds ?? null,
        data: (parsed.data.data ?? null) as never,
      },
      update: {
        completedAt,
        score: parsed.data.score ?? null,
        durationSeconds: parsed.data.durationSeconds ?? null,
        data: (parsed.data.data ?? null) as never,
      },
    })

    return res
  } catch (error) {
    markDbDown(error)
    return jsonError(500, 'SERVER_ERROR', 'Failed to save progress')
  }
}

export async function DELETE(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json(
      { ok: false, message: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    )
  }

  const body: unknown = await request.json().catch(() => null)
  const parsed = z.object({ withdrawConsent: z.boolean().optional() }).safeParse(body)
  const withdraw = parsed.success ? parsed.data.withdrawConsent === true : false

  const userId = await getOptionalUserId(request)

  try {
    const res = NextResponse.json({
      ok: true,
      clearLocalStorageKeys: withdraw ? ['nb_progress_v1'] : [],
    })

    if (userId) {
      await prisma.universalProgressEvent.deleteMany({ where: { userId } })
      if (withdraw) {
        await prisma.authUser.update({ where: { id: userId }, data: { progressConsentAt: null } }).catch(() => null)
        clearProgressCookies(res)
      }
      return res
    }

    const deviceId = getDeviceIdFromRequest(request)
    if (deviceId) {
      await prisma.universalProgressEvent.deleteMany({ where: { deviceId } })
    }

    if (withdraw) {
      clearProgressCookies(res)
    }

    return res
  } catch (error) {
    markDbDown(error)
    return jsonError(500, 'SERVER_ERROR', 'Failed to delete progress')
  }
}
