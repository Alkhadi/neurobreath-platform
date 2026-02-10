import type { Metadata } from 'next'

import FocusTrainingClient from './FocusTrainingClient'

export const metadata: Metadata = {
  title: 'Focus — Sprints with Recovery · NeuroBreath',
  description:
    'Gentle focus protocols, ADHD-friendly timers, and short drills with recovery breaks. Educational guidance only.',
}

export default function FocusTrainingPage() {
  return <FocusTrainingClient />
}
