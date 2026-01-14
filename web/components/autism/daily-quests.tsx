'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { loadProgress, generateDailyQuests } from '@/lib/progress-store-enhanced';
import { Target, Trophy, Zap, Check, Clock } from 'lucide-react';
import type { DailyQuest } from '@/lib/types';

interface DailyQuestsProps {
  onUpdate?: () => void;
}

export function DailyQuests({ onUpdate }: DailyQuestsProps) {
  const [progress, setProgress] = useState<any>(null);
  const [quests, setQuests] = useState<DailyQuest[]>([]);

  useEffect(() => {
    // Load progress only on client side to avoid hydration mismatch
    const currentProgress = loadProgress();
    setProgress(currentProgress);
    
    // Ensure we have quests for today
    const today = new Date().toISOString().split('T')[0];
    if (!currentProgress.dailyQuests.length || currentProgress.dailyQuests[0]?.date !== today) {
      const newQuests = generateDailyQuests();
      setQuests(newQuests);
    } else {
      setQuests(currentProgress.dailyQuests);
    }
  }, []);

  // Update quests when progress updates
  useEffect(() => {
    const interval = setInterval(() => {
      const currentProgress = loadProgress();
      setProgress(currentProgress);
      setQuests(currentProgress.dailyQuests);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const allComplete = completedCount === totalCount && totalCount > 0;

  const getQuestIcon = (type: string) => {
    switch (type) {
      case 'calm': return <Zap className="h-5 w-5 text-blue-500" />;
      case 'skill': return <Target className="h-5 w-5 text-purple-500" />;
      case 'time': return <Clock className="h-5 w-5 text-green-500" />;
      default: return <Trophy className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <h2 className="text-3xl md:text-4xl font-bold">Daily Quests</h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Complete daily challenges to earn bonus XP and build consistent practice habits.
        </p>
      </div>

        {allComplete && (
          <div className="mb-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-400 dark:border-yellow-600">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  🎉 All Quests Complete!
                </h3>
                <p className="text-yellow-800 dark:text-yellow-200">
                  Amazing work! Come back tomorrow for new challenges.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
          {quests.map(quest => {
            const progressPercent = (quest.current / quest.target) * 100;
            
            return (
              <Card 
                key={quest.id}
                className={`relative overflow-hidden transition-all duration-300 ${
                  quest.completed 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                    : 'hover:shadow-lg'
                }`}
              >
                {quest.completed && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-green-500 rounded-full p-2">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}

                <CardHeader className={quest.completed ? 'pr-14' : ''}>
                  <div className="flex items-center gap-2 mb-2">
                    {getQuestIcon(quest.type)}
                    <Badge variant="outline">
                      +{quest.xpReward} XP
                    </Badge>
                  </div>
                  <CardTitle className="text-lg break-words">{quest.title}</CardTitle>
                  <CardDescription className="break-words">{quest.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-semibold">
                        {quest.current} / {quest.target}
                      </span>
                    </div>
                    <Progress 
                      value={progressPercent} 
                      className="h-3"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Daily Quest Stats */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{completedCount}/{totalCount}</div>
              <div className="text-xs text-muted-foreground">Completed Today</div>
            </div>
            {allComplete && (
              <div className="text-center border-l pl-4">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  +{quests.reduce((sum, q) => sum + q.xpReward, 0)} XP
                </div>
                <div className="text-xs text-muted-foreground">Total Earned</div>
              </div>
            )}
          </div>
        </div>
    </div>
  );
}
