/**
 * Device PIN Store (v1)
 * 
 * SAFER INDUSTRY APPROACH: RESET-ONLY PIN (NEVER REVEAL)
 * 
 * Security features:
 * - PIN stored as PBKDF2 hash (never plaintext)
 * - Recovery identifier stored as PBKDF2 hash (never plaintext)
 * - Optional masked hint for recovery identifier
 * - Cannot retrieve PIN, only verify or reset
 * 
 * Storage Key: nb:devicePin:v1
 */

// ============================================================================
// TYPES
// ============================================================================

export interface DevicePinStore {
  version: number
  pinHash: string | null
  pinSalt: string | null
  recoveryHash: string | null
  recoverySalt: string | null
  recoveryHint: string | null // e.g., "Em***@g***l.com"
  createdAt: string
  lastUpdated: string
}

// ============================================================================
// CONSTANTS
// ============================================================================

const STORAGE_KEY = 'nb:devicePin:v1'
const CURRENT_VERSION = 1
const PBKDF2_ITERATIONS = 10000

// ============================================================================
// DEFAULT STATE
// ============================================================================

function createDefaultPinStore(): DevicePinStore {
  return {
    version: CURRENT_VERSION,
    pinHash: null,
    pinSalt: null,
    recoveryHash: null,
    recoverySalt: null,
    recoveryHint: null,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  }
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Load PIN store from localStorage
 * SSR-safe - returns null on server
 */
function loadPinStore(): DevicePinStore | null {
  if (typeof window === 'undefined') return null
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultPinStore()
    
    const parsed = JSON.parse(raw) as DevicePinStore
    
    // Version migration if needed
    if (parsed.version !== CURRENT_VERSION) {
      return migratePinStore(parsed)
    }
    
    return parsed
  } catch (error) {
    console.error('[DevicePin] Failed to load:', error)
    return createDefaultPinStore()
  }
}

/**
 * Save PIN store to localStorage
 * SSR-safe - no-op on server
 */
function savePinStore(store: DevicePinStore): void {
  if (typeof window === 'undefined') return
  
  try {
    store.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch (error) {
    console.error('[DevicePin] Failed to save:', error)
  }
}

// ============================================================================
// CRYPTOGRAPHIC UTILITIES
// ============================================================================

/**
 * Generate a random salt (hex string)
 */
function generateSalt(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Hash a value using PBKDF2 (browser-native Web Crypto API)
 */
async function hashValue(value: string, salt: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(value)
  const saltData = encoder.encode(salt)
  
  // Import the value as a key
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  )
  
  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltData,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256
  )
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(derivedBits))
  return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Create a masked hint from an identifier
 * e.g., "john@example.com" → "j***@e***.com"
 */
function createHint(identifier: string): string {
  if (identifier.includes('@')) {
    // Email format
    const [local, domain] = identifier.split('@')
    const maskedLocal = local[0] + '***'
    const domainParts = domain.split('.')
    const maskedDomain = domainParts.map(part => part[0] + '***').join('.')
    return `${maskedLocal}@${maskedDomain}`
  } else {
    // Name format
    return identifier[0] + '***'
  }
}

// ============================================================================
// PIN OPERATIONS
// ============================================================================

/**
 * Check if a PIN is set
 */
export function isPinSet(): boolean {
  const store = loadPinStore()
  return !!(store?.pinHash && store?.pinSalt)
}

/**
 * Set a new PIN with recovery identifier
 */
export async function setPin(pin: string, recoveryIdentifier: string): Promise<boolean> {
  const store = loadPinStore()
  if (!store) return false
  
  try {
    // Generate salts
    const pinSalt = generateSalt()
    const recoverySalt = generateSalt()
    
    // Hash values
    const pinHash = await hashValue(pin, pinSalt)
    const recoveryHash = await hashValue(recoveryIdentifier.toLowerCase().trim(), recoverySalt)
    
    // Create hint
    const recoveryHint = createHint(recoveryIdentifier)
    
    // Update store
    store.pinHash = pinHash
    store.pinSalt = pinSalt
    store.recoveryHash = recoveryHash
    store.recoverySalt = recoverySalt
    store.recoveryHint = recoveryHint
    
    savePinStore(store)
    return true
  } catch (error) {
    console.error('[DevicePin] Failed to set PIN:', error)
    return false
  }
}

