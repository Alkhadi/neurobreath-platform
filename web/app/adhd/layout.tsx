/**
 * ADHD Hub Layout
 * Provides metadata for the ADHD section
 */

import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'ADHD Support Hub | Tools, Resources & Evidence-Based Strategies',
  description: 'Comprehensive ADHD support for children, teens, parents, teachers, and carers. Interactive tools including focus timers, daily quests, skills library, and evidence-based strategies backed by research. Free UK resources for ADHD management.',
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
