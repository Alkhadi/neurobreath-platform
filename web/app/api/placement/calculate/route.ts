import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { quickPlacement, PlacementResult } from '@/lib/placement-rubric'
import { generatePlacementPlan, PlacementPlan } from '@/lib/placement-plan'
import { LearnerGroup } from '@/lib/placement-levels'

export const dynamic = 'force-dynamic'

interface CalculatePlacementRequest {
  deviceId: string
  learnerGroup: LearnerGroup
  
  // Assessment scores (0-100)
  decodingScore: number
  wordRecognitionScore: number
  fluencyScore: number
  comprehensionScore: number
  
  // Optional metadata
  assessmentId?: string
  confidence?: 'low' | 'medium' | 'high'
}

interface PlacementResponse {
  success: boolean
  placement: PlacementResult
  plan: PlacementPlan
  saved: boolean
}

/**
 * POST /api/placement/calculate
 * 
 * Calculate placement level and generate training plan from assessment scores.
 * Optionally saves the placement to the database.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CalculatePlacementRequest = await request.json()
    
    const {
      deviceId,
      learnerGroup,
      decodingScore,
      wordRecognitionScore,
      fluencyScore,
      comprehensionScore,
      assessmentId,
      confidence,
    } = body

    // Validate required fields
    if (!deviceId || !learnerGroup) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, learnerGroup' },
        { status: 400 }
      )
    }

    // Validate learner group
    const validGroups: LearnerGroup[] = ['children', 'youth', 'adolescence', 'adult']
    if (!validGroups.includes(learnerGroup)) {
      return NextResponse.json(
        { error: `Invalid learnerGroup. Must be one of: ${validGroups.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate scores are numbers in valid range
    const scores = { decodingScore, wordRecognitionScore, fluencyScore, comprehensionScore }
    for (const [name, score] of Object.entries(scores)) {
      if (typeof score !== 'number' || score < 0 || score > 100) {
        return NextResponse.json(
          { error: `Invalid ${name}: must be a number between 0 and 100` },
          { status: 400 }
        )
      }
    }

    // Calculate placement using the rubric
    const placement = quickPlacement({
      learnerGroup,
      decodingScore,
      wordRecognitionScore,
      fluencyScore,
      comprehensionScore,
      confidence: confidence || 'medium',
    })

    // Generate training plan
    const plan = generatePlacementPlan(placement)

    // Save to database
    let saved = false
    try {
      // Convert plan to JSON-serializable format
      const planJson = JSON.parse(JSON.stringify(plan))
      
      await prisma.learnerPlacement.upsert({
        where: { deviceId },
        create: {
          deviceId,
          learnerGroup,
          currentLevel: placement.level,
          placementConfidence: placement.confidence,
          assessmentId: assessmentId || null,
          placedAt: new Date(),
          placementPlanJson: planJson,
          lessonsCompleted: [],
          currentLessonSlug: plan.startingLesson?.slug || null,
        },
        update: {
          learnerGroup,
          currentLevel: placement.level,
          placementConfidence: placement.confidence,
          assessmentId: assessmentId || null,
          placedAt: new Date(),
          placementPlanJson: planJson,
          currentLessonSlug: plan.startingLesson?.slug || null,
          // Don't reset lessonsCompleted on re-assessment
        },
      })
      saved = true
    } catch (dbError) {
      console.error('Failed to save placement:', dbError)
      // Continue without saving - placement still works
    }

    const response: PlacementResponse = {
      success: true,
      placement,
      plan,
      saved,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error calculating placement:', error)
    return NextResponse.json(
      { error: 'Failed to calculate placement' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/placement/calculate
 * 
 * Retrieve the current placement for a device.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get('deviceId')

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Missing required parameter: deviceId' },
        { status: 400 }
      )
    }

    const placement = await prisma.learnerPlacement.findUnique({
      where: { deviceId },
    })

    if (!placement) {
      return NextResponse.json(
        { error: 'No placement found for this device' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      placement: {
        deviceId: placement.deviceId,
        learnerGroup: placement.learnerGroup,
        currentLevel: placement.currentLevel,
        confidence: placement.placementConfidence,
        placedAt: placement.placedAt,
        lessonsCompleted: placement.lessonsCompleted,
        currentLessonSlug: placement.currentLessonSlug,
        plan: placement.placementPlanJson,
      },
    })
  } catch (error) {
    console.error('Error fetching placement:', error)
    return NextResponse.json(
      { error: 'Failed to fetch placement' },
      { status: 500 }
    )
  }
}
