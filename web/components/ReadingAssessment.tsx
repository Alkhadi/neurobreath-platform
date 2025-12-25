'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { BookOpen, CheckCircle2, Lightbulb } from 'lucide-react';

const ASSESSMENT_SECTIONS = [
  { title: 'Letter Recognition', questions: 3 },
  { title: 'Phonics Skills', questions: 4 },
  { title: 'Sight Words', questions: 4 },
  { title: 'Comprehension', questions: 4 },
];

export function ReadingAssessment() {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-violet-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Reading Level Assessment</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Discover Your Reading Level
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Take this quick assessment to find out your reading level and get personalized activity recommendations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ASSESSMENT_SECTIONS.map((section, idx) => (
            <div key={idx} className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{section.title}</h3>
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">{section.questions} questions</p>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg flex gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 shrink-0" />
          <p className="text-xs sm:text-sm">
            <strong>Tip:</strong> Take your time! There is no time limit. Answer each question to the best of your ability. You'll get helpful feedback after each answer.
          </p>
        </div>

        <Button 
          onClick={() => setStarted(true)} 
          className="w-full" 
          size="lg"
        >
          Start Assessment
        </Button>

        {started && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
