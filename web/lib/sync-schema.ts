/**
 * Sync Schema for Flutter/Mobile Integration
 * 
 * Defines the contract for syncing data between client and server
 * Supports both guest (local-only) and authenticated (server-sync) modes
 */

// ============================================================================
// TYPES
// ============================================================================

export interface SyncSession {
  id: string
  deviceId: string
  technique: string
  label: string
  minutes: number
  breaths: number
  rounds: number
  category?: string
  completedAt: string // ISO 8601
  syncedAt?: string // ISO 8601 - when synced to server
}

export interface SyncProgress {
  deviceId: string
  totalSessions: number
  totalMinutes: number
  totalBreaths: number
  currentStreak: number
  longestStreak: number
  lastSessionDate?: string // YYYY-MM-DD
  updatedAt: string // ISO 8601
}

export interface SyncBadge {
  deviceId: string
  badgeKey: string
  badgeName: string
  badgeIcon: string
  unlockedAt: string // ISO 8601
}

export interface SyncAssessment {
  id: string
  deviceId: string
  assessmentType: string
  placementLevel?: string
  placementConfidence?: string
  readingProfile?: unknown // JSON
  startedAt: string // ISO 8601
  endedAt?: string // ISO 8601
}

export interface SyncRequest {
  // Client identification
  deviceId: string
  isGuest: boolean
  
  // Last sync timestamp (for incremental sync)
  lastSyncTimestamp?: string // ISO 8601
  
  // Client data to sync
  clientData: {
    sessions: SyncSession[]
    progress: SyncProgress
    badges: SyncBadge[]
    assessments: SyncAssessment[]
  }
  
  // Client metadata
  clientVersion?: string
  platform?: 'web' | 'flutter' | 'ios' | 'android'
}

export interface SyncResponse {
  success: boolean
  serverTimestamp: string // ISO 8601
  
  // Merged data (what client should now have)
  merged: {
    sessions: SyncSession[]
    progress: SyncProgress
    badges: SyncBadge[]
    assessments: SyncAssessment[]
  }
  
  // Conflicts detected (if any)
  conflicts?: SyncConflict[]
  
  // Sync metadata
  syncInfo: {
    sessionsAdded: number
    sessionsUpdated: number
    badgesAdded: number
    assessmentsAdded: number
    conflictsResolved: number
  }
  
  // For guest users
  isGuestMode?: boolean
  guestMessage?: string
}

export interface SyncConflict {
  type: 'session' | 'progress' | 'badge' | 'assessment'
  itemId: string
  clientVersion: unknown
  serverVersion: unknown
  resolution: 'client-wins' | 'server-wins' | 'merged'
  reason: string
}

// ============================================================================
// VALIDATION
// ============================================================================
export function validateSyncRequest(request: unknown): request is SyncRequest {
  if (!request || typeof request !== 'object') return false
  const record = request as Record<string, unknown>
  if (!record.deviceId || typeof record.deviceId !== 'string') return false
  if (typeof record.isGuest !== 'boolean') return false
  if (!record.clientData || typeof record.clientData !== 'object') return false
  
  return true
}

type SyncResolvableItem = {
  id?: string
  deviceId?: string
  updatedAt?: string | Date
  completedAt?: string | Date
  [key: string]: unknown
}

function toDate(value: string | Date | undefined): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string') return new Date(value)
  return new Date(0)
}

// ============================================================================
// CONFLICT RESOLUTION STRATEGIES
// ============================================================================

export type ConflictStrategy = 'last-write-wins' | 'client-wins' | 'server-wins' | 'merge'

/**
 * Resolve conflicts between client and server data
 * Default: last-write-wins based on timestamps
 */
export function resolveConflict(
  clientItem: SyncResolvableItem,
  serverItem: SyncResolvableItem,
  strategy: ConflictStrategy = 'last-write-wins'
): { resolved: SyncResolvableItem; conflict: SyncConflict } {
  const clientTime = toDate(clientItem.updatedAt ?? clientItem.completedAt)
  const serverTime = toDate(serverItem.updatedAt ?? serverItem.completedAt)
  
  let resolved: SyncResolvableItem
  let resolution: SyncConflict['resolution']
  let reason: string
  
  switch (strategy) {
    case 'last-write-wins':
      if (clientTime > serverTime) {
        resolved = clientItem
        resolution = 'client-wins'
        reason = 'Client version is newer'
      } else {
        resolved = serverItem
        resolution = 'server-wins'
        reason = 'Server version is newer'
      }
      break
      
    case 'client-wins':
      resolved = clientItem
      resolution = 'client-wins'
      reason = 'Client-wins strategy'
      break
      
    case 'server-wins':
      resolved = serverItem
      resolution = 'server-wins'
      reason = 'Server-wins strategy'
      break
      
    case 'merge':
      // Simple merge: take max values for numeric fields
      resolved = {
        ...serverItem,
        ...clientItem,
        totalSessions: Math.max(Number(clientItem.totalSessions ?? 0), Number(serverItem.totalSessions ?? 0)),
        totalMinutes: Math.max(Number(clientItem.totalMinutes ?? 0), Number(serverItem.totalMinutes ?? 0)),
        longestStreak: Math.max(Number(clientItem.longestStreak ?? 0), Number(serverItem.longestStreak ?? 0)),
      }
      resolution = 'merged'
      reason = 'Merged both versions'
      break
  }
  
  const conflict: SyncConflict = {
    type: 'progress', // Will be set by caller
    itemId: String(clientItem.id ?? clientItem.deviceId ?? ''),
    clientVersion: clientItem,
    serverVersion: serverItem,
    resolution,
    reason
  }
  
  return { resolved, conflict }
}

// ============================================================================
// GUEST MODE HELPERS
// ============================================================================

/**
 * Handle guest mode sync (no server writes)
 * Returns client data as-is with metadata
 */
export function handleGuestSync(request: SyncRequest): SyncResponse {
  return {
    success: true,
    serverTimestamp: new Date().toISOString(),
    merged: request.clientData,
    syncInfo: {
      sessionsAdded: 0,
      sessionsUpdated: 0,
      badgesAdded: 0,
      assessmentsAdded: 0,
      conflictsResolved: 0
    },
    isGuestMode: true,
    guestMessage: 'Guest mode: Data stored locally only. Create an account to sync across devices.'
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

// Types are already exported inline above
// No additional exports needed

