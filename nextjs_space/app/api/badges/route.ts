import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
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
  } catch (error) {
    console.error('Failed to fetch badges:', error)
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 })
  }
}
