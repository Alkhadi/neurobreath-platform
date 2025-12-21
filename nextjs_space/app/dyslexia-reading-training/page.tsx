'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Volume2, Award, Trophy, Star } from 'lucide-react';

// Letter timing data structure
const LETTER_TIMINGS = {
  intro: { start: 0, end: 7.9 },
  letters: [
    { letter: 'A', start: 7.9, callEnd: 10.74, repeatStart: 11.36, repeatEnd: 13.12, end: 15.26 },
    { letter: 'B', start: 15.26, callEnd: 17.9, repeatStart: 18.22, repeatEnd: 19.94, end: 21.82 },
    { letter: 'C', start: 21.82, callEnd: 24.48, repeatStart: 25.06, repeatEnd: 26.44, end: 27.88 },
    { letter: 'D', start: 27.88, callEnd: 30.4, repeatStart: 30.88, repeatEnd: 32.42, end: 33.78 },
    { letter: 'E', start: 33.78, callEnd: 36.44, repeatStart: 37.24, repeatEnd: 38.54, end: 40.08 },
    { letter: 'F', start: 40.08, callEnd: 42.58, repeatStart: 43.18, repeatEnd: 44.58, end: 62.38, milestoneEnd: 55 },
    { letter: 'G', start: 62.38, callEnd: 65.02, repeatStart: 65.42, repeatEnd: 68.12, end: 68.3 },
    { letter: 'H', start: 68.3, callEnd: 71.04, repeatStart: 71.62, repeatEnd: 73.08, end: 74.4 },
    { letter: 'I', start: 74.4, callEnd: 77.22, repeatStart: 77.62, repeatEnd: 79.28, end: 80.5 },
    { letter: 'J', start: 80.5, callEnd: 83.32, repeatStart: 83.92, repeatEnd: 85.36, end: 86.76 },
    { letter: 'K', start: 86.76, callEnd: 89.1, repeatStart: 89.64, repeatEnd: 91.1, end: 92.54 },
    { letter: 'L', start: 92.54, callEnd: 94.84, repeatStart: 95.48, repeatEnd: 97, end: 114.72, milestoneEnd: 107.02 },
    { letter: 'M', start: 114.72, callEnd: 117.44, repeatStart: 118.14, repeatEnd: 119.6, end: 120.98 },
    { letter: 'N', start: 120.98, callEnd: 123.56, repeatStart: 124.32, repeatEnd: 125.76, end: 127.4 },
    { letter: 'O', start: 127.4, callEnd: 129.88, repeatStart: 130.36, repeatEnd: 131.96, end: 133.12 },
    { letter: 'P', start: 133.12, callEnd: 135.54, repeatStart: 136.18, repeatEnd: 137.38, end: 138.54 },
    { letter: 'Q', start: 138.54, callEnd: 141, repeatStart: 141.56, repeatEnd: 143.06, end: 144.52 },
    { letter: 'R', start: 144.52, callEnd: 147.48, repeatStart: 148, repeatEnd: 149.88, end: 167.88, milestoneEnd: 160.02 },
    { letter: 'S', start: 167.88, callEnd: 170.4, repeatStart: 170.9, repeatEnd: 172.48, end: 173.6 },
    { letter: 'T', start: 173.6, callEnd: 176.12, repeatStart: 176.8, repeatEnd: 178.2, end: 179.48 },
    { letter: 'U', start: 179.48, callEnd: 182.04, repeatStart: 182.7, repeatEnd: 184.26, end: 185.36 },
    { letter: 'V', start: 185.36, callEnd: 188, repeatStart: 188.6, repeatEnd: 190.06, end: 190.92 },
    { letter: 'W', start: 190.92, callEnd: 193.68, repeatStart: 194.06, repeatEnd: 195.74, end: 196.74 },
    { letter: 'X', start: 196.74, callEnd: 199.2, repeatStart: 199.76, repeatEnd: 201.12, end: 202.26 },
    { letter: 'Y', start: 202.26, callEnd: 204.82, repeatStart: 205.42, repeatEnd: 206.96, end: 208.06 },
    { letter: 'Z', start: 208.06, callEnd: 210.52, repeatStart: 211.18, repeatEnd: 212.64, end: 225.8, milestoneEnd: 225.08 }
  ]
};

