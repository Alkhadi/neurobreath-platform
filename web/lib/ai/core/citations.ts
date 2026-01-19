/**
 * Unified AI Core - Citation Formatting
 * 
 * Formats evidence citations consistently across Buddy, Coach, and Blog.
 */

import { getSourceById, validateSourceUrl } from '@/lib/evidence/sourceRegistry';

export interface Citation {
  id: string;
  title: string;
  url: string;
  sourceId: string; // Maps to sourceRegistry
  sourceLabel?: string; // e.g., "NHS", "NICE", "PubMed"
  updatedAt?: string; // ISO date string
  accessedAt?: string; // ISO date string
  isExternal: boolean;
  excerpt?: string; // Short quote or summary
}

export interface CitationGroup {
  clinical: Citation[]; // Tier A: NHS, NICE, clinical guidelines
  research: Citation[]; // Tier A: PubMed, Cochrane
  support: Citation[]; // Tier B: Charities, support orgs
}

/**
 * Create a citation object from a source and URL
 */
export function createCitation(options: {
  title: string;
  url: string;
  sourceId: string;
  updatedAt?: string;
  excerpt?: string;
}): Citation | null {
  const { title, url, sourceId, updatedAt, excerpt } = options;

  const source = getSourceById(sourceId);
  if (!source) {
    console.warn(`[Citations] Unknown source ID: ${sourceId}`);
    return null;
  }

  // Validate URL against source allowlist
  if (!validateSourceUrl(url, sourceId)) {
    console.warn(`[Citations] URL does not match source ${sourceId}: ${url}`);
    return null;
  }

  return {
    id: `${sourceId}-${Date.now()}`,
    title,
    url,
    sourceId,
    sourceLabel: source.shortName,
    updatedAt,
    accessedAt: new Date().toISOString(),
    isExternal: true,
    excerpt,
  };
}

/**
 * Group citations by type
 */
export function groupCitations(citations: Citation[]): CitationGroup {
  const clinical: Citation[] = [];
  const research: Citation[] = [];
  const support: Citation[] = [];

  citations.forEach((citation) => {
    const source = getSourceById(citation.sourceId);
    if (!source) return;

    if (source.tier === 'A') {
      if (source.citationFormat.type === 'research' || source.citationFormat.type === 'journal') {
        research.push(citation);
      } else {
        clinical.push(citation);
      }
    } else if (source.tier === 'B') {
      support.push(citation);
    }
  });

  return { clinical, research, support };
}

/**
 * Format a single citation as markdown
 */
export function formatCitation(citation: Citation, format: 'markdown' | 'plain' = 'markdown'): string {
  const source = getSourceById(citation.sourceId);
  const sourceLabel = citation.sourceLabel || source?.shortName || 'Source';

  if (format === 'markdown') {
    let formatted = `[${citation.title}](${citation.url})`;
    formatted += ` - *${sourceLabel}*`;
    if (citation.updatedAt) {
      const date = new Date(citation.updatedAt);
      formatted += ` (${date.getFullYear()})`;
    }
    return formatted;
  }

  // Plain text format
  let formatted = `${citation.title} (${sourceLabel})`;
  if (citation.updatedAt) {
    const date = new Date(citation.updatedAt);
    formatted += ` ${date.getFullYear()}`;
  }
  formatted += ` - ${citation.url}`;
  return formatted;
}

/**
 * Format citation group as markdown section
 */
export function formatCitationGroup(group: CitationGroup): string {
  let output = '';

  if (group.clinical.length > 0) {
    output += '### Clinical Guidelines\n\n';
    group.clinical.forEach((citation) => {
      output += `• ${formatCitation(citation)}\n`;
    });
    output += '\n';
  }

  if (group.research.length > 0) {
    output += '### Research Evidence\n\n';
    group.research.forEach((citation) => {
      output += `• ${formatCitation(citation)}\n`;
    });
    output += '\n';
  }

  if (group.support.length > 0) {
    output += '### Support & Information\n\n';
    group.support.forEach((citation) => {
      output += `• ${formatCitation(citation, 'markdown')} *(support organization)*\n`;
    });
    output += '\n';
  }

  return output.trim();
}

/**
 * Create citation from NHS page
 */
export function createNHSCitation(title: string, url: string, updatedAt?: string): Citation | null {
  return createCitation({ title, url, sourceId: 'nhs', updatedAt });
}

/**
 * Create citation from NICE guidance
 */
export function createNICECitation(title: string, url: string, updatedAt?: string): Citation | null {
  return createCitation({ title, url, sourceId: 'nice', updatedAt });
}

/**
 * Create citation from PubMed article
 */
export function createPubMedCitation(
  title: string,
  url: string,
  year?: number,
  excerpt?: string
): Citation | null {
  const updatedAt = year ? `${year}-01-01` : undefined;
  return createCitation({ title, url, sourceId: 'pubmed', updatedAt, excerpt });
}

/**
 * Validate citation structure
 */
export function validateCitation(citation: Citation): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!citation.title || citation.title.trim().length < 5) {
    errors.push('Citation title is missing or too short');
  }

  if (!citation.url || !citation.url.startsWith('http')) {
    errors.push('Citation URL is missing or invalid');
  }

  if (!citation.sourceId) {
    errors.push('Citation sourceId is missing');
  } else {
    const source = getSourceById(citation.sourceId);
    if (!source) {
      errors.push(`Unknown source ID: ${citation.sourceId}`);
    } else if (!validateSourceUrl(citation.url, citation.sourceId)) {
      errors.push(`URL does not match source ${citation.sourceId}: ${citation.url}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Deduplicate citations by URL
 */
export function deduplicateCitations(citations: Citation[]): Citation[] {
  const seen = new Set<string>();
  return citations.filter((citation) => {
    if (seen.has(citation.url)) {
      return false;
    }
    seen.add(citation.url);
    return true;
  });
}
