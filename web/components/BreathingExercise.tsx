'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Wind, Play, Pause, RotateCcw, Maximize2,
  Volume2, AlertTriangle, Car, Clock, X, Music, Mic, MicOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { 
  useBreathingAudio, 
  BREATHING_PATTERNS, 
  AMBIENT_SOUNDS,
  createEnhancedAmbientSounds,
  type BreathingPattern 
} from '@/hooks/useBreathingAudio';

const TIME_OPTIONS = [
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
];

type VoiceMode = 'audio' | 'tts' | 'off';

interface BreathingExerciseProps {
  initialPattern?: BreathingPattern;
}

export function BreathingExercise({ initialPattern = 'box' }: BreathingExerciseProps) {
  const [pattern, setPattern] = useState<BreathingPattern>(initialPattern);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceMode, setVoiceMode] = useState<VoiceMode>('audio'); // audio, tts, or off
  const [ambientSound, setAmbientSound] = useState('none');
  const [targetDuration, setTargetDuration] = useState(60);
  const [showDrivingWarning, setShowDrivingWarning] = useState(true);
  const [breathCount, setBreathCount] = useState(0);
  
  // Audio hooks
  const { speak, cancel } = useSpeechSynthesis();
  const { 
    playInstructions, 
    pauseInstructions, 
    resumeInstructions, 
    stopInstructions,
    isPlaying: audioPlaying 
  } = useBreathingAudio();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{
    sources: AudioScheduledSourceNode[];
    gainNode: GainNode | null;
  }>({ sources: [], gainNode: null });

  // Initialize Web Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Handle voice coaching - pre-recorded audio or TTS
  useEffect(() => {
    if (!isActive) return;
    
    if (voiceMode === 'audio') {
      // Use pre-recorded breathing instructions
      if (audioPlaying) {
        resumeInstructions();
      } else {
        playInstructions(pattern, true);
      }
    } else if (voiceMode === 'tts') {
      // Use TTS for phase announcements
      const currentPattern = BREATHING_PATTERNS[pattern];
      const phaseData = currentPattern.phases[phase];
      
      if (phaseData && countdown === phaseData.duration) {
        speak(phaseData.name);
      }
    }
  }, [phase, countdown, isActive, voiceMode, pattern, speak, playInstructions, resumeInstructions, audioPlaying]);
  
  // Stop audio when session ends
  useEffect(() => {
    if (!isActive) {
      if (voiceMode === 'audio') {
        pauseInstructions();
      } else if (voiceMode === 'tts') {
        cancel();
      }
    }
  }, [isActive, voiceMode, pauseInstructions, cancel]);

  // Main breathing timer
  useEffect(() => {
    if (!isActive) return;

    const currentPattern = BREATHING_PATTERNS[pattern];
    const phaseTime = currentPattern.phases[phase].duration;

    if (countdown === 0) {
      setCountdown(phaseTime);
    }

    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setPhase((p) => {
            const nextPhase = (p + 1) % currentPattern.phases.length;
            if (nextPhase === 0) {
              setCycles((cy) => cy + 1);
              // Count breaths (one complete cycle)
              setBreathCount((bc) => bc + 1);
            }
            return nextPhase;
          });
          return currentPattern.phases[(phase + 1) % currentPattern.phases.length].duration;
        }
        return c - 1;
      });
      
      setTotalTime((t) => {
        const newTime = t + 1;
        // Auto-stop when target duration reached
        if (newTime >= targetDuration) {
          setIsActive(false);
          if (voiceMode !== 'off') {
            speak('Session complete. Well done.');
          }
          stopInstructions();
          // Save the completed session
          setTimeout(() => {
            if (newTime >= 30 && breathCount > 0) {
              try {
                const session = {
                  pattern: pattern,
                  patternName: BREATHING_PATTERNS[pattern].name,
                  duration: newTime,
                  breaths: breathCount,
                  cycles: cycles,
                  timestamp: new Date().toISOString(),
                  voiceMode: voiceMode,
                  ambientSound: ambientSound,
                  completed: true,
                };
                
                const existingSessions = localStorage.getItem('nb_breathing_sessions');
                const sessions = existingSessions ? JSON.parse(existingSessions) : [];
                sessions.push(session);
                if (sessions.length > 100) sessions.shift();
                localStorage.setItem('nb_breathing_sessions', JSON.stringify(sessions));
                
                // Update stats
                const stats = {
                  totalSessions: sessions.length,
                  totalBreaths: sessions.reduce((sum: number, s: { breaths: number }) => sum + s.breaths, 0),
                  totalMinutes: Math.floor(sessions.reduce((sum: number, s: { duration: number }) => sum + s.duration, 0) / 60),
                  lastSession: new Date().toISOString(),
                };
                localStorage.setItem('nb_breathing_stats', JSON.stringify(stats));
              } catch (e) {
                console.error('Failed to save session:', e);
              }
            }
          }, 100);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, countdown, phase, pattern, targetDuration, voiceMode, speak, stopInstructions, ambientSound, breathCount, cycles]);

  // Ambient sound management with enhanced quality
  useEffect(() => {
    // Stop any existing ambient sounds
    ambientNodesRef.current.sources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Source may already be stopped
      }
    });
    ambientNodesRef.current.sources = [];
    
    if (!isActive || ambientSound === 'none' || !audioContextRef.current) {
      return;
    }

    const ctx = audioContextRef.current;
    
    // Resume audio context (required by some browsers)
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    // Find selected ambient sound configuration
    const selectedSound = AMBIENT_SOUNDS.find(s => s.id === ambientSound);
    
    // Create gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.gain.value = selectedSound?.volume || 0.15;
    gainNode.connect(ctx.destination);
    ambientNodesRef.current.gainNode = gainNode;
    
    // Create appropriate sound based on selection using enhanced generators
    const soundGenerators = createEnhancedAmbientSounds(ctx);
    let sources: AudioScheduledSourceNode[] = [];
    
    switch (ambientSound) {
      case 'cosmic':
        sources = soundGenerators.createCosmicSound(gainNode);
        break;
      case 'rain':
        sources = soundGenerators.createRainSound(gainNode);
        break;
      case 'ocean':
        sources = soundGenerators.createOceanSound(gainNode);
        break;
      case 'birds':
        sources = soundGenerators.createBirdsSound(gainNode);
        break;
      case 'forest':
        sources = soundGenerators.createForestSound(gainNode);
        break;
      case 'fire':
        sources = soundGenerators.createFireSound(gainNode);
        break;
      case 'bowl':
        sources = soundGenerators.createBowlSound(gainNode);
        break;
      case 'tibetan':
        sources = soundGenerators.createTibetanSound(gainNode);
        break;
      case 'meditation':
        sources = soundGenerators.createMeditationSound(gainNode);
        break;
      case 'spiritual':
        sources = soundGenerators.createSpiritualSound(gainNode);
        break;
      case 'wind':
        sources = soundGenerators.createWindSound(gainNode);
        break;
    }
    
    ambientNodesRef.current.sources = sources;

    return () => {
      sources.forEach(source => {
        try {
          source.stop();
        } catch (e) {
          // Source may already be stopped
        }
      });
    };
  }, [ambientSound, isActive]);

  const handleReset = () => {
    // Save session before resetting (only if meaningful progress was made)
    if (totalTime >= 30 && breathCount > 0) {
      saveBreathingSession();
    }
    
    setIsActive(false);
    setPhase(0);
    setCountdown(0);
    setCycles(0);
    setTotalTime(0);
    setBreathCount(0);
    cancel();
    stopInstructions();
  };
  
  // Save breathing session to localStorage
  const saveBreathingSession = () => {
    try {
      const session = {
        pattern: pattern,
        patternName: currentPattern.name,
        duration: totalTime,
        breaths: breathCount,
        cycles: cycles,
        timestamp: new Date().toISOString(),
        voiceMode: voiceMode,
        ambientSound: ambientSound,
      };
      
      // Get existing sessions
      const existingSessions = localStorage.getItem('nb_breathing_sessions');
      const sessions = existingSessions ? JSON.parse(existingSessions) : [];
      
      // Add new session
      sessions.push(session);
      
      // Keep only last 100 sessions
      if (sessions.length > 100) {
        sessions.shift();
      }
      
      // Save back to localStorage
      localStorage.setItem('nb_breathing_sessions', JSON.stringify(sessions));
      
      // Update total stats
      const stats = {
        totalSessions: sessions.length,
        totalBreaths: sessions.reduce((sum: number, s: { breaths: number }) => sum + s.breaths, 0),
        totalMinutes: Math.floor(sessions.reduce((sum: number, s: { duration: number }) => sum + s.duration, 0) / 60),
        lastSession: new Date().toISOString(),
      };
      localStorage.setItem('nb_breathing_stats', JSON.stringify(stats));
    } catch (error) {
      console.error('Failed to save breathing session:', error);
    }
  };
  
  // Save session when component unmounts (if active)
  useEffect(() => {
    return () => {
      if (totalTime >= 30 && breathCount > 0) {
        try {
          const session = {
            pattern: pattern,
            patternName: BREATHING_PATTERNS[pattern].name,
            duration: totalTime,
            breaths: breathCount,
            cycles: cycles,
            timestamp: new Date().toISOString(),
            voiceMode: voiceMode,
            ambientSound: ambientSound,
          };
          
          const existingSessions = localStorage.getItem('nb_breathing_sessions');
          const sessions = existingSessions ? JSON.parse(existingSessions) : [];
          sessions.push(session);
          if (sessions.length > 100) sessions.shift();
          localStorage.setItem('nb_breathing_sessions', JSON.stringify(sessions));
        } catch (e) {
          // Ignore errors during unmount
        }
      }
    };
  }, [pattern, totalTime, breathCount, cycles, voiceMode, ambientSound]);

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  // Cycle voice modes: audio -> tts -> off -> audio
  const cycleVoiceMode = () => {
    setVoiceMode((current) => {
      if (current === 'audio') return 'tts';
      if (current === 'tts') return 'off';
      return 'audio';
    });
  };

  const currentPattern = BREATHING_PATTERNS[pattern];
  const currentPhaseLabel = currentPattern.phases[phase]?.name || 'Ready';
  const remainingTime = targetDuration - totalTime;
  const progressPercentage = (totalTime / targetDuration) * 100;

  // Fullscreen View
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-20" />
        
        {/* Exit Button */}
        <button
          onClick={handleFullscreen}
          className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          aria-label="Exit fullscreen"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Controls Bar */}
        <div className="absolute top-4 left-4 right-16 flex items-center gap-4 flex-wrap">
          {/* Voice Mode Toggle */}
          <button
            onClick={cycleVoiceMode}
            className={cn(
              'px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2',
              voiceMode === 'off'
                ? 'bg-white/10 text-white/60'
                : 'bg-green-500 text-white'
            )}
          >
            {voiceMode === 'audio' && <><Mic className="w-4 h-4" />Guided Audio</>}
            {voiceMode === 'tts' && <><Volume2 className="w-4 h-4" />Voice TTS</>}
            {voiceMode === 'off' && <><MicOff className="w-4 h-4" />Voice Off</>}
          </button>

          {/* Ambient Sound Selector */}
          <label htmlFor="ambient-sound-select-fullscreen" className="sr-only">
            Select ambient sound
          </label>
          <select
            id="ambient-sound-select-fullscreen"
            name="ambientSound"
            value={ambientSound}
            onChange={(e) => setAmbientSound(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border-none outline-none"
            aria-label="Select ambient sound"
            title="Choose background ambient sound"
          >
            {AMBIENT_SOUNDS.map((sound) => (
              <option key={sound.id} value={sound.id} className="bg-gray-900">
                {sound.emoji} {sound.name}
              </option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-2xl w-full space-y-8">
          {/* Pattern Tabs */}
          <Tabs value={pattern} onValueChange={(v) => setPattern(v as BreathingPattern)} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-white/10">
              <TabsTrigger value="box" className="text-white data-[state=active]:bg-white/20">Box</TabsTrigger>
              <TabsTrigger value="4-7-8" className="text-white data-[state=active]:bg-white/20">4-7-8</TabsTrigger>
              <TabsTrigger value="coherent" className="text-white data-[state=active]:bg-white/20">5-5</TabsTrigger>
              <TabsTrigger value="sos" className="text-white data-[state=active]:bg-white/20">SOS</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Breathing Circle */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={cn(
                  'w-64 h-64 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-cyan-400/40 to-blue-500/40 backdrop-blur-xl shadow-2xl',
                  'transition-all ease-in-out',
                  isActive && currentPhaseLabel === 'Inhale' && 'scale-125 [transition-duration:3000ms]',
                  isActive && currentPhaseLabel === 'Exhale' && 'scale-75 [transition-duration:3000ms]',
                  isActive && currentPhaseLabel === 'Hold' && 'scale-100 [transition-duration:1000ms]',
                  !isActive && '[transition-duration:1000ms]'
                )}
              >
                <div className="text-white text-center">
                  <div className="text-7xl font-bold mb-2">{countdown || '—'}</div>
                  <div className="text-2xl font-medium opacity-90">{currentPhaseLabel}</div>
                </div>
              </div>
              
              {/* Pulse Ring */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-white/80 text-sm">
              <span>{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</span>
              <span>{Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')} remaining</span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-500"
            />
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{breathCount}</div>
              <p className="text-sm text-white/60 mt-1">Breaths</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{cycles}</div>
              <p className="text-sm text-white/60 mt-1">Cycles</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
              <p className="text-sm text-white/60 mt-1">Time</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => setIsActive(!isActive)} 
              size="lg" 
              className="gap-2 bg-white text-blue-900 hover:bg-white/90 px-8 py-6 text-lg"
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? 'Pause' : 'Start Breathing'}
            </Button>
            <Button 
              onClick={handleReset} 
              size="lg" 
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-6"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Card View
  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wind className="w-5 h-5 text-cyan-600" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase tracking-wider text-primary font-semibold">
                  Calm Reset • {Math.floor(targetDuration / 60)} {targetDuration >= 120 ? 'Minutes' : 'Minute'}
                </p>
              </div>
              <h2 className="text-lg sm:text-xl font-bold">Breathing Exercise</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Take a moment to breathe. This helps your brain prepare for reading.
              </p>
            </div>
          </div>
          <Button
            onClick={handleFullscreen}
            variant="outline"
            size="icon"
            className="shrink-0"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Driving Warning */}
        {showDrivingWarning && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-xs flex items-start gap-2">
              <div className="flex-1">
                <Car className="w-4 h-4 inline mr-1 text-amber-600" />
                <strong>Important for Drivers:</strong> Only use breathing exercises when parked safely. 
                Never practice while driving as it may cause drowsiness or distraction. 
                Voice coach is designed for stationary use only.
              </div>
              <button
                onClick={() => setShowDrivingWarning(false)}
                className="text-amber-600 hover:text-amber-700"
                aria-label="Dismiss warning"
              >
                <X className="w-4 h-4" />
              </button>
            </AlertDescription>
          </Alert>
        )}

        {/* Time Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Session Duration
          </label>
          <div className="flex gap-2 flex-wrap">
            {TIME_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => setTargetDuration(option.value)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  targetDuration === option.value
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-muted text-gray-900 dark:text-gray-100 hover:bg-muted/80'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Selection */}
        <Tabs value={pattern} onValueChange={(v) => setPattern(v as BreathingPattern)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="box">Box</TabsTrigger>
            <TabsTrigger value="4-7-8">4-7-8</TabsTrigger>
            <TabsTrigger value="coherent">5-5</TabsTrigger>
            <TabsTrigger value="sos">SOS</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Voice Mode & Ambient Sound */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Music className="w-4 h-4" />
              Voice Guidance
            </label>
            <Button
              onClick={cycleVoiceMode}
              variant={voiceMode === 'off' ? 'outline' : 'default'}
              className="w-full gap-2"
            >
              {voiceMode === 'audio' && <><Mic className="w-4 h-4" />Guided Audio</>}
              {voiceMode === 'tts' && <><Volume2 className="w-4 h-4" />Voice TTS</>}
              {voiceMode === 'off' && <><MicOff className="w-4 h-4" />Off</>}
            </Button>
          </div>
          <div className="space-y-2">
            <label htmlFor="ambient-sound-select" className="text-sm font-medium">Ambient Sound</label>
            <select
              id="ambient-sound-select"
              name="ambientSound"
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
              aria-label="Select ambient sound"
            >
              {AMBIENT_SOUNDS.map((sound) => (
                <option key={sound.id} value={sound.id}>
                  {sound.emoji} {sound.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="flex justify-center py-8">
          <div className="relative">
            <div
              className={cn(
                'w-32 h-32 rounded-full flex items-center justify-center',
                'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg',
                'transition-all ease-in-out',
                isActive && currentPhaseLabel === 'Inhale' && 'scale-150 [transition-duration:3000ms]',
                isActive && currentPhaseLabel === 'Exhale' && 'scale-75 [transition-duration:3000ms]',
                isActive && currentPhaseLabel === 'Hold' && 'scale-110 [transition-duration:1000ms]',
                !isActive && '[transition-duration:1000ms]'
              )}
            >
              <div className="text-white text-center">
                <div className="text-3xl font-bold">{countdown || 'Ready'}</div>
                <div className="text-sm">{currentPhaseLabel}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2 justify-center">
          <Button onClick={() => setIsActive(!isActive)} size="lg" className="gap-2 flex-1">
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isActive ? 'Pause' : 'Start Breathing'}
          </Button>
          <Button onClick={handleReset} size="lg" variant="outline">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={handleFullscreen} size="lg" variant="outline">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex justify-around py-4 border-t">
          <div className="text-center">
            <div className="text-xl font-bold">{breathCount}</div>
            <p className="text-xs text-muted-foreground">breaths</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{cycles}</div>
            <p className="text-xs text-muted-foreground">cycles</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}</div>
            <p className="text-xs text-muted-foreground">time</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">{Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}</div>
            <p className="text-xs text-muted-foreground">remaining</p>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          {currentPattern.name}. {currentPattern.description}
        </p>
      </CardContent>
    </Card>
  );
}
