import { Brain } from 'lucide-react';

export function FocusHero() {
  return (
    <div className="text-center mb-8">
      <div className="inline-block p-3 bg-primary/10 rounded-full mb-4">
        <Brain className="h-10 w-10 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Focus — Sprints with Recovery
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Make focus kinder: short sprints, clear goals, and recovery breaks. Works
        well alongside ADHD routines and reasonable adjustments at work.
      </p>
    </div>
  );
}
