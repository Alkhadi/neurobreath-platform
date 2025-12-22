'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Volume2, Award, Trophy, Star, Settings, BookOpen, Target, Clock, Sparkles, Check } from 'lucide-react';

// Letter timing data structure
const LETTER_TIMINGS = {
  intro: { start: 0, end: 7.9 },
  letters: [
    { letter: 'A', start: 7.9, callEnd: 10.74, repeatStart: 11.36, repeatEnd: 13.12, end: 15.26, word: 'Apple', tip: 'Open mouth wide' },
    { letter: 'B', start: 15.26, callEnd: 17.9, repeatStart: 18.22, repeatEnd: 19.94, end: 21.82, word: 'Ball', tip: 'Press lips together' },
    { letter: 'C', start: 21.82, callEnd: 24.48, repeatStart: 25.06, repeatEnd: 26.44, end: 27.88, word: 'Cat', tip: 'Back of throat' },
    { letter: 'D', start: 27.88, callEnd: 30.4, repeatStart: 30.88, repeatEnd: 32.42, end: 33.78, word: 'Dog', tip: 'Tongue on roof' },
    { letter: 'E', start: 33.78, callEnd: 36.44, repeatStart: 37.24, repeatEnd: 38.54, end: 40.08, word: 'Egg', tip: 'Short sound' },
    { letter: 'F', start: 40.08, callEnd: 42.58, repeatStart: 43.18, repeatEnd: 44.58, end: 62.38, milestoneEnd: 55, word: 'Fish', tip: 'Bite bottom lip' },
    { letter: 'G', start: 62.38, callEnd: 65.02, repeatStart: 65.42, repeatEnd: 68.12, end: 68.3, word: 'Girl', tip: 'Back of throat' },
    { letter: 'H', start: 68.3, callEnd: 71.04, repeatStart: 71.62, repeatEnd: 73.08, end: 74.4, word: 'Hat', tip: 'Breath out' },
    { letter: 'I', start: 74.4, callEnd: 77.22, repeatStart: 77.62, repeatEnd: 79.28, end: 80.5, word: 'Igloo', tip: 'Short sound' },
    { letter: 'J', start: 80.5, callEnd: 83.32, repeatStart: 83.92, repeatEnd: 85.36, end: 86.76, word: 'Jump', tip: 'Like G + zh' },
    { letter: 'K', start: 86.76, callEnd: 89.1, repeatStart: 89.64, repeatEnd: 91.1, end: 92.54, word: 'Kite', tip: 'Back of throat' },
    { letter: 'L', start: 92.54, callEnd: 94.84, repeatStart: 95.48, repeatEnd: 97, end: 114.72, milestoneEnd: 107.02, word: 'Lion', tip: 'Tongue tip up' },
    { letter: 'M', start: 114.72, callEnd: 117.44, repeatStart: 118.14, repeatEnd: 119.6, end: 120.98, word: 'Mum', tip: 'Lips together' },
    { letter: 'N', start: 120.98, callEnd: 123.56, repeatStart: 124.32, repeatEnd: 125.76, end: 127.4, word: 'Net', tip: 'Tongue on roof' },
    { letter: 'O', start: 127.4, callEnd: 129.88, repeatStart: 130.36, repeatEnd: 131.96, end: 133.12, word: 'Orange', tip: 'Round lips' },
    { letter: 'P', start: 133.12, callEnd: 135.54, repeatStart: 136.18, repeatEnd: 137.38, end: 138.54, word: 'Pig', tip: 'Pop lips' },
    { letter: 'Q', start: 138.54, callEnd: 141, repeatStart: 141.56, repeatEnd: 143.06, end: 144.52, word: 'Queen', tip: 'K + w sound' },
    { letter: 'R', start: 144.52, callEnd: 147.48, repeatStart: 148, repeatEnd: 149.88, end: 167.88, milestoneEnd: 160.02, word: 'Red', tip: 'Tongue curled' },
    { letter: 'S', start: 167.88, callEnd: 170.4, repeatStart: 170.9, repeatEnd: 172.48, end: 173.6, word: 'Sun', tip: 'Hiss like snake' },
    { letter: 'T', start: 173.6, callEnd: 176.12, repeatStart: 176.8, repeatEnd: 178.2, end: 179.48, word: 'Top', tip: 'Tongue tap' },
    { letter: 'U', start: 179.48, callEnd: 182.04, repeatStart: 182.7, repeatEnd: 184.26, end: 185.36, word: 'Up', tip: 'Short sound' },
    { letter: 'V', start: 185.36, callEnd: 188, repeatStart: 188.6, repeatEnd: 190.06, end: 190.92, word: 'Van', tip: 'Bite bottom lip' },
    { letter: 'W', start: 190.92, callEnd: 193.68, repeatStart: 194.06, repeatEnd: 195.74, end: 196.74, word: 'Water', tip: 'Round lips' },
    { letter: 'X', start: 196.74, callEnd: 199.2, repeatStart: 199.76, repeatEnd: 201.12, end: 202.26, word: 'Box', tip: 'K + s sound' },
    { letter: 'Y', start: 202.26, callEnd: 204.82, repeatStart: 205.42, repeatEnd: 206.96, end: 208.06, word: 'Yellow', tip: 'Like yes' },
    { letter: 'Z', start: 208.06, callEnd: 210.52, repeatStart: 211.18, repeatEnd: 212.64, end: 225.8, milestoneEnd: 225.08, word: 'Zebra', tip: 'Buzz like bee' }
  ]
};

