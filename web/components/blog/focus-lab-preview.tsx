'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Sparkles, Brain, Heart, Target } from 'lucide-react'

const FOCUS_TOOLS = [
  {
    id: 'focus-garden',
    title: 'Focus Garden',
    description: 'Grow a virtual garden through focused practice. Track attention, earn rewards, and build consistency.',
    icon: '🌱',
    color: 'bg-green-50 dark:bg-green-950 border-green-200',
    url: '/autism/focus-garden',
    Icon: Target
  },
  {
    id: 'breathing-exercises',
    title: 'Breathing Exercises',
    description: 'Evidence-based breathing techniques for calm, focus, and emotional regulation.',
    icon: '🫁',
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200',
    url: '/breathing/techniques',
    Icon: Heart
  },
  {
    id: 'adhd-focus-lab',
    title: 'ADHD Focus Lab',
    description: 'Interactive attention-boosting games inspired by NICE NG87 and CDC ADHD guidelines.',
    icon: '🎮',
    color: 'bg-purple-50 dark:bg-purple-950 border-purple-200',
    url: '/tools/adhd-focus-lab',
    Icon: Brain
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Tools',
    description: '2-minute classroom scripts and sensory practices referencing NHS Every Mind Matters.',
    icon: '🧘',
    color: 'bg-indigo-50 dark:bg-indigo-950 border-indigo-200',
    url: '/breathing/mindfulness',
    Icon: Sparkles
  }
]

export default function FocusLabPreview() {
  return (
    <Card id="focus-lab" className="scroll-mt-20">
      <CardHeader>
        <div className="space-y-2">
          <Badge variant="outline">Interactive Focus Lab · 2025 Edition</Badge>
          <CardTitle className="text-2xl">Evidence-based attention tools &amp; rewards</CardTitle>
          <p className="text-sm text-muted-foreground">
            Inspired by NICE NG87, CDC ADHD guidelines, EndeavorRx research, and recent cognitive training 
            studies (Frontiers in Psychiatry 2022), these tools translate proven strategies into playful daily routines.
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          {FOCUS_TOOLS.map(tool => (
            <Card key={tool.id} className={`border-2 ${tool.color}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{tool.icon}</span>
                  <tool.Icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg mt-2">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                <Link href={tool.url}>
                  <Button className="w-full">Launch Tool</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold mb-3">Why these tools?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Evidence-informed:</strong> Based on NICE guidelines, CDC recommendations, and peer-reviewed research.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Neuro-inclusive:</strong> Designed for autistic, ADHD, and neurodivergent learners.</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Trackable progress:</strong> Built-in streak tracking, badges, and rewards.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">✓</span>
                <span><strong>Free &amp; accessible:</strong> No sign-up required, works on all devices.</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


