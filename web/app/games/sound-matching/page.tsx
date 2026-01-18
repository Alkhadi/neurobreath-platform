'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Home,
  Volume2,
  HelpCircle,
  Star,
  Trophy,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate';

type SoundItem = {
  id: string;
  word: string;
  grapheme: string;
  focus: 'first' | 'last';
  hint: string;
};

const BEGINNER_ITEMS: SoundItem[] = [
  { id: 'b_ball', word: 'ball', grapheme: 'b', focus: 'first', hint: 'Listen for the first sound in “ball”.' },
  { id: 'c_cat', word: 'cat', grapheme: 'c', focus: 'first', hint: 'Listen for the first sound in “cat”.' },
  { id: 'm_moon', word: 'moon', grapheme: 'm', focus: 'first', hint: 'Listen for the first sound in “moon”.' },
  { id: 's_sun', word: 'sun', grapheme: 's', focus: 'first', hint: 'Listen for the first sound in “sun”.' },
  { id: 't_tent', word: 'tent', grapheme: 't', focus: 'first', hint: 'Listen for the first sound in “tent”.' },
  { id: 'p_pig', word: 'pig', grapheme: 'p', focus: 'first', hint: 'Listen for the first sound in “pig”.' },
  { id: 'r_rain', word: 'rain', grapheme: 'r', focus: 'first', hint: 'Listen for the first sound in “rain”.' },
  { id: 'g_goat', word: 'goat', grapheme: 'g', focus: 'first', hint: 'Listen for the first sound in “goat”.' },
  { id: 'n_nest', word: 'nest', grapheme: 'n', focus: 'first', hint: 'Listen for the first sound in “nest”.' },
  { id: 'k_kite', word: 'kite', grapheme: 'k', focus: 'first', hint: 'Listen for the first sound in “kite”.' },
  { id: 'f_fish', word: 'fish', grapheme: 'f', focus: 'first', hint: 'Listen for the first sound in “fish”.' },
  { id: 'l_leaf', word: 'leaf', grapheme: 'l', focus: 'first', hint: 'Listen for the first sound in “leaf”.' },
  { id: 'x_box', word: 'box', grapheme: 'x', focus: 'last', hint: 'Listen for the last sound in “box”.' },
  { id: 't_hat', word: 'hat', grapheme: 't', focus: 'last', hint: 'Listen for the last sound in “hat”.' },
];

const INTERMEDIATE_ITEMS: SoundItem[] = [
  { id: 'sh_ship', word: 'ship', grapheme: 'sh', focus: 'first', hint: 'Listen for the first sound in “ship”.' },
  { id: 'ch_chin', word: 'chin', grapheme: 'ch', focus: 'first', hint: 'Listen for the first sound in “chin”.' },
  { id: 'th_thin', word: 'thin', grapheme: 'th', focus: 'first', hint: 'Listen for the first sound in “thin”.' },
  { id: 'ph_phone', word: 'phone', grapheme: 'ph', focus: 'first', hint: 'Listen for the first sound in “phone”.' },
  // Note: vowel teams are best practiced as “middle sounds”; this game focuses on first/last sound for clarity.
  { id: 'ck_duck', word: 'duck', grapheme: 'ck', focus: 'last', hint: 'Listen for the last sound in “duck”.' },
  { id: 'ng_sing', word: 'sing', grapheme: 'ng', focus: 'last', hint: 'Listen for the last sound in “sing”.' },
];

type GameState = 'setup' | 'playing' | 'finished';

type Question = {
  item: SoundItem;
  options: string[];
  correct: string;
};

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

function shuffle<T>(arr: T[]) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getItemsForDifficulty(difficulty: Difficulty): SoundItem[] {
  return difficulty === 'beginner' ? BEGINNER_ITEMS : INTERMEDIATE_ITEMS;
}

