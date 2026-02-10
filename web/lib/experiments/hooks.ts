/**
 * Experiments / A-B Testing Hooks
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ExperimentDefinition, ExperimentVariant } from './schema';
import { getOrAssignVariant, initializeExperiments, markExposed, resetExperiment } from './engine';
import { trackEvent } from '@/lib/analytics/engine';

export interface UseExperimentResult<TVariant extends ExperimentVariant> {
  variant: TVariant;
  inExperiment: boolean;
  experimentId: string;
  trackConversion: (metric: string, data?: Record<string, unknown>) => void;
  reset: () => void;
}

export function useExperiment<TVariant extends ExperimentVariant>(
  definition: ExperimentDefinition<TVariant>
): UseExperimentResult<TVariant> {
  const [assignment, setAssignment] = useState(() => {
    initializeExperiments();
    return getOrAssignVariant(definition);
  });

  const hasTrackedExposureRef = useRef(false);

  // Keep assignment stable even if caller re-creates the object
  const stableDefinition = useMemo(
    () => definition,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [definition.id]
  );

  useEffect(() => {
    const next = getOrAssignVariant(stableDefinition);
    setAssignment(next);

    if (!hasTrackedExposureRef.current) {
      hasTrackedExposureRef.current = true;
      markExposed(stableDefinition.id);
      trackEvent({
        type: 'experiment_exposure',
        data: {
          experimentId: stableDefinition.id,
          variant: next.variant,
          inExperiment: next.inExperiment,
        },
      });
    }
  }, [stableDefinition]);

  const trackConversion = useCallback(
    (metric: string, data?: Record<string, unknown>) => {
      trackEvent({
        type: 'experiment_conversion',
        data: {
          experimentId: stableDefinition.id,
          variant: assignment.variant,
          metric,
          inExperiment: assignment.inExperiment,
          ...(data || {}),
        },
      });
    },
    [assignment.inExperiment, assignment.variant, stableDefinition.id]
  );

  const reset = useCallback(() => {
    resetExperiment(stableDefinition.id);
    const next = getOrAssignVariant(stableDefinition);
    setAssignment(next);
    hasTrackedExposureRef.current = true;
    markExposed(stableDefinition.id);
    trackEvent({
      type: 'experiment_exposure',
      data: {
        experimentId: stableDefinition.id,
        variant: next.variant,
        inExperiment: next.inExperiment,
        reset: true,
      },
    });
  }, [stableDefinition]);

  return {
    variant: assignment.variant,
    inExperiment: assignment.inExperiment,
    experimentId: stableDefinition.id,
    trackConversion,
    reset,
  };
}
