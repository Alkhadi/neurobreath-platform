'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, RotateCcw, Download, Volume2, VolumeX } from 'lucide-react';
// import { useProgress } from '@/hooks/autism/use-progress';

interface TimerConfig {
  currentActivity: string;
  nextActivity: string;
  minutes: number;
  warningAt: number; // minutes before end to show warning
}

const PRESET_TRANSITIONS = [
  { label: 'Screen Time → Homework', current: 'Screen Time', next: 'Homework', duration: 5 },
  { label: 'Play → Dinner', current: 'Playing', next: 'Dinner Time', duration: 10 },
  { label: 'Class → Break', current: 'Lesson', next: 'Break Time', duration: 3 },
  { label: 'Work → Meeting', current: 'Working', next: 'Team Meeting', duration: 15 },
  { label: 'Morning → Leaving', current: 'Getting Ready', next: 'Leaving Home', duration: 20 },
];

export function TransitionTimer() {
  // const { logSession } = useProgress();
  const [config, setConfig] = useState<TimerConfig>({
    currentActivity: '',
    nextActivity: '',
    minutes: 5,
    warningAt: 2,
  });
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create audio element for notifications
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DwumYdBjGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+ltryxnMpBSl+y/DglzsKFGS56emiUhELTKXh8bllHAU2jdXzyo41Bx1uvO/nn0sNEliy6e+uWxgJPZPY88p2KwUme8nw3pM+ChFbsOntoFYTC0mi3/G5Zh4FNIrU8s6AOQYeb7/v5pdKDRJYr+nvrVwZCTuQ1vPJdiwGJnnG8N+UPwoQWK/o7aVUEwtJoN/xuWYdBT2R1/PRgjQGHW689+eZSQ0QVKzp765cGQc9kdXzx3cqBSh5xfDgljwLElev6O2kVRQKSZ/f8bhlHgU0i9Tyz4I0Bh9uve/mnkoOEVWs6O+uXBkHPJDV88l3KwUnecTw4JU+ChFYr+nto1YTC0mf4PG5Zh4FNIvU8tCBNQYfb73v5Z5KDhFUrOjvr10ZBz2Q1fPKeCwGJ3nF8OCVPQoSV6/o7aNWEwxJn+Dxt2YdBjWM1PLPgTYGIHC+7+WeSg4RVK3p765dGQc9kNXzyXcrBSl5xvDglD4LElev6e2kVhMKSZ/f8bhlHgU1i9Ty0II0Bx9vve/mnkoOEVat6O+uXRkHPJHV88t4LAYoecXw35U+ChJXr+jto1YTC0me4PG3Zh0GNYzT8s+CNQYgb77v5Z5KDhJWrOjvrl0ZBzyQ1fPLeCwGKXnF8OCVPQoSV6/o7aNWEwxJnt/yuGUeBjSL1PLPgjQHHm+89+WeSg4SWK/o7a5dGQc9kNXzy3grByl5xvDglT4LEVev6O2jVhMLSZ/f8bdmHQY0i9Tyz4I0Bx5vvO/lnkoOEliu6O+uXRkIPJDV88l4KwYqecXw4JY9CxFWr+jto1YTC0me3/G4ZR4FNYzT8s+CNQYfb73v5p5KDhJVrOjvrV0ZBz2Q1fPLeCwGKHnF8N+UPgoSV67o7aNWEwtJn9/xt2YdBjSL0/LPgjUGH2+97+WeS g4SWK3o7a5dGQc9kNXzy3grBil5xfDglTwKEleu6O2jVRMLSp/f8bhlHgU1i9Tyz4I0Bx9vve/lnkoOEliu6O+uXRkHPZDV88l4KwYpecXw4JU9ChJXr+jto1YTC0me3/G4ZR4FNYvU8s+CNQYfb73v5Z5LDhFUrOjvr10ZBzyQ1fPLeCsGKXnF8OCVPQ==';
      audioRef.current = audio;
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          
          // Check for warning threshold (play sound)
          if (soundEnabled && newTime === config.warningAt * 60 && audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
          
          // Check for completion
          if (newTime === 0 && audioRef.current && soundEnabled) {
            audioRef.current.play().catch(() => {});
          }
          
          if (newTime <= 0) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, config.warningAt, config.minutes, soundEnabled]);

  const handlePresetSelect = (preset: typeof PRESET_TRANSITIONS[0]) => {
    setConfig({
      currentActivity: preset.current,
      nextActivity: preset.next,
      minutes: preset.duration,
      warningAt: Math.max(1, Math.floor(preset.duration / 3)),
    });
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(0);
  };

  const startTimer = () => {
    if (!config.currentActivity || !config.nextActivity || config.minutes <= 0) {
      return;
    }
    setTimeLeft(config.minutes * 60);
    setIsRunning(true);
    setIsComplete(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsComplete(false);
  };

  const exportScript = () => {
    const script = generateScript();
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transition-timer-${config.currentActivity.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateScript = () => {
    return `TRANSITION TIMER SCRIPT
========================

Current Activity: ${config.currentActivity}
Next Activity: ${config.nextActivity}
Duration: ${config.minutes} minutes
Warning: ${config.warningAt} minutes before end

--- VISUAL TIMER INSTRUCTIONS ---

1. Show a large visual timer (analog clock or progress bar)
2. Display "NOW: ${config.currentActivity}" prominently
3. Display "NEXT: ${config.nextActivity}" below

--- TIME WARNINGS ---

At ${config.warningAt} minutes remaining:
  • Change timer color to yellow/amber
  • Optional: Play gentle sound
  • Say: "${config.warningAt} minutes until ${config.nextActivity}"

At 1 minute remaining:
  • Change timer color to red
  • Say: "1 minute until ${config.nextActivity}"

At 0 minutes:
  • Play completion sound
  • Say: "Time to ${config.nextActivity}!"
  • Show "NOW: ${config.nextActivity}" screen

--- TIPS FOR USE ---

✓ Place timer in visible location
✓ Use consistent colors (green→yellow→red)
✓ Adjust warning times based on individual needs
✓ Provide 2-minute warning for more complex transitions
✓ Consider using a visual "first-then" board alongside

Evidence: Visual timers reduce transition anxiety (NICE CG170)
Citation: https://www.nice.org.uk/guidance/cg170
`;
  };

  const progressPercentage = config.minutes > 0 && timeLeft > 0
    ? ((config.minutes * 60 - timeLeft) / (config.minutes * 60)) * 100
    : 0;

  const isWarningZone = timeLeft > 0 && timeLeft <= config.warningAt * 60;
  const isCriticalZone = timeLeft > 0 && timeLeft <= 60;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Transition Timer Script</CardTitle>
            <CardDescription>
              Visual timer for smooth activity transitions (Evidence: NICE CG170)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preset Transitions */}
        <div>
          <Label className="mb-2 block">Quick Start (Presets)</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_TRANSITIONS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Configuration */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="current">Current Activity</Label>
            <Input
              id="current"
              value={config.currentActivity}
              onChange={(e) => setConfig({ ...config, currentActivity: e.target.value })}
              placeholder="e.g., Screen Time"
              disabled={isRunning}
            />
          </div>
          <div>
            <Label htmlFor="next">Next Activity</Label>
            <Input
              id="next"
              value={config.nextActivity}
              onChange={(e) => setConfig({ ...config, nextActivity: e.target.value })}
              placeholder="e.g., Homework"
              disabled={isRunning}
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select
              value={config.minutes.toString()}
              onValueChange={(val) => setConfig({ ...config, minutes: parseInt(val) })}
              disabled={isRunning}
            >
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5, 10, 15, 20, 30].map((min) => (
                  <SelectItem key={min} value={min.toString()}>
                    {min} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="warning">Warning (minutes before end)</Label>
            <Select
              value={config.warningAt.toString()}
              onValueChange={(val) => setConfig({ ...config, warningAt: parseInt(val) })}
              disabled={isRunning}
            >
              <SelectTrigger id="warning">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 5].filter(w => w < config.minutes).map((min) => (
                  <SelectItem key={min} value={min.toString()}>
                    {min} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Timer Display */}
        {timeLeft > 0 && (
          <Card className={`border-2 ${isCriticalZone ? 'border-red-500 bg-red-50 dark:bg-red-950/20' : isWarningZone ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' : 'border-green-500 bg-green-50 dark:bg-green-950/20'}`}>
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">NOW</p>
                <p className="text-2xl font-bold">{config.currentActivity}</p>
              </div>
              
              <div className="text-center">
                <p className={`text-6xl font-bold tabular-nums ${isCriticalZone ? 'text-red-600 dark:text-red-400' : isWarningZone ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'}`}>
                  {formatTime(timeLeft)}
                </p>
              </div>

              <Progress value={progressPercentage} className="h-4" />

              <div className="text-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground">NEXT</p>
                <p className="text-2xl font-bold">{config.nextActivity}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Message */}
        {isComplete && (
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                Time to {config.nextActivity}! 🎉
              </p>
              <p className="text-sm text-muted-foreground">Great job transitioning!</p>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          {!isRunning && timeLeft === 0 && (
            <Button
              onClick={startTimer}
              disabled={!config.currentActivity || !config.nextActivity}
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          )}
          
          {isRunning && (
            <Button onClick={pauseTimer} variant="outline" size="lg">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          {!isRunning && timeLeft > 0 && (
            <Button onClick={() => setIsRunning(true)} size="lg">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
          )}
          
          {timeLeft > 0 && (
            <Button onClick={resetTimer} variant="outline" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          )}

          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            variant="ghost"
            size="lg"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </Button>

          <Button onClick={exportScript} variant="outline" size="lg">
            <Download className="w-4 h-4 mr-2" />
            Export Script
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
