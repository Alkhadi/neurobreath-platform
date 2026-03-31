'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Check, X, Trophy, Sparkles, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface MorphemeSet {
  id: string;
  type: 'prefix' | 'suffix' | 'root';
  morpheme: string;
  meaning: string;
  examples: { word: string; definition: string }[];
}

const MORPHEME_SETS: MorphemeSet[] = [
  // Prefixes
  {
    id: 'pre1',
    type: 'prefix',
    morpheme: 'un-',
    meaning: 'not, opposite of',
    examples: [
      { word: 'unhappy', definition: 'not happy' },
      { word: 'unlock', definition: 'opposite of lock' },
      { word: 'unfair', definition: 'not fair' },
      { word: 'undo', definition: 'reverse an action' }
    ]
  },
  {
    id: 'pre2',
    type: 'prefix',
    morpheme: 're-',
    meaning: 'again, back',
    examples: [
      { word: 'rewrite', definition: 'write again' },
      { word: 'return', definition: 'come back' },
      { word: 'replay', definition: 'play again' },
      { word: 'rebuild', definition: 'build again' }
    ]
  },
  {
    id: 'pre3',
    type: 'prefix',
    morpheme: 'pre-',
    meaning: 'before',
    examples: [
      { word: 'preview', definition: 'see before' },
      { word: 'preheat', definition: 'heat before' },
      { word: 'prefix', definition: 'attached before' },
      { word: 'prehistoric', definition: 'before recorded history' }
    ]
  },
  {
    id: 'pre4',
    type: 'prefix',
    morpheme: 'dis-',
    meaning: 'not, opposite',
    examples: [
      { word: 'disagree', definition: 'not agree' },
      { word: 'disappear', definition: 'opposite of appear' },
      { word: 'dislike', definition: 'not like' },
      { word: 'disconnect', definition: 'opposite of connect' }
    ]
  },
  // Suffixes
  {
    id: 'suf1',
    type: 'suffix',
    morpheme: '-ful',
    meaning: 'full of',
    examples: [
      { word: 'helpful', definition: 'full of help' },
      { word: 'beautiful', definition: 'full of beauty' },
      { word: 'careful', definition: 'full of care' },
      { word: 'peaceful', definition: 'full of peace' }
    ]
  },
  {
    id: 'suf2',
    type: 'suffix',
    morpheme: '-less',
    meaning: 'without',
    examples: [
      { word: 'helpless', definition: 'without help' },
      { word: 'fearless', definition: 'without fear' },
      { word: 'careless', definition: 'without care' },
      { word: 'hopeless', definition: 'without hope' }
    ]
  },
  {
    id: 'suf3',
    type: 'suffix',
    morpheme: '-ness',
    meaning: 'state of being',
    examples: [
      { word: 'happiness', definition: 'state of being happy' },
      { word: 'darkness', definition: 'state of being dark' },
      { word: 'kindness', definition: 'state of being kind' },
      { word: 'sadness', definition: 'state of being sad' }
    ]
  },
  {
    id: 'suf4',
    type: 'suffix',
    morpheme: '-er',
    meaning: 'one who, more',
    examples: [
      { word: 'teacher', definition: 'one who teaches' },
      { word: 'faster', definition: 'more fast' },
      { word: 'singer', definition: 'one who sings' },
      { word: 'bigger', definition: 'more big' }
    ]
  },
  // Roots
  {
    id: 'root1',
    type: 'root',
    morpheme: 'port',
    meaning: 'carry',
    examples: [
      { word: 'transport', definition: 'carry across' },
      { word: 'portable', definition: 'able to be carried' },
      { word: 'export', definition: 'carry out' },
      { word: 'import', definition: 'carry in' }
    ]
  },
  {
    id: 'root2',
    type: 'root',
    morpheme: 'scribe/script',
    meaning: 'write',
    examples: [
      { word: 'describe', definition: 'write down' },
      { word: 'script', definition: 'something written' },
      { word: 'prescribe', definition: 'write before' },
      { word: 'manuscript', definition: 'written by hand' }
    ]
  },
  {
    id: 'root3',
    type: 'root',
    morpheme: 'graph',
    meaning: 'write, draw',
    examples: [
      { word: 'photograph', definition: 'light drawing' },
      { word: 'autograph', definition: 'self writing' },
      { word: 'paragraph', definition: 'written beside' },
      { word: 'graphics', definition: 'drawn images' }
    ]
  },
  {
    id: 'root4',
    type: 'root',
    morpheme: 'bio',
    meaning: 'life',
    examples: [
      { word: 'biology', definition: 'study of life' },
      { word: 'biography', definition: 'life writing' },
      { word: 'biodegradable', definition: 'able to break down naturally' },
      { word: 'antibiotic', definition: 'against life (bacteria)' }
    ]
  }
];

