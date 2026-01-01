/**
 * OnboardingCard Component (Accordion with PIN Lock)
 *
 * COLLAPSIBLE ACCORDION (SITE-WIDE):
 * - Collapsed by default (header button only)
 * - Expands on click to show onboarding options
 * - Accessible accordion with aria-expanded
 *
 * PIN LOCK LOGIC:
 * - If no profiles exist: accordion expands/collapses normally
 * - If profiles exist + PIN set: clicking header opens PIN entry modal
 * - Unlock lasts only for current page visit (in-memory state)
 * - Refresh or route change locks again
 *
 * FEATURES:
 * - Beautiful gradient accent for onboarding emphasis
 * - Clear CTA hierarchy
 * - Guest mode option with explanation
 * - Profile benefits messaging
 * - Smooth animations
 * - Fully responsive
 * - Server-side rendering support
 *
 * MAINTENANCE:
 * - Profile status determined server-side via Prisma
 * - PIN lock is device-local only (no server sync)
 * - Test with both new and returning users
 */

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, Sparkles, TrendingUp, Award, ChevronDown, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileCreationDialog } from '@/components/ProfileCreationDialog';
import { ClassroomJoinDialog, ClassroomJoinDetails } from '@/components/ClassroomJoinDialog';
import { PinEntryDialog } from '@/components/security/PinEntryDialog';
import { PinResetDialog } from '@/components/security/PinResetDialog';
import type { ProfileStatus } from '@/lib/profile/getProfileStatus';
import { hasAnyLearnerProfile } from '@/lib/onboarding/deviceProfileStore';
import { isPinSet } from '@/lib/security/devicePinStore';
import { getOnboardingSubtitle, getOnboardingLockedSubtitle } from '@/lib/onboarding/getOnboardingSubtitle';

/**
 * Get header CTA label based on lock state and profile status
 */
function getHeaderCtaLabel({ hasProfile, isLocked, isUnlocked }: { 
  hasProfile: boolean; 
  isLocked: boolean; 
  isUnlocked: boolean;
}): string {
  if (isLocked && !isUnlocked) {
    return 'Enter PIN to add a learner';
  }
  
  if (hasProfile) {
    return 'Click here to add another profile';
  }
  
  return 'Click here to create a profile';
}

interface OnboardingCardProps {
  deviceId?: string;
  profileStatus?: ProfileStatus;
}

