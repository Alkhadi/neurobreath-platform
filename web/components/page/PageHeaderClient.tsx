'use client';

import { PageHeader } from './PageHeader';

/**
 * Client wrapper for PageHeader to use in server components that export metadata
 * 
 * Usage in server components:
 * <PageHeaderClient 
 *   title="Anxiety Hub" 
 *   description="Evidence-based support"
 *   showMetadata 
 * />
 */
export function PageHeaderClient(props: React.ComponentProps<typeof PageHeader>) {
  return <PageHeader {...props} />;
}
