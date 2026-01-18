'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Gamepad2, Star, Trophy, Target, Sparkles, CheckCircle } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';
import { RhymingPairs } from './games/RhymingPairs';
import { SyllableCounter } from './games/SyllableCounter';
import { SightWordFlashCards } from './games/SightWordFlashCards';
import { SpellingPatterns } from './games/SpellingPatterns';
import { ReadingFluencyRace } from './games/ReadingFluencyRace';
import { LetterTracing } from './games/LetterTracing';
import { SoundBlending } from './games/SoundBlending';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ContextCluesDetective } from './games/ContextCluesDetective';
import { PrefixSuffixMatch } from './games/PrefixSuffixMatch';
import { HomophoneChallenge } from './games/HomophoneChallenge';
import { SentenceScramble } from './games/SentenceScramble';
import { StorySequencing } from './games/StorySequencing';
import { PhonemeSegmentation } from './games/PhonemeSegmentation';
import { PhonicsSoundBoard } from './games/PhonicsSoundBoard';

type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type GameType = 'phonics' | 'word-recognition' | 'comprehension' | 'memory' | 'fluency' | 'vocabulary';

const games = [
  // New Interactive Games
  {
    id: 'phonics-sound-board',
    title: 'Phonics Sound Board',
    description: 'Learn letter sounds with interactive alphabet board',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🎵',
    color: 'purple',
    component: PhonicsSoundBoard,
    featured: true,
  },
  {
    id: 'rhyming-pairs',
    title: 'Rhyming Pairs',
    description: 'Match rhyming words with audio support',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🎶',
    color: 'purple',
    component: RhymingPairs,
  },
  {
    id: 'syllable-counter',
    title: 'Syllable Counter',
    description: 'Count syllables in words with visual/audio feedback',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '✋',
    color: 'orange',
    component: SyllableCounter,
  },
  {
    id: 'sight-word-flashcards',
    title: 'Sight Word Flash Cards',
    description: 'Timed flashcard practice with spaced repetition',
    type: 'word-recognition' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '⚡',
    color: 'emerald',
    component: SightWordFlashCards,
  },
  {
    id: 'spelling-patterns',
    title: 'Spelling Patterns',
    description: 'Practice common spelling patterns (igh, ough, etc.)',
    type: 'word-recognition' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '🔤',
    color: 'violet',
    component: SpellingPatterns,
  },
  {
    id: 'reading-fluency-race',
    title: 'Reading Fluency Race',
    description: 'Timed reading with WPM calculation',
    type: 'fluency' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '🏃',
    color: 'red',
    component: ReadingFluencyRace,
  },
  {
    id: 'letter-tracing',
    title: 'Letter Tracing',
    description: 'Interactive letter tracing with multisensory feedback',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '✏️',
    color: 'blue',
    component: LetterTracing,
  },
  {
    id: 'sound-blending',
    title: 'Sound Blending Builder',
    description: 'Blend individual sounds to make words',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🎭',
    color: 'cyan',
    component: SoundBlending,
  },
  {
    id: 'word-family-sorting',
    title: 'Word Family Sorting',
    description: 'Sort words by word families (-at, -an, -ig, etc.)',
    type: 'word-recognition' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🏠',
    color: 'pink',
    route: '/games/word-family-sorting', // Full-screen focus mode
  },
  {
    id: 'context-clues-detective',
    title: 'Context Clues Detective',
    description: 'Use context to figure out word meanings',
    type: 'vocabulary' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '🔍',
    color: 'indigo',
    component: ContextCluesDetective,
  },
  {
    id: 'prefix-suffix-match',
    title: 'Prefix/Suffix Match',
    description: 'Match prefixes/suffixes to root words',
    type: 'vocabulary' as GameType,
    difficulty: 'advanced' as Difficulty,
    icon: '🔬',
    color: 'teal',
    component: PrefixSuffixMatch,
  },
  {
    id: 'homophone-challenge',
    title: 'Homophone Challenge',
    description: 'Choose correct homophone in context',
    type: 'vocabulary' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '🎯',
    color: 'amber',
    component: HomophoneChallenge,
  },
  {
    id: 'sentence-scramble',
    title: 'Sentence Scramble',
    description: 'Unscramble sentences to build syntax skills',
    type: 'comprehension' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '🧩',
    color: 'green',
    component: SentenceScramble,
  },
  {
    id: 'story-sequencing',
    title: 'Story Sequencing',
    description: 'Put story events in correct order',
    type: 'comprehension' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '📚',
    color: 'indigo',
    component: StorySequencing,
  },
  {
    id: 'phoneme-segmentation',
    title: 'Phoneme Segmentation',
    description: 'Break words into individual sounds',
    type: 'phonics' as GameType,
    difficulty: 'advanced' as Difficulty,
    icon: '🎼',
    color: 'rose',
    component: PhonemeSegmentation,
  },
  // Legacy placeholders
  {
    id: 'phonics-match',
    title: 'Sound Matching Game',
    description: 'Match letters with their sounds. Practice phonological awareness.',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🎵',
    color: 'blue',
  },
  {
    id: 'word-builder',
    title: 'Word Builder',
    description: 'Build words by combining letter sounds. Strengthen decoding skills.',
    type: 'phonics' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '🔨',
    color: 'purple',
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Answer questions about passages to build understanding.',
    type: 'comprehension' as GameType,
    difficulty: 'intermediate' as Difficulty,
    icon: '📖',
    color: 'sky',
  },
  {
    id: 'memory-match',
    title: 'Word Memory Match',
    description: 'Classic memory game with words. Strengthen visual memory.',
    type: 'memory' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🧠',
    color: 'cyan',
  },
  {
    id: 'letter-sounds',
    title: 'Letter Sounds',
    description: 'Learn letter sounds and phonics basics.',
    type: 'phonics' as GameType,
    difficulty: 'beginner' as Difficulty,
    icon: '🔊',
    color: 'yellow',
  },
];

