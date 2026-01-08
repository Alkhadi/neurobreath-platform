/**
 * Parent Progress API
 * 
 * Read-only progress endpoint for parents/guardians
 * Mobile-friendly JSON responses
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDbDown, getDbDownReason } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      error: 'Database unavailable',
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    }, { status: 503 })
  }

  try {
    const parentCode = request.nextUrl.searchParams.get('code')
    
    if (!parentCode) {
      return NextResponse.json({ error: 'code required' }, { status: 400 })
    }
    
    // Verify parent access
    const access = await prisma.parentAccess.findUnique({
      where: { parentCode }
    })
    
    if (!access || !access.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive code' }, { status: 403 })
    }
    
    // Check expiry
    if (access.expiresAt && access.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Access code has expired' }, { status: 403 })
    }
    
    const deviceId = access.deviceId
    
    // Fetch progress
    const progress = await prisma.progress.findUnique({
      where: { deviceId }
    })
    
    // Fetch recent sessions (last 20)
    const sessions = await prisma.session.findMany({
      where: { deviceId },
      orderBy: { completedAt: 'desc' },
      take: 20
    })
    
    // Fetch badges
    const badges = await prisma.badge.findMany({
      where: { deviceId },
      orderBy: { unlockedAt: 'desc' }
    })
    
    // Fetch latest assessment
    const latestAssessment = await prisma.readingAttempt.findFirst({
      where: { deviceId },
      orderBy: { startedAt: 'desc' }
    })
    
    // Fetch placement
    const placement = await prisma.learnerPlacement.findUnique({
      where: { deviceId }
    })
    
    // Build mobile-friendly response
    return NextResponse.json({
      learnerName: access.learnerName,
      lastUpdated: new Date().toISOString(),
      
      // Summary stats
      summary: {
        totalSessions: progress?.totalSessions || 0,
        totalMinutes: progress?.totalMinutes || 0,
        totalBreaths: progress?.totalBreaths || 0,
        currentStreak: progress?.currentStreak || 0,
        longestStreak: progress?.longestStreak || 0,
        badgesEarned: badges.length
      },
      
      // Recent activity
      recentSessions: sessions.map(s => ({
        id: s.id,
        date: s.completedAt.toISOString(),
        technique: s.technique,
        label: s.label,
        minutes: s.minutes,
        category: s.category
      })),
      
      // Badges
      badges: badges.map(b => ({
        key: b.badgeKey,
        name: b.badgeName,
        icon: b.badgeIcon,
        unlockedAt: b.unlockedAt.toISOString()
      })),
      
      // Latest assessment (if any)
      latestAssessment: latestAssessment ? {
        date: latestAssessment.startedAt.toISOString(),
        type: latestAssessment.assessmentType,
        placementLevel: latestAssessment.placementLevel,
        confidence: latestAssessment.placementConfidence
      } : null,
      
      // Current placement
      placement: placement ? {
        level: placement.currentLevel,
        learnerGroup: placement.learnerGroup,
        confidence: placement.placementConfidence,
        placedAt: placement.placedAt.toISOString()
      } : null,
      
      // Access info
      accessInfo: {
        canEdit: access.canEdit,
        expiresAt: access.expiresAt?.toISOString() || null
      }
    })
  } catch (error) {
    console.error('[Parent Progress] Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

