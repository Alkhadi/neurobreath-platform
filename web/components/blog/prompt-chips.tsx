'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

interface PromptChipsProps {
  onSelect: (prompt: string) => void
}

const PROMPTS = [
  'Explain simply',
  'Daily routines & regulation',
  'School/classroom supports',
  'Workplace adjustments',
  'Assessment pathway (UK)',
  'Common misunderstandings',
  'When to seek help'
]

export default function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>Quick prompts:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {PROMPTS.map(prompt => (
          <Button
            key={prompt}
            variant="secondary"
            size="sm"
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  )
}






