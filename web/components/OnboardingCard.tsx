/**
 * OnboardingCard Component
 *
 * A beautified, gated onboarding card that guides first-time users through profile creation.
 *
 * VISIBILITY RULES (ENFORCED):
 * ✅ Shows: No profile + not completed + not dismissed
 * ❌ Hides: Has profile OR completed OR dismissed
 *
 * FEATURES:
 * - Beautiful gradient accent for onboarding emphasis
 * - Clear CTA hierarchy
 * - Guest mode option with explanation
 * - Profile benefits messaging
 * - Smooth animations
 * - Fully responsive
 *
 * MAINTENANCE:
 * - Do NOT render this outside OnboardingGate
 * - Always update visibility logic in useOnboarding hook
 * - Test with both new and returning users
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, X, Sparkles, TrendingUp, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useState } from 'react';
import { ProfileCreationDialog } from '@/components/ProfileCreationDialog';
import { ClassroomJoinDialog, ClassroomJoinDetails } from '@/components/ClassroomJoinDialog';

export function OnboardingCard() {
  const { dismissOnboarding } = useOnboarding();
  const [isVisible, setIsVisible] = useState(true);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showClassroomDialog, setShowClassroomDialog] = useState(false);

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
   * Open the classroom join dialog
   */
  const handleJoinClassroom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowClassroomDialog(true);
  };

  const handleClassroomJoined = (details: ClassroomJoinDetails) => {
    setIsVisible(false);
    toast.success(`You're connected to classroom ${details.classCode}. Your teacher can now see your progress.`, {
      duration: 4000,
    });
  };

  /**
   * Handle continuing as guest
   * User can use the app without a profile
   */
  const handleContinueAsGuest = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dismissOnboarding();
    setIsVisible(false);
    toast.success('Welcome! You can create a profile anytime to track your progress.', {
      duration: 4000,
    });
  };

  /**
   * Handle dismissing the onboarding card
   * User explicitly closes it
   */
  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dismissOnboarding();
    setIsVisible(false);
  };

  // Smooth fade out when dismissed
  if (!isVisible) return null;

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md hover:bg-muted/80 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Dismiss onboarding"
      >
        <X className="w-4 h-4" />
      </button>

      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Header with gradient accent */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 ring-2 ring-primary/20">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Welcome to NeuroBreath!
                </h2>
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </div>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Get started with personalized reading training. Choose how you'd like to begin your journey.
              </p>
            </div>
          </div>

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

      {/* Profile Creation Dialog */}
      <ProfileCreationDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
      <ClassroomJoinDialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
        onJoined={handleClassroomJoined}
      />
    </Card>
  );
}
