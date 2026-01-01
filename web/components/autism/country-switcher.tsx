'use client'

import { Button } from '@/components/ui/button'
import type { CountryType } from '@/types/autism'
import { useUserContext } from '@/hooks/useAutismProgress'

const COUNTRIES: { value: CountryType; label: string; flag: string }[] = [
  { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
  { value: 'us', label: 'United States', flag: '🇺🇸' },
  { value: 'eu', label: 'European Union', flag: '🇪🇺' }
]

export function CountrySwitcher() {
  const { context, updateContext, hydrated } = useUserContext()

  if (!hydrated) {
    return <div className="h-12 bg-gray-100 animate-pulse rounded-lg" />
  }

  return (
    <div className="bg-white/80 backdrop-blur border rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-medium text-gray-600">Region</div>
          <div className="text-sm font-semibold text-gray-900">Where should we signpost?</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {COUNTRIES.map((country) => (
          <Button
            key={country.value}
            variant={context.country === country.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateContext({ country: country.value })}
            className="justify-start text-left rounded-lg"
          >
            <span className="mr-2 text-lg" aria-hidden="true">{country.flag}</span>
            <span className="text-sm">{country.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

