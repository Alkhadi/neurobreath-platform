"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Pause, X, CheckCircle2, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { logFocusBlock } from '@/lib/focus-progress-store';

interface TimerPanelProps {
  protocol: {
    id: '2min' | '5min' | '10min';
    title: string;
    duration: string;
    steps: string[];
    color: string;
  };
  onClose: () => void;
  onComplete: () => void;
}

export function TimerPanel({ protocol, onClose, onComplete }: TimerPanelProps) {
  const durationInSeconds = parseInt(protocol.duration) * 60;
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const handleComplete = useCallback(() => {
    setIsActive(false);
    setIsComplete(true);
    
    // Log to progress store
    const duration = parseInt(protocol.duration);
    logFocusBlock(duration, protocol.id);
    
    // Notify parent
    onComplete();
  }, [protocol.duration, protocol.id, onComplete]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, handleComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    return ((durationInSeconds - timeLeft) / durationInSeconds) * 100;
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-x-4 sm:inset-x-auto sm:right-4 bottom-4 sm:w-96 z-50"
      >
        <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-300 shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <CardTitle className="text-xl">Complete!</CardTitle>
                  <p className="text-sm text-muted-foreground">{protocol.title}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-100 dark:bg-green-900/20 border-green-300">
              <AlertDescription className="text-sm">
                Great work! Your progress has been saved. Take a moment to reflect before your next task.
              </AlertDescription>
            </Alert>
            <Button 
              className="w-full mt-4 min-h-[44px]" 
              onClick={onClose}
              size="lg"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Instructions screen before starting
  if (showInstructions && !isActive && timeLeft === durationInSeconds) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed inset-x-4 sm:inset-x-auto sm:right-4 bottom-4 sm:w-96 z-50"
      >
        <Card className={`border-2 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-300 dark:border-blue-700`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${protocol.color}`}>
                  <Timer className="w-6 h-6 text-white flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-lg sm:text-xl truncate">{protocol.title}</CardTitle>
                  <p className="text-xs sm:text-sm text-muted-foreground">{protocol.duration}-minute focus protocol</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-100 dark:bg-blue-900/30 border-blue-300">
              <AlertDescription>
                <p className="font-semibold mb-2 text-sm">Before you begin:</p>
                <ul className="space-y-2 text-sm">
                  {protocol.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Button
                className={`w-full bg-gradient-to-r ${protocol.color} text-white hover:opacity-90 min-h-[48px]`}
                onClick={() => {
                  setShowInstructions(false);
                  setIsActive(true);
                }}
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start {protocol.duration}-Minute Timer
              </Button>
              <Button
                variant="outline"
                className="w-full min-h-[44px]"
                onClick={onClose}
                size="lg"
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              The timer will start immediately when you click "Start"
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Active timer screen
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-x-4 sm:inset-x-auto sm:right-4 bottom-4 sm:w-96 z-50"
    >
      <Card className={`border-2 shadow-2xl ${
        isActive 
          ? 'bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950/30 border-blue-300 dark:border-blue-700' 
          : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'
      }`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Timer className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-muted-foreground'}`} />
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-xl truncate">{protocol.title}</CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {isActive ? 'Focus sprint active' : 'Paused'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="flex-shrink-0">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <motion.div
              key={timeLeft}
              initial={{ scale: 1 }}
              animate={{ scale: isActive && timeLeft % 60 === 0 && timeLeft > 0 ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className="text-5xl sm:text-6xl font-bold font-mono"
            >
              {formatTime(timeLeft)}
            </motion.div>
            <Progress value={getProgress()} className="h-2" />
          </div>

          <div className="flex gap-2">
            <Button
              className={`flex-1 min-h-[44px] ${
                isActive 
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : `bg-gradient-to-r ${protocol.color} text-white hover:opacity-90`
              }`}
              onClick={() => setIsActive(!isActive)}
              size="lg"
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleComplete}
              size="lg"
              className="min-h-[44px] px-4"
            >
              <CheckCircle2 className="w-5 h-5" />
            </Button>
          </div>

          {isActive && (
            <Alert className="bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-700">
              <AlertDescription className="text-xs sm:text-sm">
                <p className="font-medium mb-1 text-green-800 dark:text-green-300">Keep going!</p>
                <p className="text-muted-foreground">
                  {protocol.steps[2] || 'Stay focused on your single task'}
                </p>
              </AlertDescription>
            </Alert>
          )}

          {!isActive && timeLeft < durationInSeconds && (
            <Alert className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-300 dark:border-yellow-700">
              <AlertDescription className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-300">
                Timer paused. Click "Resume" to continue your focus session.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
