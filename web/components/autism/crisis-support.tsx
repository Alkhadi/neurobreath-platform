'use client';

import { usePreferences } from '@/hooks/autism/use-preferences';
import { crisisResources } from '@/lib/data/crisis-resources';
import { AlertTriangle, Phone, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const CrisisSupport = () => {
  const { preferences, isLoading } = usePreferences();
  
  // Prevent hydration mismatch by waiting for client-side load
  if (isLoading) {
    return null;
  }
  
  const resources = crisisResources?.filter?.(r => r?.country === preferences?.country) ?? [];

  return (
    <div className="w-full">
      <section className="py-12 bg-red-50 dark:bg-red-950/20">
        <div className="flex items-start gap-4 mb-6">
          <AlertTriangle className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Crisis Support</h2>
            <p className="text-muted-foreground">
              If you or someone you know is in crisis or experiencing thoughts of suicide,
              help is available right now.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          {resources?.map?.((resource) => (
            <Card key={resource?.name} className="p-4">
              <h3 className="font-semibold mb-2">{resource?.name}</h3>
              <div className="flex items-center gap-2 text-2xl font-bold text-red-600 mb-2">
                <Phone className="h-5 w-5" />
                {resource?.phone}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{resource?.description}</p>
              {resource?.hours && (
                <p className="text-sm text-muted-foreground mb-2">Hours: {resource?.hours}</p>
              )}
              {resource?.url && (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 h-auto gap-1"
                  onClick={() => window?.open?.(resource?.url, '_blank')}
                >
                  Learn more
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-red-600">
          <p className="font-semibold text-center">
            If you or someone else is in immediate danger, call emergency services immediately.
          </p>
        </div>
      </section>
    </div>
  );
};
