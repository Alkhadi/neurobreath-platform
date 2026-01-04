'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface InternalLink {
  title: string
  path: string
  reason: string
  ctaLabel: string
}

interface InternalLinksDisplayProps {
  links: InternalLink[]
}

export default function InternalLinksDisplay({ links }: InternalLinksDisplayProps) {
  if (links.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950 dark:to-cyan-950 border-teal-200 dark:border-teal-800">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h4 className="font-semibold text-sm">🔗 Open on NeuroBreath (Recommended Next Steps)</h4>
        </div>
        
        <div className="space-y-3">
          {links.map((link, idx) => (
            <div 
              key={idx}
              className="p-3 bg-white dark:bg-gray-900 rounded-md border border-teal-100 dark:border-teal-900"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h5 className="font-semibold text-sm">{link.title}</h5>
                <Badge variant="outline" className="text-xs shrink-0">Step {idx + 1}</Badge>
              </div>
              
              <p className="text-xs text-muted-foreground mb-3">{link.reason}</p>
              
              <Link href={link.path}>
                <Button size="sm" variant="outline" className="w-full">
                  {link.ctaLabel}
                  <ExternalLink className="w-3 h-3 ml-2" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 italic">
          💡 These are the best-match tools based on your question. Open them directly from here.
        </p>
      </CardContent>
    </Card>
  )
}





