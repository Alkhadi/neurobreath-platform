'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Clock, Star } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { cn } from '@/lib/utils';

function calculateStreak(): { streak: number; lastDate: string | null } {
  if (typeof window === 'undefined') return { streak: 0, lastDate: null };
  
  try {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('neurobreath-progress') : null;
    if (!stored) return { streak: 0, lastDate: null };
    
    const data = JSON.parse(stored);
    const today = new Date().toDateString();
    const lastDate = data.lastPracticeDate;
    
    if (!lastDate) return { streak: 0, lastDate: null };
    
    const last = new Date(lastDate);
    const now = new Date();
    
    const daysDiff = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return { streak: data.streakDays || 1, lastDate };
    } else if (daysDiff === 1) {
      const newStreak = (data.streakDays || 0) + 1;
      const updated = { ...data, streakDays: newStreak, lastPracticeDate: today };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('neurobreath-progress', JSON.stringify(updated));
      }
      return { streak: newStreak, lastDate: today };
    } else {
      return { streak: 0, lastDate: null };
    }
  } catch (e) {
    console.error('Streak calculation error:', e);
    return { streak: 0, lastDate: null };
  }
}

export function StreakToolkit() {
  const progress = useProgress();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const { streak: currentStreak } = calculateStreak();
    setStreak(currentStreak);
    
    // Mark today as practiced
    const today = new Date().toDateString();
    if (progress.lastPracticeDate !== today) {
      progress.updateProgress({ 
        lastPracticeDate: today,
        streakDays: currentStreak
      });
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Day Streak */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800">
            <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <p className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">{streak}</p>
            <p className="text-xs sm:text-sm text-muted-foreground">Day Streak</p>
          </div>

          {/* Sessions */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border border-blue-200 dark:border-blue-800">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
              {progress.totalSessions || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Sessions</p>
          </div>

          {/* Minutes */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
            <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              {progress.totalMinutes || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Minutes</p>
          </div>

          {/* Badges */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800">
            <Star className="w-8 h-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400">
              {progress.badgesEarned.size || 0}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* Motivational message */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-center text-muted-foreground">
            {streak > 0 
              ? `🎉 Amazing! ${streak} day streak! Keep it going!`
              : "🌟 Start your practice today to begin your streak!"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
