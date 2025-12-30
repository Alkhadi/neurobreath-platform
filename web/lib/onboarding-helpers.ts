/**
 * Onboarding Helper Utilities
 *
 * IMPORTANT: These are TESTING/DEBUG utilities only.
 * DO NOT expose these functions in production UI.
 *
 * Use these for:
 * - Manual testing
 * - Development debugging
 * - Automated tests
 * - Demo/preview modes
 */

const STORAGE_KEYS = {
  LEARNER_PROFILE: 'learnerProfile',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  ONBOARDING_DISMISSED: 'onboardingDismissed',
} as const;

/**
 * Reset all onboarding state to simulate a new user
 * USE CASE: Testing the first-time user experience
 */
export function resetOnboardingState(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.LEARNER_PROFILE);
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DISMISSED);

  console.log('✅ Onboarding state reset - simulating new user');
}

/**
 * Simulate a user with an existing profile
 * USE CASE: Testing the returning user experience
 */
export function simulateReturningUser(): void {
  if (typeof window === 'undefined') return;

  const mockProfile = {
    id: 'test-user-123',
    name: 'Test User',
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.LEARNER_PROFILE, JSON.stringify(mockProfile));
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');

  console.log('✅ Simulating returning user with profile');
}

/**
 * Simulate a guest user who dismissed onboarding
 * USE CASE: Testing the guest mode experience
 */
export function simulateGuestUser(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.LEARNER_PROFILE);
  localStorage.setItem(STORAGE_KEYS.ONBOARDING_DISMISSED, 'true');

  console.log('✅ Simulating guest user (dismissed onboarding)');
}

/**
 * Get current onboarding state for debugging
 * USE CASE: Troubleshooting visibility issues
 */
export function getOnboardingState(): {
  hasProfile: boolean;
  onboardingCompleted: boolean;
  onboardingDismissed: boolean;
  shouldShowOnboarding: boolean;
  profile: any | null;
} {
  if (typeof window === 'undefined') {
    return {
      hasProfile: false,
      onboardingCompleted: false,
      onboardingDismissed: false,
      shouldShowOnboarding: false,
      profile: null,
    };
  }

  const profileStr = localStorage.getItem(STORAGE_KEYS.LEARNER_PROFILE);
  const profile = profileStr ? JSON.parse(profileStr) : null;
  const hasProfile = !!profile;
  const onboardingCompleted = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true';
  const onboardingDismissed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DISMISSED) === 'true';
  const shouldShowOnboarding = !hasProfile && !onboardingCompleted && !onboardingDismissed;

  return {
    hasProfile,
    onboardingCompleted,
    onboardingDismissed,
    shouldShowOnboarding,
    profile,
  };
}

/**
 * Log current onboarding state to console
 * USE CASE: Quick debugging during development
 */
export function debugOnboardingState(): void {
  const state = getOnboardingState();

  console.group('🔍 Onboarding State Debug');
  console.log('Should Show Onboarding:', state.shouldShowOnboarding);
  console.log('Has Profile:', state.hasProfile);
  console.log('Onboarding Completed:', state.onboardingCompleted);
  console.log('Onboarding Dismissed:', state.onboardingDismissed);
  console.log('Profile Data:', state.profile);
  console.groupEnd();

  // Visual indicator in console
  if (state.shouldShowOnboarding) {
    console.log('👋 User should see onboarding');
  } else {
    console.log('✅ User should NOT see onboarding');
  }
}

/**
 * Clear all app data (nuclear option)
 * USE CASE: Complete reset for testing
 */
export function clearAllAppData(): void {
  if (typeof window === 'undefined') return;

  const confirmed = confirm(
    '⚠️ This will clear ALL app data. Are you sure?\n\n' +
    'This includes:\n' +
    '- Learner profiles\n' +
    '- Progress data\n' +
    '- Onboarding state\n' +
    '- All settings'
  );

  if (confirmed) {
    localStorage.clear();
    sessionStorage.clear();
    console.log('🗑️ All app data cleared');
  }
}

/**
 * Export onboarding state as JSON
 * USE CASE: Debugging, sharing state with support
 */
export function exportOnboardingState(): string {
  const state = getOnboardingState();
  return JSON.stringify(state, null, 2);
}

/**
 * Add debug panel to window (development only)
 * USE CASE: Quick access to testing utilities
 *
 * Usage in browser console:
 * window.__onboarding.reset()
 * window.__onboarding.debug()
 */
export function attachDebugPanel(): void {
  if (typeof window === 'undefined') return;
  if (process.env.NODE_ENV === 'production') {
    console.warn('⚠️ Debug panel should not be used in production');
    return;
  }

  (window as any).__onboarding = {
    reset: resetOnboardingState,
    simulateReturning: simulateReturningUser,
    simulateGuest: simulateGuestUser,
    debug: debugOnboardingState,
    getState: getOnboardingState,
    export: exportOnboardingState,
    clearAll: clearAllAppData,
  };

  console.log(
    '%c🛠️ Onboarding Debug Panel Attached',
    'color: #3b82f6; font-weight: bold; font-size: 14px;'
  );
  console.log('Available commands:');
  console.log('  window.__onboarding.reset()          - Reset to new user');
  console.log('  window.__onboarding.simulateReturning() - Simulate returning user');
  console.log('  window.__onboarding.simulateGuest()  - Simulate guest user');
  console.log('  window.__onboarding.debug()          - Show current state');
  console.log('  window.__onboarding.getState()       - Get state object');
  console.log('  window.__onboarding.export()         - Export state as JSON');
  console.log('  window.__onboarding.clearAll()       - Clear all app data');
}

/**
 * TypeScript augmentation for window object
 */
declare global {
  interface Window {
    __onboarding?: {
      reset: typeof resetOnboardingState;
      simulateReturning: typeof simulateReturningUser;
      simulateGuest: typeof simulateGuestUser;
      debug: typeof debugOnboardingState;
      getState: typeof getOnboardingState;
      export: typeof exportOnboardingState;
      clearAll: typeof clearAllAppData;
    };
  }
}

// Auto-attach in development (can be disabled)
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Optional: Attach debug panel automatically
  // Uncomment the line below to enable:
  // attachDebugPanel();
}
