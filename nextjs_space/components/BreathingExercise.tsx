'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Wind, Play, Pause, RotateCcw, Maximize2, Minimize2, 
  Volume2, VolumeX, AlertTriangle, Car, Clock, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';

const BREATHING_PATTERNS = {
  box: { name: 'Box Breathing', phases: [4, 4, 4, 4], labels: ['Inhale', 'Hold', 'Exhale', 'Hold'] },
  '4-7-8': { name: '4-7-8 Breathing', phases: [4, 7, 8, 0], labels: ['Inhale', 'Hold', 'Exhale', ''] },
  coherent: { name: 'Coherent 5-5', phases: [5, 0, 5, 0], labels: ['Inhale', '', 'Exhale', ''] },
};

const TIME_OPTIONS = [
  { value: 60, label: '1 min' },
  { value: 120, label: '2 min' },
  { value: 180, label: '3 min' },
  { value: 300, label: '5 min' },
  { value: 600, label: '10 min' },
];

const AMBIENT_SOUNDS = [
  { id: 'none', name: 'None', emoji: '🔇' },
  { id: 'rain', name: 'Rain', emoji: '🌧️' },
  { id: 'ocean', name: 'Ocean Waves', emoji: '🌊' },
  { id: 'birds', name: 'Forest Birds', emoji: '🐦' },
  { id: 'bowl', name: 'Singing Bowl', emoji: '🎵' },
  { id: 'wind', name: 'Wind Chimes', emoji: '🎐' },
];

type Pattern = keyof typeof BREATHING_PATTERNS;

