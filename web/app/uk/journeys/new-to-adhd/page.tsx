import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New to ADHD Journey | NeuroBreath',
  description: 'A guided introduction to ADHD with safe, practical next steps. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/uk/journeys/new-to-adhd',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/new-to-adhd',
      'en-US': 'https://neurobreath.co.uk/us/journeys/new-to-adhd',
    },
  },
  openGraph: {
    title: 'New to ADHD Journey | NeuroBreath',
    description: 'A guided introduction to ADHD with safe, practical next steps. Educational information only.',
    url: 'https://neurobreath.co.uk/uk/journeys/new-to-adhd',
    type: 'website',
  },
};

export default function JourneyLanding() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Journey: new-to-adhd</h1>
        <p className="text-xl text-muted-foreground mb-6">
          A guided journey for new-to-adhd
        </p>
        
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>~20 minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>For: adult</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>3 steps</span>
          </div>
        </div>
      </header>

      {/* Journey Steps Overview */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">What You&apos;ll Learn</h2>
        <ol className="space-y-3">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              1
            </span>
            <div>
              <h3 className="font-medium">First Steps</h3>
              <p className="text-sm text-muted-foreground">Begin your journey</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              2
            </span>
            <div>
              <h3 className="font-medium">Building Understanding</h3>
              <p className="text-sm text-muted-foreground">Deepen your knowledge</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              3
            </span>
            <div>
              <h3 className="font-medium">Moving Forward</h3>
              <p className="text-sm text-muted-foreground">Plan for continued growth</p>
            </div>
          </li>
        </ol>
      </section>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button asChild size="lg" className="flex-1">
          <Link href="/uk/journeys/new-to-adhd/step/1">
            Start Journey
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="flex-1">
          <Link href="/uk/help-me-choose">
            Help Me Choose
          </Link>
        </Button>
      </div>

      {/* Trust Block */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Educational Resource</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This journey provides educational information only and is not a substitute for 
            professional medical advice, diagnosis, or treatment. Always seek guidance from 
            qualified healthcare providers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
