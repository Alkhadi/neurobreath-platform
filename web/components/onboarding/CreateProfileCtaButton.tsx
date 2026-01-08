/**
 * CreateProfileCtaButton Component
 * 
 * Card-styled button that opens the Profile Focus Screen.
 * Visually retains the look of the original onboarding card header.
 * Serves as the primary CTA for profile creation site-wide.
 * 
 * Design:
 * - Gradient background with border
 * - Icon on left
 * - Title: "Create Your Profile"
 * - Subtitle: context-aware message
 * - Clear "Click here" CTA indicator
 * - Fully accessible button (not a div)
 */

'use client';

import { Users, Sparkles, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { getOnboardingSubtitle } from '@/lib/onboarding/getOnboardingSubtitle';

interface CreateProfileCtaButtonProps {
  onClick: () => void;
  className?: string;
}

export function CreateProfileCtaButton({ onClick, className = '' }: CreateProfileCtaButtonProps) {
  const pathname = usePathname();
  
  // Get context-aware subtitle
  const subtitle = getOnboardingSubtitle(pathname || '/');

  return (
    <button
      onClick={onClick}
      className={`
        group
        relative overflow-hidden
        w-full min-w-0
        p-4 sm:p-6 lg:p-8
        flex items-center gap-3 sm:gap-4
        text-left
        rounded-lg border-2 border-primary/20
        bg-gradient-to-br from-card via-card to-primary/5
        hover:border-primary/30
        hover:shadow-lg
        transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        cursor-pointer
        ${className}
      `}
      aria-label="Create your profile - opens profile creation dialog"
    >
      {/* Icon */}
      <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20 flex-shrink-0 group-hover:scale-110 transition-transform">
        <Users className="w-6 h-6 text-primary" />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground break-words">
            Create Your Profile
          </h2>
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-pulse flex-shrink-0" />
        </div>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed mt-1 break-words">
          {subtitle}
        </p>
        {/* CTA Pill */}
        <span className="inline-flex items-center gap-1.5 mt-2 sm:mt-3 rounded-full border-2 border-primary/30 bg-primary/10 px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-primary group-hover:border-primary/50 group-hover:bg-primary/20 transition-colors">
          <span className="break-words">Click here to get started</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
        </span>
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
}

