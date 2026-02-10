/**
 * Progress Stats Component
 * 
 * Displays key progress statistics and achievements
 */

'use client';

import { useAnalyticsSummary, useJourneyCompletionRate } from '@/lib/analytics/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target, TrendingUp, Award } from 'lucide-react';

export function ProgressStats() {
  const summary = useAnalyticsSummary();
  const completionRate = useJourneyCompletionRate();

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${summary.currentStreak} days`,
      description: summary.currentStreak > 0 ? 'Keep it going!' : 'Start your streak today',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: Target,
      label: 'Items Saved',
      value: summary.totalSaves,
      description: 'Total saves to My Plan',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: TrendingUp,
      label: 'Completion Rate',
      value: `${completionRate}%`,
      description: `${summary.totalJourneysCompleted} of ${summary.totalJourneysStarted} journeys`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Award,
      label: 'Achievements',
      value: summary.totalAchievements,
      description: 'Milestones earned',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
