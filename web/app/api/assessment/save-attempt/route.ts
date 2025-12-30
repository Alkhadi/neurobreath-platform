import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST /api/assessment/save-attempt
 * Saves a reading assessment attempt to the database
 * 
 * Body:
 * {
 *   deviceId: string
 *   assessmentType: 'orf' | 'wordList' | 'pseudoword' | 'comprehension' | 'quickAssessment'
 *   totalWords: number
 *   wordsCorrect: number
 *   errorsTotal: number
 *   accuracyPct: number
 *   wcpm?: number (Words Correct Per Minute)
 *   selfCorrections?: number
 *   comprehensionCorrect?: number
 *   comprehensionTotal?: number
 *   readingLevelBand?: string
 *   readingLevelPercentile?: number
 *   durationSeconds: number
 *   passageId?: string
 *   wordListId?: string
 *   pseudowordListId?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      deviceId,
      assessmentType,
      totalWords,
      wordsCorrect,
      errorsTotal,
      accuracyPct,
      wcpm,
      selfCorrections,
      comprehensionCorrect,
      comprehensionTotal,
      readingLevelBand,
      readingLevelPercentile,
      durationSeconds,
      passageId,
      wordListId,
      pseudowordListId,
    } = body

    if (!deviceId || !assessmentType) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, assessmentType' },
        { status: 400 }
      )
    }

    const attempt = await prisma.readingAttempt.create({
      data: {
        deviceId,
        assessmentType,
        passageId: passageId || null,
        wordListId: wordListId || null,
        pseudowordListId: pseudowordListId || null,
        totalWords: totalWords || 0,
        wordsCorrect: wordsCorrect || 0,
        errorsTotal: errorsTotal || 0,
        accuracyPct: accuracyPct || 0,
        wcpm: wcpm || 0,
        selfCorrections: selfCorrections || 0,
        comprehensionCorrect: comprehensionCorrect || 0,
        comprehensionTotal: comprehensionTotal || 0,
        readingLevelBand: readingLevelBand || null,
        readingLevelPercentile: readingLevelPercentile || 0,
        durationSeconds: durationSeconds || 0,
        endedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        deviceId: attempt.deviceId,
        assessmentType: attempt.assessmentType,
        accuracy: attempt.accuracyPct,
        wcpm: attempt.wcpm,
        readingLevel: attempt.readingLevelBand,
        createdAt: attempt.createdAt,
      },
    })
  } catch (error) {
    console.error('Error saving reading attempt:', error)
    return NextResponse.json(
      { error: 'Failed to save reading attempt' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/assessment/save-attempt?deviceId=xxx
 * Retrieves reading assessment history for a device
 */
export async function GET(request: NextRequest) {
  try {
    const deviceId = request.nextUrl.searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID required' },
        { status: 400 }
      )
    }

    const attempts = await prisma.readingAttempt.findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        assessmentType: true,
        totalWords: true,
        wordsCorrect: true,
        accuracyPct: true,
        wcpm: true,
        readingLevelBand: true,
        readingLevelPercentile: true,
        durationSeconds: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      count: attempts.length,
      attempts,
    })
  } catch (error) {
    console.error('Error fetching reading attempts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reading attempts' },
      { status: 500 }
    )
  }
}
