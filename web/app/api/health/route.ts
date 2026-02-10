import { NextResponse } from 'next/server'
import {
  prisma,
  getDatabaseUrl,
  getDatabaseUrlSource,
  isDbDown,
  getDbDownReason,
  markDbDown,
} from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

function safeDbHost(url: string | undefined): string | null {
  if (!url) return null
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

async function pingDatabase(timeoutMs: number): Promise<{ ok: true; latencyMs: number } | { ok: false; latencyMs: number; error: string }> {
  const startedAt = Date.now()
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB ping timeout')), timeoutMs)),
    ])
    return { ok: true, latencyMs: Date.now() - startedAt }
  } catch (error) {
    markDbDown(error)
    const msg = error instanceof Error ? error.message : String(error)
    return { ok: false, latencyMs: Date.now() - startedAt, error: msg }
  }
}

export async function GET() {
  const urlSource = getDatabaseUrlSource()
  const dbUrl = getDatabaseUrl()
  const dbHost = safeDbHost(dbUrl)
  const appOk = true

  if (isDbDown()) {
    const body = {
      ok: false,
      appOk,
      service: 'neurobreath-web',
      timestamp: new Date().toISOString(),
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || process.env.COMMIT_SHA || null,
      db: {
        ok: false,
        down: true,
        reason: getDbDownReason() ?? 'DB marked down',
        urlSource,
        host: dbHost,
      },
    }

    return NextResponse.json(body, {
      status: 503,
      headers: {
        'cache-control': 'no-store, max-age=0',
      },
    })
  }

  if (!dbUrl) {
    const body = {
      ok: false,
      appOk,
      service: 'neurobreath-web',
      timestamp: new Date().toISOString(),
      gitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || process.env.COMMIT_SHA || null,
      db: {
        ok: false,
        down: false,
        reason: 'Missing DATABASE_URL (or supported Postgres env vars)',
        urlSource,
        host: dbHost,
      },
    }

    return NextResponse.json(body, {
      status: 500,
      headers: {
        'cache-control': 'no-store, max-age=0',
      },
    })
  }

  const dbPing = await pingDatabase(2_000)

  const body = {
    ok: dbPing.ok,
    appOk,
    service: 'neurobreath-web',
    timestamp: new Date().toISOString(),
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_SHA || process.env.COMMIT_SHA || null,
    db: {
      ok: dbPing.ok,
      down: false,
      latencyMs: dbPing.latencyMs,
      ...(dbPing.ok ? {} : { error: dbPing.error }),
      urlSource,
      host: dbHost,
    },
  }

  return NextResponse.json(body, {
    status: dbPing.ok ? 200 : 503,
    headers: {
      'cache-control': 'no-store, max-age=0',
    },
  })
}
