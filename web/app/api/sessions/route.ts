import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, technique, label, minutes, breaths, rounds, category } = body

    if (!deviceId || !technique || !label || minutes === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        deviceId,
        technique,
        label,
        minutes: Number(minutes) || 0,
        breaths: Number(breaths) || 0,
        rounds: Number(rounds) || 0,
        category: category || null
      }
    })

    // Update progress
    const today = new Date().toISOString().split('T')[0]
    const progress = await prisma.progress.upsert({
      where: { deviceId },
      create: {
        deviceId,
        totalSessions: 1,
        totalMinutes: Number(minutes) || 0,
        totalBreaths: Number(breaths) || 0,
        currentStreak: 1,
        longestStreak: 1,
        lastSessionDate: today
      },
      update: {
        totalSessions: { increment: 1 },
        totalMinutes: { increment: Number(minutes) || 0 },
        totalBreaths: { increment: Number(breaths) || 0 },
        lastSessionDate: today
      }
    })

    // Update streak
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const lastDate = progress?.lastSessionDate
    
    let newStreak = progress?.currentStreak ?? 1
    if (lastDate === yesterday) {
      newStreak = (progress?.currentStreak ?? 0) + 1
    } else if (lastDate !== today) {
      newStreak = 1
    }

    await prisma.progress.update({
      where: { deviceId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, progress?.longestStreak ?? 0)
      }
    })

    // Check for badge unlocks
    const updatedProgress = await prisma.progress.findUnique({ where: { deviceId } })
    const newBadges = await checkAndUnlockBadges(deviceId, updatedProgress)

    return NextResponse.json({ 
      success: true, 
      session, 
      progress: updatedProgress,
      newBadges 
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json({ error: 'Failed to log session' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const deviceId = request?.nextUrl?.searchParams?.get('deviceId')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
    }

    const sessions = await prisma.session.findMany({
      where: { deviceId },
      orderBy: { completedAt: 'desc' },
      take: 50
    })

    return NextResponse.json({ sessions: sessions ?? [] })
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}

async function checkAndUnlockBadges(deviceId: string, progress: any) {
  const badges = [
    { key: 'firstBreath', condition: (progress?.totalSessions ?? 0) >= 1 },
    { key: 'calmExplorer', condition: (progress?.totalSessions ?? 0) >= 10 },
    { key: 'steadyNavigator', condition: (progress?.totalSessions ?? 0) >= 30 },
    { key: 'centurion', condition: (progress?.totalSessions ?? 0) >= 100 },
    { key: 'focusedMind', condition: (progress?.totalMinutes ?? 0) >= 60 },
    { key: 'weekWarrior', condition: (progress?.currentStreak ?? 0) >= 7 },
    { key: 'monthMaster', condition: (progress?.currentStreak ?? 0) >= 30 }
  ]

  const newBadges = []
  
  for (const badge of badges) {
    if (badge?.condition) {
      const existing = await prisma.badge.findUnique({
        where: { deviceId_badgeKey: { deviceId, badgeKey: badge.key } }
      })
      
      if (!existing) {
        const badgeDef = getBadgeDefinition(badge.key)
        if (badgeDef) {
          const newBadge = await prisma.badge.create({
            data: {
              deviceId,
              badgeKey: badge.key,
              badgeName: badgeDef?.name ?? '',
              badgeIcon: badgeDef?.icon ?? ''
            }
          })
          newBadges.push(newBadge)
        }
      }
    }
  }

  return newBadges
}

function getBadgeDefinition(key: string) {
  const badges: Record<string, {name: string, icon: string}> = {
    firstBreath: { name: 'First Breath', icon: '🌬️' },
    calmExplorer: { name: 'Calm Explorer', icon: '🌊' },
    steadyNavigator: { name: 'Steady Navigator', icon: '⭐' },
    centurion: { name: 'Centurion', icon: '💯' },
    focusedMind: { name: 'Focused Mind', icon: '🧠' },
    weekWarrior: { name: 'Week Warrior', icon: '🔥' },
    monthMaster: { name: 'Month Master', icon: '🏆' },
    sleepGuardian: { name: 'Sleep Guardian', icon: '🌙' }
  }
  return badges[key]
}
