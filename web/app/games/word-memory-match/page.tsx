'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Home,
  HelpCircle,
  RotateCcw,
  Trophy,
  Star,
  CheckCircle2,
} from 'lucide-react';

type Difficulty = 'beginner' | 'intermediate';

type Pair = {
  id: string;
  a: string;
  b: string;
};

type Tile = {
  tileId: string;
  pairId: string;
  text: string;
};

type GameState = 'setup' | 'playing' | 'finished';

const SYNONYM_PAIRS: Pair[] = [
  { id: 'big', a: 'big', b: 'large' },
  { id: 'small', a: 'small', b: 'tiny' },
  { id: 'fast', a: 'fast', b: 'quick' },
  { id: 'happy', a: 'happy', b: 'glad' },
  { id: 'sad', a: 'sad', b: 'unhappy' },
  { id: 'begin', a: 'begin', b: 'start' },
  { id: 'end', a: 'end', b: 'finish' },
  { id: 'look', a: 'look', b: 'see' },
  { id: 'talk', a: 'talk', b: 'speak' },
  { id: 'help', a: 'help', b: 'assist' },
  { id: 'smart', a: 'smart', b: 'clever' },
  { id: 'calm', a: 'calm', b: 'peaceful' },
  { id: 'angry', a: 'angry', b: 'mad' },
  { id: 'huge', a: 'huge', b: 'enormous' },
  { id: 'try', a: 'try', b: 'attempt' },
  { id: 'idea', a: 'idea', b: 'thought' },
  { id: 'scared', a: 'scared', b: 'afraid' },
  { id: 'quiet', a: 'quiet', b: 'silent' },
  { id: 'strong', a: 'strong', b: 'powerful' },
  { id: 'answer', a: 'answer', b: 'reply' },
];

const UK_US_SPELLING_PAIRS: Pair[] = [
  { id: 'colour', a: 'colour', b: 'color' },
  { id: 'favourite', a: 'favourite', b: 'favorite' },
  { id: 'centre', a: 'centre', b: 'center' },
  { id: 'theatre', a: 'theatre', b: 'theater' },
  { id: 'organise', a: 'organise', b: 'organize' },
  { id: 'realise', a: 'realise', b: 'realize' },
  { id: 'travelled', a: 'travelled', b: 'traveled' },
  { id: 'catalogue', a: 'catalogue', b: 'catalog' },
  { id: 'programme', a: 'programme', b: 'program' },
  { id: 'apologise', a: 'apologise', b: 'apologize' },
  { id: 'cheque', a: 'cheque', b: 'check' },
  { id: 'mum', a: 'mum', b: 'mom' },
];

type DeckId = 'synonyms' | 'uk-us';

const DECKS: Array<{ id: DeckId; name: string; description: string; pairs: Pair[] }> = [
  {
    id: 'synonyms',
    name: 'Synonyms',
    description: 'Match words that mean the same thing.',
    pairs: SYNONYM_PAIRS,
  },
  {
    id: 'uk-us',
    name: 'UK/US Spelling',
    description: 'Match spelling variants that mean the same word.',
    pairs: UK_US_SPELLING_PAIRS,
  },
];

