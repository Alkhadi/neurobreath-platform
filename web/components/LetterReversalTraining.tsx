'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RotateCcw, Check, X, Trophy, Eye } from 'lucide-react';

interface ReversalPair {
  correct: string;
  reversed: string;
  visual: string;
  mnemonic: string;
}

const REVERSAL_PAIRS: ReversalPair[] = [
  {
    correct: 'b',
    reversed: 'd',
    visual: '🍅 Bat has the ball before it hits (b comes first)',
    mnemonic: 'b has the stick on the left, like a bat ready to hit'
  },
  {
    correct: 'p',
    reversed: 'q',
    visual: '👑 Prince wears crown on head (p has tail down)',
    mnemonic: 'p has its tail pointing down like gravity pulling'
  },
  {
    correct: 'n',
    reversed: 'u',
    visual: '🌈 Bridge goes up (n), tunnel goes down (u)',
    mnemonic: 'n has the curve on top like a bridge'
  },
  {
    correct: 'm',
    reversed: 'w',
    visual: '🏝️ Mountains up (m), Water waves (w)',
    mnemonic: 'm has humps pointing up, w has valleys pointing down'
  }
];

interface Challenge {
  instruction: string;
  targetLetter: string;
  options: string[];
  correctIndex: number;
}

export function LetterReversalTraining() {
  const [selectedPair, setSelectedPair] = useState<ReversalPair>(REVERSAL_PAIRS[0]);
  const [showPractice, setShowPractice] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [masteredPairs, setMasteredPairs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('reversal-mastered');
    if (saved) {
      setMasteredPairs(JSON.parse(saved));
    }
  }, []);

  const generateChallenge = () => {
    const challengeTypes = [
      // Type 1: "Find the correct letter"
      () => ({
        instruction: `Which is the correct letter "${selectedPair.correct}"?`,
        targetLetter: selectedPair.correct,
        options: [
          selectedPair.correct,
          selectedPair.reversed,
          selectedPair.correct,
          selectedPair.reversed
        ],
        correctIndex: 0
      }),
      // Type 2: "Count specific letter"
      () => {
        const letters = [];
        const correctCount = 3 + Math.floor(Math.random() * 3);
        const totalCount = 8;
        
        for (let i = 0; i < correctCount; i++) {
          letters.push(selectedPair.correct);
        }
        for (let i = correctCount; i < totalCount; i++) {
          letters.push(selectedPair.reversed);
        }
        
        // Shuffle
        for (let i = letters.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        
        return {
          instruction: `Count how many "${selectedPair.correct}" letters you see: ${letters.join(' ')}`,
          targetLetter: selectedPair.correct,
          options: [`${correctCount - 1}`, `${correctCount}`, `${correctCount + 1}`, `${totalCount - correctCount}`],
          correctIndex: 1
        };
      },
      // Type 3: "Which is different?"
      () => {
        const options = [
          selectedPair.reversed,
          selectedPair.correct,
          selectedPair.correct,
          selectedPair.correct
        ];
        const correctIndex = 0;
        
        return {
          instruction: 'Which letter is different from the others?',
          targetLetter: selectedPair.reversed,
          options,
          correctIndex
        };
      }
    ];

    const selected = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    const challenge = selected();
    
    setCurrentChallenge(challenge);
    setShowPractice(true);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentChallenge) return;

    if (selectedAnswer === currentChallenge.correctIndex) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      
      if (streak >= 4 && !masteredPairs.includes(selectedPair.correct)) {
        const updated = [...masteredPairs, selectedPair.correct];
        setMasteredPairs(updated);
        localStorage.setItem('reversal-mastered', JSON.stringify(updated));
      }
    } else {
      setFeedback('incorrect');
      setStreak(0);
    }

    setTimeout(() => {
      if (feedback === 'correct') {
        generateChallenge();
      } else {
        setShowPractice(false);
        setFeedback(null);
      }
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <RotateCcw className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Letter Reversal Training</CardTitle>
              <CardDescription>Master commonly confused letters</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-800">
            <Trophy className="h-3 w-3 mr-1" />
            Streak: {streak}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Evidence Banner */}
        <div className="bg-cyan-50 dark:bg-cyan-950/50 p-4 rounded-lg border-l-4 border-cyan-500">
          <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
            <strong>Evidence-Based:</strong> Letter reversal confusion is common in dyslexia. Targeted visual discrimination training with mnemonic strategies significantly improves letter recognition accuracy.
          </p>
        </div>

        {/* Pair Selection */}
        {!showPractice && (
          <>
            <div className="space-y-3">
              <label className="text-sm font-medium">Select Letter Pair to Practice:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {REVERSAL_PAIRS.map((pair) => (
                  <button
                    key={pair.correct}
                    onClick={() => setSelectedPair(pair)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      selectedPair.correct === pair.correct
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950'
                        : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
                    }`}
                  >
                    <div className="flex gap-2 items-center justify-center mb-2">
                      <span className="text-4xl font-bold">{pair.correct}</span>
                      <RotateCcw className="h-4 w-4 text-gray-400" />
                      <span className="text-4xl font-bold text-gray-400">{pair.reversed}</span>
                    </div>
                    {masteredPairs.includes(pair.correct) && (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Learning Section */}
            <div className="space-y-4 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 rounded-lg">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyan-500" />
                <h3 className="font-bold text-lg">Visual Memory Helper</h3>
              </div>
              
              {/* Large Letter Display */}
              <div className="flex gap-8 items-center justify-center p-8 bg-white dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <div className="text-8xl font-bold text-cyan-600 mb-2">{selectedPair.correct}</div>
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">Correct</div>
                </div>
                <div className="text-4xl text-gray-400">≠</div>
                <div className="text-center">
                  <div className="text-8xl font-bold text-gray-400 mb-2">{selectedPair.reversed}</div>
                  <div className="text-sm font-medium text-red-600 dark:text-red-400">Not the same</div>
                </div>
              </div>

              {/* Visual Aid */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                <p className="text-lg font-medium mb-2">👁️ Visual Trick:</p>
                <p className="text-gray-700 dark:text-gray-300">{selectedPair.visual}</p>
              </div>

              {/* Mnemonic */}
              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg">
                <p className="text-lg font-medium mb-2">🧠 Memory Helper:</p>
                <p className="text-gray-700 dark:text-gray-300">{selectedPair.mnemonic}</p>
              </div>

              {/* Practice Button */}
              <Button
                onClick={generateChallenge}
                size="lg"
                className="w-full bg-cyan-500 hover:bg-cyan-600"
              >
                <Eye className="h-5 w-5 mr-2" />
                Start Practice
              </Button>
            </div>
          </>
        )}

        {/* Practice Mode */}
        {showPractice && currentChallenge && (
          <div className="space-y-4">
            {/* Instruction */}
            <div className="bg-cyan-100 dark:bg-cyan-900 p-4 rounded-lg">
              <h3 className="font-bold text-lg text-center">{currentChallenge.instruction}</h3>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {currentChallenge.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  disabled={feedback !== null}
                  className={`p-8 rounded-lg border-4 text-center transition-all ${
                    selectedAnswer === idx
                      ? feedback === 'correct'
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : feedback === 'incorrect'
                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-cyan-300'
                  } ${feedback !== null && idx === currentChallenge.correctIndex ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}
                >
                  <div className="text-6xl font-bold">{option}</div>
                  {feedback && idx === currentChallenge.correctIndex && (
                    <Check className="h-8 w-8 text-green-500 mx-auto mt-2" />
                  )}
                  {feedback === 'incorrect' && idx === selectedAnswer && (
                    <X className="h-8 w-8 text-red-500 mx-auto mt-2" />
                  )}
                </button>
              ))}
            </div>

            {feedback === null && (
              <Button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full bg-cyan-500 hover:bg-cyan-600"
              >
                <Check className="h-5 w-5 mr-2" />
                Check Answer
              </Button>
            )}

            {/* Streak Info */}
            {streak > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg text-center">
                <p className="font-medium">
                  🔥 {streak} correct in a row! {streak >= 5 ? 'Amazing!' : 'Keep going!'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-cyan-500">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="text-2xl font-bold text-cyan-500">{masteredPairs.length}/{REVERSAL_PAIRS.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Pairs Mastered</div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span className="font-medium">
              {Math.round((masteredPairs.length / REVERSAL_PAIRS.length) * 100)}%
            </span>
          </div>
          <Progress value={(masteredPairs.length / REVERSAL_PAIRS.length) * 100} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
