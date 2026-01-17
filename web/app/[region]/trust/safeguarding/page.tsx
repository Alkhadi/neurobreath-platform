import { TrustSafeguardingPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustSafeguarding({ params }: RegionPageProps) {
  return <TrustSafeguardingPage region={getRegionFromKey(params.region)} />;
}
