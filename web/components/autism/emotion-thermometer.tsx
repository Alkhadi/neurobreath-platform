'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Thermometer, Download, TrendingUp } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface EmotionLevel {
  level: number;
  color: string;
  label: string;
  body: string;
  strategy: string;
}

const DEFAULT_LEVELS: EmotionLevel[] = [
  {
    level: 1,
    color: '#10b981',
    label: 'Calm & Happy',
    body: 'Body is relaxed, breathing is easy',
    strategy: 'Great time to learn new things',
  },
  {
    level: 2,
    color: '#84cc16',
    label: 'Starting to Notice',
    body: 'Slight tension, a bit distracted',
    strategy: 'Take a short break, drink water',
  },
  {
    level: 3,
    color: '#eab308',
    label: 'Getting Uncomfortable',
    body: 'Heart beating faster, harder to focus',
    strategy: 'Use breathing exercise, move to quiet space',
  },
  {
    level: 4,
    color: '#f97316',
    label: 'Really Struggling',
    body: 'Body is tense, thoughts racing',
    strategy: 'Remove from situation, use sensory tool',
  },
  {
    level: 5,
    color: '#ef4444',
    label: 'Overwhelmed',
    body: 'Can\'t think clearly, need to escape',
    strategy: 'Safe space NOW, adult support, regulate first',
  },
];

export function EmotionThermometer() {
  const [personName, setPersonName] = useState('me');
  const [levels, setLevels] = useState<EmotionLevel[]>(DEFAULT_LEVELS);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const updateLevel = (levelNum: number, field: keyof EmotionLevel, value: string) => {
    setLevels(levels.map(l => 
      l.level === levelNum ? { ...l, [field]: value } : l
    ));
  };

  const resetToDefaults = () => {
    setLevels(DEFAULT_LEVELS);
  };

  const exportThermometer = () => {
    const content = `EMOTION THERMOMETER FOR ${personName.toUpperCase()}
${'='.repeat(60)}

${levels.map(l => `
LEVEL ${l.level}: ${l.label}
${'-'.repeat(40)}
How My Body Feels: ${l.body}
What Helps: ${l.strategy}
`).join('')}

--- HOW TO USE ---

1. Teach when calm (Level 1-2)
2. Practice identifying body signals daily
3. When upset, ask: "What level are you?"
4. Use the matching strategy immediately
5. Review together after regulation

--- FOR SUPPORTERS ---

• Model your own thermometer ("I'm at a 3, I need a break")
• Catch them at Level 2-3 (prevention better than crisis)
• Never force someone to talk at Level 4-5
• Validate feelings at all levels
• Adjust strategies based on what works

Evidence: Interoception awareness improves emotional regulation
Citations:
- NICE CG170: https://www.nice.org.uk/guidance/cg170
- Mahler et al. (2016) - Interoception & Autism
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `emotion-thermometer-${personName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const currentLevelData = levels.find(l => l.level === currentLevel);

  return (
    <Card className="border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <Thermometer className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Emotion Thermometer</CardTitle>
            <CardDescription>
              Visual scale for identifying and regulating emotions (Interoception Tool)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration */}
        <div>
          <Label htmlFor="personName">This thermometer is for:</Label>
          <Input
            id="personName"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            placeholder="Name or 'me'"
            className="max-w-sm"
          />
        </div>

        {/* Interactive Thermometer */}
        <Card className="border-2" style={{ borderColor: currentLevelData?.color }}>
          <CardContent className="pt-6 space-y-6">
            <div className="text-center space-y-2">
              <div 
                className="inline-block px-6 py-3 rounded-full text-white font-bold text-3xl"
                style={{ backgroundColor: currentLevelData?.color }}
              >
                Level {currentLevel}
              </div>
              <h3 className="text-2xl font-bold" style={{ color: currentLevelData?.color }}>
                {currentLevelData?.label}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🟢</span>
                <Slider
                  value={[currentLevel]}
                  onValueChange={(val) => setCurrentLevel(val[0])}
                  min={1}
                  max={5}
                  step={1}
                  className="flex-1"
                />
                <span className="text-4xl">🔴</span>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">How My Body Feels</p>
                <p className="text-lg">{currentLevelData?.body}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">What Helps</p>
                <p className="text-lg font-medium">{currentLevelData?.strategy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Mode Toggle */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Done Editing' : 'Customize Levels'}
          </Button>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <Card className="border-muted">
            <CardContent className="pt-6 space-y-6">
              {levels.map((level) => (
                <div key={level.level} className="space-y-3 pb-4 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-full"
                      style={{ backgroundColor: level.color }}
                    />
                    <Label className="font-bold">Level {level.level}</Label>
                  </div>
                  <div>
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={level.label}
                      onChange={(e) => updateLevel(level.level, 'label', e.target.value)}
                      placeholder="e.g., Calm & Happy"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Body Signals</Label>
                    <Input
                      value={level.body}
                      onChange={(e) => updateLevel(level.level, 'body', e.target.value)}
                      placeholder="How does the body feel?"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Strategy</Label>
                    <Input
                      value={level.strategy}
                      onChange={(e) => updateLevel(level.level, 'strategy', e.target.value)}
                      placeholder="What helps at this level?"
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={resetToDefaults} className="w-full">
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2 justify-center">
          <Button onClick={exportThermometer}>
            <Download className="w-4 h-4 mr-2" />
            Export Thermometer
          </Button>
        </div>

        {/* Tip */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Teach this tool when calm (Level 1-2). Practice daily check-ins. 
              The goal is to catch stress at Level 2-3 before it escalates. Interoception awareness 
              (recognizing body signals) is a teachable skill that improves emotional regulation.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
