import { TrustTermsPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustTerms({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustTermsPage region={getRegionFromKey(resolvedParams.region)} />;
}