const MILESTONES = [
  {
    id: 'bronze',
    label: 'Bronze breath break achieved',
    letters: 'A-F',
    triggerLetter: 'F',
    seconds: 10,
    emoji: '🥉',
    body: 'You just wrapped the A-F repeats with perfect pacing. Hold this bronze pause for a sip of air, then tap Continue to glide into the G-L crew.'
  },
  {
    id: 'silver',
    label: 'Silver sound sweep complete',
    letters: 'G-L',
    triggerLetter: 'L',
    seconds: 10,
    emoji: '🥈',
    body: 'Beautiful focus through the G-L set. Take this silver pause for ten calm seconds of breathing, then tap Continue to meet the M-R team.'
  },
  {
    id: 'gold',
    label: 'Gold glide mastered',
    letters: 'M-R',
    triggerLetter: 'R',
    seconds: 10,
    emoji: '🥇',
    body: 'You have moved through M-R with smooth, steady sound work. Hold this gold pause, breathe out slowly, then tap Continue to glide into the final S-Z stretch.'
  },
  {
    id: 'platinum',
    label: 'Platinum phoneme circuit',
    letters: 'S-Z',
    triggerLetter: 'Z',
    seconds: 12,
    emoji: '💎',
    body: 'Full alphabet circuit complete - S through Z sounded with calm control. Enjoy this platinum spotlight, then decide if you would like to claim an official NeuroBreath certificate.'
  }
];

