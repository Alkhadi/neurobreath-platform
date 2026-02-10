'use client';

import { useProgress } from '@/hooks/autism/use-progress';
import { badges } from '@/lib/data/badges';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Flame, Clock, Target, RotateCcw, Award } from 'lucide-react';
import type { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import * as LucideIcons from 'lucide-react';
import styles from './progress-dashboard.module.css';

const WeeklyChart = dynamic(
  () => import('./weekly-chart'),
  { ssr: false, loading: () => <div className="h-32 bg-muted/20 animate-pulse rounded" /> }
);

export const ProgressDashboard = () => {
  const { progress, resetAll } = useProgress();

  const badgeClassById: Record<string, { borderClass: string; iconClass: string }> = {
    'first-calm': { borderClass: styles.borderFirstCalm, iconClass: styles.iconFirstCalm },
    'three-day-streak': { borderClass: styles.borderThreeDayStreak, iconClass: styles.iconThreeDayStreak },
    'visual-supports-starter': { borderClass: styles.borderVisualSupportsStarter, iconClass: styles.iconVisualSupportsStarter },
    'transition-pro': { borderClass: styles.borderTransitionPro, iconClass: styles.iconTransitionPro },
    'sensory-planner': { borderClass: styles.borderSensoryPlanner, iconClass: styles.iconSensoryPlanner },
    'communication-supporter': { borderClass: styles.borderCommunicationSupporter, iconClass: styles.iconCommunicationSupporter },
    'inclusive-classroom': { borderClass: styles.borderInclusiveClassroom, iconClass: styles.iconInclusiveClassroom },
    'workplace-ally': { borderClass: styles.borderWorkplaceAlly, iconClass: styles.iconWorkplaceAlly },
    'plan-creator': { borderClass: styles.borderPlanCreator, iconClass: styles.iconPlanCreator },
    'toolkit-builder': { borderClass: styles.borderToolkitBuilder, iconClass: styles.iconToolkitBuilder },
    'seven-day-warrior': { borderClass: styles.borderSevenDayWarrior, iconClass: styles.iconSevenDayWarrior },
    'self-advocate': { borderClass: styles.borderSelfAdvocate, iconClass: styles.iconSelfAdvocate },
    'research-explorer': { borderClass: styles.borderResearchExplorer, iconClass: styles.iconResearchExplorer },
    'pathway-navigator': { borderClass: styles.borderPathwayNavigator, iconClass: styles.iconPathwayNavigator },
    'interactive-expert': { borderClass: styles.borderInteractiveExpert, iconClass: styles.iconInteractiveExpert },
    'ai-assistant-user': { borderClass: styles.borderAiAssistantUser, iconClass: styles.iconAiAssistantUser }
  };

  // Get last 7 days for chart
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        minutes: progress?.weeklyActivity?.[dateStr] ?? 0
      });
    }
    return days;
  };

  const weeklyData = getLast7Days();

  // Check earned badges
  const earnedBadges = badges?.filter?.(b =>
    progress?.earnedBadges?.includes?.(b?.id)
  ) ?? [];

  const handleReset = () => {
    if (window?.confirm?.('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetAll?.();
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl font-bold">Your Progress</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset stats
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Current Streak</h3>
            </div>
            <p className="text-3xl font-bold">{progress?.currentStreak ?? 0} days</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Total Sessions</h3>
            </div>
            <p className="text-3xl font-bold">{progress?.totalSessions ?? 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Total Minutes</h3>
            </div>
            <p className="text-3xl font-bold">{progress?.totalMinutes ?? 0}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-sm text-muted-foreground">Skills Practiced</h3>
            </div>
            <p className="text-3xl font-bold">{progress?.skillsPracticed?.size ?? 0}</p>
          </Card>
        </div>

        {/* Weekly Activity Chart */}
        <Card className="p-6 mb-8">
          <h3 className="font-semibold mb-4">Weekly Activity</h3>
          <WeeklyChart data={weeklyData} />
        </Card>

        {/* Badges */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Badges Earned ({earnedBadges?.length ?? 0}/{badges?.length ?? 0})
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {badges?.map?.((badge) => {
              const isEarned = earnedBadges?.some?.(b => b?.id === badge?.id);
              const IconComponent = (LucideIcons as unknown as Record<string, ComponentType<{ className?: string }>>)?.[badge?.icon];
              const badgeClasses = badge?.id ? badgeClassById[badge.id] : undefined;

              return (
                <div
                  key={badge?.id}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isEarned
                      ? `${badgeClasses?.borderClass ?? ''} bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900`
                      : 'border-dashed border-gray-300 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {IconComponent && (
                      <IconComponent
                        className={`h-6 w-6 ${isEarned ? (badgeClasses?.iconClass ?? '') : 'text-gray-400'}`}
                      />
                    )}
                    <h4 className="font-semibold text-sm">{badge?.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">{badge?.description}</p>
                </div>
              );
            })}
          </div>
        </Card>

        <p className="text-sm text-muted-foreground text-center mt-6">
          All data is stored locally on your device only. No personal information is collected.
        </p>
      </div>
    </section>
  );
};
