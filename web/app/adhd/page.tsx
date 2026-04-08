'use client';

import { useEffect } from 'react';
import { PageHeader } from '@/components/page/PageHeader';
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
import { Heart, Rocket, Zap, Star, BookOpen, Users, Target, Car, AlertTriangle, Shield } from 'lucide-react';
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
      <section
        className="relative py-12 sm:py-16 scroll-mt-20 overflow-hidden"
        style={{
          backgroundImage: 'url("/images/home/home-section-bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
          {/* Dark overlay — 30% darken, top-heavier gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/20 dark:from-black/55 dark:via-black/40 dark:to-black/35" aria-hidden="true" />
        <div className="relative z-10 mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <PageHeader 
            title="ADHD Hub" 
            description="Evidence-based support and interactive tools for ADHD management backed by NICE NG87, AAP 2019, CDC, and 10+ peer-reviewed systematic reviews. Get personalized guidance for all ages."
            showMetadata
          />

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mt-6">
            <Button 
              size="lg" 
              className="gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
              onClick={() => {
                const element = document.getElementById('decision-tree');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">Treatment Decision Tree</span>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-1.5 sm:gap-2 border-2 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
              onClick={() => {
                const element = document.getElementById('myths-facts');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Myths vs Facts
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-1.5 sm:gap-2 border-2 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
              onClick={() => {
                const element = document.getElementById('skills');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Skills Library
            </Button>
          </div>

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

      {/* ADHD & Driving Safety */}
      <section id="adhd-driving" className="py-12 sm:py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              ADHD &amp; Driving Safety 🚗
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Driving requires sustained attention, quick decision-making, and impulse control — all areas affected by ADHD. Understanding these risks can help you stay safer on the road.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* How ADHD Impacts Driving */}
            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <CardTitle className="text-xl">How ADHD Impacts Driving</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Research has identified a strong link between ADHD and increased risk of motor vehicle incidents. Individuals with ADHD are more likely to make errors in judgment, take risks, and inadvertently break traffic rules. A 2023 study found that adults with ADHD aged 65–79 were roughly twice as likely to receive traffic tickets and 74% more likely to be involved in crashes compared to those without ADHD.
                </p>
                <p>
                  ADHD disrupts executive function — the ability to plan, make decisions, and filter out distractions. In the context of driving, inattention can cause missed road signs and speed limit changes, while impulsivity may lead to overestimating driving ability and taking unnecessary risks. High levels of daytime drowsiness, common in ADHD, can further increase the chance of falling asleep behind the wheel.
                </p>
              </CardContent>
            </Card>

            {/* Warning Signs */}
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Car className="w-8 h-8 text-orange-600" />
                  <CardTitle className="text-xl">Warning Signs to Watch For</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="mb-3">Drivers with ADHD may face visual, auditory, manual, and cognitive distractions simultaneously. Key warning signs include:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Frequently forgetting to check blind spots</li>
                  <li>Making unsafe lane changes or failing to stay in a lane</li>
                  <li>Overlooking speed limits and road signs</li>
                  <li>Difficulty concentrating during long drives</li>
                  <li>Reaching for items, adjusting controls, or using a phone while driving</li>
                  <li>Receiving multiple traffic tickets or being involved in preventable accidents</li>
                  <li>Feeling drowsy after extended periods of driving</li>
                </ul>
                <p className="mt-3">If you notice these behaviours in yourself or a loved one, speaking with a healthcare professional may be helpful.</p>
              </CardContent>
            </Card>

            {/* Young & New Drivers */}
            <Card className="border-2 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-600" />
                  <CardTitle className="text-xl">Young &amp; New Drivers With ADHD</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Teenagers aged 16–19 are already among the highest-risk age groups for road incidents. Because the brain areas responsible for executive function do not fully mature until the mid-to-late twenties, teens are naturally more susceptible to distractions — and ADHD amplifies this. Research shows that newly licensed drivers with ADHD are approximately 36% more likely to be involved in a crash.
                </p>
                <p>
                  Parents and carers can help by setting clear rules about passengers, discouraging driving while drowsy, practising in challenging conditions (night-time, rain), and working with a healthcare provider on ADHD management strategies. Permit-holding teens who engage in regular driving practice are up to 39% less likely to have an accident.
                </p>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-8 h-8 text-green-600" />
                  <CardTitle className="text-xl">Practical Safety Strategies</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p><strong>Minimise distractions:</strong> Silence and store your phone before setting off. Set up your playlist, mirrors, climate controls, and navigation before putting the vehicle in gear. A pre-drive checklist can help until these habits become automatic.</p>
                <p><strong>Plan ahead for longer trips:</strong> Map your route and rest stops in advance. Take regular breaks to stretch and eat. Use an &quot;active scanning&quot; technique — periodically check your mirrors, speedometer, and surrounding traffic to keep your mind engaged.</p>
                <p><strong>Leverage vehicle safety features:</strong> Familiarise yourself with steering wheel controls, always wear your seatbelt, and consider dimming or deactivating large in-car displays if they pull your attention from the road.</p>
                <p><strong>Medication and support:</strong> Research suggests that ADHD medication can meaningfully reduce crash risk. A large-scale study found that medicated individuals were 38–42% less likely to be involved in motor vehicle accidents. A responsible passenger can also help with navigation and staying alert on longer journeys.</p>
              </CardContent>
            </Card>
          </div>

          {/* Reference */}
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <p className="text-xs text-muted-foreground text-center">
              Content in this section is paraphrased from{' '}
              <a
                href="https://shamiehlaw.com/adhd-and-driving/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
              >
                &quot;ADHD and Driving&quot; by Shamieh Law
              </a>. Used with permission. Original resource compiled by Shamieh Law for public safety education.
            </p>
          </div>
        </div>
      </section>

      {/* Resources & Templates */}
      <section id="resources" className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <div className="mx-auto px-4 w-[94vw] sm:w-[90vw] lg:w-[86vw] max-w-[1400px]">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              ADHD Resources & Templates 📋
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-4">
              Downloadable templates for 504 plans, workplace accommodations, dopamine menus, and more
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] lg:[&>*]:basis-[calc(33.333%-11px)] [&>*]:min-w-0">
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