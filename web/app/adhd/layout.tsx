/**
 * ADHD Hub Layout
 * Provides metadata for the ADHD section
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'ADHD Support Hub | NeuroBreath',
  description:
    'Comprehensive ADHD support hub with focus tools, routines and evidence-based strategies for children, parents, teachers and carers in the UK.',
  path: '/adhd',
  keywords: [
    'ADHD support',
    'ADHD tools',
    'ADHD resources UK',
    'ADHD focus timer',
    'ADHD strategies',
    'ADHD children',
    'ADHD parents',
    'ADHD teachers',
    'executive function tools',
    'ADHD management',
  ],
});

export default function ADHDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
