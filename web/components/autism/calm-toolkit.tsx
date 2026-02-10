'use client';

import { useState, useRef } from 'react';
import { breathingExercises } from '@/lib/data/breathing-exercises';
import { calmingTechniques } from '@/lib/data/calming-techniques';
import { useProgress } from '@/hooks/autism/use-progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wind, Play, Pause, RotateCcw, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type BreathingExercise = (typeof breathingExercises)[number];
type CalmingTechnique = (typeof calmingTechniques)[number];

export const CalmToolkit = () => {
  const calmRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={calmRef} className="py-12 bg-gradient-to-br from-blue-50 via-green-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center gap-3 mb-8">
          <Wind className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold">Calm & Co-regulation Toolkit</h2>
        </div>

        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="calming">Calming Techniques</TabsTrigger>
          </TabsList>

          <TabsContent value="breathing">
            <div className="grid gap-6 md:grid-cols-2">
              {breathingExercises?.map?.(exercise => (
                <BreathingExerciseCard key={exercise?.id} exercise={exercise} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calming">
            <div className="grid gap-6 md:grid-cols-2">
              {calmingTechniques?.map?.(technique => (
                <CalmingTechniqueCard key={technique?.id} technique={technique} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

interface BreathingExerciseCardProps {
  exercise: BreathingExercise;
}

const BreathingExerciseCard = ({ exercise }: BreathingExerciseCardProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(exercise?.duration ?? 120);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { logCalm } = useProgress();
  const { toast } = useToast();

  const startExercise = () => {
    setIsRunning(true);
    setSecondsRemaining(exercise?.duration ?? 120);

    // Main countdown
    intervalRef.current = setInterval(() => {
      setSecondsRemaining((prev: number) => {
        if (prev <= 1) {
          stopExercise(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Breathing phase cycle
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
      if (!isRunning) return;

      const phase = phases?.[phaseIndex % phases?.length];
      setCurrentPhase(phase?.name ?? '');

      phaseIntervalRef.current = setTimeout(() => {
        phaseIndex++;
        runPhase();
      }, (phase?.duration ?? 4) * 1000);
    };

    runPhase();
  };

  const stopExercise = (completed: boolean = false) => {
    setIsRunning(false);
    setCurrentPhase('');
    if (intervalRef?.current) clearInterval(intervalRef?.current);
    if (phaseIntervalRef?.current) clearTimeout(phaseIntervalRef?.current);

    if (completed) {
      const minutes = Math.round((exercise?.duration ?? 120) / 60);
      logCalm?.(exercise?.id ?? 'breathing', minutes);
      toast?.({
        title: 'Well done!',
        description: `You completed ${exercise?.name}`,
      });
    }

    setSecondsRemaining(exercise?.duration ?? 120);
  };

  const resetExercise = () => {
    stopExercise(false);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-2">{exercise?.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{exercise?.description}</p>

      <div className="bg-muted/30 p-4 rounded-lg mb-4 text-center">
        <p className="text-sm font-medium mb-2">{exercise?.pattern}</p>
        {isRunning && (
          <p className="text-2xl font-bold text-blue-600">{currentPhase}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')} remaining
        </p>
      </div>

      {exercise?.warnings && exercise?.warnings?.length > 0 && (
        <div className="flex items-start gap-2 mb-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-1">
            {exercise?.warnings?.map?.((warning: string, idx: number) => (
              <p key={idx}>{warning}</p>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!isRunning ? (
          <Button onClick={startExercise} className="flex-1 gap-2">
            <Play className="h-4 w-4" />
            Start
          </Button>
        ) : (
          <>
            <Button onClick={() => stopExercise(false)} variant="outline" className="flex-1">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button onClick={resetExercise} variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

interface CalmingTechniqueCardProps {
  technique: CalmingTechnique;
}

const CalmingTechniqueCard = ({ technique }: CalmingTechniqueCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { logCalm } = useProgress();
  const { toast } = useToast();

  const handleComplete = () => {
    logCalm?.(technique?.id ?? 'calming', technique?.duration ?? 3);
    toast?.({
      title: 'Logged!',
      description: `You practiced: ${technique?.name}`,
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-2">{technique?.name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{technique?.description}</p>

      <p className="text-sm text-muted-foreground mb-4">
        Duration: ~{technique?.duration} {technique?.duration === 1 ? 'minute' : 'minutes'}
      </p>

      {isExpanded && (
        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Steps:</p>
          <ol className="text-sm space-y-2 list-decimal list-inside">
            {technique?.steps?.map?.((step: string, idx: number) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded?.(!isExpanded)}
          className="flex-1"
        >
          {isExpanded ? 'Show less' : 'Show steps'}
        </Button>
        <Button size="sm" onClick={handleComplete} className="gap-2">
          <Check className="h-4 w-4" />
          Log practice
        </Button>
      </div>
    </Card>
  );
};
