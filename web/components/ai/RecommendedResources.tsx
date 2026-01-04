'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'

export interface RecommendedResourceDisplay {
  id: string
  title: string
  type: string
  url: string
  whyThisFits: string
  howToUseThisWeek: string
}

interface RecommendedResourcesProps {
  resources: RecommendedResourceDisplay[]
}

export default function RecommendedResources({ resources }: RecommendedResourcesProps) {
  if (!resources || resources.length === 0) return null

  return (
    <div className="border-t pt-4 mt-4">
      <h4 className="font-semibold text-sm mb-3">Recommended NeuroBreath Resources</h4>
      <div className="space-y-3">
        {resources.map(resource => (
          <Card key={resource.id} className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-sm">{resource.title}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{resource.type}</p>
                </div>
                <Link href={resource.url}>
                  <Button size="sm" variant="outline" className="h-8 text-xs">
                    Open
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <strong className="text-blue-700 dark:text-blue-400">Why this fits:</strong>
                <p className="text-muted-foreground mt-0.5">{resource.whyThisFits}</p>
              </div>
              <div>
                <strong className="text-blue-700 dark:text-blue-400">How to use this week:</strong>
                <p className="text-muted-foreground mt-0.5">{resource.howToUseThisWeek}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}




