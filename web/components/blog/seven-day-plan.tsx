'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import type { DayPlanItem } from '@/types/ai-coach'

interface SevenDayPlanProps {
  plan: DayPlanItem[]
}

export default function SevenDayPlan({ plan }: SevenDayPlanProps) {
  if (!plan || plan.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h4 className="font-semibold text-base">📅 Your 7-Day Micro Plan</h4>
        </div>
        
        <div className="space-y-2">
          {plan.map((day) => (
            <div 
              key={day.day} 
              className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-md border border-indigo-100 dark:border-indigo-900"
            >
              <div className="shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                {day.day}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{day.activity}</p>
                <p className="text-xs text-muted-foreground mt-1">⏱️ {day.duration}</p>
                {day.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">💡 {day.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-muted-foreground mt-4 italic">
          Remember: Consistency beats perfection. Even 1 minute counts.
        </p>
      </CardContent>
    </Card>
  )
}






