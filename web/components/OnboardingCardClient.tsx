/**
 * OnboardingCardClient - Client Component
 * 
 * UPDATED: Now uses SiteWideProfileCta instead of OnboardingCard.
 * Acts as a fallback for pages without a hero section.
 * 
 * Handles all onboarding logic client-side using device-local storage.
 * No database required - perfect for privacy-first, on-device profile system.
 * 
 * ROUTE-AWARE: Only renders on allowed routes (excluding homepage which has hero).
 * STATE-AWARE: Shows CTA or banner based on profile state.
 */

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { SiteWideProfileCta } from '@/components/onboarding/SiteWideProfileCta'
import { ProfileEnabledBanner } from '@/components/ProfileEnabledBanner'
import { hasAnyLearnerProfile } from '@/lib/onboarding/deviceProfileStore'

/**
 * Routes where onboarding should appear (as fallback)
 * Homepage (/) is excluded because hero handles it
 */
const ALLOWED_ROUTES = [
  '/get-started',
  '/dyslexia-reading-training',
  '/progress',
  '/rewards',
]

/**
 * Routes where onboarding should NEVER appear (prefix match)
 */
const EXCLUDED_PREFIXES = [
  '/teacher',
  '/parent',
]

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
]

/**
 * Routes where Profile Enabled Banner should appear (when profile exists)
 */
const BANNER_ROUTES = [
  '/get-started',
]

/**
 * Check if onboarding should render on this route
 */
function shouldShowOnboarding(pathname: string): boolean {
  // Check exclusions first (prefix match)
  for (const prefix of EXCLUDED_PREFIXES) {
    if (pathname.startsWith(prefix)) {
      return false
    }
  }
  
  // Check exact exclusions
  if (EXCLUDED_ROUTES.includes(pathname)) {
    return false
  }
  
  // Check allowed routes (exact match)
  return ALLOWED_ROUTES.includes(pathname)
}

/**
 * Check if banner should show (when profile exists)
 */
function shouldShowBanner(pathname: string): boolean {
  return BANNER_ROUTES.includes(pathname)
}

export function OnboardingCardClient() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    
    // Check if profile exists (device-local)
    try {
      const profileExists = hasAnyLearnerProfile()
      setHasProfile(profileExists)
    } catch (error) {
      console.error('[OnboardingCardClient] Error checking profile:', error)
      setHasProfile(false)
    }
  }, [])
  
  // Don't render anything until mounted (prevent hydration mismatch)
  if (!mounted) {
    return null
  }
  
  // Check if we should show onboarding on this route
  if (!shouldShowOnboarding(pathname || '/')) {
    return null
  }
  
  // STATE A: No profile exists - show CTA as first card
  if (!hasProfile) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <SiteWideProfileCta />
      </div>
    )
  }
  
  // STATE C: Profile exists - show compact banner on specific routes only
  if (shouldShowBanner(pathname || '/')) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <ProfileEnabledBanner />
      </div>
    )
  }
  
  // STATE B or other: Profile exists but not on banner route - hide completely
  return null
}

