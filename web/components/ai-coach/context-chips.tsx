'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import type { UserContext } from '@/types/user-context'

interface ContextChipsProps {
  context: UserContext
  onUpdate: (updates: Partial<UserContext>) => void
  onReset: () => void
  summary: string
}

const AGE_GROUPS = [
  { value: 'children', label: 'Children' },
  { value: 'adolescence', label: 'Teens' },
  { value: 'youth', label: 'Young Adults' },
  { value: 'adult', label: 'Adults' },
  { value: 'parent-caregiver', label: 'Parent/Caregiver' },
  { value: 'teacher', label: 'Teacher' }
] as const

const SETTINGS = [
  { value: 'home', label: 'Home' },
  { value: 'school', label: 'School' },
  { value: 'workplace', label: 'Workplace' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'community', label: 'Community' }
] as const

const CHALLENGES = [
  { value: 'routines', label: 'Routines' },
  { value: 'meltdowns', label: 'Meltdowns' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'focus', label: 'Focus' },
  { value: 'communication', label: 'Communication' },
  { value: 'behaviour', label: 'Behaviour' },
  { value: 'learning', label: 'Learning' },
  { value: 'sensory', label: 'Sensory' }
] as const

const GOALS = [
  { value: 'reduce-stress', label: 'Reduce stress' },
  { value: 'improve-routines', label: 'Improve routines' },
  { value: 'improve-sleep', label: 'Improve sleep' },
  { value: 'improve-focus', label: 'Improve focus' },
  { value: 'support-learning', label: 'Support learning' },
  { value: 'de-escalation', label: 'De-escalation' },
  { value: 'better-communication', label: 'Better communication' }
] as const

const COUNTRIES = [
  { value: 'UK', label: 'UK' },
  { value: 'US', label: 'US' },
  { value: 'other', label: 'Other' }
] as const

export default function ContextChips({ context, onUpdate, onReset, summary }: ContextChipsProps) {
  return (
    <Card className="bg-muted/30">
      <CardContent className="pt-4 pb-4 space-y-4">
        {/* Summary */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground">Context:</span>
            <Badge variant="outline" className="text-xs">
              {summary}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-xs h-7"
            aria-label="Reset context"
          >
            <X className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>

        {/* Age Group */}
        <div>
          <label className="text-xs font-medium mb-2 block">Age Group</label>
          <div className="flex flex-wrap gap-2">
            {AGE_GROUPS.map(({ value, label }) => (
              <Button
                key={value}
                variant={context.ageGroup === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ ageGroup: value as any })}
                className="text-xs h-8"
                aria-pressed={context.ageGroup === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Setting */}
        <div>
          <label className="text-xs font-medium mb-2 block">Setting</label>
          <div className="flex flex-wrap gap-2">
            {SETTINGS.map(({ value, label }) => (
              <Button
                key={value}
                variant={context.setting === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ setting: value as any })}
                className="text-xs h-8"
                aria-pressed={context.setting === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Challenge */}
        <div>
          <label className="text-xs font-medium mb-2 block">Main Challenge</label>
          <div className="flex flex-wrap gap-2">
            {CHALLENGES.map(({ value, label }) => (
              <Button
                key={value}
                variant={context.mainChallenge === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ mainChallenge: value as any })}
                className="text-xs h-8"
                aria-pressed={context.mainChallenge === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Goal */}
        <div>
          <label className="text-xs font-medium mb-2 block">Goal</label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(({ value, label }) => (
              <Button
                key={value}
                variant={context.goal === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ goal: value as any })}
                className="text-xs h-8"
                aria-pressed={context.goal === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="text-xs font-medium mb-2 block">Country</label>
          <div className="flex flex-wrap gap-2">
            {COUNTRIES.map(({ value, label }) => (
              <Button
                key={value}
                variant={context.country === value ? 'default' : 'outline'}
                size="sm"
                onClick={() => onUpdate({ country: value as any })}
                className="text-xs h-8"
                aria-pressed={context.country === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground italic mt-2">
          💡 Your selections help tailor advice to your specific situation. Changes save automatically.
        </p>
      </CardContent>
    </Card>
  )
}







