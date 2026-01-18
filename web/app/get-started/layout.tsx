import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Getting Started | NeuroBreath',
  description: 'Begin your journey with NeuroBreath. Evidence-based breathing exercises, neurodiversity support, and mental wellbeing tools for individuals, families, educators, and professionals.',
  keywords: ['getting started', 'neurobreath guide', 'breathing exercises', 'neurodiversity support', 'ADHD', 'autism', 'anxiety', 'mental wellbeing'],
  openGraph: {
    title: 'Getting Started | NeuroBreath',
    description: 'Begin your journey with NeuroBreath. Free tools for breathing, neurodiversity, and mental wellbeing.',
    type: 'website',
  },
};

export default function GetStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
