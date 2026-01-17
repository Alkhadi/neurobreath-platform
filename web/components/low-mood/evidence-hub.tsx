'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Users, Zap, Heart, Sun, Book, CheckCircle2, type LucideIcon } from 'lucide-react';

interface Evidence {
  id: string;
  title: string;
  finding: string;
  source: string;
  year: string;
  category: 'behavioral' | 'physical' | 'social' | 'psychological' | 'lifestyle';
  icon: LucideIcon;
  strength: 'strong' | 'moderate' | 'emerging';
  keyPoints: string[];
}

const evidence: Evidence[] = [
  {
    id: 'behavioral-activation-nice',
    title: 'Behavioral Activation for Depression',
    finding: 'Behavioral activation shows comparable effectiveness to CBT for treating depression',
    source: 'NICE Clinical Guideline CG90',
    year: '2009 (Updated 2022)',
    category: 'behavioral',
    icon: TrendingUp,
    strength: 'strong',
    keyPoints: [
      'Recommended by NICE for mild-moderate depression',
      'Focuses on increasing valued activities',
      'Can be as effective as antidepressants',
      'Low cost and accessible intervention'
    ]
  },
  {
    id: 'exercise-depression',
    title: 'Physical Activity as Treatment',
    finding: 'Exercise shows effectiveness comparable to antidepressants for mild-moderate depression',
    source: 'Cochrane Database of Systematic Reviews',
    year: '2023',
    category: 'physical',
    icon: Zap,
    strength: 'strong',
    keyPoints: [
      'Reduces symptoms of depression',
      'Improves both mental and physical health',
      'NICE recommends structured exercise programs',
      'Effects may be sustained long-term'
    ]
  },
  {
    id: 'social-connection',
    title: 'Social Connection and Mental Health',
    finding: 'Strong social connections are protective against depression and aid recovery',
    source: 'WHO, Lancet Public Health',
    year: '2023',
    category: 'social',
    icon: Users,
    strength: 'strong',
    keyPoints: [
      'Social isolation increases depression risk',
      'Quality of relationships matters more than quantity',
      'Peer support groups show positive outcomes',
      'Recognized by WHO as key mental health factor'
    ]
  },
  {
    id: 'cbt-evidence',
    title: 'Cognitive Behavioral Therapy',
    finding: 'CBT is one of the most researched and effective treatments for depression and anxiety',
    source: 'NICE, Multiple Meta-analyses',
    year: 'Ongoing',
    category: 'psychological',
    icon: Brain,
    strength: 'strong',
    keyPoints: [
      'Gold standard psychological treatment',
      'Effective for mild-severe depression',
      'Teaches skills for long-term management',
      'Available through NHS Talking Therapies'
    ]
  },
  {
    id: 'sleep-mood-bidirectional',
    title: 'Sleep and Mood Bidirectional Link',
    finding: 'Poor sleep increases depression risk, and treating sleep problems improves mood outcomes',
    source: 'Journal of Clinical Psychiatry',
    year: '2023',
    category: 'lifestyle',
    icon: Sun,
    strength: 'strong',
    keyPoints: [
      'Sleep problems often precede depression',
      'CBT for insomnia reduces depression symptoms',
      'Regular sleep schedules support mood regulation',
      'Light exposure helps regulate circadian rhythm'
    ]
  },
  {
    id: 'breathing-stress-reduction',
    title: 'Slow Breathing for Stress Reduction',
    finding: 'Slow breathing (5-6 breaths/min) activates parasympathetic nervous system and reduces stress',
    source: 'Journal of Neurophysiology, Multiple Studies',
    year: '2017-2023',
    category: 'physical',
    icon: Heart,
    strength: 'strong',
    keyPoints: [
      'Reduces cortisol and autonomic arousal',
      'Improves heart rate variability',
      'Immediate and cumulative benefits',
      'Low cost, accessible intervention'
    ]
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion and Mental Health',
    finding: 'Self-compassion practices reduce depression, anxiety, and increase wellbeing',
    source: 'Dr. Kristin Neff, Multiple Studies',
    year: '2003-2023',
    category: 'psychological',
    icon: Heart,
    strength: 'strong',
    keyPoints: [
      'Reduces self-criticism and shame',
      'Buffers against stress and failure',
      'Increases resilience and motivation',
      'Teachable skill with lasting benefits'
    ]
  },
  {
    id: 'gratitude-interventions',
    title: 'Gratitude Practices',
    finding: 'Regular gratitude practice increases wellbeing and reduces depressive symptoms',
    source: 'Positive Psychology Research',
    year: '2005-2023',
    category: 'psychological',
    icon: Heart,
    strength: 'moderate',
    keyPoints: [
      'Shifts attention toward positive',
      'Enhances life satisfaction',
      'Simple daily practice (3 good things)',
      'Particularly effective when written down'
    ]
  },
  {
    id: 'nature-exposure',
    title: 'Nature and Mental Health',
    finding: 'Regular nature exposure reduces stress, improves mood, and supports mental health',
    source: 'Environmental Health Perspectives',
    year: '2019-2023',
    category: 'lifestyle',
    icon: Sun,
    strength: 'strong',
    keyPoints: [
      'Even brief exposure shows benefits',
      'Reduces cortisol and blood pressure',
      'Green and blue spaces both beneficial',
      'Dose-response relationship observed'
    ]
  },
  {
    id: 'progressive-muscle-relaxation',
    title: 'Progressive Muscle Relaxation',
    finding: 'PMR reduces anxiety, stress, and improves sleep quality',
    source: 'Journal of Clinical Psychology',
    year: '1938-Present',
    category: 'physical',
    icon: Zap,
    strength: 'strong',
    keyPoints: [
      'Widely studied since 1930s',
      'Reduces physical tension and anxiety',
      'Improves body awareness',
      'Particularly helpful for sleep'
    ]
  },
  {
    id: 'talking-therapies-access',
    title: 'Accessibility of Psychological Therapy',
    finding: 'NHS Talking Therapies provides free, evidence-based treatment with improving access rates',
    source: 'NHS England',
    year: '2024',
    category: 'psychological',
    icon: Book,
    strength: 'strong',
    keyPoints: [
      'Self-referral available (no GP needed)',
      'Offers CBT, counseling, IPT, and more',
      'Over 1 million referrals annually',
      'Proven effectiveness in real-world settings'
    ]
  },
  {
    id: 'digital-interventions',
    title: 'Digital Mental Health Interventions',
    finding: 'Online CBT programs show moderate effectiveness and improve access to care',
    source: 'NICE, Cochrane Reviews',
    year: '2020-2023',
    category: 'psychological',
    icon: Brain,
    strength: 'moderate',
    keyPoints: [
      'Convenient and accessible 24/7',
      'Reduces barriers to treatment',
      'Lower intensity option for mild symptoms',
      'Can be stepped up if needed'
    ]
  }
];

