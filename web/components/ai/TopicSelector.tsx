'use client'

import { Badge } from '@/components/ui/badge'
import type { Topic } from '@/types/user-context'

interface TopicSelectorProps {
  topic: Topic
  onSelect: (topic: Topic) => void
}

const TOPICS: { value: Topic; label: string }[] = [
  { value: 'autism', label: 'Autism' },
  { value: 'adhd', label: 'ADHD' },
  { value: 'dyslexia', label: 'Dyslexia' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'mood', label: 'Depression/Mood' },
  { value: 'stress', label: 'Stress' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'other', label: 'Other/General' }
]

export default function TopicSelector({ topic, onSelect }: TopicSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Topic / Condition</label>
      <div className="flex flex-wrap gap-2">
        {TOPICS.map(t => (
          <Badge
            key={t.value}
            variant={topic === t.value ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onSelect(t.value)}
          >
            {t.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}



