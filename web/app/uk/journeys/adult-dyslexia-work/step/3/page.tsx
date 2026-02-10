import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia at Work Journey — Step 3: Tools and Strategies | NeuroBreath',
  description: 'Step 3: Use technology and systems to support your work. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work/step/3',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work/step/3',
      'en-US': 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work/step/3',
    },
  },
};

export default function JourneyStep() {
  const stepNumber = 3;
  const totalSteps = 3;
  const progressPercent = Math.round((stepNumber / totalSteps) * 100);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step {stepNumber} of {totalSteps}</span>
          <span>{progressPercent}% complete</span>
        </div>
        <progress className="w-full h-2" value={stepNumber} max={totalSteps} aria-label={`Journey progress: step ${stepNumber} of ${totalSteps}`} />
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Tools and Strategies</h1>
          <p className="text-lg text-muted-foreground">Use technology to support your work</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Explore text-to-speech tools</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Use visual organisation systems</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Leverage your strengths</span></li>
          </ul>
        </section>

        <section className="prose dark:prose-invert max-w-none mb-8">
          <p>
            A good tool reduces effort without reducing quality. Pair assistive technology with a simple workflow: capture → plan → execute → review.
          </p>
          <h3>Text-to-speech</h3>
          <p>
            Listening can be faster than reading when you&apos;re tired or under time pressure. Use it for dense documents, long emails, or reviewing your own writing.
          </p>
          <h3>Templates and checklists</h3>
          <p>
            Create reusable structures for common tasks: meeting notes, status updates, handovers, and project briefs.
          </p>
        </section>
      </article>

      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/uk/journeys/adult-dyslexia-work/step/2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="/uk/journeys/adult-dyslexia-work/complete">
            Finish
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </nav>

      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">Educational information only. Not legal advice.</p>
        </CardContent>
      </Card>
    </div>
  );
}
