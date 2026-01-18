'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  BookOpen,
  Trophy,
  Target,
} from 'lucide-react';

type Difficulty = 'intermediate' | 'advanced';

type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type Passage = {
  id: string;
  title: string;
  summary: string;
  difficulty: Difficulty;
  text: string;
  questions: Question[];
};

const PASSAGES: Passage[] = [
  {
    id: 'parks_and_trees',
    title: 'Parks and Trees',
    summary: 'Find key details and cause/effect (shade, air, calmer cities).',
    difficulty: 'intermediate',
    text:
      'A park is a place where people can walk, play, and rest. Trees in parks do more than look nice. ' +
      'They provide shade on hot days and homes for birds and insects. Trees also help clean the air by taking in ' +
      'carbon dioxide and releasing oxygen. When a city has more trees, people often feel calmer and the streets can ' +
      'stay a little cooler during summer.',
    questions: [
      {
        id: 'q1',
        prompt: 'What is one benefit of trees in parks?',
        options: ['They make cars go faster', 'They provide shade', 'They turn grass into sand', 'They stop all rain'],
        correctIndex: 1,
        explanation: 'The passage says trees provide shade on hot days.',
      },
      {
        id: 'q2',
        prompt: 'What do trees release into the air?',
        options: ['Oxygen', 'Smoke', 'Plastic', 'Salt'],
        correctIndex: 0,
        explanation: 'The passage explains trees release oxygen.',
      },
      {
        id: 'q3',
        prompt: 'Why might a city feel cooler with more trees?',
        options: ['Trees create shade and can lower heat', 'Trees remove all sunlight forever', 'Trees make the ground glow', 'Trees stop the wind'],
        correctIndex: 0,
        explanation: 'Shade helps reduce heat, and the passage says streets can stay cooler.',
      },
    ],
  },
  {
    id: 'rainy_day_tools',
    title: 'A Rainy Day Plan',
    summary: 'Practice sequencing and picking the best action.',
    difficulty: 'intermediate',
    text:
      'Mina wanted to play outside, but it started to rain. Instead of feeling upset, she made a plan. ' +
      'First, she put her muddy shoes by the door and dried her coat. Next, she chose an indoor game and set a timer. ' +
      'After the timer ended, she switched to reading for ten minutes. By the time the rain stopped, Mina felt calm ' +
      'because she had used her time well.',
    questions: [
      {
        id: 'q1',
        prompt: 'What did Mina do first?',
        options: ['She went back outside', 'She dried her coat', 'She read for ten minutes', 'She fell asleep'],
        correctIndex: 1,
        explanation: 'The passage says: first she put her shoes by the door and dried her coat.',
      },
      {
        id: 'q2',
        prompt: 'Why did Mina feel calm?',
        options: ['Because she ignored the rain', 'Because she had a plan', 'Because she ate candy', 'Because it got colder'],
        correctIndex: 1,
        explanation: 'The passage explains she felt calm because she used her time well with a plan.',
      },
      {
        id: 'q3',
        prompt: 'What is the best summary of the passage?',
        options: ['Rain is always bad', 'Planning helps you handle changes', 'Timers are only for games', 'Reading makes rain stop'],
        correctIndex: 1,
        explanation: 'Mina adapts her plan and stays calm when things change.',
      },
    ],
  },
  {
    id: 'colour_and_color',
    title: 'Colour and Color',
    summary: 'Spot the main idea and compare UK/US spelling.',
    difficulty: 'intermediate',
    text:
      'In some places, people spell the word “colour” with a “u”. In other places, people spell it as “color” without a “u”. ' +
      'Both spellings mean the same thing. These differences can happen with other words too, like “favourite/favorite” and “centre/center”. ' +
      'If you see a spelling you do not recognise, try reading the word out loud and look at the meaning in the sentence.',
    questions: [
      {
        id: 'q1',
        prompt: 'What is the main idea of the passage?',
        options: ['Only one spelling is correct', 'Some words have different spellings in different places', 'Colours are hard to see', 'Sentences should be shorter'],
        correctIndex: 1,
        explanation: 'The passage explains some words have different spellings depending on where you are.',
      },
      {
        id: 'q2',
        prompt: 'According to the passage, “colour” and “color” are…',
        options: ['Different meanings', 'The same meaning', 'Two different languages', 'Not real words'],
        correctIndex: 1,
        explanation: 'It says both spellings mean the same thing.',
      },
      {
        id: 'q3',
        prompt: 'What should you try if you do not recognise a spelling?',
        options: ['Skip the whole page', 'Read it out loud and use the sentence meaning', 'Guess randomly', 'Delete the word'],
        correctIndex: 1,
        explanation: 'The passage suggests reading it out loud and checking the meaning in context.',
      },
    ],
  },
  {
    id: 'how_honey_is_made',
    title: 'How Honey Is Made',
    summary: 'Track a multi-step process and infer meaning.',
    difficulty: 'advanced',
    text:
      'Bees make honey from nectar, a sweet liquid found in many flowers. Worker bees collect nectar and carry it back ' +
      'to the hive. Inside the hive, the nectar is passed from bee to bee. This process helps change the nectar by adding ' +
      'enzymes. The bees then store the liquid in honeycomb cells and fan their wings to evaporate water. As the water ' +
      'content drops, the honey becomes thicker and less likely to spoil.',
    questions: [
      {
        id: 'q1',
        prompt: 'What do worker bees collect from flowers?',
        options: ['Sand', 'Nectar', 'Stones', 'Leaves'],
        correctIndex: 1,
        explanation: 'The passage states bees make honey from nectar collected from flowers.',
      },
      {
        id: 'q2',
        prompt: 'Why do bees fan their wings inside the hive?',
        options: ['To evaporate water from the nectar', 'To scare away birds', 'To make the hive louder', 'To freeze the honey'],
        correctIndex: 0,
        explanation: 'Fanning helps evaporate water so honey becomes thicker.',
      },
      {
        id: 'q3',
        prompt: 'What does the passage imply about thick honey?',
        options: ['It spoils more easily', 'It is less likely to spoil', 'It cannot be stored', 'It turns back into nectar'],
        correctIndex: 1,
        explanation: 'The passage says lower water content makes honey less likely to spoil.',
      },
    ],
  },
  {
    id: 'community_library',
    title: 'A Community Library',
    summary: 'Infer purpose and interpret implied information.',
    difficulty: 'advanced',
    text:
      'A community library offers more than shelves of books. It often provides quiet spaces for study, group rooms for projects, ' +
      'and events such as story time or local talks. Many libraries also lend items like puzzles, audiobooks, or even tools. ' +
      'By sharing resources, a library can reduce costs for families and support lifelong learning for people of all ages.',
    questions: [
      {
        id: 'q1',
        prompt: 'Which detail best supports the idea that libraries help families save money?',
        options: ['Libraries have shelves', 'Libraries lend items people can borrow', 'Libraries are always silent', 'Libraries sell snacks'],
        correctIndex: 1,
        explanation: 'Borrowing items means families do not need to buy everything themselves.',
      },
      {
        id: 'q2',
        prompt: 'What is implied about who can benefit from a community library?',
        options: ['Only children', 'Only adults', 'People of many ages', 'Only students with tests'],
        correctIndex: 2,
        explanation: 'The passage says it supports lifelong learning for people of all ages.',
      },
      {
        id: 'q3',
        prompt: 'Why might group rooms be useful?',
        options: ['For loud concerts', 'For projects and collaboration', 'For sleeping', 'For selling books'],
        correctIndex: 1,
        explanation: 'The passage mentions group rooms for projects.',
      },
    ],
  },
];

