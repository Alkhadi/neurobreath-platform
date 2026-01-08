'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ADHDProgressDashboardProps {
  onReset?: () => void;
}

export function ADHDProgressDashboard({ onReset }: ADHDProgressDashboardProps) {
  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-600" />
            <CardTitle>Progress Dashboard</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Track your ADHD management progress here</p>
        </CardContent>
      </Card>
    </div>
  );
}
