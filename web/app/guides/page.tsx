import Link from 'next/link';
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { listPillars } from '@/lib/content/content-seo-map';

export const metadata: Metadata = generatePageMetadata({
  title: 'Guides | NeuroBreath',
  description:
    'Practical guidance on breathing, focus, sleep and neurodiversity support. Clear next steps and tools. Educational information only.',
  path: '/guides',
});

export default function GuidesIndexPage() {
  const pillars = listPillars();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-neutral-900">Guides</h1>
      <p className="mt-3 max-w-2xl text-neutral-700">
        Practical, UK-English guidance with clear next steps. Educational information only.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pillars.map(pillar => (
          <Link
            key={pillar.key}
            href={`/guides/${pillar.key}`}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md"
          >
            <div className="text-lg font-semibold text-neutral-900">{pillar.title}</div>
            <div className="mt-2 text-sm leading-relaxed text-neutral-700">{pillar.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}