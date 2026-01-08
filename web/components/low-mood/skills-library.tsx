'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Sun, Users, Zap, TrendingUp, CheckCircle2, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Skill {
  id: string;
  title: string;
  category: 'behavioral' | 'cognitive' | 'social' | 'lifestyle';
  description: string;
  icon: any;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  evidence: string;
  steps: string[];
  benefits: string[];
  completed?: boolean;
}

const skills: Skill[] = [
  {
    id: 'behavioral-activation',
    title: 'Behavioral Activation',
    category: 'behavioral',
    description: 'Gradually increase activities that bring meaning, pleasure, or accomplishment',
    icon: TrendingUp,
    duration: '10-15 min daily',
    difficulty: 'beginner',
    evidence: 'NICE-recommended for depression. Evidence shows comparable effectiveness to CBT.',
    steps: [
      'Make a list of activities you used to enjoy or find meaningful',
      'Rate each activity for pleasure (1-10) and importance (1-10)',
      'Choose one small, achievable activity for today',
      'Schedule a specific time and location',
      'Complete the activity, even if motivation is low',
      'Note how you felt before, during, and after',
      'Gradually increase frequency and variety'
    ],
    benefits: [
      'Breaks cycle of inactivity and low mood',
      'Builds momentum through small wins',
      'Reconnects with values and meaning',
      'Evidence-based and structured'
    ]
  },
  {
    id: 'cognitive-reframing',
    title: 'Cognitive Reframing',
    category: 'cognitive',
    description: 'Identify and challenge unhelpful thought patterns',
    icon: Brain,
    duration: '5-10 min',
    difficulty: 'intermediate',
    evidence: 'Core CBT technique. Supported by extensive research for mood disorders.',
    steps: [
      'Notice a negative thought (e.g., "I\'m useless")',
      'Write it down exactly as it appears',
      'Identify thinking errors (all-or-nothing, catastrophizing, etc.)',
      'Look for evidence for and against the thought',
      'Generate a more balanced perspective',
      'Rate belief in original thought (0-100%) before and after'
    ],
    benefits: [
      'Reduces rumination and negative thinking',
      'Builds awareness of thought patterns',
      'Evidence-based CBT technique',
      'Portable skill for any situation'
    ]
  },
  {
    id: 'social-connection',
    title: 'Social Connection Plan',
    category: 'social',
    description: 'Build and maintain supportive relationships',
    icon: Users,
    duration: 'Ongoing',
    difficulty: 'beginner',
    evidence: 'Strong predictor of recovery. Recommended by WHO and major mental health organizations.',
    steps: [
      'List people who are supportive and safe',
      'Identify one person to reach out to this week',
      'Choose a low-pressure connection (text, call, coffee)',
      'Schedule a specific time',
      'Prepare a simple opener if needed',
      'Follow through, even if anxiety arises',
      'Notice how you feel afterward'
    ],
    benefits: [
      'Combats isolation and loneliness',
      'Provides emotional support',
      'Strong evidence for recovery',
      'Builds resilience'
    ]
  },
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene Protocol',
    category: 'lifestyle',
    description: 'Optimize sleep quality and circadian rhythm',
    icon: Sun,
    duration: 'Daily routine',
    difficulty: 'beginner',
    evidence: 'Recommended by NICE and sleep medicine guidelines. Strong bidirectional link with mood.',
    steps: [
      'Set consistent wake and sleep times (even weekends)',
      'Get bright light exposure within 30 min of waking',
      'Limit caffeine after 2 PM',
      'Create wind-down routine (60-90 min before bed)',
      'Keep bedroom cool, dark, and quiet',
      'Leave bed if awake >20 min',
      'Track sleep and mood patterns'
    ],
    benefits: [
      'Improves mood regulation',
      'Enhances energy and motivation',
      'Evidence-based and actionable',
      'Supports overall health'
    ]
  },
  {
    id: 'physical-activity',
    title: 'Movement Medicine',
    category: 'lifestyle',
    description: 'Use physical activity as mood medicine',
    icon: Zap,
    duration: '20-30 min',
    difficulty: 'beginner',
    evidence: 'NICE-recommended. Shown to be as effective as antidepressants for mild-moderate depression.',
    steps: [
      'Choose activity you can tolerate (walking, stretching, dancing)',
      'Start with just 5-10 minutes',
      'Schedule specific time of day',
      'Focus on consistency, not intensity',
      'Track mood before and after',
      'Gradually increase duration',
      'Vary activities to maintain interest'
    ],
    benefits: [
      'Releases endorphins and neurotransmitters',
      'Improves sleep and energy',
      'Evidence comparable to medication',
      'Accessible and free'
    ]
  },
  {
    id: 'self-compassion',
    title: 'Self-Compassion Practice',
    category: 'cognitive',
    description: 'Treat yourself with the kindness you\'d show a friend',
    icon: Heart,
    duration: '5-10 min',
    difficulty: 'intermediate',
    evidence: 'Research by Dr. Kristin Neff shows strong links to mental health and resilience.',
    steps: [
      'Notice when you\'re being self-critical',
      'Pause and place hand on heart',
      'Acknowledge that suffering is part of being human',
      'Ask: "What would I say to a friend in this situation?"',
      'Offer yourself those same words',
      'Use a gentle, warm tone (internal voice)',
      'Return to this practice regularly'
    ],
    benefits: [
      'Reduces shame and self-criticism',
      'Builds emotional resilience',
      'Evidence-based approach',
      'Cultivates warmth and acceptance'
    ]
  }
];

