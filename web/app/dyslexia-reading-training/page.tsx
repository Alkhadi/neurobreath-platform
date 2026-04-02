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
import { EvidenceFooter } from '@/components/evidence-footer';
import { evidenceByRoute } from '@/lib/evidence/page-evidence';
import { CredibilityFooter } from '@/components/trust/CredibilityFooter';
import { createChangeLog, createChangeLogEntry } from '@/lib/editorial/changeLog';
import { createCitationsSummary, createEditorialMeta } from '@/lib/editorial/pageEditorial';
import type { Region } from '@/lib/region/region';
// New Evidence-Based Components
import { RhythmTraining } from '@/components/RhythmTraining';
import { RapidNamingTest } from '@/components/RapidNamingTest';
import { MorphologyMaster } from '@/components/MorphologyMaster';
import { LetterReversalTraining } from '@/components/LetterReversalTraining';
import { BlendingSegmentingLab } from '@/components/BlendingSegmentingLab';
import { DownloadableResources } from '@/components/DownloadableResources';
import { AssessmentHistory } from '@/components/AssessmentHistory';

type TrainingApproach = 'focused' | 'direct' | 'fluency';

const evidence = evidenceByRoute['/dyslexia-reading-training'];

export default function DyslexiaReadingTrainingPage() {
  const region: Region = 'UK';
  const editorial = createEditorialMeta({
    authorId: 'nb-editorial-team',
    reviewerId: 'nb-evidence-review',
    editorialRoleNotes: 'Reviewed for clarity, safety language, and evidence framing.',
    createdAt: '2026-01-16',
    updatedAt: '2026-01-17',
    reviewedAt: '2026-01-17',
    reviewIntervalDays: 120,
    changeLog: createChangeLog([
      createChangeLogEntry('2026-01-17', 'Credibility footer and review details added.', 'safety'),
    ]),
    citationsSummary: createCitationsSummary(evidence?.citations?.length ?? 0, ['A', 'B']),
  });
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

  const containerCls = "mx-auto px-3 sm:px-4 w-[96vw] sm:w-[94vw] md:w-[90vw] lg:w-[86vw] max-w-[1400px]";

  return (
    <ReadingLevelProvider>
      <ProgressProvider>
        <div className="min-h-screen overflow-x-hidden bg-background">

          {/* ── Band 1: Hero — background image + dark overlay ── */}
          <section
            data-tutorial="hero"
            className="relative overflow-hidden py-8 sm:py-16 lg:py-20"
            style={{
              backgroundImage: 'url("/images/home/home-section-bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/20 dark:from-black/55 dark:via-black/40 dark:to-black/35"
              aria-hidden="true"
            />
            <div className={`relative z-10 ${containerCls} space-y-6 sm:space-y-8 py-2 sm:py-4`}>

              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4A7C9D]/80 border border-[#4A7C9D]/50 text-white text-xs sm:text-sm font-semibold">
                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Dyslexia Reading Training</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Dyslexia Reading Training
                </h1>
                <p className="text-sm sm:text-lg text-white/85 leading-relaxed max-w-3xl">
                  Systematic, explicit, multisensory instruction based on the science of reading. Engaging sight, sound, and movement to reinforce letter-sound correspondences and word patterns.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-lg">
                <Button
                  size="default"
                  className="gap-2 bg-[#4A7C9D] hover:bg-[#3d6680] text-white flex-1 text-sm sm:text-base"
                  onClick={() => setSessionModalOpen(true)}
                >
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                  Begin Training
                </Button>
                <Button
                  size="default"
                  className="gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/40 flex-1 text-sm sm:text-base"
                  onClick={() => {
                    const timerSection = document.querySelector('[data-tutorial="timer"]');
                    timerSection?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                >
                  Daily Practice
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 sm:gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/85">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  No login required
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/85">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  Saves privately on device
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/85">
                  <div className="w-2 h-2 rounded-full bg-orange-400" />
                  Dyslexia-friendly design
                </div>
              </div>
            </div>
          </section>

          {/* ── Band 2: Assessment & Preparation — soft blue ── */}
          <section className="bg-blue-50/70 dark:bg-blue-950/10 py-8 sm:py-12 md:py-16 lg:py-20">
            <div className={`${containerCls} space-y-4 sm:space-y-8`}>
              <div className="pb-2 border-b border-blue-200 dark:border-blue-800">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Assessment &amp; Preparation</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Check your current level, track progress, set a daily streak, and prepare with a practice timer and breathing exercise.</p>
              </div>

              {/* Evidence banner */}
              <Card className="bg-white dark:bg-gray-900/60 border-blue-200 dark:border-blue-800">
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div className="flex-1 space-y-1.5 sm:space-y-2">
                        <h2 className="text-base sm:text-lg font-bold text-foreground">Evidence-Based Reading Development</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          This program implements <strong>Structured Literacy</strong> principles—the gold-standard approach recommended by the International Dyslexia Association.
                          Our methods are informed by research from leading organizations including the British Dyslexia Association, Yale Center for Dyslexia &amp; Creativity, Reading Rockets,
                          and National Center on Improving Literacy.
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2 [&>*]:basis-[calc(50%-4px)] md:[&>*]:basis-[calc(33.333%-5px)] [&>*]:min-w-0">
                          {['Phonology','Sound-Symbol','Morphology','Syntax','Semantics','Fluency'].map(t => (
                            <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                              <span>{t}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground pt-2 border-t border-blue-200 dark:border-blue-800">
                      <p className="italic">
                        <strong>Educational Resource:</strong> This tool provides educational activities only. Always pair with professional assessment and guidance.
                        Research shows early intervention yields the best outcomes, but it&apos;s never too late—adults can also make substantial gains with evidence-based strategies.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ReadingCheckIn />
              <AssessmentHistory />
              <div data-tutorial="streak"><StreakToolkit /></div>
              <div id="practice-timer" data-tutorial="timer"><PracticeTimer /></div>
              <div id="focus-reset" ref={breathingRef} data-tutorial="breathing"><BreathingExercise /></div>
            </div>
          </section>

          {/* ── Band 3: Phonological Awareness — green tint ── */}
          <section className="bg-green-50/60 dark:bg-green-950/10 py-8 sm:py-12 lg:py-20">
            <div className={`${containerCls} space-y-4 sm:space-y-8`}>
              <div className="pb-2 border-b border-green-200 dark:border-green-800">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Phonological Awareness</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Foundational sound training — the skill most directly linked to reading success.</p>
              </div>

              <Card className="bg-white dark:bg-gray-900/60">
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                      Phonological Awareness Training
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong>Research Foundation:</strong> Phonological awareness is a foundational skill for reading. Studies show targeted training has a <strong>direct impact on reading success</strong>.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Sound Segmentation','Blending','Rhyming','Multisensory'].map(t => (
                        <span key={t} className="badge-nb badge-nb-success">{t}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div id="phonics" ref={phonicsRef} data-tutorial="phonics"><PhonicsPlayer /></div>
              <div data-tutorial="phonics-lab"><PhonicsSoundsLab /></div>
              <div data-tutorial="vowels"><VowelUniverse /></div>
              <div id="blending" data-tutorial="blending-segmenting"><BlendingSegmentingLab /></div>
              <div data-tutorial="rhythm-training"><RhythmTraining /></div>
              <div data-tutorial="letter-reversal"><LetterReversalTraining /></div>
              <RapidNamingTest />
            </div>
          </section>

          {/* ── Band 4: Decoding & Fluency — white ── */}
          <section className="bg-white dark:bg-gray-950 py-8 sm:py-12 lg:py-20">
            <div className={`${containerCls} space-y-4 sm:space-y-8`}>
              <div className="pb-2 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Decoding &amp; Fluency</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Word-level mastery and reading speed — the bridge between phonics and comprehension.</p>
              </div>

              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      Decoding &amp; Phonics
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong>Research:</strong> Systematic, explicit phonics instruction is the remedy for decoding difficulties. Multisensory techniques cement letter-sound connections.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Letter-Sound Mapping','Word Building','Syllable Patterns'].map(t => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{t}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div data-tutorial="wordbuilder"><WordConstruction /></div>
              <div id="syllables" data-tutorial="syllables"><SyllableSplitter /></div>
              <div id="morphology" data-tutorial="morphology"><MorphologyMaster /></div>

              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Fluency Development
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong>Research:</strong> A meta-analysis of 34 studies found <strong>Repeated Reading</strong> to be highly effective for improving fluency. Fluency directly boosts comprehension.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Repeated Reading','Phrasing Practice','WPM Tracking'].map(t => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">{t}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div id="fluency" ref={fluencyRef} data-tutorial="fluency"><FluencyPacer /></div>
              <PronunciationPractice />
            </div>
          </section>

          {/* ── Band 5: Vocabulary & Comprehension — cyan tint ── */}
          <section className="bg-cyan-50/60 dark:bg-cyan-950/10 py-8 sm:py-12 lg:py-20">
            <div className={`${containerCls} space-y-4 sm:space-y-8`}>
              <div className="pb-2 border-b border-cyan-200 dark:border-cyan-800">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Vocabulary &amp; Comprehension</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Word knowledge and meaning-making — the goal of all reading instruction.</p>
              </div>

              <Card className="bg-white dark:bg-gray-900/60">
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Vocabulary &amp; Comprehension
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <strong>Research:</strong> Dyslexic learners often absorb stories more easily by listening. Using audiobooks builds vocabulary at their intellectual level.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {['Word Recognition','Context Building','Spaced Repetition'].map(t => (
                        <span key={t} className="text-xs px-2 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">{t}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <VocabularyRecognition />
              <VocabularyBuilder />
            </div>
          </section>

          {/* ── Band 6: Materials & Rewards — indigo tint ── */}
          <section className="bg-indigo-50 dark:bg-indigo-950/15 py-8 sm:py-12 lg:py-20">
            <div className={`${containerCls} space-y-4 sm:space-y-8`}>
              <div className="pb-2 border-b border-indigo-200 dark:border-indigo-800">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Materials &amp; Rewards</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Printable worksheets, motivational reward cards, and downloadable resources.</p>
              </div>

              <PrintableWorksheets />
              <div data-tutorial="rewards"><RewardCards /></div>
              <div data-tutorial="downloadable-resources"><DownloadableResources /></div>
            </div>
          </section>

          {/* ── Band 7: Guidance & Evidence — slate ── */}
          <section className="bg-slate-100 dark:bg-slate-900/40 py-8 sm:py-12 lg:py-20">
            <div className={`${containerCls} space-y-4 sm:space-y-8`}>
              <div className="pb-2 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Guidance for Parents &amp; Educators</h2>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Best practices, key research insights, and expert resources.</p>
              </div>

              <Card>
                <CardContent className="p-3 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap gap-4 [&>*]:basis-full md:[&>*]:basis-[calc(50%-8px)] [&>*]:min-w-0">
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
                          <li><strong>Explicit instruction</strong> is crucial—don&apos;t rely on learners to &ldquo;figure it out&rdquo;</li>
                          <li><strong>Systematic sequencing</strong> from simple to complex with lots of review</li>
                          <li><strong>Repeated reading</strong> is highly effective for building fluency</li>
                          <li><strong>Gamification</strong> increases engagement and practice time</li>
                        </ul>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                      <p className="text-xs text-muted-foreground">
                        <strong>Remember:</strong> Dyslexia is not an intelligence issue—it&apos;s a different wiring of the brain.
                        Many dyslexic individuals have exceptional strengths in creativity, problem-solving, and spatial reasoning.
                        This program complements, but doesn&apos;t replace, professional support.
                      </p>
                    </div>

                    <div className="pt-2">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground mb-1.5 sm:mb-2">Expert Resources:</h4>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {['IDA','Yale Dyslexia','Reading Rockets','BDA','NCIL'].map(r => (
                          <span key={r} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-muted-foreground">{r}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="pt-4">
                <CredibilityFooter editorial={editorial} region={region} />
              </div>
              <div className="pt-2">
                <EvidenceFooter evidence={evidence} />
              </div>
            </div>
          </section>

        </div>

        {/* Begin Session Modal */}
        <Dialog open={sessionModalOpen} onOpenChange={setSessionModalOpen}>
          <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-base sm:text-lg">Begin Training Session</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">Choose your approach</DialogDescription>
            </DialogHeader>
            <div className="grid gap-2.5 sm:gap-4 py-2 sm:py-4">
              <Button onClick={() => { handleStartSession('focused'); setSessionModalOpen(false); }} variant="outline" className="justify-start h-auto p-3 sm:p-4">
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base">🎯 Focused</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Breathing exercises for calm focus</div>
                </div>
              </Button>
              <Button onClick={() => { handleStartSession('direct'); setSessionModalOpen(false); }} variant="outline" className="justify-start h-auto p-3 sm:p-4">
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base">📖 Direct</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Jump into phonics and reading</div>
                </div>
              </Button>
              <Button onClick={() => { handleStartSession('fluency'); setSessionModalOpen(false); }} variant="outline" className="justify-start h-auto p-3 sm:p-4">
                <div className="text-left">
                  <div className="font-semibold text-sm sm:text-base">⚡ Fluency</div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Reading speed and automaticity</div>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      </ProgressProvider>
    </ReadingLevelProvider>
  );
}
