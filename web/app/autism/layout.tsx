import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Autism Support Hub | Evidence-Based Strategies & Tools | NeuroBreath',
  description: 'Comprehensive autism support for teachers, parents, autistic individuals, and employers. Evidence-based strategies, interactive tools, progress tracking, and resources from NICE, NHS, CDC & peer-reviewed research.',
  keywords: 'autism support, autism strategies, visual schedules, PECS, AAC, sensory support, calm corners, autism school, autism workplace, autism UK, autism US, SEND, IEP',
  openGraph: {
    title: 'Autism Support Hub | NeuroBreath',
    description: 'Evidence-based autism support strategies and tools for UK, US & EU',
    type: 'website',
  },
}

export default function AutismLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

