'use client';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, ExternalLink, FileText } from 'lucide-react';

export function ADHDEvidenceHub() {
  return (
    <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Evidence & UK Resources 📖</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Why breathing + sprints work: research-backed interventions
        </p>
      </div>

      <Alert className="mb-6">
        <BookOpen className="h-4 w-4" />
        <AlertDescription>
          <strong>Why breathing + sprints?</strong> Short breathing resets regulate autonomic arousal (Noble & Hochman, 2019) while structured work-rest intervals improve sustained attention for adults with ADHD (Semeijn et al., 2020).
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'NICE — NG87', subtitle: 'Adult meds choice', icon: FileText },
          { title: 'Acas', subtitle: 'Adjustments for neurodiversity', icon: ExternalLink },
          { title: 'ADDitude', subtitle: 'Pomodoro for ADHD focus', icon: ExternalLink }
        ].map((resource, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer">
            <CardHeader>
              <resource.icon className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>{resource.subtitle}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
