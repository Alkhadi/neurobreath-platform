import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supporting Autistic Child Journey — Step 3: Communication Strategies | NeuroBreath',
  description: 'Step 3: Support your child’s communication style with practical strategies. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/parent-autism/step/3',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/parent-autism/step/3',
      'en-US': 'https://neurobreath.co.uk/us/journeys/parent-autism/step/3',
    },
  },
};

export default function JourneyStep() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step 3 of 4</span>
          <span>75% complete</span>
        </div>
        <progress className="w-full h-2" value={3} max={4} aria-label="Journey progress: step 3 of 4" />
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Communication Strategies</h1>
          <p className="text-lg text-muted-foreground">Support your child&apos;s communication style</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Use clear, concrete language</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Allow processing time</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Respect non-verbal communication</span></li>
          </ul>
        </section>

        <section className="prose dark:prose-invert max-w-none mb-8">
          <p>
            Communication is more than speech. Many autistic children communicate through behavior, gestures, pictures, scripts, or routines. Your goal is to reduce pressure and increase clarity.
          </p>

          <h3>Say what you mean</h3>
          <p>
            Use specific, literal wording when possible. Replace “be good” with “use a quiet voice” or “hands by your sides”.
          </p>

          <h3>Slow the pace</h3>
          <p>
            Some children need extra time to process language, especially when stressed. Ask one question at a time, then wait.
          </p>

          <h3>Validate communication attempts</h3>
          <p>
            If a child&apos;s behavior communicates discomfort, treat it as meaningful. Consider what the environment is asking of them and what support is missing.
          </p>
        </section>
      </article>

      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/us/journeys/parent-autism/step/2">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="/us/journeys/parent-autism/step/4">
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </nav>

      <Card className="mt-8 bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-xs text-muted-foreground">Educational information only. Not medical advice.</p>
        </CardContent>
      </Card>
    </div>
  );
}
