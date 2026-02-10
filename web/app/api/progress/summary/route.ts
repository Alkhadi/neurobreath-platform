import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

import { prisma } from '@/lib/db'

type ProgressPrismaClient = {
  userDevice: {
    upsert: (args: unknown) => Promise<unknown>
    findMany: (args: unknown) => Promise<Array<{ deviceId: string }>>
  }
  progressEvent: {
    findMany: (args: unknown) => Promise<
      Array<{ id: string; occurredAt: Date; type: string; path: string | null; metadata: unknown }>
    >
  }
}

const progressPrisma = prisma as unknown as ProgressPrismaClient

type SubjectAccessPrismaClient = {
  subjectAccess: {
    findFirst: (args: unknown) => Promise<{ subject: { displayName: string } } | null>
  }
}

const subjectAccessPrisma = prisma as unknown as SubjectAccessPrismaClient

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEVICE_ID_COOKIE = 'nb_device_id'

type RangeKey = '7d' | '30d' | '90d'
type SubjectPublicId = 'me' | string

const COMPLETION_TYPES = new Set([
  'breathing_completed',
  'lesson_completed',
  'meditation_completed',
  'quiz_completed',
  'focus_garden_completed',
])

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

function parseRange(value: string | null): RangeKey {
  if (value === '7d' || value === '30d' || value === '90d') return value
  return '30d'
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function addDaysUtc(date: Date, days: number): Date {
  const d = new Date(date)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

function formatUtcDateKey(date: Date): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function computeStreak(dayKeys: string[], todayKey: string): { current: number; best: number } {
  if (dayKeys.length === 0) return { current: 0, best: 0 }

  const set = new Set(dayKeys)

  // current streak from today backwards
  let current = 0
  for (let offset = 0; offset < 10_000; offset++) {
    const key = formatUtcDateKey(addDaysUtc(new Date(`${todayKey}T00:00:00Z`), -offset))
    if (!set.has(key)) break
    current++
  }

  // best streak scanning sorted day keys
  const sorted = [...set].sort()
  let best = 1
  let run = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(`${sorted[i - 1]}T00:00:00Z`)
    const cur = new Date(`${sorted[i]}T00:00:00Z`)
    const diffDays = Math.round((cur.getTime() - prev.getTime()) / (24 * 60 * 60 * 1000))
    if (diffDays === 1) {
      run++
    } else {
      run = 1
    }
    best = Math.max(best, run)
  }

  return { current, best }
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
    case 'meditation_completed':
      return 'Meditation completed'
    default:
      return type.replace(/_/g, ' ')
  }
}

function computeMinutesBreathing(metadata: unknown): number | null {
  const m = metadata as Record<string, unknown> | null
  const durationSeconds = typeof m?.durationSeconds === 'number' ? (m.durationSeconds as number) : null
  if (durationSeconds && Number.isFinite(durationSeconds) && durationSeconds > 0) {
    return Math.round(durationSeconds / 60)
  }
  const minutes = typeof m?.minutes === 'number' ? (m.minutes as number) : null
  if (minutes && Number.isFinite(minutes) && minutes > 0) return Math.round(minutes)
  return null
}

