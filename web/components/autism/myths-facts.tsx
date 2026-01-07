'use client';

import { mythsFacts } from '@/lib/data/myths-facts';
import { Lightbulb, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const MythsFacts = () => {
  return (
    <div className="w-full">
      <section className="py-12 bg-amber-50 dark:bg-amber-950/10">
        <div className="flex items-center gap-3 mb-8">
          <Lightbulb className="h-8 w-8 text-amber-600" />
          <h2 className="text-3xl font-bold">Myths & Facts</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {mythsFacts?.map?.((item, index) => (
            <Card key={index} className="p-6">
              <div className="mb-4">
                <div className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm font-semibold mb-2">
                  Myth
                </div>
                <p className="text-lg font-medium line-through opacity-60">{item?.myth}</p>
              </div>

              <div className="mb-4">
                <div className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold mb-2">
                  Fact
                </div>
                <p className="text-base">{item?.fact}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Sources:</p>
                <div className="flex flex-wrap gap-2">
                  {item?.sources?.map?.((source, idx) => (
                    <Button
                      key={idx}
                      variant="link"
                      size="sm"
                      className="p-0 h-auto gap-1 text-xs"
                      onClick={() => window?.open?.(source?.url, '_blank')}
                    >
                      {source?.text}
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
