/**
 * OnboardingGate Component
 *
 * CRITICAL: This is the ONLY way onboarding content should be rendered.
 *
 * PURPOSE:
 * - Enforces strict visibility rules for onboarding content
 * - Prevents onboarding from leaking to returning users
 * - Provides a single source of truth for onboarding state
 *
 * USAGE:
 * ```tsx
 * <OnboardingGate>
 *   <OnboardingCard />
 * </OnboardingGate>
 * ```
 *
 * VISIBILITY LOGIC:
 * - Returns null (no render) if user has profile
 * - Returns null if user completed onboarding
 * - Returns null if user dismissed onboarding
 * - Returns children ONLY for first-time visitors
 *
 * MAINTENANCE RULES:
 * 1. NEVER bypass this gate - always wrap onboarding UI
 * 2. NEVER use CSS display:none - component must not mount
 * 3. Test both scenarios: new user + returning user
 * 4. Update useOnboarding hook for logic changes
 *
 * SECURITY/PRIVACY:
 * - This prevents unwanted UI from appearing to returning users
 * - Respects user choice to dismiss or skip onboarding
 * - No data leakage through hidden-but-mounted components
 */

'use client';

import { useOnboarding } from '@/hooks/useOnboarding';

interface OnboardingGateProps {
  children: React.ReactNode;
  /**
   * Optional: Fallback content to show when onboarding is hidden
   * Useful for maintaining layout or showing alternative content
   */
  fallback?: React.ReactNode;
}

export function OnboardingGate({ children, fallback = null }: OnboardingGateProps) {
  const { shouldShowOnboarding } = useOnboarding();

  /**
   * CRITICAL: Do NOT mount children if onboarding should not show
   *
   * This is NOT a display:none situation - the component must not exist in the DOM.
   * Reasons:
   * 1. Performance: Don't mount unnecessary components
   * 2. Privacy: Don't render content that shouldn't be visible
   * 3. Accessibility: Screen readers shouldn't announce hidden onboarding
   * 4. Testing: Makes visibility bugs immediately apparent
   */
  if (!shouldShowOnboarding) {
    return fallback ? <>{fallback}</> : null;
  }

  // Only render children when onboarding SHOULD be visible
  return <>{children}</>;
}

/**
 * TESTING CHECKLIST FOR FUTURE DEVELOPERS:
 *
 * ✅ New user (no profile, no completion, no dismiss):
 *    - Should see onboarding
 *
 * ✅ User with profile:
 *    - Should NOT see onboarding
 *    - Should see fallback (if provided)
 *
 * ✅ User who completed onboarding:
 *    - Should NOT see onboarding
 *
 * ✅ User who dismissed onboarding:
 *    - Should NOT see onboarding
 *    - Can still use app as guest
 *
 * ✅ Clear localStorage and refresh:
 *    - Should see onboarding again (new user flow)
 */
