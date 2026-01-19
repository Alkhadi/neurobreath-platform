/**
 * Unified AI Core - User Preferences
 * 
 * Single source of truth for user preferences across Buddy, Coach, Blog, and all AI features.
 * Handles localStorage persistence with versioning and migration.
 */

export interface TTSPreferences {
  enabled: boolean;
  autoSpeak: boolean;
  rate: number; // 0.5 to 2.0
  pitch: number; // 0.5 to 2.0
  volume: number; // 0.0 to 1.0
  voice: string | null; // Voice URI or null for default
  preferredLanguage: string; // e.g., 'en-GB', 'en-US'
}

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  dyslexiaFont: boolean;
}

export interface RegionalPreferences {
  jurisdiction: 'UK' | 'US' | 'EU';
  language: string; // ISO 639-1 code
  timezone: string; // IANA timezone
}

export interface AIPreferences {
  verbosity: 'concise' | 'balanced' | 'detailed';
  citationStyle: 'inline' | 'footnote' | 'section';
  showEvidence: boolean;
  role?: 'parent' | 'teacher' | 'carer' | 'individual' | 'professional';
}

export interface UserPreferences {
  version: string; // Semver for migration
  tts: TTSPreferences;
  accessibility: AccessibilityPreferences;
  regional: RegionalPreferences;
  ai: AIPreferences;
  lastUpdated: string; // ISO timestamp
}

const PREFERENCES_KEY = 'neurobreath.userprefs.v1';
const CURRENT_VERSION = '1.0.0';

/**
 * Default preferences (UK-first, accessible defaults)
 */
export const DEFAULT_PREFERENCES: UserPreferences = {
  version: CURRENT_VERSION,
  tts: {
    enabled: true,
    autoSpeak: false,
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8,
    voice: null,
    preferredLanguage: 'en-GB',
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    dyslexiaFont: false,
  },
  regional: {
    jurisdiction: 'UK',
    language: 'en',
    timezone: 'Europe/London',
  },
  ai: {
    verbosity: 'balanced',
    citationStyle: 'inline',
    showEvidence: true,
  },
  lastUpdated: new Date().toISOString(),
};

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }

  try {
    const stored = window.localStorage.getItem(PREFERENCES_KEY);
    if (!stored) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(stored) as UserPreferences;

    // Version check and migration
    if (parsed.version !== CURRENT_VERSION) {
      return migratePreferences(parsed);
    }

    // Validate structure
    if (!validatePreferences(parsed)) {
      console.warn('[Preferences] Invalid structure, using defaults');
      return DEFAULT_PREFERENCES;
    }

    return parsed;
  } catch (error) {
    console.error('[Preferences] Failed to load:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save preferences to localStorage
 */
export function savePreferences(preferences: UserPreferences): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const toSave = {
      ...preferences,
      version: CURRENT_VERSION,
      lastUpdated: new Date().toISOString(),
    };

    window.localStorage.setItem(PREFERENCES_KEY, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error('[Preferences] Failed to save:', error);
    return false;
  }
}

/**
 * Update specific preference section
 */
export function updatePreferences<K extends keyof Omit<UserPreferences, 'version' | 'lastUpdated'>>(
  section: K,
  updates: Partial<UserPreferences[K]>
): UserPreferences {
  const current = loadPreferences();
  const updated = {
    ...current,
    [section]: {
      ...current[section],
      ...updates,
    },
  };
  savePreferences(updated);
  return updated;
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences(): UserPreferences {
  const defaults = { ...DEFAULT_PREFERENCES };
  savePreferences(defaults);
  return defaults;
}

/**
 * Validate preferences structure
 */
function validatePreferences(prefs: unknown): prefs is UserPreferences {
  if (typeof prefs !== 'object' || prefs === null) {
    return false;
  }

  const p = prefs as Partial<UserPreferences>;

  return !!(
    p.version &&
    p.tts &&
    typeof p.tts.enabled === 'boolean' &&
    p.accessibility &&
    p.regional &&
    p.ai
  );
}

/**
 * Migrate preferences from older versions
 */
function migratePreferences(old: Partial<UserPreferences>): UserPreferences {
  console.log(`[Preferences] Migrating from ${old.version || 'unknown'} to ${CURRENT_VERSION}`);

  // Start with defaults
  const migrated = { ...DEFAULT_PREFERENCES };

  // Preserve what we can from old version
  if (old.tts) {
    migrated.tts = { ...migrated.tts, ...old.tts };
  }
  if (old.accessibility) {
    migrated.accessibility = { ...migrated.accessibility, ...old.accessibility };
  }
  if (old.regional) {
    migrated.regional = { ...migrated.regional, ...old.regional };
  }
  if (old.ai) {
    migrated.ai = { ...migrated.ai, ...old.ai };
  }

  // Save migrated version
  savePreferences(migrated);
  return migrated;
}

/**
 * Export preferences as JSON (for backup/download)
 */
export function exportPreferences(): string {
  const prefs = loadPreferences();
  return JSON.stringify(prefs, null, 2);
}

/**
 * Import preferences from JSON
 */
export function importPreferences(json: string): UserPreferences | null {
  try {
    const imported = JSON.parse(json) as UserPreferences;
    if (!validatePreferences(imported)) {
      throw new Error('Invalid preferences structure');
    }
    savePreferences(imported);
    return imported;
  } catch (error) {
    console.error('[Preferences] Failed to import:', error);
    return null;
  }
}

/**
 * React hook for preferences (optional, can be created separately)
 */
export function createPreferencesHook() {
  // This would be implemented in a separate hooks file
  // For now, just export the core functions
  return {
    loadPreferences,
    savePreferences,
    updatePreferences,
    resetPreferences,
  };
}

/**
 * Get TTS voice list (browser-specific)
 */
export function getAvailableTTSVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }

  return window.speechSynthesis.getVoices();
}

/**
 * Get preferred TTS voice
 */
export function getPreferredTTSVoice(): SpeechSynthesisVoice | null {
  const prefs = loadPreferences();
  const voices = getAvailableTTSVoices();

  if (prefs.tts.voice) {
    const preferred = voices.find((v) => v.voiceURI === prefs.tts.voice);
    if (preferred) return preferred;
  }

  // Fallback: find voice matching preferred language
  const langMatch = voices.find((v) => v.lang.startsWith(prefs.tts.preferredLanguage));
  if (langMatch) return langMatch;

  // Fallback: default voice
  return voices[0] || null;
}
