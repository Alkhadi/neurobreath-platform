import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import QuestPassPill from '@/components/quest-pass-pill'
import ClientLayout from '@/components/ClientLayout'
import { Toaster } from 'sonner'
import { BreathingSessionProvider } from '@/contexts/BreathingSessionContext'
import { OnboardingCardWrapper } from '@/components/OnboardingCardWrapper'
import { OwlCoach } from '@/components/coach/OwlCoach'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NeuroBreath • Measured Breathing & Relief',
  description: 'NeuroBreath provides clinically referenced, neuro-inclusive breathing tools, guides and timers for calm, sleep, focus and emotional regulation.',
  keywords: ['breathing', 'mindfulness', 'neurodivergent', 'autism', 'ADHD', 'anxiety', 'stress relief'],
  authors: [{ name: 'NeuroBreath' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'NeuroBreath • Measured Breathing & Relief',
    description: 'Clinically referenced, neuro-inclusive breathing techniques with clear guidance, timers and safety notes.',
    type: 'website',
    url: 'https://neurobreath.co.uk/',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }]
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/css/base.css" />
        <link rel="stylesheet" href="/css/site.css" />
        <link rel="stylesheet" href="/css/quest-pass.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <BreathingSessionProvider>
            <a className="skip-link" href="#main">Skip to content</a>
            <div id="top"></div>
            <SiteHeader />
            
            {/* Onboarding - Shows only on specific routes (client-side detection) */}
            <OnboardingCardWrapper />
            
            <main id="main" className="page-main">
              {children}
            </main>
            <SiteFooter />
            <QuestPassPill />
            
            {/* Owl Coach - Shows on allowed routes only */}
            <OwlCoach />
            
            <ClientLayout />
            <Toaster position="bottom-center" richColors />
          </BreathingSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
