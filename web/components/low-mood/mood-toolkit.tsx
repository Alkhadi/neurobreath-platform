'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wind, Heart, Sun, Sparkles, Music, Smile, Star, type LucideIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  duration: string;
  type: 'breathing' | 'grounding' | 'activation' | 'mindfulness';
  instructions: string[];
  tips: string[];
}

const tools: Tool[] = [
  {
    id: 'coherent-breathing',
    title: 'Coherent Breathing (5-5)',
    description: 'Balanced breathing for nervous system regulation',
    icon: Wind,
    duration: '5 minutes',
    type: 'breathing',
    instructions: [
      'Sit comfortably with spine gently upright',
      'Breathe in through nose for 5 seconds',
      'Breathe out through nose for 5 seconds',
      'Continue this 5-5 rhythm smoothly',
      'Let breathing be gentle and effortless',
      'Practice for 5-10 minutes daily'
    ],
    tips: [
      'Use a visual pacer or audio guide if helpful',
      'Don\'t force deep breaths - stay comfortable',
      'Regular practice builds resilience',
      'Best practiced daily, same time'
    ]
  },
  {
    id: 'box-breathing',
    title: 'Box Breathing',
    description: 'Four-part breath for calm and focus',
    icon: Wind,
    duration: '3-5 minutes',
    type: 'breathing',
    instructions: [
      'Inhale for 4 counts',
      'Hold for 4 counts',
      'Exhale for 4 counts',
      'Hold for 4 counts',
      'Repeat 8-10 cycles'
    ],
    tips: [
      'Visualize tracing a square',
      'Keep shoulders relaxed',
      'If holding feels uncomfortable, reduce to 3 counts',
      'Great for quick resets'
    ]
  },
  {
    id: '5-4-3-2-1-grounding',
    title: '5-4-3-2-1 Grounding',
    description: 'Sensory awareness exercise to anchor in the present',
    icon: Sparkles,
    duration: '3-5 minutes',
    type: 'grounding',
    instructions: [
      'Name 5 things you can SEE',
      'Name 4 things you can TOUCH',
      'Name 3 things you can HEAR',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE',
      'Take three slow breaths'
    ],
    tips: [
      'Say items out loud or write them down',
      'Be specific and descriptive',
      'Use when feeling disconnected or overwhelmed',
      'Can repeat multiple rounds'
    ]
  },
  {
    id: 'body-scan',
    title: 'Progressive Relaxation',
    description: 'Release tension from head to toe',
    icon: Heart,
    duration: '10-15 minutes',
    type: 'mindfulness',
    instructions: [
      'Lie down or sit comfortably',
      'Take three deep breaths',
      'Focus on your feet - notice tension',
      'Tense feet for 5 seconds, then release',
      'Move up through: legs, belly, chest, arms, shoulders, neck, face',
      'Notice the difference between tension and relaxation',
      'End with full body awareness and slow breaths'
    ],
    tips: [
      'Don\'t strain - gentle tension is enough',
      'Use guided audio if helpful',
      'Great before sleep',
      'Regular practice improves body awareness'
    ]
  },
  {
    id: 'gratitude-three',
    title: 'Three Good Things',
    description: 'Daily practice to shift attention toward positive',
    icon: Star,
    duration: '5 minutes',
    type: 'activation',
    instructions: [
      'At end of day, write three things that went well',
      'They can be small (good cup of tea, sunshine)',
      'For each, write why it happened or what it meant',
      'Notice how you feel as you write',
      'Keep a running list to review'
    ],
    tips: [
      'Consistency matters more than content',
      'OK to repeat items',
      'Helps retrain attention patterns',
      'Supported by positive psychology research'
    ]
  },
  {
    id: 'music-mood-boost',
    title: 'Music Mood Lift',
    description: 'Use music strategically to shift emotional state',
    icon: Music,
    duration: '10-15 minutes',
    type: 'activation',
    instructions: [
      'Create playlist with gradual tempo increase',
      'Start with music matching current mood',
      'Gradually add slightly more upbeat songs',
      'End with energizing or uplifting tracks',
      'Allow yourself to move if it feels natural',
      'Notice shift in energy and mood'
    ],
    tips: [
      'Match then shift - don\'t force upbeat music too early',
      'Movement amplifies effect',
      'Use headphones for immersion',
      'Personal taste matters - choose what resonates'
    ]
  },
  {
    id: 'nature-micro-dose',
    title: 'Nature Microdose',
    description: 'Brief nature exposure for mood and energy',
    icon: Sun,
    duration: '5-10 minutes',
    type: 'activation',
    instructions: [
      'Step outside, even briefly',
      'Notice sky, clouds, trees, birds',
      'Feel air temperature and breeze',
      'Listen to natural sounds',
      'Take slow breaths of fresh air',
      'Observe without judging or analyzing'
    ],
    tips: [
      'Even a window view helps',
      'Morning light supports circadian rhythm',
      'Regular nature exposure shows strong mood benefits',
      'Combine with short walk for added benefit'
    ]
  },
  {
    id: 'self-compassion-break',
    title: 'Self-Compassion Break',
    description: 'Offer yourself kindness in difficult moments',
    icon: Heart,
    duration: '3-5 minutes',
    type: 'mindfulness',
    instructions: [
      'Notice that you\'re struggling',
      'Say: "This is a moment of difficulty"',
      'Place hand on heart or give yourself a gentle hug',
      'Say: "Difficulty is part of life - I\'m not alone"',
      'Say: "May I be kind to myself" or "May I give myself what I need"',
      'Take three slow, gentle breaths'
    ],
    tips: [
      'Use your own comforting words',
      'Physical touch (hand on heart) activates calming',
      'Practice regularly, not just in crisis',
      'Based on Kristin Neff\'s research'
    ]
  },
  {
    id: 'pleasant-activity',
    title: 'Micro-Activity',
    description: 'Small action to break inertia',
    icon: Smile,
    duration: '5-10 minutes',
    type: 'activation',
    instructions: [
      'Choose one small, achievable activity',
      'Examples: tidy one surface, water a plant, make tea, stretch',
      'Set a timer for 5 minutes',
      'Focus only on this one thing',
      'Notice any change in mood or energy',
      'Celebrate completion, no matter how small'
    ],
    tips: [
      'Small wins build momentum',
      'Lower bar for success when mood is low',
      'Any action breaks the inertia cycle',
      'Track mood before and after'
    ]
  }
];

