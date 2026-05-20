import * as React from 'react';

import { cn } from '@/lib/utils';

type Variant = 'general' | 'legal' | 'directory';

const COPY: Record<Variant, string> = {
  general:
    'Educational information only. This tool does not diagnose, treat, or replace professional advice. It is designed to help you reflect on strengths, support needs, routines, and possible next steps.',
  legal:
    'General educational information, not legal advice. Rules, eligibility, and forms can change. Always check the official government or qualified-professional source before applying or relying on this information. For urgent legal, employment, medical, safeguarding, or crisis issues, contact an appropriate qualified professional or emergency service.',
  directory:
    'Listings must be independently checked before publication. NeuroBreath does not provide emergency services and does not guarantee suitability. Please check credentials and registration with the relevant professional body.',
};

export interface EducationalDisclaimerProps {
  variant?: Variant;
  className?: string;
  children?: React.ReactNode;
  title?: string;
}

export function EducationalDisclaimer({
  variant = 'general',
  className,
  children,
  title = 'Please read',
}: EducationalDisclaimerProps) {
  return (
    <aside
      role="note"
      aria-label={title}
      className={cn(
        'rounded-2xl border border-amber-200 bg-amber-50/70 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 sm:p-5 text-sm leading-relaxed text-amber-900 dark:text-amber-100',
        className
      )}
    >
      <p className="font-semibold mb-1">{title}</p>
      <p>{children ?? COPY[variant]}</p>
    </aside>
  );
}

export default EducationalDisclaimer;
