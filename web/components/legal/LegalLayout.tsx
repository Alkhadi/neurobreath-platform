import { ReactNode } from 'react';
import { LegalNav } from './LegalNav';
import { LastUpdated } from './LastUpdated';

interface LegalLayoutProps {
  children: ReactNode;
  region: 'uk' | 'us';
  currentPage?: 'privacy' | 'terms' | 'cookies' | 'disclaimer' | 'accessibility' | 'data-rights' | 'privacy-rights';
  lastUpdated: string;
  title: string;
  description?: string;
}

export function LegalLayout({
  children,
  region,
  currentPage,
  lastUpdated,
  title,
  description,
}: LegalLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <LegalNav region={region} currentPage={currentPage} />
      
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <header className="mb-8 not-prose">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
              {description}
            </p>
          )}
          <LastUpdated date={lastUpdated} />
        </header>
        
        {children}
        
        <footer className="mt-12 pt-8 border-t not-prose">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Questions or concerns? Contact us at{' '}
            <a 
              href="mailto:privacy@neurobreath.co.uk" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              privacy@neurobreath.co.uk
            </a>
          </p>
        </footer>
      </article>
    </div>
  );
}
