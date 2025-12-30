/**
 * @neurobreath/core
 * 
 * Open-source core utilities for offline-first learning platforms
 */

// Types
export type {
  Session,
  Assessment,
  Badge,
  Progress,
} from './types/progress'

export type {
  SyncRequest,
  SyncResponse,
  SyncConflict,
  ConflictStrategy,
} from './types/sync'

// Utils
export {
  Storage,
  StorageAdapter,
  createBrowserStorage,
  createStorage,
} from './utils/storage'

export {
  validateSyncRequest,
  validateProgress,
  validateSession,
} from './utils/validation'

// Offline
export {
  OfflineQueue,
  QueueItem,
} from './offline/queue'

export {
  mergeProgress,
  mergeSessions,
  resolveConflict,
} from './offline/merge'

