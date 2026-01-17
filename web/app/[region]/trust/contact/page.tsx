import { TrustContactPage } from '@/components/trust/pages/trust-pages';
import { getRegionFromKey } from '@/lib/region/region';

interface RegionPageProps {
  params: Promise<{ region: string }>;
}

export default async function RegionTrustContact({ params }: RegionPageProps) {
  const resolvedParams = await params;
  return <TrustContactPage region={getRegionFromKey(resolvedParams.region)} />;
}
