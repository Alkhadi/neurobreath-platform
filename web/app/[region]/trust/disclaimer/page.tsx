import { TrustDisclaimerPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustDisclaimer({ params }: RegionPageProps) {
  return <TrustDisclaimerPage region={getRegionFromKey(params.region)} />;
}
