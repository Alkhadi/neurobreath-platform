/**
 * ProfileFocusScreen Component
 * 
 * Full-screen accessible dialog/sheet for profile creation.
 * Now uses FocusOverlayShell for consistent responsive behavior.
 * 
 * Accessibility features:
 * - Focus trap while open
 * - ESC to close
 * - Visible close button
 * - Returns focus to trigger button on close
 * - Mobile-friendly: full-screen on small screens
 * - Proper ARIA labels
 * 
 * Contains the complete OnboardingPanel with all functionality.
 */

'use client';

import { OnboardingPanel } from './OnboardingPanel';
import { FocusOverlayShell } from '@/components/focus/FocusOverlayShell';

interface ProfileFocusScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileFocusScreen({ open, onOpenChange }: ProfileFocusScreenProps) {
  const handleComplete = () => {
    onOpenChange(false);
  };

  return (
    <FocusOverlayShell
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Create Your Profile"
      subtitle="Start tracking your progress and unlock personalised recommendations"
      maxWidth="max-w-3xl"
      testId="profile-creation-modal"
      footer={
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Need help? Visit our{' '}
            <a 
              href="/resources" 
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resources
            </a>
            {' '}page or{' '}
            <a 
              href="/contact" 
              className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
          </p>
        </div>
      }
    >
      <OnboardingPanel onComplete={handleComplete} />
    </FocusOverlayShell>
  );
}
