/**
 * SiteWideProfileCta Component
 * 
 * Central manager for the site-wide "Create Your Profile" CTA.
 * Handles placement logic:
 * - Renders the CTA button
 * - Opens ProfileFocusScreen on click
 * - Ensures exactly ONE instance per page
 * 
 * Placement strategy:
 * - Inside hero component if available (preferred)
 * - As first card/section if no hero (fallback via OnboardingCardWrapper)
 * 
 * State-aware:
 * - Only shows if no profile exists
 * - Hides on excluded routes
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CreateProfileCtaButton } from './CreateProfileCtaButton';
import { ProfileFocusScreen } from './ProfileFocusScreen';
import { hasAnyLearnerProfile } from '@/lib/onboarding/deviceProfileStore';

interface SiteWideProfileCtaProps {
  className?: string;
  // Allow parent to control if this should render (for deduplication)
  forceHide?: boolean;
}

/**
 * Routes where CTA should appear
 */
const ALLOWED_ROUTES = [
  '/',
  '/get-started',
  '/dyslexia-reading-training',
  '/progress',
  '/rewards',
  '/breathing',
  '/breathing/box',
  '/breathing/478',
  '/breathing/alternate-nostril',
  '/breathing/coherent',
];

/**
 * Routes where CTA should NEVER appear (prefix match)
 */
const EXCLUDED_PREFIXES = [
  '/teacher',
  '/parent',
  '/api',
];

/**
 * Routes where CTA should NEVER appear (exact match)
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
  '/about',
  '/about-us',
];

/**
 * Check if CTA should render on this route
 */
function shouldShowCta(pathname: string): boolean {
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
  
  // Check allowed routes (exact match or prefix for breathing routes)
  if (ALLOWED_ROUTES.includes(pathname)) {
    return true;
  }
  
  // Allow on breathing sub-routes
  if (pathname.startsWith('/breathing/')) {
    return true;
  }
  
  return false;
}

export function SiteWideProfileCta({ className, forceHide }: SiteWideProfileCtaProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if profile exists (device-local)
    try {
      const profileExists = hasAnyLearnerProfile();
      setHasProfile(profileExists);
    } catch (error) {
      console.error('[SiteWideProfileCta] Error checking profile:', error);
      setHasProfile(false);
    }
  }, []);

  // Don't render until mounted (prevent hydration mismatch)
  if (!mounted) {
    return null;
  }

  // Don't render if forced to hide (for deduplication)
  if (forceHide) {
    return null;
  }

  // Don't render if profile exists
  if (hasProfile) {
    return null;
  }

  // Don't render on excluded routes
  if (!shouldShowCta(pathname || '/')) {
    return null;
  }

  return (
    <>
      <CreateProfileCtaButton 
        onClick={() => setIsOpen(true)} 
        className={className}
      />
      <ProfileFocusScreen 
        open={isOpen} 
        onOpenChange={setIsOpen}
      />
    </>
  );
}




