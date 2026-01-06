'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Shield, Plus, ExternalLink } from 'lucide-react'
import type { RecommendedResource } from '@/types/ai-coach'
import Link from 'next/link'

interface RecommendationsDisplayProps {
  recommendations: RecommendedResource[]
}

const CATEGORY_CONFIG = {
  primary: {
    label: 'Primary Recommendation',
    icon: Target,
    color: 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-700',
    badge: 'bg-blue-600 text-white'
  },
  backup: {
    label: 'Backup Option',
    icon: Shield,
    color: 'bg-green-100 dark:bg-green-950 border-green-300 dark:border-green-700',
    badge: 'bg-green-600 text-white'
  },
  'add-on': {
    label: 'Add-On',
    icon: Plus,
    color: 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-700',
    badge: 'bg-purple-600 text-white'
  }
}

export default function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  if (recommendations.length === 0) return null

  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-sm mb-3">🎯 Your Best-Fit Action Plan</h4>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => {
          const config = CATEGORY_CONFIG[rec.category]
          const Icon = config.icon

          return (
            <Card key={idx} className={`${config.color} border-2`}>
              <CardContent className="pt-4 pb-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 shrink-0" />
                    <h5 className="font-semibold text-base">{rec.title}</h5>
                  </div>
                  <Badge className={config.badge}>{config.label}</Badge>
                </div>

                {/* Who it's for */}
                <div className="text-sm">
                  <span className="font-medium">Who it's for:</span> {rec.whoItsFor}
                </div>

                {/* How to do it */}
                <div className="text-sm">
                  <span className="font-medium">How to do it:</span> {rec.howToDoIt}
                </div>

                {/* Exact settings */}
                <div className="text-sm bg-white dark:bg-gray-900 p-3 rounded-md border">
                  <span className="font-medium">⚙️ Exact settings:</span> {rec.exactSettings}
                </div>

                {/* When to use */}
                <div className="text-sm">
                  <span className="font-medium">When to use:</span> {rec.whenToUse}
                </div>

                {/* CTA Button */}
                {rec.path && (
                  <Link href={rec.path}>
                    <Button size="sm" className="w-full mt-2">
                      {rec.ctaLabel}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}






