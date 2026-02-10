# User Preferences Architecture

**Phase 1: Core Foundation** ✅ Complete

This document describes the unified User Preferences architecture combining Guest Profile (preferences, accessibility) and My Plan (saved items, progress tracking) into a single, privacy-first system.

---

## Overview

The User Preferences system provides:
- **Guest Profile**: Locale, reading level, accessibility settings (dyslexia mode, reduced motion, text size, contrast), TTS settings
- **My Plan**: Saved tools/guides/journeys, journey progress tracking, routine planner, notes
- **Local-first storage**: No account required, localStorage with memory fallback
- **Versioned schema**: Safe migrations for future updates
- **Privacy-first**: Zero sensitive health/diagnostic data stored

---

## Architecture

### Core Components

```
web/lib/user-preferences/
├── schema.ts               # TypeScript types and defaults
├── storage.ts              # Storage engine with migrations
├── useUserPreferences.ts   # Main context hook
├── useGuestPreferences.ts  # Guest profile actions
├── useTTSPreferences.ts    # TTS settings actions
└── useMyPlanActions.ts     # My Plan actions

web/lib/tts/
├── engine.ts               # TTS runtime (Web Speech API)
└── sanitize.ts             # Text sanitizer for clean speech

web/components/user-preferences/
└── UserPreferencesProvider.tsx  # Provider applying preferences

web/lib/user-preferences/
├── storage.test.ts         # Storage + migration tests
└── ../tts/sanitize.test.ts # Sanitizer tests
```

---

## Schema

### UserPreferencesState

```typescript
{
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  preferences: GuestPreferences;
  myPlan: MyPlanState;
}
```

### GuestPreferences

```typescript
{
  regionPreference: 'uk' | 'us' | 'auto';
  readingLevel: 'simple' | 'standard' | 'detailed';
  dyslexiaMode: boolean;
  reducedMotion: 'system' | 'on' | 'off';
  textSize: 'system' | 'large' | 'xlarge';
  contrast: 'system' | 'high' | 'normal';
  tts: TTSSettings;
}
```

### MyPlanState

```typescript
{
  savedItems: SavedItem[];
  journeyProgress: Record<string, JourneyProgress>;
  routinePlan: RoutinePlan;
}
```

**SavedItem** = tools, guides, conditions, journeys, printables with ID, title, href, tags, region, note

**JourneyProgress** = tracking current step, completion status, timestamps

**RoutinePlan** = slots assigned to day/time with item references

---

## Storage

### Key: `neurobreath.userprefs.v1`

### Migration Strategy

**Phase 1 (Complete)**: Migrate legacy keys if found:
- `neurobreath.guestProfile.v1` → `preferences`
- `neurobreath.myplan.v1` → `myPlan`

Legacy keys are archived (`.archived` suffix) then removed.

**Future**: Schema version bumps trigger `migrateSchema()` function.

### Export/Import

```typescript
// Export (JSON string)
const json = exportUserPreferences(state);

// Import with validation
const imported = importUserPreferences(json);
```

### Debounced Persistence

Frequent updates use `saveUserPreferencesDebounced()` with 500ms debounce to avoid excessive writes.

---

## Provider

### UserPreferencesProvider

**Responsibilities:**
1. Load state on mount
2. Provide context to all children
3. Apply accessibility preferences via data attributes on `<html>`

**Data attributes applied:**
- `data-dyslexia="on"` when dyslexia mode enabled
- `data-reading-level="simple|standard|detailed"`
- `data-text-size="large|xlarge"` (if not system)
- `data-contrast="high"` (if not system)
- `data-reduced-motion="on|off"` (if not system)

**No inline CSS**. Global styles in `globals.css` use these attributes.

### Usage

Wrap app with provider (typically in root layout):

```tsx
import { UserPreferencesProvider } from '@/components/user-preferences/UserPreferencesProvider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UserPreferencesProvider>
          {children}
        </UserPreferencesProvider>
      </body>
    </html>
  );
}
```

---

## Hooks

### Main Hook

```typescript
import { useUserPreferences } from '@/lib/user-preferences/useUserPreferences';

const { state, updateState, exportPreferences, importPreferences, resetPreferences } = useUserPreferences();
```

### Composable Hooks (Recommended)

**Guest Preferences:**
```typescript
import { useGuestPreferences } from '@/lib/user-preferences/useGuestPreferences';

const {
  preferences,
  setRegionPreference,
  setReadingLevel,
  setDyslexiaMode,
  setReducedMotion,
  setTextSize,
  setContrast,
} = useGuestPreferences();
```

**TTS Preferences:**
```typescript
import { useTTSPreferences } from '@/lib/user-preferences/useTTSPreferences';

const {
  ttsSettings,
  setTTSEnabled,
  setAutoSpeak,
  setRate,
  setVoice,
  setFilterNonAlphanumeric,
} = useTTSPreferences();
```

**My Plan Actions:**
```typescript
import { useMyPlanActions } from '@/lib/user-preferences/useMyPlanActions';

const {
  myPlan,
  addSavedItem,
  removeSavedItem,
  isSaved,
  setJourneyProgress,
  getJourneyProgress,
  addRoutineSlot,
} = useMyPlanActions();
```

---

## TTS Engine

### Unified Engine

```typescript
import { speak, stop, isTTSAvailable } from '@/lib/tts/engine';
import { useTTSPreferences } from '@/lib/user-preferences/useTTSPreferences';

const { ttsSettings } = useTTSPreferences();

// Speak
speak('Hello world', {
  settings: ttsSettings,
  onStart: () => console.log('Speaking...'),
  onEnd: () => console.log('Done'),
});

// Stop immediately
stop();
```

