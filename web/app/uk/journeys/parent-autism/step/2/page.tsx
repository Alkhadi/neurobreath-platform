import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supporting Autistic Child Journey — Step 2: Creating Supportive Environments | NeuroBreath',
  description: 'Step 2: Adapt your home to support sensory and emotional needs. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/uk/journeys/parent-autism/step/2',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/parent-autism/step/2',
      'en-US': 'https://neurobreath.co.uk/us/journeys/parent-autism/step/2',
    },
  },
};

export default function JourneyStep() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step 2 of 4</span>
          <span>50% complete</span>
        </div>
        <progress
          className="w-full h-2"
          value={2}
          max={4}
          aria-label="Journey progress: step 2 of 4"
        />
      </div>

      {/* Content */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Creating Supportive Environments</h1>
          <p className="text-lg text-muted-foreground">Adapt your home to support sensory and emotional needs</p>
        </header>

        {/* Key Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Identify sensory triggers</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Create calm spaces</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary flex-shrink-0">✓</span>
              <span>Establish predictable routines</span>
            </li>
          </ul>
        </section>

        {/* Content Area */}
        <section className="prose dark:prose-invert max-w-none mb-8">
          <h3>Understanding Sensory Needs</h3>
          <p>
            Many autistic children are either sensitive to or seek out sensory input—lights, sounds, textures, and smells. Identifying what affects your child is the first step to creating an environment that feels safe.
          </p>
          
          <h3>Creating Calm Spaces</h3>
          <p>
            A dedicated calm area with soft lighting, minimal noise, and comforting textures can help your child self-regulate when they feel overwhelmed. This might include cushions, a weighted blanket, or their favourite books.
          </p>
          
          <h3>Predictable Routines</h3>
          <p>
            Autistic children often thrive with structure and predictability. Clear daily routines, visual schedules, and advance notice of changes can reduce anxiety and increase feelings of control.
          </p>
        </section>

      </article>

      {/* Navigation */}
      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/uk/journeys/parent-autism/step/1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="/uk/journeys/parent-autism/step/3">
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
