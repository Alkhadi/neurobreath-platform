import { TrustHubPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustPage({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustHubPage region={getRegionFromKey(resolvedParams.region)} />;
}
