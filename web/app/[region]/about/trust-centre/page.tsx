import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

type PageProps = {
  params: Promise<{ region: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/about/trust-centre`;
  const alternates = getRegionAlternates('/about/trust-centre');

  const baseMetadata = generatePageMetadata({
    title: 'Trust Centre',
    description: 'How NeuroBreath handles privacy, evidence, and safety. Educational information only.',
    path,
  });

  return {
    ...baseMetadata,
    alternates: {
      canonical: generateCanonicalUrl(path),
      languages: {
        'en-GB': generateCanonicalUrl(alternates['en-GB']),
        'en-US': generateCanonicalUrl(alternates['en-US']),
      },
    },
  };
}

export default async function TrustCentrePage({ params }: PageProps) {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);

  if (!['uk', 'us'].includes(regionKey)) return notFound();

  const links = [
    {
      title: 'Evidence policy',
      description: 'How we choose and summarise evidence.',
      href: `/${regionKey}/trust/evidence-policy`,
    },
    {
      title: 'Editorial standards',
      description: 'How we write, review, and update content.',
      href: `/${regionKey}/trust/editorial-standards`,
    },
    {
      title: 'Editorial policy',
      description: 'Our editorial principles and safety approach.',
      href: `/${regionKey}/trust/editorial-policy`,
    },
    {
      title: 'Citations',
      description: 'How citations are used across the site.',
      href: `/${regionKey}/trust/citations`,
    },
    {
      title: 'Privacy',
      description: 'How we handle personal data.',
      href: `/${regionKey}/trust/privacy`,
    },
    {
      title: 'Terms',
      description: 'Terms of service and usage.',
      href: `/${regionKey}/trust/terms`,
    },
    {
      title: 'Disclaimer',
      description: 'Educational info only; not medical advice.',
      href: `/${regionKey}/trust/disclaimer`,
    },
    {
      title: 'Safeguarding',
      description: 'How we think about harm prevention and escalation.',
      href: `/${regionKey}/trust/safeguarding`,
    },
    {
      title: 'Contact',
      description: 'Reach the NeuroBreath team.',
      href: `/${regionKey}/trust/contact`,
    },
  ];

  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Trust Centre</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          NeuroBreath is educational. This hub explains how we approach safety, evidence, and privacy.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link href={`/${regionKey}/about`}>About</Link>
          </Button>
          <Button asChild>
            <Link href={`/${regionKey}/trust/evidence-policy`}>Start with evidence</Link>
          </Button>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-2">
        {links.map((item) => (
          <Card key={item.href} className="hover:shadow-sm transition-shadow">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={item.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      <p className="mt-10 text-xs text-muted-foreground">
        Educational information only. Not medical advice. If you’re in immediate danger, call your local emergency
        number.
      </p>
    </main>
  );
}
