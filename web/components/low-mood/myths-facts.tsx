'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2, Info } from 'lucide-react';

interface MythFact {
  id: string;
  myth: string;
  fact: string;
  explanation: string;
  source: string;
  category: 'causes' | 'treatment' | 'misconceptions' | 'recovery';
}

const mythsFacts: MythFact[] = [
  {
    id: 'just-cheer-up',
    myth: 'People with depression just need to "cheer up" or "think positive"',
    fact: 'Depression is a medical condition involving brain chemistry, not a choice or weakness',
    explanation: 'Depression involves changes in neurotransmitters, brain structure, and neural pathways. Telling someone to "cheer up" is like telling someone with diabetes to "just make more insulin." While positive practices can be part of treatment, they require consistent effort and often professional support.',
    source: 'NHS, NICE Clinical Guidelines',
    category: 'misconceptions'
  },
  {
    id: 'just-weakness',
    myth: 'Depression is a sign of weakness or character flaw',
    fact: 'Depression is a common medical condition that can affect anyone, regardless of strength or character',
    explanation: 'Depression affects 1 in 4 people in the UK. It doesn\'t discriminate by strength, success, or character. Many high-achieving, resilient people experience depression. It\'s a health condition, not a personality weakness.',
    source: 'WHO, Mind',
    category: 'misconceptions'
  },
  {
    id: 'medication-only',
    myth: 'Antidepressants are the only effective treatment',
    fact: 'Multiple treatments work: therapy, lifestyle changes, and medication can all be effective',
    explanation: 'NICE guidelines recommend several approaches: CBT, behavioral activation, exercise, and antidepressants all show evidence of effectiveness. The best approach depends on severity, preference, and individual circumstances. Many people benefit from combining approaches.',
    source: 'NICE CG90, Cochrane Reviews',
    category: 'treatment'
  },
  {
    id: 'permanent-condition',
    myth: 'Once you have depression, you\'ll always have it',
    fact: 'Most people recover from depression with appropriate support and treatment',
    explanation: 'While some people experience recurrent episodes, many recover fully. With proper treatment, most people see significant improvement. Learning skills and strategies can reduce risk of recurrence. Even chronic depression can be managed effectively.',
    source: 'NHS, Mental Health Foundation',
    category: 'recovery'
  },
  {
    id: 'caused-by-sadness',
    myth: 'Depression is just extreme sadness',
    fact: 'Depression involves multiple symptoms beyond sadness, including loss of interest, fatigue, and changes in sleep/appetite',
    explanation: 'Many people with depression describe feeling "empty" or "numb" rather than sad. Core symptoms include anhedonia (loss of pleasure), low energy, concentration problems, and physical symptoms. It\'s more complex than just mood.',
    source: 'DSM-5, ICD-11',
    category: 'misconceptions'
  },
  {
    id: 'therapy-takes-forever',
    myth: 'Therapy takes years to work',
    fact: 'Evidence-based therapies like CBT typically show results in 8-16 sessions',
    explanation: 'While some therapy approaches are long-term, structured therapies like CBT show measurable improvement in weeks to months. NHS Talking Therapies typically offers 6-20 sessions. Many people notice changes within the first few sessions.',
    source: 'NICE, NHS Talking Therapies data',
    category: 'treatment'
  },
  {
    id: 'external-causes-only',
    myth: 'Depression is always caused by external events or trauma',
    fact: 'Depression can have multiple causes: biological, psychological, social, and sometimes no clear trigger',
    explanation: 'While life events can trigger depression, it can also arise from brain chemistry imbalances, chronic stress, medical conditions, genetics, or a combination of factors. Some people develop depression without any obvious external cause.',
    source: 'WHO, NICE',
    category: 'causes'
  },
  {
    id: 'exercise-cure',
    myth: 'Exercise alone will cure depression',
    fact: 'Exercise is an effective tool but may need to be combined with other treatments for moderate-severe depression',
    explanation: 'Exercise shows strong evidence for mild-moderate depression and is NICE-recommended. However, severe depression often requires additional interventions (therapy, medication). Exercise is a powerful part of a comprehensive approach.',
    source: 'NICE CG90, Cochrane',
    category: 'treatment'
  },
  {
    id: 'willpower',
    myth: 'You can overcome depression through willpower alone',
    fact: 'Depression affects the brain\'s ability to motivate and energize action - willpower isn\'t enough',
    explanation: 'Depression literally changes brain function in areas responsible for motivation, energy, and reward. Trying harder without proper support often leads to exhaustion and self-blame. Effective treatment addresses the underlying brain changes, not just effort.',
    source: 'Neuroscience research, NICE',
    category: 'misconceptions'
  },
  {
    id: 'medication-changes-personality',
    myth: 'Antidepressants will change your personality',
    fact: 'Antidepressants aim to restore normal functioning, not change who you are',
    explanation: 'Well-managed antidepressant treatment helps people feel "like themselves again" rather than changing their personality. Side effects can occur but are usually manageable. The goal is to lift the symptoms that mask your true personality.',
    source: 'NHS, Royal College of Psychiatrists',
    category: 'treatment'
  },
  {
    id: 'talking-makes-worse',
    myth: 'Talking about depression will make it worse',
    fact: 'Talking about depression in supportive settings is healing and reduces isolation',
    explanation: 'Suppressing difficult feelings often increases distress. Talking with trained professionals or trusted supporters helps process emotions, challenge unhelpful thoughts, and reduce shame. This is the foundation of effective therapy.',
    source: 'Mental Health Foundation, Mind',
    category: 'recovery'
  },
  {
    id: 'successful-people-immune',
    myth: 'Successful or wealthy people don\'t get depression',
    fact: 'Depression can affect anyone regardless of success, wealth, or circumstances',
    explanation: 'Many successful, high-achieving people experience depression. External success doesn\'t protect against biological or psychological factors. In fact, high-pressure environments can increase risk. Depression is an equal-opportunity condition.',
    source: 'WHO, Mental Health Foundation',
    category: 'misconceptions'
  },
  {
    id: 'seeking-help-weakness',
    myth: 'Seeking professional help means you\'ve failed',
    fact: 'Seeking help is a sign of strength and self-awareness',
    explanation: 'Getting professional support shows wisdom and courage. You wouldn\'t hesitate to see a doctor for a broken leg - mental health deserves the same respect. Early intervention leads to better outcomes.',
    source: 'NHS, Time to Change',
    category: 'recovery'
  },
  {
    id: 'lifestyle-all-you-need',
    myth: 'Lifestyle changes alone are always sufficient',
    fact: 'Lifestyle changes are important but may need professional support for moderate-severe depression',
    explanation: 'Sleep, exercise, diet, and social connection are crucial and evidence-based. For mild depression, these may be sufficient. For moderate-severe depression, combining lifestyle changes with therapy and/or medication is often most effective.',
    source: 'NICE stepped care model',
    category: 'treatment'
  }
];

