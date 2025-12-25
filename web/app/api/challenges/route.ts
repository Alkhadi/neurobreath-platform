import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { challengeDefinitions } from '@/lib/challenge-definitions'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const deviceId = request?.nextUrl?.searchParams?.get('deviceId')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID required' }, { status: 400 })
    }

    // Get all challenges for this device
    let challenges = await prisma.challenge.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'asc' }
    })

    // If no challenges exist, create default ones
    if (!challenges || challenges.length === 0) {
      challenges = await Promise.all(
        challengeDefinitions.map(def =>
          prisma.challenge.create({
            data: {
              deviceId,
              challengeKey: def.key,
              challengeName: def.name,
              category: def.category,
              targetSessions: def.targetSessions,
              currentSessions: 0,
              isCompleted: false
            }
          })
        )
      )
    }

    return NextResponse.json({ challenges: challenges ?? [] })
  } catch (error) {
    console.error('Failed to fetch challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { deviceId, challengeKey, minutes, technique, category } = body

    if (!deviceId || !challengeKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const today = new Date().toISOString().split('T')[0]

    // Update challenge progress
    const challenge = await prisma.challenge.findUnique({
      where: { deviceId_challengeKey: { deviceId, challengeKey } }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    // Only count once per day
    if (challenge?.lastCompletedDate === today) {
      return NextResponse.json({ 
        success: true, 
        message: 'Already completed today',
        challenge 
      })
    }

    const newCurrentSessions = (challenge?.currentSessions ?? 0) + 1
    const isCompleted = newCurrentSessions >= (challenge?.targetSessions ?? 0)

    const updatedChallenge = await prisma.challenge.update({
      where: { deviceId_challengeKey: { deviceId, challengeKey } },
      data: {
        currentSessions: newCurrentSessions,
        isCompleted,
        lastCompletedDate: today
      }
    })

    return NextResponse.json({ success: true, challenge: updatedChallenge })
  } catch (error) {
    console.error('Failed to update challenge:', error)
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
  }
}
