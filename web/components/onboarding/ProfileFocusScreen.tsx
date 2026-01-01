/**
 * ProfileFocusScreen Component
 * 
 * Full-screen accessible dialog/sheet for profile creation.
 * Opens from the CreateProfileCtaButton site-wide.
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

import { useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from '@/components/ui/dialog';
import { OnboardingPanel } from './OnboardingPanel';
import { cn } from '@/lib/utils';

interface ProfileFocusScreenProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileFocusScreen({ open, onOpenChange }: ProfileFocusScreenProps) {
  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  const handleComplete = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
        <DialogContent
          className={cn(
            // Full-screen on mobile, centered modal on desktop
            'fixed left-[50%] top-[50%] z-50',
            'w-[95vw] max-w-2xl',
            'h-[90vh] max-h-[800px]',
            'translate-x-[-50%] translate-y-[-50%]',
            'flex flex-col',
            'gap-0 p-0',
            'border bg-background shadow-2xl',
            'duration-200',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            'sm:rounded-xl rounded-lg',
            'overflow-hidden'
          )}
          // Prevent default close button from showing (we'll add custom one)
          onPointerDownOutside={() => {
            // Allow closing by clicking outside on desktop
            onOpenChange(false);
          }}
        >
          {/* Custom Header with Close Button */}
          <div className="flex-shrink-0 p-6 border-b bg-gradient-to-br from-background to-primary/5">
            <DialogHeader className="relative">
              <DialogTitle className="text-2xl sm:text-3xl font-bold text-left pr-10">
                Create Your Profile
              </DialogTitle>
              <DialogDescription className="text-left text-muted-foreground mt-2">
                Start tracking your progress and unlock personalized recommendations
              </DialogDescription>
              
              {/* Close button */}
              <button
                onClick={() => onOpenChange(false)}
                className="absolute -top-1 right-0 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Close profile creation"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogHeader>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="p-6 sm:p-8">
              <OnboardingPanel onComplete={handleComplete} />
            </div>
          </div>

          {/* Optional Footer (for additional CTAs or info) */}
          <div className="flex-shrink-0 p-4 border-t bg-muted/30 text-center">
            <p className="text-xs text-muted-foreground">
              Need help? Visit our{' '}
              <a 
                href="/resources" 
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resources
              </a>
              {' '}page or{' '}
              <a 
                href="/contact" 
                className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact Us
              </a>
            </p>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

