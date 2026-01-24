type DebugConsentWindow = Window & {
  __debugConsent?: {
    get: typeof getConsent;
    save: typeof saveConsent;
    clear: typeof clearConsent;
    has: typeof hasConsent;
  };
};
/**
 * Consent Management Store
 * 
 * Handles storage and retrieval of user consent preferences.
 * Uses both cookies (preferred) and localStorage (fallback) for persistence.
 */

export type ConsentCategory = 'essential' | 'functional' | 'analytics';

export interface ConsentState {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  timestamp: number;
  version: string; // Policy version number
}

const CONSENT_COOKIE_NAME = 'nb_consent';
const CONSENT_STORAGE_KEY = 'nb_consent_prefs';
const CONSENT_VERSION = '1.0';
const CONSENT_EXPIRY_DAYS = 365;

/**
 * Default consent state (all optional categories off until user consents)
 */
export function getDefaultConsent(): ConsentState {
  return {
    essential: true, // Always on
    functional: false, // Off by default
    analytics: false, // Off by default
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
}

/**
 * Check if consent has been given (cookie or localStorage exists)
 */
export function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check cookie first
  const cookieConsent = readConsentFromCookie();
  if (cookieConsent) {
    console.log('[hasConsent] Found consent in cookie');
    return true;
  }
  
  // Fallback to localStorage
  const storageConsent = readConsentFromStorage();
  const result = storageConsent !== null;
  
  console.log('[hasConsent] Result:', { hasCookie: false, hasStorage: result, overall: result });
  
  return result;
}

/**
 * Get current consent state
 */
export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return getDefaultConsent();
  
  // Try cookie first
  const cookieConsent = readConsentFromCookie();
  if (cookieConsent) return cookieConsent;
  
  // Fallback to localStorage
  const storageConsent = readConsentFromStorage();
  if (storageConsent) return storageConsent;
  
  // No consent yet
  return getDefaultConsent();
}

/**
 * Save consent state (both cookie and localStorage)
 */
export function saveConsent(state: Omit<ConsentState, 'timestamp' | 'version'>): void {
  if (typeof window === 'undefined') return;
  
  const fullState: ConsentState = {
    ...state,
    essential: true, // Always true
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  
  // Save to cookie (preferred)
  writeConsentToCookie(fullState);
  
  // Save to localStorage (fallback)
  writeConsentToStorage(fullState);
  
  // Dispatch custom event so components can react
  window.dispatchEvent(new CustomEvent('consentchange', { detail: fullState }));
}

/**
 * Clear consent (for testing or user request)
 */
export function clearConsent(): void {
  if (typeof window === 'undefined') return;
  
  // Clear cookie
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
  
  // Clear localStorage
  localStorage.removeItem(CONSENT_STORAGE_KEY);
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('consentchange', { detail: getDefaultConsent() }));
}

// ============================================================================
// Internal Helper Functions
// ============================================================================

function readConsentFromCookie(): ConsentState | null {
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${CONSENT_COOKIE_NAME}=([^;]*)`));
    if (!match) return null;
    
    const decoded = decodeURIComponent(match[1]);
    const parsed = JSON.parse(decoded) as ConsentState;
    
    // Validate structure
    if (typeof parsed.essential !== 'boolean' || typeof parsed.timestamp !== 'number') {
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

function writeConsentToCookie(state: ConsentState): void {
  try {
    const encoded = encodeURIComponent(JSON.stringify(state));
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS);
    
    // Only add Secure flag if on HTTPS
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; Secure' : '';
    
    const cookieString = `${CONSENT_COOKIE_NAME}=${encoded}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Lax${secureFlag}`;
    document.cookie = cookieString;
    
    // Verify cookie was written (for debugging)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Consent] Cookie written:', { isHttps, secureFlag, success: document.cookie.includes(CONSENT_COOKIE_NAME) });
    }
  } catch (err) {
    console.error('[Consent] Failed to write to cookie:', err);
    // Cookie write failed, localStorage will be the fallback
  }
}

function readConsentFromStorage(): ConsentState | null {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    
    const parsed = JSON.parse(raw) as ConsentState;
    
    // Validate structure
    if (typeof parsed.essential !== 'boolean' || typeof parsed.timestamp !== 'number') {
      return null;
    }
    
    return parsed;
  } catch {
    return null;
  }
}

function writeConsentToStorage(state: ConsentState): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('[Consent] Failed to write to localStorage:', err);
  }
}

// ============================================================================
// Dev-only Debug Utilities
// ============================================================================

if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const debugWindow = window as DebugConsentWindow;
  debugWindow.__debugConsent = {
    get: getConsent,
    save: saveConsent,
    clear: clearConsent,
    has: hasConsent,
  };
  console.log('[Consent] Debug utilities available: window.__debugConsent');
}
