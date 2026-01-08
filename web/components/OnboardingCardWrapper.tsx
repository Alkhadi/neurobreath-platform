/**
 * OnboardingCardWrapper - Server Component with Route Control
 * 
 * UPDATED: Now uses the new SiteWideProfileCta system.
 * Acts as a FALLBACK for pages that don't have a hero section.
 * 
 * The homepage (/) has the CTA in the hero, so we skip it here.
 * Other allowed pages without a hero get the CTA as their first card/section.
 * 
 * PLACEMENT RULES:
 * - Skip on /: hero handles it
 * - Render on: /get-started, /dyslexia-reading-training, /progress, /rewards (if no hero)
 * - Exclude: /teacher/*, /parent/*, /blog, /ai-blog, /resources, /downloads, /contact, /support-us, /schools, /send-report
 */

import { OnboardingCardClient } from '@/components/OnboardingCardClient';

/**
 * Routes where onboarding should appear (if not in hero)
 * Homepage (/) is excluded here because hero handles it
 */
const ALLOWED_ROUTES = [
  '/get-started',
  '/dyslexia-reading-training',
  '/progress',
  '/rewards',
];

/**
 * Routes where onboarding should NEVER appear (prefix match)
 */
const EXCLUDED_PREFIXES = [
  '/teacher',
  '/parent',
];

/**
 * Routes where onboarding should NEVER appear (exact match)
 */
const EXCLUDED_ROUTES = [
  '/blog',
  '/ai-blog',
  '/resources',
  '/downloads',
  '/contact',
  '/support-us',
  '/schools',
  '/send-report',
];

/**
 * Check if onboarding should render on this route (CLIENT-SIDE)
 * This function is duplicated in OnboardingCardClient for client-side routing
 */
export function shouldShowOnboardingOnRoute(pathname: string): boolean {
  // Check exclusions first (prefix match)
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return false;
    }
  }
  
  // Check exact exclusions
  if (EXCLUDED_ROUTES.includes(pathname)) {
    return false;
  }
  
  // Check allowed routes (exact match)
  return ALLOWED_ROUTES.includes(pathname);
}

/**
 * Server component wrapper - delegates to client component for route detection
 * 
 * Since we're using device-local storage (no database required),
 * we let the client component handle all the logic.
 */
export async function OnboardingCardWrapper() {
  // Simply render the client component
  // It will check the route client-side and handle all state logic
  return <OnboardingCardClient />;
}
