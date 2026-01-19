'use client';

import { TrustBadge } from '@/components/trust/trust-badge';
import { getRouteGovernance } from '@/lib/trust/routeRegistry';
import { usePathname } from 'next/navigation';
import { formatReviewDate } from '@/lib/trust/reviewRegistry';
import { Shield, Calendar } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  showMetadata?: boolean;  // Show "Last reviewed" and "Primary sources"
  variant?: 'default' | 'compact';  // Compact for tools/cards
}

/**
 * Shared page header component with integrated trust governance
 * 
 * Usage:
 * <PageHeader 
 *   title="ADHD Hub" 
 *   description="Evidence-based support for ADHD"
 *   showMetadata 
 * />
 */
export function PageHeader({ 
  title, 
  description, 
  showMetadata = false,
  variant = 'default' 
}: PageHeaderProps) {
  const pathname = usePathname();
  const governance = getRouteGovernance(pathname);

  return (
    <header className="space-y-6 mb-8">
      {/* Title and description */}
      <div className="space-y-2">
        <h1 className={variant === 'compact' ? 'text-2xl font-bold' : 'text-3xl md:text-4xl font-bold'}>
          {title}
        </h1>
        {description && (
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {description}
          </p>
        )}
      </div>

      {/* Trust badge */}
      <TrustBadge variant="block" showDetails={variant === 'default'} />

      {/* Optional metadata (Last reviewed, Primary sources) */}
      {showMetadata && governance && governance.badges.includes('Reviewed') && (
        <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              <strong>Last reviewed:</strong> {formatReviewDate(governance.lastReviewed)}
            </span>
          </div>
          
          {governance.primarySources.length > 0 && (
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>
                <strong>Primary sources:</strong> {governance.primarySources.map(s => s.toUpperCase()).join(', ')}
              </span>
            </div>
          )}

          {governance.reviewedBy && (
            <div className="flex items-center gap-2">
              <span>
                <strong>Reviewed by:</strong> {governance.reviewedBy}
              </span>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

/**
 * Compact header variant for tool pages and cards
 */
export function PageHeaderCompact({ title, description }: { title: string; description?: string }) {
  return <PageHeader title={title} description={description} variant="compact" />;
}
