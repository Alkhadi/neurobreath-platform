'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Home,
  HelpCircle,
  Volume2,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Trophy,
  RotateCcw
} from 'lucide-react';
import {
  type DifficultyLevel,
  type WordFamily,
  generateRound,
  checkWordFamily,
  getIncorrectExplanation,
  difficultyConfigs
} from '@/lib/games/wordFamilyData';
import { useWordFamilyProgress } from '@/hooks/useWordFamilyProgress';

type GameState = 'setup' | 'playing' | 'finished';

interface PlacedWord {
  word: string;
  family: string;
  correct: boolean;
}

export default function WordFamilySortingGame() {
  // Game configuration
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('beginner');
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [gameState, setGameState] = useState<GameState>('setup');
  
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [families, setFamilies] = useState<WordFamily[]>([]);
  const [words, setWords] = useState<Array<{ word: string; family: string }>>([]);
  const [placedWords, setPlacedWords] = useState<PlacedWord[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  
  // Timer
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  // Feedback
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  
  // Progress
  const { progress, recordSession } = useWordFamilyProgress();
  
  const config = difficultyConfigs[difficulty];
  const totalRounds = config.totalRounds;

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing' || !timerEnabled) return;
    
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [gameState, timerEnabled]);

  // Start game
  const startGame = () => {
    const { families: roundFamilies, words: roundWords } = generateRound(difficulty);
    setFamilies(roundFamilies);
    setWords(roundWords);
    setPlacedWords([]);
    setSelectedWord(null);
    setHintsRemaining(config.hintsAvailable);
    setHighlightedWord(null);
    setStreak(0);
    setScore(0);
    setCurrentRound(1);
    setTimeRemaining(timerEnabled ? 120 : 9999);
    setStartTime(Date.now());
    setGameState('playing');
    setFeedback(null);
  };

  // Next round
  const nextRound = () => {
    if (currentRound >= totalRounds) {
      finishGame();
      return;
    }
    
    const { families: roundFamilies, words: roundWords } = generateRound(difficulty);
    setFamilies(roundFamilies);
    setWords(roundWords);
    setPlacedWords([]);
    setSelectedWord(null);
    setHighlightedWord(null);
    setCurrentRound(prev => prev + 1);
    setFeedback(null);
  };

  // Finish game
  const finishGame = () => {
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
    const totalWords = placedWords.length;
    const correctWords = placedWords.filter(w => w.correct).length;
    const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
    
    const wordsMissed = placedWords
      .filter(w => !w.correct)
      .map(w => ({ word: w.word, correctFamily: w.family }));
    
    recordSession({
      date: new Date().toISOString(),
      difficulty,
      score,
      accuracy,
      timeTaken,
      wordsMissed
    });
    
    setGameState('finished');
  };

  // Place word in bin
  const placeWord = (binFamily: string) => {
    if (!selectedWord) return;
    
    const wordData = words.find(w => w.word === selectedWord);
    if (!wordData) return;
    
    const isCorrect = checkWordFamily(wordData.word, binFamily);
    
    // Update placed words
    setPlacedWords(prev => [
      ...prev,
      { word: wordData.word, family: wordData.family, correct: isCorrect }
    ]);
    
    // Update score and streak
    if (isCorrect) {
      const points = 10 + (streak * 2);
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setFeedback({
        message: `Correct! +${points} points${streak > 0 ? ` (${streak + 1} streak!)` : ''}`,
        type: 'success'
      });
    } else {
      setStreak(0);
      setFeedback({
        message: getIncorrectExplanation(wordData.word, wordData.family),
        type: 'error'
      });
    }
    
    // Remove word from available words
    setWords(prev => prev.filter(w => w.word !== selectedWord));
    setSelectedWord(null);
    setHighlightedWord(null);
    
    // Check if round is complete
    setTimeout(() => {
      setFeedback(null);
      if (words.length <= 1) {
        nextRound();
      }
    }, 2000);
  };

  // Use hint
  const useHint = () => {
    if (hintsRemaining <= 0 || !selectedWord) return;
    
    const wordData = words.find(w => w.word === selectedWord);
    if (!wordData) return;
    
    setHighlightedWord(selectedWord);
    setHintsRemaining(prev => prev - 1);
    
    // Remove highlight after 2 seconds
    setTimeout(() => {
      setHighlightedWord(null);
    }, 2000);
  };

  // Speak word using Web Speech API
  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup screen
  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-pink-100 dark:bg-pink-900/30">
                <span className="text-5xl">🏠</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Word Family Sorting</h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Sort words into the correct word families by their endings. Learn patterns like -at, -an, -ig, and more!
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Choose Difficulty
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={difficulty === 'beginner' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('beginner')}
                    className="h-auto flex-col items-start p-4"
                  >
                    <span className="font-bold">Beginner</span>
                    <span className="text-xs text-muted-foreground">2 families • 8 words</span>
                  </Button>
                  <Button
                    variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('intermediate')}
                    className="h-auto flex-col items-start p-4"
                  >
                    <span className="font-bold">Intermediate</span>
                    <span className="text-xs text-muted-foreground">3 families • 10 words</span>
                  </Button>
                </div>
              </div>

              <div>
                <label className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Enable Timer (2 minutes)</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={timerEnabled}
                    onChange={(e) => setTimerEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                </label>
              </div>

              {progress.totalSessions > 0 && (
                <Card className="bg-blue-50 dark:bg-blue-950/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">Your Progress</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="text-muted-foreground">Best (Beginner)</div>
                        <div className="font-bold">{progress.bestScores.beginner} points</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Best (Inter.)</div>
                        <div className="font-bold">{progress.bestScores.intermediate} points</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Games Played</div>
                        <div className="font-bold">{progress.totalSessions}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <Button onClick={startGame} size="lg" className="w-full">
              Start Game
            </Button>

            <Button
              variant="ghost"
              onClick={() => setShowHelp(true)}
              className="w-full"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              How to Play
            </Button>
          </CardContent>
        </Card>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold">What is a Word Family?</h3>
                <p className="text-sm text-muted-foreground">
                  A word family is a group of words that share the same ending sound and spelling pattern.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <strong>Example:</strong> cat, bat, hat, mat all belong to the <strong>-at</strong> family
                  </div>
                  <p>Learning word families helps you:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Read new words more easily</li>
                    <li>Recognize spelling patterns</li>
                    <li>Build your vocabulary</li>
                  </ul>
                </div>
                <div className="space-y-2 text-sm">
                  <h4 className="font-semibold">How to Play:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground ml-2">
                    <li>Tap a word to select it</li>
                    <li>Tap the bin it belongs to</li>
                    <li>Get instant feedback on your choice</li>
                    <li>Use hints when you need help</li>
                  </ol>
                </div>
                <Button onClick={() => setShowHelp(false)} className="w-full">
                  Got it!
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Playing screen
  if (gameState === 'playing') {
    const progressPercent = ((currentRound - 1) / totalRounds) * 100 + 
      ((totalRounds - (words.length / config.wordsPerRound)) / totalRounds) * (100 / totalRounds);

    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col safe-area-inset">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b z-10">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (confirm('Exit game? Your progress will be lost.')) {
                    setGameState('setup');
                  }
                }}
              >
                <Home className="w-4 h-4 mr-2" />
                Exit
              </Button>

              <div className="flex items-center gap-3 text-sm">
                {timerEnabled && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="font-bold">{score}</span>
                </div>
                {streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{streak}</span>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(true)}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Round {currentRound} of {totalRounds}</span>
                <span>{words.length} words left</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
            {/* Feedback */}
            {feedback && (
              <div
                className={`p-4 rounded-lg border-2 flex items-start gap-3 ${
                  feedback.type === 'success'
                    ? 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700'
                    : 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-700'
                }`}
                role="alert"
                aria-live="polite"
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                )}
                <p className="text-sm font-medium">{feedback.message}</p>
              </div>
            )}

            {/* Word Family Bins */}
            <div>
              <h2 className="text-lg font-bold mb-3">Word Family Bins</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {families.map((family) => (
                  <button
                    key={family.family}
                    onClick={() => selectedWord && placeWord(family.family)}
                    disabled={!selectedWord}
                    className={`
                      p-6 rounded-xl border-2 transition-all
                      ${family.color}
                      ${selectedWord 
                        ? 'cursor-pointer hover:scale-105 hover:shadow-lg' 
                        : 'opacity-50 cursor-not-allowed'}
                      focus-visible:ring-2 focus-visible:ring-offset-2
                      disabled:hover:scale-100
                    `}
                    aria-label={`Place word in ${family.displayName}`}
                  >
                    <div className="text-3xl font-bold mb-2">{family.family}</div>
                    <div className="text-sm font-semibold">{family.displayName}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Available Words */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Available Words</h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={useHint}
                    disabled={hintsRemaining <= 0 || !selectedWord}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Hint ({hintsRemaining})
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {words.map((wordData) => {
                  const isSelected = selectedWord === wordData.word;
                  const isHighlighted = highlightedWord === wordData.word;
                  
                  return (
                    <div key={wordData.word} className="relative">
                      <button
                        type="button"
                        onClick={() => setSelectedWord(wordData.word)}
                        className={`
                          w-full p-4 rounded-lg border-2 transition-all
                          ${isSelected 
                            ? 'border-primary bg-primary/10 scale-105 shadow-lg' 
                            : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}
                          ${isHighlighted ? 'animate-pulse ring-2 ring-yellow-400' : ''}
                          focus-visible:ring-2 focus-visible:ring-offset-2
                        `}
                        aria-label={`Select word ${wordData.word}`}
                        aria-pressed={isSelected ? 'true' : 'false'}
                      >
                        <div className="text-xl font-bold mb-1">{wordData.word}</div>
                        {isHighlighted && (
                          <div className="text-xs text-yellow-700 dark:text-yellow-400 font-semibold">
                            Ends with {wordData.family}
                          </div>
                        )}
                      </button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-1 right-1 w-8 h-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(wordData.word);
                        }}
                        aria-label={`Hear word ${wordData.word}`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {selectedWord && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Tap a bin above to place "{selectedWord}"
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Help Modal */}
        {showHelp && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-bold">Quick Help</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <strong>Hear Words:</strong> Tap the speaker icon on any word tile
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <strong>Use Hints:</strong> Select a word and tap "Hint" to see its ending highlighted
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <strong>Build Streaks:</strong> Get correct answers in a row for bonus points
                    </div>
                  </div>
                </div>
                <Button onClick={() => setShowHelp(false)} className="w-full">
                  Continue Playing
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Finished screen
  const totalWords = placedWords.length;
  const correctWords = placedWords.filter(w => w.correct).length;
  const accuracy = totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0;
  const wordsMissed = placedWords.filter(w => !w.correct);
  const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-6 md:p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="inline-flex p-4 rounded-2xl bg-pink-100 dark:bg-pink-900/30">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold">Game Complete!</h1>
            <p className="text-muted-foreground">
              {accuracy >= 90 ? "Outstanding work! 🌟" : 
               accuracy >= 70 ? "Great job! Keep practicing! 👍" : 
               "Good effort! Try again to improve! 💪"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-primary">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">{correctWords}/{totalWords}</div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold">{formatTime(timeTaken)}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </CardContent>
            </Card>
          </div>

          {wordsMissed.length > 0 && (
            <Card className="bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold">Words to Review:</h3>
                <div className="space-y-2">
                  {wordsMissed.map((missed, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-white dark:bg-gray-900">
                      <span className="font-medium">{missed.word}</span>
                      <span className="text-muted-foreground">→ {missed.family} family</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Learning Tips:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Say words aloud to hear the ending sound</li>
                <li>• Look for patterns - words that rhyme often share families</li>
                <li>• Practice with flashcards to build automaticity</li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={startGame} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button onClick={() => setGameState('setup')} variant="outline" className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Back to Menu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
