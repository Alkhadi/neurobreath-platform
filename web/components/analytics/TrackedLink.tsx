'use client';

import Link from 'next/link';
import React from 'react';
import type { AnalyticsEventName, AnalyticsEventPayload } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/events';

interface TrackedLinkProps {
  href: string;
  event: AnalyticsEventName;
  payload?: AnalyticsEventPayload;
  className?: string;
  children: React.ReactNode;
}

export function TrackedLink({ href, event, payload, className, children }: TrackedLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        try {
          trackEvent(event, payload);
        } finally {
          // Preserve default Link behavior
        }
      }}
    >
      {children}
    </Link>
  );
}
