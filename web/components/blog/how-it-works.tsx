'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Users, FileText } from 'lucide-react'

export default function HowItWorks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">How the hub works</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2">
            <CardHeader>
              <FileText className="w-8 h-8 text-primary mb-2" />
              <CardTitle className="text-lg">AI + Human review</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The AI coach drafts answers using reputable health and education sources, then on-page 
              guidance distils the essentials. Editorial reviews keep tone compassionate and inclusive.
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Shield className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Safety first</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Every response includes crisis disclaimers and signposting to NHS 111/999, 988/911, GPs, 
              SENCOs, or licensed clinicians. The hub never offers individual medical advice.
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Audience filters</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Parents, young people, teachers, adults, and employers can skim sections labelled for them. 
              Clinician-only insights live in expandable panels so plain language stays front-and-centre.
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}


