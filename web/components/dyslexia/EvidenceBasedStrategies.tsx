'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Brain, Headphones, PenTool, BookMarked } from 'lucide-react';

const strategies = [
  {
    title: 'Multisensory Learning',
    icon: Brain,
    color: 'blue',
    description: 'Engage multiple senses simultaneously to strengthen neural pathways',
    evidence: 'Research shows multisensory instruction significantly improves reading outcomes for dyslexic learners (Moats & Dakin, 2008)',
    techniques: [
      'See-Say-Write: Look at a letter, say its sound, write or trace it',
      'Sand/Salt Trays: Write letters in textured materials while saying sounds',
      'Air Writing: Form letters in the air with large arm movements',
      'Color Coding: Use different colors for vowels vs. consonants',
      'Body Movements: Associate sounds with physical gestures',
    ],
  },
  {
    title: 'Structured Literacy Approach',
    icon: BookMarked,
    color: 'purple',
    description: 'Systematic, explicit teaching of language structure',
    evidence: 'The "gold standard" recommended by the International Dyslexia Association; proven effective in numerous studies',
    techniques: [
      'Phonology: Explicit instruction in sound structure',
      'Sound-Symbol Association: Teaching letter-sound relationships systematically',
      'Syllable Patterns: Breaking words into manageable chunks',
      'Morphology: Understanding word parts (prefixes, suffixes, roots)',
      'Syntax: Learning sentence structure and grammar',
      'Semantics: Building vocabulary and meaning',
    ],
  },
  {
    title: 'Assistive Technology',
    icon: Headphones,
    color: 'emerald',
    description: 'Use technology to bypass reading barriers and support learning',
    evidence: 'Studies show assistive tech reduces cognitive load and improves comprehension for dyslexic readers (Woodfine et al., 2008)',
    techniques: [
      'Text-to-Speech: Have digital text read aloud',
      'Speech-to-Text: Dictate writing instead of typing',
      'Audiobooks: Access literature at comprehension level',
      'Word Prediction: Reduce spelling burden',
      'Digital Note-Taking: Organize information visually',
      'E-Readers: Adjust font, size, spacing, and background color',
    ],
  },
  {
    title: 'Repeated Reading for Fluency',
    icon: PenTool,
    color: 'orange',
    description: 'Read the same passage multiple times to build automaticity',
    evidence: 'A 2017 meta-analysis found repeated reading "highly effective" for improving fluency in students with reading disabilities',
    techniques: [
      'Choose passages at appropriate difficulty level',
      'Read the same text 3-5 times',
      'Track words per minute (WPM) to monitor progress',
      'Use paired/echo reading with a fluent reader',
      'Record yourself and listen back',
      'Focus on accuracy first, then speed and expression',
    ],
  },
  {
    title: 'Metacognitive Strategies',
    icon: Lightbulb,
    color: 'pink',
    description: 'Teach learners to think about their own thinking and learning',
    evidence: 'Research shows explicit strategy instruction improves comprehension and self-regulation (National Reading Panel, 2000)',
    techniques: [
      'Preview-Question-Read-Summarize (PQRS)',
      'Visualizing: Create mental images while reading',
      'Self-Questioning: Ask "what, why, how" questions',
      'Monitoring: Notice when understanding breaks down',
      'Clarifying: Re-read or seek help when confused',
      'Connecting: Link new information to prior knowledge',
    ],
  },
];

export function EvidenceBasedStrategies() {
  return (
    <section id="strategies" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-pink-100 dark:bg-pink-900/50">
              <Lightbulb className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Evidence-Based Strategies</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scientifically-proven approaches for dyslexia intervention. These methods are backed by research 
                from leading institutions and recommended by expert organizations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategies */}
      {strategies.map((strategy, index) => {
        const IconComponent = strategy.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 p-3 rounded-lg bg-${strategy.color}-100 dark:bg-${strategy.color}-900/50`}>
                  <IconComponent className={`w-6 h-6 text-${strategy.color}-600 dark:text-${strategy.color}-400`} />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-foreground">{strategy.title}</h3>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                </div>
              </div>

              <div className="pl-[4.5rem] space-y-4">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-blue-700 dark:text-blue-300">📊 Research Evidence:</strong> {strategy.evidence}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">How to Implement:</h4>
                  <ul className="space-y-2">
                    {strategy.techniques.map((technique, techIndex) => (
                      <li key={techIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className={`font-bold text-${strategy.color}-600 dark:text-${strategy.color}-400`}>•</span>
                        <span>{technique}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Sources */}
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20">
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">📚 Key Research Sources</h3>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p>• <strong>International Dyslexia Association (IDA):</strong> Structured Literacy guidelines</p>
              <p>• <strong>National Reading Panel (2000):</strong> Teaching Children to Read</p>
              <p>• <strong>Moats & Dakin (2008):</strong> Basic Facts About Dyslexia</p>
              <p>• <strong>Meta-analysis (2017):</strong> Repeated Reading interventions for students with learning disabilities</p>
              <p>• <strong>Yale Center for Dyslexia & Creativity:</strong> Evidence-based reading interventions</p>
              <p>• <strong>British Dyslexia Association:</strong> Best practice guidelines</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
