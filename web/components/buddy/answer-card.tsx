'use client';

import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { BuddyAnswer, BuddyAskResponse, BuddyCitation } from '@/lib/buddy/server/types';

export interface BuddyAnswerCardProps {
  answer: BuddyAnswer;
  citations: BuddyCitation[];
  meta?: BuddyAskResponse['meta'];
  renderLine: (line: string) => React.ReactNode;
  className?: string;
}

function providerBadge(provider: BuddyCitation['provider']): { label: string; variant: 'default' | 'secondary' | 'outline' } {
  switch (provider) {
    case 'NHS':
      return { label: 'NHS', variant: 'secondary' };
    case 'MedlinePlus':
      return { label: 'MedlinePlus', variant: 'outline' };
    case 'PubMed':
      return { label: 'PubMed', variant: 'outline' };
    case 'NeuroBreath':
      return { label: 'NeuroBreath', variant: 'default' };
    default:
      return { label: provider, variant: 'outline' };
  }
}

function isInternalUrl(url: string): boolean {
  return url.startsWith('/');
}

export function BuddyAnswerCard({ answer, citations, meta, renderLine, className }: BuddyAnswerCardProps) {
  const primaryProvider = citations[0]?.provider;
  const primaryBadge = primaryProvider ? providerBadge(primaryProvider) : null;
  const lastReviewed = citations.find((s) => s.lastReviewed)?.lastReviewed;

  return (
    <div className={cn('space-y-3', className)} data-buddy-answer-card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-sm sm:text-base md:text-lg font-semibold leading-snug break-words">
            {answer.title}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {primaryBadge && (
              <Badge variant={primaryBadge.variant} className="text-[10px]">
                {primaryBadge.label}
              </Badge>
            )}
            {meta?.usedInternal && (
              <Badge variant="secondary" className="text-[10px]">
                Internal first
              </Badge>
            )}
            {meta?.usedExternal && (
              <Badge variant="outline" className="text-[10px]">
                External verified
              </Badge>
            )}
            {lastReviewed && (
              <Badge variant="outline" className="text-[10px]">
                Last reviewed: {lastReviewed}
              </Badge>
            )}
            {answer.safety.level !== 'none' && (
              <Badge variant="outline" className="text-[10px]">
                Safety: {answer.safety.level}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {answer.summary
          .split('\n')
          .filter(Boolean)
          .map((line, idx) => (
            <div key={`summary-${idx}`} className="whitespace-pre-wrap leading-relaxed break-words">
              {renderLine(line)}
            </div>
          ))}
      </div>

      {answer.sections.length > 0 && (
        <div className="space-y-3">
          {answer.sections.map((section) => (
            <div key={section.heading} className="rounded-lg border border-border/50 bg-background/40 p-3">
              <div className="text-xs font-semibold text-foreground/80">{section.heading}</div>
              <div className="mt-2 space-y-1">
                {section.text
                  .split('\n')
                  .filter(Boolean)
                  .map((line, idx) => (
                    <div key={`${section.heading}-${idx}`} className="whitespace-pre-wrap leading-relaxed break-words">
                      {renderLine(line)}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {answer.safety.message && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <div className="text-xs font-semibold text-destructive">When to get help</div>
          <div className="mt-2 space-y-1">
            {answer.safety.message
              .split('\n')
              .filter(Boolean)
              .map((line, idx) => (
                <div key={`safety-${idx}`} className="whitespace-pre-wrap leading-relaxed break-words text-sm">
                  {renderLine(line)}
                </div>
              ))}
          </div>
        </div>
      )}

      {citations.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="sources">
            <AccordionTrigger className="text-xs">Evidence sources</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2" data-buddy-citation-list>
                {citations.map((s) => (
                  <div key={`${s.provider}:${s.url}`} className="flex flex-col gap-0.5 rounded-md border border-border/50 p-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={providerBadge(s.provider).variant} className="text-[10px]">
                        {providerBadge(s.provider).label}
                      </Badge>
                      {s.lastReviewed && (
                        <Badge variant="outline" className="text-[10px]">
                          Reviewed: {s.lastReviewed}
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs font-medium break-words">{s.title}</div>
                    {isInternalUrl(s.url) ? (
                      <Link href={s.url} className="text-[10px] text-muted-foreground font-mono break-all underline">
                        {s.url}
                      </Link>
                    ) : (
                      <div className="text-[10px] text-muted-foreground font-mono break-all">{s.url}</div>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
}
