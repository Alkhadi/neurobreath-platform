"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Zap, Timer, Coffee, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { initADHDStore, getProgress as getADHDProgress, logFocusSession, type ADHDProgress } from '@/lib/adhd-progress-store';

type Mode = 'work' | 'break' | 'longBreak';

export function FocusPomodoro() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [todayFocusMinutes, setTodayFocusMinutes] = useState(0);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initADHDStore();
    const progress: ADHDProgress = getADHDProgress();
    setCompletedPomodoros(progress.focus.totalPomodoros);
    setTodayFocusMinutes(progress.focus.totalFocusMinutes);
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    
    if (mode === 'work') {
      // Log work session
      logFocusSession(workDuration, 'work');
      
      // Update local state
      const progress: ADHDProgress = getADHDProgress();
      setCompletedPomodoros(progress.focus.totalPomodoros);
      setTodayFocusMinutes(progress.focus.totalFocusMinutes);

      if (progress.focus.totalPomodoros % 4 === 0) {
        setMode('longBreak');
        setTimeLeft(15 * 60);
      } else {
        setMode('break');
        setTimeLeft(breakDuration * 60);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Focus Session Complete! 🎉', {
          body: 'Time for a break. You did great!',
          icon: '/favicon.svg'
        });
      }
    } else {
      // Log break session
      const breakTime = mode === 'longBreak' ? 15 : breakDuration;
      logFocusSession(breakTime, 'break');
      
      setMode('work');
      setTimeLeft(workDuration * 60);
      
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Over! 💪', {
          body: 'Ready to tackle the next focus session?',
          icon: '/favicon.svg'
        });
      }
    }
  }, [breakDuration, mode, workDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [handleTimerComplete, isActive, timeLeft]);

  const toggleTimer = () => {
    if (!isActive && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(workDuration * 60);
  };

  const updateWorkDuration = (value: number[]) => {
    const newDuration = value[0];
    setWorkDuration(newDuration);
    if (mode === 'work' && !isActive) {
      setTimeLeft(newDuration * 60);
    }
  };

  const updateBreakDuration = (value: number[]) => {
    const newDuration = value[0];
    setBreakDuration(newDuration);
    if (mode === 'break' && !isActive) {
      setTimeLeft(newDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = mode === 'work' ? workDuration * 60 : (mode === 'longBreak' ? 15 * 60 : breakDuration * 60);
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  const getModeColor = () => {
    switch (mode) {
      case 'work': return 'from-blue-500 to-purple-600';
      case 'break': return 'from-green-500 to-teal-600';
      case 'longBreak': return 'from-orange-500 to-red-600';
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'work': return 'Focus Time 🎯';
      case 'break': return 'Short Break ☕';
      case 'longBreak': return 'Long Break 🌟';
    }
  };

  if (!mounted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Focus Timer...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={`border-2 bg-gradient-to-br ${mode === 'work' ? 'from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-300 dark:border-blue-700' : mode === 'break' ? 'from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950 border-green-300 dark:border-green-700' : 'from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border-orange-300 dark:border-orange-700'}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Timer className="w-6 h-6" />
                ADHD-Friendly Focus Timer
              </CardTitle>
              <CardDescription>Flexible Pomodoro for ADHD brains - adjust as needed!</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pb-4 border-b"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Work Duration: {workDuration} min</label>
                  <Slider
                    value={[workDuration]}
                    onValueChange={updateWorkDuration}
                    min={5}
                    max={45}
                    step={5}
                    className="w-full"
                    disabled={isActive}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Break Duration: {breakDuration} min</label>
                  <Slider
                    value={[breakDuration]}
                    onValueChange={updateBreakDuration}
                    min={3}
                    max={15}
                    step={1}
                    className="w-full"
                    disabled={isActive}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center space-y-4">
            <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${getModeColor()} text-white`}>
              {getModeLabel()}
            </Badge>

            <motion.div
              key={timeLeft}
              initial={{ scale: 1 }}
              animate={{ scale: isActive && timeLeft % 60 === 0 ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className="text-7xl font-bold font-mono"
            >
              {formatTime(timeLeft)}
            </motion.div>

            <Progress value={getProgress()} className="h-3" />

            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={toggleTimer}
                className={`w-32 bg-gradient-to-r ${getModeColor()} text-white hover:opacity-90`}
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={resetTimer}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <Card className="bg-white/50 dark:bg-black/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <div>
                    <div className="text-xl font-bold">{completedPomodoros}</div>
                    <div className="text-xs text-muted-foreground">Today's Pomodoros</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-black/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Timer className="w-6 h-6 text-blue-500" />
                  <div>
                    <div className="text-xl font-bold">{todayFocusMinutes}</div>
                    <div className="text-xs text-muted-foreground">Focus Minutes</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/50 dark:bg-black/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Coffee className="w-6 h-6 text-green-500" />
                  <div>
                    <div className="text-xl font-bold">{completedPomodoros * breakDuration}</div>
                    <div className="text-xs text-muted-foreground">Break Minutes</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-4">
              <div className="text-sm space-y-2">
                <p className="font-medium">💡 ADHD Tips for Focus Sessions:</p>
                <ul className="space-y-1 pl-4 text-muted-foreground">
                  <li>• If hyperfocused, it's OK to skip breaks!</li>
                  <li>• Struggling? Reduce work time to 10-15 min</li>
                  <li>• Use website blockers during focus time</li>
                  <li>• Move your body during breaks (no scrolling!)</li>
                  <li>• Track completions for that dopamine hit 🎯</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
