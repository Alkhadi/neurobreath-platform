'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Check, X, Trophy, Sparkles } from 'lucide-react';

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

  useEffect(() => {
    const saved = localStorage.getItem('morphology-mastered');
    if (saved) {
      setMasteredMorphemes(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const filtered = MORPHEME_SETS.filter(set => set.type === selectedType);
    if (filtered.length > 0) {
      setCurrentSet(filtered[0]);
    }
  }, [selectedType]);

  const generateChallenge = () => {
    if (!currentSet) return;

    const challengeTypes = [
      // Type 1: "What does [morpheme] mean?"
      () => ({
        question: `What does the ${currentSet.type} "${currentSet.morpheme}" mean?`,
        options: shuffleArray([
          currentSet.meaning,
          ...MORPHEME_SETS
            .filter(s => s.id !== currentSet.id && s.type === currentSet.type)
            .slice(0, 3)
            .map(s => s.meaning)
        ]),
        correct: 0,
        morphemeId: currentSet.id
      }),
      // Type 2: "Which word uses [morpheme]?"
      () => {
        const wrongWords = MORPHEME_SETS
          .filter(s => s.id !== currentSet.id)
          .flatMap(s => s.examples)
          .slice(0, 3)
          .map(e => e.word);
        
        return {
          question: `Which word uses the ${currentSet.type} "${currentSet.morpheme}"?`,
          options: shuffleArray([currentSet.examples[0].word, ...wrongWords]),
          correct: 0,
          morphemeId: currentSet.id
        };
      },
      // Type 3: "What does [word] mean?"
      () => {
        const example = currentSet.examples[Math.floor(Math.random() * currentSet.examples.length)];
        return {
          question: `What does "${example.word}" mean?`,
          options: shuffleArray([
            example.definition,
            ...currentSet.examples
              .filter(e => e.word !== example.word)
              .slice(0, 3)
              .map(e => e.definition)
          ]),
          correct: 0,
          morphemeId: currentSet.id
        };
      }
    ];

    const selectedType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    const challenge = selectedType();
    const correctAnswer = challenge.options[0];
    challenge.options = shuffleArray(challenge.options);
    challenge.correct = challenge.options.indexOf(correctAnswer);

    setCurrentChallenge(challenge);
    setShowChallenge(true);
    setSelectedAnswer(null);
    setFeedback(null);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentChallenge) return;

    if (selectedAnswer === currentChallenge.correct) {
      setFeedback('correct');
      setScore(prev => prev + 10);
      
      if (!masteredMorphemes.includes(currentChallenge.morphemeId)) {
        const updated = [...masteredMorphemes, currentChallenge.morphemeId];
        setMasteredMorphemes(updated);
        localStorage.setItem('morphology-mastered', JSON.stringify(updated));
      }
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setShowChallenge(false);
      setFeedback(null);
    }, 2000);
  };

  const typeColor = {
    prefix: 'blue',
    suffix: 'green',
    root: 'purple'
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Morphology Master</CardTitle>
              <CardDescription>Build vocabulary through word parts</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-white dark:bg-gray-800">
            <Trophy className="h-3 w-3 mr-1" />
            {masteredMorphemes.length}/{MORPHEME_SETS.length} Mastered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Evidence Banner */}
        <div className="bg-indigo-50 dark:bg-indigo-950/50 p-4 rounded-lg border-l-4 border-indigo-500">
          <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
            <strong>Evidence-Based:</strong> Morphological awareness (understanding prefixes, suffixes, and roots) significantly improves decoding, vocabulary, and reading comprehension.
          </p>
        </div>

        {/* Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Morpheme Type:</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'prefix' as const, label: 'Prefixes', emoji: '🎯', desc: 'Beginning' },
              { type: 'suffix' as const, label: 'Suffixes', emoji: '🎯', desc: 'Ending' },
              { type: 'root' as const, label: 'Roots', emoji: '🌱', desc: 'Core Meaning' }
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedType(option.type)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  selectedType === option.type
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="text-3xl mb-1">{option.emoji}</div>
                <div className="text-sm font-semibold">{option.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Morpheme List */}
        {!showChallenge && (
          <div className="space-y-3">
            <label className="text-sm font-medium">Available {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}es:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {MORPHEME_SETS.filter(set => set.type === selectedType).map((set) => (
                <button
                  key={set.id}
                  onClick={() => setCurrentSet(set)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
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
          <div className="space-y-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              <h3 className="font-bold text-lg">Study: {currentSet.morpheme}</h3>
            </div>
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg">
              <p className="text-sm font-medium mb-3">
                <span className="text-indigo-600 dark:text-indigo-400">Meaning:</span> {currentSet.meaning}
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Examples:</p>
                {currentSet.examples.map((example, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 min-w-[100px]">
                      {example.word}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">= {example.definition}</span>
                  </div>
                ))}
              </div>
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
            <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">{currentChallenge.question}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {currentChallenge.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAnswer(idx)}
                  disabled={feedback !== null}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === idx
                      ? feedback === 'correct' && idx === currentChallenge.correct
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : feedback === 'incorrect' && idx === selectedAnswer
                        ? 'border-red-500 bg-red-50 dark:bg-red-950'
                        : 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                  } ${feedback !== null && idx === currentChallenge.correct ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center font-bold">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {feedback && idx === currentChallenge.correct && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {feedback === 'incorrect' && idx === selectedAnswer && (
                      <X className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {feedback === null && (
              <Button
                onClick={checkAnswer}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full bg-indigo-500 hover:bg-indigo-600"
              >
                <Check className="h-5 w-5 mr-2" />
                Submit Answer
              </Button>
            )}
          </div>
        )}

        {/* Score Display */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <div>
            <div className="text-2xl font-bold text-indigo-500">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
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
