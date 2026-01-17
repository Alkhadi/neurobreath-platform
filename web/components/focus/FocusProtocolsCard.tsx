import Link from 'next/link';
import { Timer, Clock, Brain, Target, Play } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { focusProtocols } from '@/lib/focus/data';
import { getRegionKey, type Region } from '@/lib/region/region';

interface FocusProtocolsCardProps {
  region: Region;
}

export function FocusProtocolsCard({ region }: FocusProtocolsCardProps) {
  const regionKey = getRegionKey(region);

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Timer className="h-6 w-6" />
        Focus protocols
      </h2>
      <ul className="space-y-3 mb-6">
        {focusProtocols.map((protocol) => (
          <li key={protocol.id} className="flex items-start gap-3">
            <div className={`${protocol.colorClass} p-1.5 rounded-full mt-0.5`}>
              <Clock className={`h-4 w-4 ${protocol.iconColorClass}`} />
            </div>
            <div>
              <strong>{protocol.name}:</strong> {protocol.description}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link href={`/${regionKey}/techniques/coherent?minutes=5`}>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Start 5-minute
          </Button>
        </Link>
        <Link href={`/${regionKey}/tools/adhd-tools`}>
          <Button variant="outline">
            <Brain className="mr-2 h-4 w-4" />
            ADHD Tools
          </Button>
        </Link>
        <Link href={`/${regionKey}/tools/anxiety-tools`}>
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" />
            Anxiety Tools
          </Button>
        </Link>
      </div>
    </Card>
  );
}
