import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { z } from 'zod'

import { prisma } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CreateSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(1, 'Display name is required')
    .max(80, 'Display name is too long'),
})

type SubjectsPrismaClient = {
  subjectAccess: {
    findMany: (args: unknown) => Promise<
      Array<{
        role: string
        canWrite: boolean
        subject: { id: string; kind: string; displayName: string; archivedAt: Date | null }
      }>
    >
    create: (args: unknown) => Promise<unknown>
  }
  subjectProfile: {
    create: (args: unknown) => Promise<{ id: string; kind: string; displayName: string }>
  }
}

const subjectsPrisma = prisma as unknown as SubjectsPrismaClient

type SubjectListItem = {
  id: string
  kind: string
  displayName: string
  role?: string
  canWrite?: boolean
}

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

export async function GET(request: NextRequest) {
  const me: SubjectListItem = { id: 'me', kind: 'self', displayName: 'Me', role: 'OWNER', canWrite: true }

  const userId = await getOptionalUserId(request)
  if (!userId) {
    return NextResponse.json({ ok: true, subjects: [me] })
  }

  try {
    const rows = await subjectsPrisma.subjectAccess.findMany({
      where: {
        userId,
        subject: { archivedAt: null },
      },
      orderBy: [{ createdAt: 'desc' }],
      select: {
        role: true,
        canWrite: true,
        subject: {
          select: {
            id: true,
            kind: true,
            displayName: true,
            archivedAt: true,
          },
        },
      },
    })

    const subjects: SubjectListItem[] = [
      me,
      ...rows.map((r) => ({
        id: r.subject.id,
        kind: r.subject.kind,
        displayName: r.subject.displayName,
        role: r.role,
        canWrite: r.canWrite,
      })),
    ]

    return NextResponse.json({ ok: true, subjects })
  } catch (error) {
    console.error('[Subjects] Failed to list subjects:', error)
    return jsonError(500, 'SERVER_ERROR', 'Failed to load subjects')
  }
}

export async function POST(request: NextRequest) {
  const userId = await getOptionalUserId(request)
  if (!userId) return jsonError(401, 'UNAUTHENTICATED', 'Not authenticated')

  const body: unknown = await request.json().catch(() => null)
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(400, 'BAD_REQUEST', parsed.error.issues[0]?.message || 'Invalid request')
  }

  try {
    const created = await subjectsPrisma.subjectProfile.create({
      data: {
        kind: 'learner',
        displayName: parsed.data.displayName,
        createdByUserId: userId,
      },
      select: { id: true, kind: true, displayName: true },
    })

    await subjectsPrisma.subjectAccess.create({
      data: {
        subjectId: created.id,
        user: { connect: { id: userId } },
        role: 'OWNER',
        canWrite: true,
      },
    })

    return NextResponse.json({
      ok: true,
      subject: { id: created.id, kind: created.kind, displayName: created.displayName, role: 'OWNER', canWrite: true },
    })
  } catch (error) {
    console.error('[Subjects] Failed to create subject:', error)
    return jsonError(500, 'SERVER_ERROR', 'Failed to create learner')
  }
}
