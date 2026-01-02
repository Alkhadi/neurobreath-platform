'use client';

import { usePreferences } from '@/hooks/autism/use-preferences';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Wind, 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  FileText,
  Target,
  Wrench,
  Info,
  GraduationCap,
  Heart,
  User,
  Briefcase
} from 'lucide-react';
import { AudienceType } from '@/lib/types';

const titles: Record<AudienceType, { main: string; sub: string }> = {
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

interface HeroProps {
  onStartCalm: () => void;
  onBrowseSkills: () => void;
  AudienceSwitcher?: React.ComponentType;
  CountrySwitcher?: React.ComponentType;
}

const navigationButtons = [
  { id: 'how-to', label: 'How to use', icon: Info, section: '#how-to' },
  { id: 'quests', label: 'Daily Quests', icon: Target, section: '#quests' },
  { id: 'tools', label: 'Interactive Tools', icon: Wrench, section: '#tools' },
  { id: 'skills', label: 'Skills Library', icon: BookOpen, section: '#skills' },
  { id: 'calm', label: 'Calm Toolkit', icon: Wind, section: '#calm' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, section: '#progress' },
  { id: 'evidence', label: 'Evidence Hub', icon: Sparkles, section: '#evidence' },
  { id: 'crisis', label: 'Crisis Support', icon: ShieldAlert, section: '#crisis' },
  { id: 'references', label: 'References', icon: FileText, section: '#references' },
];

export const Hero = ({ onStartCalm, onBrowseSkills, AudienceSwitcher, CountrySwitcher }: HeroProps) => {
  const { preferences, isLoading } = usePreferences();
  const title = titles?.[preferences?.audience ?? 'teacher'] ?? titles.teacher;

  const scrollToSection = (sectionId: string) => {
    const section = document.querySelector(sectionId);
    section?.scrollIntoView?.({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Personalization Controls */}
        <Card className="p-6 mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 justify-between">
            {/* Audience Selector */}
            <div className="w-full lg:w-auto">
              <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">I am a:</p>
              {AudienceSwitcher && <AudienceSwitcher />}
            </div>

            {/* Country Selector */}
            <div className="w-full lg:w-auto">
              <p className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Country:</p>
              {CountrySwitcher && <CountrySwitcher />}
            </div>
          </div>
        </Card>

        {/* Main Hero Content */}
        <div className="text-center mb-12">
          <Badge className="mb-4 gap-1 bg-gradient-to-r from-blue-600 to-purple-600">
            <Sparkles className="h-3.5 w-3.5" />
            Autism Hub
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {title?.main}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            {title?.sub}
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={onStartCalm}
              className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Wind className="h-5 w-5" />
              Start 3-minute calm
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onBrowseSkills}
              className="gap-2"
            >
              <BookOpen className="h-5 w-5" />
              Browse strategies
            </Button>
          </div>
        </div>

        {/* Quick Navigation Grid */}
        <Card className="p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-center">Quick Navigation</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {navigationButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <Button
                  key={btn.id}
                  variant="outline"
                  onClick={() => scrollToSection(btn.section)}
                  className="flex flex-col items-center gap-2 h-auto py-4 hover:border-primary hover:bg-accent/50 transition-colors"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="text-xs font-medium text-center">{btn.label}</span>
                </Button>
              );
            })}
          </div>
        </Card>

        {/* Educational Disclaimer */}
        <p className="mt-8 text-sm text-muted-foreground text-center max-w-2xl mx-auto">
          This page provides educational information only and is not medical advice.
          For diagnosis or treatment, please consult qualified healthcare professionals.
        </p>
      </div>
    </section>
  );
};
