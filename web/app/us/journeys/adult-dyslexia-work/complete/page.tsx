import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dyslexia at Work Journey — Complete | NeuroBreath',
  description: 'You\'ve completed the Dyslexia at Work journey. Review next steps. Educational information only.',
  alternates: {
    canonical: 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work/complete',
    languages: {
      'en-GB': 'https://neurobreath.co.uk/uk/journeys/adult-dyslexia-work/complete',
      'en-US': 'https://neurobreath.co.uk/us/journeys/adult-dyslexia-work/complete',
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
        <h1 className="text-4xl font-bold mb-4">You&apos;re Equipped to Succeed</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          You have strategies and knowledge to thrive in your workplace.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">What&apos;s Next?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Explore More Strategies</CardTitle>
              <CardDescription>Read comprehensive dyslexia guides</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/guides/dyslexia">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Try Assistive Tools</CardTitle>
              <CardDescription>Explore reading and organization tools</CardDescription>
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
              <CardTitle>Trust Center</CardTitle>
              <CardDescription>Read about evidence and standards</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/us/about/trust-centre">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/us/journeys">All journeys</Link>
        </Button>
        <Button asChild className="flex-1">
          <Link href="/us/help-me-choose">Help me choose</Link>
        </Button>
      </div>

      <p className="mt-10 text-xs text-muted-foreground">Educational information only. Not legal advice.</p>
    </div>
  );
}