export function BreathingExercise() {
  const [pattern, setPattern] = useState<Pattern>('box');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [voiceCoachEnabled, setVoiceCoachEnabled] = useState(true);
  const [ambientSound, setAmbientSound] = useState('none');
  const [targetDuration, setTargetDuration] = useState(60);
  const [showDrivingWarning, setShowDrivingWarning] = useState(true);
  
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientNodesRef = useRef<{
    sources: AudioScheduledSourceNode[];
    gainNode: GainNode | null;
  }>({ sources: [], gainNode: null });

  // Initialize Web Audio Context
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Announce phase changes with voice coach
  useEffect(() => {
    if (!isActive || !voiceCoachEnabled) return;
    
    const currentPattern = BREATHING_PATTERNS[pattern];
    const phaseLabel = currentPattern.labels[phase];
    
    if (phaseLabel && countdown === currentPattern.phases[phase]) {
      speak(phaseLabel);
    }
  }, [phase, countdown, isActive, voiceCoachEnabled, pattern, speak]);

  // Main breathing timer
  useEffect(() => {
    if (!isActive) return;

    const currentPattern = BREATHING_PATTERNS[pattern];
    const phaseTime = currentPattern.phases[phase];

    if (phaseTime === 0) {
      setPhase((p) => (p + 1) % currentPattern.phases.length);
      return;
    }

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
            }
            return nextPhase;
          });
          return currentPattern.phases[(phase + 1) % currentPattern.phases.length];
        }
        return c - 1;
      });
      
      setTotalTime((t) => {
        const newTime = t + 1;
        // Auto-stop when target duration reached
        if (newTime >= targetDuration) {
          setIsActive(false);
          if (voiceCoachEnabled) {
            speak('Session complete. Well done.');
          }
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, countdown, phase, pattern, targetDuration, voiceCoachEnabled, speak]);

  // Create ambient sound generators using Web Audio API
  const createRainSound = (ctx: AudioContext, gainNode: GainNode) => {
    // White noise for rain
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 1000;
    bandpass.Q.value = 0.5;
    
    whiteNoise.connect(bandpass);
    bandpass.connect(gainNode);
    whiteNoise.start();
    
    return [whiteNoise];
  };

  const createOceanSound = (ctx: AudioContext, gainNode: GainNode) => {
    // Low frequency oscillation with noise
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 300;
    
    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = 100;
    
    lfo.connect(lfoGain);
    lfoGain.connect(carrier.frequency);
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    
    carrier.connect(filter);
    filter.connect(gainNode);
    
    lfo.start();
    carrier.start();
    
    return [lfo, carrier];
  };

  const createBirdsSound = (ctx: AudioContext, gainNode: GainNode) => {
    // Random chirping tones
    const sources: OscillatorNode[] = [];
    
    const chirp = () => {
      if (!isActive) return;
      
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 800 + Math.random() * 1200;
      
      const envelope = ctx.createGain();
      envelope.gain.value = 0;
      envelope.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
      envelope.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1 + Math.random() * 0.2);
      
      osc.connect(envelope);
      envelope.connect(gainNode);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
      
      setTimeout(chirp, 1000 + Math.random() * 3000);
    };
    
    chirp();
    return sources;
  };

  const createBowlSound = (ctx: AudioContext, gainNode: GainNode) => {
    // Singing bowl resonance
    const fundamentals = [220, 330, 440];
    const sources: OscillatorNode[] = [];
    
    fundamentals.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.3 / (i + 1);
      
      osc.connect(oscGain);
      oscGain.connect(gainNode);
      osc.start();
      
      sources.push(osc);
    });
    
    return sources;
  };

  const createWindSound = (ctx: AudioContext, gainNode: GainNode) => {
    // Wind chimes with random tones
    const sources: OscillatorNode[] = [];
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00]; // C, D, E, G, A
    
    const chime = () => {
      if (!isActive) return;
      
      const note = notes[Math.floor(Math.random() * notes.length)];
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = note;
      
      const envelope = ctx.createGain();
      envelope.gain.value = 0;
      envelope.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
      
      osc.connect(envelope);
      envelope.connect(gainNode);
      
      osc.start();
      osc.stop(ctx.currentTime + 2);
      
      setTimeout(chime, 2000 + Math.random() * 4000);
    };
    
    chime();
    return sources;
  };

  // Ambient sound management
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
    
    // Create gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.15; // Subtle background volume
    gainNode.connect(ctx.destination);
    ambientNodesRef.current.gainNode = gainNode;
    
    // Create appropriate sound based on selection
    let sources: AudioScheduledSourceNode[] = [];
    
    switch (ambientSound) {
      case 'rain':
        sources = createRainSound(ctx, gainNode);
        break;
      case 'ocean':
        sources = createOceanSound(ctx, gainNode);
        break;
      case 'birds':
        sources = createBirdsSound(ctx, gainNode);
        break;
      case 'bowl':
        sources = createBowlSound(ctx, gainNode);
        break;
      case 'wind':
        sources = createWindSound(ctx, gainNode);
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
    setIsActive(false);
    setPhase(0);
    setCountdown(0);
    setCycles(0);
    setTotalTime(0);
    cancel();
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const currentPattern = BREATHING_PATTERNS[pattern];
  const currentPhaseLabel = currentPattern.labels[phase] || 'Ready';
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
          {/* Voice Coach Toggle */}
          <button
            onClick={() => setVoiceCoachEnabled(!voiceCoachEnabled)}
            className={cn(
              'px-4 py-2 rounded-full transition-all text-sm font-medium flex items-center gap-2',
              voiceCoachEnabled
                ? 'bg-green-500 text-white'
                : 'bg-white/10 text-white/60'
            )}
          >
            {voiceCoachEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            Voice Coach
          </button>

          {/* Ambient Sound Selector */}
          <select
            value={ambientSound}
            onChange={(e) => setAmbientSound(e.target.value)}
            className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium border-none outline-none"
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
          <Tabs value={pattern} onValueChange={(v) => setPattern(v as Pattern)} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white/10">
              <TabsTrigger value="box" className="text-white data-[state=active]:bg-white/20">Box</TabsTrigger>
              <TabsTrigger value="4-7-8" className="text-white data-[state=active]:bg-white/20">4-7-8</TabsTrigger>
              <TabsTrigger value="coherent" className="text-white data-[state=active]:bg-white/20">5-5</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Breathing Circle */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className={cn(
                  'w-64 h-64 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-cyan-400/40 to-blue-500/40 backdrop-blur-xl shadow-2xl',
                  'transition-all ease-in-out duration-1000',
                  isActive && currentPhaseLabel === 'Inhale' && 'scale-125',
                  isActive && currentPhaseLabel === 'Exhale' && 'scale-75',
                  isActive && currentPhaseLabel === 'Hold' && 'scale-100'
                )}
                style={{
                  transitionDuration: isActive && (currentPhaseLabel === 'Inhale' || currentPhaseLabel === 'Exhale') ? '3000ms' : '1000ms'
                }}
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
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-12">
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
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted hover:bg-muted/80'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Selection */}
        <Tabs value={pattern} onValueChange={(v) => setPattern(v as Pattern)} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="box">Box</TabsTrigger>
            <TabsTrigger value="4-7-8">4-7-8</TabsTrigger>
            <TabsTrigger value="coherent">5-5</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Voice Coach & Ambient Sound */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Voice Coach</label>
            <Button
              onClick={() => setVoiceCoachEnabled(!voiceCoachEnabled)}
              variant={voiceCoachEnabled ? 'default' : 'outline'}
              className="w-full gap-2"
            >
              {voiceCoachEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {voiceCoachEnabled ? 'On' : 'Off'}
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Ambient Sound</label>
            <select
              value={ambientSound}
              onChange={(e) => setAmbientSound(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
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
                'transition-all ease-in-out duration-1000',
                isActive && currentPhaseLabel === 'Inhale' && 'scale-150',
                isActive && currentPhaseLabel === 'Exhale' && 'scale-75',
                isActive && currentPhaseLabel === 'Hold' && 'scale-110'
              )}
              style={{
                transitionDuration: isActive && (currentPhaseLabel === 'Inhale' || currentPhaseLabel === 'Exhale') ? '3000ms' : '1000ms'
              }}
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
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
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
          {currentPattern.name}. {pattern === 'box' ? 'Equal timing for all phases. Great for focus and calm.' : pattern === '4-7-8' ? 'Calming technique. Hold longer, exhale slower.' : 'Simple and effective. Inhale and exhale equally.'}
        </p>
      </CardContent>
    </Card>
  );
}
