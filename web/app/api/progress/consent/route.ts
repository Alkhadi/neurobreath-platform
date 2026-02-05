import { z } from 'zod'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

import { prisma, isDbDown, markDbDown } from '@/lib/db'
import {
  setProgressConsentCookie,
} from '../_progressCookies'
import { getAuthedUserId } from '@/lib/auth/require-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const BodySchema = z.object({
  enabled: z.boolean(),
})

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
