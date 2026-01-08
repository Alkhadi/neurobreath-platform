'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Users, Brain, Award, ArrowRight } from 'lucide-react';

interface DyslexiaHeroProps {
  onScrollToSection: (section: string) => void;
}

export function DyslexiaHero({ onScrollToSection }: DyslexiaHeroProps) {
  return (
    <section className="space-y-6">
      {/* Main Hero Card */}
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <CardContent className="p-6 sm:p-8 lg:p-10 space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-sm font-semibold">
              <Brain className="w-4 h-4" />
              <span>Dyslexia Support Hub • NeuroBreath</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Your Complete Dyslexia Support Hub
            </h1>
            
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              A comprehensive, evidence-based resource for individuals with dyslexia, parents, teachers, and carers. 
              Access interactive tools, learning activities, progress tracking, and expert guidance—all in one place.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button
              size="lg"
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => onScrollToSection('assessment')}
            >
              <BookOpen className="w-5 h-5" />
              Take Assessment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2"
              onClick={() => onScrollToSection('games')}
            >
              <Award className="w-5 h-5" />
              Learning Games
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2"
              onClick={() => onScrollToSection('resources')}
            >
              <BookOpen className="w-5 h-5" />
              Resources
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full gap-2"
              onClick={() => onScrollToSection('guides')}
            >
              <Users className="w-5 h-5" />
              Support Guides
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-blue-200 dark:border-blue-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">Evidence-Based</h3>
                <p className="text-xs text-muted-foreground">Backed by NHS & research from leading institutions</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-blue-200 dark:border-blue-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">All Ages Welcome</h3>
                <p className="text-xs text-muted-foreground">Tailored content for children, teens, and adults</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-white/50 dark:bg-gray-900/50 border border-blue-200 dark:border-blue-800">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm">Privacy First</h3>
                <p className="text-xs text-muted-foreground">No login required, saves privately on your device</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground italic">
              <strong>Did you know?</strong> Dyslexia affects 10-15% of the population and is not related to intelligence. 
              Many successful entrepreneurs, artists, and innovators have dyslexia. With the right support and strategies, 
              individuals with dyslexia can thrive.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Navigation */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-foreground">Explore by Role</h2>
              <p className="text-sm text-muted-foreground">Jump to resources designed for you</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScrollToSection('understanding')}
              >
                I'm an Individual
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScrollToSection('guides')}
              >
                I'm a Parent
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScrollToSection('guides')}
              >
                I'm a Teacher
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onScrollToSection('guides')}
              >
                I'm a Carer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
