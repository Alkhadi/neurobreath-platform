'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, Shuffle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const wordFamilies = [
  {
    family: '-at',
    words: ['cat', 'hat', 'bat', 'rat'],
    distractors: ['dog', 'sun', 'run'],
  },
  {
    family: '-an',
    words: ['can', 'fan', 'man', 'pan'],
    distractors: ['car', 'bug', 'pig'],
  },
  {
    family: '-ig',
    words: ['big', 'dig', 'pig', 'wig'],
    distractors: ['dog', 'cat', 'hat'],
  },
  {
    family: '-op',
    words: ['hop', 'mop', 'pop', 'top'],
    distractors: ['bag', 'fan', 'sun'],
  },
];

export function WordFamilySorting() {
  const [currentFamily, setCurrentFamily] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const family = wordFamilies[currentFamily];

  useState(() => {
    shuffleWords();
  });

  const shuffleWords = () => {
    const allWords = [...family.words, ...family.distractors];
    setShuffledWords(allWords.sort(() => Math.random() - 0.5));
  };

  const toggleWord = (word: string) => {
    if (feedback) return;
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const checkAnswer = () => {
    const isCorrect = selectedWords.length === family.words.length &&
      selectedWords.every(word => family.words.includes(word));
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentFamily < wordFamilies.length - 1) {
        setCurrentFamily(currentFamily + 1);
        setFeedback(null);
        setSelectedWords([]);
        shuffleWords();
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 3) {
          addBadgeEarned('word-family-expert');
        }
      }
    }, 2000);
  };

  const reset = () => {
    setCurrentFamily(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setSelectedWords([]);
    shuffleWords();
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Well Sorted!</h3>
          <p className="text-lg">You scored {score} out of {wordFamilies.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 3 && <p className="text-emerald-600 font-semibold">🏆 Word Family Expert Badge Earned!</p>}
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
          <h3 className="text-xl font-bold">Word Family Sorting</h3>
          <div className="text-sm text-muted-foreground">
            {currentFamily + 1} / {wordFamilies.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block px-8 py-4 bg-pink-50 dark:bg-pink-950/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Find all words in the family:</p>
              <p className="text-4xl font-bold">{family.family}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {shuffledWords.map((word) => {
              const isSelected = selectedWords.includes(word);
              const isCorrectWord = family.words.includes(word);
              const showResult = feedback !== null;

              return (
                <Button
                  key={word}
                  size="lg"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => toggleWord(word)}
                  disabled={feedback !== null}
                  className={`text-2xl p-6 h-auto ${
                    showResult
                      ? isSelected && isCorrectWord
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500'
                        : isSelected && !isCorrectWord
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-500'
                        : ''
                      : ''
                  }`}
                >
                  {word}
                  {showResult && isSelected && (
                    <span className="ml-2">
                      {isCorrectWord ? (
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

          <div className="flex gap-3">
            <Button
              onClick={shuffleWords}
              variant="outline"
              disabled={feedback !== null}
              className="flex-1"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
            <Button
              onClick={checkAnswer}
              disabled={selectedWords.length === 0 || feedback !== null}
              className="flex-1"
            >
              Check Answer
            </Button>
          </div>

          {feedback && (
            <div className={`text-center text-lg font-semibold p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" /> Perfect! All {family.family} words found!
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <XCircle className="w-6 h-6" /> Not quite right!
                  </div>
                  <p className="text-sm">The correct words are: {family.words.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>💡 Word families are words that end with the same sound and letters!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