export const SkillsLibrary = ({ onProgressUpdate }: { onProgressUpdate?: () => void }) => {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', label: 'All Skills', color: 'bg-blue-500' },
    { id: 'behavioral', label: 'Behavioral', color: 'bg-green-500' },
    { id: 'cognitive', label: 'Cognitive', color: 'bg-purple-500' },
    { id: 'social', label: 'Social', color: 'bg-pink-500' },
    { id: 'lifestyle', label: 'Lifestyle', color: 'bg-orange-500' }
  ];

  const filteredSkills = filter === 'all' 
    ? skills 
    : skills.filter(s => s.category === filter);

  const handleComplete = (skillId: string) => {
    setCompletedSkills(prev => {
      const updated = new Set(prev);
      if (updated.has(skillId)) {
        updated.delete(skillId);
      } else {
        updated.add(skillId);
      }
      // Store in localStorage
      localStorage.setItem('low-mood-completed-skills', JSON.stringify([...updated]));
      onProgressUpdate?.();
      return updated;
    });
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.color || 'bg-gray-500';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto px-4" style={{ width: '86vw', maxWidth: '86vw' }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills Library</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Evidence-based strategies to boost mood, manage stress, and prevent burnout.
          All techniques are recommended by NICE, WHO, or supported by peer-reviewed research.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={filter === cat.id ? 'default' : 'outline'}
            onClick={() => setFilter(cat.id)}
            className="gap-2"
          >
            <div className={`w-3 h-3 rounded-full ${cat.color}`} />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Progress Overview */}
      <Card className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Skills Practiced</span>
          <span className="text-sm font-bold">{completedSkills.size} / {skills.length}</span>
        </div>
        <Progress value={(completedSkills.size / skills.length) * 100} className="h-2" />
      </Card>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSkills.map(skill => {
          const Icon = skill.icon;
          const isCompleted = completedSkills.has(skill.id);
          
          return (
            <Card 
              key={skill.id}
              className="p-6 hover:shadow-lg transition-all cursor-pointer relative"
              onClick={() => setSelectedSkill(skill)}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-lg ${getCategoryColor(skill.category)} bg-opacity-10 flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6" />
              </div>

              <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {skill.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className={getDifficultyColor(skill.difficulty)}>
                  {skill.difficulty}
                </Badge>
                <Badge variant="outline">{skill.duration}</Badge>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSkill(skill);
                }}
              >
                Learn More
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Skill Detail Dialog */}
      <Dialog open={!!selectedSkill} onOpenChange={() => setSelectedSkill(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedSkill && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <DialogTitle className="text-2xl mb-2">{selectedSkill.title}</DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedSkill.description}
                    </DialogDescription>
                  </div>
                  {completedSkills.has(selectedSkill.id) && (
                    <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Evidence Base */}
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Evidence Base
                  </h4>
                  <p className="text-sm">{selectedSkill.evidence}</p>
                </div>

                {/* Steps */}
                <div>
                  <h4 className="font-semibold mb-3">How to Practice</h4>
                  <ol className="space-y-2">
                    {selectedSkill.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-sm pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Benefits */}
                <div>
                  <h4 className="font-semibold mb-3">Key Benefits</h4>
                  <ul className="space-y-2">
                    {selectedSkill.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleComplete(selectedSkill.id)}
                    variant={completedSkills.has(selectedSkill.id) ? 'outline' : 'default'}
                    className="flex-1"
                  >
                    {completedSkills.has(selectedSkill.id) ? 'Mark as Not Practiced' : 'Mark as Practiced'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSkill(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

