'use client';

import { useState, useRef } from 'react';
import { PhonicsPlayer } from '@/components/PhonicsPlayer';
import { PhonicsSoundsLab } from '@/components/PhonicsSoundsLab';
import { VowelUniverse } from '@/components/VowelUniverse';
import { PrintableWorksheets } from '@/components/PrintableWorksheets';
import { RewardCards } from '@/components/RewardCards';
import { StreakToolkit } from '@/components/StreakToolkit';
import { CreateProfile } from '@/components/CreateProfile';
import { PracticeTimer } from '@/components/PracticeTimer';
import { BreathingExercise } from '@/components/BreathingExercise';
import { ReadingAssessment } from '@/components/ReadingAssessment';
import { RapidNaming } from '@/components/RapidNaming';
import WordConstruction from '@/components/WordConstruction';
import FluencyPacer from '@/components/FluencyPacer';
import PronunciationPractice from '@/components/PronunciationPractice';
import SyllableSplitter from '@/components/SyllableSplitter';
import VocabularyRecognition from '@/components/VocabularyRecognition';
import VocabularyBuilder from '@/components/VocabularyBuilder';
import BeginSessionModal from '@/components/BeginSessionModal';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { ReadingLevelProvider } from '@/contexts/ReadingLevelContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

type TrainingApproach = 'focused' | 'direct' | 'fluency';

export default function DyslexiaReadingTrainingPage() {
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const breathingRef = useRef<HTMLDivElement>(null);
  const phonicsRef = useRef<HTMLDivElement>(null);
  const fluencyRef = useRef<HTMLDivElement>(null);

  const handleStartSession = (approach: TrainingApproach) => {
    // Record session start in localStorage
    const now = new Date().toISOString();
    localStorage.setItem('lastSessionStart', now);
    localStorage.setItem('lastSessionApproach', approach);

    // Navigate to appropriate section based on approach
    setTimeout(() => {
      if (approach === 'focused' && breathingRef.current) {
        breathingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (approach === 'direct' && phonicsRef.current) {
        phonicsRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (approach === 'fluency' && fluencyRef.current) {
        fluencyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  };

  return (
    <ReadingLevelProvider>
      <ProgressProvider>
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-12">
            
            {/* Hero Section with Profile Creation - Two Card Layout */}
            <section data-tutorial="hero" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Card - Hero/Introduction */}
              <Card className="overflow-hidden border-2 border-primary/20">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold">
                      Dyslexia Reading Training • NeuroBreath
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                      Professional Reading Development
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Evidence-based techniques for efficient skill enhancement.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full gap-2 bg-[#4A7C9D] hover:bg-[#3d6680]"
                      onClick={() => setSessionModalOpen(true)}
                    >
                      <GraduationCap className="w-5 h-5" />
                      Begin Training
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const timerSection = document.querySelector('[data-tutorial="timer"]');
                        timerSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                    >
                      Daily Practice
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const heroSection = document.querySelector('[data-tutorial="hero"]');
                        heroSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      Learn More
                    </Button>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-muted-foreground">No login required</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-muted-foreground">Saves privately on device</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-muted-foreground">Dyslexia-friendly design</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Card - Profile Creation */}
              <CreateProfile />
            </section>

            {/* Streak Toolkit */}
            <div data-tutorial="streak">
              <StreakToolkit />
            </div>

            {/* Practice Timer */}
            <div data-tutorial="timer">
              <PracticeTimer />
            </div>

            {/* Breathing Exercise */}
            <div ref={breathingRef} data-tutorial="breathing">
              <BreathingExercise />
            </div>

            {/* Reading Assessment */}
            <ReadingAssessment />

            {/* Phonics Song Player */}
            <div ref={phonicsRef} data-tutorial="phonics">
              <PhonicsPlayer />
            </div>

            {/* Phonics Sounds Lab - Full A-Z with celebrations */}
            <div data-tutorial="phonics-lab">
              <PhonicsSoundsLab />
            </div>

            {/* Vowel Universe Map */}
            <div data-tutorial="vowels">
              <VowelUniverse />
            </div>

            {/* Rapid Naming Game */}
            <RapidNaming />

            {/* Word Construction */}
            <div data-tutorial="wordbuilder">
              <WordConstruction />
            </div>

            {/* Fluency Pacer */}
            <div ref={fluencyRef} data-tutorial="fluency">
              <FluencyPacer />
            </div>

            {/* Pronunciation Practice */}
            <PronunciationPractice />

            {/* Syllable Splitter */}
            <div data-tutorial="syllables">
              <SyllableSplitter />
            </div>

            {/* Vocabulary Recognition */}
            <VocabularyRecognition />

            {/* Vocabulary Builder */}
            <VocabularyBuilder />

            {/* Printable Worksheets */}
            <PrintableWorksheets />

            {/* NeuroBreath Reward Cards */}
            <div data-tutorial="rewards">
              <RewardCards />
            </div>

            {/* Footer */}
            <footer className="text-center py-6 sm:py-8 border-t border-border">
              <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
                Reading Training Hub by NeuroBreath. All progress saves privately on your device.
              </p>
              <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
                Based on structured literacy and evidence-based reading interventions.
              </p>
            </footer>
          </main>
        </div>

        {/* Begin Session Modal */}
        <BeginSessionModal
          open={sessionModalOpen}
          onOpenChange={setSessionModalOpen}
          onStartSession={handleStartSession}
        />
      </ProgressProvider>
    </ReadingLevelProvider>
  );
}
