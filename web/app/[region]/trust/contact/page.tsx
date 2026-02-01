import type { Metadata } from 'next';
import { TrustContactPage } from '@/components/trust/pages/trust-pages';
import { getRegionAlternates, getRegionFromKey, getRegionKey } from '@/lib/region/region';
import { generateCanonicalUrl } from '@/lib/seo/site-seo';
import { generatePageMetadata } from '@/lib/seo/metadata';

import styles from './trust-contact-iphone.module.css';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const resolved = await params;
  const region = getRegionFromKey(resolved.region);
  const regionKey = getRegionKey(region);
  const path = `/${regionKey}/trust/contact`;
  const alternates = getRegionAlternates('/trust/contact');

  const baseMetadata = generatePageMetadata({
    title: 'Contact & report concerns',
    description: 'Contact NeuroBreath for support, feedback, or to report safeguarding and content concerns.',
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

export default async function RegionTrustContact({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return (
    <div className={styles.wallpaper}>
      <div className={styles.center}>
        <div className={styles.deviceFrame}>
          <div className={styles.notch} aria-hidden="true" />
          <div className={styles.deviceScroll}>
            <TrustContactPage region={getRegionFromKey(resolvedParams.region)} />
          </div>
        </div>
      </div>
    </div>
  );
}
