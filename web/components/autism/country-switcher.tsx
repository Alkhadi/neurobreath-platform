'use client';

import { usePreferences } from '@/hooks/autism/use-preferences';
import { Button } from '@/components/ui/button';
import { CountryType } from '@/lib/types';

const countries: { value: CountryType; label: string }[] = [
  { value: 'UK', label: 'UK' },
  { value: 'US', label: 'US' },
  { value: 'EU', label: 'EU' }
];

export const CountrySwitcher = () => {
  const { preferences, updateCountry, isLoading } = usePreferences();

  // Prevent hydration mismatch by showing consistent state during SSR
  if (isLoading) {
    return (
      <div className="flex gap-2">
        {countries?.map?.((country) => {
          const isActive = country?.value === 'UK'; // Default state matches SSR

          return (
            <Button
              key={country?.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              disabled
            >
              {country?.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {countries?.map?.((country) => {
        const isActive = preferences?.country === country?.value;

        return (
          <Button
            key={country?.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateCountry?.(country?.value)}
          >
            {country?.label}
          </Button>
        );
      })}
    </div>
  );
};
