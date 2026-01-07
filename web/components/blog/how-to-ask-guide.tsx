'use client'

import { HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function HowToAskGuide() {
  return (
    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-2">
            <p className="font-semibold text-sm">How to ask for the best answer:</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li><span className="font-medium text-foreground">Age group:</span> child / teen / adult</li>
              <li><span className="font-medium text-foreground">Setting:</span> home / school / work</li>
              <li><span className="font-medium text-foreground">Main challenge:</span> sleep / sensory / routines / anxiety / etc.</li>
              <li><span className="font-medium text-foreground">Goal:</span> today / this week / long-term</li>
              <li><span className="font-medium text-foreground">Country:</span> UK / US / other (for pathways)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}







