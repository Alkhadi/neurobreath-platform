/**
 * FocusOverlayShell Component
 * 
 * Reusable focus screen/modal pattern optimized for all viewports.
 * 
 * Features:
 * - Uses dvh for proper mobile viewport height
 * - Sticky header with close button (always visible)
 * - Scrollable content area with overscroll-contain
 * - Sticky footer with primary CTA (always visible)
 * - Safe-area aware (iOS bottom inset)
 * - No horizontal scroll
 * - Min touch target 44px
 * - Keyboard accessible
 * 
 * @example
 * ```tsx
 * <FocusOverlayShell
 *   isOpen={true}
 *   onClose={() => setOpen(false)}
 *   title="Choose a breathing technique"
 *   maxWidth="max-w-2xl"
 *   footer={
 *     <button className="w-full min-h-[44px]">Start breathing</button>
 *   }
 * >
 *   <div>Your content here</div>
 * </FocusOverlayShell>
 * ```
 */

'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FocusOverlayShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  className?: string;
  testId?: string;
}

export function FocusOverlayShell({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'max-w-2xl',
  className,
  testId = 'focus-overlay',
}: FocusOverlayShellProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  // Lock body scroll and prevent horizontal scroll when open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = window.getComputedStyle(document.body).overflow;
      const originalOverflowX = window.getComputedStyle(document.body).overflowX;
      const htmlOriginalOverflowX = window.getComputedStyle(document.documentElement).overflowX;
      
      document.body.style.overflow = 'hidden';
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
        document.documentElement.style.overflowX = htmlOriginalOverflowX;
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] animate-in fade-in duration-200 overflow-hidden"
        onClick={onClose}
        aria-hidden="true"
        data-testid={`${testId}-backdrop`}
      />

      {/* Overlay Container */}
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${testId}-title`}
        data-testid={testId}
      >
        {/* Modal Shell */}
        <div
          className={cn(
            // Size constraints with dvh - crucial for mobile
            'w-full min-w-0', // min-w-0 prevents flex overflow
            maxWidth,
            'max-h-[calc(100dvh-24px)] sm:max-h-[calc(100dvh-48px)]',
            
            // Layout
            'flex flex-col overflow-hidden',
            
            // Styling
            'bg-white rounded-xl sm:rounded-2xl shadow-2xl',
            
            // Animation
            'animate-in zoom-in-95 fade-in duration-200',
            
            className
          )}
          onClick={(e) => e.stopPropagation()}
          data-testid={`${testId}-container`}
        >
          {/* Sticky Header */}
          <div 
            className="flex-shrink-0 flex items-start justify-between gap-4 p-4 sm:p-6 border-b bg-gradient-to-br from-white to-blue-50/30"
            data-testid={`${testId}-header`}
          >
            <div className="flex-1 min-w-0">
              <h2
                id={`${testId}-title`}
                className="text-lg sm:text-xl font-bold text-gray-900 leading-tight"
              >
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-gray-600 mt-1 leading-snug">
                  {subtitle}
                </p>
              )}
            </div>
            
            {/* Close Button - Always Visible */}
            <button
              onClick={onClose}
              className={cn(
                'flex-shrink-0',
                'w-10 h-10', // 40px min for accessibility, but touch target extends
                'min-h-[44px] min-w-[44px]', // Ensure 44px touch target
                '-m-2', // Negative margin to keep visual size 40px
                'flex items-center justify-center',
                'rounded-lg',
                'text-gray-500 hover:text-gray-700',
                'hover:bg-gray-100',
                'transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              )}
              aria-label="Close"
              data-testid={`${testId}-close-button`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            ref={contentRef}
            className={cn(
              'flex-1',
              'overflow-y-auto overflow-x-hidden overscroll-contain',
              'min-w-0', // Prevent horizontal overflow
              // Add bottom padding to ensure content doesn't hide behind sticky footer
              footer ? 'pb-24' : 'pb-6',
              'px-4 sm:px-6'
            )}
            data-testid={`${testId}-content`}
          >
            <div className="py-4 min-w-0">
              {children}
            </div>
          </div>

          {/* Sticky Footer */}
          {footer && (
            <div
              className={cn(
                'flex-shrink-0',
                'border-t bg-white',
                'p-4 sm:px-6 sm:py-4',
                // Safe area support for iOS
                'pb-[calc(env(safe-area-inset-bottom)+16px)]',
                'sm:pb-[calc(env(safe-area-inset-bottom)+16px)]'
              )}
              data-testid={`${testId}-footer`}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/**
 * FocusOverlayFooter
 * 
 * Helper component for consistent footer button layouts
 */
interface FocusOverlayFooterProps {
  primary?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
  };
  secondary?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function FocusOverlayFooter({
  primary,
  secondary,
  className,
}: FocusOverlayFooterProps) {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row gap-3', className)}>
      {secondary && (
        <button
          onClick={secondary.onClick}
          className={cn(
            'flex-1 sm:flex-none sm:px-6',
            'min-h-[44px]',
            'px-4 py-2.5',
            'text-sm font-medium',
            'text-gray-700 bg-white',
            'border border-gray-300',
            'rounded-lg',
            'hover:bg-gray-50',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          {secondary.label}
        </button>
      )}
      
      {primary && (
        <button
          onClick={primary.onClick}
          disabled={primary.disabled || primary.loading}
          className={cn(
            'flex-1',
            'min-h-[44px]',
            'px-4 py-2.5',
            'text-sm font-medium',
            'text-white bg-blue-600',
            'rounded-lg',
            'hover:bg-blue-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          )}
        >
          {primary.loading ? 'Loading...' : primary.label}
        </button>
      )}
    </div>
  );
}