export const EvidenceHub = () => {
  const categories = [
    { id: 'all', label: 'All Evidence' },
    { id: 'behavioral', label: 'Behavioral' },
    { id: 'physical', label: 'Physical' },
    { id: 'social', label: 'Social' },
    { id: 'psychological', label: 'Psychological' },
    { id: 'lifestyle', label: 'Lifestyle' }
  ];

  const [filter, setFilter] = useState('all');

  const filteredEvidence = filter === 'all' 
    ? evidence 
    : evidence.filter(e => e.category === filter);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'moderate': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'emerging': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'physical': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'social': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'psychological': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      case 'lifestyle': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Evidence Hub</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Research-backed evidence for strategies and interventions. All content is sourced from NICE, WHO, 
          NHS, and peer-reviewed research.
        </p>
      </div>

      {/* Evidence Strength Legend */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <h3 className="font-bold mb-4">Evidence Strength Guide</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <Badge className="bg-green-500 mb-2">Strong Evidence</Badge>
            <p className="text-muted-foreground">
              Multiple high-quality studies, recommended by NICE/WHO, established effectiveness
            </p>
          </div>
          <div>
            <Badge className="bg-blue-500 mb-2">Moderate Evidence</Badge>
            <p className="text-muted-foreground">
              Several studies show benefits, promising but less extensive research
            </p>
          </div>
          <div>
            <Badge className="bg-orange-500 mb-2">Emerging Evidence</Badge>
            <p className="text-muted-foreground">
              Early research suggests benefits, more studies needed
            </p>
          </div>
        </div>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={filter === cat.id ? 'default' : 'outline'}
            onClick={() => setFilter(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Evidence Cards */}
      <div className="space-y-6">
        {filteredEvidence.map(item => {
          const Icon = item.icon;
          
          return (
            <Card key={item.id} className="p-6 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getStrengthColor(item.strength)}>
                      {item.strength} evidence
                    </Badge>
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 mb-4">
                <p className="font-medium mb-1">Key Finding:</p>
                <p className="text-sm">{item.finding}</p>
              </div>

              <div className="mb-4 text-sm text-muted-foreground">
                <strong>Source:</strong> {item.source} ({item.year})
              </div>

              <div>
                <p className="font-semibold mb-2 text-sm">Key Points:</p>
                <ul className="space-y-2">
                  {item.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer Note */}
      <Card className="mt-8 p-6 bg-muted">
        <h3 className="font-bold mb-2">About This Evidence</h3>
        <p className="text-sm text-muted-foreground mb-2">
          All evidence is sourced from recognized authorities including NICE (National Institute for Health and Care Excellence), 
          WHO (World Health Organization), NHS guidance, and peer-reviewed research published in reputable journals.
        </p>
        <p className="text-sm text-muted-foreground">
          Evidence is updated regularly as new research emerges. This information is educational only and not a substitute 
          for professional medical advice.
        </p>
      </Card>
    </div>
  );
};

