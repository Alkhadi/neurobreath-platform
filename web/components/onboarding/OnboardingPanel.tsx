/**
 * OnboardingPanel Component
 * 
 * Extracted reusable onboarding content panel.
 * Contains all original onboarding features:
 * - Profile creation
 * - Classroom join
 * - Guest mode
 * - Benefits messaging
 * - Privacy notice
 * 
 * Used inside ProfileFocusScreen for full-screen experience.
 */

'use client';

import { Button } from '@/components/ui/button';
import { UserPlus, Users, Award, TrendingUp } from 'lucide-react';
import { ProfileCreationDialog } from '@/components/ProfileCreationDialog';
import { ClassroomJoinDialog, ClassroomJoinDetails } from '@/components/ClassroomJoinDialog';
import { toast } from 'sonner';
import { useState } from 'react';

interface OnboardingPanelProps {
  onComplete?: () => void;
}

export function OnboardingPanel({ onComplete }: OnboardingPanelProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showClassroomDialog, setShowClassroomDialog] = useState(false);

  /**
   * Handle creating a new learner profile
   */
  const handleCreateProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProfileDialog(true);
  };

  /**
   * Handle joining a classroom
   */
  const handleJoinClassroom = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowClassroomDialog(true);
  };

  const handleClassroomJoined = (details: ClassroomJoinDetails) => {
    toast.success(`You're connected to classroom ${details.classCode}. Your teacher can now see your progress.`, {
      duration: 4000,
    });
    onComplete?.();
  };

  /**
   * Handle continuing as guest
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
    
    onComplete?.();
    
    // Navigate to practice page
    window.location.href = '/dyslexia-reading-training';
  };

  return (
    <div className="space-y-6 w-full">
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
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2 text-center focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
            aria-label="Continue as guest without creating a profile"
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

      {/* Dialogs */}
      <ProfileCreationDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
      />
      
      <ClassroomJoinDialog
        open={showClassroomDialog}
        onOpenChange={setShowClassroomDialog}
        onJoined={handleClassroomJoined}
      />
    </div>
  );
}

