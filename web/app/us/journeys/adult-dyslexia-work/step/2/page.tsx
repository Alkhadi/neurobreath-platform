import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia at Work Journey — Step 2: Effective Communication | NeuroBreath',
  description: 'Step 2: Advocate for your needs professionally. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work/step/2',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work/step/2',
      'en-US': 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work/step/2',
    },
  },
};

export default function JourneyStep() {
  const stepNumber = 2;
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
          <h1 className="text-3xl font-bold mb-4">Effective Communication</h1>
          <p className="text-lg text-muted-foreground">Advocate for your needs professionally</p>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Key Actions</h2>
          <ul className="space-y-3">
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Frame requests positively</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Focus on outcomes</span></li>
            <li className="flex gap-3"><span className="text-primary flex-shrink-0">✓</span><span>Suggest specific adjustments</span></li>
          </ul>
        </section>

        <section className="prose dark:prose-invert max-w-none mb-8">
          <p>
            Advocacy is easier when you describe what helps you deliver better outcomes. Consider proposing one small change at a time.
          </p>
          <h3>Use a simple script</h3>
          <p>
            “I do my best work when information is written down. Could we confirm key decisions in a short follow-up note?”
          </p>
          <h3>Bring options</h3>
          <p>
            Suggest 1–3 adjustments you believe would help (e.g., text-to-speech, templates, clearer acceptance criteria, or more time for proofreading).
          </p>
        </section>
      </article>

      <nav className="flex justify-between pt-8 border-t">
        <Button asChild variant="outline">
          <Link href="/us/journeys/adult-dyslexia-work/step/1">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Link>
        </Button>
        <Button asChild>
          <Link href="/us/journeys/adult-dyslexia-work/step/3">
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
