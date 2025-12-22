'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wind, BookOpen, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type TrainingApproach = 'focused' | 'direct' | 'fluency';

interface BeginSessionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartSession: (approach: TrainingApproach) => void;
}

const TRAINING_APPROACHES = [
  {
    id: 'focused' as TrainingApproach,
    icon: Wind,
    title: 'Focused Start',
    badge: 'Recommended',
    description: 'Begin with breathing exercises to optimize concentration.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  {
    id: 'direct' as TrainingApproach,
    icon: BookOpen,
    title: 'Direct Training',
    description: 'Proceed directly to alphabet and phonics exercises.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    id: 'fluency' as TrainingApproach,
    icon: Zap,
    title: 'Fluency Practice',
    description: 'Focus on rapid naming for reading speed improvement.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
];

export default function BeginSessionModal({
  open,
  onOpenChange,
  onStartSession,
}: BeginSessionModalProps) {
  const [selectedApproach, setSelectedApproach] = useState<TrainingApproach>('focused');

  const handleStart = () => {
    onStartSession(selectedApproach);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold">Begin Session</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Select your preferred approach for this training session.
          </p>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-3">
          {TRAINING_APPROACHES.map((approach) => {
            const Icon = approach.icon;
            const isSelected = selectedApproach === approach.id;

            return (
              <button
                key={approach.id}
                onClick={() => setSelectedApproach(approach.id)}
                className={cn(
                  'w-full text-left transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg'
                )}
              >
                <Card
                  className={cn(
                    'relative p-4 border-2 cursor-pointer transition-all duration-200',
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-accent/50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        isSelected ? approach.bgColor : 'bg-muted'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-5 h-5',
                          isSelected ? approach.color : 'text-muted-foreground'
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-base">{approach.title}</h3>
                        {approach.badge && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {approach.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {approach.description}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    <div className="flex-shrink-0">
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
                          isSelected
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30'
                        )}
                      >
                        {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-muted/30">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            className="min-w-[100px] gap-2"
          >
            <Zap className="w-4 h-4" />
            Start
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
