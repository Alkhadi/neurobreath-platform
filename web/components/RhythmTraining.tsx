'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Music, Check, X, Trophy, Volume2 } from 'lucide-react';

interface Pattern {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  pattern: ('tap' | 'rest')[];
  syllables: string[];
  tempo: number;
}

const PATTERNS: Pattern[] = [
  {
    id: 'pattern1',
    name: 'Simple Beat',
    difficulty: 'Beginner',
    pattern: ['tap', 'rest', 'tap', 'rest'],
    syllables: ['cat', 'rest', 'dog', 'rest'],
    tempo: 600
  },
  {
    id: 'pattern2',
    name: 'Double Tap',
    difficulty: 'Beginner',
    pattern: ['tap', 'tap', 'rest', 'tap'],
    syllables: ['sun', 'ny', 'rest', 'day'],
    tempo: 550
  },
  {
    id: 'pattern3',
    name: 'Syllable Flow',
    difficulty: 'Intermediate',
    pattern: ['tap', 'rest', 'tap', 'tap', 'rest'],
    syllables: ['pen', 'rest', 'cil', 'box', 'rest'],
    tempo: 500
  },
  {
    id: 'pattern4',
    name: 'Compound Words',
    difficulty: 'Intermediate',
    pattern: ['tap', 'tap', 'rest', 'tap', 'tap', 'rest'],
    syllables: ['rain', 'bow', 'rest', 'sun', 'set', 'rest'],
    tempo: 480
  },
  {
    id: 'pattern5',
    name: 'Triple Beat',
    difficulty: 'Advanced',
    pattern: ['tap', 'tap', 'tap', 'rest', 'tap', 'rest'],
    syllables: ['beau', 'ti', 'ful', 'rest', 'day', 'rest'],
    tempo: 450
  },
  {
    id: 'pattern6',
    name: 'Complex Rhythm',
    difficulty: 'Advanced',
    pattern: ['tap', 'rest', 'tap', 'tap', 'tap', 'rest', 'tap'],
    syllables: ['yes', 'rest', 'ter', 'day', 'mor', 'rest', 'ning'],
    tempo: 420
  }
];

