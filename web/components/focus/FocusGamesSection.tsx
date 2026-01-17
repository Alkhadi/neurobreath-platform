import Link from 'next/link';
import { Gamepad2, Target, Eye, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { focusGames } from '@/lib/focus/data';
import { getRegionKey, type Region } from '@/lib/region/region';

const iconMap = {
  Target,
  Eye,
  Zap,
} as const;

interface FocusGamesSectionProps {
  region: Region;
}

export function FocusGamesSection({ region }: FocusGamesSectionProps) {
  const regionKey = getRegionKey(region);

  return (
    <Card className="p-6 mb-8">
      <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
        <Gamepad2 className="h-6 w-6 text-purple-600" />
        Try Focus Training Games
      </h2>
      <p className="text-muted-foreground mb-6">
        Practice your focus skills with gentle, interactive games. No pressure,
        just fun practice.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {focusGames.map((game) => {
          const Icon = iconMap[game.icon];
          return (
            <Link key={game.id} href={`/${regionKey}${game.href}`}>
              <Button variant="outline" className="w-full h-auto py-6">
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`h-8 w-8 ${game.iconColor}`} />
                  <span className="font-bold">
                    {game.emoji} {game.name}
                  </span>
                </div>
              </Button>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
