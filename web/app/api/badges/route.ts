import { NextRequest, NextResponse } from 'next/server'
import { getDbDownReason, isDbDown, markDbDown, prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      badges: [],
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    })
  }

  try {
    const deviceId = request?.nextUrl?.searchParams?.get('deviceId')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
    }

    const badges = await prisma.badge.findMany({
      where: { deviceId },
      orderBy: { unlockedAt: 'desc' }
    })

    return NextResponse.json({ badges: badges ?? [] })
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err))
    console.error('Failed to fetch badges:', error.message)
    markDbDown(error)
    if (isDbDown()) {
      return NextResponse.json({
        badges: [],
        dbUnavailable: true,
        dbUnavailableReason: getDbDownReason()
      })
    }
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}
