'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Focus, Timer, Trophy, BookOpen, Download, 
  AlertCircle, Zap, Target, Brain, ExternalLink,
  Play, CheckCircle2, TrendingUp
} from 'lucide-react';
import { QuickProtocols } from '@/components/focus-training/QuickProtocols';
import { FocusDrill } from '@/components/focus-training/FocusDrill';
import { ProgressTracker } from '@/components/focus-training/ProgressTracker';
import { FocusGames } from '@/components/focus-training/FocusGames';
import { EmergencyHelp } from '@/components/focus-training/EmergencyHelp';
import { TimerPanel } from '@/components/focus-training/TimerPanel';
import { logFocusBlock } from '@/lib/focus-progress-store';

type ActiveProtocol = {
  id: '2min' | '5min' | '10min';
  title: string;
  duration: string;
  steps: string[];
  color: string;
} | null;

export default function FocusTrainingPage() {
  const [activeProtocol, setActiveProtocol] = useState<ActiveProtocol>(null);
  const [showDrill, setShowDrill] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const handleProtocolComplete = () => {
    // Refresh progress tracker
    setProgressKey(prev => prev + 1);
  };

  const handleDrillComplete = (totalMinutes: number) => {
    logFocusBlock(totalMinutes, 'drill');
    setProgressKey(prev => prev + 1);
  };

  const scrollToDrill = () => {
    setShowDrill(true);
    setTimeout(() => {
      const element = document.getElementById('focus-drill');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const scrollToProtocols = () => {
    const element = document.getElementById('quick-protocols');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const ukResources = [
    {
      name: 'NICE Guidelines — ADHD',
      description: 'Evidence-based recommendations for ADHD diagnosis and management',
      url: 'https://www.nice.org.uk/guidance/ng87',
      category: 'Clinical'
    },
    {
      name: 'NHS — Focus and Concentration',
      description: 'NHS advice on improving focus and managing attention difficulties',
      url: 'https://www.nhs.uk/mental-health/self-help/tips-and-support/focus-and-concentration/',
      category: 'Health'
    },
    {
      name: 'Acas — Neurodiversity at Work',
      description: 'Workplace adjustments and reasonable accommodations guidance',
      url: 'https://www.acas.org.uk/neurodiversity-at-work',
      category: 'Workplace'
    },
    {
      name: 'ADHD Foundation',
      description: 'UK charity providing support, training and resources for ADHD',
      url: 'https://www.adhdfoundation.org.uk/',
      category: 'Support'
    },
    {
      name: 'Mind — Attention and Concentration',
      description: 'Practical tips for managing attention and concentration problems',
      url: 'https://www.mind.org.uk/information-support/tips-for-everyday-living/how-to-improve-your-mental-wellbeing/',
      category: 'Mental Health'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950">
      
      {/* Skip to content for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        <div className="mx-auto px-4 text-center space-y-4 sm:space-y-6" style={{ width: '90vw', maxWidth: '1200px' }}>
          <Badge className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/20 text-white border-white/30 text-sm sm:text-base">
            <Focus className="w-4 h-4" />
            <span>Sprints with Recovery</span>
          </Badge>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Focus Training
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed px-4">
            Build sustained attention through evidence-based focus sprints designed for neurodivergent minds
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center pt-4">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 gap-2 shadow-lg min-h-[48px] w-full sm:w-auto"
              onClick={scrollToDrill}
            >
              <Play className="w-5 h-5" />
              Start Focus Drill (3×5)
            </Button>
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-white/90 gap-2 shadow-lg min-h-[48px] w-full sm:w-auto"
              onClick={scrollToProtocols}
            >
              <Timer className="w-5 h-5" />
              5-Minute Reset
            </Button>
          </div>

          <p className="text-xs sm:text-sm opacity-75 max-w-2xl mx-auto pt-4 px-4">
            <AlertCircle className="w-4 h-4 inline mr-1" />
            Educational information only; not medical advice. If you need clinical support, please consult a qualified healthcare professional.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div id="main-content" className="mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16" style={{ width: '90vw', maxWidth: '1200px' }}>
        
        {/* Quick Start Protocols */}
        <section id="quick-protocols">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-3 sm:mb-4 text-sm sm:text-base">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Quick Start</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Focus Protocols
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Choose a protocol that matches your available time and energy level
            </p>
          </div>
          <QuickProtocols onStartProtocol={(protocol) => setActiveProtocol(protocol)} />
        </section>

        {/* Focus Drill (3×5) */}
        <section id="focus-drill" className="scroll-mt-20">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-3 sm:mb-4 text-sm sm:text-base">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Interactive Timer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Focus Drill (3×5)
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Three 5-minute focus blocks with built-in recovery breaks
            </p>
          </div>
          {showDrill ? (
            <FocusDrill onComplete={handleDrillComplete} />
          ) : (
            <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer" onClick={() => setShowDrill(true)}>
              <CardContent className="py-12 sm:py-16 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center mx-auto">
                    <Timer className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">Ready to Start?</h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4 px-4">
                      Click to load the interactive focus drill timer
                    </p>
                  </div>
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white min-h-[48px]">
                    <Play className="w-5 h-5 mr-2" />
                    Load Focus Drill
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Progress Tracking */}
        <section id="progress">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mb-3 sm:mb-4 text-sm sm:text-base">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Track Progress</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Your Focus Journey
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Monitor your progress and build momentum over time
            </p>
          </div>
          <ProgressTracker key={progressKey} />
        </section>

        {/* Focus Training Games */}
        <section id="games">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 mb-3 sm:mb-4 text-sm sm:text-base">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Practice & Play</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Focus Training Games
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Evidence-based games to strengthen attention and impulse control
            </p>
          </div>
          <FocusGames />
        </section>

        {/* Evidence & UK Resources */}
        <section id="resources">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 mb-3 sm:mb-4 text-sm sm:text-base">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Evidence Base</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Research & UK Resources
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Why focus sprints work and where to find additional support
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
                <Brain className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <span className="min-w-0">The Science Behind Focus Sprints</span>
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Evidence-based approach to building sustained attention
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="min-w-0">Research Evidence</span>
                </h4>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Short, structured focus intervals with recovery breaks help manage cognitive load and reduce attention fatigue. 
                  Research shows that 5–15 minute work blocks can be more effective than longer sessions for individuals with ADHD, 
                  as they align better with natural attention spans and provide more frequent reinforcement opportunities.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm sm:text-base">Trusted UK Resources:</h4>
                <div className="grid gap-3">
                  {ukResources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all border-2 hover:border-blue-300 dark:hover:border-blue-700 group"
                    >
                      <div className="flex items-start justify-between gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h5 className="font-semibold text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors min-w-0 break-words">
                              {resource.name}
                            </h5>
                            <Badge variant="outline" className="text-xs flex-shrink-0">{resource.category}</Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground break-words">
                            {resource.description}
                          </p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Download Resources */}
        <section id="downloads">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 mb-3 sm:mb-4 text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Downloads</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
              Focus Training Resources
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Printable guides and worksheets to support your practice
            </p>
          </div>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Focus Sprint Planning Guide</CardTitle>
              <CardDescription className="text-sm">
                Printable PDF with planning templates, checklists, and tracking sheets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
                <AlertDescription className="text-xs sm:text-sm">
                  <strong>Coming soon:</strong> We're preparing comprehensive PDF resources including focus planning templates, 
                  progress tracking sheets, and workplace accommodation request letters. Check back soon!
                </AlertDescription>
              </Alert>
              <Button 
                variant="outline" 
                size="lg" 
                disabled 
                className="w-full min-h-[48px]"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Emergency & Urgent Help */}
        <section id="emergency-help">
          <EmergencyHelp />
        </section>

      </div>

      {/* Timer Panel (floating) */}
      {activeProtocol && (
        <TimerPanel
          protocol={activeProtocol}
          onClose={() => setActiveProtocol(null)}
          onComplete={handleProtocolComplete}
        />
      )}
    </main>
  );
}
