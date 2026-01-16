'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export type RelatedContentItem = {
  href: string;
  label: string;
  description?: string;
  typeBadge?: 'Tool' | 'Guide' | 'FAQ' | 'Checklist' | 'Explainer' | string;
};

interface RelatedContentProps {
  title?: string;
  items: RelatedContentItem[];
  className?: string;
}

export function RelatedContent({ title = 'Related content', items, className }: RelatedContentProps) {
  if (!items.length) return null;

  return (
    <section className={cn('space-y-4', className)} aria-label={title}>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground">Suggested next steps</span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="group h-full">
            <Card className="h-full p-5 transition-all group-hover:shadow-md group-hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
                    {item.label}
                  </h3>
                  {item.description ? (
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                {item.typeBadge ? (
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {item.typeBadge}
                  </Badge>
                ) : null}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
