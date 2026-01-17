/**
 * Achievements Display Component
 * 
 * Shows user achievements with earned/unearned states
 */

'use client';

import { useAchievementsByCategory, useAchievementProgress } from '@/lib/achievements/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryTitles = {
  'getting-started': 'Getting Started',
  'consistency': 'Consistency',
  'completion': 'Completion',
  'exploration': 'Exploration',
};

export function AchievementsDisplay() {
  const achievementsByCategory = useAchievementsByCategory();
  const progress = useAchievementProgress();

  const categories = Object.keys(categoryTitles) as Array<keyof typeof categoryTitles>;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>
              {progress}% unlocked
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{progress}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
        <Progress value={progress} className="mt-4" />
      </CardHeader>
      <CardContent className="space-y-6">
        {categories.map(category => {
          const achievements = achievementsByCategory[category] || [];
          if (achievements.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {categoryTitles[category]}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      achievement.earned
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-muted bg-muted/20 opacity-60'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'text-3xl transition-all',
                        !achievement.earned && 'grayscale opacity-40'
                      )}>
                        {achievement.earned ? achievement.icon : <Lock className="w-8 h-8 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          'font-semibold text-sm mb-1',
                          achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                        )}>
                          {achievement.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {achievement.requirement}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