export function RhythmTraining() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(PATTERNS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userTaps, setUserTaps] = useState<number[]>([]);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [masteredPatterns, setMasteredPatterns] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const patternStartTimeRef = useRef<number>(0);

  useEffect(() => {
    // Load mastered patterns from localStorage
    const saved = localStorage.getItem('rhythm-mastered');
    if (saved) {
      setMasteredPatterns(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Initialize Web Audio API
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      }
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch((error) => {
          // Silently handle already closed context
          console.debug('AudioContext already closed:', error);
        });
      }
    };
  }, []);

  const playTone = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  };

  const playPattern = async () => {
    setIsPlaying(true);
    setCurrentBeat(0);
    patternStartTimeRef.current = Date.now();

    for (let i = 0; i < selectedPattern.pattern.length; i++) {
      setCurrentBeat(i);
      
      if (selectedPattern.pattern[i] === 'tap') {
        playTone(440, 150);
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(selectedPattern.syllables[i]);
          utterance.rate = 1.2;
          utterance.pitch = 1.0;
          utterance.volume = 0.7;
          window.speechSynthesis.speak(utterance);
        }
      }

      await new Promise(resolve => setTimeout(resolve, selectedPattern.tempo));
    }

    setCurrentBeat(-1);
    setIsPlaying(false);
  };

  const handleUserTap = () => {
    if (isPlaying) return;

    const tapTime = Date.now() - patternStartTimeRef.current;
    setUserTaps(prev => [...prev, tapTime]);
    playTone(523, 100);
  };

  const checkRhythm = () => {
    const expectedTaps = selectedPattern.pattern.filter(p => p === 'tap').length;
    const tolerance = selectedPattern.tempo * 0.3;

    if (userTaps.length !== expectedTaps) {
      setFeedback('incorrect');
      setAttempts(prev => prev + 1);
      setTimeout(() => {
        setFeedback(null);
        setUserTaps([]);
      }, 2000);
      return;
    }

    let correctCount = 0;
    let expectedTime = 0;

    for (let i = 0; i < selectedPattern.pattern.length; i++) {
      if (selectedPattern.pattern[i] === 'tap') {
        const tapIndex = correctCount;
        const userTapTime = userTaps[tapIndex];
        
        if (Math.abs(userTapTime - expectedTime) < tolerance) {
          correctCount++;
        }
      }
      expectedTime += selectedPattern.tempo;
    }

    const accuracy = (correctCount / expectedTaps) * 100;

    if (accuracy >= 70) {
      setFeedback('correct');
      setScore(prev => prev + Math.round(accuracy));
      setAttempts(prev => prev + 1);
      
      if (!masteredPatterns.includes(selectedPattern.id)) {
        const updated = [...masteredPatterns, selectedPattern.id];
        setMasteredPatterns(updated);
        localStorage.setItem('rhythm-mastered', JSON.stringify(updated));
      }
    } else {
      setFeedback('incorrect');
      setAttempts(prev => prev + 1);
    }

    setTimeout(() => {
      setFeedback(null);
      setUserTaps([]);
    }, 2000);
  };

  const resetPractice = () => {
    setUserTaps([]);
    setFeedback(null);
    patternStartTimeRef.current = Date.now();
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Rhythm Training Game</CardTitle>
              <CardDescription>Build phonological awareness through rhythm</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-800">
            <Trophy className="h-3 w-3 mr-1" />
            {masteredPatterns.length}/{PATTERNS.length} Mastered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Evidence Banner */}
        <div className="bg-purple-50 dark:bg-purple-950/50 p-4 rounded-lg border-l-4 border-purple-500">
          <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
            <strong>Evidence-Based:</strong> Research shows rhythm training strengthens the neural pathways between rhythm perception and phonological awareness, improving reading skills.
          </p>
        </div>

        {/* Pattern Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Choose a Pattern:</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern.id}
                onClick={() => {
                  setSelectedPattern(pattern);
                  resetPractice();
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedPattern.id === pattern.id
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">{pattern.name}</span>
                  {masteredPatterns.includes(pattern.id) && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${
                    pattern.difficulty === 'Beginner'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                      : pattern.difficulty === 'Intermediate'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100'
                  }`}
                >
                  {pattern.difficulty}
                </Badge>
                <div className="mt-2 flex gap-1">
                  {pattern.pattern.map((beat, idx) => (
                    <div
                      key={idx}
                      className={`h-2 w-2 rounded-full ${
                        beat === 'tap' ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Visualization */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Pattern Visualization:</label>
            <Button
              onClick={playPattern}
              disabled={isPlaying}
              size="sm"
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {isPlaying ? 'Playing...' : 'Listen to Pattern'}
            </Button>
          </div>
          <div className="flex gap-2 flex-wrap p-6 bg-gray-50 dark:bg-gray-900 rounded-lg justify-center">
            {selectedPattern.pattern.map((beat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-200 ${
                    beat === 'tap'
                      ? currentBeat === idx
                        ? 'bg-purple-500 text-white scale-110 animate-pulse'
                        : 'bg-purple-200 dark:bg-purple-800 text-purple-900 dark:text-purple-100'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {beat === 'tap' ? '👏' : '⏸️'}
                </div>
                <span className="text-xs font-medium">{selectedPattern.syllables[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Practice Area */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Now You Try! Tap the button to match the rhythm:</label>
          <div className="flex flex-col items-center gap-4 p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg">
            <Button
              size="lg"
              onClick={handleUserTap}
              disabled={isPlaying}
              className="w-32 h-32 rounded-full bg-purple-500 hover:bg-purple-600 text-white text-4xl shadow-lg hover:scale-105 transition-transform"
            >
              👏
            </Button>
            <div className="flex gap-2">
              {userTaps.map((_, idx) => (
                <div key={idx} className="w-3 h-3 rounded-full bg-purple-500" />
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={checkRhythm} disabled={userTaps.length === 0 || isPlaying}>
                <Check className="h-4 w-4 mr-2" />
                Check My Rhythm
              </Button>
              <Button onClick={resetPractice} variant="outline" disabled={isPlaying}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              feedback === 'correct'
                ? 'bg-green-50 dark:bg-green-950 border-l-4 border-green-500'
                : 'bg-red-50 dark:bg-red-950 border-l-4 border-red-500'
            }`}
          >
            {feedback === 'correct' ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <X className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">
              {feedback === 'correct'
                ? '🎉 Excellent rhythm! You matched the pattern perfectly!'
                : '💪 Keep practicing! Try to match the timing more closely.'}
            </span>
          </div>
        )}

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-purple-500">{attempts}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Attempts</div>
          </div>
        </div>

        {/* Master Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Mastery Progress</span>
            <span className="font-medium">
              {Math.round((masteredPatterns.length / PATTERNS.length) * 100)}%
            </span>
          </div>
          <Progress value={(masteredPatterns.length / PATTERNS.length) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
