/**
 * Next Action Card
 * 
 * Suggests the next best action for the user based on their progress.
 */

'use client';

import { useNextSuggestedAction } from '@/lib/recommendations/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function NextActionCard() {
  const nextAction = useNextSuggestedAction();

  if (!nextAction) {
    return null;
  }

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          Suggested Next Step
        </CardTitle>
        <CardDescription>{nextAction.reason}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-semibold mb-2">{nextAction.title}</h4>
            <div className="flex flex-wrap gap-1">
              {nextAction.tags.slice(0, 4).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link href={nextAction.href}>
              Start
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
