import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const body = {
    ok: true,
    service: 'neurobreath-web',
    timestamp: new Date().toISOString(),
    gitSha:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GIT_SHA ||
      process.env.COMMIT_SHA ||
      null,
  }

  return NextResponse.json(body, {
    status: 200,
    headers: {
      'cache-control': 'no-store, max-age=0',
    },
  })
}