const MILESTONES = [
  {
    id: 'bronze',
    label: 'Bronze breath break achieved',
    letters: 'A-F',
    triggerLetter: 'F',
    seconds: 10,
    body: 'You just wrapped the A-F repeats with perfect pacing. Hold this bronze pause for a sip of air, then tap Continue to glide into the G-L crew.'
  },
  {
    id: 'silver',
    label: 'Silver sound sweep complete',
    letters: 'G-L',
    triggerLetter: 'L',
    seconds: 10,
    body: 'Beautiful focus through the G-L set. Take this silver pause for ten calm seconds of breathing, then tap Continue to meet the M-R team.'
  },
  {
    id: 'gold',
    label: 'Gold glide mastered',
    letters: 'M-R',
    triggerLetter: 'R',
    seconds: 10,
    body: 'You have moved through M-R with smooth, steady sound work. Hold this gold pause, breathe out slowly, then tap Continue to glide into the final S-Z stretch.'
  },
  {
    id: 'platinum',
    label: 'Platinum phoneme circuit',
    letters: 'S-Z',
    triggerLetter: 'Z',
    seconds: 12,
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
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [showMilestone, setShowMilestone] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);
  const [earnedMilestones, setEarnedMilestones] = useState<Set<string>>(new Set());

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nb_phonics_progress');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setCompletedLetters(new Set(data.completedLetters || []));
          setEarnedMilestones(new Set(data.earnedMilestones || []));
        } catch (e) {
          console.error('Failed to load progress:', e);
        }
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nb_phonics_progress', JSON.stringify({
        completedLetters: Array.from(completedLetters),
        earnedMilestones: Array.from(earnedMilestones),
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [completedLetters, earnedMilestones]);

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
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [earnedMilestones]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            &larr; Back to NeuroBreath
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dyslexia Reading Training</h1>
          <p className="text-gray-600">Phonics Alphabet Sounds • Structured Literacy Practice</p>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Letters Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedLetters.size}/26</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Milestones Earned</p>
                <p className="text-2xl font-bold text-gray-900">{earnedMilestones.size}/4</p>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Audio Player Card */}
        <Card className="p-8 mb-8 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Volume2 className="w-6 h-6 text-gray-600" />
              <h2 className="text-2xl font-bold">Phonics Sound Training</h2>
            </div>
            {currentLetter && (
              <div className="text-5xl font-bold text-blue-600 animate-pulse">
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
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
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
              className="w-40 text-lg"
            >
              {isPlaying ? (
                <><Pause className="w-6 h-6 mr-2" /> Pause</>
              ) : (
                <><Play className="w-6 h-6 mr-2" /> Play</>
              )}
            </Button>
          </div>
        </Card>

        {/* Alphabet Grid */}
        <Card className="p-8 bg-white/90 backdrop-blur">
          <h3 className="text-xl font-bold mb-6">Alphabet Sound Map</h3>
          <div className="grid grid-cols-6 md:grid-cols-13 gap-3">
            {LETTER_TIMINGS.letters.map((info, index) => {
              const isCompleted = completedLetters.has(info.letter);
              const isCurrent = currentLetterIndex === index;
              return (
                <button
                  key={info.letter}
                  onClick={() => handleLetterClick(info.letter, index)}
                  className={`
                    aspect-square rounded-lg text-2xl font-bold transition-all
                    ${isCurrent ? 'bg-blue-600 text-white scale-110 shadow-lg' : ''}
                    ${isCompleted && !isCurrent ? 'bg-green-100 text-green-700' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : ''}
                  `}
                >
                  {info.letter}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Milestones Section */}
        <Card className="p-8 mt-8 bg-gradient-to-br from-yellow-50 to-orange-50">
          <h3 className="text-xl font-bold mb-6">Breathing Break Milestones</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {MILESTONES.map((milestone) => {
              const isEarned = earnedMilestones.has(milestone.id);
              return (
                <div
                  key={milestone.id}
                  className={`
                    p-6 rounded-lg border-2 transition-all
                    ${isEarned ? 'bg-white border-yellow-400 shadow-lg' : 'bg-white/50 border-gray-300'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className={`w-5 h-5 ${isEarned ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <h4 className="font-bold text-sm">{milestone.label}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">Letters: {milestone.letters}</p>
                  <p className="text-xs text-gray-500">{milestone.seconds}s breath break</p>
                  {isEarned && (
                    <div className="mt-2 text-xs text-green-600 font-medium">✓ Earned</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Milestone Modal */}
      {showMilestone && currentMilestone && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-lg w-full p-8 animate-in fade-in zoom-in">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{currentMilestone.label}</h2>
              <p className="text-lg text-gray-600 mb-1">{currentMilestone.letters}</p>
              <p className="text-sm text-gray-500 mb-6">{currentMilestone.body}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={closeMilestone} variant="outline">
                  Close
                </Button>
                <Button onClick={continueMilestone}>
                  Continue Training
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}