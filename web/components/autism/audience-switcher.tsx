'use client'

import { Button } from '@/components/ui/button'
import type { AudienceType } from '@/types/autism'
import { useUserContext } from '@/hooks/useAutismProgress'

const AUDIENCES: { value: AudienceType; label: string; icon: string }[] = [
  { value: 'teacher', label: 'Teacher / SENCO', icon: '👩‍🏫' },
  { value: 'parent', label: 'Parent / Carer', icon: '👨‍👩‍👧' },
  { value: 'autistic', label: 'Autistic Person', icon: '✨' },
  { value: 'employer', label: 'Employer', icon: '💼' }
]

export function AudienceSwitcher() {
  const { context, updateContext, hydrated } = useUserContext()

  if (!hydrated) {
    return <div className="h-12 bg-gray-100 animate-pulse rounded-lg" />
  }

  return (
    <div className="bg-white/80 backdrop-blur border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-medium text-gray-600">Audience</div>
          <div className="text-sm font-semibold text-gray-900">Who is this for?</div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {AUDIENCES.map((audience) => (
          <Button
            key={audience.value}
            variant={context.audience === audience.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateContext({ audience: audience.value })}
            className="justify-start text-left h-auto py-3 rounded-lg"
          >
            <span className="mr-2 text-lg" aria-hidden="true">{audience.icon}</span>
            <span className="text-xs md:text-sm">{audience.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

