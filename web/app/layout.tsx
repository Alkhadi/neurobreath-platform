import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { PageBuddy } from '@/components/page-buddy';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NeuroBreath | Neurodiversity Support Platform',
  description:
    'Evidence-based tools for ADHD and autism support. Gamified quests, focus timers, calming techniques, and educational resources.',
  keywords: [
    'ADHD support',
    'autism resources',
    'neurodiversity',
    'mental health',
    'focus tools',
    'calming techniques',
  ],
  authors: [{ name: 'NeuroBreath Team' }],
  openGraph: {
    title: 'NeuroBreath | Neurodiversity Support Platform',
    description: 'Evidence-based tools for ADHD and autism support',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <PageBuddy />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