export async function GET(request: NextRequest) {
  const range = parseRange(request.nextUrl.searchParams.get('range'))
  const rawSubjectId = request.nextUrl.searchParams.get('subjectId')
  const deviceId = request.cookies.get(DEVICE_ID_COOKIE)?.value || null
  const userId = await getOptionalUserId(request)

  const identity = userId ? { kind: 'user' as const } : { kind: 'guest' as const }

  let requestedSubjectId: SubjectPublicId = 'me'
  if (!userId) {
    requestedSubjectId = 'me'
  } else {
    if (!rawSubjectId || rawSubjectId === 'me') {
      requestedSubjectId = 'me'
    } else if (isUuid(rawSubjectId)) {
      requestedSubjectId = rawSubjectId
    } else {
      return jsonError(400, 'BAD_SUBJECT', 'Invalid subject')
    }
  }

  // Guests: force subjectId = null ("Me")
  const publicSubjectId: SubjectPublicId = userId ? requestedSubjectId : 'me'
  const dbSubjectId: string | null = !userId
    ? null
    : publicSubjectId === 'me'
      ? null
      : publicSubjectId

  if (!deviceId && !userId) {
    return NextResponse.json({
      ok: true,
      identity,
      range,
      subject: { id: 'me', displayName: 'Me' },
      totals: {
        totalEvents: 0,
        breathingSessions: 0,
        minutesBreathing: 0,
        lessonsCompleted: 0,
        quizzesCompleted: 0,
        focusGardenCompletions: 0,
      },
      streak: { currentStreakDays: 0, bestStreakDays: 0 },
      dailySeries: [],
      recent: [],
      empty: true,
    })
  }

  const rangeDays = range === '7d' ? 7 : range === '90d' ? 90 : 30
  const todayUtc = startOfUtcDay(new Date())
  const startUtc = addDaysUtc(todayUtc, -(rangeDays - 1))

  try {
    let deviceIds: string[] = []

    let subjectDisplayName = 'Me'
    if (userId && publicSubjectId !== 'me') {
      const access = await subjectAccessPrisma.subjectAccess.findFirst({
        where: {
          userId,
          subjectId: publicSubjectId,
          subject: { archivedAt: null },
        },
        select: {
          subject: { select: { displayName: true } },
        },
      })

      if (!access) {
        return jsonError(403, 'FORBIDDEN', 'Not authorized for subject')
      }
      subjectDisplayName = access.subject.displayName
    }

    if (userId) {
      // ensure this device is linked for merge semantics
      if (deviceId) {
        await progressPrisma.userDevice.upsert({
          where: { deviceId },
          create: {
            deviceId,
            user: { connect: { id: userId } },
            firstSeenAt: new Date(),
            lastSeenAt: new Date(),
          },
          update: { user: { connect: { id: userId } }, lastSeenAt: new Date() },
        })
      }

      const linked = await progressPrisma.userDevice.findMany({
        where: { userId },
        select: { deviceId: true },
      })
      deviceIds = linked.map((d: { deviceId: string }) => d.deviceId)
    } else if (deviceId) {
      deviceIds = [deviceId]
    }

    if (deviceIds.length === 0 && !userId) {
      return jsonError(500, 'IDENTITY_ERROR', 'Missing identity')
    }

    const where = !userId
      ? {
          occurredAt: { gte: startUtc },
          deviceId: deviceIds[0],
          userId: null,
          subjectId: null,
        }
      : publicSubjectId === 'me'
        ? {
            occurredAt: { gte: startUtc },
            OR: [
              // "Me" events (new model)
              { userId, subjectId: null },

              // legacy "Me" events (old model: subjectId=userId)
              { userId, subjectId: userId },

              // merge guest events from linked devices (avoid leaking other users' signed-in events)
              { deviceId: { in: deviceIds }, userId: null, subjectId: null },
            ],
          }
        : {
            occurredAt: { gte: startUtc },
            userId,
            subjectId: dbSubjectId,
          }

    const events = await progressPrisma.progressEvent.findMany({
      where,
      orderBy: { occurredAt: 'desc' },
      take: 10_000,
      select: {
        id: true,
        occurredAt: true,
        type: true,
        path: true,
        metadata: true,
      },
    })

    const totals = {
      totalEvents: events.length,
      breathingSessions: 0,
      minutesBreathing: 0,
      lessonsCompleted: 0,
      quizzesCompleted: 0,
      focusGardenCompletions: 0,
    }

    const dayCounts = new Map<string, { count: number; minutesBreathing: number }>()
    const completionDays = new Set<string>()

    for (const e of events) {
      const dayKey = formatUtcDateKey(startOfUtcDay(e.occurredAt))
      const slot = dayCounts.get(dayKey) || { count: 0, minutesBreathing: 0 }
      slot.count += 1

      if (e.type === 'breathing_completed') {
        totals.breathingSessions += 1
        const minutes = computeMinutesBreathing(e.metadata)
        if (minutes) {
          totals.minutesBreathing += minutes
          slot.minutesBreathing += minutes
        }
      }

      if (e.type === 'lesson_completed') totals.lessonsCompleted += 1
      if (e.type === 'quiz_completed') totals.quizzesCompleted += 1
      if (e.type === 'focus_garden_completed') totals.focusGardenCompletions += 1

      if (COMPLETION_TYPES.has(e.type)) completionDays.add(dayKey)

      dayCounts.set(dayKey, slot)
    }

    const dailySeries = [] as Array<{ date: string; count: number; minutesBreathing?: number }>
    for (let i = 0; i < rangeDays; i++) {
      const date = addDaysUtc(startUtc, i)
      const key = formatUtcDateKey(date)
      const slot = dayCounts.get(key)
      dailySeries.push({
        date: key,
        count: slot?.count ?? 0,
        minutesBreathing: slot?.minutesBreathing ?? 0,
      })
    }

    const streak = computeStreak([...completionDays], formatUtcDateKey(todayUtc))

    const recent = events.slice(0, 20).map((e: (typeof events)[number]) => ({
      id: e.id,
      occurredAt: e.occurredAt.toISOString(),
      type: e.type,
      path: e.path,
      metadata: e.metadata,
    }))

    return NextResponse.json({
      ok: true,
      identity,
      range,
      subject: { id: publicSubjectId, displayName: subjectDisplayName },
      totals,
      streak: { currentStreakDays: streak.current, bestStreakDays: streak.best },
      dailySeries,
      recent: recent.map((e) => ({
        occurredAt: e.occurredAt,
        type: e.type,
        label: labelForEventType(e.type),
        minutes: e.type === 'breathing_completed' ? computeMinutesBreathing(e.metadata) ?? undefined : undefined,
        path: e.path,
      })),
      empty: events.length === 0,
    })
  } catch (error) {
    console.error('[Progress Summary] Failed:', error)
    return jsonError(500, 'SERVER_ERROR', 'Failed to load progress summary')
  }
}
