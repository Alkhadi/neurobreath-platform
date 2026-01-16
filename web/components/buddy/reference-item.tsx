/**
 * ReferenceItem Component
 * Displays external references as non-clickable text with copy functionality
 * Internal links remain clickable
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ReferenceItemProps {
  title: string;
  url: string;
  sourceLabel?: string;
  updatedAt?: string;
  isExternal: boolean;
  className?: string;
}

export function ReferenceItem({
  title,
  url,
  sourceLabel,
  updatedAt,
  isExternal,
  className,
}: ReferenceItemProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  // Extract domain from URL for badge display
  const getDomain = (urlString: string): string => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.hostname.replace('www.', '');
    } catch {
      return '';
    }
  };

  // Internal link - render as clickable
  if (!isExternal) {
    return (
      <div className={cn('flex items-start gap-2 py-1', className)}>
        <Link
          href={url}
          className="text-primary hover:text-primary/80 underline font-medium flex-1"
        >
          {title}
        </Link>
        {sourceLabel && (
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">
            {sourceLabel}
          </Badge>
        )}
      </div>
    );
  }

  // External reference - render as non-clickable with copy button
  return (
    <div className={cn('flex flex-col gap-1.5 py-1.5 sm:py-2', className)}>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <div className="font-medium text-sm flex items-center gap-1.5 flex-wrap">
            <span>{title}</span>
            {sourceLabel && (
              <Badge variant="outline" className="text-[10px] h-4">
                {getDomain(url) || sourceLabel}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 font-mono truncate">
            {url}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 flex-shrink-0"
          onClick={handleCopy}
          aria-label={copied ? 'URL copied' : 'Copy URL'}
        >
          {copied ? (
            <><Check className="h-3 w-3 mr-1" /><span className="text-[10px]">Copied</span></>
          ) : (
            <><Copy className="h-3 w-3 mr-1" /><span className="text-[10px]">Copy link</span></>
          )}
        </Button>
      </div>
      {updatedAt && (
        <div className="text-[10px] text-muted-foreground italic">
          Last updated: {updatedAt}
        </div>
      )}
    </div>
  );
}

/**
 * ReferencesSection Component
 * Displays a list of references with proper formatting
 */
export interface ReferencesSectionProps {
  references: ReferenceItemProps[];
  title?: string;
  className?: string;
}

export function ReferencesSection({
  references,
  title = 'Evidence Sources:',
  className,
}: ReferencesSectionProps) {
  if (!references || references.length === 0) {
    return null;
  }

  return (
    <div className={cn('border-t border-border/50 pt-3 mt-3', className)}>
      <div className="text-xs font-semibold mb-2 text-foreground/80">{title}</div>
      <div className="space-y-1.5">
        {references.map((ref, index) => (
          <ReferenceItem key={index} {...ref} />
        ))}
      </div>
    </div>
  );
}
