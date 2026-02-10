import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { prisma, isDbDown, getDbDownReason, markDbDown } from '@/lib/db'
import { getAuthedUserId } from '@/lib/auth/require-auth'
import { getDeviceIdFromRequest, getProgressConsentFromRequest, NB_DEVICE_ID_COOKIE } from '../_progressCookies'

type DeviceRow = {
  activityType: string
  activityId: string
  completedAt: Date
  score: number | null
  durationSeconds: number | null
  data: unknown
}

type UniversalProgressTx = {
  universalProgressEvent: {
    findUnique: (args: unknown) => Promise<{ completedAt: Date } | null>
    create: (args: unknown) => Promise<unknown>
    update: (args: unknown) => Promise<unknown>
    deleteMany: (args: unknown) => Promise<unknown>
  }
}

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json(
      { ok: false, message: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    )
  }

  const auth = await getAuthedUserId(request)
  if (!auth.ok) {
    return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status })
  }

  const consent = getProgressConsentFromRequest(request)
  if (consent !== '1') {
    return NextResponse.json({ ok: true, merged: 0, clearedDevice: false })
  }

  const user = await prisma.authUser
    .findUnique({ where: { id: auth.userId }, select: { progressConsentAt: true } })
    .catch(() => null)
  if (!user?.progressConsentAt) {
    return NextResponse.json({ ok: true, merged: 0, clearedDevice: false })
  }

  const deviceId = getDeviceIdFromRequest(request)
  if (!deviceId) {
    return NextResponse.json({ ok: true, merged: 0, clearedDevice: false })
  }

  try {
    const deviceRows = await (
      prisma as unknown as { universalProgressEvent: { findMany: (args: unknown) => Promise<DeviceRow[]> } }
    ).universalProgressEvent.findMany({
      where: { deviceId, userId: null },
      select: {
        activityType: true,
        activityId: true,
        completedAt: true,
        score: true,
        durationSeconds: true,
        data: true,
      },
    })

    if (deviceRows.length === 0) {
      return NextResponse.json({ ok: true, merged: 0, clearedDevice: false })
    }

    let merged = 0

    await prisma.$transaction(async (tx) => {
      const txn = tx as unknown as UniversalProgressTx
      for (const row of deviceRows) {
        const existing = await txn.universalProgressEvent.findUnique({
          where: {
            userId_activityType_activityId: {
              userId: auth.userId,
              activityType: row.activityType,
              activityId: row.activityId,
            },
          },
          select: { completedAt: true },
        })

        if (!existing) {
          await txn.universalProgressEvent.create({
            data: {
              userId: auth.userId,
              deviceId: null,
              activityType: row.activityType,
              activityId: row.activityId,
              completedAt: row.completedAt,
              score: row.score,
              durationSeconds: row.durationSeconds,
              data: row.data as never,
            },
          })
          merged++
          continue
        }

        if (existing.completedAt < row.completedAt) {
          await txn.universalProgressEvent.update({
            where: {
              userId_activityType_activityId: {
                userId: auth.userId,
                activityType: row.activityType,
                activityId: row.activityId,
              },
            },
            data: {
              completedAt: row.completedAt,
              score: row.score,
              durationSeconds: row.durationSeconds,
              data: row.data as never,
            },
          })
        }
      }

      await txn.universalProgressEvent.deleteMany({ where: { deviceId, userId: null } })
    })

    const res = NextResponse.json({ ok: true, merged, clearedDevice: true })
    res.cookies.set({
      name: NB_DEVICE_ID_COOKIE,
      value: '',
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 0,
    })
    return res
  } catch (error) {
    markDbDown(error)
    return NextResponse.json({ ok: false, message: 'Failed to merge progress' }, { status: 500 })
  }
}
