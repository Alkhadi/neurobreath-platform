'use client';

import { PhonicsPlayer } from '@/components/PhonicsPlayer';
import { PhonicsSoundsLab } from '@/components/PhonicsSoundsLab';
import { VowelUniverse } from '@/components/VowelUniverse';
import { PrintableWorksheets } from '@/components/PrintableWorksheets';
import { RewardCards } from '@/components/RewardCards';
import { StreakToolkit } from '@/components/StreakToolkit';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { ReadingLevelProvider } from '@/contexts/ReadingLevelContext';

export default function DyslexiaReadingTrainingPage() {
  return (
    <ReadingLevelProvider>
      <ProgressProvider>
        <div className="min-h-screen bg-background">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-12">
            
            {/* Hero Section */}
            <section className="text-center space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold">
                Dyslexia Reading Training • NeuroBreath
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                Phonics & Reading Practice
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Master letter sounds, vowel patterns, and reading skills with structured practice and breathing breaks.
              </p>
            </section>

            {/* Streak Toolkit */}
            <StreakToolkit />

            {/* Phonics Song Player */}
            <PhonicsPlayer />

            {/* Phonics Sounds Lab - Full A-Z with celebrations */}
            <PhonicsSoundsLab />

            {/* Vowel Universe Map */}
            <VowelUniverse />

            {/* Printable Worksheets */}
            <PrintableWorksheets />

            {/* NeuroBreath Reward Cards */}
            <RewardCards />

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
      </ProgressProvider>
    </ReadingLevelProvider>
  );
}
