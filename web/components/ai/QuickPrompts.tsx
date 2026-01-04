'use client'

import { Button } from '@/components/ui/button'

interface QuickPromptsProps {
  onSelect: (promptId: string, label: string) => void
}

const QUICK_PROMPTS = [
  { id: 'explain-simply', label: 'Explain simply' },
  { id: 'daily-routines', label: 'Daily routines & regulation' },
  { id: 'school-supports', label: 'School/classroom supports' },
  { id: 'workplace-adjustments', label: 'Workplace adjustments' },
  { id: 'assessment-pathway', label: 'Assessment pathway (UK)' },
  { id: 'common-misunderstandings', label: 'Common misunderstandings' },
  { id: 'when-to-seek-help', label: 'When to seek help' }
]

export default function QuickPrompts({ onSelect }: QuickPromptsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Quick actions</p>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map(prompt => (
          <Button
            key={prompt.id}
            variant="outline"
            size="sm"
            onClick={() => onSelect(prompt.id, prompt.label)}
            className="text-xs"
          >
            {prompt.label}
          </Button>
        ))}
      </div>
    </div>
  )
}




