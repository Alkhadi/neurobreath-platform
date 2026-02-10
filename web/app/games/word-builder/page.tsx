'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Home,
  Volume2,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Trophy,
  Target,
} from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate';

type WordBuildItem = {
  id: string;
  word: string;
  chunks: string[];
  clue: string;
};

const BEGINNER_WORDS: WordBuildItem[] = [
  { id: 'cat', word: 'cat', chunks: ['c', 'a', 't'], clue: 'A small pet that says “meow”.' },
  { id: 'sun', word: 'sun', chunks: ['s', 'u', 'n'], clue: 'It shines in the sky during the day.' },
  { id: 'map', word: 'map', chunks: ['m', 'a', 'p'], clue: 'A picture of places that helps you find your way.' },
  { id: 'fish', word: 'fish', chunks: ['f', 'i', 'sh'], clue: 'An animal that swims in water.' },
  { id: 'ship', word: 'ship', chunks: ['sh', 'i', 'p'], clue: 'A big boat that sails on the sea.' },
  { id: 'duck', word: 'duck', chunks: ['d', 'u', 'ck'], clue: 'A bird that says “quack”.' },
];

const INTERMEDIATE_WORDS: WordBuildItem[] = [
  { id: 'stop', word: 'stop', chunks: ['st', 'o', 'p'], clue: 'What you do at a red light.' },
  { id: 'flag', word: 'flag', chunks: ['f', 'l', 'a', 'g'], clue: 'A cloth symbol on a pole.' },
  { id: 'green', word: 'green', chunks: ['gr', 'ee', 'n'], clue: 'A colour like grass.' },
  { id: 'bright', word: 'bright', chunks: ['br', 'igh', 't'], clue: 'Very full of light.' },
  { id: 'train', word: 'train', chunks: ['tr', 'ai', 'n'], clue: 'A long vehicle on tracks.' },
  { id: 'chest', word: 'chest', chunks: ['ch', 'e', 'st'], clue: 'A part of your body where your heart is.' },
  { id: 'smile', word: 'smile', chunks: ['sm', 'i', 'l', 'e'], clue: 'You do this when you are happy.' },
];

type GameState = 'setup' | 'playing' | 'finished';

function shuffle<T>(arr: T[]) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function speak(text: string) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  window.speechSynthesis.speak(u);
}

function getBank(difficulty: Difficulty) {
  return difficulty === 'beginner' ? BEGINNER_WORDS : INTERMEDIATE_WORDS;
}

