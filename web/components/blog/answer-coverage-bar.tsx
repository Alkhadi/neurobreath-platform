'use client'

import { CheckCircle, XCircle, Info } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface CoverageBarProps {
  coverage: {
    nhs: boolean
    nice: boolean
    pubmed: boolean
  }
}

export default function AnswerCoverageBar({ coverage }: CoverageBarProps) {
  const items = [
    { key: 'nhs', label: 'NHS guidance', included: coverage.nhs },
    { key: 'nice', label: 'NICE guidance', included: coverage.nice },
    { key: 'pubmed', label: 'Peer-reviewed research', included: coverage.pubmed }
  ]
  
  const totalScore = items.filter(i => i.included).length
  const maxScore = items.length
  
  return (
    <Alert>
      <Info className="w-4 h-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Evidence Coverage: {totalScore}/{maxScore}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {items.map(item => (
              <div key={item.key} className="flex items-center gap-1">
                {item.included ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className={`text-xs ${item.included ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          {totalScore < maxScore && (
            <p className="text-xs text-muted-foreground mt-2">
              Some evidence sources unavailable for this query. Answer based on available guidance.
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}







