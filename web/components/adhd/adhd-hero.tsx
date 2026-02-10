'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, Target, Users } from 'lucide-react';

export function ADHDHero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-purple-200 p-4 sm:p-6 md:p-8 lg:p-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
      
      <div className="relative space-y-4 sm:space-y-6">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 gap-1 text-xs sm:text-sm">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            Evidence-Based
          </Badge>
          <Badge variant="outline" className="border-purple-300 bg-white/50 text-xs sm:text-sm">
            🇬🇧 UK-First Guidance
          </Badge>
          <Badge variant="outline" className="border-blue-300 bg-white/50 text-xs sm:text-sm">
            NICE NG87 • AAP • CDC
          </Badge>
        </div>

        {/* Main Content */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            ADHD Hub
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-normal mt-1.5 sm:mt-2">
              Evidence-Based Support & Interactive Tools
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Comprehensive ADHD resources backed by <strong>NICE NG87</strong>, <strong>AAP 2019</strong>, 
            <strong> CDC</strong>, and <strong>10+ peer-reviewed systematic reviews</strong>. 
            Get personalized guidance for all ages with interactive tools, treatment decision support, 
            and evidence-backed strategies.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
          <Button 
            size="lg" 
            className="gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
            onClick={() => scrollToSection('decision-tree')}
          >
            <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Treatment Decision Tree</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-1.5 sm:gap-2 border-2 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
            onClick={() => scrollToSection('myths-facts')}
          >
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Myths vs Facts
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-1.5 sm:gap-2 border-2 w-full sm:w-auto text-sm sm:text-base h-10 sm:h-11"
            onClick={() => scrollToSection('skills')}
          >
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Skills Library
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-purple-200">
          <div>
            <div className="text-3xl font-bold text-purple-600">15</div>
            <div className="text-sm text-muted-foreground">Evidence Sources</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">13</div>
            <div className="text-sm text-muted-foreground">Interventions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-600">10+</div>
            <div className="text-sm text-muted-foreground">PubMed Studies</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-600">4</div>
            <div className="text-sm text-muted-foreground">Age Groups</div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-sm text-muted-foreground border-l-4 border-purple-400 pl-4 bg-white/50 p-3 rounded-r">
          <strong className="text-foreground">Educational Resource:</strong> This platform provides evidence-based 
          information from official UK (NICE NG87, NHS) and US (CDC, AAP, DSM-5) guidelines. Always consult qualified 
          healthcare professionals for diagnosis and personalized treatment planning.
        </div>
      </div>
    </div>
  );
}
