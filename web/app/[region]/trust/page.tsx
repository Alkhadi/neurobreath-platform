import { TrustHubPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustPage({ params }: RegionPageProps) {
  return <TrustHubPage region={getRegionFromKey(params.region)} />;
}
