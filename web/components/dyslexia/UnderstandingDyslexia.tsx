'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, AlertCircle, CheckCircle, XCircle, Brain, Users, School } from 'lucide-react';

export function UnderstandingDyslexia() {
  const [activeTab, setActiveTab] = useState<'definition' | 'signs' | 'myths'>('definition');

  return (
    <section id="understanding" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
              <Brain className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Understanding Dyslexia</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Evidence-based information about dyslexia, its signs, and what it means for learning and development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === 'definition' ? 'default' : 'outline'}
          onClick={() => setActiveTab('definition')}
          className="flex-1 sm:flex-none"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          What is Dyslexia?
        </Button>
        <Button
          variant={activeTab === 'signs' ? 'default' : 'outline'}
          onClick={() => setActiveTab('signs')}
          className="flex-1 sm:flex-none"
        >
          <AlertCircle className="w-4 h-4 mr-2" />
          Signs & Symptoms
        </Button>
        <Button
          variant={activeTab === 'myths' ? 'default' : 'outline'}
          onClick={() => setActiveTab('myths')}
          className="flex-1 sm:flex-none"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Myths vs Facts
        </Button>
      </div>

      {/* Content Panels */}
      {activeTab === 'definition' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-bold text-foreground mb-2">Official Definition (NHS)</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Dyslexia is a common learning difficulty that primarily affects the skills involved in accurate and fluent word reading and spelling. 
                  It is a neurological condition that affects the way the brain processes written and spoken language. 
                  Dyslexia is <strong>not related to intelligence</strong>—many individuals with dyslexia have average or above-average intelligence.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Key Characteristics:</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm text-foreground">Reading Difficulties</h5>
                      <p className="text-xs text-muted-foreground">Problems with word recognition, decoding, and reading fluency</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm text-foreground">Spelling Challenges</h5>
                      <p className="text-xs text-muted-foreground">Inconsistent spelling patterns and difficulty with phonics</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm text-foreground">Phonological Processing</h5>
                      <p className="text-xs text-muted-foreground">Difficulty manipulating sounds in words (phonemes)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">4</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-sm text-foreground">Working Memory</h5>
                      <p className="text-xs text-muted-foreground">Challenges holding and manipulating information in mind</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Strengths of Dyslexic Individuals
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Research shows that people with dyslexia often excel in:
                </p>
                <ul className="grid gap-2 md:grid-cols-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Creative thinking and problem-solving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Visual-spatial reasoning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Big-picture thinking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Entrepreneurship and innovation</span>
                  </li>
                </ul>
              </div>

              <div className="text-xs text-muted-foreground italic border-t pt-3">
                <strong>Sources:</strong> NHS UK, British Dyslexia Association, International Dyslexia Association, Yale Center for Dyslexia & Creativity
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'signs' && (
        <Card>
          <CardContent className="p-6 space-y-6">
            <p className="text-sm text-muted-foreground">
              Signs of dyslexia vary by age and individual. Early identification and support lead to better outcomes.
            </p>

            {/* Preschool */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-foreground">Preschool (Ages 3-5)</h3>
              </div>
              <ul className="space-y-2 pl-7">
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Delayed speech development or difficulty pronouncing words</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Trouble learning nursery rhymes or recognizing rhyming patterns</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Difficulty learning letters and their sounds</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Problems with sequencing (e.g., days of the week, alphabet)</span>
                </li>
              </ul>
            </div>

            {/* Primary School */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-foreground">Primary School (Ages 5-11)</h3>
              </div>
              <ul className="space-y-2 pl-7">
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Reading below expected level for age</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Problems processing and remembering what they hear</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Difficulty finding the right word or forming answers</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Trouble remembering sequences or following multi-step instructions</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Confusing similar-looking letters (b/d, p/q) or numbers (6/9)</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>Spelling words inconsistently (correct one day, incorrect the next)</span>
                </li>
              </ul>
            </div>

            {/* Teenagers & Adults */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-foreground">Teenagers & Adults</h3>
              </div>
              <ul className="space-y-2 pl-7">
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Slow reading speed and avoiding reading aloud</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Poor spelling, even of common words</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Difficulty summarizing stories or information</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Trouble learning foreign languages</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Difficulty with time management and organization</span>
                </li>
                <li className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>Preference for listening to audiobooks over reading</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-muted-foreground">
                <strong>Important:</strong> Having some of these signs doesn't necessarily mean dyslexia. 
                If you're concerned, seek a professional assessment from an educational psychologist or specialist teacher. 
                Early intervention makes a significant difference.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'myths' && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              There are many misconceptions about dyslexia. Let's separate fact from fiction with evidence-based information.
            </p>

            {/* Myth 1 */}
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-3 mb-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">MYTH: Dyslexia means seeing letters backwards</h4>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-8">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">FACT:</h4>
                  <p className="text-sm text-muted-foreground">
                    While some dyslexic individuals may reverse letters (especially b/d), this is not the defining feature. 
                    Dyslexia primarily affects phonological processing—the ability to recognize and manipulate sounds in words. 
                    Letter reversals can occur in young children with or without dyslexia.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 2 */}
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-3 mb-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">MYTH: Dyslexia is a sign of low intelligence</h4>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-8">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">FACT:</h4>
                  <p className="text-sm text-muted-foreground">
                    Dyslexia has absolutely nothing to do with intelligence. Many people with dyslexia have average or above-average IQs. 
                    Famous dyslexic individuals include Albert Einstein, Richard Branson, Steven Spielberg, and many other highly successful people. 
                    Dyslexia is a different way the brain processes language.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 3 */}
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-3 mb-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">MYTH: Children will outgrow dyslexia</h4>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-8">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">FACT:</h4>
                  <p className="text-sm text-muted-foreground">
                    Dyslexia is a lifelong condition. However, with proper intervention and support, individuals can develop strong compensatory strategies and skills. 
                    Early, intensive, evidence-based instruction can dramatically improve reading abilities. The brain can be "rewired" through structured practice.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 4 */}
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-3 mb-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">MYTH: Dyslexia only affects reading</h4>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-8">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">FACT:</h4>
                  <p className="text-sm text-muted-foreground">
                    While reading is the most affected area, dyslexia can also impact spelling, writing, organization, time management, 
                    and even processing speed. It can affect academic performance across subjects, particularly when reading is required.
                  </p>
                </div>
              </div>
            </div>

            {/* Myth 5 */}
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <div className="flex items-start gap-3 mb-3">
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">MYTH: Dyslexia is rare</h4>
                </div>
              </div>
              <div className="flex items-start gap-3 pl-8">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground mb-1">FACT:</h4>
                  <p className="text-sm text-muted-foreground">
                    Dyslexia affects approximately 10-15% of the population (1 in 10 people), making it one of the most common learning differences. 
                    It affects people of all backgrounds, races, and socioeconomic levels equally.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground italic border-t pt-3">
              <strong>Sources:</strong> International Dyslexia Association, British Dyslexia Association, NHS UK, Scientific research from Yale University and Stanford University
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
