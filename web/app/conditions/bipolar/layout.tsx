import { Metadata } from 'next';
import './styles/globals.css';

export const metadata: Metadata = {
  title: 'Understanding Bipolar Disorder | Comprehensive Evidence-Based Resource',
  description:
    'Comprehensive, evidence-based information about bipolar disorder. Resources for diagnosis, treatment, management, and support for affected individuals, families, educators, and healthcare professionals.',
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
  authors: [{ name: 'NeurobReaTH Platform' }],
  openGraph: {
    title: 'Understanding Bipolar Disorder',
    description:
      'Comprehensive, evidence-based resource for bipolar disorder. Interactive tools, support resources, and expert information.',
    type: 'website',
  },
};

export default function BipolarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
