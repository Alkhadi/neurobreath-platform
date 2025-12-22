'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, Pause, RotateCcw, Volume2, Award, Trophy, Star, 
  Settings, BookOpen, Target, Clock, Sparkles, Check,
  TrendingUp, Flame, Zap, Brain, Heart, Mic, FileText,
  Repeat, Volume, Save, Printer, BarChart3, Calendar,
  Medal, Timer, Activity, Eye
} from 'lucide-react';

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
  const [streak, setStreak] = useState(0);
  const [lastPracticeDate, setLastPracticeDate] = useState<string | null>(null);

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
          setStreak(data.streak || 0);
          setLastPracticeDate(data.lastPracticeDate || null);
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
        streak,
        lastPracticeDate,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [completedLetters, earnedMilestones, totalSessions, totalMinutes, streak, lastPracticeDate]);

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
      // Track session completion and streak
      const today = new Date().toDateString();
      const sessionMinutes = Math.round(duration / 60);
      setTotalSessions(prev => prev + 1);
      setTotalMinutes(prev => prev + sessionMinutes);
      
      // Update streak
      if (lastPracticeDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastPracticeDate === yesterday.toDateString()) {
          setStreak(prev => prev + 1);
        } else {
          setStreak(1);
        }
        setLastPracticeDate(today);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [earnedMilestones, duration, lastPracticeDate]);

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <span>&larr;</span>
            <span>Back to NeuroBreath</span>
          </Link>
          
          <Card className="p-6 border-border bg-card">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Reading Training • NeuroBreath</p>
                <h1 className="text-3xl font-semibold mb-2">Professional Reading Development</h1>
                <p className="text-muted-foreground">Evidence-based techniques for efficient skill enhancement.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowQuickStart(true)}>
                  Dashboard
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <Button onClick={() => handleLetterClick('A', 0)}>
                Begin Training
              </Button>
              <Button variant="outline" onClick={() => handleLetterClick('A', 0)}>
                Daily Practice
              </Button>
              <Button variant="outline" onClick={() => setShowQuickStart(true)}>
                Learn More
              </Button>
            </div>
          </Card>
        </section>

        {/* Stats + Timer + Quick Actions Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            {/* Streak Toolkit */}
            <Card className="p-6 border-border bg-card">
              <h2 className="text-lg font-semibold mb-4">Streak Toolkit</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Flame className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{streak}</div>
                  <div className="text-xs text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{totalMinutes}</div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{earnedMilestones.size}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Practice Timer */}
            <Card className="p-6 border-border bg-card">
              <h2 className="text-lg font-semibold mb-4">Practice Timer</h2>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{formatTime(currentTime)}</div>
                <Progress value={progress} className="h-2 mb-2" />
                <div className="text-sm text-muted-foreground">{formatTime(duration)} total</div>
              </div>
            </Card>

            {/* Stats Panel */}
            <Card className="p-6 border-border bg-card">
              <h2 className="text-lg font-semibold mb-4">Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="font-semibold">{completionPercentage}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Letters</span>
                  <span className="font-semibold">{completedLetters.size}/26</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Milestones</span>
                  <span className="font-semibold">{earnedMilestones.size}/4</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Progress Charts */}
        <Card className="p-6 mb-8 border-border bg-card">
          <h2 className="text-lg font-semibold mb-4">Progress Chart</h2>
          <div className="h-48 flex items-center justify-center border rounded-lg bg-muted/30">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Progress tracking visualization</p>
              <p className="text-xs text-muted-foreground mt-1">Complete more sessions to see your progress</p>
            </div>
          </div>
        </Card>

        {/* Breathing Exercise + Reading Assessment */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Breathing Exercise
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Take calm breaks between letters. Breathe slowly: 4 counts in, 2 hold, 6 out.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Start Breathing</Button>
              <Button variant="outline" size="sm">Learn Technique</Button>
            </div>
          </Card>

          <Card className="p-6 border-border bg-card">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              Reading Assessment
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Track your reading fluency and pronunciation accuracy over time.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Start Assessment</Button>
              <Button variant="outline" size="sm">View Results</Button>
            </div>
          </Card>
        </div>

        {/* Alphabet Atlas (Letter Grid) */}
        <Card className="p-6 mb-8 border-border bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">Alphabet Atlas</h2>
              <p className="text-sm text-muted-foreground mt-1">Click any letter to jump to that sound</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted border"></div>
                <span className="text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800"></div>
                <span className="text-muted-foreground">Complete</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span className="text-muted-foreground">Playing</span>
              </div>
            </div>
          </div>

          {/* Milestone Groups */}
          <div className="space-y-6">
            {/* Bronze Group (A-F) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🥉</span>
                <span className="text-sm font-semibold text-muted-foreground">A-F Bronze</span>
                {earnedMilestones.has('bronze') && (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="grid grid-cols-6 md:grid-cols-6 gap-3">
                {LETTER_TIMINGS.letters.slice(0, 6).map((info, index) => {
                  const isCompleted = completedLetters.has(info.letter);
                  const isCurrent = currentLetterIndex === index;
                  return (
                    <button
                      key={info.letter}
                      onClick={() => handleLetterClick(info.letter, index)}
                      className={`
                        relative group aspect-square rounded-xl text-2xl font-bold transition-all duration-200
                        flex flex-col items-center justify-center p-4
                        ${isCurrent ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-105 shadow-xl ring-4 ring-blue-300 dark:ring-blue-700 z-10' : ''}
                        ${isCompleted && !isCurrent ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800 hover:scale-105 hover:shadow-lg' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md' : ''}
                      `}
                    >
                      <span className="text-3xl mb-1">{info.letter}</span>
                      {isCompleted && !isCurrent && (
                        <Check className="w-5 h-5 absolute top-2 right-2 text-green-600 dark:text-green-400 bg-white dark:bg-green-950 rounded-full p-0.5" />
                      )}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-xl animate-pulse bg-blue-400/20"></div>
                      )}
                      <span className="text-xs font-medium mt-1 opacity-70">{info.word}</span>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20">
                        {info.tip}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Silver Group (G-L) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🥈</span>
                <span className="text-sm font-semibold text-muted-foreground">G-L Silver</span>
                {earnedMilestones.has('silver') && (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="grid grid-cols-6 md:grid-cols-6 gap-3">
                {LETTER_TIMINGS.letters.slice(6, 12).map((info, index) => {
                  const actualIndex = index + 6;
                  const isCompleted = completedLetters.has(info.letter);
                  const isCurrent = currentLetterIndex === actualIndex;
                  return (
                    <button
                      key={info.letter}
                      onClick={() => handleLetterClick(info.letter, actualIndex)}
                      className={`
                        relative group aspect-square rounded-xl text-2xl font-bold transition-all duration-200
                        flex flex-col items-center justify-center p-4
                        ${isCurrent ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-105 shadow-xl ring-4 ring-blue-300 dark:ring-blue-700 z-10' : ''}
                        ${isCompleted && !isCurrent ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800 hover:scale-105 hover:shadow-lg' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md' : ''}
                      `}
                    >
                      <span className="text-3xl mb-1">{info.letter}</span>
                      {isCompleted && !isCurrent && (
                        <Check className="w-5 h-5 absolute top-2 right-2 text-green-600 dark:text-green-400 bg-white dark:bg-green-950 rounded-full p-0.5" />
                      )}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-xl animate-pulse bg-blue-400/20"></div>
                      )}
                      <span className="text-xs font-medium mt-1 opacity-70">{info.word}</span>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20">
                        {info.tip}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gold Group (M-R) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🥇</span>
                <span className="text-sm font-semibold text-muted-foreground">M-R Gold</span>
                {earnedMilestones.has('gold') && (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="grid grid-cols-6 md:grid-cols-6 gap-3">
                {LETTER_TIMINGS.letters.slice(12, 18).map((info, index) => {
                  const actualIndex = index + 12;
                  const isCompleted = completedLetters.has(info.letter);
                  const isCurrent = currentLetterIndex === actualIndex;
                  return (
                    <button
                      key={info.letter}
                      onClick={() => handleLetterClick(info.letter, actualIndex)}
                      className={`
                        relative group aspect-square rounded-xl text-2xl font-bold transition-all duration-200
                        flex flex-col items-center justify-center p-4
                        ${isCurrent ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-105 shadow-xl ring-4 ring-blue-300 dark:ring-blue-700 z-10' : ''}
                        ${isCompleted && !isCurrent ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800 hover:scale-105 hover:shadow-lg' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md' : ''}
                      `}
                    >
                      <span className="text-3xl mb-1">{info.letter}</span>
                      {isCompleted && !isCurrent && (
                        <Check className="w-5 h-5 absolute top-2 right-2 text-green-600 dark:text-green-400 bg-white dark:bg-green-950 rounded-full p-0.5" />
                      )}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-xl animate-pulse bg-blue-400/20"></div>
                      )}
                      <span className="text-xs font-medium mt-1 opacity-70">{info.word}</span>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20">
                        {info.tip}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platinum Group (S-Z) */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💎</span>
                <span className="text-sm font-semibold text-muted-foreground">S-Z Platinum</span>
                {earnedMilestones.has('platinum') && (
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                )}
              </div>
              <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                {LETTER_TIMINGS.letters.slice(18, 26).map((info, index) => {
                  const actualIndex = index + 18;
                  const isCompleted = completedLetters.has(info.letter);
                  const isCurrent = currentLetterIndex === actualIndex;
                  return (
                    <button
                      key={info.letter}
                      onClick={() => handleLetterClick(info.letter, actualIndex)}
                      className={`
                        relative group aspect-square rounded-xl text-2xl font-bold transition-all duration-200
                        flex flex-col items-center justify-center p-4
                        ${isCurrent ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-105 shadow-xl ring-4 ring-blue-300 dark:ring-blue-700 z-10' : ''}
                        ${isCompleted && !isCurrent ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800 hover:scale-105 hover:shadow-lg' : ''}
                        ${!isCompleted && !isCurrent ? 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-700 hover:scale-105 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md' : ''}
                      `}
                    >
                      <span className="text-3xl mb-1">{info.letter}</span>
                      {isCompleted && !isCurrent && (
                        <Check className="w-5 h-5 absolute top-2 right-2 text-green-600 dark:text-green-400 bg-white dark:bg-green-950 rounded-full p-0.5" />
                      )}
                      {isCurrent && (
                        <div className="absolute inset-0 rounded-xl animate-pulse bg-blue-400/20"></div>
                      )}
                      <span className="text-xs font-medium mt-1 opacity-70">{info.word}</span>
                      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20">
                        {info.tip}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Phonics Player */}
        <Card className="p-6 mb-8 border-border bg-card">
          <h2 className="text-lg font-semibold mb-6">Phonics Player</h2>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Volume2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Alphabet Sounds with Dorothy</h3>
                <p className="text-sm text-muted-foreground">Professional voice guidance</p>
              </div>
            </div>
            {currentLetter && (
              <div className="text-6xl font-bold text-primary animate-pulse">
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
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Current Letter Info */}
          {currentLetterInfo && (
            <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{currentLetterInfo.letter}</div>
                <div className="flex-1">
                  <div className="font-semibold">{currentLetterInfo.word}</div>
                  <div className="text-sm text-muted-foreground">{currentLetterInfo.tip}</div>
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </Button>
            <Button
              onClick={togglePlayPause}
              size="lg"
              className="min-w-[160px]"
            >
              {isPlaying ? (
                <><Pause className="w-6 h-6 mr-2" /> Pause</>
              ) : (
                <><Play className="w-6 h-6 mr-2" /> Play</>
              )}
            </Button>
          </div>

          {/* Quick Jump Buttons */}
          <div className="mt-4 flex gap-2 flex-wrap justify-center">
            <Button variant="outline" size="sm" onClick={() => handleLetterClick('A', 0)}>
              Jump to A
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

        {/* Additional Training Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Word Builder */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              Word Builder
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Combine letter sounds to build simple words.
            </p>
            <Button variant="outline" size="sm" className="w-full">Start Building</Button>
          </Card>

          {/* Fluency Pacer */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Fluency Pacer
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Practice reading at a comfortable pace.
            </p>
            <Button variant="outline" size="sm" className="w-full">Start Pacing</Button>
          </Card>

          {/* Pronunciation Recorder */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Mic className="w-5 h-5 text-red-500" />
              Pronunciation
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Record and compare your pronunciation.
            </p>
            <Button variant="outline" size="sm" className="w-full">Start Recording</Button>
          </Card>

          {/* Syllable Game */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Repeat className="w-5 h-5 text-purple-500" />
              Syllable Game
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Break words into syllables for easier reading.
            </p>
            <Button variant="outline" size="sm" className="w-full">Play Game</Button>
          </Card>

          {/* Sight Words */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Sight Words
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Learn common words by sight recognition.
            </p>
            <Button variant="outline" size="sm" className="w-full">Start Training</Button>
          </Card>

          {/* Vocabulary Builder */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-500" />
              Vocabulary
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Expand your word knowledge and usage.
            </p>
            <Button variant="outline" size="sm" className="w-full">Start Learning</Button>
          </Card>
        </div>

        {/* Resources Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Printable Worksheets */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Printer className="w-5 h-5 text-slate-500" />
              Printable Worksheets
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Download and print practice worksheets for offline learning.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Alphabet
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Words
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Phonics
              </Button>
            </div>
          </Card>

          {/* Vowel Universe */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Vowel Universe
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Master vowel sounds with dedicated training exercises.
            </p>
            <Button variant="outline" size="sm">
              Explore Vowels
            </Button>
          </Card>
        </div>

        {/* Breathing Breaks Card */}
        <Card className="p-6 mb-8 border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Milestone Breathing Breaks
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {MILESTONES.map((milestone) => {
              const isEarned = earnedMilestones.has(milestone.id);
              return (
                <div
                  key={milestone.id}
                  className={`
                    p-3 rounded-lg transition-all text-center
                    ${isEarned ? 'bg-white dark:bg-slate-800 shadow-md border-2 border-amber-300 dark:border-amber-700' : 'bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700'}
                  `}
                >
                  <div className="text-3xl mb-2">{milestone.emoji}</div>
                  <div className="text-xs font-semibold mb-1">{milestone.letters}</div>
                  <div className="text-xs text-muted-foreground">{milestone.seconds}s break</div>
                  {isEarned && (
                    <Check className="w-4 h-4 mx-auto mt-2 text-green-600 dark:text-green-400" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Milestone Celebration Modal */}
      {showMilestone && currentMilestone && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in">
          <Card className="max-w-lg w-full p-8 animate-in zoom-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-500 rounded-full shadow-2xl animate-in zoom-in spin-in">
                <span className="text-5xl">{currentMilestone.emoji}</span>
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentMilestone.label}</h2>
              <p className="text-lg font-medium mb-1">{currentMilestone.letters}</p>
              <p className="text-sm text-muted-foreground mb-6">{currentMilestone.body}</p>
              
              {countdown > 0 && (
                <div className="mb-6 inline-flex items-center gap-3 px-6 py-3 bg-muted rounded-full border-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">{countdown}s</span>
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
              <h2 className="text-3xl font-bold mb-2">Welcome to Phonics Lab!</h2>
              <p className="text-muted-foreground">Evidence-based reading development for all learners</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={() => {
                  setShowQuickStart(false);
                  handleLetterClick('A', 0);
                }}
                className="p-6 rounded-xl border-2 hover:border-primary transition-all text-left group"
              >
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-bold mb-1">Start from A</h3>
                <p className="text-sm text-muted-foreground">Begin with the full alphabet sequence</p>
              </button>

              <button
                onClick={() => {
                  setShowQuickStart(false);
                  handleLetterClick('M', 12);
                }}
                className="p-6 rounded-xl border-2 hover:border-primary transition-all text-left group"
              >
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-bold mb-1">Jump to M</h3>
                <p className="text-sm text-muted-foreground">Continue from the middle section</p>
              </button>

              <button
                onClick={() => setShowQuickStart(false)}
                className="p-6 rounded-xl border-2 hover:border-primary transition-all text-left group"
              >
                <div className="text-3xl mb-2">📚</div>
                <h3 className="font-bold mb-1">Explore First</h3>
                <p className="text-sm text-muted-foreground">Browse the interface and tools</p>
              </button>
            </div>

            <div className="bg-muted rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ul className="space-y-1.5 text-sm">
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">1.</span>
                  <span>Press Play to start the audio guide</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">2.</span>
                  <span>Follow along with the highlighted letters</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">3.</span>
                  <span>Take breathing breaks at each milestone</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary shrink-0">4.</span>
                  <span>Track your progress automatically</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setShowQuickStart(false)}
                size="lg"
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