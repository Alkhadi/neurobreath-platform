/**
 * Template for Condition Pages
 * Generates routes for condition-specific content with starter journeys
 */

export default {
  generatePage(context) {
    const { slug, title, summary, region } = context;
    const contentImport = slug.replace(/\//g, '-');

    return `import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { content${region.toUpperCase()} as content } from '@/content/condition/${contentImport}.content';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { TrustBlock } from '@/components/trust/TrustBlock';
import { LastReviewed } from '@/components/trust/LastReviewed';
import { CitationsDisclaimer } from '@/components/trust/CitationsDisclaimer';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobreath.co.uk';
  const canonical = \`\${baseUrl}/${region}/${slug}\`;

  return {
    title: content.title,
    description: content.summary,
    alternates: {
      canonical,
      languages: {
        'en-GB': \`\${baseUrl}/uk/${slug}\`,
        'en-US': \`\${baseUrl}/us/${slug}\`,
      },
    },
    openGraph: {
      title: content.title,
      description: content.summary,
      url: canonical,
      siteName: 'NeuroBreath',
      locale: region === 'uk' ? 'en_GB' : 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.summary,
    },
  };
}

export default function ConditionPage() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {content.hero.headline}
        </h1>
        {content.hero.subheadline && (
          <p className="text-xl text-muted-foreground">
            {content.hero.subheadline}
          </p>
        )}
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <Link href="/${region}/get-started">Start Your Journey</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/${region}/tools">Explore Tools</Link>
          </Button>
        </div>
      </section>

      {/* Educational Disclaimer */}
      <TrustBlock variant="educational" />

      {/* Key Information */}
      {content.keyInfo && (
        <section className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">What You Need to Know</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {content.keyInfo.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Starter Journeys */}
      {content.starterJourneys && (
        <section className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Where to Begin</h2>
            <p className="text-xl text-muted-foreground">
              Choose a starting point that fits your situation
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {content.starterJourneys.map((journey) => (
              <Card key={journey.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{journey.title}</CardTitle>
                  <CardDescription>{journey.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <ul className="space-y-2 mb-4">
                    {journey.steps.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary">✓</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={\`/${region}/journeys/\${journey.id}\`}>
                      Start This Journey
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Tools */}
      {content.recommendedTools && (
        <section className="max-w-6xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold">Recommended Tools</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {content.recommendedTools.map((tool) => (
              <Card key={tool.slug}>
                <CardHeader>
                  <CardTitle>{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={\`/${region}/tools/\${tool.slug}\`}>
                      Try Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Citations & Last Reviewed */}
      <section className="max-w-4xl mx-auto space-y-6">
        <CitationsDisclaimer />
        <LastReviewed date={content.lastReviewed || new Date().toISOString()} />
      </section>
    </main>
  );
}
`;
  },

  generateSharedPage(context) {
    const { slug, title } = context;
    const contentImport = slug.replace(/\//g, '-');

    return `import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { contentUK, contentUS } from '@/content/condition/${contentImport}.content';

// Similar to generatePage but uses region from params
// Implementation matches above pattern with dynamic region handling

type Props = {
  params: { region: 'uk' | 'us' };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = params.region === 'uk' ? contentUK : contentUS;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://neurobreath.co.uk';
  const canonical = \`\${baseUrl}/\${params.region}/${slug}\`;

  return {
    title: content.title,
    description: content.summary,
    alternates: {
      canonical,
      languages: {
        'en-GB': \`\${baseUrl}/uk/${slug}\`,
        'en-US': \`\${baseUrl}/us/${slug}\`,
      },
    },
  };
}

export default function ConditionPage({ params }: Props) {
  const content = params.region === 'uk' ? contentUK : contentUS;
  // Render using content
  return <main>{/* Same structure as above */}</main>;
}
`;
  },

  generateContent(context) {
    const { slug, title, summary } = context;

    return `/**
 * Content for ${title}
 * Last updated: ${new Date().toISOString().split('T')[0]}
 */

export const contentUK = {
  title: '${title}',
  summary: '${summary}',
  hero: {
    headline: '${title}',
    subheadline: 'Evidence-based support and practical strategies',
  },
  keyInfo: [
    {
      title: 'What It Is',
      description: 'TODO: Add explanation appropriate for UK audience',
    },
    {
      title: 'Common Signs',
      description: 'TODO: Add common signs and symptoms',
    },
    {
      title: 'How We Can Help',
      description: 'TODO: Add how NeuroBreath supports this',
    },
    {
      title: 'Evidence Base',
      description: 'TODO: Reference NHS and UK research (copy-only)',
    },
  ],
  starterJourneys: [
    {
      id: 'understanding',
      title: 'Understanding the Basics',
      description: 'Learn the fundamentals and what to expect',
      steps: [
        'Learn key concepts',
        'Identify your challenges',
        'Explore coping strategies',
      ],
    },
    {
      id: 'daily-support',
      title: 'Daily Support Strategies',
      description: 'Practical tools for everyday situations',
      steps: [
        'Morning routine setup',
        'Attention management',
        'Evening wind-down',
      ],
    },
    {
      id: 'family-guide',
      title: 'Supporting a Loved One',
      description: 'For family members and carers',
      steps: [
        'Understanding their experience',
        'Communication strategies',
        'Building routines together',
      ],
    },
  ],
  recommendedTools: [
    {
      slug: 'breathing/box-breathing',
      title: 'Box Breathing',
      description: 'Calm your mind and regain focus',
    },
    {
      slug: 'pomodoro',
      title: 'Focus Timer',
      description: 'Structure work with timed intervals',
    },
    {
      slug: 'progress-tracker',
      title: 'Progress Tracker',
      description: 'Monitor your improvements over time',
    },
  ],
  lastReviewed: new Date().toISOString(),
};

export const contentUS = {
  title: '${title}',
  summary: '${summary}',
  hero: {
    headline: '${title}',
    subheadline: 'Evidence-based support and practical strategies',
  },
  keyInfo: [
    {
      title: 'What It Is',
      description: 'TODO: Add explanation appropriate for US audience',
    },
    {
      title: 'Common Signs',
      description: 'TODO: Add common signs and symptoms',
    },
    {
      title: 'How We Can Help',
      description: 'TODO: Add how NeuroBreath supports this',
    },
    {
      title: 'Evidence Base',
      description: 'TODO: Reference CDC/NIH and US research (copy-only)',
    },
  ],
  starterJourneys: contentUK.starterJourneys, // Often same structure
  recommendedTools: contentUK.recommendedTools, // Often same
  lastReviewed: contentUK.lastReviewed,
};
`;
  },
};
