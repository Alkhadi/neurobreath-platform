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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeLoadedState(raw: unknown): UserPreferencesState {
  const nowIso = new Date().toISOString();

  if (!isPlainObject(raw)) {
    return {
      ...DEFAULT_USER_PREFERENCES_STATE,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
  }

  const schemaVersion =
    typeof raw.schemaVersion === 'number' && Number.isFinite(raw.schemaVersion)
      ? raw.schemaVersion
      : 0;

  const rawPreferences = isPlainObject(raw.preferences) ? raw.preferences : {};
  const rawTts = isPlainObject(rawPreferences.tts) ? rawPreferences.tts : {};

  const rawMyPlan = isPlainObject(raw.myPlan) ? raw.myPlan : {};
  const rawRoutinePlan = isPlainObject(rawMyPlan.routinePlan) ? rawMyPlan.routinePlan : {};

  return {
    schemaVersion,
    createdAt: typeof raw.createdAt === 'string' ? raw.createdAt : nowIso,
    updatedAt: nowIso,
    preferences: {
      ...DEFAULT_USER_PREFERENCES_STATE.preferences,
      ...rawPreferences,
      tts: {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences.tts,
        ...rawTts,
      },
    },
    myPlan: {
      ...DEFAULT_USER_PREFERENCES_STATE.myPlan,
      ...rawMyPlan,
      savedItems: Array.isArray(rawMyPlan.savedItems)
        ? (rawMyPlan.savedItems as UserPreferencesState['myPlan']['savedItems'])
        : DEFAULT_USER_PREFERENCES_STATE.myPlan.savedItems,
      journeyProgress: isPlainObject(rawMyPlan.journeyProgress)
        ? (rawMyPlan.journeyProgress as UserPreferencesState['myPlan']['journeyProgress'])
        : DEFAULT_USER_PREFERENCES_STATE.myPlan.journeyProgress,
      routinePlan: {
        ...DEFAULT_USER_PREFERENCES_STATE.myPlan.routinePlan,
        ...rawRoutinePlan,
        slots: Array.isArray(rawRoutinePlan.slots)
          ? (rawRoutinePlan.slots as UserPreferencesState['myPlan']['routinePlan']['slots'])
          : DEFAULT_USER_PREFERENCES_STATE.myPlan.routinePlan.slots,
      },
    },
  };
}

function getLocalStorage(): Storage | null {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  const maybeGlobal = globalThis as unknown as { localStorage?: Storage };
  if (maybeGlobal?.localStorage) return maybeGlobal.localStorage;
  return null;
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  const storage = getLocalStorage();
  if (!storage) return false;
  
  try {
    const test = '__neurobreath_storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
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

  const storage = getLocalStorage();
  if (!storage) {
    console.warn('[UserPreferences] localStorage unavailable, using memory fallback');
    return memoryStorage || DEFAULT_USER_PREFERENCES_STATE;
  }

  try {
    // Try loading unified state first
    const raw = storage.getItem(STORAGE_KEY);
    
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      const normalized = normalizeLoadedState(parsed);

      // Validate and migrate if needed
      if (normalized.schemaVersion < CURRENT_SCHEMA_VERSION) {
        return migrateSchema(normalized);
      }

      return normalized;
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

  const storage = getLocalStorage();
  if (!storage) return newState;

  try {
    // Migrate guest profile
    const guestProfileRaw = storage.getItem(LEGACY_KEYS.guestProfile);
    if (guestProfileRaw) {
      const legacy = JSON.parse(guestProfileRaw) as Partial<GuestPreferences>;
      newState.preferences = {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences,
        ...legacy,
      };
      console.info('[UserPreferences] Migrated legacy guest profile');
    }

    // Migrate my plan
    const myPlanRaw = storage.getItem(LEGACY_KEYS.myPlan);
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
      storage.setItem(
        LEGACY_KEYS.guestProfile + '.archived',
        guestProfileRaw || ''
      );
      storage.setItem(
        LEGACY_KEYS.myPlan + '.archived',
        myPlanRaw || ''
      );
      
      // Remove legacy keys
      storage.removeItem(LEGACY_KEYS.guestProfile);
      storage.removeItem(LEGACY_KEYS.myPlan);
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

  const storage = getLocalStorage();
  if (!storage) {
    memoryStorage = stateToSave;
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
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

  const storage = getLocalStorage();
  if (!storage) {
    memoryStorage = null;
    return;
  }

  storage.removeItem(STORAGE_KEY);
  storage.removeItem(LEGACY_KEYS.guestProfile);
  storage.removeItem(LEGACY_KEYS.myPlan);
  storage.removeItem(LEGACY_KEYS.guestProfile + '.archived');
  storage.removeItem(LEGACY_KEYS.myPlan + '.archived');
}
