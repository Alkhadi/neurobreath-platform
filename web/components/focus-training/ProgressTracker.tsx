"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, CheckCircle2, TrendingUp, Flame, RotateCcw } from 'lucide-react';
import { getProgress, logFocusBlock, resetFocusProgress } from '@/lib/focus-progress-store';
import type { FocusProgress } from '@/lib/focus-progress-store';

export function ProgressTracker() {
  const [progress, setProgress] = useState<FocusProgress | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProgress();
  }, []);

  const loadProgress = () => {
    const data = getProgress();
    setProgress(data);
  };

  const handleReset = () => {
    resetFocusProgress();
    loadProgress();
  };

  if (!mounted || !progress) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Progress...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const stats = [
    {
      icon: <Timer className="w-6 h-6 text-blue-500" />,
      label: 'Total Minutes',
      value: progress.totalMinutes,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      label: 'Completed Blocks',
      value: progress.completedBlocks,
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      label: 'Best Run',
      value: `${progress.bestRun} min`,
      color: 'from-purple-500 to-violet-600'
    },
    {
      icon: <Flame className="w-6 h-6 text-orange-500" />,
      label: 'Current Streak',
      value: `${progress.currentStreak} ${progress.currentStreak === 1 ? 'day' : 'days'}`,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-2xl font-bold">Track Your Progress</h3>
          <p className="text-muted-foreground text-sm sm:text-base">
            Your focus journey at a glance
          </p>
        </div>
        {progress.completedBlocks > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReset}
            className="self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Progress
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-all border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {progress.completedToday > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-lg">Great work today!</h4>
                <p className="text-sm text-muted-foreground">
                  You've completed {progress.completedToday} focus {progress.completedToday === 1 ? 'block' : 'blocks'} today. Keep building momentum!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {progress.completedBlocks === 0 && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <Timer className="w-12 h-12 text-blue-600 mx-auto" />
              <div>
                <h4 className="font-semibold text-lg">Start Your Focus Journey</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Complete your first focus block to begin tracking progress
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
