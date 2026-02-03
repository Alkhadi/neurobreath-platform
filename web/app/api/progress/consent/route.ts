import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { prisma, isDbDown, markDbDown } from '@/lib/db'
import {
  NB_DEVICE_ID_COOKIE,
  getDeviceIdFromRequest,
  setProgressConsentCookie,
} from '../_progressCookies'
import { getAuthedUserId } from '@/lib/auth/require-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BodySchema = z.object({
  enabled: z.boolean(),
})

function generateUuid(): string {
  const anyCrypto = globalThis.crypto as { randomUUID?: () => string } | undefined
  if (anyCrypto?.randomUUID) return anyCrypto.randomUUID()
  return `nb_${Date.now()}_${Math.random().toString(36).slice(2)}`
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null)
  const parsed = BodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: 'Invalid request' }, { status: 400 })
  }

  const res = NextResponse.json({ ok: true })

  // Always set the server-side consent cookie (used by /api/progress for guest backups).
  setProgressConsentCookie(res, parsed.data.enabled ? '1' : '0')

  const auth = await getAuthedUserId(request)

  // Device ID cookie rules: create only for guests (never for authenticated users).
  if (parsed.data.enabled) {
    if (!auth.ok) {
      const deviceId = getDeviceIdFromRequest(request)
      if (!deviceId) {
        res.cookies.set({
          name: NB_DEVICE_ID_COOKIE,
          value: generateUuid(),
          path: '/',
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 365,
        })
      }
    }
  } else {
    // If disabling, clear the device cookie too.
    res.cookies.set({
      name: NB_DEVICE_ID_COOKIE,
      value: '',
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 0,
    })
  }

  if (isDbDown()) return res

  if (!auth.ok) return res

  try {
    await prisma.authUser.update({
      where: { id: auth.userId },
      data: { progressConsentAt: parsed.data.enabled ? new Date() : null } as Prisma.AuthUserUpdateInput,
    })
  } catch (error) {
    markDbDown(error)
    // Do not block consent cookie if DB write fails.
  }

  return res
}
