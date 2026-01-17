import { TrustSafeguardingPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustSafeguarding({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustSafeguardingPage region={getRegionFromKey(resolvedParams.region)} />;
}