export default function WordBuilderGamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [rounds, setRounds] = useState(8);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [gameState, setGameState] = useState<GameState>('setup');
  const [items, setItems] = useState<WordBuildItem[]>([]);
  const [index, setIndex] = useState(0);
  const [pool, setPool] = useState<string[]>([]);
  const [built, setBuilt] = useState<string[]>([]);

  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const current = items[index];
  const total = items.length;

  const builtWord = useMemo(() => built.join(''), [built]);
  const progressPct = total > 0 ? ((index + 1) / total) * 100 : 0;

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!current) return;
    if (!audioEnabled) return;
    speak(current.word);
  }, [audioEnabled, current, gameState]);

  const startGame = () => {
    const bank = getBank(difficulty);
    const selected = shuffle(bank).slice(0, Math.min(rounds, bank.length));
    setItems(selected);
    setIndex(0);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setFeedback(null);
    setShowHelp(false);

    const first = selected[0];
    const tiles = shuffle([...first.chunks, ...shuffle(first.chunks).slice(0, Math.max(1, Math.floor(first.chunks.length / 2)))]);
    setPool(tiles);
    setBuilt([]);
    setGameState('playing');
  };

  const resetToSetup = () => {
    setGameState('setup');
    setItems([]);
    setIndex(0);
    setPool([]);
    setBuilt([]);
    setScore(0);
    setAttempts(0);
    setHintsUsed(0);
    setFeedback(null);
    setShowHelp(false);
  };

  const nextRound = () => {
    if (index + 1 >= total) {
      setGameState('finished');
      return;
    }

    const next = items[index + 1];
    const extra = shuffle(next.chunks).slice(0, Math.max(1, Math.floor(next.chunks.length / 2)));
    setPool(shuffle([...next.chunks, ...extra]));
    setBuilt([]);
    setFeedback(null);
    setIndex(prev => prev + 1);
  };

  const addTile = (tile: string) => {
    setBuilt(prev => [...prev, tile]);
    setFeedback(null);
  };

  const removeLast = () => {
    setBuilt(prev => prev.slice(0, -1));
    setFeedback(null);
  };

  const clearBuilt = () => {
    setBuilt([]);
    setFeedback(null);
  };

  const revealHint = () => {
    if (!current) return;
    const nextIndex = built.length;
    if (nextIndex >= current.chunks.length) return;

    setHintsUsed(prev => prev + 1);
    setBuilt(prev => [...prev, current.chunks[nextIndex]]);
    setFeedback({ type: 'success', message: 'Hint added: next sound tile revealed.' });
  };

  const checkAnswer = () => {
    if (!current) return;

    setAttempts(prev => prev + 1);

    if (builtWord === current.word) {
      const earned = Math.max(1, 10 - hintsUsed);
      setScore(prev => prev + earned);
      setFeedback({ type: 'success', message: `Correct! +${earned} points.` });
      setTimeout(() => nextRound(), 900);
      return;
    }

    // Common near-miss feedback: correct length but wrong order.
    if (built.length === current.chunks.length) {
      setFeedback({
        type: 'error',
        message: 'Close! Try changing the order of the sound tiles.',
      });
      return;
    }

    setFeedback({ type: 'error', message: 'Keep building — add the next sound tile.' });
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-purple-100 dark:bg-purple-900/30" aria-hidden="true">
                <span className="text-5xl">🔨</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Word Builder</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Build words by combining sound tiles. This strengthens decoding, blending, and spelling patterns.
              </p>
              <p className="text-xs text-muted-foreground">
                Educational note: This is learning support and not medical advice.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-600" />
                    Choose difficulty
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={difficulty === 'beginner' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('beginner')}
                      className="h-auto flex-col items-start p-4"
                    >
                      <span className="font-bold">Beginner</span>
                      <span className="text-xs text-muted-foreground">Short, simple words</span>
                    </Button>
                    <Button
                      variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('intermediate')}
                      className="h-auto flex-col items-start p-4"
                    >
                      <span className="font-bold">Intermediate</span>
                      <span className="text-xs text-muted-foreground">Blends & spelling patterns</span>
                    </Button>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Rounds</div>
                      <div className="text-xs text-muted-foreground">How many words to build</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRounds(r => Math.max(5, r - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm" aria-live="polite">
                        {rounds}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRounds(r => Math.min(12, r + 1))}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Audio</div>
                      <div className="text-xs text-muted-foreground">Speak the target word</div>
                    </div>
                    <Button
                      size="sm"
                      variant={audioEnabled ? 'default' : 'outline'}
                      onClick={() => setAudioEnabled(v => !v)}
                      aria-pressed={audioEnabled ? 'true' : 'false'}
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {audioEnabled ? 'On' : 'Off'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Goal
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Blend tiles in the right order to spell the word. Use hints if you get stuck.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startGame} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Start game
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/conditions/dyslexia#games">
                  <Home className="w-4 h-4 mr-2" />
                  Back to Dyslexia Hub
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished') {
    const pct = total > 0 ? Math.round((score / (total * 10)) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30" aria-hidden="true">
                <span className="text-5xl">🏁</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Finished!</h1>
              <p className="text-muted-foreground">
                Score: <span className="font-semibold text-foreground">{score}</span> • Attempts:{' '}
                <span className="font-semibold text-foreground">{attempts}</span> • Hints used:{' '}
                <span className="font-semibold text-foreground">{hintsUsed}</span>
              </p>
              <p className="text-xs text-muted-foreground">(Progress estimate: {pct}%)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startGame} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play again
              </Button>
              <Button onClick={resetToSetup} variant="outline" className="flex-1">
                Change settings
              </Button>
            </div>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/conditions/dyslexia#games">
                <Home className="w-4 h-4 mr-2" />
                Back to Dyslexia Hub
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30" aria-hidden="true">
              <span className="text-3xl">🔨</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Word Builder</h1>
              <p className="text-sm text-muted-foreground">Blend sound tiles to build the word.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHelp(v => !v)} aria-expanded={showHelp}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            <Button variant="outline" size="sm" onClick={resetToSetup}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/conditions/dyslexia#games">
                <Home className="w-4 h-4 mr-2" />
                Hub
              </Link>
            </Button>
          </div>
        </div>

        {showHelp ? (
          <Card>
            <CardContent className="p-4 space-y-2 text-sm">
              <p className="font-medium">How to play</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Read the clue and listen to the target word (optional).</li>
                <li>Click tiles to build the word from left to right.</li>
                <li>Use “Hint” to reveal the next correct tile if needed.</li>
              </ul>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Word <span className="font-semibold text-foreground">{index + 1}</span> of{' '}
                <span className="font-semibold text-foreground">{total}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Score <span className="font-semibold text-foreground">{score}</span>
              </div>
            </div>

            <Progress value={progressPct} />

            {current ? (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3">
                  <div className="rounded-xl border p-4 bg-white/60 dark:bg-white/5">
                    <div className="text-xs text-muted-foreground">Clue</div>
                    <div className="text-lg font-semibold">{current.clue}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => speak(current.word)} variant="default" disabled={!audioEnabled}>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Speak word
                    </Button>
                    <Button onClick={revealHint} variant="outline">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Hint
                    </Button>
                    <Button onClick={removeLast} variant="outline" disabled={built.length === 0}>
                      Undo
                    </Button>
                    <Button onClick={clearBuilt} variant="outline" disabled={built.length === 0}>
                      Clear
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <div className="text-xs text-muted-foreground">Your build</div>
                      <div className="mt-2 flex flex-wrap gap-2" aria-live="polite">
                        {built.length === 0 ? (
                          <span className="text-sm text-muted-foreground">Tap tiles to start building…</span>
                        ) : (
                          built.map((t, i) => (
                            <span
                              key={`${t}-${i}`}
                              className="px-3 py-2 rounded-lg border bg-white/70 dark:bg-white/5 text-sm font-semibold"
                            >
                              {t}
                            </span>
                          ))
                        )}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        Current word: <span className="font-semibold text-foreground">{builtWord || '—'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {feedback ? (
                    <div
                      className={`rounded-lg border p-3 text-sm flex items-start gap-2 ${
                        feedback.type === 'success'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                          : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900'
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {feedback.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-700 dark:text-emerald-300" />
                      ) : (
                        <XCircle className="w-4 h-4 mt-0.5 text-rose-700 dark:text-rose-300" />
                      )}
                      <div className="text-muted-foreground">{feedback.message}</div>
                    </div>
                  ) : null}

                  <Button onClick={checkAnswer} className="w-full" disabled={built.length === 0}>
                    Check
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Sound tiles</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {pool.map((tile, i) => (
                      <Button
                        key={`${tile}-${i}`}
                        variant="outline"
                        className="h-14 text-lg font-bold"
                        onClick={() => addTile(tile)}
                        aria-label={`Add tile ${tile}`}
                      >
                        {tile}
                      </Button>
                    ))}
                  </div>

                  <Card>
                    <CardContent className="p-4 text-xs text-muted-foreground">
                      Strategy: Say each tile out loud, then blend them together.
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
