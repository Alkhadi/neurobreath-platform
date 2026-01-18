'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Wind, 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Target,
  User,
  GraduationCap,
  Users,
  Heart,
  TrendingUp,
  CheckCircle2,
  Zap,
  FileText,
  ChevronRight
} from 'lucide-react';

export default function GetStartedPage() {
  const [selectedRole, setSelectedRole] = useState<'individual' | 'parent' | 'teacher' | 'professional' | null>(null);

  const roles = [
    {
      id: 'individual' as const,
      icon: User,
      label: 'Myself',
      description: 'Personal wellbeing support',
      color: 'from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'parent' as const,
      icon: Heart,
      label: 'Parent/Carer',
      description: 'Supporting my child',
      color: 'from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30',
      borderColor: 'border-pink-200 dark:border-pink-800'
    },
    {
      id: 'teacher' as const,
      icon: GraduationCap,
      label: 'Teacher/Educator',
      description: 'Classroom & student support',
      color: 'from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      id: 'professional' as const,
      icon: Users,
      label: 'Professional',
      description: 'Clinical or workplace support',
      color: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      borderColor: 'border-green-200 dark:border-green-800'
    }
  ];

  const quickWins = [
    {
      title: '60-Second SOS Calm',
      description: 'Quick breathing reset for overwhelm',
      time: '1 min',
      href: '/techniques/sos',
      icon: Wind,
      color: 'text-blue-600'
    },
    {
      title: 'AI Coach Chat',
      description: 'Get personalized guidance instantly',
      time: '2 mins',
      href: '/blog',
      icon: MessageSquare,
      color: 'text-purple-600'
    },
    {
      title: 'Browse Conditions',
      description: 'ADHD, Autism, Anxiety, Dyslexia & more',
      time: '3 mins',
      href: '/conditions',
      icon: Brain,
      color: 'text-green-600'
    }
  ];

  const pathways = {
    individual: {
      title: 'Your Personal Path',
      steps: [
        {
          label: 'Start with a quick calm',
          description: 'Try the 60-second breathing reset',
          href: '/techniques/sos',
          icon: Wind
        },
        {
          label: 'Explore your focus area',
          description: 'Browse conditions: ADHD, Autism, Anxiety, Depression',
          href: '/conditions',
          icon: Brain
        },
        {
          label: 'Build your routine',
          description: 'Create daily practice with breathing exercises',
          href: '/breathing',
          icon: Target
        },
        {
          label: 'Track your progress',
          description: 'Earn XP, badges, and track streaks',
          href: '/breathing',
          icon: TrendingUp
        }
      ]
    },
    parent: {
      title: 'Supporting Your Child',
      steps: [
        {
          label: 'Find your child\'s needs',
          description: 'Autism, ADHD, Dyslexia, Anxiety support hubs',
          href: '/conditions',
          icon: Brain
        },
        {
          label: 'Get IEP/EHCP guidance',
          description: 'Templates, evidence gathering, school meeting prep',
          href: '/autism',
          icon: FileText
        },
        {
          label: 'Try calm techniques together',
          description: 'Age-appropriate breathing & sensory tools',
          href: '/techniques/sos',
          icon: Wind
        },
        {
          label: 'Download printable resources',
          description: 'Checklists, visual schedules, communication aids',
          href: '/resources',
          icon: BookOpen
        }
      ]
    },
    teacher: {
      title: 'Classroom Support Path',
      steps: [
        {
          label: 'Browse teaching strategies',
          description: 'Evidence-based classroom accommodations',
          href: '/autism',
          icon: GraduationCap
        },
        {
          label: 'Use calm tools with students',
          description: 'Whole-class breathing breaks & focus resets',
          href: '/techniques/sos',
          icon: Wind
        },
        {
          label: 'Access printable resources',
          description: 'Visual supports, sensory cards, behaviour plans',
          href: '/resources',
          icon: BookOpen
        },
        {
          label: 'Get IEP/504 templates',
          description: 'Documentation for special education planning',
          href: '/autism',
          icon: FileText
        }
      ]
    },
    professional: {
      title: 'Professional Resources',
      steps: [
        {
          label: 'Review evidence base',
          description: 'Research citations, NHS/NICE guidelines',
          href: '/trust',
          icon: Sparkles
        },
        {
          label: 'Explore clinical tools',
          description: 'Breathing protocols, mood tracking, interventions',
          href: '/breathing',
          icon: Wind
        },
        {
          label: 'Download client resources',
          description: 'Printable worksheets, psychoeducation materials',
          href: '/resources',
          icon: BookOpen
        },
        {
          label: 'Workplace adjustments',
          description: 'Templates for neurodivergent employees',
          href: '/autism',
          icon: Users
        }
      ]
    }
  };

  const mainFeatures = [
    {
      title: 'Breathing Exercises',
      description: 'Box breathing, coherent breathing, SOS reset',
      href: '/breathing',
      icon: Wind,
      badge: '5 techniques'
    },
    {
      title: 'AI Coach',
      description: 'Personalized guidance for neurodiversity & wellbeing',
      href: '/blog',
      icon: MessageSquare,
      badge: 'Free to use'
    },
    {
      title: 'Condition Hubs',
      description: 'ADHD, Autism, Anxiety, Depression, Dyslexia & more',
      href: '/conditions',
      icon: Brain,
      badge: '10+ conditions'
    },
    {
      title: 'Downloadable Resources',
      description: 'Checklists, templates, visual supports, guides',
      href: '/resources',
      icon: BookOpen,
      badge: '60+ PDFs'
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Hero Section */}
      <section 
        id="main-content" 
        className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <Badge variant="secondary" className="gap-2 px-4 py-2">
                <Sparkles className="h-4 w-4" />
                Welcome to NeuroBreath
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
              Getting Started
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Evidence-based breathing, neurodiversity support, and mental wellbeing tools. 
              Free for individuals, families, classrooms, and clinics.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button size="lg" asChild className="gap-2">
                <Link href="/techniques/sos">
                  <Zap className="h-5 w-5" />
                  Quick Start (60 seconds)
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="gap-2">
                <Link href="/blog">
                  <MessageSquare className="h-5 w-5" />
                  Ask AI Coach
                </Link>
              </Button>
            </div>

            {/* Trust Badge */}
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Educational only.</span> Not medical advice. No diagnosis. Evidence-informed guidance.
            </p>
          </div>

          {/* Quick Stats */}
          <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-sm text-muted-foreground">Breathing Techniques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-sm text-muted-foreground">Condition Hubs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">60+</div>
                <div className="text-sm text-muted-foreground">Free Resources</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Free to Use</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Quick Wins Section */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Start immediately</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Wins (1-3 minutes)</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Try these instant tools to get started right now
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickWins.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className={`h-6 w-6 ${item.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">{item.time}</Badge>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <Button asChild variant="ghost" className="group-hover:gap-2 gap-1 transition-all">
                      <Link href={item.href}>
                        Try now <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Choose Your Role Section */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Personalized paths</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Path</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your role to see a tailored getting started guide
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <Card 
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    isSelected 
                      ? `ring-2 ring-primary shadow-lg bg-gradient-to-br ${role.color}` 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                    }`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold mb-2">{role.label}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                    {isSelected && (
                      <div className="mt-3">
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Selected
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Pathway Steps */}
          {selectedRole && pathways[selectedRole] && (
            <Card className="p-8 bg-white dark:bg-gray-800 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">
                {pathways[selectedRole].title}
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {pathways[selectedRole].steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <h4 className="font-semibold">{step.label}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                        <Button asChild variant="link" className="h-auto p-0 text-primary">
                          <Link href={step.href}>
                            Go now <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Prompt if no selection */}
          {!selectedRole && (
            <Card className="p-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-dashed">
              <p className="text-center text-muted-foreground">
                👆 Select your role above to see your personalized getting started path
              </p>
            </Card>
          )}
        </div>
      </section>

      {/* Main Features Overview */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">Platform overview</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Available</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore all the tools and resources available on NeuroBreath
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {mainFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <Badge variant="secondary">{feature.badge}</Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <Button asChild variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      <Link href={feature.href}>
                        Explore <ChevronRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Choose your first step and begin your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="gap-2">
              <Link href="/techniques/sos">
                <Wind className="h-5 w-5" />
                Start with Breathing (60s)
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/blog">
                <MessageSquare className="h-5 w-5" />
                Ask AI Coach
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link href="/conditions">
                <Brain className="h-5 w-5" />
                Browse Conditions
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