export function OnboardingCard({ deviceId: propDeviceId, profileStatus: propProfileStatus }: OnboardingCardProps) {
  const pathname = usePathname();
  
  // Use props if provided, otherwise use default values
  const deviceId = propDeviceId || 'default';
  const profileStatus = propProfileStatus || { hasProfile: false, isComplete: false };
  
  // Always visible (but collapsed)
  const [isExpanded, setIsExpanded] = useState(false);
  
  // PIN lock state (in-memory only, resets on route change)
  const [isLocked, setIsLocked] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showPinResetDialog, setShowPinResetDialog] = useState(false);
  
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showClassroomDialog, setShowClassroomDialog] = useState(false);
  
  // Dynamic subtitle based on route
  const subtitle = isLocked && !isUnlocked 
    ? getOnboardingLockedSubtitle(pathname || '/')
    : getOnboardingSubtitle(pathname || '/');
  
  // Check lock status on mount
  useEffect(() => {
    const hasProfiles = hasAnyLearnerProfile();
    const hasPinSet = isPinSet();
    setIsLocked(hasProfiles && hasPinSet);
  }, []);
  
  // Reset unlock state on route change (lock again)
  useEffect(() => {
    setIsUnlocked(false);
    setIsExpanded(false);
  }, [pathname]);

  /**
   * Handle accordion header click
   * If locked and not unlocked: open PIN dialog
   * Otherwise: toggle expansion
   */
  const handleHeaderClick = () => {
    if (isLocked && !isUnlocked) {
      setShowPinDialog(true);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  /**
   * Handle PIN unlock success
   */
  const handlePinUnlocked = () => {
    setIsUnlocked(true);
    setIsExpanded(true);
    toast.success('Unlocked! You can now create profiles.', {
      duration: 3000,
    });
  };

  /**
   * Handle creating a new learner profile
   * Opens the profile creation dialog
   */
  const handleCreateProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileDialog(true);
  };

  /**
   * Handle joining a classroom
   * Opens the classroom join dialog
   */
  const handleJoinClassroom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowClassroomDialog(true);
  };

  const handleClassroomJoined = (details: ClassroomJoinDetails) => {
    setIsExpanded(false);
    toast.success(`You're connected to classroom ${details.classCode}. Your teacher can now see your progress.`, {
      duration: 4000,
    });
  };

  /**
   * Handle continuing as guest
   * Navigate to /dyslexia-reading-training (start practicing immediately)
   * Set device-local guest mode
   */
  const handleContinueAsGuest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Set guest mode flag
    try {
      localStorage.setItem('nb:guestMode', 'true');
    } catch (error) {
      console.error('Failed to set guest mode:', error);
    }
    
    toast.success('Welcome! Starting as guest. You can create a profile anytime to track progress.', {
      duration: 4000,
    });
    
    // Navigate to practice page
    window.location.href = '/dyslexia-reading-training';
  };

  // Get CTA label based on state
  const ctaLabel = getHeaderCtaLabel({ 
    hasProfile: profileStatus?.hasProfile || false, 
    isLocked, 
    isUnlocked 
  });

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      {/* Accordion Header Button */}
      <button
        onClick={handleHeaderClick}
        className="w-full p-6 sm:p-8 flex items-center gap-4 hover:bg-muted/10 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-t-lg cursor-pointer group"
        aria-label={isExpanded ? 'Collapse onboarding' : 'Expand onboarding'}
        aria-expanded={isExpanded}
        aria-controls="onboarding-content"
      >
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20 flex-shrink-0 group-hover:scale-105 transition-transform">
          {isLocked && !isUnlocked ? (
            <Lock className="w-6 h-6 text-primary" />
          ) : (
            <Users className="w-6 h-6 text-primary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome to NeuroBreath!
            </h2>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-1">
            {subtitle}
          </p>
          {/* CTA Pill - Only visible when collapsed */}
          {!isExpanded && (
            <span className="inline-flex items-center gap-1.5 mt-3 rounded-full border-2 border-primary/30 bg-primary/10 px-3 py-1.5 text-xs sm:text-sm font-medium text-primary group-hover:border-primary/50 group-hover:bg-primary/20 transition-colors">
              {ctaLabel}
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-6 h-6 text-muted-foreground flex-shrink-0 transition-transform ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion Content Panel */}
      {isExpanded && (
        <CardContent id="onboarding-content" className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 space-y-6 border-t border-border/30">
          {/* Profile benefits */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-primary/10">
            <div className="flex items-start gap-2 mb-3">
              <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs font-semibold text-foreground">
                With a profile, you can:
              </p>
            </div>
            <ul className="grid gap-2 text-xs text-muted-foreground ml-6">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Track individual progress across all activities</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Receive personalized recommendations based on skill level</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Save multiple learner profiles (family-friendly)</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                <span>Export progress reports and celebrate milestones</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons - Clear hierarchy */}
          <div className="space-y-3">
            {/* Primary CTA - Create Profile */}
            <Button
              size="lg"
              className="w-full gap-2 justify-start text-base bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all"
              onClick={handleCreateProfile}
            >
              <UserPlus className="w-5 h-5" />
              <span className="flex-1 text-left">Create a Learner Profile</span>
              <TrendingUp className="w-4 h-4 opacity-70" />
            </Button>

            {/* Secondary CTA - Join Classroom */}
            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 justify-start text-base border-2 hover:bg-muted/50"
              onClick={handleJoinClassroom}
            >
              <Users className="w-5 h-5" />
              <span className="flex-1 text-left">Join a Classroom</span>
            </Button>

            {/* Tertiary option - Continue as Guest */}
            <div className="pt-2 border-t border-border/50">
              <button
                onClick={handleContinueAsGuest}
                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center"
              >
                Continue as guest without a profile
              </button>
              <p className="text-xs text-muted-foreground/70 text-center mt-1">
                You can create a profile anytime to unlock personalized tracking
              </p>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="pt-2 border-t border-border/30">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Privacy First:</strong> All data is stored privately on your device.
                No login required, no tracking, no accounts needed.
              </p>
            </div>
          </div>
        </CardContent>
      )}

      {/* PIN Entry Dialog (for unlocking) */}
      <PinEntryDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onSuccess={handlePinUnlocked}
        onForgotPin={() => {
          setShowPinDialog(false);
          setShowPinResetDialog(true);
        }}
      />
      
      {/* PIN Reset Dialog */}
      <PinResetDialog
        open={showPinResetDialog}
        onOpenChange={setShowPinResetDialog}
        onSuccess={handlePinUnlocked}
      />
      
      {/* Profile Creation Dialog */}
      <ProfileCreationDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog} 
      />
      
      {/* Classroom Join Dialog */}
      <ClassroomJoinDialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
        onJoined={handleClassroomJoined}
      />
    </Card>
  );
}
