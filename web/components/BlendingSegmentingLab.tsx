'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layers, Check, X, Trophy, Volume2 } from 'lucide-react';

interface Word {
  word: string;
  phonemes: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const WORDS: Word[] = [
  // Beginner (CVC words)
  { word: 'cat', phonemes: ['/k/', '/æ/', '/t/'], difficulty: 'Beginner' },
  { word: 'dog', phonemes: ['/d/', '/ɒ/', '/g/'], difficulty: 'Beginner' },
  { word: 'sun', phonemes: ['/s/', '/ʌ/', '/n/'], difficulty: 'Beginner' },
  { word: 'bat', phonemes: ['/b/', '/æ/', '/t/'], difficulty: 'Beginner' },
  { word: 'hop', phonemes: ['/h/', '/ɒ/', '/p/'], difficulty: 'Beginner' },
  { word: 'pig', phonemes: ['/p/', '/ɪ/', '/g/'], difficulty: 'Beginner' },
  // Intermediate
  { word: 'ship', phonemes: ['/ʃ/', '/ɪ/', '/p/'], difficulty: 'Intermediate' },
  { word: 'thin', phonemes: ['/θ/', '/ɪ/', '/n/'], difficulty: 'Intermediate' },
  { word: 'frog', phonemes: ['/f/', '/r/', '/ɒ/', '/g/'], difficulty: 'Intermediate' },
  { word: 'stop', phonemes: ['/s/', '/t/', '/ɒ/', '/p/'], difficulty: 'Intermediate' },
  { word: 'brush', phonemes: ['/b/', '/r/', '/ʌ/', '/ʃ/'], difficulty: 'Intermediate' },
  { word: 'clap', phonemes: ['/k/', '/l/', '/æ/', '/p/'], difficulty: 'Intermediate' },
  // Advanced
  { word: 'splash', phonemes: ['/s/', '/p/', '/l/', '/æ/', '/ʃ/'], difficulty: 'Advanced' },
  { word: 'string', phonemes: ['/s/', '/t/', '/r/', '/ɪ/', '/ŋ/'], difficulty: 'Advanced' },
  { word: 'scratch', phonemes: ['/s/', '/k/', '/r/', '/æ/', '/tʃ/'], difficulty: 'Advanced' },
  { word: 'thrash', phonemes: ['/θ/', '/r/', '/æ/', '/ʃ/'], difficulty: 'Advanced' },
  { word: 'sprint', phonemes: ['/s/', '/p/', '/r/', '/ɪ/', '/n/', '/t/'], difficulty: 'Advanced' },
  { word: 'crunch', phonemes: ['/k/', '/r/', '/ʌ/', '/n/', '/tʃ/'], difficulty: 'Advanced' }
];

type Mode = 'blending' | 'segmenting';

export function BlendingSegmentingLab() {
  const [mode, setMode] = useState<Mode>('blending');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState({ blending: 0, segmenting: 0 });
  const [attempts, setAttempts] = useState({ blending: 0, segmenting: 0 });

  useEffect(() => {
    const generateWord = () => {
      const filtered = WORDS.filter(w => w.difficulty === difficulty);
      const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
      setCurrentWord(randomWord);
      setUserAnswer([]);
      setFeedback(null);
    };

    generateWord();
    const saved = localStorage.getItem('blending-segmenting-score');
    if (saved) {
      setScore(JSON.parse(saved));
    }
  }, [mode, difficulty]);

  const generateNewWord = () => {
    const filtered = WORDS.filter(w => w.difficulty === difficulty);
    const randomWord = filtered[Math.floor(Math.random() * filtered.length)];
    setCurrentWord(randomWord);
    setUserAnswer([]);
    setFeedback(null);
  };

  const playSound = (phoneme: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(phoneme.replace(/\//g, ''));
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const playWord = () => {
    if (!currentWord) return;
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    if (!currentWord) return;

    let isCorrect = false;

    if (mode === 'segmenting') {
      isCorrect = JSON.stringify(userAnswer) === JSON.stringify(currentWord.phonemes);
    } else {
      // For blending, check if user selected phonemes match
      isCorrect = JSON.stringify(userAnswer.sort()) === JSON.stringify(currentWord.phonemes.sort());
    }

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      const newScore = { ...score };
      newScore[mode] += 10;
      setScore(newScore);
      localStorage.setItem('blending-segmenting-score', JSON.stringify(newScore));
    }

    const newAttempts = { ...attempts };
    newAttempts[mode] += 1;
    setAttempts(newAttempts);

    setTimeout(() => {
      generateNewWord();
    }, 2000);
  };

  const handlePhonemeClick = (phoneme: string) => {
    if (mode === 'segmenting') {
      setUserAnswer([...userAnswer, phoneme]);
    } else {
      if (userAnswer.includes(phoneme)) {
        setUserAnswer(userAnswer.filter(p => p !== phoneme));
      } else {
        setUserAnswer([...userAnswer, phoneme]);
      }
    }
    playSound(phoneme);
  };

  const clearAnswer = () => {
    setUserAnswer([]);
  };

  if (!currentWord) return null;

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Layers className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Blending & Segmenting Lab</CardTitle>
              <CardDescription>Master phonological awareness skills</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-800">
            <Trophy className="h-3 w-3 mr-1" />
            {mode === 'blending' ? score.blending : score.segmenting} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Evidence Banner */}
        <div className="bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-lg border-l-4 border-emerald-500">
          <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
            <strong>Evidence-Based:</strong> Phoneme blending and segmentation are foundational skills for reading. These exercises directly target the phonological processing deficits common in dyslexia.
          </p>
        </div>

        {/* Mode Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'blending' as Mode, label: 'Blending', emoji: '🔗', desc: 'Put sounds together' },
            { value: 'segmenting' as Mode, label: 'Segmenting', emoji: '✂️', desc: 'Break words apart' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setMode(option.value)}
              className={`p-4 rounded-lg border-2 text-center transition-all ${
                mode === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
              }`}
            >
              <div className="text-3xl mb-1">{option.emoji}</div>
              <div className="text-sm font-semibold">{option.label}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</div>
            </button>
          ))}
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Difficulty Level:</label>
          <div className="grid grid-cols-3 gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-3 rounded-lg border-2 text-center transition-all text-sm ${
                  difficulty === level
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Practice Area */}
        <div className="space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg">
          {mode === 'blending' ? (
            <>
              <div className="text-center space-y-3">
                <h3 className="font-bold text-lg">🔗 Blend these sounds to make a word:</h3>
                <div className="flex gap-2 justify-center flex-wrap">
                  {currentWord.phonemes.map((phoneme, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePhonemeClick(phoneme)}
                      className={`px-6 py-4 text-2xl font-bold rounded-lg border-2 transition-all ${
                        userAnswer.includes(phoneme)
                          ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-emerald-300'
                      }`}
                    >
                      {phoneme}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the sounds in order and blend them together
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-3">
                <h3 className="font-bold text-lg">✂️ Break this word into sounds:</h3>
                <div className="flex items-center justify-center gap-3">
                  <div className="text-5xl font-bold text-emerald-600">{currentWord.word}</div>
                  <Button onClick={playWord} size="sm" variant="outline">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-4">
                  {currentWord.phonemes.map((phoneme, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePhonemeClick(phoneme)}
                      className="px-4 py-3 text-xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-emerald-300 transition-all"
                    >
                      {phoneme}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click each sound you hear in order
                </p>
              </div>
            </>
          )}

          {/* User Answer Display */}
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg min-h-[80px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Answer:</span>
              {userAnswer.length > 0 && (
                <Button onClick={clearAnswer} size="sm" variant="ghost">
                  Clear
                </Button>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {userAnswer.length > 0 ? (
                userAnswer.map((phoneme, idx) => (
                  <span key={idx} className="px-3 py-2 bg-emerald-100 dark:bg-emerald-900 rounded-lg text-lg font-semibold">
                    {phoneme}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 dark:text-gray-600">Select sounds above...</span>
              )}
            </div>
          </div>

          {/* Check Button */}
          <Button
            onClick={checkAnswer}
            disabled={userAnswer.length === 0 || feedback !== null}
            size="lg"
            className="w-full bg-emerald-500 hover:bg-emerald-600"
          >
            <Check className="h-5 w-5 mr-2" />
            Check Answer
          </Button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              feedback === 'correct'
                ? 'bg-green-50 dark:bg-green-950 border-l-4 border-green-500'
                : 'bg-red-50 dark:bg-red-950 border-l-4 border-red-500'
            }`}
          >
            {feedback === 'correct' ? (
              <>
                <Check className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">🎉 Perfect! You {mode === 'blending' ? 'blended' : 'segmented'} it correctly!</p>
                  <p className="text-sm">The word is: <strong>{currentWord.word}</strong></p>
                </div>
              </>
            ) : (
              <>
                <X className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium">💪 Try again! The correct sounds are:</p>
                  <p className="text-sm">{currentWord.phonemes.join(' ')}</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-emerald-500">{score.blending}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Blending Points</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-emerald-500">{score.segmenting}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Segmenting Points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