type ReadingPreferences = {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  wordSpacing: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
};

const READING_FONTS: Array<{ label: string; value: string }> = [
  { label: 'Default (site)', value: '' },
  { label: 'Lexend', value: 'Lexend, Open Sans, system-ui, sans-serif' },
  { label: 'Atkinson Hyperlegible', value: 'Atkinson Hyperlegible, Lexend, system-ui, sans-serif' },
  { label: 'OpenDyslexic', value: 'OpenDyslexic, Lexend, system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, system-ui, sans-serif' },
  { label: 'Verdana', value: 'Verdana, system-ui, sans-serif' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS, system-ui, sans-serif' },
];

const READING_BACKGROUNDS: Array<{ label: string; value: string }> = [
  { label: 'White', value: '#ffffff' },
  { label: 'Cream', value: '#fffef0' },
  { label: 'Light Blue', value: '#e3f2fd' },
  { label: 'Light Green', value: '#e8f5e9' },
];

const DEFAULT_READING_PREFS: ReadingPreferences = {
  fontSize: 18,
  lineHeight: 1.8,
  letterSpacing: 0,
  wordSpacing: 0,
  fontFamily: 'Lexend, Open Sans, system-ui, sans-serif',
  backgroundColor: '#fffef0',
  textColor: '#111111',
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

type GameState = 'setup' | 'playing' | 'finished';

type AnswerState = {
  selectedIndex: number | null;
  isCorrect: boolean | null;
};

export default function ReadingComprehensionGamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('intermediate');
  const [gameState, setGameState] = useState<GameState>('setup');

  const [passageId, setPassageId] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [showHelp, setShowHelp] = useState(false);

  const [timedMode, setTimedMode] = useState(false);
  const [durationSec, setDurationSec] = useState(180);
  const [secondsLeft, setSecondsLeft] = useState(180);
  const timerRef = useRef<number | null>(null);

  const [readingModeEnabled, setReadingModeEnabled] = useState(false);
  const [readingPrefs, setReadingPrefs] = useState<ReadingPreferences>(DEFAULT_READING_PREFS);

  const available = useMemo(() => PASSAGES.filter(p => p.difficulty === difficulty), [difficulty]);

  useEffect(() => {
    if (available.length === 0) {
      setPassageId(null);
      return;
    }
    setPassageId(prev => (prev && available.some(p => p.id === prev) ? prev : available[0].id));
  }, [available]);

  useEffect(() => {
    if (gameState !== 'setup') return;
    if (!timedMode) return;
    setSecondsLeft(durationSec);
  }, [durationSec, gameState, timedMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('dyslexia-reading-preferences');
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<ReadingPreferences>;
      setReadingPrefs(prev => ({
        ...prev,
        ...parsed,
      }));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('dyslexia-reading-preferences', JSON.stringify(readingPrefs));
    } catch {
      // ignore
    }
  }, [readingPrefs]);

  useEffect(() => {
    if (gameState !== 'playing' || !timedMode) return;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = window.setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState, timedMode]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!timedMode) return;
    if (secondsLeft !== 0) return;
    setGameState('finished');
  }, [gameState, secondsLeft, timedMode]);

  const passage = useMemo(() => {
    if (available.length === 0) return undefined;
    return available.find(p => p.id === passageId) ?? available[0];
  }, [available, passageId]);
  const question = passage?.questions[questionIndex];

  const totalQuestions = passage?.questions.length ?? 0;
  const progress = totalQuestions > 0 ? ((questionIndex + 1) / totalQuestions) * 100 : 0;

  const reset = () => {
    setGameState('setup');
    setQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setShowHelp(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (timedMode) setSecondsLeft(durationSec);
  };

  const start = () => {
    setGameState('playing');
    setQuestionIndex(0);
    setScore(0);
    setAnswers({});
    setShowHelp(false);
    if (timedMode) setSecondsLeft(durationSec);
  };

  const choose = (optionIndex: number) => {
    if (!question) return;

    const correct = optionIndex === question.correctIndex;
    setAnswers(prev => ({
      ...prev,
      [question.id]: { selectedIndex: optionIndex, isCorrect: correct },
    }));

    if (correct) setScore(prev => prev + 1);
  };

  const next = () => {
    if (!passage) return;

    if (questionIndex + 1 >= passage.questions.length) {
      setGameState('finished');
      return;
    }

    setQuestionIndex(prev => prev + 1);
  };

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-sky-100 dark:bg-sky-900/30" aria-hidden="true">
                <span className="text-5xl">📖</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Reading Comprehension</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Read a short passage and answer questions to practice understanding, remembering details, and making inferences.
              </p>
              <p className="text-xs text-muted-foreground">Educational note: This is learning support and not medical advice.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4 text-sky-600" />
                    Choose difficulty
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('intermediate')}
                      className="h-auto flex-col items-start p-4"
                    >
                      <span className="font-bold">Intermediate</span>
                      <span className="text-xs text-muted-foreground">Short passages • clear details</span>
                    </Button>
                    <Button
                      variant={difficulty === 'advanced' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('advanced')}
                      className="h-auto flex-col items-start p-4"
                    >
                      <span className="font-bold">Advanced</span>
                      <span className="text-xs text-muted-foreground">Denser text • more inference</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Choose passage</div>
                    <Select value={passage?.id ?? ''} onValueChange={setPassageId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a passage" />
                      </SelectTrigger>
                      <SelectContent>
                        {available.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">
                      {passage?.summary ?? `This game includes ${available.length} passage${available.length === 1 ? '' : 's'} at this level.`}
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Timed mode</div>
                        <div className="text-xs text-muted-foreground">Optional countdown to build focus</div>
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
                            <SelectItem value="120">2 minutes</SelectItem>
                            <SelectItem value="180">3 minutes</SelectItem>
                            <SelectItem value="300">5 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-lg border p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium">Reading mode</div>
                        <div className="text-xs text-muted-foreground">Larger text + comfortable spacing</div>
                      </div>
                      <Switch
                        checked={readingModeEnabled}
                        onCheckedChange={setReadingModeEnabled}
                        aria-label="Toggle dyslexia-friendly reading mode"
                      />
                    </div>
                    {readingModeEnabled ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Font</div>
                          <Select
                            value={readingPrefs.fontFamily}
                            onValueChange={(v) => setReadingPrefs(prev => ({ ...prev, fontFamily: v }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {READING_FONTS.map(f => (
                                <SelectItem key={f.label} value={f.value}>
                                  {f.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Text size</div>
                          <Select
                            value={String(readingPrefs.fontSize)}
                            onValueChange={(v) => setReadingPrefs(prev => ({ ...prev, fontSize: Number(v) }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="16">16px (Default)</SelectItem>
                              <SelectItem value="18">18px</SelectItem>
                              <SelectItem value="20">20px</SelectItem>
                              <SelectItem value="22">22px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Line spacing</div>
                          <Select
                            value={String(readingPrefs.lineHeight)}
                            onValueChange={(v) => setReadingPrefs(prev => ({ ...prev, lineHeight: Number(v) }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1.6">1.6</SelectItem>
                              <SelectItem value="1.8">1.8</SelectItem>
                              <SelectItem value="2">2.0</SelectItem>
                              <SelectItem value="2.2">2.2</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Background</div>
                          <Select
                            value={readingPrefs.backgroundColor}
                            onValueChange={(v) => setReadingPrefs(prev => ({ ...prev, backgroundColor: v }))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {READING_BACKGROUNDS.map(bg => (
                                <SelectItem key={bg.label} value={bg.value}>
                                  {bg.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Goal
                  </div>
                  <p className="text-sm text-muted-foreground">Answer questions and read explanations to learn strategies.</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={start} className="flex-1">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Start
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

  if (!passage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-xl">
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">No passages available for this difficulty yet.</p>
            <Button onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === 'finished') {
    const pct = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30" aria-hidden="true">
                <span className="text-5xl">🏁</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">Nice reading!</h1>
              <p className="text-muted-foreground">
                You got <span className="font-semibold text-foreground">{score}</span> out of{' '}
                <span className="font-semibold text-foreground">{totalQuestions}</span> correct ({pct}%).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={start} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try again
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
                Choose level
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

  const state = question ? answers[question.id] : undefined;
  const hasAnswered = Boolean(state?.selectedIndex !== null && state?.selectedIndex !== undefined);

  const passageStyle = readingModeEnabled
    ? {
        fontSize: `${readingPrefs.fontSize}px`,
        lineHeight: readingPrefs.lineHeight,
        letterSpacing: `${readingPrefs.letterSpacing}px`,
        wordSpacing: `${readingPrefs.wordSpacing}px`,
        fontFamily: readingPrefs.fontFamily || undefined,
        color: readingPrefs.textColor,
        backgroundColor: readingPrefs.backgroundColor,
      }
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-100 dark:bg-sky-900/30" aria-hidden="true">
              <span className="text-3xl">📖</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Reading Comprehension</h1>
              <p className="text-sm text-muted-foreground">Read and answer — learn the why.</p>
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
                Time left: <span className="font-semibold text-foreground tabular-nums">{formatTime(secondsLeft)}</span>
              </div>
            ) : null}
            <Button variant="outline" size="sm" onClick={reset}>
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
              <p className="font-medium">Strategies</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Read the question first, then re-read the part of the passage that answers it.</li>
                <li>Look for key words (who, what, where, when, why) and underline them mentally.</li>
                <li>If stuck, eliminate answers that clearly do not match the passage.</li>
              </ul>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold text-foreground">{passage.title}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Question <span className="font-semibold text-foreground">{questionIndex + 1}</span>/{totalQuestions}
              </div>
            </div>

            <Progress value={progress} />

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="text-xs text-muted-foreground">Passage</div>
                  <div
                    className="rounded-lg border p-3"
                    style={passageStyle}
                    aria-label="Reading passage"
                  >
                    <p className="whitespace-pre-wrap">{passage.text}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <div className="rounded-xl border p-4 bg-white/60 dark:bg-white/5">
                  <div className="text-xs text-muted-foreground">Question</div>
                  <div className="text-base font-semibold">{question?.prompt}</div>
                </div>

                <div className="grid gap-2">
                  {question?.options.map((opt, i) => {
                    const selected = state?.selectedIndex === i;
                    const correct = question.correctIndex === i;

                    return (
                      <Button
                        key={opt}
                        variant={selected ? 'default' : 'outline'}
                        className={
                          'h-auto justify-start text-left whitespace-normal ' +
                          (hasAnswered && correct ? 'border-emerald-300 dark:border-emerald-800' : '') +
                          (hasAnswered && selected && !state?.isCorrect ? ' border-rose-300 dark:border-rose-800' : '')
                        }
                        onClick={() => choose(i)}
                        disabled={hasAnswered}
                        aria-pressed={selected ? 'true' : 'false'}
                        aria-label={`Answer option ${i + 1}: ${opt}`}
                      >
                        <span className="mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
                        <span className="flex-1">{opt}</span>
                        {hasAnswered && correct ? <CheckCircle2 className="w-4 h-4 ml-2" /> : null}
                        {hasAnswered && selected && !state?.isCorrect ? <XCircle className="w-4 h-4 ml-2" /> : null}
                      </Button>
                    );
                  })}
                </div>

                {hasAnswered && question ? (
                  <Card>
                    <CardContent className="p-4 text-sm">
                      <div className="font-medium mb-1">Explanation</div>
                      <p className="text-muted-foreground">{question.explanation}</p>
                    </CardContent>
                  </Card>
                ) : null}

                <Button onClick={next} disabled={!hasAnswered} className="w-full">
                  {questionIndex + 1 >= totalQuestions ? 'Finish' : 'Next'}
                </Button>

                <div className="text-xs text-muted-foreground" aria-live="polite">
                  Score: <span className="font-semibold text-foreground">{score}</span>/{totalQuestions}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
