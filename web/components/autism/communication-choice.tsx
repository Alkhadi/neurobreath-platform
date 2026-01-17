'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, X, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Choice {
  id: string;
  text: string;
  emoji: string;
}

const EMOJI_OPTIONS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😨', label: 'Scared' },
  { emoji: '✅', label: 'Yes' },
  { emoji: '❌', label: 'No' },
  { emoji: '🍽️', label: 'Food' },
  { emoji: '💧', label: 'Water' },
  { emoji: '🚻', label: 'Bathroom' },
  { emoji: '🛏️', label: 'Rest' },
  { emoji: '🎮', label: 'Play' },
  { emoji: '📚', label: 'Book' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '🤗', label: 'Hug' },
  { emoji: '⌚', label: 'Break' },
  { emoji: '🧘', label: 'Quiet' },
];

const PRESET_BOARDS = [
  {
    name: 'Basic Needs',
    choices: [
      { text: 'I need a break', emoji: '⌚' },
      { text: 'I\'m hungry', emoji: '🍽️' },
      { text: 'I\'m thirsty', emoji: '💧' },
      { text: 'Bathroom', emoji: '🚻' },
    ],
  },
  {
    name: 'Feelings',
    choices: [
      { text: 'I feel happy', emoji: '😊' },
      { text: 'I feel sad', emoji: '😔' },
      { text: 'I feel angry', emoji: '😡' },
      { text: 'I feel scared', emoji: '😨' },
    ],
  },
  {
    name: 'Classroom',
    choices: [
      { text: 'I don\'t understand', emoji: '❓' },
      { text: 'Too loud', emoji: '🔊' },
      { text: 'I\'m done', emoji: '✅' },
      { text: 'I need help', emoji: '✋' },
    ],
  },
];

export function CommunicationChoice() {
  const [boardName, setBoardName] = useState('My Choice Board');
  const [choices, setChoices] = useState<Choice[]>([]);
  const [newChoiceText, setNewChoiceText] = useState('');
  const [newChoiceEmoji, setNewChoiceEmoji] = useState('😊');
  const [fontSize, setFontSize] = useState('medium');

  const loadPreset = (preset: typeof PRESET_BOARDS[0]) => {
    setBoardName(preset.name);
    setChoices(preset.choices.map((c, i) => ({ ...c, id: `choice-${Date.now()}-${i}` })));
  };

  const addChoice = () => {
    if (!newChoiceText.trim()) return;
    
    setChoices([...choices, {
      id: `choice-${Date.now()}`,
      text: newChoiceText.trim(),
      emoji: newChoiceEmoji,
    }]);
    setNewChoiceText('');
  };

  const removeChoice = (id: string) => {
    setChoices(choices.filter(c => c.id !== id));
  };

  const exportBoard = () => {
    const content = `COMMUNICATION CHOICE BOARD: ${boardName}
${'='.repeat(50)}

${choices.map((c, i) => `${i + 1}. ${c.emoji} ${c.text}`).join('\n')}

--- INSTRUCTIONS ---
1. Print this board on A4 paper
2. Laminate for durability
3. Cut into individual cards or keep as full board
4. Place in accessible location
5. Model usage: point + speak the choice
6. Honor all communication attempts

Evidence: AAC improves communication outcomes (NICE CG170)
Citation: https://www.nice.org.uk/guidance/cg170
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${boardName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fontSizeClass = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl',
  }[fontSize];

  return (
    <Card className="border-green-200 dark:border-green-800">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Communication Choice Board</CardTitle>
            <CardDescription>
              Create visual communication supports (AAC/PECS alternative)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Preset Boards */}
        <div>
          <Label className="mb-2 block">Quick Start (Presets)</Label>
          <div className="flex flex-wrap gap-2">
            {PRESET_BOARDS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => loadPreset(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Board Configuration */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="boardName">Board Name</Label>
            <Input
              id="boardName"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="e.g., Morning Routine"
            />
          </div>

          <div>
            <Label htmlFor="fontSize">Text Size</Label>
            <Select value={fontSize} onValueChange={setFontSize}>
              <SelectTrigger id="fontSize">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Add New Choice */}
        <div className="space-y-2">
          <Label>Add New Choice</Label>
          <div className="flex gap-2">
            <Select value={newChoiceEmoji} onValueChange={setNewChoiceEmoji}>
              <SelectTrigger className="w-20">
                <SelectValue>{newChoiceEmoji}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {EMOJI_OPTIONS.map((opt) => (
                  <SelectItem key={opt.emoji} value={opt.emoji}>
                    {opt.emoji} {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newChoiceText}
              onChange={(e) => setNewChoiceText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addChoice()}
              placeholder="Enter choice text..."
              className="flex-1"
            />
            <Button onClick={addChoice} disabled={!newChoiceText.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Choice Board Preview */}
        {choices.length > 0 && (
          <Card className="border-2 border-green-300 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-center">{boardName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {choices.map((choice) => (
                  <div
                    key={choice.id}
                    className="relative group border-2 border-gray-300 dark:border-gray-700 rounded-lg p-4 hover:border-green-500 dark:hover:border-green-500 transition-colors text-center"
                  >
                    <button
                      onClick={() => removeChoice(choice.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="space-y-2">
                      <div className="text-5xl">{choice.emoji}</div>
                      <p className={`font-medium ${fontSizeClass}`}>{choice.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {choices.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Load a preset or add your first choice to get started
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {choices.length > 0 && (
          <div className="flex gap-2 justify-center">
            <Button onClick={exportBoard}>
              <Download className="w-4 h-4 mr-2" />
              Export Board
            </Button>
            <Button variant="outline" onClick={() => setChoices([])}>
              Clear All
            </Button>
          </div>
        )}

        {/* Tip */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Print the exported file, laminate it, and place it where it's easily visible. 
              Model pointing to choices while speaking. Research shows AAC improves both receptive and expressive 
              communication (NICE CG170).
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
