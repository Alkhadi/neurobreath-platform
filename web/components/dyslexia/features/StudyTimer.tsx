'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Play, Pause, RefreshCw, Coffee, BookOpen } from 'lucide-react';

export function StudyTimer() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (isBreak) {
      setIsBreak(false);
      setTimeLeft(workMinutes * 60);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Break Over!', { body: 'Time to get back to studying!' });
      }
    } else {
      setSessionsCompleted((prev) => prev + 1);
      setIsBreak(true);
      setTimeLeft(breakMinutes * 60);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Study Session Complete!', { body: 'Great job! Time for a break.' });
      }
    }
  }, [breakMinutes, isBreak, workMinutes]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [handleTimerComplete, isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(workMinutes * 60);
  };

  const requestNotifications = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Study Timer (Pomodoro)
          </h3>
        </div>

        <div className="text-center space-y-4">
          <div className={`p-8 rounded-lg ${
            isBreak
              ? 'bg-green-50 dark:bg-green-950/30'
              : 'bg-blue-50 dark:bg-blue-950/30'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-4">
              {isBreak ? (
                <><Coffee className="w-6 h-6 text-green-600" /> <span className="text-lg font-semibold text-green-600">Break Time</span></>
              ) : (
                <><BookOpen className="w-6 h-6 text-blue-600" /> <span className="text-lg font-semibold text-blue-600">Study Time</span></>
              )}
            </div>
            <div className="text-6xl font-mono font-bold">
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>

          <div className="flex gap-3">
            {!isRunning ? (
              <Button onClick={toggleTimer} className="flex-1" size="lg">
                <Play className="w-5 h-5 mr-2" />
                Start
              </Button>
            ) : (
              <Button onClick={toggleTimer} variant="outline" className="flex-1" size="lg">
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
            )}
            <Button onClick={resetTimer} variant="outline" className="flex-1" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
            <p className="text-sm text-muted-foreground">Sessions Completed Today</p>
            <p className="text-3xl font-bold text-purple-600">{sessionsCompleted}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="study-timer-work-minutes" className="text-sm font-semibold">
              Work Duration (min)
            </label>
            <input
              id="study-timer-work-minutes"
              type="number"
              min="1"
              max="60"
              value={workMinutes}
              onChange={(e) => {
                setWorkMinutes(parseInt(e.target.value));
                if (!isRunning && !isBreak) {
                  setTimeLeft(parseInt(e.target.value) * 60);
                }
              }}
              disabled={isRunning}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="study-timer-break-minutes" className="text-sm font-semibold">
              Break Duration (min)
            </label>
            <input
              id="study-timer-break-minutes"
              type="number"
              min="1"
              max="30"
              value={breakMinutes}
              onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        <Button
          onClick={requestNotifications}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Enable Notifications
        </Button>

        <div className="text-xs text-muted-foreground">
          <p>⏱️ The Pomodoro Technique: Work for 25 minutes, break for 5</p>
          <p className="mt-1">🧠 Regular breaks help maintain focus and prevent fatigue</p>
        </div>
      </CardContent>
    </Card>
  );
}
