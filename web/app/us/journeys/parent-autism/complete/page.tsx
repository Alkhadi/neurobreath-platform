import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Supporting Your Autistic Child Journey — Complete | NeuroBreath',
  description: 'You\'ve completed the Supporting Your Autistic Child journey. Review next steps. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/parent-autism/complete',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/parent-autism/complete',
      'en-US': 'https://neurobreath.co.uk/us/journeys/parent-autism/complete',
    },
  },
  robots: { index: true, follow: true },
};

export default function JourneyComplete() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">You&apos;re Building Great Foundations</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You&apos;ve taken important steps in supporting your child&apos;s unique needs.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">What&apos;s Next?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Explore Resources</CardTitle>
              <CardDescription>Access comprehensive autism resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/conditions/autism">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Try Tools</CardTitle>
              <CardDescription>Explore sensory and regulation tools</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/tools">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>About NeuroBreath</CardTitle>
              <CardDescription>Learn how NeuroBreath works</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/about">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Journey Recap</CardTitle>
          <CardDescription>You completed all 4 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" /><span>Understanding Autism</span></li>
            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" /><span>Creating Supportive Environments</span></li>
            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" /><span>Communication Strategies</span></li>
            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" /><span>Building Long‑Term Support</span></li>
          </ol>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/us/journeys">All journeys</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/us/help-me-choose">Help me choose</Link>
        </Button>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">Educational information only. Not medical advice.</p>
    </div>
  );
}
