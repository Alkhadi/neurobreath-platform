'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, MoveVertical } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const stories = [
  {
    title: 'Making a Sandwich',
    events: [
      'Get two slices of bread',
      'Spread butter on the bread',
      'Add your favorite filling',
      'Put the slices together',
      'Eat and enjoy!',
    ],
  },
  {
    title: 'Planting a Seed',
    events: [
      'Dig a small hole in the soil',
      'Place the seed in the hole',
      'Cover the seed with dirt',
      'Water the seed',
      'Wait for it to grow',
    ],
  },
  {
    title: 'Getting Ready for School',
    events: [
      'Wake up and get out of bed',
      'Brush your teeth and wash your face',
      'Get dressed in school clothes',
      'Eat breakfast',
      'Pack your backpack and leave',
    ],
  },
];

export function StorySequencing() {
  const [currentStory, setCurrentStory] = useState(0);
  const [score, setScore] = useState(0);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [availableEvents, setAvailableEvents] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const story = stories[currentStory];

  useEffect(() => {
    shuffleEvents();
  }, [currentStory]);

  const shuffleEvents = () => {
    const shuffled = [...story.events].sort(() => Math.random() - 0.5);
    setAvailableEvents(shuffled);
    setUserSequence([]);
  };

  const handleEventClick = (event: string, fromAvailable: boolean) => {
    if (feedback) return;
    
    if (fromAvailable) {
      setUserSequence([...userSequence, event]);
      setAvailableEvents(availableEvents.filter(e => e !== event));
    } else {
      setAvailableEvents([...availableEvents, event]);
      setUserSequence(userSequence.filter(e => e !== event));
    }
  };

  const moveUp = (index: number) => {
    if (index === 0 || feedback) return;
    const newSequence = [...userSequence];
    [newSequence[index - 1], newSequence[index]] = [newSequence[index], newSequence[index - 1]];
    setUserSequence(newSequence);
  };

  const moveDown = (index: number) => {
    if (index === userSequence.length - 1 || feedback) return;
    const newSequence = [...userSequence];
    [newSequence[index], newSequence[index + 1]] = [newSequence[index + 1], newSequence[index]];
    setUserSequence(newSequence);
  };

  const checkAnswer = () => {
    const isCorrect = JSON.stringify(userSequence) === JSON.stringify(story.events);
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentStory < stories.length - 1) {
        setCurrentStory(currentStory + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 2) {
          addBadgeEarned('story-sequencer');
        }
      }
    }, 3000);
  };

  const reset = () => {
    setCurrentStory(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    shuffleEvents();
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Great Sequencing!</h3>
          <p className="text-lg">You scored {score} out of {stories.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 2 && <p className="text-emerald-600 font-semibold">🏆 Story Sequencer Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Story Sequencing</h3>
          <div className="text-sm text-muted-foreground">
            {currentStory + 1} / {stories.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
            <h4 className="text-xl font-bold">{story.title}</h4>
            <p className="text-sm text-muted-foreground mt-2">Put the events in the correct order</p>
          </div>

          {/* User's sequence */}
          <div className="space-y-2">
            <p className="text-sm font-semibold">Your Order:</p>
            <div className="min-h-[200px] p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-dashed border-blue-300">
              {userSequence.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Click events below to add them here</p>
              ) : (
                <div className="space-y-2">
                  {userSequence.map((event, index) => (
                    <div
                      key={`seq-${index}`}
                      className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg"
                    >
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 rounded-full font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-sm">{event}</span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveUp(index)}
                          disabled={index === 0 || feedback !== null}
                          className="h-8 w-8 p-0"
                        >
                          ↑
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => moveDown(index)}
                          disabled={index === userSequence.length - 1 || feedback !== null}
                          className="h-8 w-8 p-0"
                        >
                          ↓
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEventClick(event, false)}
                          disabled={feedback !== null}
                          className="h-8 w-8 p-0 text-red-600"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available events */}
          {availableEvents.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold">Available Events:</p>
              <div className="space-y-2">
                {availableEvents.map((event, index) => (
                  <Button
                    key={`avail-${index}`}
                    variant="outline"
                    onClick={() => handleEventClick(event, true)}
                    disabled={feedback !== null}
                    className="w-full text-left h-auto py-3 px-4 justify-start"
                  >
                    {event}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={checkAnswer}
            disabled={userSequence.length !== story.events.length || feedback !== null}
            className="w-full"
            size="lg"
          >
            Check Order
          </Button>

          {feedback && (
            <div className={`text-center p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                  <CheckCircle className="w-6 h-6" /> Perfect sequence!
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 font-semibold text-lg">
                    <XCircle className="w-6 h-6" /> Not quite right!
                  </div>
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">Correct order:</p>
                    {story.events.map((event, i) => (
                      <p key={i}>{i + 1}. {event}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>📖 Think about what happens first, next, and last!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
