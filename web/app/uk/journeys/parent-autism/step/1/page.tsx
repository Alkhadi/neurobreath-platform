import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supporting Autistic Child Journey — Step 1: Understanding Autism | NeuroBreath',
  description: 'Step 1: Learn about autism as a neurodevelopmental difference. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/uk/journeys/parent-autism/step/1',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/parent-autism/step/1',
      'en-US': 'https://neurobreath.co.uk/us/journeys/parent-autism/step/1',
    },
  },
};

export default function JourneyStep() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step 1 of 4</span>
          <span>25% complete</span>
        </div>
        <progress
          className="w-full h-2"
          value={1}
          max={4}
          aria-label="Journey progress: step 1 of 4"
        />
      </div>

      {/* Content */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Understanding Autism</h1>
          <p className="text-lg text-muted-foreground">Learn about autism as a neurodevelopmental difference</p>
        </header>

        {/* Key Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Understand autism as a difference, not a deficit</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Recognise your child&apos;s unique strengths</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Learn about sensory needs</span>
            </li>
          </ul>
        </section>

        {/* Content Area */}
        <section className="prose dark:prose-invert max-w-none mb-8">
          <p>
            Autism is a neurodevelopmental difference that affects how people perceive, communicate with, and interact with the world. Your child&apos;s autistic brain is not broken—it&apos;s simply wired differently.
          </p>
          
          <h3>What This Means for Your Family</h3>
          <p>
            Many autistic children have unique strengths in areas like pattern recognition, attention to detail, or creative thinking. At the same time, they may experience challenges with sensory processing, social communication, or managing transitions.
          </p>
          
          <h3>Supporting Your Child</h3>
          <p>
            The most effective support involves understanding your child&apos;s individual profile, respecting their communication style, and creating an environment that works with their neurology rather than against it.
          </p>
        </section>

      </article>

      {/* Navigation */}
      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/uk/journeys/parent-autism">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button asChild>
          <Link href="/uk/journeys/parent-autism/step/2">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </nav>

      {/* Trust Disclaimer */}
      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">
            Educational information only. Not medical advice. Consult qualified healthcare providers for personal guidance.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
