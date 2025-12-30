import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { NBLevel } from '@/lib/placement-levels'

export const dynamic = 'force-dynamic'

/**
 * GET /api/lessons
 * 
 * Retrieve lessons from the catalog with optional filtering.
 * 
 * Query parameters:
 * - level: Filter by NB level (e.g., 'NB-L3')
 * - skill: Filter by skill focus (e.g., 'decoding')
 * - type: Filter by lesson type (e.g., 'lesson', 'practice', 'game')
 * - limit: Maximum number of results (default: 50)
 * - active: Filter by active status (default: true)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level') as NBLevel | null
    const skill = searchParams.get('skill')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')
    const activeParam = searchParams.get('active')
    const isActive = activeParam === null ? true : activeParam === 'true'

    // Build where clause
    const where: Record<string, unknown> = {
      isActive,
    }

    if (level) {
      where.nbLevel = level
    }

    if (skill) {
      where.skillFocus = { has: skill }
    }

    if (type) {
      where.lessonType = type
    }

    const lessons = await prisma.lessonCatalog.findMany({
      where,
      orderBy: [
        { nbLevel: 'asc' },
        { orderInLevel: 'asc' },
      ],
      take: limit,
    })

    return NextResponse.json({
      success: true,
      count: lessons.length,
      lessons: lessons.map(lesson => ({
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        nbLevel: lesson.nbLevel,
        skillFocus: lesson.skillFocus,
        lessonType: lesson.lessonType,
        durationMinutes: lesson.durationMinutes,
        difficulty: lesson.difficulty,
        isFreeContent: lesson.isFreeContent,
      })),
    })
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}
