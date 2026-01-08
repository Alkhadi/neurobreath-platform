"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, CheckCircle2 } from 'lucide-react';

interface Protocol {
  id: '2min' | '5min' | '10min';
  title: string;
  duration: string;
  steps: string[];
  color: string;
}

const protocols: Protocol[] = [
  {
    id: '2min',
    title: '2-Minute Reset',
    duration: '2',
    steps: [
      'Find a quiet spot or close your eyes',
      'Take 3 deep breaths (4 seconds in, 6 seconds out)',
      'Set a clear single task intention',
      'Begin immediately after timer ends'
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: '5min',
    title: '5-Minute Focus Block',
    duration: '5',
    steps: [
      'Clear your workspace—one task only',
      'Close unnecessary tabs and notifications',
      'Work on one thing with full attention',
      '1-minute movement break after completion'
    ],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: '10min',
    title: '10-Minute Sprint',
    duration: '10',
    steps: [
      'Write down what "done" looks like',
      'Timer visible on screen',
      'Single-task focus—no switching',
      '2-minute active break (walk/stretch)'
    ],
    color: 'from-purple-500 to-violet-600'
  }
];

interface QuickProtocolsProps {
  onStartProtocol: (protocol: Protocol) => void;
}

export function QuickProtocols({ onStartProtocol }: QuickProtocolsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {protocols.map((protocol) => (
        <Card key={protocol.id} className="hover:shadow-lg transition-all border-2 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Clock className="w-6 h-6 text-muted-foreground flex-shrink-0" />
              <Badge variant="outline" className="flex-shrink-0">{protocol.duration} min</Badge>
            </div>
            <CardTitle className="text-lg sm:text-xl min-w-0">{protocol.title}</CardTitle>
            <CardDescription className="text-sm">
              {protocol.id === '2min' && 'Quick breathing reset before tasks'}
              {protocol.id === '5min' && 'Short focused work session'}
              {protocol.id === '10min' && 'Extended concentration sprint'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
            <div className="space-y-2 flex-1">
              {protocol.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="min-w-0 break-words">{step}</span>
                </div>
              ))}
            </div>
            <Button 
              className={`w-full bg-gradient-to-r ${protocol.color} text-white hover:opacity-90 min-h-[44px]`}
              size="lg"
              onClick={() => onStartProtocol(protocol)}
            >
              <Play className="w-4 h-4 mr-2" />
              Start {protocol.title}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
