'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RefreshCw, Trophy, Shuffle, Volume2 } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

const sentences = [
  { words: ['The', 'cat', 'is', 'sleeping'], sentence: 'The cat is sleeping' },
  { words: ['I', 'love', 'to', 'read', 'books'], sentence: 'I love to read books' },
  { words: ['She', 'plays', 'the', 'piano', 'well'], sentence: 'She plays the piano well' },
  { words: ['We', 'went', 'to', 'the', 'park', 'yesterday'], sentence: 'We went to the park yesterday' },
  { words: ['The', 'dog', 'ran', 'very', 'fast'], sentence: 'The dog ran very fast' },
  { words: ['My', 'favorite', 'color', 'is', 'blue'], sentence: 'My favorite color is blue' },
];

export function SentenceScramble() {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [score, setScore] = useState(0);
  const [scrambledWords, setScrambledWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { incrementGameCompleted, addBadgeEarned } = useProgress();

  const sentence = sentences[currentSentence];

  useEffect(() => {
    scrambleWords();
  }, [currentSentence]);

  const scrambleWords = () => {
    const shuffled = [...sentence.words].sort(() => Math.random() - 0.5);
    setScrambledWords(shuffled);
    setSelectedWords([]);
  };

  const speakSentence = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleWordClick = (word: string, index: number) => {
    if (feedback) return;
    setSelectedWords([...selectedWords, word]);
    setScrambledWords(scrambledWords.filter((_, i) => i !== index));
  };

  const handleSelectedWordClick = (index: number) => {
    if (feedback) return;
    const word = selectedWords[index];
    setScrambledWords([...scrambledWords, word]);
    setSelectedWords(selectedWords.filter((_, i) => i !== index));
  };

  const checkAnswer = () => {
    const userSentence = selectedWords.join(' ');
    const isCorrect = userSentence === sentence.sentence;
    
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
      speakSentence('Excellent! Perfect sentence!');
    }

    setTimeout(() => {
      if (currentSentence < sentences.length - 1) {
        setCurrentSentence(currentSentence + 1);
        setFeedback(null);
      } else {
        setIsComplete(true);
        incrementGameCompleted();
        if (score + (isCorrect ? 1 : 0) >= 5) {
          addBadgeEarned('sentence-master');
        }
      }
    }, 2000);
  };

  const reset = () => {
    setCurrentSentence(0);
    setScore(0);
    setFeedback(null);
    setIsComplete(false);
    scrambleWords();
  };

  if (isComplete) {
    return (
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-8 text-center space-y-4">
          <Trophy className="w-16 h-16 mx-auto text-yellow-500" />
          <h3 className="text-2xl font-bold">Sentence Master!</h3>
          <p className="text-lg">You scored {score} out of {sentences.length}</p>
          <div className="text-sm text-muted-foreground">
            {score >= 5 && <p className="text-emerald-600 font-semibold">🏆 Sentence Master Badge Earned!</p>}
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
          <h3 className="text-xl font-bold">Sentence Scramble</h3>
          <div className="text-sm text-muted-foreground">
            {currentSentence + 1} / {sentences.length} • Score: {score}
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Put the words in the correct order:</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speakSentence(sentence.sentence)}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Hear the sentence
            </Button>
          </div>

          {/* User's sentence construction area */}
          <div className="min-h-[100px] p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-dashed border-green-300">
            <p className="text-xs text-muted-foreground mb-2 text-center">Your Sentence:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedWords.length === 0 ? (
                <p className="text-sm text-muted-foreground">Click words below to build your sentence</p>
              ) : (
                selectedWords.map((word, index) => (
                  <Button
                    key={`selected-${index}`}
                    variant="default"
                    onClick={() => handleSelectedWordClick(index)}
                    className="text-lg px-4 py-2"
                    disabled={feedback !== null}
                  >
                    {word}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Scrambled words */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-center">Available Words:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {scrambledWords.map((word, index) => (
                <Button
                  key={`scrambled-${index}`}
                  variant="outline"
                  onClick={() => handleWordClick(word, index)}
                  className="text-lg px-4 py-2"
                  disabled={feedback !== null}
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={scrambleWords}
              variant="outline"
              disabled={feedback !== null || selectedWords.length > 0}
              className="flex-1"
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
            <Button
              onClick={checkAnswer}
              disabled={selectedWords.length !== sentence.words.length || feedback !== null}
              className="flex-1"
            >
              Check Sentence
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
                  <CheckCircle className="w-6 h-6" /> Perfect sentence!
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <XCircle className="w-6 h-6" /> Not quite right!
                  </div>
                  <p className="text-sm">Correct: "{sentence.sentence}"</p>
                </div>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground text-center">
            <p>📝 Click words to build a sentence that makes sense!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
