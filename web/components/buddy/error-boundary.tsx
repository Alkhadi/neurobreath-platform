'use client';

import React from 'react';

export interface BuddyErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface BuddyErrorBoundaryState {
  hasError: boolean;
}

export class BuddyErrorBoundary extends React.Component<
  BuddyErrorBoundaryProps,
  BuddyErrorBoundaryState
> {
  state: BuddyErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): BuddyErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Avoid crashing the entire page if a single message render fails.
    console.error('[Buddy] Render error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="text-xs text-muted-foreground">
            Something went wrong rendering this response.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
