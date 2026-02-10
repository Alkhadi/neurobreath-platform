'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Printer } from 'lucide-react';
import { useProgress } from '@/contexts/ProgressContext';

export function ProgressReports() {
  const progress = useProgress();

  const generatePDF = () => {
    const reportContent = `
DYSLEXIA HUB - PROGRESS REPORT
==============================

Practice Summary:
- Total Sessions: ${progress.totalSessions}
- Total Minutes: ${progress.totalMinutes}
- Current Streak: ${progress.streakDays} days
- Games Completed: ${progress.gamesCompleted}
- Letters Mastered: ${progress.lettersCompleted.size}
- Badges Earned: ${progress.badgesEarned.size}

Generated: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
  };

  const print = () => {
    window.print();
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Progress Reports
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-3xl font-bold text-blue-600">{progress.totalSessions}</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Total Minutes</p>
            <p className="text-3xl font-bold text-emerald-600">{progress.totalMinutes}</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Streak Days</p>
            <p className="text-3xl font-bold text-purple-600">{progress.streakDays}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-lg font-semibold">Achievements</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Games Completed</p>
              <p className="text-xl font-bold">{progress.gamesCompleted}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Letters Mastered</p>
              <p className="text-xl font-bold">{progress.lettersCompleted.size}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Badges Earned</p>
              <p className="text-xl font-bold">{progress.badgesEarned.size}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <p className="text-sm text-muted-foreground">Minutes Today</p>
              <p className="text-xl font-bold">{progress.minutesToday}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={generatePDF} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
          <Button onClick={print} variant="outline" className="flex-1">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>📊 Share progress reports with teachers, therapists, or parents</p>
        </div>
      </CardContent>
    </Card>
  );
}
