import { NextRequest, NextResponse } from 'next/server'
import { getDbDownReason, isDbDown, markDbDown, prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      completedQuests: 0,
      totalPoints: 0,
      quests: [],
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    })
  }

  try {
    const deviceId = request?.nextUrl?.searchParams?.get('deviceId')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const quests = await prisma.dailyQuest.findMany({
      where: {
        deviceId,
        questDate: today
      }
    })

    const completedQuests = quests?.filter(q => q?.isCompleted)?.length ?? 0
    const totalPoints = quests?.reduce((sum, q) => sum + (q?.points ?? 0), 0) ?? 0

    return NextResponse.json({
      completedQuests,
      totalPoints,
      quests: quests ?? []
    })
  } catch (error) {
    console.error('Failed to fetch today\'s quests:', error)
    markDbDown(error)
    if (isDbDown()) {
      return NextResponse.json({
        completedQuests: 0,
        totalPoints: 0,
        quests: [],
        dbUnavailable: true,
        dbUnavailableReason: getDbDownReason()
      })
    }
    return NextResponse.json({ error: 'Failed to fetch quests' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json(
      { error: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { deviceId, category, minutes, technique } = body

    if (!deviceId || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    const quest = await prisma.dailyQuest.upsert({
      where: {
        deviceId_questDate_category: {
          deviceId,
          questDate: today,
          category
        }
      },
      create: {
        deviceId,
        questDate: today,
        category,
        minutes: Number(minutes) || 0,
        technique: technique || 'box-4444',
        isCompleted: true,
        completedAt: new Date(),
        points: 30
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
        points: { increment: 30 }
      }
    })

    return NextResponse.json({ success: true, quest })
  } catch (error) {
    console.error('Failed to complete quest:', error)
    markDbDown(error)
    if (isDbDown()) {
      return NextResponse.json(
        { error: 'Database unavailable', dbUnavailable: true, dbUnavailableReason: getDbDownReason() },
        { status: 503 }
      )
    }
    return NextResponse.json({ error: 'Failed to complete quest' }, { status: 500 })
  }
}
