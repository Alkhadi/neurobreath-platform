/**
 * Phase 4 Demo Page
 * 
 * Demonstrates analytics, recommendations, achievements, and progress tracking features
 */

'use client';

import { ProgressStats } from '@/components/progress/ProgressStats';
import { ActivityChart } from '@/components/progress/ActivityChart';
import { Recommendations } from '@/components/recommendations/Recommendations';
import { NextActionCard } from '@/components/recommendations/NextActionCard';
import { AchievementsDisplay } from '@/components/achievements/AchievementsDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Award, Compass, BarChart, Target } from 'lucide-react';
import Link from 'next/link';
import { useExperiment } from '@/lib/experiments/hooks';
import { MY_PLAN_EMPTY_STATE_CTA_COPY } from '@/lib/experiments/definitions';

export default function Phase4DemoPage() {
  const emptyCtaExperiment = useExperiment(MY_PLAN_EMPTY_STATE_CTA_COPY);

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          Phase 4: Analytics & Intelligence
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Personalized Insights & Recommendations
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Privacy-focused analytics, intelligent recommendations, gamification, and progress tracking
          to enhance your NeuroBreath journey.
        </p>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Analytics Engine</CardTitle>
            <CardDescription>
              Track user behavior and progress with privacy-focused local analytics
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Compass className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Smart Recommendations</CardTitle>
            <CardDescription>
              Personalized content suggestions based on interests and activity
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-lg">Achievements System</CardTitle>
            <CardDescription>
              Gamification with badges, streaks, and milestone tracking
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Experiments / A-B Testing */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Target className="w-7 h-7" />
            Experiments (A/B Testing)
          </h2>
          <p className="text-muted-foreground">
            Simple client-side bucketing with local-only exposure + conversion tracking.
          </p>
        </div>

        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Live Experiment Example</CardTitle>
            <CardDescription>
              Experiment: <span className="font-mono">{emptyCtaExperiment.experimentId}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-muted-foreground">Variant</div>
                <div className="font-semibold">{emptyCtaExperiment.variant}</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-muted-foreground">In rollout</div>
                <div className="font-semibold">{emptyCtaExperiment.inExperiment ? 'Yes' : 'No (fallback)'}</div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3">
                <div className="text-muted-foreground">Where used</div>
                <div className="font-semibold">My Plan empty state CTA</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() =>
                  emptyCtaExperiment.trackConversion('demo_conversion_click', {
                    surface: '/demo/phase-4',
                  })
                }
              >
                Simulate conversion
              </Button>
              <Button variant="outline" onClick={emptyCtaExperiment.reset}>
                Reset assignment
              </Button>
              <Button asChild variant="secondary">
                <Link href="/my-plan">Open My Plan</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-12">
        {/* Analytics Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <TrendingUp className="w-7 h-7" />
              Analytics & Progress Tracking
            </h2>
            <p className="text-muted-foreground">
              Privacy-focused analytics stored locally on your device. No external tracking.
            </p>
          </div>

          <div className="space-y-6">
            <ProgressStats />
            <ActivityChart days={7} />
          </div>

          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Track saves, journey completions, and routine updates</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Streak tracking for daily engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Activity trend visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Journey completion rate analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>All data stored in localStorage (privacy-first)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>No external tracking or third-party analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Recommendations Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Compass className="w-7 h-7" />
              Intelligent Recommendations
            </h2>
            <p className="text-muted-foreground">
              Personalized content suggestions based on your interests, saved items, and progress.
            </p>
          </div>

          <div className="space-y-6">
            <NextActionCard />
            <Recommendations maxPerSection={3} showAllSections={true} />
          </div>

          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Recommendation Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Tag-based content matching</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Progressive difficulty suggestions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Condition-specific tool recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Next action based on user progress</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Related content based on browsing history</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span>Filters out already saved items</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Achievements Section */}
        <section>
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Award className="w-7 h-7" />
              Achievements & Gamification
            </h2>
            <p className="text-muted-foreground">
              Earn badges and track milestones as you progress through your journey.
            </p>
          </div>

          <AchievementsDisplay />

          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Achievement Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Getting Started:</strong> First save, journey, routine</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Consistency:</strong> 3, 7, and 30-day streaks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Completion:</strong> Journey milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>Exploration:</strong> Diverse content usage</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Integration Section */}
        <section className="pb-12">
          <Card className="border-2 border-primary/30">
            <CardHeader>
              <CardTitle>See It in Action</CardTitle>
              <CardDescription>
                All Phase 4 features are now integrated into the My Plan dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">
                Visit your personalized My Plan page to see analytics, recommendations, and achievements
                working together to enhance your NeuroBreath experience.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/my-plan">
                    <Award className="w-4 h-4 mr-2" />
                    View My Plan
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/settings">
                    <Target className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
