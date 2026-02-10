'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Flame, Clock, Target, Star } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const badges = [
  { id: 'first-step', name: 'First Step', description: 'Completed first session', icon: '👣', unlocked: true },
  { id: 'week-warrior', name: 'Week Warrior', description: '7-day streak', icon: '💪', unlocked: true },
  { id: 'phonics-pro', name: 'Phonics Pro', description: 'Mastered 20 sounds', icon: '🎵', unlocked: false },
  { id: 'word-wizard', name: 'Word Wizard', description: 'Built 50 words', icon: '✨', unlocked: true },
  { id: 'reading-star', name: 'Reading Star', description: '100 minutes practiced', icon: '⭐', unlocked: false },
  { id: 'dedication', name: 'Dedication', description: '30-day streak', icon: '🏆', unlocked: false },
];

export function ProgressDashboard() {
  const { 
    streakDays, 
    minutesToday, 
    totalMinutes, 
    sessionsToday,
    totalSessions,
    gamesCompleted,
    badgesEarned,
    hydrated 
  } = useProgress();

  // Mock data for demonstration (replace with actual data when hydrated)
  const displayStreakDays = hydrated ? streakDays : 5;
  const displayMinutesToday = hydrated ? minutesToday : 15;
  const displayTotalMinutes = hydrated ? totalMinutes : 127;
  const displaySessionsToday = hydrated ? sessionsToday : 2;
  const displayTotalSessions = hydrated ? totalSessions : 18;
  const displayGamesCompleted = hydrated ? gamesCompleted : 12;
  const displayBadgesEarned = hydrated ? badgesEarned.size : 3;

  const dailyGoal = 20; // minutes
  const weeklyGoal = 5; // sessions
  const dailyProgress = Math.min((displayMinutesToday / dailyGoal) * 100, 100);
  const weeklyProgress = Math.min((displaySessionsToday / weeklyGoal) * 100, 100);

  return (
    <section id="progress" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Progress Tracking Dashboard</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Monitor your learning journey with streaks, achievements, and detailed progress metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Streak */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">{displayStreakDays}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">Day Streak</h3>
            <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
          </CardContent>
        </Card>

        {/* Total Minutes */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">{displayTotalMinutes}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">Total Minutes</h3>
            <p className="text-xs text-muted-foreground mt-1">{displayMinutesToday} today</p>
          </CardContent>
        </Card>

        {/* Sessions */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">{displayTotalSessions}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">Total Sessions</h3>
            <p className="text-xs text-muted-foreground mt-1">{displaySessionsToday} today</p>
          </CardContent>
        </Card>

        {/* Games Completed */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                <Star className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-3xl font-bold text-foreground">{displayGamesCompleted}</span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">Games Played</h3>
            <p className="text-xs text-muted-foreground mt-1">Keep practicing!</p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Goals */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Daily Practice Goal</h3>
              <span className="text-sm font-semibold text-muted-foreground">{displayMinutesToday}/{dailyGoal} min</span>
            </div>
            <Progress value={dailyProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {dailyProgress >= 100 ? '✨ Goal achieved! Great work!' : `${Math.round(dailyGoal - displayMinutesToday)} minutes to reach your goal`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Weekly Session Goal</h3>
              <span className="text-sm font-semibold text-muted-foreground">{displaySessionsToday}/{weeklyGoal} sessions</span>
            </div>
            <Progress value={weeklyProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {weeklyProgress >= 100 ? '🏆 Weekly goal crushed!' : `${weeklyGoal - displaySessionsToday} more sessions this week`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Badges & Achievements */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Achievements & Badges</h3>
              <p className="text-sm text-muted-foreground">{displayBadgesEarned} of {badges.length} unlocked</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-600">{displayBadgesEarned} Badges</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  badge.unlocked
                    ? 'border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30'
                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                    {badge.unlocked && (
                      <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300">
                        ✓ Unlocked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <h3 className="text-lg font-bold text-foreground">🌟 Keep Up the Amazing Progress!</h3>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
              Every minute of practice strengthens your brain's reading pathways. Research shows that consistent, 
              daily practice leads to lasting improvements. You're building skills that will serve you for life!
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
