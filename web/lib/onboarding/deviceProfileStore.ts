/**
 * Device Profile Store (v1)
 * 
 * On-device learner profile storage.
 * Supports multiple profiles on one device (family-friendly).
 * Privacy-first: everything stored locally, no server sync required.
 * 
 * Storage Key: nb:deviceProfiles:v1
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LearnerProfile {
  id: string
  name: string
  age?: number
  createdAt: string // ISO 8601
  lastActiveAt: string // ISO 8601
  settings?: {
    owlTone?: 'gentle' | 'standard' | 'firm'
    quietHoursStart?: string // HH:MM
    quietHoursEnd?: string // HH:MM
    showOwlCoach?: boolean
  }
}

export interface DeviceProfiles {
  version: number
  profiles: LearnerProfile[]
  activeProfileId: string | null
  createdAt: string
  lastUpdated: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'nb:deviceProfiles:v1'
const CURRENT_VERSION = 1

// ============================================================================
// DEFAULT STATE
// ============================================================================

function createDefaultDeviceProfiles(): DeviceProfiles {
  return {
    version: CURRENT_VERSION,
    profiles: [],
    activeProfileId: null,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Load device profiles from localStorage
 * SSR-safe - returns null on server
 */
export function loadDeviceProfiles(): DeviceProfiles | null {
  if (typeof window === 'undefined') return null
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultDeviceProfiles()
    
    const parsed = JSON.parse(raw) as DeviceProfiles
    
    // Version migration if needed
    if (parsed.version !== CURRENT_VERSION) {
      return migrateDeviceProfiles(parsed)
    }
    
    return parsed
  } catch (error) {
    console.error('[DeviceProfiles] Failed to load:', error)
    return createDefaultDeviceProfiles()
  }
}

/**
 * Save device profiles to localStorage
 * SSR-safe - no-op on server
 */
function saveDeviceProfiles(profiles: DeviceProfiles): void {
  if (typeof window === 'undefined') return
  
  try {
    profiles.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles))
  } catch (error) {
    console.error('[DeviceProfiles] Failed to save:', error)
  }
}

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get all learner profiles
 */
export function getLearnerProfiles(): LearnerProfile[] {
  const profiles = loadDeviceProfiles()
  return profiles?.profiles || []
}

/**
 * Check if any learner profile exists on this device
 */
export function hasAnyLearnerProfile(): boolean {
  const profiles = loadDeviceProfiles()
  return (profiles?.profiles.length || 0) > 0
}

/**
 * Save a new learner profile
 */
export function saveLearnerProfile(profile: Omit<LearnerProfile, 'id' | 'createdAt' | 'lastActiveAt'>): LearnerProfile {
  const profiles = loadDeviceProfiles()
  if (!profiles) throw new Error('Cannot save profile on server')
  
  const newProfile: LearnerProfile = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    ...profile,
    settings: {
      owlTone: 'standard',
      showOwlCoach: true,
      ...profile.settings,
    },
  }
  
  profiles.profiles.push(newProfile)
  
  // Set as active if it's the first profile
  if (profiles.profiles.length === 1) {
    profiles.activeProfileId = newProfile.id
  }
  
  saveDeviceProfiles(profiles)
  return newProfile
}

/**
 * Update an existing profile
 */
export function updateLearnerProfile(id: string, updates: Partial<Omit<LearnerProfile, 'id' | 'createdAt'>>): LearnerProfile | null {
  const profiles = loadDeviceProfiles()
  if (!profiles) return null
  
  const profile = profiles.profiles.find(p => p.id === id)
  if (!profile) return null
  
  Object.assign(profile, updates, {
    lastActiveAt: new Date().toISOString(),
  })
  
  saveDeviceProfiles(profiles)
  return profile
}

/**
 * Delete a profile
 */
export function deleteLearnerProfile(id: string): boolean {
  const profiles = loadDeviceProfiles()
  if (!profiles) return false
  
  const index = profiles.profiles.findIndex(p => p.id === id)
  if (index === -1) return false
  
  profiles.profiles.splice(index, 1)
  
  // Clear active profile if it was deleted
  if (profiles.activeProfileId === id) {
    profiles.activeProfileId = profiles.profiles.length > 0 ? profiles.profiles[0].id : null
  }
  
  saveDeviceProfiles(profiles)
  return true
}

// ============================================================================
// ACTIVE PROFILE
// ============================================================================

/**
 * Get the active profile ID
 */
export function getActiveProfileId(): string | null {
  const profiles = loadDeviceProfiles()
  return profiles?.activeProfileId || null
}

/**
 * Set the active profile ID
 */
export function setActiveProfileId(id: string | null): boolean {
  const profiles = loadDeviceProfiles()
  if (!profiles) return false
  
  if (id !== null) {
    const profile = profiles.profiles.find(p => p.id === id)
    if (!profile) return false
    
    profile.lastActiveAt = new Date().toISOString()
  }
  
  profiles.activeProfileId = id
  saveDeviceProfiles(profiles)
  return true
}

/**
 * Get the active profile object
 */
export function getActiveProfile(): LearnerProfile | null {
  const profiles = loadDeviceProfiles()
  if (!profiles?.activeProfileId) return null
  
  return profiles.profiles.find(p => p.id === profiles.activeProfileId) || null
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Generate a simple unique ID (client-side only)
 */
function generateId(): string {
  return `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Migrate old device profiles to new version
 */
function migrateDeviceProfiles(old: any): DeviceProfiles {
  console.warn('[DeviceProfiles] Migrating old version:', old.version)
  
  const migrated = createDefaultDeviceProfiles()
  
  // Preserve what we can
  if (Array.isArray(old.profiles)) {
    migrated.profiles = old.profiles
  }
  if (old.activeProfileId) {
    migrated.activeProfileId = old.activeProfileId
  }
  
  return migrated
}

/**
 * Clear all device profiles (for testing or factory reset)
 */
export function clearAllDeviceProfiles(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('[DeviceProfiles] Failed to clear:', error)
  }
}

