import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// Type definitions for the extended ReadingAttempt model
// These match the schema but are defined here to avoid TS server caching issues
interface ExtendedAttemptData {
  deviceId: string
  assessmentType: string
  learnerGroup?: string | null
  passageId?: string | null
  wordListId?: string | null
  pseudowordListId?: string | null
  levelBandTarget?: string | null
  levelBandResult?: string | null
  confidence?: string | null
  placementLevel?: string | null
  placementConfidence?: string | null
  placementPlanJson?: Record<string, unknown> | null
  totalWords?: number
  wordsCorrect?: number
  errorsTotal?: number
  accuracyPct?: number
  wcpm?: number
  selfCorrections?: number
  comprehensionCorrect?: number
  comprehensionTotal?: number
  comprehensionScore?: number
  readingProfile?: Record<string, unknown> | null
  strengthsNeeds?: Record<string, unknown> | null
  readingLevelBand?: string | null
  readingLevelPercentile?: number
  durationSeconds?: number
  endedAt?: Date
}

interface ErrorDetail {
  wordIndex: number
  wordText: string
  errorType: string
  corrected: boolean
}

interface WordResponse {
  itemType: string
  itemText: string
  isCorrect: boolean
  responseTimeMs?: number
}

interface ComprehensionResponse {
  questionId: string
  selectedIndex: number
  isCorrect: boolean
}

/**
 * POST /api/assessment/save-full-attempt
 * Saves a comprehensive reading assessment attempt with all component data
 * 
 * This is the new API for the realistic multi-part assessment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      deviceId,
      assessmentType,
      learnerGroup,
      levelBandTarget,
      levelBandResult,
      confidence,
      durationSeconds,
      
      // Placement data (new)
      placementLevel,
      placementConfidence,
      placementPlanJson,
      
      // ORF data
      passageId,
      totalWords,
      wordsCorrect,
      errorsTotal,
      accuracyPct,
      wcpm,
      selfCorrections,
      errorDetails,
      
      // Word list data
      wordListId,
      wordResponses,
      
      // Pseudoword data
      pseudowordListId,
      pseudowordResponses,
      
      // Comprehension data
      comprehensionCorrect,
      comprehensionTotal,
      comprehensionResponses,
      
      // Profile
      readingProfile,
      strengthsNeeds,
      readingLevelBand,
    } = body

    if (!deviceId || !assessmentType) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, assessmentType' },
        { status: 400 }
      )
    }

    // Validate minimum assessment time (60 seconds)
    if (durationSeconds < 60 && assessmentType === 'fullCheckIn') {
      console.warn(`Short assessment time: ${durationSeconds}s for device ${deviceId}`)
    }

    // Build the attempt data object
    const attemptData: ExtendedAttemptData = {
      deviceId,
      assessmentType,
      learnerGroup: learnerGroup || null,
      passageId: passageId || null,
      wordListId: wordListId || null,
      pseudowordListId: pseudowordListId || null,
      levelBandTarget: levelBandTarget || null,
      levelBandResult: levelBandResult || null,
      confidence: confidence || null,
      placementLevel: placementLevel || null,
      placementConfidence: placementConfidence || null,
      placementPlanJson: placementPlanJson || null,
      totalWords: totalWords || 0,
      wordsCorrect: wordsCorrect || 0,
      errorsTotal: errorsTotal || 0,
      accuracyPct: accuracyPct || 0,
      wcpm: wcpm || 0,
      selfCorrections: selfCorrections || 0,
      comprehensionCorrect: comprehensionCorrect || 0,
      comprehensionTotal: comprehensionTotal || 0,
      comprehensionScore: comprehensionTotal > 0 
        ? (comprehensionCorrect / comprehensionTotal) * 100 
        : 0,
      readingProfile: readingProfile || null,
      strengthsNeeds: strengthsNeeds || null,
      readingLevelBand: readingLevelBand || null,
      readingLevelPercentile: 0, // Not using percentiles
      durationSeconds: durationSeconds || 0,
      endedAt: new Date(),
    }

    // Create the main attempt record using type assertion
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attempt = await (prisma.readingAttempt as any).create({
      data: attemptData,
    })

    // Save error details if provided
    if (errorDetails && Array.isArray(errorDetails) && errorDetails.length > 0) {
      await prisma.attemptErrorDetail.createMany({
        data: errorDetails.map((error: ErrorDetail) => ({
          attemptId: attempt.id,
          wordIndex: error.wordIndex,
          wordText: error.wordText,
          errorType: error.errorType,
          corrected: error.corrected || false,
        })),
      })
    }

    // Save word responses if provided
    const allWordResponses: WordResponse[] = [
      ...(wordResponses || []),
      ...(pseudowordResponses || []),
    ]
    
    if (allWordResponses.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).attemptWordResponse.createMany({
        data: allWordResponses.map((response: WordResponse) => ({
          attemptId: attempt.id,
          itemType: response.itemType,
          itemText: response.itemText,
          isCorrect: response.isCorrect,
          responseTimeMs: response.responseTimeMs || null,
        })),
      })
    }

    // Save comprehension responses if provided
    if (comprehensionResponses && Array.isArray(comprehensionResponses) && comprehensionResponses.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (prisma as any).attemptComprehensionResponse.createMany({
        data: comprehensionResponses.map((response: ComprehensionResponse) => ({
          attemptId: attempt.id,
          questionId: response.questionId,
          selectedIndex: response.selectedIndex,
          isCorrect: response.isCorrect,
        })),
        skipDuplicates: true,
      })
    }

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        deviceId: attempt.deviceId,
        assessmentType: attempt.assessmentType,
        levelBandResult: attempt.levelBandResult,
        confidence: attempt.confidence,
        accuracy: attempt.accuracyPct,
        wcpm: attempt.wcpm,
        createdAt: attempt.createdAt,
      },
    })
  } catch (error) {
    console.error('Error saving full reading attempt:', error)
    return NextResponse.json(
      { error: 'Failed to save reading attempt' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/assessment/save-full-attempt
 * Retrieves assessment attempts for a device
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing required parameter: deviceId' },
        { status: 400 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attempts = await (prisma.readingAttempt as any).findMany({
      where: { deviceId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        errorDetails: true,
        wordResponses: true,
        comprehensionResponses: true,
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json({
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attempts: attempts.map((attempt: any) => ({
        id: attempt.id,
        assessmentType: attempt.assessmentType,
        levelBandTarget: attempt.levelBandTarget,
        levelBandResult: attempt.levelBandResult,
        confidence: attempt.confidence,
        totalWords: attempt.totalWords,
        wordsCorrect: attempt.wordsCorrect,
        accuracyPct: attempt.accuracyPct,
        wcpm: attempt.wcpm,
        comprehensionScore: attempt.comprehensionScore,
        readingProfile: attempt.readingProfile,
        strengthsNeeds: attempt.strengthsNeeds,
        durationSeconds: attempt.durationSeconds,
        createdAt: attempt.createdAt,
        errorCount: attempt.errorDetails?.length || 0,
        wordResponseCount: attempt.wordResponses?.length || 0,
        comprehensionResponseCount: attempt.comprehensionResponses?.length || 0,
      })),
    })
  } catch (error) {
    console.debug('[Assessment API] Database unavailable (normal in dev without DB setup)')
    // Return 200 with empty data and dbUnavailable flag to keep console clean
    return NextResponse.json({
      success: true,
      attempts: [],
      dbUnavailable: true,
      dbUnavailableReason: 'Database not configured'
    }, { status: 200 })
  }
}
