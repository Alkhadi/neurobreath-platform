'use client';

import { useState, useEffect } from 'react';
import { Trophy, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { loadFocusProgress, incrementPracticeCount } from '@/lib/focus/progress-store';

export function FocusProgressTracker() {
  const [practiceCount, setPracticeCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const progress = loadFocusProgress();
    setPracticeCount(progress.practiceCount);
  }, []);

  const handleMarkPractice = () => {
    const updated = incrementPracticeCount();
    setPracticeCount(updated.practiceCount);
  };

  if (!mounted) {
    return (
      <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <div className="h-24 animate-pulse bg-muted/20 rounded" />
      </Card>
    );
  }

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
      <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-amber-600" />
        Track your best focus run
      </h2>
      <p className="text-muted-foreground mb-4">
        Tap after a focus block to record progress.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          onClick={handleMarkPractice}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark 1 min practised
        </Button>
        <Badge variant="secondary" className="text-base px-4 py-2">
          Completed: {practiceCount}
        </Badge>
      </div>
    </Card>
  );
}
