import type { Region } from '@/lib/region/region'
import { splitTextWithGlossary } from '@/lib/glossary/recogniseTerms'
import { GlossaryTooltip } from '@/components/glossary/GlossaryTooltip'
import { PageShellNB, PageEndNB } from '@/components/layout/page-primitives'
import { HeroToolNB } from '@/components/layout/hero-primitives'
import { FeatureGridNB, ContentCardNB, CTASectionNB } from '@/components/layout/section-primitives'
import { TrustBlockNB, TrustStripNB } from '@/components/trust/trust-primitives'
import { Layers, Sparkles, Shuffle, Grid } from 'lucide-react'
import Link from 'next/link'

export default function ToolsPage() {
  const region: Region = 'UK'
  let glossaryRemaining = 5

  const renderGlossaryText = (text: string) => {
    if (glossaryRemaining <= 0) return text
    const segments = splitTextWithGlossary(text, region, glossaryRemaining)
    const termCount = segments.filter((segment) => segment.type === 'term').length
    glossaryRemaining = Math.max(0, glossaryRemaining - termCount)
    return segments.map((segment, index) =>
      segment.type === 'term' ? (
        <GlossaryTooltip
          key={`${segment.termId}-${index}`}
          termId={segment.termId ?? ''}
          display={segment.value}
          region={region}
        />
      ) : (
        <span key={`${segment.value}-${index}`}>{segment.value}</span>
      ),
    )
  }

  return (
    <PageShellNB tone="soft">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <HeroToolNB
        eyebrow="Interactive tools"
        title="Breathing Tools"
        summary="Interactive breathing exercises and gamified tools to keep your practice engaging and effective."
        trustNote={<TrustStripNB region={region} />}
      />

      {/* ── Tool cards ───────────────────────────────────────── */}
      <div className="container-nb py-12">
        <FeatureGridNB columns={2}>
          {/* Breath Ladder */}
          <ContentCardNB
            title="Breath Ladder"
            description={renderGlossaryText(
              'Progressively increase your breathing capacity by climbing from 3-3-3-3 to 5-5-5-5. Each rung builds steady focus and confidence with structured progression.',
            ) as string}
            icon={<Layers className="w-6 h-6 text-white" />}
            accent="linear-gradient(135deg, #9333ea, #ec4899)"
            action={
              <Link href="/tools/breath-ladder" className="nb-btn-primary w-full justify-center">
                Try Breath Ladder
              </Link>
            }
          >
            <ul className="space-y-1.5 text-sm text-[color:var(--nb-text-body)] dark:text-white/70 list-disc pl-5">
              <li>Start at your comfortable level</li>
              <li>Progress gradually through 5 rungs</li>
              <li>Track your advancement</li>
              <li>Build sustainable capacity</li>
            </ul>
          </ContentCardNB>

          {/* Colour-Path Breathing */}
          <ContentCardNB
            title="Colour-Path Breathing"
            description={renderGlossaryText(
              'Follow the illuminated colour path through each breathing phase. Visual cues anchor attention and make timing intuitive for visual learners.',
            ) as string}
            icon={<Sparkles className="w-6 h-6 text-white" />}
            accent="linear-gradient(135deg, #3b82f6, #06b6d4)"
            action={
              <Link href="/tools/colour-path" className="nb-btn-primary w-full justify-center">
                Try Colour-Path
              </Link>
            }
          >
            <ul className="space-y-1.5 text-sm text-[color:var(--nb-text-body)] dark:text-white/70 list-disc pl-5">
              <li>Color-coded breathing phases</li>
              <li>Visual timing guidance</li>
              <li>Perfect for visual processors</li>
              <li>Reduces cognitive load</li>
            </ul>
          </ContentCardNB>

          {/* Micro-Reset Roulette */}
          <ContentCardNB
            title="Micro-Reset Roulette"
            description={renderGlossaryText(
              "Can't decide which technique to use? Spin the wheel for a random 1-minute breathing reset. Perfect for decision fatigue and spontaneous practice.",
            ) as string}
            icon={<Shuffle className="w-6 h-6 text-white" />}
            accent="linear-gradient(135deg, #f97316, #ef4444)"
            action={
              <Link href="/tools/roulette" className="nb-btn-primary w-full justify-center">
                Spin the Wheel
              </Link>
            }
          >
            <ul className="space-y-1.5 text-sm text-[color:var(--nb-text-body)] dark:text-white/70 list-disc pl-5">
              <li>Random technique selection</li>
              <li>1-minute quick resets</li>
              <li>Reduces decision paralysis</li>
              <li>Keeps practice varied</li>
            </ul>
          </ContentCardNB>

          {/* Focus Tiles */}
          <ContentCardNB
            title="Focus Tiles"
            description={renderGlossaryText(
              'Context-based breathing suggestions for different situations: school, work, home, or social. Get the right technique for the right moment.',
            ) as string}
            icon={<Grid className="w-6 h-6 text-white" />}
            accent="linear-gradient(135deg, #10b981, #059669)"
            action={
              <Link href="/tools/focus-tiles" className="nb-btn-primary w-full justify-center">
                Explore Focus Tiles
              </Link>
            }
          >
            <ul className="space-y-1.5 text-sm text-[color:var(--nb-text-body)] dark:text-white/70 list-disc pl-5">
              <li>Situation-specific techniques</li>
              <li>Quick recommendations</li>
              <li>Context-aware guidance</li>
              <li>Practical application</li>
            </ul>
          </ContentCardNB>
        </FeatureGridNB>

        {/* Trust block */}
        <div className="mt-10">
          <TrustBlockNB region={region} />
        </div>
      </div>

      {/* ── Page end ─────────────────────────────────────────── */}
      <PageEndNB eyebrow="Keep exploring" title="What would you like to do next?">
        <CTASectionNB
          title="Find the right support for you"
          summary="Answer a few questions and we'll point you to the most helpful tools and guides."
          primaryHref={`/uk/help-me-choose`}
          primaryLabel="Help me choose"
          secondaryHref="/"
          secondaryLabel="Back to home"
          trustNote="Educational only. Not medical advice."
        />
      </PageEndNB>
    </PageShellNB>
  )
}
