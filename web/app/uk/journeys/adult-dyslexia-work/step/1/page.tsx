import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia at Work Journey — Step 1: Understanding Your Rights | NeuroBreath',
  description: 'Step 1: Learn about workplace protections and reasonable adjustments. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work/step/1',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work/step/1',
      'en-US': 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work/step/1',
    },
  },
};

export default function JourneyStep() {
  const stepNumber = 1;
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
          <h1 className="text-3xl font-bold mb-4">Understanding Your Rights</h1>
          <p className="text-lg text-muted-foreground">Workplace protections and accommodations</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Review equality legislation</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Understand reasonable adjustments</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Know your disclosure options</span></li>
          </ul>
        </section>

        <section className="prose dark:prose-invert max-w-none mb-8">
          <p>
            If dyslexia impacts your work, you may be entitled to reasonable adjustments. The details depend on local laws and workplace policy, but the theme is consistent: support should help you do your job effectively.
          </p>
          <h3>Reasonable adjustments</h3>
          <p>
            Adjustments can include assistive technology, written instructions, more time for reading/writing-heavy tasks, structured templates, or changes to how work is assigned and reviewed.
          </p>
          <h3>Disclosure choices</h3>
          <p>
            You can choose when and how to disclose. Some people disclose early to get support quickly; others wait until they can propose specific solutions.
          </p>
        </section>
      </article>

      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/uk/journeys/adult-dyslexia-work">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button asChild>
          <Link href="/uk/journeys/adult-dyslexia-work/step/2">
            Next
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
