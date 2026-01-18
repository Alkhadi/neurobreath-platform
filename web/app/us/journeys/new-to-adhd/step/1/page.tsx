import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New to ADHD Journey — Step 1: First steps | NeuroBreath',
  description: 'Step 1 of the New to ADHD journey: first steps and safe next actions. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/new-to-adhd/step/1',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/new-to-adhd/step/1',
      'en-US': 'https://neurobreath.co.uk/us/journeys/new-to-adhd/step/1',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JourneyStep() {
  const stepNumber = 1;
  const totalSteps = 3;
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
          aria-label={`Journey progress: step ${stepNumber} of ${totalSteps}`}
        />
      </div>

      {/* Content */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">First Steps</h1>
          <p className="text-lg text-muted-foreground">Begin your journey</p>
        </header>

        {/* Key Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Learn the basics</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Identify your needs</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Set goals</span>
            </li>
          </ul>
        </section>

      </article>

      {/* Navigation */}
      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/us/journeys/new-to-adhd">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="/us/journeys/new-to-adhd/step/2">
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
