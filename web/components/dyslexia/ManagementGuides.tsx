'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, GraduationCap, Heart, CheckCircle } from 'lucide-react';

type Role = 'parent' | 'teacher' | 'carer';

const guides: Record<Role, { title: string; icon: any; color: string; sections: Array<{ title: string; tips: string[] }> }> = {
  parent: {
    title: 'Guide for Parents',
    icon: Users,
    color: 'blue',
    sections: [
      {
        title: 'Daily Support Strategies',
        tips: [
          'Read together every day, even for just 10-15 minutes',
          'Let your child choose books that interest them',
          'Use audiobooks alongside print books',
          'Practice sight words using flashcards or games',
          'Celebrate effort and progress, not just success',
          'Create a quiet, organized study space',
          'Break tasks into smaller, manageable chunks',
        ],
      },
      {
        title: 'Homework Help',
        tips: [
          'Allow extra time for reading and writing tasks',
          'Read instructions aloud together',
          'Use graphic organizers for planning',
          'Let your child dictate answers while you write',
          'Take regular breaks to avoid frustration',
          'Focus on understanding, not perfect spelling',
          'Communicate with teachers about challenges',
        ],
      },
      {
        title: 'Emotional Support',
        tips: [
          'Acknowledge that dyslexia is not a reflection of intelligence',
          'Share stories of successful dyslexic individuals',
          'Focus on your child\'s strengths and talents',
          'Validate feelings of frustration',
          'Build confidence through activities they excel in',
          'Avoid comparisons with siblings or peers',
          'Seek professional support if anxiety develops',
        ],
      },
      {
        title: 'Advocacy & School Communication',
        tips: [
          'Request formal assessment if needed',
          'Understand your child\'s rights under the SEND Code',
          'Attend all school meetings about your child',
          'Keep written records of communications',
          'Ask for reasonable adjustments (extra time, assistive tech)',
          'Collaborate with teachers on strategies',
          'Consider joining parent support groups',
        ],
      },
    ],
  },
  teacher: {
    title: 'Guide for Teachers',
    icon: GraduationCap,
    color: 'purple',
    sections: [
      {
        title: 'Classroom Accommodations',
        tips: [
          'Provide handouts instead of requiring copying from the board',
          'Give extra time for tests and written work',
          'Allow use of assistive technology (spell-check, text-to-speech)',
          'Offer alternative ways to demonstrate knowledge (oral, video)',
          'Use larger fonts and clear formatting',
          'Reduce amount of text per page',
          'Provide audio versions of texts',
        ],
      },
      {
        title: 'Teaching Strategies',
        tips: [
          'Use multisensory teaching (visual, auditory, kinesthetic)',
          'Teach phonics explicitly and systematically',
          'Break instructions into small steps',
          'Use visual aids and graphic organizers',
          'Provide word banks for writing tasks',
          'Pre-teach vocabulary before lessons',
          'Review and reinforce previous learning',
        ],
      },
      {
        title: 'Assessment Approaches',
        tips: [
          'Focus on content knowledge, not spelling',
          'Allow oral presentations instead of essays',
          'Provide questions in advance when possible',
          'Use multiple-choice alongside written answers',
          'Give credit for correct ideas despite spelling errors',
          'Allow typed responses instead of handwritten',
          'Consider portfolio-based assessment',
        ],
      },
      {
        title: 'Building Confidence',
        tips: [
          'Highlight strengths and celebrate small wins',
          'Avoid asking dyslexic students to read aloud unexpectedly',
          'Provide positive, specific feedback',
          'Create opportunities for success',
          'Foster a classroom culture that values all learners',
          'Educate classmates about learning differences',
          'Monitor for signs of frustration or anxiety',
        ],
      },
    ],
  },
  carer: {
    title: 'Guide for Carers',
    icon: Heart,
    color: 'emerald',
    sections: [
      {
        title: 'Understanding Needs',
        tips: [
          'Learn about dyslexia and how it affects the individual',
          'Recognize that struggles are not due to laziness',
          'Understand that dyslexia affects people differently',
          'Be patient with reading and writing tasks',
          'Ask how you can best support them',
          'Respect their preferred learning methods',
          'Acknowledge and celebrate their unique strengths',
        ],
      },
      {
        title: 'Communication Tips',
        tips: [
          'Give instructions one step at a time',
          'Use clear, simple language',
          'Repeat and rephrase when needed',
          'Check for understanding without being condescending',
          'Be an active listener',
          'Avoid rushing them when they\'re reading or writing',
          'Encourage them to ask questions',
        ],
      },
      {
        title: 'Daily Living Support',
        tips: [
          'Help with organization and time management',
          'Use visual schedules and reminders',
          'Assist with reading important documents',
          'Encourage use of technology (voice-to-text, audiobooks)',
          'Be available to help without taking over',
          'Support independence while offering help when needed',
          'Advocate for reasonable adjustments in work/education',
        ],
      },
      {
        title: 'Building Self-Esteem',
        tips: [
          'Focus on abilities, not disabilities',
          'Encourage pursuit of interests and hobbies',
          'Share success stories of people with dyslexia',
          'Avoid making comparisons',
          'Celebrate achievements, no matter how small',
          'Foster a growth mindset',
          'Connect with support groups and communities',
        ],
      },
    ],
  },
};

