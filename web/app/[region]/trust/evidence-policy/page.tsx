import { TrustEvidencePolicyPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustEvidencePolicy({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustEvidencePolicyPage region={getRegionFromKey(resolvedParams.region)} />;
}
