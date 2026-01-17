'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info } from 'lucide-react';

export const HowToUse = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-8">
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Info className="h-4 w-4" />
            How to use this page
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-4 p-6 bg-muted/50 rounded-lg">
          <div className="space-y-4 text-sm">
            <p>
              <strong>1. Track your mood</strong> daily to identify patterns and triggers that affect your wellbeing.
            </p>
            <p>
              <strong>2. Explore the Skills Library</strong> for evidence-based strategies to boost mood, manage stress, and prevent burnout.
            </p>
            <p>
              <strong>3. Use the Mood Toolkit</strong> for immediate relief techniques including breathing exercises and grounding activities.
            </p>
            <p>
              <strong>4. Complete daily challenges</strong> to build consistent self-care habits and earn progress rewards.
            </p>
            <p>
              <strong>5. Access resources</strong> for professional support, emergency contacts, and evidence-based information.
            </p>
            <p className="text-muted-foreground">
              All progress is stored locally on your device only. No personal data is collected or sent anywhere.
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

