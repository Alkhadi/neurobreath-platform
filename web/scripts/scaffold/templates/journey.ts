/**
 * Template for Journey Pages
 * Generates routes for multi-step journey flows
 */

type Region = 'uk' | 'us';

export type JourneyTemplateContext = {
  journeySlug: string;
  journeyTitle: string;
  region: Region;
};

export type JourneyStepTemplateContext = {
  journeySlug: string;
  stepNumber: number;
  totalSteps: number;
  region: Region;
};

export const journeyLandingTemplate = {
  generate(context: JourneyTemplateContext) {
    const { journeySlug, region } = context;
    const baseUrl = `/${region}`;

    return `import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CheckCircle } from 'lucide-react';
import { journey } from '@/content/journeys/${journeySlug}.content';

const region = '${region}' as const;
const content = region === 'uk' ? journey.uk : journey.us;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobreath.co.uk';
  const canonical = \`\${baseUrl}${baseUrl}/journeys/${journeySlug}\`;

  return {
    title: \`\${content.title} | NeuroBreath\`,
    description: content.description,
    alternates: {
      canonical,
      languages: {
        'en-GB': \`\${baseUrl}/uk/journeys/${journeySlug}\`,
        'en-US': \`\${baseUrl}/us/journeys/${journeySlug}\`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.description,
      url: canonical,
      type: 'website',
      siteName: 'NeuroBreath',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function JourneyLanding() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
        <p className="text-xl text-muted-foreground mb-6">
          {content.description}
        </p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~{journey.estimatedMinutes} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>For: {journey.audience.join(', ')}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>{journey.steps.length} steps</span>
          </div>
        </div>
      </header>

      {/* Journey Steps Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What You'll Learn</h2>
        <ol className="space-y-3">
          {content.steps.map((step, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                {idx + 1}
              </span>
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="flex-1">
          <Link href="${baseUrl}/journeys/${journeySlug}/step/1">
            Start Journey
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="${baseUrl}/help-me-choose">
            Help Me Choose
          </Link>
        </Button>
      </div>

      {/* Trust Block */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Educational Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This journey provides educational information only and is not a substitute for 
            professional medical advice, diagnosis, or treatment. Always seek guidance from 
            qualified healthcare providers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`;
  },
};

export const journeyStepTemplate = {
  generate(context: JourneyStepTemplateContext) {
    const { journeySlug, stepNumber, totalSteps, region } = context;
    const baseUrl = `/${region}`;

    const prevLink = stepNumber > 1
      ? `${baseUrl}/journeys/${journeySlug}/step/${stepNumber - 1}`
      : `${baseUrl}/journeys/${journeySlug}`;

    const nextLink = stepNumber < totalSteps
      ? `${baseUrl}/journeys/${journeySlug}/step/${stepNumber + 1}`
      : `${baseUrl}/journeys/${journeySlug}/complete`;

    return `import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { journey } from '@/content/journeys/${journeySlug}.content';

const region = '${region}' as const;
const content = region === 'uk' ? journey.uk : journey.us;
const step = content.steps[${stepNumber - 1}];

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobreath.co.uk';
  const canonical = \`\${baseUrl}${baseUrl}/journeys/${journeySlug}/step/${stepNumber}\`;

  return {
    title: \`\${step.title} - Step ${stepNumber} | NeuroBreath\`,
    description: step.summary,
    alternates: {
      canonical,
      languages: {
        'en-GB': \`\${baseUrl}/uk/journeys/${journeySlug}/step/${stepNumber}\`,
        'en-US': \`\${baseUrl}/us/journeys/${journeySlug}/step/${stepNumber}\`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: step.title,
      description: step.summary,
      url: canonical,
      type: 'article',
    },
  };
}

export default function JourneyStep() {
  const stepNumber = ${stepNumber};
  const totalSteps = ${totalSteps};
  const progressPercent = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {stepNumber} of {totalSteps}</span>
          <span>{progressPercent}% complete</span>
        </div>
        <progress
          className="w-full h-2"
          value={stepNumber}
          max={totalSteps}
          aria-label={\`Journey progress: step \${stepNumber} of \${totalSteps}\`}
        />
      </div>

      {/* Content */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{step.title}</h1>
          <p className="text-lg text-muted-foreground">{step.summary}</p>
        </header>

        {/* Key Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            {step.keyActions.map((action, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-primary flex-shrink-0">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Suggested Tools */}
        {step.suggestedTools && step.suggestedTools.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recommended Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {step.suggestedTools.map((tool) => (
                <Card key={tool}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {tool.replace(/\\//g, ' › ').replace(/-/g, ' ')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button asChild variant="outline" className="w-full">
                      <Link href={\`${baseUrl}/tools/\${tool}\`}>
                        Try This Tool
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Suggested Guides */}
        {step.suggestedGuides && step.suggestedGuides.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recommended Guides</h2>
            <ul className="space-y-2">
              {step.suggestedGuides.map((guide) => (
                <li key={guide}>
                  <Link 
                    href={\`${baseUrl}/guides/\${guide}\`}
                    className="text-primary hover:underline inline-flex items-center gap-2"
                  >
                    <span>→</span>
                    <span>{guide.replace(/\\//g, ' › ').replace(/-/g, ' ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQ */}
        {step.faq && step.faq.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Common Questions</h2>
            <div className="space-y-4">
              {step.faq.map((item, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Navigation */}
      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="${prevLink}">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="${nextLink}">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </nav>

      {/* Trust Disclaimer */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">
            Educational information only. Not medical advice. 
            Consult qualified healthcare providers for personal guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`;
  },
};

export const journeyCompletionTemplate = {
  generate(context: JourneyTemplateContext) {
    const { journeySlug, region } = context;
    const baseUrl = `/${region}`;

    return `import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { journey } from '@/content/journeys/${journeySlug}.content';

const region = '${region}' as const;
const content = region === 'uk' ? journey.uk : journey.us;
const completion = content.completion;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobreath.co.uk';
  const canonical = \`\${baseUrl}${baseUrl}/journeys/${journeySlug}/complete\`;

  return {
    title: \`\${completion.title} - Journey Complete | NeuroBreath\`,
    description: completion.summary,
    alternates: {
      canonical,
      languages: {
        'en-GB': \`\${baseUrl}/uk/journeys/${journeySlug}/complete\`,
        'en-US': \`\${baseUrl}/us/journeys/${journeySlug}/complete\`,
      },
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function JourneyComplete() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">{completion.title}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {completion.summary}
        </p>
      </div>

      {/* Next Steps */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">What's Next?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {completion.nextSteps.map((step, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link href={step.link}>
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Journey Recap */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Journey Recap</CardTitle>
          <CardDescription>You completed all {journey.steps.length} steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {content.steps.map((step, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <span>{step.title}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="${baseUrl}/journeys">
            Explore More Journeys
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="${baseUrl}">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
`;
  },
};
