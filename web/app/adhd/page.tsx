'use client';

import { useEffect } from 'react';
import { ADHDHero } from '@/components/adhd/adhd-hero';
import { DailyQuestsADHD } from '@/components/adhd/daily-quests-adhd';
import { FocusPomodoro } from '@/components/adhd/focus-pomodoro';
import { ADHDSkillsLibrary } from '@/components/adhd/adhd-skills-library';
import { ADHDMythsFacts } from '@/components/adhd/adhd-myths-facts';
import { TreatmentDecisionTree } from '@/components/adhd/treatment-decision-tree';
import { PubMedResearch } from '@/components/autism/pubmed-research';
import { CrisisSupport } from '@/components/autism/crisis-support';
import { initializeMilestones } from '@/lib/progress-store-enhanced';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Rocket, Zap, Star, BookOpen, Users } from 'lucide-react';
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { EducationalDisclaimerInline } from '@/components/trust/EducationalDisclaimerInline';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import type { Region } from '@/lib/region/region';

const evidence = evidenceByRoute['/adhd'];

export default function HomePage() {
  const region: Region = 'UK';
  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and evidence framing.',
    createdAt: '2026-01-16',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 90,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Credibility footer and review details added.', 'safety'),
    ]),
    citationsSummary: createCitationsSummary(evidence?.citations?.length ?? 0, ['A', 'B']),
  });
  // Initialize milestones on first load
  useEffect(() => {
    initializeMilestones();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 pt-14 sm:pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="py-6 sm:py-8 scroll-mt-20">
        <div className="mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <ADHDHero />
          <div className="mt-4">
            <EducationalDisclaimerInline contextLabel="ADHD hub" />
          </div>
        </div>
      </section>

      {/* Treatment Decision Tree - NEW Phase 2 Component */}
      <section id="decision-tree" className="py-12 sm:py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <TreatmentDecisionTree />
        </div>
      </section>

      {/* Daily Quests Section */}
      <section id="quests" className="py-12 sm:py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              Daily Quests & Challenges 🎮
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Level up your ADHD management with gamified daily quests. Earn XP, unlock badges, and build streaks!
            </p>
          </div>
          <DailyQuestsADHD />
        </div>
      </section>

      {/* Focus Timer Section */}
      <section id="focus" className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              ADHD Focus Timer ⏱️
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Flexible Pomodoro technique adapted for ADHD brains - adjust intervals based on your energy and hyperfocus
            </p>
          </div>
          <FocusPomodoro />
        </div>
      </section>

      {/* ADHD Skills Library */}
      <section id="skills" className="py-12 sm:py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <ADHDSkillsLibrary />
        </div>
      </section>

      {/* ADHD Myths & Facts - Phase 2 Component with Evidence Registry */}
      <section id="myths-facts" className="py-12 sm:py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-950 dark:via-yellow-950 dark:to-pink-950 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <ADHDMythsFacts />
        </div>
      </section>

      {/* Resources & Templates */}
      <section id="resources" className="py-12 sm:py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              ADHD Resources & Templates 📋
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Downloadable templates for 504 plans, workplace accommodations, dopamine menus, and more
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "504 Plan Request Letter",
                description: "Request ADHD accommodations at school (US)",
                icon: <BookOpen className="w-8 h-8 text-blue-600" />,
                badge: "Parents"
              },
              {
                title: "Workplace Accommodations",
                description: "Request ADA accommodations at work",
                icon: <Heart className="w-8 h-8 text-purple-600" />,
                badge: "Adults"
              },
              {
                title: "Dopamine Menu",
                description: "Create your personalized activity menu",
                icon: <Zap className="w-8 h-8 text-yellow-600" />,
                badge: "All Ages"
              },
              {
                title: "Focus Block Planner",
                description: "Visual time-blocking for ADHD brains",
                icon: <Rocket className="w-8 h-8 text-orange-600" />,
                badge: "All Ages"
              },
              {
                title: "Medication Tracker",
                description: "Track effectiveness and side effects",
                icon: <Star className="w-8 h-8 text-green-600" />,
                badge: "All Ages"
              },
              {
                title: "Parent-Teacher Plan",
                description: "Collaboration plan for school support",
                icon: <Users className="w-8 h-8 text-pink-600" />,
                badge: "Parents & Teachers"
              }
            ].map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer border-2">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>{resource.icon}</div>
                    <Badge variant="outline">{resource.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled
                  >
                    Coming Soon 🚧
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    Template editor in development
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PubMed Research */}
      <section id="research" className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              ADHD Research Database 📚
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Search 35+ million peer-reviewed articles on ADHD, executive function, and neurodevelopmental research
            </p>
          </div>
          <PubMedResearch />
        </div>
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-12 sm:py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <CrisisSupport />
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-slate-50 dark:bg-slate-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <CredibilityFooter editorial={editorial} region={region} />
        </div>
      </section>

      {/* Evidence Sources */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <EvidenceFooter evidence={evidence} />
        </div>
      </section>
    </main>
  );
}