import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Journey Complete - Journey Complete | NeuroBreath',
  description: 'You\'ve taken important first steps',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/new-to-adhd/complete',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/new-to-adhd/complete',
      'en-US': 'https://neurobreath.co.uk/us/journeys/new-to-adhd/complete',
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function JourneyComplete() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Success Message */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Journey Complete</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You\'ve taken important first steps
        </p>
      </div>

      {/* Next Steps */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">What&apos;s Next?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Explore Tools</CardTitle>
              <CardDescription>Try practical tools</CardDescription>
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
              <CardTitle>Read Guides</CardTitle>
              <CardDescription>Deepen your understanding</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/guides">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Get Help</CardTitle>
              <CardDescription>Find personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/help-me-choose">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Journey Recap */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Journey Recap</CardTitle>
          <CardDescription>You completed all 3 steps</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>First Steps</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Building Understanding</span>
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Moving Forward</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link href="/us/journeys">
            Explore More Journeys
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/us">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
