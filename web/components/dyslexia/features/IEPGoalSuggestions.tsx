'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Target, Copy, CheckCircle } from 'lucide-react';

const iepGoals = {
  'Reading Fluency': [
    {
      grade: 'K-2',
      goal: 'By [date], [student] will read grade-level text with 90% accuracy at 60 words per minute with appropriate phrasing and expression in 4 out of 5 trials.'
    },
    {
      grade: '3-5',
      goal: 'By [date], [student] will read grade-level text with 95% accuracy at 100 words per minute with appropriate phrasing and expression in 4 out of 5 trials.'
    },
    {
      grade: '6-8',
      goal: 'By [date], [student] will read grade-level text with 98% accuracy at 130 words per minute with appropriate phrasing and expression in 4 out of 5 trials.'
    },
  ],
  'Reading Comprehension': [
    {
      grade: 'K-2',
      goal: 'By [date], [student] will answer who, what, where, when, and why questions about a text with 80% accuracy in 4 out of 5 trials.'
    },
    {
      grade: '3-5',
      goal: 'By [date], [student] will identify the main idea and supporting details in grade-level text with 85% accuracy in 4 out of 5 trials.'
    },
    {
      grade: '6-8',
      goal: 'By [date], [student] will analyze and make inferences from grade-level text with 80% accuracy in 4 out of 5 trials.'
    },
  ],
  'Phonological Awareness': [
    {
      grade: 'K-2',
      goal: 'By [date], [student] will segment and blend phonemes in CVC words with 90% accuracy in 4 out of 5 trials.'
    },
    {
      grade: '3-5',
      goal: 'By [date], [student] will decode multisyllabic words using phonics patterns with 85% accuracy in 4 out of 5 trials.'
    },
  ],
  'Written Expression': [
    {
      grade: 'K-2',
      goal: 'By [date], [student] will write a simple sentence with correct capitalization and punctuation with 80% accuracy in 4 out of 5 trials.'
    },
    {
      grade: '3-5',
      goal: 'By [date], [student] will write a paragraph with a topic sentence, supporting details, and concluding sentence with 75% accuracy in 4 out of 5 trials.'
    },
    {
      grade: '6-8',
      goal: 'By [date], [student] will write a 5-paragraph essay with clear organization and supporting evidence with 80% accuracy in 4 out of 5 trials.'
    },
  ],
  'Spelling': [
    {
      grade: 'K-2',
      goal: 'By [date], [student] will spell CVC words and common sight words with 80% accuracy in 4 out of 5 trials.'
    },
    {
      grade: '3-5',
      goal: 'By [date], [student] will spell grade-level words using phonics patterns and spelling rules with 75% accuracy in 4 out of 5 trials.'
    },
  ],
};

export function IEPGoalSuggestions() {
  const [selectedCategory, setSelectedCategory] = useState('Reading Fluency');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Target className="w-5 h-5" />
            IEP Goal Suggestions
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(iepGoals).map((category) => (
            <Button
              key={category}
              size="sm"
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {iepGoals[selectedCategory as keyof typeof iepGoals].map((goal, index) => (
            <div key={`${selectedCategory}-${index}`} className="p-4 border-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-blue-600 mb-2">{goal.grade}</div>
                  <p className="text-sm">{goal.goal}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(goal.goal, `${selectedCategory}-${index}`)}
                >
                  {copied === `${selectedCategory}-${index}` ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> These are templates. Customize with student name, specific dates, and adjust targets based on individual needs and current performance levels.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>🎯 SMART goals: Specific, Measurable, Achievable, Relevant, Time-bound</p>
        </div>
      </CardContent>
    </Card>
  );
}
