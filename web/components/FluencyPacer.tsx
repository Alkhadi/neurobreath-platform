'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  level: string;
  text: string;
}

const stories: Story[] = [
  {
    id: 1,
    title: 'The Friendly Dog',
    level: 'Beginner',
    text: 'The dog ran fast. It was a sunny day. The dog played in the park. It found a big red ball. The dog was very happy.'
  },
  {
    id: 2,
    title: 'A Day at the Beach',
    level: 'Beginner',
    text: 'Sam went to the beach. The sun was bright. He built a big castle. The waves came in. Sam had fun all day.'
  },
  {
    id: 3,
    title: 'The Lost Kitten',
    level: 'Intermediate',
    text: 'Lucy found a small kitten near her house. The kitten looked hungry and scared. Lucy gave it some milk and a warm blanket. The kitten began to purr softly. Lucy decided to keep the kitten as her pet.'
  },
  {
    id: 4,
    title: 'The Amazing Garden',
    level: 'Intermediate',
    text: 'Emma loved her garden. Every morning, she would water the colorful flowers. Butterflies visited the roses, and bees buzzed around the lavender. The garden was peaceful and beautiful, a perfect place to read and relax.'
  },
  {
    id: 5,
    title: 'Mountain Adventure',
    level: 'Advanced',
    text: 'The hiking trail wound up the mountain, through dense forests and rocky terrain. As they climbed higher, the air became cooler and thinner. Finally reaching the summit, they were rewarded with a breathtaking panoramic view of the valley below.'
  }
];

export default function FluencyPacer() {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [targetWPM, setTargetWPM] = useState(120);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  // Ref mirrors state so the interval closure always reads the current word
  // index without being listed as a dependency (which would restart the
  // interval on every word advance and corrupt timing).
  const currentWordIndexRef = useRef(-1);

  const currentStory = stories[currentStoryIndex];
  const words = currentStory.text.trim().split(/\s+/).filter(Boolean);
  const totalWords = words.length;

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const msPerWord = (60 / targetWPM) * 1000;
      // Anchor start time so that words already read are accounted for when
      // resuming after a pause.  Uses the ref, not the state variable, to
      // avoid listing currentWordIndex as a dependency (which would tear down
      // and recreate the interval on every word advance, drifting the clock).
      startTimeRef.current = Date.now() - (currentWordIndexRef.current + 1) * msPerWord;

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const nextWordIndex = Math.floor(elapsed / msPerWord);

        if (nextWordIndex >= totalWords) {
          setIsPlaying(false);
          setCurrentWordIndex(totalWords - 1);
          currentWordIndexRef.current = totalWords - 1;
          // Deterministic final stats — no wall-clock jitter.
          setElapsedTime(Math.round((totalWords * msPerWord) / 1000));
          setCurrentWPM(targetWPM);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setCurrentWordIndex(nextWordIndex);
          currentWordIndexRef.current = nextWordIndex;
          const wordsRead = nextWordIndex + 1;
          // Deterministic elapsed & WPM derived from word position, not
          // wall-clock.  wordsRead × msPerWord is the exact moment word N
          // should appear, so both values are jitter-free.
          setElapsedTime(Math.floor((wordsRead * msPerWord) / 1000));
          setCurrentWPM(targetWPM);
        }
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // currentWordIndex intentionally omitted: the ref keeps it fresh without
    // restarting the interval on every word advance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, targetWPM, totalWords]);

  const togglePlay = () => {
    if (currentWordIndex >= totalWords - 1) {
      reset();
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const reset = () => {
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    currentWordIndexRef.current = -1;
    setElapsedTime(0);
    setCurrentWPM(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const changeStory = (direction: 'prev' | 'next') => {
    reset();
    if (direction === 'prev' && currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    } else if (direction === 'next' && currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-3 sm:p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-3 sm:space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            📖 Fluency Pacer
          </h3>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 mt-1">
            Follow along at your own pace. Watch words highlight as you read!
          </p>
        </div>

        {/* Story Info */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h4 className="text-base sm:text-lg font-bold text-blue-900 dark:text-blue-100 truncate">
              {currentStory.title}
            </h4>
            <span className="badge-nb badge-nb-info mt-1">
              {currentStory.level}
            </span>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <Button
              onClick={() => changeStory('prev')}
              disabled={currentStoryIndex === 0}
              size="sm"
              variant="outline"
              className="px-2 sm:px-3"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <Button
              onClick={() => changeStory('next')}
              disabled={currentStoryIndex === stories.length - 1}
              size="sm"
              variant="outline"
              className="px-2 sm:px-3"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="bg-white/60 dark:bg-gray-800/60 p-2 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
              {targetWPM}
            </div>
            <div className="text-[10px] sm:text-sm text-blue-700 dark:text-blue-300">Target WPM</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-2 sm:p-4 rounded-lg text-center">
            <div className="text-xl sm:text-3xl font-extrabold text-blue-900 dark:text-blue-100">
              {currentWPM}
            </div>
            <div className="text-[10px] sm:text-sm font-semibold text-blue-700 dark:text-blue-300">Words/Min</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-2 sm:p-4 rounded-lg text-center">
            <div className="text-lg sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-[10px] sm:text-sm text-blue-700 dark:text-blue-300">Time</div>
          </div>
        </div>

        {/* Reading Text */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-3 sm:p-6">
          <div className="text-base sm:text-lg leading-relaxed">
            {words.map((word, index) => (
              <span
                key={index}
                className={`inline-block mr-2.5 mb-1 px-1 rounded transition-all duration-200 ${
                  index === currentWordIndex
                    ? 'bg-yellow-300 dark:bg-yellow-600 font-bold scale-110'
                    : index < currentWordIndex
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-100'
                }`}
              >
                {word}
              </span>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {Math.max(0, currentWordIndex + 1)} of {totalWords} words read
            </span>
            <span className="text-blue-700 dark:text-blue-300 font-medium">
              {Math.max(0, Math.round(((currentWordIndex + 1) / totalWords) * 100))}% complete
            </span>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900/30 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentWordIndex + 1) / totalWords) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={togglePlay}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="default"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                  {currentWordIndex >= totalWords - 1 ? 'Restart' : 'Play'}
                </>
              )}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="default"
              className="border-blue-300 hover:bg-blue-50"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-blue-900 dark:text-blue-100">
                Speed: {targetWPM} WPM
              </span>
              <div className="text-[10px] sm:text-xs text-blue-700 dark:text-blue-300 shrink-0">
                60 &rarr; 300
              </div>
            </div>
            <Slider
              value={[targetWPM]}
              onValueChange={(value) => setTargetWPM(value[0])}
              min={60}
              max={300}
              step={10}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
