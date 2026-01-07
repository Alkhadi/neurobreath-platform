'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { UserContext, AgeGroup, Setting, MainChallenge, Goal, Country, Topic } from '@/types/user-context'

interface ContextSelectorProps {
  context: UserContext
  onUpdate: (updates: Partial<UserContext>) => void
  onReset: () => void
}

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'children', label: 'Children (5-11)' },
  { value: 'adolescence', label: 'Teens (12-18)' },
  { value: 'youth', label: 'Young adults (18-25)' },
  { value: 'adult', label: 'Adults (25+)' },
  { value: 'parent-caregiver', label: 'Parent/Caregiver' },
  { value: 'teacher', label: 'Teacher/Educator' }
]

const SETTINGS: { value: Setting; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'school', label: 'School' },
  { value: 'workplace', label: 'Workplace' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'community', label: 'Community' }
]

const CHALLENGES: { value: MainChallenge; label: string }[] = [
  { value: 'routines', label: 'Routines' },
  { value: 'meltdowns', label: 'Meltdowns' },
  { value: 'anxiety', label: 'Anxiety' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'focus', label: 'Focus' },
  { value: 'communication', label: 'Communication' },
  { value: 'behaviour', label: 'Behaviour' },
  { value: 'learning', label: 'Learning' },
  { value: 'sensory', label: 'Sensory' }
]

const GOALS: { value: Goal; label: string }[] = [
  { value: 'reduce-stress', label: 'Reduce stress' },
  { value: 'improve-routines', label: 'Improve routines' },
  { value: 'improve-sleep', label: 'Improve sleep' },
  { value: 'improve-focus', label: 'Improve focus' },
  { value: 'support-learning', label: 'Support learning' },
  { value: 'de-escalation', label: 'De-escalation' },
  { value: 'better-communication', label: 'Better communication' },
  { value: 'today', label: 'Help today' },
  { value: 'this-week', label: 'This week' },
  { value: 'long-term', label: 'Long-term' }
]

const COUNTRIES: { value: Country; label: string }[] = [
  { value: 'UK', label: 'UK' },
  { value: 'US', label: 'US' },
  { value: 'other', label: 'Other' }
]

export default function ContextSelector({ context, onUpdate, onReset }: ContextSelectorProps) {
  const hasContext = !!(
    context.ageGroup ||
    context.setting ||
    context.mainChallenge ||
    context.goal ||
    (context.country && context.country !== 'UK')
  )

  return (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Your situation (optional)</h4>
        {hasContext && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs"
          >
            Reset
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Select your context to get more tailored answers. All optional.
      </p>

      {/* Age Group */}
      <div>
        <label className="text-xs font-medium mb-1 block">Age group</label>
        <div className="flex flex-wrap gap-1">
          {AGE_GROUPS.map(age => (
            <Badge
              key={age.value}
              variant={context.ageGroup === age.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => onUpdate({ ageGroup: age.value })}
            >
              {age.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Setting */}
      <div>
        <label className="text-xs font-medium mb-1 block">Setting</label>
        <div className="flex flex-wrap gap-1">
          {SETTINGS.map(setting => (
            <Badge
              key={setting.value}
              variant={context.setting === setting.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => onUpdate({ setting: setting.value })}
            >
              {setting.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Challenge */}
      <div>
        <label className="text-xs font-medium mb-1 block">Main challenge</label>
        <div className="flex flex-wrap gap-1">
          {CHALLENGES.map(challenge => (
            <Badge
              key={challenge.value}
              variant={context.mainChallenge === challenge.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => onUpdate({ mainChallenge: challenge.value })}
            >
              {challenge.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Goal */}
      <div>
        <label className="text-xs font-medium mb-1 block">Goal / Timeframe</label>
        <div className="flex flex-wrap gap-1">
          {GOALS.map(goal => (
            <Badge
              key={goal.value}
              variant={context.goal === goal.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => onUpdate({ goal: goal.value })}
            >
              {goal.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="text-xs font-medium mb-1 block">Country</label>
        <div className="flex flex-wrap gap-1">
          {COUNTRIES.map(country => (
            <Badge
              key={country.value}
              variant={context.country === country.value ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => onUpdate({ country: country.value })}
            >
              {country.label}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}






