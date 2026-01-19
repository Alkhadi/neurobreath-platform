import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Info, Calendar } from 'lucide-react';
import { getReviewMetadata, formatReviewDate, type ReviewMetadata } from '@/lib/trust/reviewRegistry';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  route: string;
  variant?: 'inline' | 'block';
  showDetails?: boolean;
}

export function TrustBadge({ route, variant = 'inline', showDetails = false }: TrustBadgeProps) {
  const review = getReviewMetadata(route);

  if (!review) {
    return null;
  }

  if (variant === 'block') {
    return <TrustBadgeBlock review={review} showDetails={showDetails} />;
  }

  return <TrustBadgeInline review={review} />;
}

function TrustBadgeInline({ review }: { review: ReviewMetadata }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CheckCircle className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
        Evidence-linked
      </Badge>
      
      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Shield className="h-3 w-3 mr-1 text-blue-600 dark:text-blue-400" />
        Reviewed {formatReviewDate(review.lastReviewed)}
      </Badge>
      
      <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <Info className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
        Educational only
      </Badge>
    </div>
  );
}

function TrustBadgeBlock({ review, showDetails }: { review: ReviewMetadata; showDetails: boolean }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
      <div className="flex items-start gap-3 mb-4">
        <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
            Evidence-Based Content
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            This content has been reviewed by qualified professionals and is backed by authoritative sources.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-3 w-3 mr-1 text-green-600 dark:text-green-400" />
          Evidence Tier {review.evidenceTier}
        </Badge>
        
        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <Info className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400" />
          Educational only
        </Badge>
      </div>

      {showDetails && (
        <div className="space-y-2 text-sm border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Last reviewed:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100 font-medium">
                {formatReviewDate(review.lastReviewed)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Reviewed by:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100">
                {review.reviewedBy}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Next review:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100">
                {formatReviewDate(review.nextReview)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <span className="text-slate-600 dark:text-slate-400">Version:</span>
              <span className="ml-2 text-slate-900 dark:text-slate-100">
                {review.version}
              </span>
            </div>
          </div>
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
export function TrustBadgeMini({ route }: { route: string }) {
  const review = getReviewMetadata(route);

  if (!review) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
      <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
      <span>Reviewed {formatReviewDate(review.lastReviewed)}</span>
      <span className={cn(
        "px-1.5 py-0.5 rounded text-xs font-medium",
        review.evidenceTier === 'A' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
        review.evidenceTier === 'B' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
        review.evidenceTier === 'Mixed' && "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
      )}>
        Tier {review.evidenceTier}
      </span>
    </div>
  );
}
