import { TrustAccessibilityPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: { region: string };
}

export default function RegionTrustAccessibility({ params }: RegionPageProps) {
  return <TrustAccessibilityPage region={getRegionFromKey(params.region)} />;
}
