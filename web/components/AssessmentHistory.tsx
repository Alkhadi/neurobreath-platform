'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';
import { getDeviceId } from '@/lib/device-id';

interface ReadingAttempt {
  id: string;
  assessmentType: string;
  totalWords: number;
  wordsCorrect: number;
  accuracyPct: number;
  wcpm: number;
  readingLevelBand: string;
  readingLevelPercentile: number;
  durationSeconds: number;
  createdAt: string;
}

export function AssessmentHistory() {
  const [attempts, setAttempts] = useState<ReadingAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        setIsLoading(true);
        const deviceId = getDeviceId();
        const response = await fetch(
          `/api/assessment/save-attempt?deviceId=${encodeURIComponent(deviceId)}`,
          {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' }
          }
        );

        const data = await response.json();
        
        // Check if DB is unavailable (now returns 200 with flag)
        if (data?.dbUnavailable) {
          setAttempts([]);
          setError(null);
          return;
        }
        
        setAttempts(data.attempts || []);
        setError(null);
      } catch (err) {
        // Silently handle errors in development
        if (process.env.NODE_ENV === 'development') {
          console.debug('[AssessmentHistory] Assessment data unavailable (this is normal without a database)');
        }
        setError(null); // Don't show error to user
        setAttempts([]); // Show empty state
      } finally {
        setIsLoading(false);
      }
    };

    loadAttempts();
  }, []);

  const getReadingLevelColor = (band: string) => {
    switch (band) {
      case 'beginner':
        return 'text-orange-500';
      case 'elementary':
        return 'text-yellow-500';
      case 'intermediate':
        return 'text-blue-500';
      case 'advanced':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold">Assessment History</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading assessment history...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-bold">Assessment History</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-red-500">
            Error loading history: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (attempts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-violet-600" />
            <h2 className="text-lg font-bold">Assessment History</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">No assessments yet</p>
            <p className="text-sm">
              Complete your first reading assessment to see results here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-violet-600" />
          <div>
            <h2 className="text-lg sm:text-xl font-bold">Assessment History</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Your past reading assessments
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="space-y-3">
          {attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      {formatDate(attempt.createdAt)}
                    </p>
                  </div>
                  <div className="capitalize text-sm font-semibold text-muted-foreground">
                    {attempt.assessmentType === 'quickAssessment'
                      ? 'Quick Assessment'
                      : attempt.assessmentType}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getReadingLevelColor(attempt.readingLevelBand)}`}>
                    {attempt.readingLevelBand}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {attempt.readingLevelPercentile}th percentile
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded p-2">
                  <p className="text-xs text-muted-foreground font-semibold">Score</p>
                  <p className="text-lg font-bold">
                    {attempt.wordsCorrect}/{attempt.totalWords}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded p-2">
                  <p className="text-xs text-muted-foreground font-semibold">Accuracy</p>
                  <p className="text-lg font-bold text-green-600">
                    {attempt.accuracyPct}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded p-2">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground font-semibold">Speed</p>
                      <p className="text-lg font-bold">{attempt.wcpm}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accuracy Bar */}
              <div>
                <Progress value={attempt.accuracyPct} className="h-2" />
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {attempts.length > 1 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900/30">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-blue-600 shrink-0 mt-1" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Your Progress
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You've completed {attempts.length} assessment
                  {attempts.length !== 1 ? 's' : ''}. Keep practicing to improve your
                  reading skills!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
