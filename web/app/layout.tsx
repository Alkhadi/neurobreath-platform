import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { BreathingSessionProvider } from '@/contexts/BreathingSessionContext';
import { PageBuddy } from '@/components/page-buddy';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/components/ui/sonner';
import { JsonLd } from '@/components/seo/json-ld';
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/seo/schema';
import { DEFAULT_METADATA } from '@/lib/seo/site-seo';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Use centralized metadata configuration
export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Generate global structured data
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en-GB" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <JsonLd data={[organizationSchema, websiteSchema]} />
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
