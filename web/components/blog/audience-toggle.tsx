'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Users, Heart, GraduationCap, User, Briefcase } from 'lucide-react'
import type { AudienceType } from '@/types/ai-coach'

interface AudienceToggleProps {
  value?: AudienceType
  onChange: (audience?: AudienceType) => void
}

const AUDIENCES = [
  { id: 'parents' as const, label: 'Parents', icon: Heart },
  { id: 'young_people' as const, label: 'Young People', icon: Users },
  { id: 'teachers' as const, label: 'Teachers/SENCO', icon: GraduationCap },
  { id: 'adults' as const, label: 'Adults', icon: User },
  { id: 'workplace' as const, label: 'Workplace', icon: Briefcase }
]

export default function AudienceToggle({ value, onChange }: AudienceToggleProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Tailor answer for:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(undefined)}
        >
          Everyone
        </Button>
        {AUDIENCES.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={value === id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(id)}
          >
            <Icon className="w-4 h-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}

