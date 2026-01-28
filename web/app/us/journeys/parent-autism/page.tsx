import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supporting Your Autistic Child Journey | NeuroBreath',
  description: 'A guided journey for parents navigating autism support. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/parent-autism',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/parent-autism',
      'en-US': 'https://neurobreath.co.uk/us/journeys/parent-autism',
    },
  },
  openGraph: {
    title: 'Supporting Your Autistic Child Journey | NeuroBreath',
    description: 'A guided journey for parents navigating autism support.',
    url: 'https://neurobreath.co.uk/us/journeys/parent-autism',
    type: 'website',
  },
};

export default function JourneyLanding() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Supporting Your Autistic Child</h1>
        <p className="text-xl text-muted-foreground mb-6">
          A comprehensive guide for parents navigating autism support
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~25 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>For: parents</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>4 steps</span>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What You&apos;ll Learn</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              1
            </span>
            <div>
              <h3 className="font-medium">Understanding Autism</h3>
              <p className="text-sm text-muted-foreground">Learn about autism as a neurodevelopmental difference</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              2
            </span>
            <div>
              <h3 className="font-medium">Creating Supportive Environments</h3>
              <p className="text-sm text-muted-foreground">Adapt your home to support sensory and emotional needs</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              3
            </span>
            <div>
              <h3 className="font-medium">Communication Strategies</h3>
              <p className="text-sm text-muted-foreground">Support your child&apos;s unique communication style</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              4
            </span>
            <div>
              <h3 className="font-medium">Building Long‑Term Support</h3>
              <p className="text-sm text-muted-foreground">Plan for continued growth and development</p>
            </div>
          </li>
        </ol>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="flex-1">
          <Link href="/us/journeys/parent-autism/step/1">Start Journey</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/us/help-me-choose">Help Me Choose</Link>
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Educational information only.</strong> Not medical advice. This journey provides general information about autism and supportive strategies. Consult qualified providers for guidance specific to your child&apos;s needs.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
