'use client';

import { useState, useRef, useEffect } from 'react';
import { breathingExercises } from '@/lib/data/breathing-exercises';
import { calmingTechniques } from '@/lib/data/calming-techniques';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wind, Play, Pause, RotateCcw, Check, AlertTriangle, Star, StarOff, Smile, Meh, Frown, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { logCalmSession, toggleFavoriteExercise, loadProgress } from '@/lib/progress-store-enhanced';
import type { MoodRating } from '@/lib/types';
import { toast } from 'sonner';

interface CalmToolkitEnhancedProps {
  onProgressUpdate?: () => void;
}

// Helper Components - Defined Before Main Component
interface TechniqueCardProps {
  technique: any;
  progress: any;
  onUpdate: () => void;
}

const CalmingTechniqueCard = ({ technique, progress, onUpdate }: TechniqueCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const timerRef = useRef<any>(null);

  const startTechnique = () => {
    setIsActive(true);
    setCurrentStep(0);
    setTimeSpent(0);
    
    timerRef.current = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
  };

  const nextStep = () => {
    if (currentStep < (technique?.steps?.length || 0) - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeTechnique();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeTechnique = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const minutes = Math.max(1, Math.ceil(timeSpent / 60));
    const result = logCalmSession(technique.id, minutes, undefined, undefined, `Completed all ${technique.steps.length} steps`);
    
    onUpdate();
    
    // Build comprehensive feedback
    const messages: string[] = [];
    messages.push(`💎 +${result.xpAwarded} XP earned!`);
    
    if (result.starsEarned > 0) {
      messages.push(`⭐ +${result.starsEarned} star${result.starsEarned > 1 ? 's' : ''} earned!`);
    }
    
    if (result.comboInfo.current >= 2) {
      messages.push(`🔥 ${result.comboInfo.current}-day combo!`);
    }
    
    if (result.leveledUp) {
      messages.push(`🎉 LEVEL UP!`);
    }
    
    if (result.questsCompleted.length > 0) {
      messages.push(`✅ ${result.questsCompleted.length} quest${result.questsCompleted.length > 1 ? 's' : ''} completed!`);
    }
    
    if (result.milestonesCompleted.length > 0) {
      result.milestonesCompleted.forEach(m => {
        toast.success(`${m.icon} Milestone: ${m.title}!`, { duration: 4000 });
      });
    }
    
    toast.success(messages.join(' '), { duration: 6000 });
    
    setShowSuccess(true);
    setIsComplete(true);
    setIsActive(false);
    
    setTimeout(() => {
      setShowDialog(false);
      setIsComplete(false);
      setShowSuccess(false);
      setCurrentStep(0);
      setTimeSpent(0);
    }, 2500);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((currentStep + 1) / (technique?.steps?.length || 1)) * 100;

  return (
    <>
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden" onClick={() => setShowDialog(true)}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
        
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            {technique?.name}
          </CardTitle>
          <CardDescription>{technique?.description}</CardDescription>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="outline" className="bg-background">{technique?.duration}s</Badge>
            {technique?.tags?.slice(0, 2).map((tag: string) => (
              <Badge key={tag} variant="secondary" className="bg-background">{tag}</Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="relative">
          <Button className="w-full group-hover:scale-105 transition-transform" onClick={(e) => { e.stopPropagation(); setShowDialog(true); }}>
            <Play className="h-4 w-4 mr-2" />
            Start Technique
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open);
        if (!open && timerRef.current) {
          clearInterval(timerRef.current);
          setIsActive(false);
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              {technique?.name}
            </DialogTitle>
            <DialogDescription>{technique?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Timer and Progress */}
            {isActive && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time Elapsed</span>
                  <span className="text-lg font-bold text-primary">{formatTime(timeSpent)}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">Step {currentStep + 1} of {technique?.steps?.length}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Steps Display */}
            <div className="border rounded-lg p-4 bg-muted/30">
              {!isActive ? (
                <>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {technique?.steps?.length}
                    </span>
                    Steps to Follow:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2">
                    {technique?.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="text-sm">{step}</li>
                    ))}
                  </ol>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {currentStep + 1}
                    </div>
                    <span className="text-xs text-muted-foreground">Current Step</span>
                  </div>
                  <p className="text-lg font-medium leading-relaxed">
                    {technique?.steps?.[currentStep]}
                  </p>
                </div>
              )}
            </div>

            {/* Age Adaptations */}
            {technique?.ageAdaptations && !isActive && (
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Age Adaptations:</h4>
                <div className="space-y-2">
                  {Object.entries(technique.ageAdaptations).map(([age, text]) => (
                    <div key={age} className="text-sm">
                      <Badge variant="outline" className="mr-2">{age}</Badge>
                      <span className="text-muted-foreground">{text as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isActive ? (
                <Button 
                  className="w-full" 
                  onClick={startTechnique}
                  disabled={isComplete}
                >
                  {isComplete ? (
                    <><Check className="h-4 w-4 mr-2" /> Completed!</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Start Guided Practice</>
                  )}
                </Button>
              ) : showSuccess ? (
                <div className="w-full py-3 rounded-md bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <Check className="h-5 w-5" />
                  <span>Technique Completed!</span>
                </div>
              ) : (
                <>
                  {currentStep > 0 && (
                    <Button onClick={previousStep} variant="outline">
                      Previous
                    </Button>
                  )}
                  <Button 
                    onClick={nextStep}
                    className="flex-1"
                  >
                    {currentStep < (technique?.steps?.length || 0) - 1 ? (
                      <>Next Step</>
                    ) : (
                      <><Check className="h-4 w-4 mr-2" /> Complete</>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function CalmToolkitEnhanced({ onProgressUpdate }: CalmToolkitEnhancedProps) {
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    // Load progress only on client side to avoid hydration mismatch
    setProgress(loadProgress());
  }, []);

  return (
    <div className="w-full relative z-0">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Wind className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl md:text-4xl font-bold">Calm & Co-regulation Toolkit</h2>
        </div>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Science-backed breathing exercises and calming techniques. Track your mood and build your calm practice.
        </p>
      </div>

        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="flex w-full max-w-md mx-auto mb-8 relative z-50 bg-muted">
            <TabsTrigger value="breathing" className="flex-1">Breathing Exercises</TabsTrigger>
            <TabsTrigger value="calming" className="flex-1 pb-[2%]">Calming Techniques</TabsTrigger>
          </TabsList>

          <TabsContent value="breathing" className="relative z-10">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {breathingExercises?.map(exercise => (
                <BreathingExerciseCard 
                  key={exercise?.id} 
                  exercise={exercise}
                  progress={progress}
                  onUpdate={() => {
                    setProgress(loadProgress());
                    onProgressUpdate?.();
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calming" className="relative z-10">
            <div className="grid gap-6 md:grid-cols-2">
              {calmingTechniques?.map(technique => (
                <CalmingTechniqueCard 
                  key={technique?.id} 
                  technique={technique}
                  progress={progress}
                  onUpdate={() => {
                    setProgress(loadProgress());
                    onProgressUpdate?.();
                  }}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: any;
  progress: any;
  onUpdate: () => void;
}

const BreathingExerciseCard = ({ exercise, progress, onUpdate }: ExerciseCardProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(exercise?.duration ?? 120);
  const [totalTime, setTotalTime] = useState(0);
  const [showMoodDialog, setShowMoodDialog] = useState(false);
  const [moodBefore, setMoodBefore] = useState<MoodRating | undefined>();
  const [moodAfter, setMoodAfter] = useState<MoodRating | undefined>();
  const [sessionNotes, setSessionNotes] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const intervalRef = useRef<any>(null);
  const phaseIntervalRef = useRef<any>(null);
  const isFavorite = progress?.favoriteExercises?.includes(exercise?.id);

  const startExercise = () => {
    if (!moodBefore) {
      setShowMoodDialog(true);
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setSecondsRemaining(exercise?.duration ?? 120);
    setTotalTime(0);

    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev: number) => {
        if (prev <= 1) {
          completeExercise();
          return 0;
        }
        return prev - 1;
      });
      setTotalTime((prev: number) => prev + 1);
    }, 1000);

    runBreathingCycle();
  };

  const runBreathingCycle = () => {
    let phaseIndex = 0;
    const phases = [
      { name: 'Breathe in', duration: exercise?.inhale ?? 4 },
      ...(exercise?.hold ? [{ name: 'Hold', duration: exercise?.hold }] : []),
      { name: 'Breathe out', duration: exercise?.exhale ?? 4 },
      ...(exercise?.holdAfterExhale ? [{ name: 'Hold', duration: exercise?.holdAfterExhale }] : [])
    ];

    const runPhase = () => {
      const phase = phases[phaseIndex % phases.length];
      setCurrentPhase(phase?.name ?? '');

      if (soundEnabled) {
        playSound(phase?.name);
      }

      phaseIndex++;
      phaseIntervalRef.current = setTimeout(runPhase, (phase?.duration ?? 4) * 1000);
    };

    runPhase();
  };

  const playSound = (phaseName: string) => {
    // Simple beep for phase changes (browser API)
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = phaseName.includes('in') ? 440 : 330;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const pauseExercise = () => {
    setIsPaused(true);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearTimeout(phaseIntervalRef.current);
  };
  const resumeExercise = () => {
    setIsPaused(false);
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev: number) => {
        if (prev <= 1) {
          completeExercise();
          return 0;
        }
        return prev - 1;
      });
      setTotalTime((prev: number) => prev + 1);
    }, 1000);
    runBreathingCycle();
  };

  const completeExercise = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearTimeout(phaseIntervalRef.current);
    
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase('');
    
    // Show mood after dialog
    setShowMoodDialog(true);
  };

  const saveMoodBefore = (mood: MoodRating) => {
    setMoodBefore(mood);
    setShowMoodDialog(false);
    // Small delay to allow dialog to close
    setTimeout(() => startExercise(), 100);
  };

  const saveSession = () => {
    if (totalTime > 0) {
      const minutes = Math.ceil(totalTime / 60);
      const result = logCalmSession(exercise.id, minutes, moodBefore, moodAfter, sessionNotes);
      
      onUpdate();
      
      // Build comprehensive feedback message
      const messages: string[] = [];
      
      // Base XP
      messages.push(`💎 +${result.xpAwarded} XP earned!`);
      
      // Stars
      if (result.starsEarned > 0) {
        messages.push(`⭐ +${result.starsEarned} star${result.starsEarned > 1 ? 's' : ''} earned!`);
      }
      
      // Combo
      if (result.comboInfo.current >= 2) {
        messages.push(`🔥 ${result.comboInfo.current}-day combo!`);
      }
      
      // Level up
      if (result.leveledUp) {
        messages.push(`🎉 LEVEL UP!`);
      }
      
      // Quests
      if (result.questsCompleted.length > 0) {
        messages.push(`✅ ${result.questsCompleted.length} quest${result.questsCompleted.length > 1 ? 's' : ''} completed!`);
      }
      
      // Milestones
      if (result.milestonesCompleted.length > 0) {
        result.milestonesCompleted.forEach(m => {
          toast.success(`${m.icon} Milestone: ${m.title}!`, { duration: 4000 });
        });
      }
      
      // Show main toast
      toast.success(messages.join(' '), { duration: 6000 });
    }
    
    // Reset
    setMoodBefore(undefined);
    setMoodAfter(undefined);
    setSessionNotes('');
    setTotalTime(0);
    setShowMoodDialog(false);
  };

  const resetExercise = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearTimeout(phaseIntervalRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentPhase('');
    setSecondsRemaining(exercise?.duration ?? 120);
    setTotalTime(0);
  };

  const toggleFavorite = () => {
    toggleFavoriteExercise(exercise.id);
    onUpdate();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMoodIcon = (mood?: MoodRating) => {
    if (!mood) return <Meh className="h-6 w-6" />;
    if (mood <= 2) return <Frown className="h-6 w-6 text-red-500" />;
    if (mood === 3) return <Meh className="h-6 w-6 text-yellow-500" />;
    return <Smile className="h-6 w-6 text-green-500" />;
  };

  return (
    <>
      <Card className="bg-white/95 dark:bg-gray-900/95 backdrop-blur group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br opacity-5 pointer-events-none ${
          currentPhase.includes('in') ? 'from-blue-500 to-purple-500' :
          currentPhase.includes('out') ? 'from-green-500 to-teal-500' :
          'from-gray-500 to-gray-600'
        } transition-all duration-1000`} />
        
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 z-[5] p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          ) : (
            <StarOff className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        <CardHeader className="pr-14">
          <CardTitle className="flex items-center gap-2">
            <Wind className="h-5 w-5 text-blue-500" />
            {exercise?.name}
          </CardTitle>
          <CardDescription>{exercise?.description}</CardDescription>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{exercise?.pattern}</Badge>
            <Badge variant="secondary">{exercise?.duration}s</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {isRunning && (
            <div className="text-center space-y-2 p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold">{formatTime(secondsRemaining)}</div>
              <div className="text-lg font-semibold text-primary animate-pulse">
                {currentPhase}
              </div>
            </div>
          )}

          {exercise?.warnings && exercise.warnings.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {exercise.warnings[0]}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {!isRunning && (
              <Button className="flex-1" onClick={startExercise}>
                <Play className="h-4 w-4 mr-2" />
                Start
              </Button>
            )}
            {isRunning && !isPaused && (
              <Button className="flex-1" onClick={pauseExercise} variant="outline">
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
            )}
            {isRunning && isPaused && (
              <Button className="flex-1" onClick={resumeExercise}>
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
            )}
            {isRunning && (
              <>
                <Button onClick={completeExercise} variant="default">
                  <Check className="h-4 w-4" />
                </Button>
                <Button onClick={resetExercise} variant="ghost">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Disable sound' : 'Enable sound'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mood Dialog */}
      <Dialog open={showMoodDialog} onOpenChange={setShowMoodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {!moodBefore ? 'How are you feeling right now?' : 'How are you feeling after the exercise?'}
            </DialogTitle>
            <DialogDescription>
              {!moodBefore 
                ? 'Rate your current mood before starting the exercise'
                : 'Rate your mood after completing the exercise'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <RadioGroup 
              value={moodBefore ? moodBefore.toString() : (moodAfter ? moodAfter.toString() : '')}
              onValueChange={(value) => {
                const mood = parseInt(value) as MoodRating;
                if (!moodBefore) {
                  saveMoodBefore(mood);
                } else {
                  setMoodAfter(mood);
                }
              }}
              className="flex justify-around"
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <div key={rating} className="flex flex-col items-center gap-2">
                  <RadioGroupItem value={rating.toString()} id={`mood-${rating}`} className="sr-only" />
                  <Label 
                    htmlFor={`mood-${rating}`}
                    className="cursor-pointer p-3 rounded-full hover:bg-muted transition-colors"
                  >
                    {getMoodIcon(rating as MoodRating)}
                  </Label>
                  <span className="text-xs text-muted-foreground">{rating}</span>
                </div>
              ))}
            </RadioGroup>

            {moodBefore && moodAfter && (
              <div className="space-y-4">
                <div>
                  <Label>Session Notes (optional)</Label>
                  <Textarea
                    placeholder="Any observations or notes about this session..."
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button className="w-full" onClick={saveSession}>
                  <Check className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
