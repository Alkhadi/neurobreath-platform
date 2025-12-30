/**
 * Core Sync Types
 * 
 * Brand-agnostic sync contract types
 */

import type { Session, Assessment, Badge, Progress } from './progress'

export interface SyncRequest {
  deviceId: string
  isGuest: boolean
  lastSyncTimestamp?: string
  clientData: {
    sessions: Session[]
    progress: Progress
    badges: Badge[]
    assessments: Assessment[]
  }
  clientVersion?: string
  platform?: 'web' | 'flutter' | 'ios' | 'android'
}

export interface SyncResponse {
  success: boolean
  serverTimestamp: string
  merged: {
    sessions: Session[]
    progress: Progress
    badges: Badge[]
    assessments: Assessment[]
  }
  conflicts?: SyncConflict[]
  syncInfo: {
    sessionsAdded: number
    sessionsUpdated: number
    badgesAdded: number
    assessmentsAdded: number
    conflictsResolved: number
  }
  isGuestMode?: boolean
  guestMessage?: string
}

export interface SyncConflict {
  type: 'session' | 'progress' | 'badge' | 'assessment'
  itemId: string
  clientVersion: any
  serverVersion: any
  resolution: 'client-wins' | 'server-wins' | 'merged'
  reason: string
}

export type ConflictStrategy = 'last-write-wins' | 'client-wins' | 'server-wins' | 'merge'