export default function DyslexiaReadingTraining() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(-1);
  const [currentLetterInfo, setCurrentLetterInfo] = useState<typeof LETTER_TIMINGS.letters[0] | null>(null);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const [earnedMilestones, setEarnedMilestones] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [showQuickStart, setShowQuickStart] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nb_phonics_progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLetters(new Set(data.completedLetters || []));
          setEarnedMilestones(new Set(data.earnedMilestones || []));
          setTotalSessions(data.totalSessions || 0);
          setTotalMinutes(data.totalMinutes || 0);
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }

      // Show quick start on first visit
      const hasSeenQuickStart = localStorage.getItem('nb_phonics_quickstart_seen');
      if (!hasSeenQuickStart) {
        setTimeout(() => {
          setShowQuickStart(true);
          localStorage.setItem('nb_phonics_quickstart_seen', 'true');
        }, 1000);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nb_phonics_progress', JSON.stringify({
        completedLetters: Array.from(completedLetters),
        earnedMilestones: Array.from(earnedMilestones),
        totalSessions,
        totalMinutes,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [completedLetters, earnedMilestones, totalSessions, totalMinutes]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Update current letter based on audio time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);

      // Find current letter
      for (let i = 0; i < LETTER_TIMINGS.letters.length; i++) {
        const info = LETTER_TIMINGS.letters[i];
        if (time >= info.start && time < info.end) {
          setCurrentLetter(info.letter);
          setCurrentLetterIndex(i);
          setCurrentLetterInfo(info);

          // Check if letter is complete
          if (time >= info.repeatEnd) {
            setCompletedLetters(prev => new Set([...prev, info.letter]));

            // Check for milestones
            const milestone = MILESTONES.find(m => m.triggerLetter === info.letter);
            if (milestone && !earnedMilestones.has(milestone.id)) {
              if (time >= (info.milestoneEnd || info.repeatEnd)) {
                setCurrentMilestone(milestone);
                setShowMilestone(true);
                setEarnedMilestones(prev => new Set([...prev, milestone.id]));
                setCountdown(milestone.seconds);
                audio.pause();
                setIsPlaying(false);
              }
            }
          }
          break;
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Track session completion
      const sessionMinutes = Math.round(duration / 60);
      setTotalSessions(prev => prev + 1);
      setTotalMinutes(prev => prev + sessionMinutes);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [earnedMilestones, duration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.pause();
    setIsPlaying(false);
    setCurrentLetter('');
    setCurrentLetterIndex(-1);
    setCurrentLetterInfo(null);
  };

  const handleLetterClick = (letter: string, index: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const info = LETTER_TIMINGS.letters[index];
    audio.currentTime = info.start;
    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const closeMilestone = () => {
    setShowMilestone(false);
    setCurrentMilestone(null);
    setCountdown(0);
  };

  const continueMilestone = () => {
    closeMilestone();
    const audio = audioRef.current;
    if (audio) {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const completionPercentage = Math.round((completedLetters.size / 26) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4 transition-colors">
            <span>&larr;</span>
            <span>Back to NeuroBreath</span>
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Reading Training • NeuroBreath</p>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Professional Reading Development</h1>
              <p className="text-slate-600">Evidence-based phonics techniques for efficient skill enhancement</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowQuickStart(true)}>
                <Target className="w-4 h-4 mr-2" />
                Quick Start
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Column - Stats & Info */}
          <div className="lg:col-span-3 space-y-4">
            {/* Stats Cards */}
            <Card className="p-5 bg-white/90 backdrop-blur border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2.5 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Progress</p>
                  <p className="text-2xl font-bold text-slate-900">{completionPercentage}%</p>
                </div>
              </div>
              <Progress value={completionPercentage} className="h-2" />
              <p className="text-xs text-slate-500 mt-2">{completedLetters.size} of 26 letters</p>
            </Card>

            <Card className="p-5 bg-white/90 backdrop-blur border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-purple-100 p-2.5 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Milestones</p>
                  <p className="text-2xl font-bold text-slate-900">{earnedMilestones.size}/4</p>
                </div>
              </div>
              <div className="flex gap-2">
                {MILESTONES.map(m => (
                  <div
                    key={m.id}
                    className={`text-2xl ${
                      earnedMilestones.has(m.id) ? 'opacity-100 scale-110' : 'opacity-30 grayscale'
                    } transition-all`}
                  >
                    {m.emoji}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 bg-white/90 backdrop-blur border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Sessions</span>
                  <span className="text-lg font-semibold text-slate-900">{totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Minutes</span>
                  <span className="text-lg font-semibold text-slate-900">{totalMinutes}</span>
                </div>
              </div>
            </Card>

            {/* Current Letter Info */}
            {currentLetterInfo && (
              <Card className="p-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                  <div className="text-6xl font-bold mb-2">{currentLetterInfo.letter}</div>
                  <div className="text-lg font-medium mb-1">{currentLetterInfo.word}</div>
                  <div className="text-sm opacity-90">{currentLetterInfo.tip}</div>
                </div>
              </Card>
            )}
          </div>

          {/* Middle Column - Audio Player & Controls */}
          <div className="lg:col-span-6 space-y-4">
            {/* Audio Player */}
            <Card className="p-6 bg-white/95 backdrop-blur border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                    <Volume2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Phonics Sound Lab</h2>
                    <p className="text-sm text-slate-500">Alphabet sounds with Dorothy</p>
                  </div>
                </div>
                {currentLetter && (
                  <div className="text-6xl font-bold text-blue-600 animate-pulse">
                    {currentLetter}
                  </div>
                )}
              </div>

              {/* Audio Element */}
              <audio
                ref={audioRef}
                src="/audio/eleven-labs-phonics-alphabet-sounds-dorothy.mp3"
                preload="metadata"
              />

              {/* Progress Bar */}
              <div className="mb-6">
                <Progress value={progress} className="h-3 bg-slate-200" />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="lg"
                  className="w-32"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={togglePlayPause}
                  size="lg"
                  className="w-40 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isPlaying ? (
                    <><Pause className="w-6 h-6 mr-2" /> Pause</>
                  ) : (
                    <><Play className="w-6 h-6 mr-2" /> Play</>
                  )}
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex gap-2 flex-wrap justify-center">
                <Button variant="outline" size="sm" onClick={() => handleLetterClick('A', 0)}>
                  Start from A
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleLetterClick('G', 6)}>
                  Jump to G
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleLetterClick('M', 12)}>
                  Jump to M
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleLetterClick('S', 18)}>
                  Jump to S
                </Button>
              </div>
            </Card>

            {/* Alphabet Grid */}
            <Card className="p-6 bg-white/95 backdrop-blur border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Alphabet Sound Map</h3>
              <div className="grid grid-cols-13 gap-2">
                {LETTER_TIMINGS.letters.map((info, index) => {
                  const isCompleted = completedLetters.has(info.letter);
                  const isCurrent = currentLetterIndex === index;
                  return (
                    <button
                      key={info.letter}
                      onClick={() => handleLetterClick(info.letter, index)}
                      className={`
                        aspect-square rounded-lg text-lg font-bold transition-all relative group
                        ${isCurrent ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-110 shadow-lg z-10 ring-4 ring-blue-300' : ''}
                        ${isCompleted && !isCurrent ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : ''}
                      `}
                    >
                      {info.letter}
                      {isCompleted && !isCurrent && (
                        <Check className="w-3 h-3 absolute top-0.5 right-0.5 text-green-600" />
                      )}
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-slate-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {info.word}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column - Milestones & Tips */}
          <div className="lg:col-span-3 space-y-4">
            {/* Breathing Breaks */}
            <Card className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900">Breathing Breaks</h3>
              </div>
              <div className="space-y-3">
                {MILESTONES.map((milestone) => {
                  const isEarned = earnedMilestones.has(milestone.id);
                  return (
                    <div
                      key={milestone.id}
                      className={`
                        p-3 rounded-lg transition-all
                        ${isEarned ? 'bg-white shadow-sm border-2 border-amber-300' : 'bg-white/50 border border-slate-200'}
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{milestone.emoji}</span>
                        <div className="flex-1">
                          <div className="text-xs font-semibold text-slate-700">{milestone.letters}</div>
                          <div className="text-xs text-slate-500">{milestone.seconds}s break</div>
                        </div>
                        {isEarned && (
                          <Check className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Tips Card */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900">Practice Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">•</span>
                  <span>Listen first, then repeat</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">•</span>
                  <span>Take breaks at milestones</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">•</span>
                  <span>Practice 5-10 minutes daily</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">•</span>
                  <span>Track your progress</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>

      {/* Milestone Celebration Modal */}
      {showMilestone && currentMilestone && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <Card className="max-w-lg w-full p-8 animate-in zoom-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 rounded-full shadow-2xl animate-in zoom-in spin-in">
                <span className="text-5xl">{currentMilestone.emoji}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentMilestone.label}</h2>
              <p className="text-lg text-slate-600 mb-1 font-medium">{currentMilestone.letters}</p>
              <p className="text-sm text-slate-500 mb-6">{currentMilestone.body}</p>
              
              {countdown > 0 && (
                <div className="mb-6 inline-flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-full border-2 border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span className="text-2xl font-bold text-blue-600">{countdown}s</span>
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <Button onClick={closeMilestone} variant="outline" size="lg">
                  Close
                </Button>
                <Button 
                  onClick={continueMilestone} 
                  size="lg"
                  disabled={countdown > 0}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {countdown > 0 ? `Wait ${countdown}s` : 'Continue Training'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Start Modal */}
      {showQuickStart && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <Card className="max-w-2xl w-full p-8 animate-in zoom-in slide-in-from-bottom-4">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Phonics Lab!</h2>
              <p className="text-slate-600">Evidence-based reading development for all learners</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => {
                  setShowQuickStart(false);
                  handleLetterClick('A', 0);
                }}
                className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-400 transition-all text-left group"
              >
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold text-slate-900 mb-1">Start from A</h3>
                <p className="text-sm text-slate-600">Begin with the full alphabet sequence</p>
              </button>

              <button
                onClick={() => {
                  setShowQuickStart(false);
                  handleLetterClick('M', 12);
                }}
                className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-400 transition-all text-left group"
              >
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-bold text-slate-900 mb-1">Jump to M</h3>
                <p className="text-sm text-slate-600">Continue from the middle section</p>
              </button>

              <button
                onClick={() => setShowQuickStart(false)}
                className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 transition-all text-left group"
              >
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-bold text-slate-900 mb-1">Explore First</h3>
                <p className="text-sm text-slate-600">Browse the interface and tools</p>
              </button>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-slate-900 mb-2">How it works:</h4>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">1.</span>
                  <span>Press Play to start the audio guide</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">2.</span>
                  <span>Follow along with the highlighted letters</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">3.</span>
                  <span>Take breathing breaks at each milestone</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 shrink-0">4.</span>
                  <span>Track your progress automatically</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setShowQuickStart(false)}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}