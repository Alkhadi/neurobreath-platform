import { loadLegacyHtml } from '@/lib/legacy/loadLegacyHtml';
import { Metadata } from 'next';
import Link from 'next/link';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';

interface LegacyHtmlPageProps {
  source: string;
  title: string;
  description?: string;
  showEducationalDisclaimer?: boolean;
  disclaimerLabel?: string;
}

/**
 * Server component that renders a legacy HTML page.
 * The HTML is loaded, sanitized, and rendered within the Next.js layout.
 */
export default async function LegacyHtmlPage({
  source,
  showEducationalDisclaimer = false,
  disclaimerLabel,
}: LegacyHtmlPageProps) {
  try {
    const html = await loadLegacyHtml(source);

    return (
      <div className="legacy-html-page">
        {/* Render the sanitized legacy HTML */}
        <div dangerouslySetInnerHTML={{ __html: html }} />

        {showEducationalDisclaimer ? (
          <div className="mx-auto w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1100px] py-6">
            <EducationalDisclaimerInline contextLabel={disclaimerLabel} />
          </div>
        ) : null}
        
        {/* Add a subtle watermark for debugging */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded opacity-50 pointer-events-none">
            Legacy: {source}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error(`Failed to render legacy page: ${source}`, error);
    
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Content Not Available</h1>
          <p className="text-gray-600 mb-4">
            We're sorry, but the content for this page could not be loaded.
          </p>
          <p className="text-sm text-gray-500">
            Error loading: {source}
          </p>
          <Link href="/" className="mt-6 inline-block text-blue-600 hover:underline">
            ← Return to Home
          </Link>
        </div>
      </main>
    );
  }
}

/**
 * Generate metadata for legacy pages
 */
export function generateLegacyMetadata(
  title: string,
  description?: string
): Metadata {
  return {
    title: `${title} | Neurobreath`,
    description: description || `${title} - Neurobreath Platform`,
  };
}
