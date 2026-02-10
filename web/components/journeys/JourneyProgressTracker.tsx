'use client';

import { useEffect, useRef } from 'react';
import { CheckCircle2, BookmarkIcon, ArrowRight } from 'lucide-react';
import { useMyPlanActions } from '@/lib/user-preferences/useMyPlanActions';
import { useAnalytics } from '@/lib/analytics/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import type { Region } from '@/lib/user-preferences/schema';

interface JourneyProgressTrackerProps {
  journeyId: string;
  journeyTitle: string;
  totalSteps: number;
  currentStepNumber?: number;
  nextStepHref?: string;
  nextStepTitle?: string;
  region?: Region;
}

/**
 * JourneyProgressTracker - Tracks user progress through multi-step journeys
 * 
 * Features:
 * - Save journey to My Plan
 * - Track current step progress
 * - Mark journey complete
 * - Navigate to next step
 */
export function JourneyProgressTracker({
  journeyId,
  journeyTitle,
  totalSteps,
  currentStepNumber = 1,
  nextStepHref,
  nextStepTitle,
  region = 'uk',
}: JourneyProgressTrackerProps) {
  const { setJourneyProgress, getJourneyProgress, clearJourneyProgress, addSavedItem, isSaved } = useMyPlanActions();
  const { trackJourneyStarted, trackJourneyProgress, trackJourneyCompleted } = useAnalytics();
  const journeyStartTimeRef = useRef<number>(Date.now());
  
  const savedToMyPlan = isSaved(journeyId);
  const progress = getJourneyProgress(journeyId);
  const currentStep = progress?.currentStep || currentStepNumber;
  const isCompleted = progress?.completed || false;
  const percentComplete = Math.round((currentStep / totalSteps) * 100);

  // Auto-save journey when component mounts if not already saved
  useEffect(() => {
    if (!savedToMyPlan) {
      addSavedItem('journey', journeyId, journeyTitle, `/journeys/${journeyId}`, ['journey'], region);
      trackJourneyStarted(journeyId, journeyTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update progress when step changes
  useEffect(() => {
    if (currentStepNumber > 0 && currentStepNumber !== currentStep) {
      setJourneyProgress(journeyId, currentStepNumber, totalSteps);
      trackJourneyProgress(journeyId, journeyTitle, percentComplete, currentStepNumber, totalSteps);
    }
  }, [currentStepNumber, currentStep, journeyId, totalSteps, percentComplete, journeyTitle, setJourneyProgress, trackJourneyProgress]);

  const handleMarkComplete = () => {
    setJourneyProgress(journeyId, totalSteps, totalSteps);
    trackJourneyCompleted(journeyId, journeyTitle, journeyStartTimeRef.current);
  };

  const handleContinue = () => {
    if (currentStep < totalSteps) {
      setJourneyProgress(journeyId, currentStep + 1, totalSteps);
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <BookmarkIcon className="w-5 h-5 text-primary" />
              )}
              {journeyTitle}
            </CardTitle>
            <CardDescription>
              {isCompleted
                ? 'Journey completed!'
                : `Step ${currentStep} of ${totalSteps} • ${percentComplete}% complete`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isCompleted && (
          <>
            <Progress value={percentComplete} className="w-full" />
            
            <div className="flex flex-wrap gap-2">
              {nextStepHref && nextStepTitle && currentStep < totalSteps && (
                <Button asChild onClick={handleContinue}>
                  <Link href={nextStepHref}>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    {nextStepTitle}
                  </Link>
                </Button>
              )}
              
              {currentStep >= totalSteps && (
                <Button onClick={handleMarkComplete}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearJourneyProgress(journeyId)}
              >
                Reset Progress
              </Button>
            </div>
          </>
        )}

        {isCompleted && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Great work! Your progress has been saved to My Plan.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/my-plan">View My Plan</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => clearJourneyProgress(journeyId)}>
                Restart Journey
              </Button>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Your progress is saved locally on your device
        </p>
      </CardContent>
    </Card>
  );
}
