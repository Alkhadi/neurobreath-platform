/**
 * Unified User Preferences Storage
 * 
 * Handles localStorage persistence with:
 * - Safe fallback to in-memory storage
 * - Versioned schema migrations
 * - Export/import with validation
 * - Debounced persistence
 */

import {
  UserPreferencesState,
  DEFAULT_USER_PREFERENCES_STATE,
  CURRENT_SCHEMA_VERSION,
  STORAGE_KEY,
  LEGACY_KEYS,
  GuestPreferences,
  MyPlanState,
} from './schema';

// In-memory fallback when localStorage unavailable
let memoryStorage: UserPreferencesState | null = null;

// Debounce timer
let persistenceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_MS = 500;

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const test = '__neurobreath_storage_test__';
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Load state from storage with migration support
 */
export function loadUserPreferences(): UserPreferencesState {
  if (!isLocalStorageAvailable()) {
    console.warn('[UserPreferences] localStorage unavailable, using memory fallback');
    return memoryStorage || DEFAULT_USER_PREFERENCES_STATE;
  }

  try {
    // Try loading unified state first
    const raw = window.localStorage.getItem(STORAGE_KEY);
    
    if (raw) {
      const parsed = JSON.parse(raw) as UserPreferencesState;
      
      // Validate and migrate if needed
      if (parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
        return migrateSchema(parsed);
      }
      
      return {
        ...parsed,
        updatedAt: new Date().toISOString(),
      };
    }

    // If no unified state, check for legacy keys and migrate
    return migrateLegacyKeys();
  } catch (error) {
    console.error('[UserPreferences] Failed to load state:', error);
    return DEFAULT_USER_PREFERENCES_STATE;
  }
}

/**
 * Migrate legacy guestProfile and myPlan keys to unified schema
 */
function migrateLegacyKeys(): UserPreferencesState {
  const newState: UserPreferencesState = {
    ...DEFAULT_USER_PREFERENCES_STATE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    // Migrate guest profile
    const guestProfileRaw = window.localStorage.getItem(LEGACY_KEYS.guestProfile);
    if (guestProfileRaw) {
      const legacy = JSON.parse(guestProfileRaw) as Partial<GuestPreferences>;
      newState.preferences = {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences,
        ...legacy,
      };
      console.info('[UserPreferences] Migrated legacy guest profile');
    }

    // Migrate my plan
    const myPlanRaw = window.localStorage.getItem(LEGACY_KEYS.myPlan);
    if (myPlanRaw) {
      const legacy = JSON.parse(myPlanRaw) as Partial<MyPlanState>;
      newState.myPlan = {
        ...DEFAULT_USER_PREFERENCES_STATE.myPlan,
        ...legacy,
      };
      console.info('[UserPreferences] Migrated legacy my plan');
    }

    // Save unified state
    if (guestProfileRaw || myPlanRaw) {
      saveUserPreferences(newState);
      
      // Archive legacy keys (keep for safety, can be removed later)
      window.localStorage.setItem(
        LEGACY_KEYS.guestProfile + '.archived',
        guestProfileRaw || ''
      );
      window.localStorage.setItem(
        LEGACY_KEYS.myPlan + '.archived',
        myPlanRaw || ''
      );
      
      // Remove legacy keys
      window.localStorage.removeItem(LEGACY_KEYS.guestProfile);
      window.localStorage.removeItem(LEGACY_KEYS.myPlan);
    }
  } catch (error) {
    console.error('[UserPreferences] Legacy migration failed:', error);
  }

  return newState;
}

/**
 * Migrate schema versions (future-proofing)
 */
function migrateSchema(oldState: UserPreferencesState): UserPreferencesState {
  let state = { ...oldState };

  // Example migration from v0 to v1 (if needed in future)
  if (state.schemaVersion < 1) {
    // Add any new fields with defaults
    state = {
      ...DEFAULT_USER_PREFERENCES_STATE,
      ...state,
      schemaVersion: 1,
    };
  }

  state.updatedAt = new Date().toISOString();
  
  // Save migrated state
  saveUserPreferences(state);
  
  return state;
}

/**
 * Save state to storage (debounced)
 */
export function saveUserPreferences(state: UserPreferencesState): void {
  // Update timestamp
  const stateToSave = {
    ...state,
    updatedAt: new Date().toISOString(),
  };

  if (!isLocalStorageAvailable()) {
    memoryStorage = stateToSave;
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('[UserPreferences] Failed to save:', error);
    memoryStorage = stateToSave;
  }
}

/**
 * Debounced save (use for frequent updates)
 */
export function saveUserPreferencesDebounced(state: UserPreferencesState): void {
  if (persistenceTimer) {
    clearTimeout(persistenceTimer);
  }

  persistenceTimer = setTimeout(() => {
    saveUserPreferences(state);
    persistenceTimer = null;
  }, DEBOUNCE_MS);
}

/**
 * Export preferences as JSON string
 */
export function exportUserPreferences(state: UserPreferencesState): string {
  return JSON.stringify(state, null, 2);
}

/**
 * Import and validate preferences from JSON string
 */
export function importUserPreferences(json: string): UserPreferencesState {
  try {
    const parsed = JSON.parse(json) as Partial<UserPreferencesState>;

    // Validate required fields
    if (!parsed.preferences || !parsed.myPlan) {
      throw new Error('Invalid preferences format: missing required fields');
    }

    // Merge with defaults to ensure all fields present
    const imported: UserPreferencesState = {
      schemaVersion: parsed.schemaVersion || CURRENT_SCHEMA_VERSION,
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences,
        ...parsed.preferences,
      },
      myPlan: {
        ...DEFAULT_USER_PREFERENCES_STATE.myPlan,
        ...parsed.myPlan,
      },
    };

    // Migrate if needed
    if (imported.schemaVersion < CURRENT_SCHEMA_VERSION) {
      return migrateSchema(imported);
    }

    return imported;
  } catch (error) {
    console.error('[UserPreferences] Import failed:', error);
    throw new Error('Failed to import preferences: invalid format');
  }
}

/**
 * Reset to defaults
 */
export function resetUserPreferences(): UserPreferencesState {
  const freshState: UserPreferencesState = {
    ...DEFAULT_USER_PREFERENCES_STATE,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveUserPreferences(freshState);
  return freshState;
}

/**
 * Clear all storage (for testing/debugging)
 */
export function clearStorage(): void {
  if (!isLocalStorageAvailable()) {
    memoryStorage = null;
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_KEYS.guestProfile);
  window.localStorage.removeItem(LEGACY_KEYS.myPlan);
  window.localStorage.removeItem(LEGACY_KEYS.guestProfile + '.archived');
  window.localStorage.removeItem(LEGACY_KEYS.myPlan + '.archived');
}
