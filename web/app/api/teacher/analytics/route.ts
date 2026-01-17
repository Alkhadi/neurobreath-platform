/**
 * Teacher Analytics API
 * 
 * Provides aggregated data for teacher dashboard
 * Server-side aggregation for performance
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDbDown, getDbDownReason } from '@/lib/db'
import type { Session } from '@prisma/client'

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
    const searchParams = request.nextUrl.searchParams
    
    // Parse query params
    const deviceIdsParam = searchParams.get('deviceIds')
    const deviceIds = deviceIdsParam ? deviceIdsParam.split(',') : []
    const dateRange = (searchParams.get('dateRange') || 'week') as 'week' | 'month' | 'all'
    
    if (deviceIds.length === 0) {
      return NextResponse.json({ error: 'deviceIds required' }, { status: 400 })
    }
    
    // Calculate date filter
    const now = new Date()
    let startDate: Date
    
    switch (dateRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'all':
      default:
        startDate = new Date(0) // Beginning of time
        break
    }
    
    // Fetch sessions for all devices in date range
    const sessions = await prisma.session.findMany({
      where: {
        deviceId: { in: deviceIds },
        completedAt: { gte: startDate }
      },
      orderBy: { completedAt: 'desc' }
    })
    
    // Fetch progress for all devices
    const progressRecords = await prisma.progress.findMany({
      where: {
        deviceId: { in: deviceIds }
      }
    })
    
    // Aggregate data
    const analytics = {
      // Overall stats
      totalSessions: sessions.length,
      totalMinutes: sessions.reduce((sum, s) => sum + s.minutes, 0),
      totalBreaths: sessions.reduce((sum, s) => sum + s.breaths, 0),
      
      // Per-learner summary
      learners: deviceIds.map(deviceId => {
        const learnerSessions = sessions.filter(s => s.deviceId === deviceId)
        const learnerProgress = progressRecords.find(p => p.deviceId === deviceId)
        
        return {
          deviceId,
          sessionsInRange: learnerSessions.length,
          minutesInRange: learnerSessions.reduce((sum, s) => sum + s.minutes, 0),
          currentStreak: learnerProgress?.currentStreak || 0,
          longestStreak: learnerProgress?.longestStreak || 0,
          totalSessions: learnerProgress?.totalSessions || 0,
          totalMinutes: learnerProgress?.totalMinutes || 0,
        }
      }),
      
      // Minutes per activity (category)
      minutesByActivity: sessions.reduce((acc, session) => {
        const category = session.category || 'other'
        acc[category] = (acc[category] || 0) + session.minutes
        return acc
      }, {} as Record<string, number>),
      
      // Minutes per technique
      minutesByTechnique: sessions.reduce((acc, session) => {
        acc[session.technique] = (acc[session.technique] || 0) + session.minutes
        return acc
      }, {} as Record<string, number>),
      
      // Weekly consistency (sessions per day)
      dailyActivity: calculateDailyActivity(sessions, startDate),
      
      // Completion rate (sessions with >= 5 minutes)
      completionRate: sessions.length > 0
        ? (sessions.filter(s => s.minutes >= 5).length / sessions.length) * 100
        : 0,
      
      // Average session length
      avgSessionMinutes: sessions.length > 0
        ? sessions.reduce((sum, s) => sum + s.minutes, 0) / sessions.length
        : 0,
    }
    
    return NextResponse.json(analytics)
  } catch (error) {
    console.error('[Teacher Analytics] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

/**
 * Calculate daily activity for chart
 */
function calculateDailyActivity(sessions: Array<Pick<Session, 'completedAt'>>, startDate: Date) {
  const dailyMap = new Map<string, number>()
  
  sessions.forEach(session => {
    const date = new Date(session.completedAt).toISOString().split('T')[0]
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1)
  })
  
  // Fill in missing days with 0
  const result: { date: string; sessions: number }[] = []
  const current = new Date(startDate)
  const now = new Date()
  
  while (current <= now) {
    const dateStr = current.toISOString().split('T')[0]
    result.push({
      date: dateStr,
      sessions: dailyMap.get(dateStr) || 0
    })
    current.setDate(current.getDate() + 1)
  }
  
  return result
}