### Text Sanitization

When `filterNonAlphanumeric` is enabled:
- Removes emojis (all Unicode emoji ranges)
- Removes decorative symbols (bullets, arrows, stars)
- Keeps letters, numbers, basic punctuation
- Normalizes whitespace and excessive punctuation

**Example:**
```typescript
import { sanitizeForTTS } from '@/lib/tts/sanitize';

const dirty = 'Hello 👋 world ★★★ $50!';
const clean = sanitizeForTTS(dirty, { filterNonAlphanumeric: true });
// Output: "Hello world 50!"
```

---

## Privacy Statement

**What is stored:**
- UI preferences (locale, reading level, accessibility settings)
- TTS settings (voice, rate, filtering)
- Saved items (tools, guides, journeys - no medical content)
- Journey progress (step tracking - educational only)
- Routine plans (time slots with item references)
- Optional notes (user-entered text)

**What is NOT stored:**
- Sensitive health information
- Diagnostic data
- Medical advice or treatment details
- Personal identifiable information (PII)
- Account credentials (no accounts exist)

**Storage location:**
- Browser localStorage only
- No server transmission
- No analytics tracking of preferences
- User can export/import/reset anytime

---

## Adding New Preferences

### 1. Update Schema

Add field to `GuestPreferences` or `MyPlanState` in `schema.ts`:

```typescript
export interface GuestPreferences {
  // ... existing fields
  newFeature: boolean; // Add new field
}

export const DEFAULT_GUEST_PREFERENCES: GuestPreferences = {
  // ... existing defaults
  newFeature: false,
};
```

### 2. Update Storage Migration (if needed)

If adding in a new schema version:

```typescript
// In storage.ts
function migrateSchema(oldState: UserPreferencesState): UserPreferencesState {
  if (oldState.schemaVersion < 2) {
    return {
      ...oldState,
      preferences: {
        ...oldState.preferences,
        newFeature: false, // Add default
      },
      schemaVersion: 2,
    };
  }
  return oldState;
}
```

### 3. Add Hook Action

In `useGuestPreferences.ts` (or appropriate hook):

```typescript
const setNewFeature = (enabled: boolean) => {
  updateState({
    preferences: {
      ...state.preferences,
      newFeature: enabled,
    },
  });
};

return {
  // ... existing returns
  setNewFeature,
};
```

### 4. Apply to DOM (if visual)

In `UserPreferencesProvider.tsx`:

```typescript
// Apply preferences to DOM
useEffect(() => {
  if (state.preferences.newFeature) {
    html.setAttribute('data-new-feature', 'on');
  } else {
    html.removeAttribute('data-new-feature');
  }
}, [state.preferences.newFeature]);
```

### 5. Add CSS (if visual)

In `globals.css`:

```css
[data-new-feature="on"] {
  /* Styles when feature enabled */
}
```

---

## Phase 2 & 3 Extension Points

**Phase 2: UI Pages** (Next)
- `/app/[region]/settings/page.tsx` - Settings controls
- `/app/[region]/my-plan/page.tsx` - My Plan dashboard
- `AddToMyPlanButton.tsx` - Reusable save button

**Phase 3: Site Integration** (Later)
- Journey pages: Save/Continue/Mark Done buttons
- Tool/Guide pages: "Add to My Plan" CTAs
- NeuroBreath Buddy: Use unified TTS engine
- Locale preference banner: Safe region switching
- Reading level system: ReadingLevelBlock component

---

## Testing

### Run Tests

```bash
cd web
npm test lib/user-preferences/storage.test.ts
npm test lib/tts/sanitize.test.ts
```

### Coverage

- ✅ Storage migrations (legacy key migration)
- ✅ Export/import validation
- ✅ TTS sanitization (emojis, symbols, filtering)
- ✅ Schema validation

---

## Troubleshooting

### Preferences not applying

Check browser console for errors. Ensure:
1. Provider wraps your app
2. `isLoaded` is true before reading state
3. No JavaScript errors blocking useEffect

### localStorage unavailable

System falls back to in-memory storage automatically. Check console for:
```
[UserPreferences] localStorage unavailable, using memory fallback
```

### TTS not working

Check:
1. `isTTSAvailable()` returns true (browser support)
2. Voices loaded: `getAvailableVoices().length > 0`
3. User has enabled TTS: `ttsSettings.enabled === true`
4. Text is not empty after sanitization

### Migration not working

Ensure:
1. Legacy keys exist: check localStorage in DevTools
2. No JSON parse errors in console
3. Schema version correctly incremented

---

## Performance

- Provider is minimal, only applies data attributes
- Debounced saves prevent excessive writes (500ms)
- TTS engine reuses single utterance instance
- No heavy dependencies

**Bundle impact**: ~15KB (uncompressed)

---

## Next Steps

**Phase 2** will deliver:
1. Settings page UI with all controls
2. My Plan dashboard with saved items display
3. AddToMyPlanButton component
4. Routine builder UI

**Phase 3** will deliver:
1. Journey page integration
2. Tool/Guide "Add to My Plan" CTAs
3. NeuroBreath Buddy TTS integration
4. Reading level content system
5. Locale preference banner

---

## Questions?

This architecture is designed for:
- Privacy-first local storage
- Zero server dependency
- Extensible schema
- Composable hooks
- Accessible by default

For implementation questions or extension requests, refer to code comments or tests for examples.
