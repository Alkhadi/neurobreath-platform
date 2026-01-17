import { TrustEvidencePolicyPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustEvidencePolicy({ params }: RegionPageProps) {
  return <TrustEvidencePolicyPage region={getRegionFromKey(params.region)} />;
}
