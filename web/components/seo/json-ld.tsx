/**
 * JSON-LD Component
 * 
 * Client-safe component for injecting structured data into pages
 */

import Script from 'next/script';
import type { WithContext } from 'schema-dts';

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: WithContext<any> | WithContext<any>[];
}

/**
 * Component to render JSON-LD structured data
 * Use this in any page or layout to inject structured data
 */
export function JsonLd({ data }: JsonLdProps) {
  const jsonString = Array.isArray(data)
    ? JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': data.map(item => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { '@context': _, ...rest } = item;
          return rest;
        }),
      })
    : JSON.stringify(data);

  return (
    <Script
      id={`json-ld-${Array.isArray(data) ? 'combined' : data['@type']}`}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}

/**
 * Helper hook to check if client-side rendering
 */
export function useIsClient() {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}

import React from 'react';

// Export for convenience
export { type WithContext } from 'schema-dts';
