/**
 * NB-Card Onboarding State Management
 * Local-first: stores onboarding dismissal flag in localStorage
 */

const ONBOARDING_DISMISSED_KEY = "nb-card:onboarding_dismissed";
const ONBOARDING_VERSION = "v1";

export function hasCompletedOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const value = window.localStorage.getItem(ONBOARDING_DISMISSED_KEY);
    return value === ONBOARDING_VERSION;
  } catch {
    return true; // Fail-safe: don't block user if storage unavailable
  }
}

export function markOnboardingComplete(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ONBOARDING_DISMISSED_KEY, ONBOARDING_VERSION);
  } catch (error) {
    console.warn("Failed to save onboarding state", error);
  }
}

export function resetOnboarding(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARDING_DISMISSED_KEY);
  } catch (error) {
    console.warn("Failed to reset onboarding state", error);
  }
}

/**
 * Example template preset data (clearly marked as placeholder)
 */
export function getExampleCardPreset(): {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  profileDescription: string;
  businessDescription: string;
  gradient: string;
} {
  return {
    fullName: "[EXAMPLE] Alex Smith",
    jobTitle: "[EXAMPLE] Product Designer",
    email: "alex.example@email.com",
    phone: "+44 7700 900000",
    profileDescription: "This is an example card. Replace with your details.",
    businessDescription: "Example business description",
    gradient: "linear-gradient(135deg, #9333ea 0%, #3b82f6 100%)",
  };
}
