'use client';

import { useState, useRef } from 'react';
import { PhonicsPlayer } from '@/components/PhonicsPlayer';
import { PhonicsSoundsLab } from '@/components/PhonicsSoundsLab';
import { VowelUniverse } from '@/components/VowelUniverse';
import { PrintableWorksheets } from '@/components/PrintableWorksheets';
import { RewardCards } from '@/components/RewardCards';
import { StreakToolkit } from '@/components/StreakToolkit';
import { PracticeTimer } from '@/components/PracticeTimer';
import { BreathingExercise } from '@/components/BreathingExercise';
// ReadingAssessment - legacy component, replaced by ReadingCheckIn
// import { ReadingAssessment } from '@/components/ReadingAssessment';
import { ReadingCheckIn } from '@/components/ReadingCheckIn';
import WordConstruction from '@/components/WordConstruction';
import FluencyPacer from '@/components/FluencyPacer';
import PronunciationPractice from '@/components/PronunciationPractice';
import SyllableSplitter from '@/components/SyllableSplitter';
import VocabularyRecognition from '@/components/VocabularyRecognition';
import VocabularyBuilder from '@/components/VocabularyBuilder';
import { ProgressProvider } from '@/contexts/ProgressContext';
import { ReadingLevelProvider } from '@/contexts/ReadingLevelContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { GraduationCap } from 'lucide-react';
// New Evidence-Based Components
import { RhythmTraining } from '@/components/RhythmTraining';
import { RapidNamingTest } from '@/components/RapidNamingTest';
import { MorphologyMaster } from '@/components/MorphologyMaster';
import { LetterReversalTraining } from '@/components/LetterReversalTraining';
import { BlendingSegmentingLab } from '@/components/BlendingSegmentingLab';
import { DownloadableResources } from '@/components/DownloadableResources';
import { AssessmentHistory } from '@/components/AssessmentHistory';

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
        <div className="min-h-screen bg-background pt-4">
          <main className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12 space-y-6 sm:space-y-8 md:space-y-12" style={{ width: '86vw', maxWidth: '86vw' }}>
            
            {/* Hero Section */}
            <section data-tutorial="hero" className="space-y-6">
              {/* Hero/Introduction Card */}
              <Card className="overflow-hidden border-2 border-primary/20">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm uppercase tracking-wider text-primary font-semibold">
                      Dyslexia Reading Training • NeuroBreath
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                      Multisensory Reading Development
                    </h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Systematic, explicit, multisensory instruction based on the science of reading.
                      Engaging sight, sound, and movement to reinforce letter-sound correspondences and word patterns.
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
            </section>

            {/* Evidence-Based Research Banner */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="flex-1 space-y-2">
                      <h2 className="text-lg font-bold text-foreground">Evidence-Based Reading Development</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        This program implements <strong>Structured Literacy</strong> principles—the gold-standard approach recommended by the International Dyslexia Association.
                        Our methods are informed by research from leading organizations including the British Dyslexia Association, Yale Center for Dyslexia & Creativity, Reading Rockets,
                        and National Center on Improving Literacy.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Phonology</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Sound-Symbol</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Morphology</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Syntax</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Semantics</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Fluency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-blue-200 dark:border-blue-800">
                    <p className="italic">
                      <strong>Educational Resource:</strong> This tool provides educational activities only. Always pair with professional assessment and guidance.
                      Research shows early intervention yields the best outcomes, but it's never too late—adults can also make substantial gains with evidence-based strategies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reading Check-In - Multi-Part Assessment (NEW) */}
            <ReadingCheckIn />

            {/* Legacy Quick Assessment (optional - keeping for fallback) */}
            {/* <ReadingAssessment /> */}

            {/* Assessment History */}
            <AssessmentHistory />

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

            {/* Phonological & Phonemic Awareness Section */}
            <section className="space-y-4">
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      Phonological Awareness Training
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Research Foundation:</strong> Phonological awareness—the ability to recognize and manipulate sound structures—is a foundational skill for reading. 
                      Studies show that targeted training in phonemic awareness has a <strong>direct impact on reading success</strong> and can literally change brain activity in dyslexic learners. 
                      Early, intensive intervention yields the best results.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Sound Segmentation</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Blending</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Rhyming</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">Multisensory</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

              {/* Blending & Segmenting Lab - NEW */}
              <div data-tutorial="blending-segmenting">
                <BlendingSegmentingLab />
              </div>

              {/* Rhythm Training Game - NEW */}
              <div data-tutorial="rhythm-training">
                <RhythmTraining />
              </div>

              {/* Letter Reversal Training - NEW */}
              <div data-tutorial="letter-reversal">
                <LetterReversalTraining />
              </div>
            </section>

            {/* Rapid Automatic Naming Test - Enhanced */}
            <RapidNamingTest />

            {/* Decoding & Word Construction Section */}
            <section className="space-y-4">
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Decoding & Phonics Mastery
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Research Foundation:</strong> Systematic, explicit phonics instruction is the remedy for decoding difficulties. 
                      Teaching letter-sound associations in small increments with cumulative practice builds automaticity. Research shows that explicit instruction 
                      is <strong>far more effective than implicit methods</strong>. Multisensory techniques (seeing, saying, writing simultaneously) cement these connections.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Letter-Sound Mapping</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Word Building</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Syllable Patterns</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Word Construction */}
              <div data-tutorial="wordbuilder">
                <WordConstruction />
              </div>

              {/* Syllable Splitter */}
              <div data-tutorial="syllables">
                <SyllableSplitter />
              </div>

              {/* Morphology Master - NEW */}
              <div data-tutorial="morphology">
                <MorphologyMaster />
              </div>
            </section>

            {/* Reading Fluency Section */}
            <section className="space-y-4">
              <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Fluency Development
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Research Foundation:</strong> A 2017 meta-analysis of 34 studies found <strong>Repeated Reading</strong> to be "highly effective" for improving fluency in students with reading disabilities. 
                      Reading the same passage multiple times builds automatic word recognition and smooth delivery. Even adults with lifelong difficulties show substantial gains with this method.
                      Fluency (speed + accuracy + expression) is crucial—improved fluency directly boosts comprehension.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">Repeated Reading</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">Phrasing Practice</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">WPM Tracking</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fluency Pacer */}
              <div ref={fluencyRef} data-tutorial="fluency">
                <FluencyPacer />
              </div>

              {/* Pronunciation Practice */}
              <PronunciationPractice />
            </section>

            {/* Vocabulary & Comprehension Section */}
            <section className="space-y-4">
              <Card className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-950/20 dark:to-teal-950/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Vocabulary & Comprehension
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Research Foundation:</strong> Dyslexic learners often absorb stories more easily by listening than reading. Using audiobooks builds vocabulary and knowledge at their intellectual level. 
                      Explicit comprehension strategy instruction—teaching students to predict, question, visualize, summarize, and clarify—is highly effective. 
                      Yale Center for Dyslexia recommends using multimedia to gain context, which greatly aids comprehension.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">Word Recognition</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">Context Building</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">Spaced Repetition</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vocabulary Recognition */}
              <VocabularyRecognition />

              {/* Vocabulary Builder */}
              <VocabularyBuilder />
            </section>

            {/* Printable Worksheets */}
            <PrintableWorksheets />

            {/* NeuroBreath Reward Cards */}
            <div data-tutorial="rewards">
              <RewardCards />
            </div>

            {/* Downloadable Resources Hub - NEW */}
            <div data-tutorial="downloadable-resources">
              <DownloadableResources />
            </div>

            {/* Parent & Educator Guidance Section */}
            <section className="space-y-4">
              <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Guidance for Parents & Educators
                    </h3>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">✓ Best Practices</h4>
                        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                          <li><strong>Short, frequent sessions</strong> (10-15 minutes) are more effective than long drills</li>
                          <li><strong>Immediate feedback</strong> during practice—correct errors gently in the moment</li>
                          <li><strong>Celebrate small wins</strong> to build confidence and motivation</li>
                          <li><strong>Multisensory practice</strong>—combine seeing, saying, and writing/tracing</li>
                          <li><strong>Read aloud together</strong> daily, even for older learners</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-foreground">⚡ Key Research Insights</h4>
                        <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                          <li><strong>Early intervention</strong> yields best outcomes, but adults can also improve significantly</li>
                          <li><strong>Explicit instruction</strong> is crucial—don't rely on learners to "figure it out"</li>
                          <li><strong>Systematic sequencing</strong> from simple to complex with lots of review</li>
                          <li><strong>Repeated reading</strong> is highly effective for building fluency</li>
                          <li><strong>Gamification</strong> increases engagement and practice time</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                      <p className="text-xs text-muted-foreground">
                        <strong>Remember:</strong> Dyslexia is not an intelligence issue—it's a different wiring of the brain. 
                        Many dyslexic individuals have exceptional strengths in creativity, problem-solving, and spatial reasoning. 
                        This program complements, but doesn't replace, professional support. For persistent difficulties, consult a reading specialist or educational psychologist.
                      </p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-sm font-semibold text-foreground mb-2">Expert Resources Referenced:</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-muted-foreground">International Dyslexia Association</span>
                        <span className="text-xs px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-muted-foreground">Yale Center for Dyslexia</span>
                        <span className="text-xs px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-muted-foreground">Reading Rockets</span>
                        <span className="text-xs px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-muted-foreground">British Dyslexia Association</span>
                        <span className="text-xs px-2 py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-muted-foreground">National Center on Improving Literacy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>

        {/* Begin Session Modal */}
        <Dialog open={sessionModalOpen} onOpenChange={setSessionModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Begin Your Reading Training Session</DialogTitle>
              <DialogDescription>
                Choose your training approach to get started
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                onClick={() => {
                  handleStartSession('focused');
                  setSessionModalOpen(false);
                }}
                variant="outline"
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-semibold">🎯 Focused Approach</div>
                  <div className="text-sm text-muted-foreground">
                    Start with breathing exercises for calm focus
                  </div>
                </div>
              </Button>
              <Button
                onClick={() => {
                  handleStartSession('direct');
                  setSessionModalOpen(false);
                }}
                variant="outline"
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-semibold">📖 Direct Approach</div>
                  <div className="text-sm text-muted-foreground">
                    Jump straight into phonics and reading practice
                  </div>
                </div>
              </Button>
              <Button
                onClick={() => {
                  handleStartSession('fluency');
                  setSessionModalOpen(false);
                }}
                variant="outline"
                className="justify-start h-auto p-4"
              >
                <div className="text-left">
                  <div className="font-semibold">⚡ Fluency Approach</div>
                  <div className="text-sm text-muted-foreground">
                    Focus on reading speed and automaticity
                  </div>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </ProgressProvider>
    </ReadingLevelProvider>
  );
}
