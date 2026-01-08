'use client';

import { usePreferences } from '@/hooks/autism/use-preferences';
import { Button } from '@/components/ui/button';
import { AudienceType } from '@/lib/types';
import { GraduationCap, Heart, User, Briefcase } from 'lucide-react';

const audiences: { value: AudienceType; label: string; icon: React.ElementType }[] = [
  { value: 'teacher', label: 'Teacher', icon: GraduationCap },
  { value: 'parent', label: 'Parent/Carer', icon: Heart },
  { value: 'autistic', label: 'Autistic Person', icon: User },
  { value: 'employer', label: 'Employer', icon: Briefcase }
];

export const AudienceSwitcher = () => {
  const { preferences, updateAudience, isLoading } = usePreferences();

  // Prevent hydration mismatch by showing consistent state during SSR
  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        {audiences?.map?.((aud) => {
          const Icon = aud?.icon;
          const isActive = aud?.value === 'teacher'; // Default state matches SSR

          return (
            <Button
              key={aud?.value}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              disabled
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {aud?.label}
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {audiences?.map?.((aud) => {
        const Icon = aud?.icon;
        const isActive = preferences?.audience === aud?.value;

        return (
          <Button
            key={aud?.value}
            variant={isActive ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateAudience?.(aud?.value)}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {aud?.label}
          </Button>
        );
      })}
    </div>
  );
};
