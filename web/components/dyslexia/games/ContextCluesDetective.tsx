'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, Lightbulb, Search } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const sentences = [
  {
    sentence: 'The _____ bird flew high in the sky with its colorful feathers.',
    word: 'beautiful',
    options: ['beautiful', 'heavy', 'scary'],
    hint: 'The sentence talks about colorful feathers, which describes something pretty.',
  },
  {
    sentence: 'After running the marathon, she felt _____ and needed to rest.',
    word: 'exhausted',
    options: ['energetic', 'exhausted', 'happy'],
    hint: 'After a long run, you would need rest. What word means very tired?',
  },
  {
    sentence: 'The _____ scientist discovered a cure for the disease.',
    word: 'brilliant',
    options: ['lazy', 'brilliant', 'young'],
    hint: 'Someone who discovers a cure must be very smart.',
  },
  {
    sentence: 'The old house was _____ and looked like it might fall down.',
    word: 'fragile',
    options: ['strong', 'new', 'fragile'],
    hint: 'If it might fall down, it must be weak or delicate.',
  },
  {
    sentence: 'He was _____ about the test results and couldn\'t sit still.',
    word: 'anxious',
    options: ['calm', 'anxious', 'bored'],
    hint: 'If you can\'t sit still waiting for something, you are worried or nervous.',
  },
];

export function ContextCluesDetective() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const question = sentences[currentQuestion];

  const handleChoice = (word: string) => {
    setSelectedAnswer(word);
    const isCorrect = word === question.word;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < sentences.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFeedback(null);
        setSelectedAnswer(null);
        setShowHint(false);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 4) {
          addBadgeEarned('context-detective');
        }
      }
    }, 2000);
  };

  const reset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setSelectedAnswer(null);
    setShowHint(false);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Great Detective Work!</h3>
          <p className="text-lg">You scored {score} out of {sentences.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 4 && <p className="text-emerald-600 font-semibold">🔍 Context Detective Badge Earned!</p>}
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
            <Search className="w-5 h-5" />
            Context Clues Detective
          </h3>
          <div className="text-sm text-muted-foreground">
            {currentQuestion + 1} / {sentences.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
            <p className="text-lg leading-relaxed text-center">
              {question.sentence}
            </p>
          </div>

          <p className="text-center font-semibold">Which word best fits in the blank?</p>

          <div className="grid gap-3">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.word;
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

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="w-full"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {showHint ? 'Hide' : 'Need a'} Hint
          </Button>

          {showHint && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
              <p className="text-sm text-center">💡 {question.hint}</p>
            </div>
          )}

          {feedback && (
            <div className={`text-center text-lg font-semibold p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" /> Excellent deduction!
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <XCircle className="w-6 h-6" /> Not quite!
                  </div>
                  <p className="text-sm">The correct word is "{question.word}"</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>🔎 Use clues in the sentence to figure out which word makes the most sense!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
