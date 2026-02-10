import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import './styles/globals.css';

export const metadata: Metadata = generatePageMetadata({
  title: 'Bipolar Disorder Support | NeuroBreath',
  description:
    'Bipolar disorder support guide with clear explanations, treatment overview and resources for individuals, families and educators.',
  path: '/conditions/bipolar',
  keywords: [
    'bipolar disorder',
    'manic depression',
    'mental health',
    'mood disorder',
    'mania',
    'depression',
    'bipolar treatment',
    'mood stabilizers',
    'bipolar support',
    'mental health resources',
  ],
});

export default function BipolarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
