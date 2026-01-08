'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Timer, Plus } from 'lucide-react';
import { useState } from 'react';

interface ADHDFocusPlannerProps {
  onProgressUpdate?: () => void;
}

export function ADHDFocusPlanner({ onProgressUpdate }: ADHDFocusPlannerProps) {
  const [ifThen, setIfThen] = useState({ if: '', then: '' });

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Focus Sprint Planner 🎯</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Pair a timed sprint with a concrete If-Then cue so starting feels automatic
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-2 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              Focus Sprint
            </CardTitle>
            <CardDescription>Choose your sprint length and start the timer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button className="h-16">10 min</Button>
              <Button className="h-16">25 min</Button>
              <Button className="h-16">50 min</Button>
            </div>
            <Button size="lg" className="w-full">Start Sprint</Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle>If-Then Plan Builder</CardTitle>
            <CardDescription>Capture the trigger and follow-through</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">If...</label>
                <Input placeholder="e.g., 9:00 starts" value={ifThen.if} onChange={e => setIfThen({...ifThen, if: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-medium">Then...</label>
                <Input placeholder="e.g., open task board" value={ifThen.then} onChange={e => setIfThen({...ifThen, then: e.target.value})} />
              </div>
            </div>
            <Button size="lg" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Add Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
