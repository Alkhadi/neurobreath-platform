import { TrustPrivacyPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustPrivacy({ params }: RegionPageProps) {
  return <TrustPrivacyPage region={getRegionFromKey(params.region)} />;
}