export const MythsFacts = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedMyth, setExpandedMyth] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'misconceptions', label: 'Common Misconceptions' },
    { id: 'treatment', label: 'Treatment' },
    { id: 'causes', label: 'Causes' },
    { id: 'recovery', label: 'Recovery' }
  ];

  const filteredMyths = selectedCategory === 'all'
    ? mythsFacts
    : mythsFacts.filter(mf => mf.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'causes': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'treatment': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'misconceptions': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'recovery': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Myths vs Facts</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Separating myths from evidence-based facts about low mood, depression, and burnout
        </p>
      </div>

      {/* Information Banner */}
      <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold mb-2">Why This Matters</h3>
            <p className="text-sm text-muted-foreground">
              Myths about depression create stigma, delay treatment, and cause unnecessary suffering. 
              All facts below are sourced from NHS, NICE, WHO, and peer-reviewed research.
            </p>
          </div>
        </div>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Myths & Facts Cards */}
      <div className="space-y-6">
        {filteredMyths.map(item => (
          <Card 
            key={item.id} 
            className="overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Myth Section */}
            <div className="p-6 bg-red-50 dark:bg-red-950 border-b-2 border-red-200 dark:border-red-800">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                    <X className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <Badge className="mb-2 bg-red-600">MYTH</Badge>
                  <p className="text-lg font-semibold">{item.myth}</p>
                </div>
              </div>
            </div>

            {/* Fact Section */}
            <div className="p-6 bg-green-50 dark:bg-green-950">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <Badge className="mb-2 bg-green-600">FACT</Badge>
                  <p className="text-lg font-semibold mb-4">{item.fact}</p>
                  
                  {/* Expandable Explanation */}
                  {expandedMyth === item.id ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                        <h4 className="font-semibold mb-2">Explanation</h4>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Source: {item.source}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setExpandedMyth(null)}
                        >
                          Show Less
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedMyth(item.id)}
                      >
                        Learn More
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer */}
      <Card className="mt-8 p-6 bg-muted">
        <h3 className="font-bold mb-2">Combat Stigma</h3>
        <p className="text-sm text-muted-foreground">
          Sharing accurate information helps combat stigma and encourages people to seek help. 
          If you encounter these myths, you can now share the facts with confidence.
        </p>
      </Card>
    </div>
  );
};

