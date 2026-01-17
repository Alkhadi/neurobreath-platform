'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { EvidenceFooter } from '@/components/evidence-footer'
import { evidenceByRoute } from '@/lib/evidence/page-evidence'

// Import components with dynamic loading for better error isolation
const HeroSection = dynamic(() => import('@/components/blog/hero-section'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading Hero...</div>
})

const HowItWorks = dynamic(() => import('@/components/blog/how-it-works'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading How It Works...</div>
})

const CalmChallenge = dynamic(() => import('@/components/blog/calm-challenge'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading Challenge...</div>
})

const AICoachChat = dynamic(() => import('@/components/blog/ai-coach-chat-v2'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading AI Coach...</div>
})

const LiveHealthUpdates = dynamic(() => import('@/components/blog/live-health-updates'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading Health Updates...</div>
})

const FocusLabPreview = dynamic(() => import('@/components/blog/focus-lab-preview'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading Focus Lab...</div>
})

const BlogDirectory = dynamic(() => import('@/components/blog/blog-directory'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading Blog Directory...</div>
})

const SourcesSection = dynamic(() => import('@/components/blog/sources-section'), {
  loading: () => <div className="p-8 bg-card rounded-lg">Loading Sources...</div>
})

const evidence = evidenceByRoute['/blog']

export default function BlogPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero / Positioning */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading Hero...</div>}>
        <div data-tour="blog-hero">
          <HeroSection />
        </div>
      </Suspense>

      {/* 30-Day Calm Challenge */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading Challenge...</div>}>
        <div data-tour="calm-challenge">
          <CalmChallenge />
        </div>
      </Suspense>

      {/* How the Hub Works */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading How It Works...</div>}>
        <HowItWorks />
      </Suspense>

      {/* Ask the AI Coach */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading AI Coach...</div>}>
        <div data-tour="ai-coach">
          <AICoachChat />
        </div>
      </Suspense>

      {/* Live Health Updates (NHS/UKHSA) */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading Health Updates...</div>}>
        <LiveHealthUpdates />
      </Suspense>

      {/* Interactive Focus Lab Preview */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading Focus Lab...</div>}>
        <FocusLabPreview />
      </Suspense>

      {/* AI-Assisted Blog Directory */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading Blog Directory...</div>}>
        <div data-tour="blog-directory">
          <BlogDirectory />
        </div>
      </Suspense>

      {/* Featured Resources + Sources */}
      <Suspense fallback={<div className="p-8 bg-muted rounded-lg animate-pulse">Loading Sources...</div>}>
        <div data-tour="resources">
          <SourcesSection />
        </div>
      </Suspense>

      {/* Evidence Sources */}
      <EvidenceFooter evidence={evidence} />
    </div>
  )
}
