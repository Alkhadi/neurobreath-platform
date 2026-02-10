'use client';

import { useState, useEffect } from 'react';
import { BookmarkIcon, Check } from 'lucide-react';
import { useMyPlanActions } from '@/lib/user-preferences/useMyPlanActions';
import { useAnalytics } from '@/lib/analytics/hooks';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { SavedItemType, Region } from '@/lib/user-preferences/schema';

interface AddToMyPlanButtonProps {
  type: SavedItemType;
  id: string;
  title: string;
  href: string;
  tags?: string[];
  region?: Region;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function AddToMyPlanButton({
  type,
  id,
  title,
  href,
  tags = [],
  region = 'uk',
  variant = 'outline',
  size = 'default',
  className,
  showText = true,
}: AddToMyPlanButtonProps) {
  const { addSavedItem, removeSavedItem, isSaved } = useMyPlanActions();
  const { trackItemSaved, trackItemRemoved } = useAnalytics();
  const [saved, setSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setSaved(isSaved(id));
  }, [id, isSaved]);

  const handleToggle = () => {
    if (saved) {
      removeSavedItem(id);
      setSaved(false);
      trackItemRemoved(type, id);
    } else {
      addSavedItem(type, id, title, href, tags, region);
      setSaved(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      trackItemSaved(type, id, title, tags);
    }
  };

  const buttonText = saved
    ? showText
      ? 'Saved'
      : undefined
    : showText
    ? 'Save to My Plan'
    : undefined;

  const Icon = saved ? Check : BookmarkIcon;

  return (
    <Button
      onClick={handleToggle}
      variant={saved ? 'default' : variant}
      size={size}
      className={cn(
        'transition-all',
        isAnimating && 'scale-105',
        saved && 'bg-green-600 hover:bg-green-700 text-white',
        className
      )}
      aria-label={saved ? 'Remove from My Plan' : 'Add to My Plan'}
      title={saved ? 'Remove from My Plan' : 'Add to My Plan'}
    >
      <Icon
        className={cn(
          'w-4 h-4',
          showText && 'mr-2',
          isAnimating && 'animate-bounce'
        )}
      />
      {buttonText}
    </Button>
  );
}
