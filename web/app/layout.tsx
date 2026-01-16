import './globals.css';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { BreathingSessionProvider } from '@/contexts/BreathingSessionContext';
import { PageBuddy } from '@/components/page-buddy';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { JsonLd } from '@/components/seo/json-ld';
import { generateOrganizationSchema, generateWebSiteSchema, generateWebPageSchema, generateBreadcrumbsFromPath, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { SITE_CONFIG, generateCanonicalUrl } from '@/lib/seo/site-seo';
import { getRouteMetadata, getRouteSeoConfig } from '@/lib/seo/route-metadata';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export async function generateMetadata(): Promise<Metadata> {
  const pathname = headers().get('x-pathname') || '/';
  return getRouteMetadata(pathname);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = headers().get('x-pathname') || '/';
  const seoConfig = getRouteSeoConfig(pathname);

  // Generate global structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();
  const pageUrl = generateCanonicalUrl(pathname);
  const pageImage = (seoConfig?.image || SITE_CONFIG.defaultOGImage);
  const pageImageUrl = pageImage.startsWith('http') ? pageImage : `${SITE_CONFIG.canonicalBase}${pageImage}`;
  const webPageSchema = seoConfig
    ? generateWebPageSchema({
        url: pageUrl,
        name: seoConfig.title,
        description: seoConfig.description,
        image: pageImageUrl,
      })
    : null;
  const breadcrumbSchema = generateBreadcrumbSchema(generateBreadcrumbsFromPath(pathname));
  const schemaGraph = webPageSchema
    ? [organizationSchema, websiteSchema, webPageSchema, breadcrumbSchema]
    : [organizationSchema, websiteSchema, breadcrumbSchema];

  return (
    <html lang="en-GB" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <JsonLd data={schemaGraph} />
      </head>
      <body className={`${inter.className} antialiased overflow-x-hidden`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <BreathingSessionProvider>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <PageBuddy />
          </BreathingSessionProvider>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
