/**
 * Storage Tests
 *
 * Run with: npx tsx lib/user-preferences/storage.test.ts
 */

import { strict as assert } from 'assert';
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

let passed = 0;
let failed = 0;

function it(name: string, fn: () => void) {
  try {
    localStorageMock.clear();
    fn();
    passed++;
    // eslint-disable-next-line no-console
    console.log(`✓ ${name}`);
  } catch (err) {
    failed++;
    // eslint-disable-next-line no-console
    console.error(`✗ ${name}`);
    // eslint-disable-next-line no-console
    console.error(`  ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    clearStorage();
  }
}

function describe(name: string, fn: () => void) {
  // eslint-disable-next-line no-console
  console.log(`\n${name}`);
  fn();
}

describe('Storage', () => {
  it('should load default state when no stored data', () => {
    const state = loadUserPreferences();
    assert.equal(state.schemaVersion, DEFAULT_USER_PREFERENCES_STATE.schemaVersion);
    assert.deepEqual(state.preferences, DEFAULT_USER_PREFERENCES_STATE.preferences);
    assert.deepEqual(state.myPlan, DEFAULT_USER_PREFERENCES_STATE.myPlan);
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

    assert.equal(loaded.preferences.dyslexiaMode, true);
    assert.equal(loaded.preferences.readingLevel, 'simple');
  });

  it('should migrate legacy guestProfile key', () => {
    const legacyProfile = {
      regionPreference: 'uk',
      readingLevel: 'detailed',
      dyslexiaMode: true,
    };

    localStorageMock.setItem(LEGACY_KEYS.guestProfile, JSON.stringify(legacyProfile));

    const loaded = loadUserPreferences();

    assert.equal(loaded.preferences.regionPreference, 'uk');
    assert.equal(loaded.preferences.readingLevel, 'detailed');
    assert.equal(loaded.preferences.dyslexiaMode, true);

    // Legacy key should be archived and removed
    assert.equal(localStorageMock.getItem(LEGACY_KEYS.guestProfile), null);
    assert.ok(Boolean(localStorageMock.getItem(LEGACY_KEYS.guestProfile + '.archived')));
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

    assert.equal(loaded.myPlan.savedItems.length, 1);
    assert.equal(loaded.myPlan.savedItems[0].id, 'tool-1');
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

    assert.equal(imported.preferences.textSize, 'large');
    assert.equal(imported.preferences.contrast, 'high');
    assert.equal(imported.myPlan.savedItems.length, 1);
    assert.equal(imported.myPlan.savedItems[0].title, 'Test Guide');
  });

  it('should handle invalid import gracefully', () => {
    assert.throws(() => {
      importUserPreferences('invalid json');
    });

    assert.throws(() => {
      importUserPreferences('{"invalid": "structure"}');
    });
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

    assert.equal(reset.preferences.dyslexiaMode, false);
    assert.equal(reset.myPlan.savedItems.length, 0);
  });

  it('should preserve schemaVersion on load', () => {
    const state = loadUserPreferences();
    assert.equal(state.schemaVersion, 1);
  });
});

// eslint-disable-next-line no-console
console.log(`\nDone. Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exitCode = 1;
