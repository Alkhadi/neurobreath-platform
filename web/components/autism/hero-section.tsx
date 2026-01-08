'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserContext, useAutismProgress } from '@/hooks/useAutismProgress';
import { scrollToSection, type SectionId } from '@/lib/autism/section-nav';
import { 
  Wind, 
  BookOpen, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles,
  Info,
  FileText,
  GraduationCap,
  Heart,
  User,
  Briefcase
} from 'lucide-react';

const titles: Record<string, { main: string; sub: string }> = {
  teacher: {
    main: 'Autism Support for Teachers',
    sub: 'Evidence-based strategies to create an inclusive, supportive classroom for autistic learners'
  },
  parent: {
    main: 'Autism Support for Parents & Carers',
    sub: 'Practical strategies and tools to support autistic children and young people at home'
  },
  autistic: {
    main: 'Autism Hub',
    sub: 'Tools, strategies, and information to support wellbeing and self-advocacy'
  },
  employer: {
    main: 'Supporting Autistic Employees',
    sub: 'Workplace adjustments and inclusive practices to enable autistic employees to thrive'
  }
};

export function HeroSection() {
  const { context, updateContext } = useUserContext();
  const { progress, hydrated } = useAutismProgress();

  const title = titles?.[context?.audience ?? 'teacher'] ?? titles.teacher;

  const quickNavItems = [
    {
      label: 'How to use',
      icon: Info,
      section: 'how-to-use' as SectionId,
      description: 'Quick tour'
    },
    {
      label: 'Skills',
      icon: BookOpen,
      section: 'skills' as SectionId,
      description: 'Evidence-based strategies'
    },
    {
      label: 'Calm Toolkit',
      icon: Wind,
      section: 'calm' as SectionId,
      description: 'Breathing & calming'
    },
    {
      label: 'Progress',
      icon: TrendingUp,
      section: 'progress' as SectionId,
      description: 'Track & badges'
    },
    {
      label: 'Crisis Support',
      icon: ShieldAlert,
      section: 'crisis' as SectionId,
      description: 'Emergency help'
    },
    {
      label: 'References',
      icon: FileText,
      section: 'references' as SectionId,
      description: 'Evidence base'
    }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
        {/* Main Content */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Autism Hub
            </Badge>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4">
            {title?.main}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {title?.sub}
          </p>

          {/* Primary CTAs - Converted from ZIP header navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => scrollToSection('calm')}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Wind className="h-5 w-5" />
              Start 3-minute calm
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection('skills')}
              className="gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Browse strategies
            </Button>
          </div>

          {/* Educational disclaimer */}
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            This page provides educational information only and is not medical advice.
            For diagnosis or treatment, please consult qualified healthcare professionals.
          </p>
        </div>

        {/* Quick Navigation Grid - Converted from ZIP header */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg mb-6">
          {/* Audience & Country Switchers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 justify-between mb-6 pb-6 border-b">
            <div>
              <p className="text-sm font-semibold mb-3">I am a:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={context.audience === 'teacher' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ audience: 'teacher' })}
                  className="gap-2"
                >
                  <GraduationCap className="h-4 w-4" />
                  Teacher
                </Button>
                <Button
                  variant={context.audience === 'parent' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ audience: 'parent' })}
                  className="gap-2"
                >
                  <Heart className="h-4 w-4" />
                  Parent/Carer
                </Button>
                <Button
                  variant={context.audience === 'autistic' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ audience: 'autistic' })}
                  className="gap-2"
                >
                  <User className="h-4 w-4" />
                  Autistic Person
                </Button>
                <Button
                  variant={context.audience === 'employer' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ audience: 'employer' })}
                  className="gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Employer
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-semibold mb-3">Country:</p>
              <div className="flex gap-2">
                <Button
                  variant={context.country === 'uk' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ country: 'uk' })}
                >
                  UK
                </Button>
                <Button
                  variant={context.country === 'us' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ country: 'us' })}
                >
                  US
                </Button>
                <Button
                  variant={context.country === 'eu' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateContext({ country: 'eu' })}
                >
                  EU
                </Button>
              </div>
            </div>
          </div>

          <h2 className="text-lg font-semibold mb-4 text-center">Quick Navigation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.section}
                  onClick={() => scrollToSection(item.section)}
                  className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-accent/50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <div className="text-center">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Progress Stats Summary */}
        {hydrated && progress.sessions > 0 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold text-foreground">{progress.streak}</span> day streak
              </div>
              <div>
                <span className="font-semibold text-foreground">{progress.sessions}</span> sessions
              </div>
              <div>
                <span className="font-semibold text-foreground">{progress.minutes}</span> minutes
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
