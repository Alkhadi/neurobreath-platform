'use client';

import { AddToMyPlanButton } from '@/components/my-plan/AddToMyPlanButton';
import type { Region } from '@/lib/user-preferences/schema';

interface GuidePageActionsProps {
  pillar: string;
  slug: string;
  title: string;
  tags?: string[];
  region?: Region;
}

/**
 * Client component wrapping AddToMyPlanButton for guide pages
 * Isolates client-side logic from server components
 */
export function GuidePageActions({ pillar, slug, title, tags = [], region = 'uk' }: GuidePageActionsProps) {
  const guideId = `guide-${pillar}-${slug}`;
  const href = `/guides/${pillar}/${slug}`;

  return (
    <div className="flex items-center gap-3">
      <AddToMyPlanButton
        type="guide"
        id={guideId}
        title={title}
        href={href}
        tags={[pillar, ...tags]}
        region={region}
        variant="outline"
        size="default"
        showText={true}
      />
    </div>
  );
}
