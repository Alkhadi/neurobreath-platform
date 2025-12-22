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

  const currentStory = stories[currentStoryIndex];
  const words = currentStory.text.split(/\s+/);
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
      startTimeRef.current = Date.now() - (currentWordIndex + 1) * msPerWord;

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const nextWordIndex = Math.floor(elapsed / msPerWord);

        if (nextWordIndex >= totalWords) {
          setIsPlaying(false);
          setCurrentWordIndex(totalWords - 1);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else {
          setCurrentWordIndex(nextWordIndex);
          setElapsedTime(Math.floor(elapsed / 1000));
          
          // Calculate current WPM
          const wordsRead = nextWordIndex + 1;
          const minutesElapsed = elapsed / 60000;
          if (minutesElapsed > 0) {
            setCurrentWPM(Math.round(wordsRead / minutesElapsed));
          }
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
  }, [isPlaying, targetWPM, currentWordIndex, totalWords]);

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
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              📖 Fluency Pacer
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Follow along at your own pace. Watch words highlight as you read!
            </p>
          </div>
        </div>

        {/* Story Info */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {currentStory.title}
            </h4>
            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mt-1">
              {currentStory.level}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => changeStory('prev')}
              disabled={currentStoryIndex === 0}
              size="sm"
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => changeStory('next')}
              disabled={currentStoryIndex === stories.length - 1}
              size="sm"
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {targetWPM}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Target WPM</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {currentWPM}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Current WPM</div>
          </div>
          <div className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Time</div>
          </div>
        </div>

        {/* Reading Text */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-6 min-h-[200px]">
          <div className="text-lg leading-relaxed">
            {words.map((word, index) => (
              <span
                key={index}
                className={`inline-block mr-2 mb-1 px-1 transition-all duration-200 ${
                  index === currentWordIndex
                    ? 'bg-yellow-300 dark:bg-yellow-600 font-bold scale-110'
                    : index < currentWordIndex
                    ? 'text-gray-500 dark:text-gray-500'
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
            <span className="text-blue-700 dark:text-blue-300">
              {currentWordIndex + 1} words read
            </span>
            <span className="text-blue-700 dark:text-blue-300">
              {totalWords} total
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
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={togglePlay}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  {currentWordIndex >= totalWords - 1 ? 'Restart' : 'Play'}
                </>
              )}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              size="lg"
              className="border-blue-300 hover:bg-blue-50"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Reading Speed: {targetWPM} WPM
              </span>
              <div className="text-xs text-blue-700 dark:text-blue-300">
                Slow (60) &rarr; Fast (300)
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
