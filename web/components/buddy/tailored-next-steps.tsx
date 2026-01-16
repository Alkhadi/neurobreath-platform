/**
 * TailoredNextSteps Component
 * Displays recommended internal actions to keep users on the NeuroBreath site
 */

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  ChevronRight, 
  Target, 
  Play, 
  BookOpen, 
  Timer, 
  FileText,
  Heart,
  Brain,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RecommendedAction {
  id: string;
  type: 'navigate' | 'scroll' | 'start_exercise' | 'open_tool' | 'download';
  label: string;
  description?: string;
  icon?: 'target' | 'play' | 'book' | 'timer' | 'file' | 'heart' | 'brain' | 'sparkles';
  target?: string; // URL or element ID
  primary?: boolean;
}

export interface TailoredNextStepsProps {
  actions: RecommendedAction[];
  availableTools?: string[];
  className?: string;
}

const iconMap = {
  target: Target,
  play: Play,
  book: BookOpen,
  timer: Timer,
  file: FileText,
  heart: Heart,
  brain: Brain,
  sparkles: Sparkles,
};

export function TailoredNextSteps({
  actions,
  availableTools,
  className,
}: TailoredNextStepsProps) {
  const router = useRouter();

  const handleAction = (action: RecommendedAction) => {
    switch (action.type) {
      case 'navigate':
        if (action.target) {
          router.push(action.target);
        }
        break;
      
      case 'scroll':
        if (action.target) {
          const element = document.getElementById(action.target) || 
                          document.querySelector(`[data-section="${action.target}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        break;
      
      case 'start_exercise':
        // Trigger exercise start (implementation depends on page structure)
        if (action.target) {
          const button = document.querySelector(`[data-exercise="${action.target}"]`) as HTMLButtonElement;
          if (button) {
            button.click();
          } else {
            // Fallback to navigation
            router.push(`/breathing?exercise=${action.target}`);
          }
        }
        break;
      
      case 'open_tool':
        // Open tool or feature
        if (action.target) {
          const toolButton = document.querySelector(`[data-tool="${action.target}"]`) as HTMLButtonElement;
          if (toolButton) {
            toolButton.click();
          }
        }
        break;
      
      case 'download':
        // Trigger download
        if (action.target) {
          window.open(action.target, '_blank');
        }
        break;
    }
  };

  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className={cn('border-t border-border/50 pt-3 mt-3', className)}>
      <div className="text-xs font-semibold mb-2 text-foreground/80 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        Tailored Next Steps
      </div>
      
      {availableTools && availableTools.length > 0 && (
        <div className="text-[10px] text-muted-foreground mb-2 italic">
          On this page: {availableTools.join(', ')}
        </div>
      )}
      
      <div className="space-y-1.5">
        {actions.map((action) => {
          const Icon = action.icon ? iconMap[action.icon] : ChevronRight;
          return (
            <Button
              key={action.id}
              variant={action.primary ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'w-full justify-start h-auto py-2 px-3 text-left',
                action.primary && 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => handleAction(action)}
            >
              <Icon className="h-3.5 w-3.5 mr-2 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium">{action.label}</div>
                {action.description && (
                  <div className="text-[10px] opacity-80 mt-0.5">
                    {action.description}
                  </div>
                )}
              </div>
              <ChevronRight className="h-3 w-3 ml-2 flex-shrink-0 opacity-50" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
