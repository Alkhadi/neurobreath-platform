/**
 * Parent Auth API
 * 
 * Create and verify parent access codes for read-only progress viewing
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDbDown, getDbDownReason } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * POST: Create parent access code
 */
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
    const { deviceId, learnerName, parentEmail, expiresInDays } = body
    
    if (!deviceId) {
      return NextResponse.json({ error: 'deviceId required' }, { status: 400 })
    }
    
    // Generate 6-digit code
    const parentCode = generateParentCode()
    
    // Calculate expiry if specified
    let expiresAt: Date | null = null
    if (expiresInDays) {
      expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + expiresInDays)
    }
    
    // Create parent access
    const access = await prisma.parentAccess.create({
      data: {
        parentCode,
        deviceId,
        learnerName: learnerName || null,
        parentEmail: parentEmail || null,
        isActive: true,
        canEdit: false, // Always false for v1
        expiresAt
      }
    })
    
    return NextResponse.json({
      success: true,
      parentCode: access.parentCode,
      accessUrl: `/parent/${access.parentCode}`,
      expiresAt: access.expiresAt
    })
  } catch (error) {
    console.error('[Parent Auth] Create error:', error)
    return NextResponse.json({ error: 'Failed to create parent access' }, { status: 500 })
  }
}

/**
 * GET: Verify parent code and get device info
 */
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
    
    // Find access record
    const access = await prisma.parentAccess.findUnique({
      where: { parentCode }
    })
    
    if (!access) {
      return NextResponse.json({ error: 'Invalid code' }, { status: 404 })
    }
    
    // Check if active
    if (!access.isActive) {
      return NextResponse.json({ error: 'Access code has been deactivated' }, { status: 403 })
    }
    
    // Check if expired
    if (access.expiresAt && access.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Access code has expired' }, { status: 403 })
    }
    
    // Update last accessed
    await prisma.parentAccess.update({
      where: { id: access.id },
      data: { lastAccessedAt: new Date() }
    })
    
    return NextResponse.json({
      valid: true,
      deviceId: access.deviceId,
      learnerName: access.learnerName,
      canEdit: access.canEdit,
      expiresAt: access.expiresAt
    })
  } catch (error) {
    console.error('[Parent Auth] Verify error:', error)
    return NextResponse.json({ error: 'Failed to verify code' }, { status: 500 })
  }
}

/**
 * DELETE: Deactivate parent access
 */
export async function DELETE(request: NextRequest) {
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
    
    await prisma.parentAccess.update({
      where: { parentCode },
      data: { isActive: false }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Parent Auth] Deactivate error:', error)
    return NextResponse.json({ error: 'Failed to deactivate access' }, { status: 500 })
  }
}

/**
 * Generate a 6-digit parent code
 */
function generateParentCode(): string {
  // Generate 6 random digits
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return code
}

