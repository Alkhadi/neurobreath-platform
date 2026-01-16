import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Autism Support Hub | NeuroBreath',
  description:
    'Evidence-based autism support with visual schedules, sensory strategies and practical tools for families, educators and autistic people.',
  path: '/autism',
  keywords: [
    'autism support',
    'autism strategies',
    'visual schedules',
    'PECS',
    'AAC',
    'sensory support',
    'calm corners',
    'autism school',
    'autism workplace',
    'autism UK',
    'SEND',
    'IEP',
  ],
})

export default function AutismLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

