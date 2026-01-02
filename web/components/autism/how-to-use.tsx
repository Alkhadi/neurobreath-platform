'use client';

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Info } from 'lucide-react';

export const HowToUse = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
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
            <strong>1. Choose your audience and country</strong> at the top to personalize the content and resources shown.
          </p>
          <p>
            <strong>2. Browse the Skills Library</strong> to find evidence-based strategies for routines, communication, sensory needs, and more.
          </p>
          <p>
            <strong>3. Try the Calm Toolkit</strong> for breathing exercises and calming techniques you can use right now.
          </p>
          <p>
            <strong>4. Log your practice</strong> to track progress, build streaks, and earn badges that recognize your efforts.
          </p>
          <p>
            <strong>5. Check the References</strong> section for links to NICE guidelines, NHS resources, and peer-reviewed research.
          </p>
          <p className="text-muted-foreground">
            All progress is stored locally on your device only. No personal data is collected or sent anywhere.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
