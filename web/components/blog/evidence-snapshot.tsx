'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Microscope, Wrench, AlertCircle } from 'lucide-react'

interface EvidenceSnapshotProps {
  snapshot: {
    nhsNice: string[]
    research: string[]
    practicalSupports: string[]
    whenToSeekHelp: string[]
  }
}

export default function EvidenceSnapshot({ snapshot }: EvidenceSnapshotProps) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Evidence Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-4">
        {snapshot.nhsNice.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              NHS & NICE Guidance
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {snapshot.nhsNice.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {snapshot.research.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <Microscope className="w-4 h-4" />
              Research Findings
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {snapshot.research.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {snapshot.practicalSupports.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <Wrench className="w-4 h-4" />
              Practical Supports
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {snapshot.practicalSupports.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
        
        {snapshot.whenToSeekHelp.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              When to Seek Help
            </h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              {snapshot.whenToSeekHelp.map((item, idx) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

