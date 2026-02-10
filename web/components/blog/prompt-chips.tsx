'use client'

import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'
import { BLOG_QUICK_PROMPTS } from '@/lib/assistant/intents'

interface PromptChipsProps {
  onSelect: (prompt: { id: string; label: string }) => void
}

export default function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        <span>Quick prompts:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {BLOG_QUICK_PROMPTS.map((prompt) => (
          <Button
            key={prompt.id}
            variant="secondary"
            size="sm"
            onClick={() => onSelect({ id: prompt.id, label: prompt.label })}
          >
            {prompt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}







