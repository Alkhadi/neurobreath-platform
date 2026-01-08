"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target, Crosshair, Zap, Clock } from 'lucide-react';
import Link from 'next/link';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string | null;
  comingSoon: boolean;
  color: string;
  details: string;
}

const games: Game[] = [
  {
    id: 'focus-quest',
    title: 'Focus Quest',
    description: 'Adventure-style attention training with progressive difficulty levels',
    icon: <Target className="w-8 h-8" />,
    route: null,
    comingSoon: true,
    color: 'from-blue-500 to-indigo-600',
    details: 'Navigate through increasingly challenging focus challenges. Track distractions and build sustained attention skills through gamified exercises.'
  },
  {
    id: 'spot-target',
    title: 'Spot the Target',
    description: 'Visual discrimination training to improve selective attention',
    icon: <Crosshair className="w-8 h-8" />,
    route: null,
    comingSoon: true,
    color: 'from-green-500 to-emerald-600',
    details: 'Rapidly identify target shapes amongst distractors. Builds visual scanning skills and reduces impulsive responses through timed challenges.'
  },
  {
    id: 'reaction-challenge',
    title: 'Reaction Challenge',
    description: 'Response inhibition training for impulse control',
    icon: <Zap className="w-8 h-8" />,
    route: null,
    comingSoon: true,
    color: 'from-purple-500 to-violet-600',
    details: 'Press when you see the target, hold back on distractors. Evidence-based Go/No-Go task adapted for engaging practice.'
  }
];

export function FocusGames() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGameClick = (game: Game) => {
    if (game.comingSoon) {
      setSelectedGame(game);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {games.map((game) => (
          <Card 
            key={game.id} 
            className="hover:shadow-lg transition-all border-2 cursor-pointer group flex flex-col"
            onClick={() => handleGameClick(game)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${game.color} text-white`}>
                  {game.icon}
                </div>
                {game.comingSoon && (
                  <Badge variant="outline" className="flex-shrink-0">Coming Soon</Badge>
                )}
              </div>
              <CardTitle className="text-lg sm:text-xl group-hover:text-blue-600 transition-colors min-w-0">
                {game.title}
              </CardTitle>
              <CardDescription className="text-sm min-w-0">
                {game.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <Button 
                className={`w-full ${game.comingSoon ? '' : `bg-gradient-to-r ${game.color} text-white hover:opacity-90`} min-h-[44px]`}
                variant={game.comingSoon ? "outline" : "default"}
                disabled={game.comingSoon}
              >
                {game.comingSoon ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Coming Soon
                  </>
                ) : (
                  'Play Game'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon Modal */}
      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedGame?.color} text-white flex items-center justify-center mb-4`}>
              {selectedGame?.icon}
            </div>
            <DialogTitle className="text-2xl">{selectedGame?.title}</DialogTitle>
            <DialogDescription className="text-base pt-2">
              {selectedGame?.details}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium mb-1">🚧 In Development</p>
              <p className="text-sm text-muted-foreground">
                This focus training game is currently being developed. We're building evidence-based games that make attention training engaging and effective.
              </p>
            </div>
            <Button 
              onClick={() => setSelectedGame(null)} 
              className="w-full"
              size="lg"
            >
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
