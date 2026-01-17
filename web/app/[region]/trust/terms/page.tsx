import { TrustTermsPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustTerms({ params }: RegionPageProps) {
  return <TrustTermsPage region={getRegionFromKey(params.region)} />;
}
