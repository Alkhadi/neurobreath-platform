/**
 * SEND Report Generation API
 * 
 * Generates training recommendation reports with AI or rules-based fallback
 * NOT a diagnostic tool - training placement only
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDbDown, getDbDownReason } from '@/lib/db'
import { analyzeWithRules } from '@/lib/send-report-rules'

export const dynamic = 'force-dynamic'

const DISCLAIMER = 'This report provides training recommendations only and is NOT a diagnostic assessment. For formal educational or clinical assessment, please consult qualified professionals.'

interface GenerateReportRequest {
  deviceId: string
  learnerName?: string
  dateRange: {
    from: string // ISO date
    to: string // ISO date
  }
  assessmentIds?: string[]
  sessionIds?: string[]
}

export async function POST(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      error: 'Database unavailable',
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    }, { status: 503 })
  }

  try {
    const body = await request.json() as GenerateReportRequest
    const { deviceId, learnerName, dateRange, assessmentIds, sessionIds } = body
    
    if (!deviceId || !dateRange) {
      return NextResponse.json({ error: 'deviceId and dateRange required' }, { status: 400 })
    }
    
    // Fetch assessments
    const assessments = await prisma.readingAttempt.findMany({
      where: {
        deviceId,
        startedAt: {
          gte: new Date(dateRange.from),
          lte: new Date(dateRange.to)
        },
        ...(assessmentIds && assessmentIds.length > 0 ? { id: { in: assessmentIds } } : {})
      },
      orderBy: { startedAt: 'desc' }
    })
    
    // Fetch sessions
    const sessions = await prisma.session.findMany({
      where: {
        deviceId,
        completedAt: {
          gte: new Date(dateRange.from),
          lte: new Date(dateRange.to)
        },
        ...(sessionIds && sessionIds.length > 0 ? { id: { in: sessionIds } } : {})
      },
      orderBy: { completedAt: 'desc' }
    })
    
    // Prepare data for analysis
    const assessmentData = assessments.map(a => ({
      id: a.id,
      assessmentType: a.assessmentType,
      scores: {
        decoding: a.readingProfile ? (a.readingProfile as any).decoding?.score : undefined,
        wordRecognition: a.readingProfile ? (a.readingProfile as any).wordRecognition?.score : undefined,
        fluency: a.readingProfile ? (a.readingProfile as any).fluency?.score : undefined,
        comprehension: a.readingProfile ? (a.readingProfile as any).comprehension?.score : undefined,
      },
      timestamp: a.startedAt.toISOString()
    }))
    
    const sessionData = sessions.map(s => ({
      id: s.id,
      technique: s.technique,
      minutes: s.minutes,
      category: s.category || undefined,
      timestamp: s.completedAt.toISOString()
    }))
    
    // Try AI analysis first (if configured)
    let analysis
    const generatedBy = 'rules-engine'
    
    if (process.env.OPENAI_API_KEY || process.env.ABACUS_API_KEY) {
      try {
        // TODO: Implement AI analysis when provider is configured
        // For now, fall back to rules
        analysis = analyzeWithRules(assessmentData, sessionData)
      } catch (error) {
        console.warn('[SEND Report] AI analysis failed, using rules:', error)
        analysis = analyzeWithRules(assessmentData, sessionData)
      }
    } else {
      // No AI configured - use rules engine
      analysis = analyzeWithRules(assessmentData, sessionData)
    }
    
    // Create report in database
    const report = await prisma.sENDReport.create({
      data: {
        deviceId,
        learnerName: learnerName || null,
        reportDate: new Date(),
        assessmentIds: assessments.map(a => a.id),
        sessionIds: sessions.map(s => s.id),
        dateRangeJson: dateRange,
        patternSummary: analysis.patternSummary,
        strengths: analysis.strengths,
        challenges: analysis.challenges,
        recommendations: analysis.recommendations,
        confidence: analysis.confidence,
        generatedBy,
        isPrintFriendly: true,
        disclaimerShown: true,
        disclaimer: DISCLAIMER
      }
    })
    
    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        deviceId: report.deviceId,
        learnerName: report.learnerName,
        reportDate: report.reportDate,
        patternSummary: report.patternSummary,
        strengths: report.strengths,
        challenges: report.challenges,
        recommendations: report.recommendations,
        confidence: report.confidence,
        generatedBy: report.generatedBy,
        disclaimer: report.disclaimer,
        assessmentCount: assessments.length,
        sessionCount: sessions.length
      }
    })
  } catch (error) {
    console.error('[SEND Report] Generation error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}

/**
 * GET: Fetch existing reports
 */
export async function GET(request: NextRequest) {
  if (isDbDown()) {
    return NextResponse.json({
      reports: [],
      dbUnavailable: true,
      dbUnavailableReason: getDbDownReason()
    })
  }

  try {
    const deviceId = request.nextUrl.searchParams.get('deviceId')
    
    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId required' }, { status: 400 })
    }
    
    const reports = await prisma.sENDReport.findMany({
      where: { deviceId },
      orderBy: { reportDate: 'desc' },
      take: 20
    })
    
    return NextResponse.json({ reports })
  } catch (error) {
    console.error('[SEND Report] Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 })
  }
}

