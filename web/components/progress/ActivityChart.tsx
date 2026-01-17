/**
 * Activity Chart Component
 * 
 * Displays user activity trend over time
 */

'use client';

import { useActivityTrend } from '@/lib/analytics/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

export function ActivityChart({ days = 7 }: { days?: number }) {
  const trend = useActivityTrend(days);

  const maxCount = Math.max(...trend.map(d => d.count), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Activity Trend
        </CardTitle>
        <CardDescription>Your activity over the last {days} days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trend.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-GB', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
            const percentage = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
            const isToday = day.date === new Date().toISOString().split('T')[0];

            return (
              <div key={index} className="flex items-center gap-3">
                <div className="w-16 text-xs text-muted-foreground shrink-0">
                  <div className={isToday ? 'font-bold text-primary' : ''}>{dayName}</div>
                  <div className="text-[10px]">{dateStr}</div>
                </div>
                <div className="flex-1">
                  <div className="relative h-8 bg-muted rounded overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-primary/70 transition-all duration-300 flex items-center px-2"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    >
                      {day.count > 0 && (
                        <span className="text-xs font-semibold text-primary-foreground">
                          {day.count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {trend.every(d => d.count === 0) && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No activity recorded yet. Start exploring to see your progress here!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
