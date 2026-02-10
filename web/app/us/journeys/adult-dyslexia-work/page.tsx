import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia at Work Journey | NeuroBreath',
  description: 'A guided journey to navigate workplace challenges with dyslexia. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work',
      'en-US': 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work',
    },
  },
  openGraph: {
    title: 'Dyslexia at Work Journey | NeuroBreath',
    description: 'A guided journey to navigate workplace challenges with dyslexia. Educational information only.',
    url: 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work',
    type: 'website',
  },
};

export default function JourneyLanding() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Dyslexia at Work: Thriving Professionally</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Practical steps to advocate for yourself and build a sustainable way of working
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~20 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>For: adult, workplace</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>3 steps</span>
          </div>
        </div>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What You&apos;ll Learn</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">1</span>
            <div>
              <h3 className="font-medium">Understanding Your Rights</h3>
              <p className="text-sm text-muted-foreground">Workplace protections and reasonable adjustments</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">2</span>
            <div>
              <h3 className="font-medium">Effective Communication</h3>
              <p className="text-sm text-muted-foreground">Advocate for your needs professionally</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">3</span>
            <div>
              <h3 className="font-medium">Tools and Strategies</h3>
              <p className="text-sm text-muted-foreground">Use technology and systems to support your work</p>
            </div>
          </li>
        </ol>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="flex-1">
          <Link href="/us/journeys/adult-dyslexia-work/step/1">Start Journey</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/us/help-me-choose">Help Me Choose</Link>
        </Button>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Educational information only.</strong> Not legal advice or HR guidance. Consider local laws and policies, and consult qualified professionals for your situation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
