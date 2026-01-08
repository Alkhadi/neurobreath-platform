'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProgressData } from '@/lib/types';
import {
  loadProgress,
  logCalmSession,
  logSkillPractice,
  awardBadge,
  resetProgress as resetProgressStore
} from '@/lib/progress-store-enhanced';

export const useProgress = () => {
  const [progress, setProgress] = useState<ProgressData>(() => loadProgress());
  const [isLoading, setIsLoading] = useState(true);

  // Load on mount
  useEffect(() => {
    setProgress(loadProgress());
    setIsLoading(false);
  }, []);

  const logCalm = useCallback((exerciseId: string, minutes: number) => {
    const result = logCalmSession(exerciseId, minutes);
    setProgress(result.progress);
    return result;
  }, []);

  const logSkill = useCallback((skillId: string, minutes: number = 5) => {
    const result = logSkillPractice(skillId, minutes);
    setProgress(result.progress);
    return result;
  }, []);

  const earnBadge = useCallback((badgeId: string) => {
    const updated = awardBadge(badgeId);
    setProgress(updated);
    return updated;
  }, []);

  const resetAll = useCallback(() => {
    resetProgressStore();
    setProgress(loadProgress());
  }, []);

  return {
    progress,
    isLoading,
    logCalm,
    logSkill,
    earnBadge,
    resetAll
  };
};