const TYPE_LABELS: Record<string, string> = {
  prefix: 'Prefixes',
  suffix: 'Suffixes',
  root: 'Roots'
};

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface Challenge {
  question: string;
  options: string[];
  correct: number;
  morphemeId: string;
}

export function MorphologyMaster() {
  const [selectedType, setSelectedType] = useState<'prefix' | 'suffix' | 'root'>('prefix');
  const [currentSet, setCurrentSet] = useState<MorphemeSet | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [masteredMorphemes, setMasteredMorphemes] = useState<string[]>([]);
  const [challengeCount, setChallengeCount] = useState(0);
  const [correctInSession, setCorrectInSession] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('morphology-mastered');
    if (saved) {
      try {
        setMasteredMorphemes(JSON.parse(saved));
      } catch {
        // corrupted data — reset
      }
    }
    const savedScore = localStorage.getItem('morphology-score');
    if (savedScore) {
      const parsed = Number(savedScore);
      if (!Number.isNaN(parsed)) setScore(parsed);
    }
  }, []);

  useEffect(() => {
    const filtered = MORPHEME_SETS.filter(set => set.type === selectedType);
    if (filtered.length > 0) {
      setCurrentSet(filtered[0]);
    }
    setShowChallenge(false);
    setChallengeCount(0);
    setCorrectInSession(0);
  }, [selectedType]);

  const filteredSets = MORPHEME_SETS.filter(set => set.type === selectedType);

  const navigateMorpheme = useCallback((direction: 'prev' | 'next') => {
    if (!currentSet) return;
    const idx = filteredSets.findIndex(s => s.id === currentSet.id);
    if (direction === 'prev' && idx > 0) {
      setCurrentSet(filteredSets[idx - 1]);
    } else if (direction === 'next' && idx < filteredSets.length - 1) {
      setCurrentSet(filteredSets[idx + 1]);
    }
  }, [currentSet, filteredSets]);

  const currentIndex = currentSet ? filteredSets.findIndex(s => s.id === currentSet.id) : -1;

  const generateChallenge = useCallback(() => {
    if (!currentSet) return;

    const allOtherSets = MORPHEME_SETS.filter(s => s.id !== currentSet.id);
    const sameTypeSets = allOtherSets.filter(s => s.type === currentSet.type);
    const distractorSets = sameTypeSets.length >= 3 ? sameTypeSets : allOtherSets;

    const challengeGenerators = [
      // Type 1: "What does [morpheme] mean?"
      () => {
        const distractorMeanings = shuffleArray(distractorSets)
          .slice(0, 3)
          .map(s => s.meaning);
        return {
          question: `What does the ${currentSet.type} "${currentSet.morpheme}" mean?`,
          options: [currentSet.meaning, ...distractorMeanings],
          correct: 0,
          morphemeId: currentSet.id
        };
      },
      // Type 2: "Which word uses [morpheme]?"
      () => {
        const wrongWords = shuffleArray(
          allOtherSets.flatMap(s => s.examples)
        ).slice(0, 3).map(e => e.word);
        const correctWord = currentSet.examples[Math.floor(Math.random() * currentSet.examples.length)].word;
        return {
          question: `Which word uses the ${currentSet.type} "${currentSet.morpheme}"?`,
          options: [correctWord, ...wrongWords],
          correct: 0,
          morphemeId: currentSet.id
        };
      },
      // Type 3: "What does [word] mean?"
      () => {
        const example = currentSet.examples[Math.floor(Math.random() * currentSet.examples.length)];
        const wrongDefs = shuffleArray(
          allOtherSets.flatMap(s => s.examples)
        ).slice(0, 3).map(e => e.definition);
        return {
          question: `What does "${example.word}" mean?`,
          options: [example.definition, ...wrongDefs],
          correct: 0,
          morphemeId: currentSet.id
        };
      }
    ];

    const generator = challengeGenerators[Math.floor(Math.random() * challengeGenerators.length)];
    const challenge = generator();

    // Ensure exactly 4 unique options
    const uniqueOptions = [...new Set(challenge.options)].slice(0, 4);
    while (uniqueOptions.length < 4) {
      const filler = shuffleArray(allOtherSets)[0];
      if (filler && !uniqueOptions.includes(filler.meaning)) {
        uniqueOptions.push(filler.meaning);
      } else {
        break;
      }
    }
    challenge.options = uniqueOptions;

    const correctAnswer = challenge.options[0];
    challenge.options = shuffleArray(challenge.options);
    challenge.correct = challenge.options.indexOf(correctAnswer);

    setCurrentChallenge(challenge);
    setShowChallenge(true);
    setSelectedAnswer(null);
    setFeedback(null);
  }, [currentSet]);

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentChallenge) return;

    if (selectedAnswer === currentChallenge.correct) {
      setFeedback('correct');
      const newScore = score + 10;
      setScore(newScore);
      localStorage.setItem('morphology-score', String(newScore));
      setCorrectInSession(prev => prev + 1);

      if (!masteredMorphemes.includes(currentChallenge.morphemeId)) {
        const updated = [...masteredMorphemes, currentChallenge.morphemeId];
        setMasteredMorphemes(updated);
        localStorage.setItem('morphology-mastered', JSON.stringify(updated));
      }
    } else {
      setFeedback('incorrect');
    }

    setChallengeCount(prev => prev + 1);
  };

  const handleNextAfterFeedback = () => {
    setFeedback(null);
    setSelectedAnswer(null);
    setCurrentChallenge(null);
    // Stay in challenge mode — generate next question
    generateChallenge();
  };

  const exitChallenge = () => {
    setShowChallenge(false);
    setFeedback(null);
    setSelectedAnswer(null);
    setCurrentChallenge(null);
    setChallengeCount(0);
    setCorrectInSession(0);
  };

  const resetProgress = () => {
    setScore(0);
    setMasteredMorphemes([]);
    setChallengeCount(0);
    setCorrectInSession(0);
    localStorage.removeItem('morphology-mastered');
    localStorage.removeItem('morphology-score');
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-3 sm:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-indigo-500 rounded-lg">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-xl">Morphology Master</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Build vocabulary through word parts</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white dark:bg-gray-800 text-xs">
              <Trophy className="h-3 w-3 mr-1" />
              {masteredMorphemes.length}/{MORPHEME_SETS.length}
            </Badge>
            {(score > 0 || masteredMorphemes.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetProgress}
                className="h-7 w-7 p-0"
                title="Reset progress"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6 pb-3 sm:pb-6 space-y-4 sm:space-y-6">
        {/* Evidence Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3 sm:p-4 rounded-lg border-l-4 border-indigo-500">
          <p className="text-xs sm:text-sm font-medium text-indigo-900 dark:text-indigo-100">
            <strong>Evidence-Based:</strong> Morphological awareness significantly improves decoding, vocabulary, and reading comprehension.
          </p>
        </div>

        {/* Type Selection */}
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-medium">Select Morpheme Type:</label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
            {[
              { type: 'prefix' as const, label: 'Prefixes', emoji: '🎯', desc: 'Beginning' },
              { type: 'suffix' as const, label: 'Suffixes', emoji: '🎯', desc: 'Ending' },
              { type: 'root' as const, label: 'Roots', emoji: '🌱', desc: 'Core' }
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedType(option.type)}
                className={`p-2 sm:p-4 rounded-lg border-2 text-center transition-all ${
                  selectedType === option.type
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="text-xl sm:text-3xl mb-0.5 sm:mb-1">{option.emoji}</div>
                <div className="text-xs sm:text-sm font-semibold">{option.label}</div>
                <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 hidden sm:block">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Morpheme List */}
        {!showChallenge && (
          <div className="space-y-3">
            <label className="text-xs sm:text-sm font-medium">Available {TYPE_LABELS[selectedType]}:</label>
            <div className="flex flex-col gap-2 sm:gap-3">
              {filteredSets.map((set) => (
                <button
                  key={set.id}
                  onClick={() => setCurrentSet(set)}
                  className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${
                    currentSet?.id === set.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      {set.morpheme}
                    </span>
                    {masteredMorphemes.includes(set.id) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Meaning: <span className="font-medium">{set.meaning}</span>
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Examples: {set.examples.slice(0, 2).map(e => e.word).join(', ')}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Morpheme Details */}
        {currentSet && !showChallenge && (
          <div className="space-y-3 sm:space-y-4 p-3 sm:p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                <h3 className="font-bold text-base sm:text-lg">Study: {currentSet.morpheme}</h3>
              </div>
              <span className="text-xs text-gray-500">{currentIndex + 1}/{filteredSets.length}</span>
            </div>
            <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                <span className="text-indigo-600 dark:text-indigo-400">Meaning:</span> {currentSet.meaning}
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Examples:</p>
                {currentSet.examples.map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[80px] sm:min-w-[100px]">
                      {example.word}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">= {example.definition}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Morpheme navigation */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMorpheme('prev')}
                disabled={currentIndex <= 0}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMorpheme('next')}
                disabled={currentIndex >= filteredSets.length - 1}
                className="flex-1"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <Button
              onClick={generateChallenge}
              size="lg"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Practice This Morpheme
            </Button>
          </div>
        )}

        {/* Challenge Mode */}
        {showChallenge && currentChallenge && (
          <div className="space-y-4">
            {/* Challenge header with session stats */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                Q{challengeCount + 1} {correctInSession > 0 && `· ${correctInSession} correct`}
              </Badge>
              <Button variant="ghost" size="sm" onClick={exitChallenge} className="text-xs h-7">
                Back to Study
              </Button>
            </div>

            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 sm:p-4 rounded-lg">
              <h3 className="font-bold text-sm sm:text-lg">{currentChallenge.question}</h3>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3">
              {currentChallenge.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => { if (feedback === null) setSelectedAnswer(idx); }}
                  disabled={feedback !== null}
                  className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === idx
                      ? feedback === 'correct' && idx === currentChallenge.correct
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : feedback === 'incorrect' && idx === selectedAnswer
                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  } ${feedback !== null && idx === currentChallenge.correct ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 text-sm sm:text-base">{option}</span>
                    {feedback && idx === currentChallenge.correct && (
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                    )}
                    {feedback === 'incorrect' && idx === selectedAnswer && (
                      <X className="h-5 w-5 text-red-500 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Feedback message */}
            {feedback && (
              <div className={`p-3 rounded-lg text-sm font-medium text-center ${
                feedback === 'correct'
                  ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300'
                  : 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300'
              }`}>
                {feedback === 'correct' ? '🎉 Correct! +10 points' : `❌ Incorrect. The answer is "${currentChallenge.options[currentChallenge.correct]}"`}
              </div>
            )}

            {feedback === null ? (
              <Button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full bg-indigo-500 hover:bg-indigo-600"
              >
                <Check className="h-5 w-5 mr-2" />
                Submit Answer
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleNextAfterFeedback}
                  size="lg"
                  className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                >
                  Next Question
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={exitChallenge}
                  className="shrink-0"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Score Display */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-500">{score}</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Points</div>
          </div>
          <div className="text-right">
            <Progress value={(masteredMorphemes.length / MORPHEME_SETS.length) * 100} className="h-2 w-32 mb-1" />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {Math.round((masteredMorphemes.length / MORPHEME_SETS.length) * 100)}% Complete
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
