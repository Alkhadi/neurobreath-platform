'use client';

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
import ReadingBuddy from '@/components/ReadingBuddy';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { ReadingLevelProvider } from '@/contexts/ReadingLevelContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

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
                Professional Reading Development
              </h1>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                Evidence-based techniques for efficient skill enhancement.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Button size="lg" className="gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Begin Training
                </Button>
                <Button size="lg" variant="outline">Daily Practice</Button>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground pt-2">
                <span>✓ No login required</span>
                <span>✓ Saves privately on device</span>
                <span>✓ Dyslexia-friendly design</span>
              </div>
            </section>

            {/* Profile Creation */}
            <CreateProfile />

            {/* Reading Buddy */}
            <ReadingBuddy />

            {/* Streak Toolkit */}
            <StreakToolkit />

            {/* Practice Timer */}
            <PracticeTimer />

            {/* Breathing Exercise */}
            <BreathingExercise />

            {/* Reading Assessment */}
            <ReadingAssessment />

            {/* Phonics Song Player */}
            <PhonicsPlayer />

            {/* Phonics Sounds Lab - Full A-Z with celebrations */}
            <PhonicsSoundsLab />

            {/* Vowel Universe Map */}
            <VowelUniverse />

            {/* Rapid Naming Game */}
            <RapidNaming />

            {/* Word Construction */}
            <WordConstruction />

            {/* Fluency Pacer */}
            <FluencyPacer />

            {/* Pronunciation Practice */}
            <PronunciationPractice />

            {/* Syllable Splitter */}
            <SyllableSplitter />

            {/* Vocabulary Recognition */}
            <VocabularyRecognition />

            {/* Vocabulary Builder */}
            <VocabularyBuilder />

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
