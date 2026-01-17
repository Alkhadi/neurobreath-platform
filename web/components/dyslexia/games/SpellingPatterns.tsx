'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, RefreshCw, Trophy, Lightbulb } from 'lucide-react';
import { sanitizeForTTS } from '@/lib/speech/sanitizeForTTS';
import { useProgress } from '@/contexts/ProgressContext';

const patterns = [
  { pattern: 'igh', words: ['light', 'night', 'fight', 'right'], example: 'l___t' },
  { pattern: 'ough', words: ['though', 'dough', 'through', 'rough'], example: 'th___' },
  { pattern: 'ea', words: ['read', 'bread', 'great', 'break'], example: 'r___d' },
  { pattern: 'tion', words: ['action', 'station', 'nation', 'motion'], example: 'ac___' },
  { pattern: 'ph', words: ['phone', 'graph', 'photo', 'elephant'], example: '___one' },
  { pattern: 'kn', words: ['know', 'knee', 'knife', 'knock'], example: '___ow' },
];

export function SpellingPatterns() {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const pattern = patterns[currentPattern];
  const targetWord = pattern.words[0];

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = sanitizeForTTS(word);
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    const isCorrect = input.toLowerCase() === pattern.pattern.toLowerCase();
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
      speakWord('Excellent!');
    }

    setTimeout(() => {
      if (currentPattern < patterns.length - 1) {
        setCurrentPattern(currentPattern + 1);
        setFeedback(null);
        setInput('');
        setShowHint(false);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 4) {
          addBadgeEarned('spelling-pattern-pro');
        }
      }
    }, 1500);
  };

  const reset = () => {
    setCurrentPattern(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    setInput('');
    setShowHint(false);
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Pattern Master!</h3>
          <p className="text-lg">You scored {score} out of {patterns.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 4 && <p className="text-emerald-600 font-semibold">🏆 Spelling Pattern Pro Badge Earned!</p>}
          </div>
          <Button onClick={reset} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Practice Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Spelling Patterns</h3>
          <div className="text-sm text-muted-foreground">
            {currentPattern + 1} / {patterns.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-block p-6 bg-violet-50 dark:bg-violet-950/30 rounded-lg">
              <Button
                variant="ghost"
                size="lg"
                onClick={() => speakWord(targetWord)}
                className="text-3xl font-mono"
              >
                {pattern.example}
                <Volume2 className="w-6 h-6 ml-3" />
              </Button>
            </div>
            <p className="mt-4 text-lg font-semibold">Fill in the missing letters to spell: <strong>{targetWord}</strong></p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Type the missing letters..."
                className="flex-1 px-4 py-3 text-2xl text-center font-mono border-2 rounded-lg focus:outline-none focus:border-violet-500"
                disabled={feedback !== null}
                maxLength={pattern.pattern.length}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!input || feedback !== null}
              className="w-full"
              size="lg"
            >
              Check Answer
            </Button>

            <Button
              variant="outline"
              onClick={() => setShowHint(!showHint)}
              className="w-full"
              size="sm"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? 'Hide' : 'Show'} Hint
            </Button>

            {showHint && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">The pattern is: <strong className="text-foreground">{pattern.pattern}</strong></p>
                <p className="text-xs mt-2">Other words with this pattern: {pattern.words.slice(1).join(', ')}</p>
              </div>
            )}
          </div>

          {feedback && (
            <div className={`text-center text-lg font-semibold ${
              feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {feedback === 'correct' ? (
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-6 h-6" /> Perfect! The pattern is "{pattern.pattern}"
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <XCircle className="w-6 h-6" /> The correct pattern is "{pattern.pattern}"
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
