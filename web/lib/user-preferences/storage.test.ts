/**
 * Storage Tests
 * 
 * Tests for unified storage layer including migrations.
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import {
  loadUserPreferences,
  saveUserPreferences,
  exportUserPreferences,
  importUserPreferences,
  resetUserPreferences,
  clearStorage,
} from './storage';
import {
  DEFAULT_USER_PREFERENCES_STATE,
  LEGACY_KEYS,
  type UserPreferencesState,
} from './schema';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Storage', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    clearStorage();
  });

  it('should load default state when no stored data', () => {
    const state = loadUserPreferences();
    expect(state.schemaVersion).toBe(DEFAULT_USER_PREFERENCES_STATE.schemaVersion);
    expect(state.preferences).toEqual(DEFAULT_USER_PREFERENCES_STATE.preferences);
    expect(state.myPlan).toEqual(DEFAULT_USER_PREFERENCES_STATE.myPlan);
  });

  it('should save and load state correctly', () => {
    const customState: UserPreferencesState = {
      ...DEFAULT_USER_PREFERENCES_STATE,
      preferences: {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences,
        dyslexiaMode: true,
        readingLevel: 'simple',
      },
    };

    saveUserPreferences(customState);
    const loaded = loadUserPreferences();

    expect(loaded.preferences.dyslexiaMode).toBe(true);
    expect(loaded.preferences.readingLevel).toBe('simple');
  });

  it('should migrate legacy guestProfile key', () => {
    const legacyProfile = {
      regionPreference: 'uk',
      readingLevel: 'detailed',
      dyslexiaMode: true,
    };

    localStorageMock.setItem(LEGACY_KEYS.guestProfile, JSON.stringify(legacyProfile));

    const loaded = loadUserPreferences();

    expect(loaded.preferences.regionPreference).toBe('uk');
    expect(loaded.preferences.readingLevel).toBe('detailed');
    expect(loaded.preferences.dyslexiaMode).toBe(true);

    // Legacy key should be archived and removed
    expect(localStorageMock.getItem(LEGACY_KEYS.guestProfile)).toBeNull();
    expect(localStorageMock.getItem(LEGACY_KEYS.guestProfile + '.archived')).toBeTruthy();
  });

  it('should migrate legacy myPlan key', () => {
    const legacyPlan = {
      savedItems: [
        {
          id: 'tool-1',
          type: 'tool',
          title: 'Box Breathing',
          href: '/uk/tools/breathing/box-breathing',
          tags: ['breathing'],
          region: 'uk',
          savedAt: '2026-01-01T00:00:00.000Z',
        },
      ],
      journeyProgress: {},
      routinePlan: { slots: [] },
    };

    localStorageMock.setItem(LEGACY_KEYS.myPlan, JSON.stringify(legacyPlan));

    const loaded = loadUserPreferences();

    expect(loaded.myPlan.savedItems).toHaveLength(1);
    expect(loaded.myPlan.savedItems[0].id).toBe('tool-1');
  });

  it('should export and import correctly', () => {
    const original: UserPreferencesState = {
      ...DEFAULT_USER_PREFERENCES_STATE,
      preferences: {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences,
        textSize: 'large',
        contrast: 'high',
      },
      myPlan: {
        ...DEFAULT_USER_PREFERENCES_STATE.myPlan,
        savedItems: [
          {
            id: 'guide-1',
            type: 'guide',
            title: 'Test Guide',
            href: '/uk/guides/test',
            tags: ['test'],
            region: 'uk',
            savedAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
    };

    const exported = exportUserPreferences(original);
    const imported = importUserPreferences(exported);

    expect(imported.preferences.textSize).toBe('large');
    expect(imported.preferences.contrast).toBe('high');
    expect(imported.myPlan.savedItems).toHaveLength(1);
    expect(imported.myPlan.savedItems[0].title).toBe('Test Guide');
  });

  it('should handle invalid import gracefully', () => {
    expect(() => {
      importUserPreferences('invalid json');
    }).toThrow();

    expect(() => {
      importUserPreferences('{"invalid": "structure"}');
    }).toThrow();
  });

  it('should reset to defaults', () => {
    // Save custom state
    const customState: UserPreferencesState = {
      ...DEFAULT_USER_PREFERENCES_STATE,
      preferences: {
        ...DEFAULT_USER_PREFERENCES_STATE.preferences,
        dyslexiaMode: true,
      },
    };
    saveUserPreferences(customState);

    // Reset
    const reset = resetUserPreferences();

    expect(reset.preferences.dyslexiaMode).toBe(false);
    expect(reset.myPlan.savedItems).toHaveLength(0);
  });

  it('should preserve schemaVersion on load', () => {
    const state = loadUserPreferences();
    expect(state.schemaVersion).toBe(1);
  });
});
