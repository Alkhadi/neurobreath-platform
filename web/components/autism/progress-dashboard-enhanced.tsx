'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { loadProgress, resetProgress, getLevelInfo, getAnalytics, getMasteryLevelName } from '@/lib/progress-store-enhanced';
import { Flame, Trophy, Clock, Target, TrendingUp, RotateCcw, Zap, Award, Star, ChevronUp, Sparkles } from 'lucide-react';
import { badges } from '@/lib/data/badges';
import { toast } from 'sonner';

interface ProgressDashboardEnhancedProps {
  onReset?: () => void;
}

export function ProgressDashboardEnhanced({ onReset }: ProgressDashboardEnhancedProps) {
  const [progress, setProgress] = useState<any>(null);
  const [levelInfo, setLevelInfo] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // Initial load on client side to avoid hydration mismatch
    const currentProgress = loadProgress();
    setProgress(currentProgress);
    setLevelInfo(getLevelInfo(currentProgress));
    setAnalytics(getAnalytics(currentProgress));

    // Update periodically
    const interval = setInterval(() => {
      const updatedProgress = loadProgress();
      setProgress(updatedProgress);
      setLevelInfo(getLevelInfo(updatedProgress));
      setAnalytics(getAnalytics(updatedProgress));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleReset = () => {
    resetProgress();
    setProgress(loadProgress());
    setLevelInfo(getLevelInfo(loadProgress()));
    setAnalytics(getAnalytics(loadProgress()));
    onReset?.();
    toast.success('Progress reset successfully');
  };

  // Show loading state while data is being loaded on client side
  if (!progress || !levelInfo || !analytics) {
    return (
      <section id="progress" className="py-16 bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:via-indigo-950 dark:to-gray-900 scroll-mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const earnedBadges = badges.filter(b => progress?.earnedBadges?.includes(b.id));
  const lockedBadges = badges.filter(b => !progress?.earnedBadges?.includes(b.id));
  const xpProgress = (levelInfo.currentXP / levelInfo.xpToNextLevel) * 100;

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-indigo-600" />
            <h2 className="text-3xl md:text-4xl font-bold">Your Progress</h2>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Track your journey, celebrate achievements, and level up your autism support skills.
          </p>
        </div>

        {/* Level & XP Card */}
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold flex items-center gap-2">
                  <Zap className="h-8 w-8 text-yellow-500" />
                  Level {levelInfo.level}
                </h3>
                <Badge variant="secondary" className="mt-2">{levelInfo.title}</Badge>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{progress.totalXP}</div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to Level {levelInfo.level + 1}</span>
                <span className="font-semibold">{levelInfo.currentXP} / {levelInfo.xpToNextLevel} XP</span>
              </div>
              <Progress value={xpProgress} className="h-4" />
            </div>

            {xpProgress > 75 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-primary">
                <ChevronUp className="h-4 w-4 animate-bounce" />
                <span className="font-medium">Almost there! Keep going!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards - Full Width */}
        <div className="space-y-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flame className="h-4 w-4 text-orange-500" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.currentStreak ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Longest: {progress?.longestStreak ?? 0} days
              </p>
              {progress.streakProtections > 0 && (
                <Badge variant="outline" className="mt-2">
                  {progress.streakProtections} 🛡️ protections
                </Badge>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.totalSessions ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Avg: {analytics.averageSessionLength.toFixed(1)} min
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                Total Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.totalMinutes ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">minutes practiced</p>
            </CardContent>
          </Card>

          {/* Skills Practiced */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-purple-500" />
                Skills Practiced
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{progress?.skillsPracticed?.size ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">unique skills</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="mt-6">
            {/* Weekly Activity - Full Width */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Minutes practiced per day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value: number) => [`${value} min`, 'Practice Time']}
                    />
                    <Bar dataKey="minutes" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mood Improvement */}
            <Card>
              <CardHeader>
                <CardTitle>Calm Session Impact</CardTitle>
                <CardDescription>Your progress metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Mood Improvement Rate</span>
                    <span className="text-2xl font-bold text-green-600">
                      {analytics.moodImprovementRate.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={analytics.moodImprovementRate} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on last {Math.min(10, progress.calmSessions?.length ?? 0)} calm sessions
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Calm sessions</span>
                      <span className="font-medium">{progress.calmSessions?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Skill practices</span>
                      <span className="font-medium">{progress.skillSessions?.length ?? 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total XP earned</span>
                      <span className="font-medium text-primary">{progress.totalXP}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Skills by Mastery</CardTitle>
                <CardDescription>Your most practiced skills</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics.topSkills.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.topSkills.map((skill: any, idx: number) => (
                      <div key={skill.skillId} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                              {idx + 1}
                            </Badge>
                            <div>
                              <div className="font-medium">{skill.skillId.replace(/-/g, ' ')}</div>
                              <div className="text-xs text-muted-foreground">
                                {skill.practiceCount} practices • {skill.totalMinutes} min
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm font-semibold">
                              {getMasteryLevelName(skill.level)}
                            </span>
                          </div>
                        </div>
                        <Progress value={(skill.level / 5) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Start practicing skills to see your progress here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            <div className="space-y-6">
              {/* Earned Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Earned Badges ({earnedBadges.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {earnedBadges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {earnedBadges.map(badge => (
                        <div 
                          key={badge.id} 
                          className="flex flex-col items-center p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border-2 border-yellow-300 dark:border-yellow-600"
                        >
                          <div className="text-4xl mb-2">{badge.icon}</div>
                          <div className="text-sm font-semibold text-center">{badge.name}</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">
                            {badge.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Complete activities to earn your first badge!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Locked Badges */}
              {lockedBadges.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-gray-400" />
                      Locked Badges ({lockedBadges.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {lockedBadges.map(badge => (
                        <div 
                          key={badge.id}
                          className="flex flex-col items-center p-4 rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 opacity-60"
                        >
                          <div className="text-4xl mb-2 grayscale">{badge.icon}</div>
                          <div className="text-sm font-semibold text-center">{badge.name}</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">
                            {badge.description}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Reset Button */}
        <div className="text-center mt-8">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Progress
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all your progress data, including XP, levels, badges, streaks, and session history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground">
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
    </div>
  );
}
