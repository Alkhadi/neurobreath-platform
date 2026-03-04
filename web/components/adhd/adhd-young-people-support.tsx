'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Award } from 'lucide-react';

export function ADHDYoungPeopleSupport() {
  return (
    <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">ADHD Support for Young People (UK) 🇬🇧</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Evidence-backed responses to common challenges raised by UK families and schools
        </p>
      </div>

      <div className="flex flex-wrap gap-6 [&>*]:basis-full md:[&>*]:basis-[calc(50%-12px)] [&>*]:min-w-0">
        <Card className="border-2 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-600" />
              Frequent Pain Points
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• Persistent restless energy and reduced classroom focus</p>
            <p>• Executive-organisation difficulties with homework</p>
            <p>• Emotional dysregulation and self-esteem challenges</p>
            <p>• Stressful transitions between environments</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-green-600" />
              Evidence-Backed Responses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>• Parent/carer psychoeducation programmes (NICE NG87)</p>
            <p>• Behavioural and organisational coaching</p>
            <p>• Talking therapies (CBT/skills training)</p>
            <p>• Movement and active breaks for regulation</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap mt-6 gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(33.333%-11px)] [&>*]:min-w-0">
        {[
          { name: 'NHS ADHD in Children', url: 'https://www.nhs.uk/conditions/attention-deficit-hyperactivity-disorder-adhd/' },
          { name: 'ADHD Foundation', url: 'https://adhdfoundation.org.uk/' },
          { name: 'YoungMinds', url: 'https://www.youngminds.org.uk/' }
        ].map((resource, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="pt-6">
              <Badge className="mb-2">UK Resource</Badge>
              <p className="font-semibold">{resource.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