function safeSpeak(text: string) {
  if (typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.0;
  window.speechSynthesis.speak(u);
}

function buildQuestions(difficulty: Difficulty, rounds: number): Question[] {
  const bank = getItemsForDifficulty(difficulty);
  const pool = shuffle(bank).slice(0, clamp(rounds, 1, bank.length));
  const graphemes = Array.from(new Set(bank.map(i => i.grapheme)));

  return pool.map(item => {
    const distractors = shuffle(graphemes.filter(g => g !== item.grapheme)).slice(0, 3);
    const options = shuffle([item.grapheme, ...distractors]);
    return {
      item,
      options,
      correct: item.grapheme,
    };
  });
}

export default function SoundMatchingGamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [rounds, setRounds] = useState(10);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const [timedMode, setTimedMode] = useState(false);
  const [durationSec, setDurationSec] = useState(60);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const [gameState, setGameState] = useState<GameState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const current = questions[index];
  const total = questions.length;

  const accuracy = useMemo(() => {
    if (attempts === 0) return 0;
    return Math.round((score / attempts) * 100);
  }, [attempts, score]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!current) return;
    if (!audioEnabled) return;

    // Auto-play on new question.
    safeSpeak(current.item.word);
  }, [audioEnabled, current, gameState]);

  const startGame = () => {
    const q = buildQuestions(difficulty, rounds);
    setQuestions(q);
    setIndex(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setFeedback(null);
    setShowHelp(false);
    setGameState('playing');
    if (timedMode) setSecondsLeft(durationSec);
  };

  const restart = () => {
    setGameState('setup');
    setQuestions([]);
    setIndex(0);
    setScore(0);
    setAttempts(0);
    setStreak(0);
    setFeedback(null);
    setShowHelp(false);
    if (timedMode) setSecondsLeft(durationSec);
  };

  const finish = () => {
    setGameState('finished');
    setFeedback(null);
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!timedMode) return;

    if (secondsLeft <= 0) {
      finish();
      return;
    }

    const id = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [gameState, secondsLeft, timedMode]);

  const choose = (option: string) => {
    if (!current) return;

    setAttempts(prev => prev + 1);

    const isCorrect = option === current.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setFeedback({ type: 'success', message: 'Correct! Nice listening.' });
      setTimeout(() => {
        setFeedback(null);
        if (index + 1 >= total) {
          finish();
        } else {
          setIndex(prev => prev + 1);
        }
      }, 700);
    } else {
      setStreak(0);
      setFeedback({
        type: 'error',
        message: `Not quite. The correct letters are “${current.correct}”.`,
      });
    }
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-blue-100 dark:bg-blue-900/30" aria-hidden="true">
                <span className="text-5xl">🎵</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Sound Matching Game</h1>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Listen to a word and choose the letters that match the target sound. Great for phonological awareness.
              </p>
              <p className="text-xs text-muted-foreground">
                Tip: This uses your device’s built-in text-to-speech. If audio is unavailable, you can still play visually.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Difficulty
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={difficulty === 'beginner' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('beginner')}
                    className="h-auto flex-col items-start p-4"
                  >
                    <span className="font-bold">Beginner</span>
                    <span className="text-xs text-muted-foreground">Single letters</span>
                  </Button>
                  <Button
                    variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                    onClick={() => setDifficulty('intermediate')}
                    className="h-auto flex-col items-start p-4"
                  >
                    <span className="font-bold">Intermediate</span>
                    <span className="text-xs text-muted-foreground">Digraphs & vowel teams</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  Settings
                </h2>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Rounds</div>
                      <div className="text-xs text-muted-foreground">How many questions per game</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setRounds(r => clamp(r - 1, 5, 15))}>
                        -
                      </Button>
                      <span className="w-8 text-center text-sm" aria-live="polite">
                        {rounds}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => setRounds(r => clamp(r + 1, 5, 15))}>
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">Audio</div>
                      <div className="text-xs text-muted-foreground">Auto-play the word</div>
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

                  <div className="rounded-lg border p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Timed mode</div>
                        <div className="text-xs text-muted-foreground">Optional countdown challenge</div>
                      </div>
                      <Switch checked={timedMode} onCheckedChange={setTimedMode} aria-label="Toggle timed mode" />
                    </div>
                    {timedMode ? (
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <Select value={String(durationSec)} onValueChange={(v) => setDurationSec(Number(v))}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="45">45 seconds</SelectItem>
                            <SelectItem value="60">60 seconds</SelectItem>
                            <SelectItem value="90">90 seconds</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
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
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30" aria-hidden="true">
                <span className="text-5xl">🏁</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Great work!</h1>
              <p className="text-muted-foreground">
                You scored <span className="font-semibold text-foreground">{score}</span> out of{' '}
                <span className="font-semibold text-foreground">{total}</span> ({pct}%).
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                  <div className="text-2xl font-bold">{pct}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">Attempts</div>
                  <div className="text-2xl font-bold">{attempts}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground">Best streak</div>
                  <div className="text-2xl font-bold">{Math.max(0, streak)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={startGame} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play again
              </Button>
              <Button onClick={restart} variant="outline" className="flex-1">
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30" aria-hidden="true">
              <span className="text-3xl">🎵</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Sound Matching Game</h1>
              <p className="text-sm text-muted-foreground">Choose the letters that match the sound you hear.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHelp(v => !v)} aria-expanded={showHelp}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
            {timedMode ? (
              <div
                className="px-3 py-2 rounded-md border text-sm text-muted-foreground bg-white/60 dark:bg-white/5"
                role="status"
                aria-live="polite"
              >
                Time left: <span className="font-semibold text-foreground tabular-nums">{secondsLeft}s</span>
              </div>
            ) : null}
            <Button
              variant={audioEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAudioEnabled(v => !v)}
              aria-pressed={audioEnabled ? 'true' : 'false'}
            >
              <Volume2 className="w-4 h-4 mr-2" />
              Audio {audioEnabled ? 'On' : 'Off'}
            </Button>
            <Button variant="outline" size="sm" onClick={restart}>
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
                <li>Press “Play word” (or listen automatically) and focus on the target sound.</li>
                <li>Choose the letters that make that sound.</li>
                <li>If you miss it, replay the word and try again.</li>
              </ul>
              <p className="text-xs text-muted-foreground">
                Educational note: This is a phonics practice tool and not medical advice.
              </p>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Question <span className="font-semibold text-foreground">{index + 1}</span> of{' '}
                <span className="font-semibold text-foreground">{total}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Score <span className="font-semibold text-foreground">{score}</span>
                <span className="text-muted-foreground">/{total}</span>
              </div>
            </div>

            <Progress value={total > 0 ? ((index + 1) / total) * 100 : 0} />

            {current ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="rounded-xl border p-4 bg-white/60 dark:bg-white/5">
                    <div className="text-xs text-muted-foreground">Listen to this word</div>
                    <div className="text-3xl font-bold tracking-wide">{current.item.word}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {current.item.focus === 'first' ? 'Focus: first sound' : 'Focus: last sound'}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => safeSpeak(current.item.word)}
                      variant="default"
                      className="min-w-[140px]"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      Play word
                    </Button>
                    <Button
                      onClick={() => setFeedback({ type: 'success', message: current.item.hint })}
                      variant="outline"
                    >
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Hint
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Current streak: <span className="font-semibold text-foreground">{streak}</span> • Accuracy:{' '}
                    <span className="font-semibold text-foreground">{accuracy}%</span>
                  </div>

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
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Which letters match the sound?</div>
                  <div className="grid grid-cols-2 gap-3">
                    {current.options.map(option => (
                      <Button
                        key={option}
                        variant="outline"
                        className="h-16 text-xl font-bold"
                        onClick={() => choose(option)}
                        aria-label={`Choose ${option}`}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  <Card>
                    <CardContent className="p-4 text-xs text-muted-foreground">
                      Strategy: Say the word slowly, then isolate the {current.item.focus === 'first' ? 'first' : 'last'}
                      sound.
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