/**
 * Verify a PIN
 */
export async function verifyPin(pin: string): Promise<boolean> {
  const store = loadPinStore()
  if (!store?.pinHash || !store?.pinSalt) return false
  
  try {
    const hash = await hashValue(pin, store.pinSalt)
    return hash === store.pinHash
  } catch (error) {
    console.error('[DevicePin] Failed to verify PIN:', error)
    return false
  }
}

/**
 * Verify recovery identifier
 */
export async function verifyRecoveryIdentifier(identifier: string): Promise<boolean> {
  const store = loadPinStore()
  if (!store?.recoveryHash || !store?.recoverySalt) return false
  
  try {
    const hash = await hashValue(identifier.toLowerCase().trim(), store.recoverySalt)
    return hash === store.recoveryHash
  } catch (error) {
    console.error('[DevicePin] Failed to verify recovery identifier:', error)
    return false
  }
}

/**
 * Get recovery hint (masked identifier)
 */
export function getRecoveryHint(): string | null {
  const store = loadPinStore()
  return store?.recoveryHint || null
}

/**
 * Change PIN (requires current PIN)
 */
export async function changePin(currentPin: string, newPin: string): Promise<boolean> {
  const store = loadPinStore()
  if (!store) return false
  
  // Verify current PIN
  const isValid = await verifyPin(currentPin)
  if (!isValid) return false
  
  try {
    // Generate new salt and hash
    const pinSalt = generateSalt()
    const pinHash = await hashValue(newPin, pinSalt)
    
    // Update store (keep recovery credentials)
    store.pinHash = pinHash
    store.pinSalt = pinSalt
    
    savePinStore(store)
    return true
  } catch (error) {
    console.error('[DevicePin] Failed to change PIN:', error)
    return false
  }
}

/**
 * Reset PIN with recovery identifier (NEVER REVEALS OLD PIN)
 */
export async function resetPinWithRecovery(recoveryIdentifier: string, newPin: string): Promise<boolean> {
  const store = loadPinStore()
  if (!store) return false
  
  // Verify recovery identifier
  const isValid = await verifyRecoveryIdentifier(recoveryIdentifier)
  if (!isValid) return false
  
  try {
    // Generate new salt and hash
    const pinSalt = generateSalt()
    const pinHash = await hashValue(newPin, pinSalt)
    
    // Update store (keep recovery credentials)
    store.pinHash = pinHash
    store.pinSalt = pinSalt
    
    savePinStore(store)
    return true
  } catch (error) {
    console.error('[DevicePin] Failed to reset PIN:', error)
    return false
  }
}

/**
 * Clear PIN (factory reset - requires confirmation)
 */
export function clearPin(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('[DevicePin] Failed to clear:', error)
  }
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Migrate old PIN store to new version
 */
function migratePinStore(old: unknown): DevicePinStore {
  const version = (old && typeof old === 'object') ? (old as Record<string, unknown>).version : undefined
  console.warn('[DevicePin] Migrating old version:', version)
  
  const migrated = createDefaultPinStore()
  
  // Preserve what we can (but reset if hashing algorithm changed)
  const record = (old && typeof old === 'object') ? (old as Record<string, unknown>) : null
  if (!record) return migrated

  const pinHash = record.pinHash
  const pinSalt = record.pinSalt
  const recoveryHash = record.recoveryHash
  const recoverySalt = record.recoverySalt
  const recoveryHint = record.recoveryHint

  if (typeof pinHash === 'string' && pinHash) migrated.pinHash = pinHash
  if (typeof pinSalt === 'string' && pinSalt) migrated.pinSalt = pinSalt
  if (typeof recoveryHash === 'string' && recoveryHash) migrated.recoveryHash = recoveryHash
  if (typeof recoverySalt === 'string' && recoverySalt) migrated.recoverySalt = recoverySalt
  if (typeof recoveryHint === 'string' && recoveryHint) migrated.recoveryHint = recoveryHint
  
  return migrated
}

