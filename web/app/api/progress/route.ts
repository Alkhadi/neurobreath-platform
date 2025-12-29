import { NextRequest, NextResponse } from 'next/server'
import { getDbDownReason, isDbDown, markDbDown, prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      totalSessions: 0,
      totalMinutes: 0,
      totalBreaths: 0,
      currentStreak: 0,
      longestStreak: 0,
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    })
  }

  try {
    const deviceId = request?.nextUrl?.searchParams?.get('deviceId')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
    }

    const progress = await prisma.progress.findUnique({
      where: { deviceId }
    })

    if (!progress) {
      return NextResponse.json({
        totalSessions: 0,
        totalMinutes: 0,
        totalBreaths: 0,
        currentStreak: 0,
        longestStreak: 0
      })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error('Failed to fetch progress:', error)
    markDbDown(error)
    if (isDbDown()) {
      return NextResponse.json({
        totalSessions: 0,
        totalMinutes: 0,
        totalBreaths: 0,
        currentStreak: 0,
        longestStreak: 0,
        dbUnavailable: true,
        dbUnavailableReason: getDbDownReason()
      })
    }
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
