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

export default function HomePage() {
  // Initialize milestones on first load
  useEffect(() => {
    initializeMilestones();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      {/* Hero Section */}
      <section className="py-8 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <ADHDHero />
        </div>
      </section>

      {/* Treatment Decision Tree - NEW Phase 2 Component */}
      <section id="decision-tree" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <TreatmentDecisionTree />
        </div>
      </section>

      {/* Daily Quests Section */}
      <section id="quests" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
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
      <section id="focus" className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              ADHD Focus Timer ⏱️
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Flexible Pomodoro technique adapted for ADHD brains - adjust intervals based on your energy and hyperfocus
            </p>
          </div>
          <FocusPomodoro />
        </div>
      </section>

      {/* ADHD Skills Library */}
      <section id="skills" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <ADHDSkillsLibrary />
        </div>
      </section>

      {/* ADHD Myths & Facts - Phase 2 Component with Evidence Registry */}
      <section id="myths-facts" className="py-16 bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50 dark:from-orange-950 dark:via-yellow-950 dark:to-pink-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <ADHDMythsFacts />
        </div>
      </section>

      {/* Resources & Templates */}
      <section id="resources" className="py-16 bg-white dark:bg-gray-900 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              ADHD Resources & Templates 📋
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
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
      <section id="research" className="py-16 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-950/20 dark:via-gray-900 dark:to-pink-950/20 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              ADHD Research Database 📚
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search 35+ million peer-reviewed articles on ADHD, executive function, and neurodevelopmental research
            </p>
          </div>
          <PubMedResearch />
        </div>
      </section>

      {/* Crisis Support */}
      <section id="crisis" className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-950 dark:via-orange-950 dark:to-yellow-950 scroll-mt-20">
        <div className="container mx-auto max-w-6xl px-4">
          <CrisisSupport />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-900 via-blue-900 to-pink-900 text-white py-12">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Zap className="w-6 h-6 text-yellow-400" />
              NeuroBreath ADHD Platform
              <Rocket className="w-6 h-6 text-blue-400" />
            </h3>
            <p className="text-sm text-gray-300 max-w-2xl mx-auto">
              Empowering individuals with ADHD through evidence-based strategies, gamification, and community support.
              Built by neurodivergent minds, for neurodivergent minds.
            </p>
            <div className="flex justify-center gap-6 text-xs text-gray-400 flex-wrap">
              <span>🎮 Gamified Management</span>
              <span>📚 Evidence-Based</span>
              <span>👨‍👩‍👧‍👦 All Ages</span>
              <span>🌍 Global Resources</span>
            </div>
            <p className="text-xs text-gray-500 pt-4 border-t border-white/10">
              © 2026 NeuroBreath Platform - ADHD Hub. All content is for educational purposes only.
              Evidence-based information from NICE, NHS, CDC, CHADD, and peer-reviewed research.
            </p>
            <p className="text-xs text-gray-600">
              ⚠️ This platform provides educational support and is not a substitute for professional medical advice.
              Always consult healthcare providers for diagnosis and treatment.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}