export const MoodToolkit = ({ onProgressUpdate }: { onProgressUpdate?: () => void }) => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [usedTools, setUsedTools] = useState<Set<string>>(new Set());

  const types = [
    { id: 'all', label: 'All Tools' },
    { id: 'breathing', label: 'Breathing' },
    { id: 'grounding', label: 'Grounding' },
    { id: 'activation', label: 'Activation' },
    { id: 'mindfulness', label: 'Mindfulness' }
  ];

  const filteredTools = filter === 'all' 
    ? tools 
    : tools.filter(t => t.type === filter);

  const handleToolUsed = (toolId: string) => {
    setUsedTools(prev => {
      const updated = new Set(prev);
      updated.add(toolId);
      localStorage.setItem('low-mood-used-tools', JSON.stringify([...updated]));
      onProgressUpdate?.();
      return updated;
    });
  };

  return (
    <div className="mx-auto px-4 w-[86vw] max-w-[86vw]">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Mood Toolkit</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Quick relief techniques for immediate support. Use these tools when you need a boost,
          feeling stuck, or want to shift your state.
        </p>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {types.map(type => (
          <Button
            key={type.id}
            variant={filter === type.id ? 'default' : 'outline'}
            onClick={() => setFilter(type.id)}
          >
            {type.label}
          </Button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          const isUsed = usedTools.has(tool.id);
          
          return (
            <Card 
              key={tool.id}
              className={`p-6 hover:shadow-lg transition-all cursor-pointer ${isUsed ? 'border-green-500 border-2' : ''}`}
              onClick={() => setSelectedTool(tool)}
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 bg-opacity-10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="text-xl font-bold mb-2">{tool.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {tool.description}
              </p>

              <div className="flex items-center justify-between">
                <Badge variant="outline">{tool.duration}</Badge>
                {isUsed && (
                  <Badge variant="default" className="bg-green-500">
                    Used
                  </Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tool Detail Dialog */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTool && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl mb-2">{selectedTool.title}</DialogTitle>
                <p className="text-muted-foreground">{selectedTool.description}</p>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Instructions */}
                <div>
                  <h4 className="font-semibold mb-3">Instructions</h4>
                  <ol className="space-y-2">
                    {selectedTool.instructions.map((instruction, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                          {idx + 1}
                        </span>
                        <span className="text-sm pt-0.5">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Tips */}
                <div>
                  <h4 className="font-semibold mb-3">Helpful Tips</h4>
                  <ul className="space-y-2">
                    {selectedTool.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-blue-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      handleToolUsed(selectedTool.id);
                      setSelectedTool(null);
                    }}
                    className="flex-1"
                  >
                    I Used This Tool
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTool(null)}
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

