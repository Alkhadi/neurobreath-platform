import { NextResponse } from 'next/server'

import {
  prisma,
  getDatabaseUrl,
  getDatabaseUrlSource,
  isDbDown,
  getDbDownReason,
} from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

async function checkAuthTables(): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    // These queries will fail fast if the auth tables/migrations are missing.
    await prisma.authUser.findFirst({ select: { id: true } })
    await prisma.authSession.findFirst({ select: { sessionToken: true } })
    await prisma.account.findFirst({ select: { id: true } })
    await prisma.verificationToken.findFirst({ select: { identifier: true } })
    return { ok: true }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return { ok: false, error: msg }
  }
}

export async function GET() {
  const dbUrl = getDatabaseUrl()
  const urlSource = getDatabaseUrlSource()

  if (!dbUrl) {
    return NextResponse.json(
      {
        ok: false,
        timestamp: new Date().toISOString(),
        auth: {
          dbOk: false,
          tablesOk: false,
          reason: 'Missing DATABASE_URL (or supported Postgres env vars)',
          urlSource,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        },
      },
      { status: 500, headers: { 'cache-control': 'no-store, max-age=0' } }
    )
  }

  if (isDbDown()) {
    return NextResponse.json(
      {
        ok: false,
        timestamp: new Date().toISOString(),
        auth: {
          dbOk: false,
          tablesOk: false,
          reason: getDbDownReason() ?? 'DB marked down',
          urlSource,
          hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        },
      },
      { status: 503, headers: { 'cache-control': 'no-store, max-age=0' } }
    )
  }

  const tables = await checkAuthTables()

  const body = {
    ok: tables.ok,
    timestamp: new Date().toISOString(),
    auth: {
      dbOk: true,
      tablesOk: tables.ok,
      ...(tables.ok ? {} : { error: 'Auth database tables are not ready yet.' }),
      urlSource,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    },
  }

  return NextResponse.json(body, {
    status: tables.ok ? 200 : 503,
    headers: { 'cache-control': 'no-store, max-age=0' },
  })
}
