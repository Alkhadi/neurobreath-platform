/**
 * Sync API Endpoint
 * 
 * Syncs client data with server for authenticated users
 * Guest mode: Returns client data as-is (no server writes)
 * Auth mode: Merges with server, resolves conflicts
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDbDown, getDbDownReason } from '@/lib/db'
import {
  validateSyncRequest,
  handleGuestSync,
  resolveConflict,
  type SyncRequest,
  type SyncResponse,
  type SyncConflict,
} from '@/lib/sync-schema'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      error: 'Database unavailable',
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    }, { status: 503 })
  }

  try {
    const body = await request.json()
    
    // Validate request
    if (!validateSyncRequest(body)) {
      return NextResponse.json({ error: 'Invalid sync request' }, { status: 400 })
    }
    
    const syncRequest = body as SyncRequest
    
    // Handle guest mode (no server writes)
    if (syncRequest.isGuest) {
      const guestResponse = handleGuestSync(syncRequest)
      return NextResponse.json(guestResponse)
    }
    
    // Authenticated sync
    const response = await syncAuthenticatedUser(syncRequest)
    return NextResponse.json(response)
  } catch (error) {
    console.error('[Sync] Error:', error)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}

/**
 * Sync for authenticated users
 */
async function syncAuthenticatedUser(request: SyncRequest): Promise<SyncResponse> {
  const { deviceId, clientData } = request
  const conflicts: SyncConflict[] = []
  let sessionsAdded = 0
  let sessionsUpdated = 0
  let badgesAdded = 0
  let assessmentsAdded = 0
  
  // Sync sessions
  for (const session of clientData.sessions as Array<{
    id: string;
    deviceId: string;
    technique: string;
    label: string;
    minutes: number;
    breaths: number;
    rounds: number;
    category?: string;
    completedAt: string;
  }>) {
    // Check if session exists
    const existing = await prisma.session.findUnique({
      where: { id: session.id }
    })
    
    if (!existing) {
      // Create new session
      await prisma.session.create({
        data: {
          id: session.id,
          deviceId: session.deviceId,
          technique: session.technique,
          label: session.label,
          minutes: session.minutes,
          breaths: session.breaths,
          rounds: session.rounds,
          category: session.category || null,
          completedAt: new Date(session.completedAt)
        }
      })
      sessionsAdded++
    } else {
      // Session exists - check for conflicts
      const clientTime = new Date(session.completedAt)
      const serverTime = new Date(existing.completedAt)
      
      if (clientTime.getTime() !== serverTime.getTime()) {
        // Conflict detected - use last-write-wins
        const { conflict } = resolveConflict(session, existing)
        conflicts.push({ ...conflict, type: 'session' })
        
        if (conflict.resolution === 'client-wins') {
          await prisma.session.update({
            where: { id: session.id },
            data: {
              technique: session.technique,
              label: session.label,
              minutes: session.minutes,
              breaths: session.breaths,
              rounds: session.rounds,
              category: session.category || null,
              completedAt: new Date(session.completedAt)
            }
          })
          sessionsUpdated++
        }
      }
    }
  }
  
  // Sync progress
  const serverProgress = await prisma.progress.findUnique({
    where: { deviceId }
  })
  
  if (serverProgress) {
    // Merge progress (take max values)
    await prisma.progress.update({
      where: { deviceId },
      data: {
        totalSessions: Math.max(clientData.progress.totalSessions, serverProgress.totalSessions),
        totalMinutes: Math.max(clientData.progress.totalMinutes, serverProgress.totalMinutes),
        totalBreaths: Math.max(clientData.progress.totalBreaths, serverProgress.totalBreaths),
        currentStreak: Math.max(clientData.progress.currentStreak, serverProgress.currentStreak),
        longestStreak: Math.max(clientData.progress.longestStreak, serverProgress.longestStreak),
        lastSessionDate: clientData.progress.lastSessionDate || serverProgress.lastSessionDate
      }
    })
  } else {
    // Create progress
    await prisma.progress.create({
      data: {
        deviceId,
        totalSessions: clientData.progress.totalSessions,
        totalMinutes: clientData.progress.totalMinutes,
        totalBreaths: clientData.progress.totalBreaths,
        currentStreak: clientData.progress.currentStreak,
        longestStreak: clientData.progress.longestStreak,
        lastSessionDate: clientData.progress.lastSessionDate || null
      }
    })
  }
  
  // Sync badges
  for (const badge of clientData.badges) {
    const existing = await prisma.badge.findUnique({
      where: {
        deviceId_badgeKey: {
          deviceId: badge.deviceId,
          badgeKey: badge.badgeKey
        }
      }
    })
    
    if (!existing) {
      await prisma.badge.create({
        data: {
          deviceId: badge.deviceId,
          badgeKey: badge.badgeKey,
          badgeName: badge.badgeName,
          badgeIcon: badge.badgeIcon,
          unlockedAt: new Date(badge.unlockedAt)
        }
      })
      badgesAdded++
    }
  }
  
  // Sync assessments
  for (const assessment of clientData.assessments) {
    const existing = await prisma.readingAttempt.findUnique({
      where: { id: assessment.id }
    })
    
    if (!existing) {
      await prisma.readingAttempt.create({
        data: {
          id: assessment.id,
          deviceId: assessment.deviceId,
          assessmentType: assessment.assessmentType,
          placementLevel: assessment.placementLevel || null,
          placementConfidence: assessment.placementConfidence || null,
          readingProfile: assessment.readingProfile || null,
          startedAt: new Date(assessment.startedAt),
          endedAt: assessment.endedAt ? new Date(assessment.endedAt) : null
        }
      })
      assessmentsAdded++
    }
  }
  
  // Fetch merged data from server
  const sessions = await prisma.session.findMany({
    where: { deviceId },
    orderBy: { completedAt: 'desc' },
    take: 100
  })
  
  const progress = await prisma.progress.findUnique({
    where: { deviceId }
  })
  
  const badges = await prisma.badge.findMany({
    where: { deviceId },
    orderBy: { unlockedAt: 'desc' }
  })
  
  const assessments = await prisma.readingAttempt.findMany({
    where: { deviceId },
    orderBy: { startedAt: 'desc' },
    take: 20
  })
  
  // Build response
  const response: SyncResponse = {
    success: true,
    serverTimestamp: new Date().toISOString(),
    merged: {
      sessions: sessions.map(s => ({
        id: s.id,
        deviceId: s.deviceId,
        technique: s.technique,
        label: s.label,
        minutes: s.minutes,
        breaths: s.breaths,
        rounds: s.rounds,
        category: s.category || undefined,
        completedAt: s.completedAt.toISOString(),
        syncedAt: new Date().toISOString()
      })),
      progress: {
        deviceId: progress?.deviceId || deviceId,
        totalSessions: progress?.totalSessions || 0,
        totalMinutes: progress?.totalMinutes || 0,
        totalBreaths: progress?.totalBreaths || 0,
        currentStreak: progress?.currentStreak || 0,
        longestStreak: progress?.longestStreak || 0,
        lastSessionDate: progress?.lastSessionDate || undefined,
        updatedAt: progress?.updatedAt.toISOString() || new Date().toISOString()
      },
      badges: badges.map(b => ({
        deviceId: b.deviceId,
        badgeKey: b.badgeKey,
        badgeName: b.badgeName,
        badgeIcon: b.badgeIcon,
        unlockedAt: b.unlockedAt.toISOString()
      })),
      assessments: assessments.map(a => ({
        id: a.id,
        deviceId: a.deviceId,
        assessmentType: a.assessmentType,
        placementLevel: a.placementLevel || undefined,
        placementConfidence: a.placementConfidence || undefined,
        readingProfile: a.readingProfile || undefined,
        startedAt: a.startedAt.toISOString(),
        endedAt: a.endedAt?.toISOString() || undefined
      }))
    },
    conflicts: conflicts.length > 0 ? conflicts : undefined,
    syncInfo: {
      sessionsAdded,
      sessionsUpdated,
      badgesAdded,
      assessmentsAdded,
      conflictsResolved: conflicts.length
    }
  }
  
  return response
}

