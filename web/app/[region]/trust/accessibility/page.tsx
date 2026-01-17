import { TrustAccessibilityPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustAccessibility({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustAccessibilityPage region={getRegionFromKey(resolvedParams.region)} />;
}
