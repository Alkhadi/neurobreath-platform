"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Trophy, Zap, Star, Sparkles, Flame } from 'lucide-react';
import { weeklyChallenges, getTodaysQuests, type DailyQuest } from '@/lib/data/adhd-quests';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { initADHDStore, getProgress as getADHDProgress, completeQuest as storeCompleteQuest, resetDailyQuests } from '@/lib/adhd-progress-store';

export function DailyQuestsADHD() {
  const [todaysQuests, setTodaysQuests] = useState<DailyQuest[]>([]);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());
  const [totalXP, setTotalXP] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [level, setLevel] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initADHDStore();
    resetDailyQuests();
    
    const quests = getTodaysQuests();
    setTodaysQuests(quests);

    const progress = getADHDProgress();
    setCompletedQuests(new Set(progress.quests.completedToday));
    setTotalXP(progress.quests.totalXP);
    setCurrentStreak(progress.quests.currentStreak);
    setLevel(progress.quests.level);
  }, []);

  const completeQuest = (quest: DailyQuest) => {
    const previousLevel = level;
    
    // Use centralized store
    storeCompleteQuest(quest.id, quest.xp);
    
    // Update local state
    const progress = getADHDProgress();
    setCompletedQuests(new Set(progress.quests.completedToday));
    setTotalXP(progress.quests.totalXP);
    setCurrentStreak(progress.quests.currentStreak);
    setLevel(progress.quests.level);

    // Show confetti on level up or quest complete
    if (progress.quests.level > previousLevel) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    } else {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'starter': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'main': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'bonus': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
      case 'epic': return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[difficulty as keyof typeof colors] || colors.easy;
  };

  const completedCount = todaysQuests.filter(q => completedQuests.has(q.id)).length;
  const progressPercentage = todaysQuests.length > 0 ? (completedCount / todaysQuests.length) * 100 : 0;
  const xpToNextLevel = ((level) * 500) - totalXP;

  if (!mounted) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Loading Quests...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      {showConfetti && typeof window !== 'undefined' && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
        />
      )}

      <div className="space-y-6">
        <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Daily ADHD Quests
                </CardTitle>
                <CardDescription>Complete quests, earn XP, level up your ADHD management!</CardDescription>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">Level {level}</div>
                <div className="text-sm text-muted-foreground">{xpToNextLevel} XP to next</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/50 dark:bg-black/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-500" />
                    <div>
                      <div className="text-2xl font-bold">{totalXP}</div>
                      <div className="text-sm text-muted-foreground">Total XP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8 text-orange-500" />
                    <div>
                      <div className="text-2xl font-bold">{currentStreak}</div>
                      <div className="text-sm text-muted-foreground">Day Streak</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/50 dark:bg-black/20">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-blue-500" />
                    <div>
                      <div className="text-2xl font-bold">{completedCount}/{todaysQuests.length}</div>
                      <div className="text-sm text-muted-foreground">Quests Today</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Today's Progress</span>
                <span className="font-bold">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Today's Quest Board
            </CardTitle>
            <CardDescription>
              Pick your quests and start earning dopamine + XP! 🎯
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <AnimatePresence>
              {todaysQuests.map((quest, index) => {
                const isCompleted = completedQuests.has(quest.id);
                return (
                  <motion.div
                    key={quest.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`transition-all ${isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Button
                            size="icon"
                            variant={isCompleted ? "default" : "outline"}
                            className={`shrink-0 ${isCompleted ? "bg-green-500 hover:bg-green-600" : "hover:bg-purple-100 dark:hover:bg-purple-900"}`}
                            onClick={() => !isCompleted && completeQuest(quest)}
                            disabled={isCompleted}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </Button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through opacity-60' : ''}`}>
                                {quest.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={getCategoryColor(quest.category)}>
                                  {quest.category}
                                </Badge>
                                <Badge variant="outline" className="font-bold text-yellow-600 border-yellow-600">
                                  +{quest.xp} XP
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mt-1">
                              {quest.description}
                            </p>

                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className={getDifficultyBadge(quest.difficulty)}>
                                {quest.difficulty}
                              </Badge>
                              <span className="text-xs text-muted-foreground">⏱️ {quest.duration}</span>
                            </div>

                            {!isCompleted && quest.completionTips.length > 0 && (
                              <details className="mt-3 group">
                                <summary className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium">
                                  💡 Need help? Click for tips
                                </summary>
                                <ul className="mt-2 text-sm text-muted-foreground space-y-1 pl-4 border-l-2 border-blue-300 dark:border-blue-700">
                                  {quest.completionTips.map((tip, i) => (
                                    <li key={i} className="list-disc ml-4">{tip}</li>
                                  ))}
                                </ul>
                              </details>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-300 dark:border-orange-700 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-orange-500" />
              Weekly Epic Challenges
            </CardTitle>
            <CardDescription>
              Level up your ADHD superpowers with these week-long missions! 🚀
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyChallenges.slice(0, 3).map((challenge, index) => (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/50 dark:bg-black/30 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            🎯 {challenge.goal}
                          </Badge>
                          <Badge variant="outline" className="font-bold text-yellow-600 border-yellow-600">
                            +{challenge.xp} XP
                          </Badge>
                          {challenge.badge && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                              🏆 Unlocks Badge
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
