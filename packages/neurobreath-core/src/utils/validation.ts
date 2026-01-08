/**
 * Validation Utilities
 */

import type { SyncRequest, Progress, Session } from '../types'

export function validateSyncRequest(request: any): request is SyncRequest {
  if (!request || typeof request !== 'object') return false
  if (!request.deviceId || typeof request.deviceId !== 'string') return false
  if (typeof request.isGuest !== 'boolean') return false
  if (!request.clientData || typeof request.clientData !== 'object') return false
  
  return true
}

export function validateProgress(progress: any): progress is Progress {
  if (!progress || typeof progress !== 'object') return false
  if (typeof progress.version !== 'number') return false
  if (typeof progress.totalSessions !== 'number') return false
  if (!Array.isArray(progress.sessions)) return false
  
  return true
}

export function validateSession(session: any): session is Session {
  if (!session || typeof session !== 'object') return false
  if (!session.id || typeof session.id !== 'string') return false
  if (typeof session.minutes !== 'number') return false
  if (typeof session.breaths !== 'number') return false
  
  return true
}

