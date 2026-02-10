'use client';

import React from 'react';
import type { AnalyticsEventName, AnalyticsEventPayload } from '@/lib/analytics/events';
import { trackEvent } from '@/lib/analytics/events';

interface TrackClickProps {
  event: AnalyticsEventName;
  payload?: AnalyticsEventPayload;
  children: React.ReactElement;
}

export function TrackClick({ event, payload, children }: TrackClickProps) {
  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent) => {
      try {
        trackEvent(event, payload);
      } finally {
        children.props.onClick?.(e);
      }
    },
  });
}
