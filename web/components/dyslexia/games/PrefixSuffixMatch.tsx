'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, BookOpen } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const exercises = [
  {
    type: 'prefix' as const,
    affix: 'un-',
    meaning: 'not',
    rootWord: 'happy',
    newWord: 'unhappy',
    options: ['unhappy', 'happyun', 'nothappy'],
  },
  {
    type: 'suffix' as const,
    affix: '-ful',
    meaning: 'full of',
    rootWord: 'care',
    newWord: 'careful',
    options: ['careful', 'fullcare', 'carefulness'],
  },
  {
    type: 'prefix' as const,
    affix: 're-',
    meaning: 'again',
    rootWord: 'do',
    newWord: 'redo',
    options: ['redo', 'dore', 'undone'],
  },
  {
    type: 'suffix' as const,
    affix: '-less',
    meaning: 'without',
    rootWord: 'hope',
    newWord: 'hopeless',
    options: ['hopeless', 'lesshope', 'nohope'],
  },
  {
    type: 'prefix' as const,
    affix: 'pre-',
    meaning: 'before',
    rootWord: 'view',
    newWord: 'preview',
    options: ['preview', 'viewpre', 'beforeview'],
  },
  {
    type: 'suffix' as const,
    affix: '-er',
    meaning: 'one who',
    rootWord: 'teach',
    newWord: 'teacher',
    options: ['teacher', 'erteach', 'teaching'],
  },
];

export function PrefixSuffixMatch() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const exercise = exercises[currentExercise];

  const handleChoice = (word: string) => {
    setSelectedAnswer(word);
    const isCorrect = word === exercise.newWord;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 5) {
          addBadgeEarned('morphology-master');
        }
      }
    }, 2000);
  };

  const reset = () => {
    setCurrentExercise(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setSelectedAnswer(null);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Word Building Master!</h3>
          <p className="text-lg">You scored {score} out of {exercises.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 5 && <p className="text-emerald-600 font-semibold">🏆 Morphology Master Badge Earned!</p>}
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
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Prefix/Suffix Match
          </h3>
          <div className="text-sm text-muted-foreground">
            {currentExercise + 1} / {exercises.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                {exercise.type === 'prefix' ? 'Prefix' : 'Suffix'}:
              </p>
              <p className="text-3xl font-bold">{exercise.affix}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Meaning: <strong>{exercise.meaning}</strong>
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Root Word:</p>
              <p className="text-3xl font-bold">{exercise.rootWord}</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold mb-1">
              Add {exercise.affix} to "{exercise.rootWord}"
            </p>
            <p className="text-sm text-muted-foreground">
              ({exercise.meaning})
            </p>
          </div>

          <div className="grid gap-3">
            {exercise.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === exercise.newWord;
              const showResult = feedback !== null;

              return (
                <Button
                  key={option}
                  size="lg"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleChoice(option)}
                  disabled={feedback !== null}
                  className={`text-xl p-6 h-auto justify-center ${
                    showResult && isSelected
                      ? isCorrect
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500'
                        : 'bg-red-100 dark:bg-red-900/30 border-red-500'
                      : ''
                  }`}
                >
                  {option}
                  {showResult && isSelected && (
                    <span className="ml-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </span>
                  )}
                </Button>
              );
            })}
          </div>

          {feedback && (
            <div className={`text-center text-lg font-semibold p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" /> Perfect! "{exercise.newWord}" means {exercise.meaning} {exercise.rootWord}!
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <XCircle className="w-6 h-6" /> Not quite!
                  </div>
                  <p className="text-sm">The correct word is "{exercise.newWord}"</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>📚 Prefixes go at the beginning, suffixes go at the end!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