export function ManagementGuides() {
  const [activeRole, setActiveRole] = useState<Role>('parent');
  const currentGuide = guides[activeRole];
  const IconComponent = currentGuide.icon;

  return (
    <section id="guides" className="space-y-4">
      {/* Section Header */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Management Guides</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Practical, evidence-based strategies for parents, teachers, and carers supporting individuals with dyslexia.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Selector */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeRole === 'parent' ? 'default' : 'outline'}
          onClick={() => setActiveRole('parent')}
          className="flex-1 sm:flex-none"
        >
          <Users className="w-4 h-4 mr-2" />
          For Parents
        </Button>
        <Button
          variant={activeRole === 'teacher' ? 'default' : 'outline'}
          onClick={() => setActiveRole('teacher')}
          className="flex-1 sm:flex-none"
        >
          <GraduationCap className="w-4 h-4 mr-2" />
          For Teachers
        </Button>
        <Button
          variant={activeRole === 'carer' ? 'default' : 'outline'}
          onClick={() => setActiveRole('carer')}
          className="flex-1 sm:flex-none"
        >
          <Heart className="w-4 h-4 mr-2" />
          For Carers
        </Button>
      </div>

      {/* Guide Content */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-${currentGuide.color}-100 dark:bg-${currentGuide.color}-900/50`}>
              <IconComponent className={`w-6 h-6 text-${currentGuide.color}-600 dark:text-${currentGuide.color}-400`} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{currentGuide.title}</h3>
          </div>

          {currentGuide.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-${currentGuide.color}-100 dark:bg-${currentGuide.color}-900/50 flex items-center justify-center`}>
                  <span className={`text-sm font-bold text-${currentGuide.color}-600 dark:text-${currentGuide.color}-400`}>
                    {index + 1}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-foreground">{section.title}</h4>
              </div>
              <ul className="space-y-2 pl-10">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex} className="flex items-start gap-2">
                    <CheckCircle className={`w-4 h-4 text-${currentGuide.color}-600 dark:text-${currentGuide.color}-400 flex-shrink-0 mt-0.5`} />
                    <span className="text-sm text-muted-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Note */}
      <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
        <CardContent className="p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-foreground">⚠️ Important Reminders</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Consistency is key:</strong> Regular, short practice sessions are more effective than long, infrequent ones.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Collaborate:</strong> Parents, teachers, and carers should work together and share strategies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Seek professional help:</strong> These strategies complement, but don't replace, specialized instruction.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Be patient:</strong> Progress takes time. Celebrate every small victory along the way.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
