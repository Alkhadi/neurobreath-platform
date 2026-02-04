import { NextResponse } from 'next/server'

import { prisma, getDatabaseUrl, isDbDown } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

async function checkAuthTables(): Promise<{ ok: true } | { ok: false }> {
  try {
    // These queries will fail fast if the auth tables/migrations are missing.
    await prisma.authUser.findFirst({ select: { id: true } })
    await prisma.authSession.findFirst({ select: { sessionToken: true } })
    await prisma.account.findFirst({ select: { id: true } })
    await prisma.verificationToken.findFirst({ select: { identifier: true } })
    return { ok: true }
  } catch (error) {
    void error
    return { ok: false }
  }
}

export async function GET() {
  const now = new Date().toISOString()
  const dbUrl = getDatabaseUrl()

  if (!dbUrl) {
    return NextResponse.json(
      { ok: false, db: 'fail', auth: 'unknown', reason: 'DB_URL_MISSING', time: now },
      { status: 500, headers: { 'cache-control': 'no-store, max-age=0' } }
    )
  }

  if (isDbDown()) {
    return NextResponse.json(
      { ok: false, db: 'fail', auth: 'unknown', reason: 'DB_DOWN', time: now },
      { status: 503, headers: { 'cache-control': 'no-store, max-age=0' } }
    )
  }

  const tables = await checkAuthTables()

  if (!tables.ok) {
    return NextResponse.json(
      { ok: false, db: 'ok', auth: 'fail', reason: 'AUTH_TABLES_NOT_READY', time: now },
      { status: 503, headers: { 'cache-control': 'no-store, max-age=0' } }
    )
  }

  return NextResponse.json(
    { ok: true, db: 'ok', auth: 'ok', time: now },
    { status: 200, headers: { 'cache-control': 'no-store, max-age=0' } }
  )
}