function shuffle<T>(arr: T[]) {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildTiles(pairs: Pair[]): Tile[] {
  const tiles: Tile[] = [];
  for (const p of pairs) {
    tiles.push({ tileId: `${p.id}:a`, pairId: p.id, text: p.a });
    tiles.push({ tileId: `${p.id}:b`, pairId: p.id, text: p.b });
  }
  return shuffle(tiles);
}

export default function WordMemoryMatchPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [gameState, setGameState] = useState<GameState>('setup');
  const [deckId, setDeckId] = useState<DeckId>('synonyms');

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [firstPick, setFirstPick] = useState<string | null>(null);

  const [moves, setMoves] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const pairsToUse = useMemo(() => {
    const count = difficulty === 'beginner' ? 6 : 8;
    const deck = DECKS.find(d => d.id === deckId) ?? DECKS[0];
    return shuffle(deck.pairs).slice(0, Math.min(count, deck.pairs.length));
  }, [deckId, difficulty]);

  const start = () => {
    const t = buildTiles(pairsToUse);
    setTiles(t);
    setRevealed(new Set());
    setMatched(new Set());
    setFirstPick(null);
    setMoves(0);
    setShowHelp(false);
    setGameState('playing');
  };

  const reset = () => {
    setGameState('setup');
    setTiles([]);
    setRevealed(new Set());
    setMatched(new Set());
    setFirstPick(null);
    setMoves(0);
    setShowHelp(false);
  };

  const isFinished = matched.size > 0 && matched.size === pairsToUse.length;

  useEffect(() => {
    if (gameState !== 'playing') return;
    if (!isFinished) return;
    setGameState('finished');
  }, [gameState, isFinished]);

  const onPick = (tileId: string) => {
    if (gameState !== 'playing') return;

    const tile = tiles.find(t => t.tileId === tileId);
    if (!tile) return;

    if (matched.has(tile.pairId)) return;

    // Prevent re-clicking the same revealed card.
    if (revealed.has(tileId)) return;

    setRevealed(prev => new Set(prev).add(tileId));

    if (!firstPick) {
      setFirstPick(tileId);
      return;
    }

    setMoves(prev => prev + 1);

    const firstTile = tiles.find(t => t.tileId === firstPick);
    if (!firstTile) {
      setFirstPick(null);
      return;
    }

    const isMatch = firstTile.pairId === tile.pairId;

    if (isMatch) {
      setMatched(prev => new Set(prev).add(tile.pairId));
      setFirstPick(null);
      return;
    }

    // Not a match: hide both after a short delay.
    const firstToHide = firstPick;
    const secondToHide = tileId;
    setFirstPick(null);

    window.setTimeout(() => {
      setRevealed(prev => {
        const next = new Set(prev);
        next.delete(firstToHide);
        next.delete(secondToHide);
        return next;
      });
    }, 650);
  };

  if (gameState === 'setup') {
    const selectedDeck = DECKS.find(d => d.id === deckId) ?? DECKS[0];

    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-3xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30" aria-hidden="true">
                <span className="text-5xl">🧠</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Word Memory Match</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Flip cards to match word pairs. Builds visual memory and vocabulary.
              </p>
              <p className="text-xs text-muted-foreground">Educational note: This is learning support and not medical advice.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Choose difficulty
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={difficulty === 'beginner' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('beginner')}
                      className="h-auto flex-col items-start p-4"
                    >
                      <span className="font-bold">Beginner</span>
                      <span className="text-xs text-muted-foreground">6 pairs • smaller grid</span>
                    </Button>
                    <Button
                      variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                      onClick={() => setDifficulty('intermediate')}
                      className="h-auto flex-col items-start p-4"
                    >
                      <span className="font-bold">Intermediate</span>
                      <span className="text-xs text-muted-foreground">8 pairs • more to remember</span>
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-semibold">Word bank</div>
                    <Select value={deckId} onValueChange={(v) => setDeckId(v as DeckId)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a word bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {DECKS.map(d => (
                          <SelectItem key={d.id} value={d.id}>
                            {d.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-xs text-muted-foreground">{selectedDeck.description}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-2">
                  <div className="font-semibold flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    Goal
                  </div>
                  <p className="text-sm text-muted-foreground">Match all pairs in as few moves as possible.</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={start} className="flex-1">
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
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6 md:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="inline-flex p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30" aria-hidden="true">
                <span className="text-5xl">🏁</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">You matched them all!</h1>
              <p className="text-muted-foreground">
                Moves: <span className="font-semibold text-foreground">{moves}</span> • Pairs:{' '}
                <span className="font-semibold text-foreground">{pairsToUse.length}</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={start} className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play again
              </Button>
              <Button onClick={reset} variant="outline" className="flex-1">
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

  const columns = difficulty === 'beginner' ? 3 : 4;
  const gridColsClass = columns === 3 ? 'grid-cols-3' : 'grid-cols-4';

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30" aria-hidden="true">
              <span className="text-3xl">🧠</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Word Memory Match</h1>
              <p className="text-sm text-muted-foreground">Match synonyms to strengthen memory.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHelp(v => !v)} aria-expanded={showHelp}>
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
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
              <p className="font-medium">How to play</p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Flip two cards. If they are a matching pair, they stay matched.</li>
                <li>If they do not match, remember them — they will flip back.</li>
                <li>Go slow and read each word aloud if it helps.</li>
              </ul>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="text-muted-foreground">
                Matched: <span className="font-semibold text-foreground">{matched.size}</span>/{pairsToUse.length}
              </div>
              <div className="text-muted-foreground">
                Moves: <span className="font-semibold text-foreground">{moves}</span>
              </div>
            </div>

            <div className={`grid gap-3 ${gridColsClass}`} role="list" aria-label="Memory match cards">
              {tiles.map(tile => {
                const isRevealed = revealed.has(tile.tileId);
                const isMatched = matched.has(tile.pairId);

                const label = isMatched
                  ? `Matched card: ${tile.text}`
                  : isRevealed
                    ? `Revealed card: ${tile.text}`
                    : 'Hidden card';

                return (
                  <div key={tile.tileId} role="listitem">
                    <button
                      type="button"
                      onClick={() => onPick(tile.tileId)}
                      className={
                        'h-20 w-full rounded-xl border px-3 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400 ' +
                        (isMatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900'
                          : isRevealed
                            ? 'bg-white dark:bg-white/5'
                            : 'bg-cyan-50/70 dark:bg-cyan-950/20 hover:bg-cyan-50')
                      }
                      aria-label={label}
                      disabled={isMatched}
                    >
                      <div className="text-xs text-muted-foreground">{isMatched ? 'Matched' : isRevealed ? 'Word' : 'Flip'}</div>
                      <div className="mt-1 text-base font-semibold">
                        {isRevealed || isMatched ? tile.text : '•••'}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="text-xs text-muted-foreground" aria-live="polite">
              Tip: try reading each revealed word aloud to strengthen memory.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
