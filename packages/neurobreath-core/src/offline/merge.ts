/**
 * Data Merging Utilities
 * 
 * Merge client and server data with conflict resolution
 */

import type { Progress, Session, ConflictStrategy, SyncConflict } from '../types'

export function mergeProgress(
  client: Progress,
  server: Progress,
  strategy: ConflictStrategy = 'last-write-wins'
): Progress {
  // Take max values for numeric fields
  return {
    ...server,
    version: Math.max(client.version, server.version),
    totalSessions: Math.max(client.totalSessions, server.totalSessions),
    totalMinutes: Math.max(client.totalMinutes, server.totalMinutes),
    totalBreaths: Math.max(client.totalBreaths, server.totalBreaths),
    currentStreak: Math.max(client.currentStreak, server.currentStreak),
    longestStreak: Math.max(client.longestStreak, server.longestStreak),
    lastUpdated: new Date().toISOString(),
    // Merge arrays (deduplicate by ID)
    sessions: deduplicateSessions([...client.sessions, ...server.sessions]),
    assessments: deduplicateById([...client.assessments, ...server.assessments]),
    badges: deduplicateById([...client.badges, ...server.badges], 'key')
  }
}

export function mergeSessions(
  client: Session[],
  server: Session[]
): Session[] {
  return deduplicateSessions([...client, ...server])
}

function deduplicateSessions(sessions: Session[]): Session[] {
  const seen = new Map<string, Session>()
  
  sessions.forEach(session => {
    const existing = seen.get(session.id)
    if (!existing) {
      seen.set(session.id, session)
    } else {
      // Keep the one with later timestamp
      const existingTime = new Date(existing.timestamp).getTime()
      const newTime = new Date(session.timestamp).getTime()
      if (newTime > existingTime) {
        seen.set(session.id, session)
      }
    }
  })
  
  return Array.from(seen.values()).sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

function deduplicateById<T extends { id?: string; key?: string }>(
  items: T[],
  idField: 'id' | 'key' = 'id'
): T[] {
  const seen = new Map<string, T>()
  
  items.forEach(item => {
    const id = idField === 'id' ? item.id : item.key
    if (id && !seen.has(id)) {
      seen.set(id, item)
    }
  })
  
  return Array.from(seen.values())
}

export function resolveConflict(
  clientItem: any,
  serverItem: any,
  strategy: ConflictStrategy = 'last-write-wins'
): { resolved: any; conflict: SyncConflict } {
  const clientTime = new Date(clientItem.updatedAt || clientItem.timestamp || 0)
  const serverTime = new Date(serverItem.updatedAt || serverItem.timestamp || 0)
  
  let resolved: any
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
      resolved = { ...serverItem, ...clientItem }
      resolution = 'merged'
      reason = 'Merged both versions'
      break
  }
  
  const conflict: SyncConflict = {
    type: 'progress',
    itemId: clientItem.id || clientItem.deviceId,
    clientVersion: clientItem,
    serverVersion: serverItem,
    resolution,
    reason
  }
  
  return { resolved, conflict }
}

