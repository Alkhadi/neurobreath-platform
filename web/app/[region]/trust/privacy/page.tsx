import { TrustPrivacyPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustPrivacy({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustPrivacyPage region={getRegionFromKey(resolvedParams.region)} />;
}
