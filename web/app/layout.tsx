import './globals.css';
import '../styles/print.css';
import { headers } from 'next/headers';
import type { Metadata, Viewport } from 'next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ThemeProvider } from '@/components/theme-provider';
import { BreathingSessionProvider } from '@/contexts/BreathingSessionContext';
import { UserPreferencesProvider } from '@/components/user-preferences/UserPreferencesProvider';
import { PageBuddy } from '@/components/page-buddy';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner';
import { CookieSettingsButton } from '@/components/consent/CookieSettingsButton';
import { Toaster } from '@/components/ui/sonner';
import { JsonLd } from '@/components/seo/json-ld';
import { generateOrganizationSchema, generateWebSiteSchema, generateWebPageSchema, generateBreadcrumbsFromPath, generateBreadcrumbSchema } from '@/lib/seo/schema';
import { SITE_CONFIG, generateCanonicalUrl } from '@/lib/seo/site-seo';
import { getRouteMetadata, getRouteSeoConfig } from '@/lib/seo/route-metadata';
import { getLocaleForRegion, getRegionFromPath } from '@/lib/region/region';
import { ServiceWorkerRegistrar } from '@/components/pwa/ServiceWorkerRegistrar';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: SITE_CONFIG.themeColor,
};

export async function generateMetadata(): Promise<Metadata> {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') || '/';
  return getRouteMetadata(pathname);
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const hdrs = await headers();
  const pathname = hdrs.get('x-pathname') || '/';
  const disablePageBuddy =
    pathname === '/uk/login' ||
    pathname === '/uk/register' ||
    pathname === '/us/login' ||
    pathname === '/us/register';
  const region = getRegionFromPath(pathname);
  const { language } = getLocaleForRegion(region);
  const seoConfig = getRouteSeoConfig(pathname);

  // Generate global structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema(language);
  const pageUrl = generateCanonicalUrl(pathname);
  const pageImage = (seoConfig?.image || SITE_CONFIG.defaultOGImage);
  const pageImageUrl = pageImage.startsWith('http') ? pageImage : `${SITE_CONFIG.canonicalBase}${pageImage}`;
  const webPageSchema = generateWebPageSchema({
    url: pageUrl,
    name: seoConfig?.title || SITE_CONFIG.defaultTitle,
    description: seoConfig?.description || SITE_CONFIG.defaultDescription,
    image: pageImageUrl,
    languageOverride: language,
  });
  const breadcrumbSchema = generateBreadcrumbSchema(generateBreadcrumbsFromPath(pathname));
  const schemaGraph = [organizationSchema, websiteSchema, webPageSchema, breadcrumbSchema];

  return (
    <html lang={language} suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <JsonLd data={schemaGraph} />
      </head>
      <body className="font-sans antialiased overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserPreferencesProvider>
            <BreathingSessionProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              {!disablePageBuddy && <PageBuddy />}
              <CookieConsentBanner />
              <CookieSettingsButton />
            </BreathingSessionProvider>
          </UserPreferencesProvider>
          <Toaster position="top-right" />
          <SpeedInsights />
          <ServiceWorkerRegistrar />
        </ThemeProvider>
      </body>
    </html>
  );
}
