import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { Prisma } from '@prisma/client'

import { prisma } from '@/lib/db'

type ProgressPrismaClient = {
  progressEvent: {
    create: (args: unknown) => Promise<unknown>
  }
  userDevice: {
    upsert: (args: unknown) => Promise<unknown>
  }
}

type SubjectAccessPrismaClient = {
  subjectAccess: {
    findFirst: (args: unknown) => Promise<{ id: string } | null>
  }
}

const progressPrisma = prisma as unknown as ProgressPrismaClient
const subjectAccessPrisma = prisma as unknown as SubjectAccessPrismaClient

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEVICE_ID_COOKIE = 'nb_device_id'
const DEVICE_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 400

const ALLOWED_TYPES = [
  'breathing_completed',
  'lesson_completed',
  'meditation_completed',
  'quiz_completed',
  'focus_garden_completed',
] as const

type AllowedType = (typeof ALLOWED_TYPES)[number]

function jsonError(status: number, code: string, message: string) {
  return NextResponse.json({ ok: false, code, message }, { status })
}

function generateUuid(): string {
  const anyCrypto = globalThis.crypto as { randomUUID?: () => string } | undefined
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()
  return `nb_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

async function getOptionalUserId(req: NextRequest): Promise<string | null> {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return null

  const token = await getToken({ req, secret }).catch(() => null)
  const userId = (token as { uid?: string } | null)?.uid || token?.sub
  return userId || null
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function pickDeviceId(request: NextRequest): { deviceId: string; wasSet: boolean } {
  const existing = request.cookies.get(DEVICE_ID_COOKIE)?.value
  if (existing) return { deviceId: existing, wasSet: false }
  return { deviceId: generateUuid(), wasSet: true }
}

function assertNoUnknownTopLevelKeys(body: Record<string, unknown>) {
  const allowed = new Set(['type', 'metadata', 'path', 'subjectId'])
  for (const key of Object.keys(body)) {
    if (!allowed.has(key)) throw new Error('UNKNOWN_KEY')
  }
}

function validateMetadata(
  type: AllowedType,
  metadata: unknown,
): Record<string, string | number | boolean | null> {
  if (metadata === undefined) return {}
  if (!isPlainObject(metadata)) throw new Error('BAD_METADATA')

  const allowedByType: Record<AllowedType, Set<string>> = {
    breathing_completed: new Set(['techniqueId', 'durationSeconds', 'rating', 'category']),
    lesson_completed: new Set(['lessonId', 'durationSeconds', 'minutes']),
    meditation_completed: new Set(['durationSeconds', 'minutes']),
    quiz_completed: new Set(['quizId', 'score', 'maxScore', 'topic']),
    focus_garden_completed: new Set(['plantId', 'taskId', 'category', 'xpEarned', 'bloomed', 'action']),
  }

  const allowedKeys = allowedByType[type]
  const out: Record<string, string | number | boolean | null> = {}

  for (const [key, value] of Object.entries(metadata)) {
    if (!allowedKeys.has(key)) throw new Error('UNKNOWN_METADATA_KEY')

    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean'
    ) {
      out[key] = value
      continue
    }

    throw new Error('BAD_METADATA_VALUE')
  }

  return out
}

async function normalizeSubjectIdForWrite(
  request: NextRequest,
  requestedSubjectId: unknown,
): Promise<{ subjectId: string | null; subject: { id: 'me' | string } } | { error: NextResponse }> {
  const userId = await getOptionalUserId(request)

  // Guests: force subjectId = null regardless of input
  if (!userId) {
    return { subjectId: null, subject: { id: 'me' } }
  }

  if (requestedSubjectId === undefined || requestedSubjectId === null || requestedSubjectId === '' || requestedSubjectId === 'me') {
    return { subjectId: null, subject: { id: 'me' } }
  }

  if (typeof requestedSubjectId !== 'string' || requestedSubjectId.length > 200) {
    return { error: jsonError(400, 'BAD_SUBJECT', 'Invalid subject') }
  }

  if (!isUuid(requestedSubjectId)) {
    return { error: jsonError(400, 'BAD_SUBJECT', 'Invalid subject') }
  }

  const access = await subjectAccessPrisma.subjectAccess.findFirst({
    where: {
      userId,
      subjectId: requestedSubjectId,
      canWrite: true,
      subject: { archivedAt: null },
    },
    select: { id: true },
  })

  if (!access) {
    return { error: jsonError(403, 'FORBIDDEN', 'Not authorized for subject') }
  }

  return { subjectId: requestedSubjectId, subject: { id: requestedSubjectId } }
}

export async function POST(request: NextRequest) {
  const contentLength = request.headers.get('content-length')
  if (contentLength && Number(contentLength) > 8_192) {
    return jsonError(413, 'PAYLOAD_TOO_LARGE', 'Payload too large')
  }

  const rawBody: unknown = await request.json().catch(() => null)
  if (!isPlainObject(rawBody)) return jsonError(400, 'BAD_REQUEST', 'Invalid JSON body')

  try {
    assertNoUnknownTopLevelKeys(rawBody)

    const type = rawBody.type
    if (typeof type !== 'string' || !ALLOWED_TYPES.includes(type as AllowedType)) {
      return jsonError(400, 'BAD_TYPE', 'Unknown event type')
    }

    const path = rawBody.path
    if (path !== undefined && (typeof path !== 'string' || path.length > 300)) {
      return jsonError(400, 'BAD_PATH', 'Invalid path')
    }

    const subjectResult = await normalizeSubjectIdForWrite(request, rawBody.subjectId)
    if ('error' in subjectResult) return subjectResult.error
    const { subjectId } = subjectResult

    const metadata: Prisma.InputJsonValue = validateMetadata(
      type as AllowedType,
      rawBody.metadata,
    ) as Prisma.InputJsonValue

    if (rawBody.metadata !== undefined) {
      const bytes = Buffer.byteLength(JSON.stringify(metadata ?? {}), 'utf8')
      if (bytes > 8_192) {
        return jsonError(413, 'PAYLOAD_TOO_LARGE', 'Metadata too large')
      }
    }

    const { deviceId, wasSet } = pickDeviceId(request)
    const userId = await getOptionalUserId(request)

    await progressPrisma.progressEvent.create({
      data: {
        type,
        deviceId,
        ...(userId ? { user: { connect: { id: userId } } } : {}),
        subjectId,
        path: typeof path === 'string' ? path : null,
        metadata,
      },
    })

    if (userId) {
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

    const res = NextResponse.json({ ok: true })
    if (wasSet) {
      res.cookies.set({
        name: DEVICE_ID_COOKIE,
        value: deviceId,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: DEVICE_ID_MAX_AGE_SECONDS,
      })
    }

    return res
  } catch (error) {
    const code = (error as Error | null)?.message
    if (code === 'UNKNOWN_KEY') return jsonError(400, 'BAD_REQUEST', 'Unknown top-level key')
    if (code === 'BAD_METADATA') return jsonError(400, 'BAD_REQUEST', 'Invalid metadata')
    if (code === 'UNKNOWN_METADATA_KEY') return jsonError(400, 'BAD_REQUEST', 'Unknown metadata key')
    if (code === 'BAD_METADATA_VALUE') return jsonError(400, 'BAD_REQUEST', 'Invalid metadata value')

    console.error('[Progress Events] Failed to record event:', error)
    return jsonError(500, 'SERVER_ERROR', 'Failed to record event')
  }
}
