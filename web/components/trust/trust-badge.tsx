'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Info, Calendar, AlertCircle } from 'lucide-react';
import { getRouteGovernance, type RouteGovernance, type TrustBadgeType } from '@/lib/trust/routeRegistry';
import { formatReviewDate } from '@/lib/trust/reviewRegistry';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface TrustBadgeProps {
  route?: string;  // Optional: if not provided, uses current pathname
  variant?: 'inline' | 'block';
  showDetails?: boolean;
}

/**
 * Automatic Trust Badge Component
 * 
 * Reads route governance from routeRegistry.ts and renders appropriate badges.
 * If route is missing from registry, shows fallback Educational-only badge and logs warning.
 */
export function TrustBadge({ route, variant = 'inline', showDetails = false }: TrustBadgeProps) {
  const pathname = usePathname();
  const targetRoute = route || pathname;
  
  const governance = getRouteGovernance(targetRoute);

  // Log warning if route is missing (will fail CI)
  useEffect(() => {
    if (!governance) {
      console.warn(`[TrustBadge] Route "${targetRoute}" not found in routeRegistry.ts. Showing fallback badge. Add this route to maintain trust governance.`);
    }
  }, [governance, targetRoute]);

  // Fallback for missing routes
  if (!governance) {
    return <FallbackBadge variant={variant} />;
  }

  if (variant === 'block') {
    return <TrustBadgeBlock governance={governance} showDetails={showDetails} />;
  }

  return <TrustBadgeInline governance={governance} />;
}

/**
 * Fallback badge for routes not in registry
 */
function FallbackBadge({ variant }: { variant: 'inline' | 'block' }) {
  if (variant === 'block') {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Educational Content Only
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
              This content is for educational purposes only. Always consult your GP or qualified healthcare professional for diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
      <Info className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
      Educational only
    </Badge>
  );
}

/**
 * Get icon for badge type
 */
function getBadgeIcon(badgeType: TrustBadgeType) {
  switch (badgeType) {
    case 'Evidence-linked':
      return CheckCircle;
    case 'Reviewed':
      return Shield;
    case 'Educational-only':
      return Info;
    case 'NICE-aligned':
      return CheckCircle;
    case 'Community-informed':
      return CheckCircle;
    default:
      return Info;
  }
}

/**
 * Get badge styling
 */
function getBadgeStyle(badgeType: TrustBadgeType) {
  switch (badgeType) {
    case 'Evidence-linked':
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
    case 'Reviewed':
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
    case 'Educational-only':
      return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300';
    case 'NICE-aligned':
      return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300';
    case 'Community-informed':
      return 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300';
    default:
      return 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
  }
}

function TrustBadgeInline({ governance }: { governance: RouteGovernance }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {governance.badges.map((badgeType) => {
        const Icon = getBadgeIcon(badgeType);
        const style = getBadgeStyle(badgeType);
        
        // Special handling for "Reviewed" badge to show date
        if (badgeType === 'Reviewed') {
          return (
            <Badge key={badgeType} variant="outline" className={style}>
              <Icon className="h-3 w-3 mr-1" />
              Reviewed {formatReviewDate(governance.lastReviewed)}
            </Badge>
          );
        }
        
        return (
          <Badge key={badgeType} variant="outline" className={style}>
            <Icon className="h-3 w-3 mr-1" />
            {badgeType}
          </Badge>
        );
      })}
    </div>
  );
}

function TrustBadgeBlock({ governance, showDetails }: { governance: RouteGovernance; showDetails: boolean }) {
  const hasEvidenceLinked = governance.badges.includes('Evidence-linked');
  const hasReviewed = governance.badges.includes('Reviewed');
  
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            {hasEvidenceLinked ? 'Evidence-Based Content' : 'Educational Content'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {hasEvidenceLinked && hasReviewed && 
              'This content has been reviewed by qualified professionals and is backed by authoritative sources.'
            }
            {hasEvidenceLinked && !hasReviewed && 
              'This content is backed by authoritative sources.'
            }
            {!hasEvidenceLinked && 
              'This content is for educational purposes only.'
            }
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {governance.badges.map((badgeType) => {
          const Icon = getBadgeIcon(badgeType);
          const style = getBadgeStyle(badgeType);
          
          return (
            <Badge key={badgeType} variant="outline" className={style}>
              <Icon className="h-3 w-3 mr-1" />
              {badgeType}
            </Badge>
          );
        })}
      </div>

      {showDetails && hasReviewed && (
        <div className="space-y-2 text-sm border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Last reviewed:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100 font-medium">
                {formatReviewDate(governance.lastReviewed)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Reviewed by:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100">
                {governance.reviewedBy}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Next review:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100">
                {formatReviewDate(governance.nextReview)}
              </span>
            </div>
          </div>

          {governance.evidenceRequirement === 'TierARequired' && (
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
              <div>
                <span className="text-slate-600 dark:text-slate-400">Evidence standard:</span>
                <span className="ml-2 text-slate-900 dark:text-slate-100">
                  Tier A (Clinical guidelines)
                </span>
              </div>
            </div>
          )}

          {governance.primarySources.length > 0 && (
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <span className="text-slate-600 dark:text-slate-400">Primary sources:</span>
                <span className="ml-2 text-slate-900 dark:text-slate-100">
                  {governance.primarySources.join(', ').toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
        <Info className="h-3 w-3 inline mr-1" />
        This is educational content only. Always consult your GP or qualified healthcare professional for diagnosis and treatment.
      </div>
    </div>
  );
}

/**
 * Mini trust badge for use in cards or compact spaces
 */
export function TrustBadgeMini({ route }: { route?: string }) {
  const pathname = usePathname();
  const targetRoute = route || pathname;
  const governance = getRouteGovernance(targetRoute);

  if (!governance) {
    return (
      <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
        <Info className="h-3 w-3" />
        <span>Educational only</span>
      </div>
    );
  }

  const hasReviewed = governance.badges.includes('Reviewed');
  const hasEvidenceLinked = governance.badges.includes('Evidence-linked');

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
      <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
      {hasReviewed && <span>Reviewed {formatReviewDate(governance.lastReviewed)}</span>}
      {hasEvidenceLinked && (
        <span className={cn(
          "px-1.5 py-0.5 rounded text-xs font-medium",
          governance.evidenceRequirement === 'TierARequired' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
          governance.evidenceRequirement === 'TierAorB' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
          governance.evidenceRequirement === 'Informational' && "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
        )}>
          {governance.evidenceRequirement === 'TierARequired' && 'Tier A'}
          {governance.evidenceRequirement === 'TierAorB' && 'Tier A/B'}
          {governance.evidenceRequirement === 'Informational' && 'Info'}
        </span>
      )}
    </div>
  );
}
