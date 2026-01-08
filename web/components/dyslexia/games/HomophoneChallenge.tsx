'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, Volume2 } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const homophones = [
  {
    sentence: 'I can ___ the music from here.',
    correctWord: 'hear',
    options: ['hear', 'here'],
    explanation: '"Hear" means to listen, "here" means this place',
  },
  {
    sentence: 'The ___ was shining brightly.',
    correctWord: 'sun',
    options: ['sun', 'son'],
    explanation: '"Sun" is the star in the sky, "son" is a male child',
  },
  {
    sentence: 'She ___ the letter with care.',
    correctWord: 'wrote',
    options: ['wrote', 'rote'],
    explanation: '"Wrote" is past tense of write, "rote" means memorization',
  },
  {
    sentence: 'They went ___ the door.',
    correctWord: 'through',
    options: ['through', 'threw'],
    explanation: '"Through" means passing by, "threw" is past tense of throw',
  },
  {
    sentence: 'The dog wagged ___ tail.',
    correctWord: 'its',
    options: ['its', "it's"],
    explanation: '"Its" shows possession, "it\'s" means "it is"',
  },
  {
    sentence: 'She wanted some peace and ___.',
    correctWord: 'quiet',
    options: ['quiet', 'quite'],
    explanation: '"Quiet" means silent, "quite" means very or really',
  },
];

export function HomophoneChallenge() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const question = homophones[currentQuestion];

  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      const sentenceWithWord = question.sentence.replace('___', question.correctWord);
      const utterance = new SpeechSynthesisUtterance(sentenceWithWord);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleChoice = (word: string) => {
    setSelectedAnswer(word);
    const isCorrect = word === question.correctWord;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < homophones.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 5) {
          addBadgeEarned('homophone-expert');
        }
      }
    }, 2500);
  };

  const reset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setSelectedAnswer(null);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Excellent!</h3>
          <p className="text-lg">You scored {score} out of {homophones.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 5 && <p className="text-emerald-600 font-semibold">🏆 Homophone Expert Badge Earned!</p>}
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
          <h3 className="text-xl font-bold">Homophone Challenge</h3>
          <div className="text-sm text-muted-foreground">
            {currentQuestion + 1} / {homophones.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
            <p className="text-lg leading-relaxed text-center mb-4">
              {question.sentence}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={speakSentence}
              className="mx-auto flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              Hear the sentence
            </Button>
          </div>

          <p className="text-center font-semibold">Choose the correct word:</p>

          <div className="grid gap-4">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              const isCorrect = option === question.correctWord;
              const showResult = feedback !== null;

              return (
                <Button
                  key={option}
                  size="lg"
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleChoice(option)}
                  disabled={feedback !== null}
                  className={`text-2xl p-8 h-auto justify-center ${
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
            <div className={`text-center p-4 rounded-lg ${
              feedback === 'correct'
                ? 'bg-emerald-50 dark:bg-emerald-950/30'
                : 'bg-blue-50 dark:bg-blue-950/30'
            }`}>
              {feedback === 'correct' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-lg">
                    <CheckCircle className="w-6 h-6" /> Correct!
                  </div>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-red-700 font-semibold text-lg">
                    <XCircle className="w-6 h-6" /> Not quite!
                  </div>
                  <p className="text-sm">The correct word is "{question.correctWord}"</p>
                  <p className="text-sm text-muted-foreground">{question.explanation}</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>🔊 Homophones sound the same but have different meanings and spellings!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
