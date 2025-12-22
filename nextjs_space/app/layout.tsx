import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import QuestPassPill from '@/components/quest-pass-pill'
import ReadingBuddy from '@/components/ReadingBuddy'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NeuroBreath • Measured Breathing & Relief',
  description: 'NeuroBreath provides clinically referenced, neuro-inclusive breathing tools, guides and timers for calm, sleep, focus and emotional regulation.',
  keywords: ['breathing', 'mindfulness', 'neurodivergent', 'autism', 'ADHD', 'anxiety', 'stress relief'],
  authors: [{ name: 'NeuroBreath' }],
  openGraph: {
    title: 'NeuroBreath • Measured Breathing & Relief',
    description: 'Clinically referenced, neuro-inclusive breathing techniques with clear guidance, timers and safety notes.',
    type: 'website',
    url: 'https://neurobreath.co.uk/',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }]
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" defer></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <a className="skip-link" href="#main">Skip to content</a>
          <div id="top"></div>
          <SiteHeader />
          <main id="main" className="page-main">
            {children}
          </main>
          <SiteFooter />
          <QuestPassPill />
          <ReadingBuddy />
          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
