import { TrustDisclaimerPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustDisclaimer({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustDisclaimerPage region={getRegionFromKey(resolvedParams.region)} />;
}
