import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supporting Autistic Child Journey — Step 4: Building Long‑Term Support | NeuroBreath',
  description: 'Step 4: Build long-term support while caring for your own wellbeing. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/parent-autism/step/4',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/parent-autism/step/4',
      'en-US': 'https://neurobreath.co.uk/us/journeys/parent-autism/step/4',
    },
  },
};

export default function JourneyStep() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step 4 of 4</span>
          <span>100% complete</span>
        </div>
        <progress className="w-full h-2" value={4} max={4} aria-label="Journey progress: step 4 of 4" />
      </div>

      <article>
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Building Long‑Term Support</h1>
          <p className="text-lg text-muted-foreground">Plan for continued growth and development</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Connect with other parents</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Advocate for your child</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Take care of yourself</span></li>
          </ul>
        </section>

        <section className="prose dark:prose-invert max-w-none mb-8">
          <p>
            Support works best when it&apos;s consistent, collaborative, and sustainable. Aim for small changes you can keep up over time.
          </p>

          <h3>Build your team</h3>
          <p>
            This might include school staff, clinicians, family, and other parents. Shared understanding reduces stress for everyone.
          </p>

          <h3>Advocacy, step-by-step</h3>
          <p>
            Keep notes on what helps and what&apos;s hard. Clear examples make it easier to request accommodations and support.
          </p>

          <h3>Parent wellbeing matters</h3>
          <p>
            Caring for yourself is not optional—it supports your child. If you&apos;re overwhelmed, seek support.
          </p>
        </section>
      </article>

      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/us/journeys/parent-autism/step/3">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="/us/journeys/parent-autism/complete">
            Finish
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