export function LearningGames() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<GameType | 'all'>('all');
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { incrementGameCompleted } = useProgress();
  const router = useRouter();

  const filteredGames = games.filter(game => {
    const difficultyMatch = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
    const typeMatch = selectedType === 'all' || game.type === selectedType;
    return difficultyMatch && typeMatch;
  });

  const handlePlayGame = (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    
    // If game has a route, navigate to it
    if ('route' in game && game.route) {
      router.push(game.route);
      return;
    }
    
    // If game has a component, open in dialog
    if ('component' in game && game.component) {
      setActiveGame(gameId);
    } else {
      // Legacy games without components
      incrementGameCompleted();
      alert('This game is coming soon!');
    }
  };

  const activeGameData = games.find(g => g.id === activeGame);
  const GameComponent = activeGameData?.component;

  return (
    <section id="games" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
              <Gamepad2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Learning Games & Activities</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Interactive, evidence-based games designed to build reading skills while having fun. 
                All games adapt to different skill levels and provide immediate feedback.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Filter by Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedDifficulty('all')}
                >
                  All Levels
                </Button>
                <Button
                  size="sm"
                  variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
                  onClick={() => setSelectedDifficulty('beginner')}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Beginner
                </Button>
                <Button
                  size="sm"
                  variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
                  onClick={() => setSelectedDifficulty('intermediate')}
                >
                  <Target className="w-3 h-3 mr-1" />
                  Intermediate
                </Button>
                <Button
                  size="sm"
                  variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
                  onClick={() => setSelectedDifficulty('advanced')}
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  Advanced
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Filter by Type</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                >
                  All Types
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === 'phonics' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('phonics')}
                >
                  Phonics
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === 'word-recognition' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('word-recognition')}
                >
                  Word Recognition
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === 'comprehension' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('comprehension')}
                >
                  Comprehension
                </Button>
                <Button
                  size="sm"
                  variant={selectedType === 'memory' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('memory')}
                >
                  Memory
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Games Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredGames.map((game) => (
          <Card key={game.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className={`text-4xl p-3 rounded-lg bg-${game.color}-50 dark:bg-${game.color}-950/30`}>
                  {game.icon}
                </div>
                <div className="flex items-center gap-1">
                  {game.difficulty === 'beginner' && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                  {game.difficulty === 'intermediate' && (
                    <>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </>
                  )}
                  {game.difficulty === 'advanced' && (
                    <>
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">{game.title}</h3>
                <p className="text-sm text-muted-foreground">{game.description}</p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={`px-2 py-1 rounded-full bg-${game.color}-100 dark:bg-${game.color}-900/30 text-${game.color}-700 dark:text-${game.color}-300`}>
                  {game.type}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  {game.difficulty}
                </span>
              </div>

              <Button
                onClick={() => handlePlayGame(game.id)}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Play Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGames.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No games match your selected filters. Try adjusting your selection.</p>
          </CardContent>
        </Card>
      )}

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Tips for Success
            </h3>
            <ul className="grid gap-2 md:grid-cols-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Practice for short sessions (10-15 minutes)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Celebrate small wins and progress</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Start with beginner games and progress gradually</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">Repeat games to build confidence and mastery</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Game Dialog */}
      <Dialog open={activeGame !== null} onOpenChange={(open) => !open && setActiveGame(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {GameComponent && <GameComponent />}
        </DialogContent>
      </Dialog>
    </section>
  );
}
