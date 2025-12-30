import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface CompleteLessonRequest {
  deviceId: string
  lessonSlug: string
  score?: number // 0-100
  durationSeconds?: number
}

/**
 * POST /api/lessons/complete
 * 
 * Mark a lesson as completed for a learner.
 * Updates the placement record with the completed lesson.
 */
export async function POST(request: NextRequest) {
  try {
    const body: CompleteLessonRequest = await request.json()
    
    const { deviceId, lessonSlug, score, durationSeconds } = body

    if (!deviceId || !lessonSlug) {
      return NextResponse.json(
        { error: 'Missing required fields: deviceId, lessonSlug' },
        { status: 400 }
      )
    }

    // Verify lesson exists
    const lesson = await prisma.lessonCatalog.findUnique({
      where: { slug: lessonSlug },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get current placement
    const placement = await prisma.learnerPlacement.findUnique({
      where: { deviceId },
    })

    if (!placement) {
      return NextResponse.json(
        { error: 'No placement found for this device. Complete an assessment first.' },
        { status: 404 }
      )
    }

    // Add lesson to completed list if not already there
    const completedLessons = [...placement.lessonsCompleted]
    if (!completedLessons.includes(lessonSlug)) {
      completedLessons.push(lessonSlug)
    }

    // Determine next lesson
    const plan = placement.placementPlanJson as Record<string, unknown> | null
    let nextLessonSlug: string | null = null
    
    if (plan && Array.isArray(plan.lessonPath)) {
      const lessonPath = plan.lessonPath as Array<{ slug: string }>
      const currentIndex = lessonPath.findIndex(l => l.slug === lessonSlug)
      if (currentIndex >= 0 && currentIndex < lessonPath.length - 1) {
        nextLessonSlug = lessonPath[currentIndex + 1].slug
      }
    }

    // Update placement
    await prisma.learnerPlacement.update({
      where: { deviceId },
      data: {
        lessonsCompleted: completedLessons,
        currentLessonSlug: nextLessonSlug,
        updatedAt: new Date(),
      },
    })

    // Calculate progress
    const totalLessonsInPlan = plan && Array.isArray(plan.lessonPath) 
      ? (plan.lessonPath as unknown[]).length 
      : 0
    const progressPercent = totalLessonsInPlan > 0 
      ? Math.round((completedLessons.length / totalLessonsInPlan) * 100)
      : 0

    return NextResponse.json({
      success: true,
      lessonCompleted: {
        slug: lessonSlug,
        title: lesson.title,
        score: score || null,
        durationSeconds: durationSeconds || null,
      },
      progress: {
        lessonsCompleted: completedLessons.length,
        totalLessonsInPlan,
        progressPercent,
        nextLessonSlug,
      },
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json(
      { error: 'Failed to complete lesson' },
      { status: 500 }
    )
  }
}
