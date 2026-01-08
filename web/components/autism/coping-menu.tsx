'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Plus, X, Download, Shuffle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CopingStrategy {
  id: string;
  category: string;
  strategy: string;
  duration: string;
}

const CATEGORIES = [
  { value: 'sensory', label: 'Sensory', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { value: 'movement', label: 'Movement', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'creative', label: 'Creative', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { value: 'calming', label: 'Calming', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  { value: 'social', label: 'Social', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
];

const PRESET_STRATEGIES: CopingStrategy[] = [
  { id: '1', category: 'sensory', strategy: 'Squeeze stress ball', duration: '2 min' },
  { id: '2', category: 'sensory', strategy: 'Listen to favorite music with headphones', duration: '5 min' },
  { id: '3', category: 'sensory', strategy: 'Weighted blanket time', duration: '10 min' },
  { id: '4', category: 'movement', strategy: 'Take 10 deep breaths', duration: '2 min' },
  { id: '5', category: 'movement', strategy: 'Walk outside', duration: '10 min' },
  { id: '6', category: 'movement', strategy: 'Gentle stretching', duration: '5 min' },
  { id: '7', category: 'creative', strategy: 'Draw or color', duration: '10 min' },
  { id: '8', category: 'creative', strategy: 'Build with blocks/Lego', duration: '15 min' },
  { id: '9', category: 'calming', strategy: 'Read a favorite book', duration: '10 min' },
  { id: '10', category: 'calming', strategy: 'Watch calming videos', duration: '5 min' },
  { id: '11', category: 'social', strategy: 'Talk to someone I trust', duration: '10 min' },
  { id: '12', category: 'social', strategy: 'Hug a pet or stuffed animal', duration: '3 min' },
];

export function CopingMenu() {
  const [menuName, setMenuName] = useState('My Coping Menu');
  const [strategies, setStrategies] = useState<CopingStrategy[]>([]);
  const [newStrategy, setNewStrategy] = useState('');
  const [newCategory, setNewCategory] = useState('sensory');
  const [newDuration, setNewDuration] = useState('5 min');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const loadPresets = () => {
    setStrategies(PRESET_STRATEGIES);
  };

  const addStrategy = () => {
    if (!newStrategy.trim()) return;
    
    setStrategies([...strategies, {
      id: `strategy-${Date.now()}`,
      category: newCategory,
      strategy: newStrategy.trim(),
      duration: newDuration,
    }]);
    setNewStrategy('');
  };

  const removeStrategy = (id: string) => {
    setStrategies(strategies.filter(s => s.id !== id));
  };

  const getRandomStrategy = () => {
    const filtered = selectedCategory === 'all' 
      ? strategies 
      : strategies.filter(s => s.category === selectedCategory);
    
    if (filtered.length === 0) return null;
    return filtered[Math.floor(Math.random() * filtered.length)];
  };

  const [randomPick, setRandomPick] = useState<CopingStrategy | null>(null);

  const handleRandomPick = () => {
    setRandomPick(getRandomStrategy());
  };

  const exportMenu = () => {
    const groupedByCategory = CATEGORIES.map(cat => ({
      ...cat,
      items: strategies.filter(s => s.category === cat.value),
    })).filter(cat => cat.items.length > 0);

    const content = `${menuName.toUpperCase()}
${'='.repeat(60)}

${groupedByCategory.map(cat => `
${cat.label.toUpperCase()}
${'-'.repeat(40)}
${cat.items.map((s, i) => `${i + 1}. ${s.strategy} (${s.duration})`).join('\n')}
`).join('')}

--- HOW TO USE YOUR COPING MENU ---

1. WHEN CALM: Review your menu together. Practice each strategy.

2. WHEN STRESSED: 
   • Ask: "What from your menu might help?"
   • Offer 2-3 choices (choice reduces anxiety)
   • Use visual menu if verbal is hard

3. AFTER: Reflect: "Did that help? Try another?"

--- TIPS ---

✓ Update menu regularly (strategies change with age/mood)
✓ Include sensory + movement + calming options
✓ Short strategies (2-5 min) for quick regulation
✓ Longer strategies (10-20 min) for deeper resets
✓ Make it visual: add pictures or icons
✓ Keep copies in multiple places (home, school, bag)

Evidence: Self-regulation strategies reduce meltdowns (NICE CG170)
Citation: https://www.nice.org.uk/guidance/cg170
`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${menuName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredStrategies = selectedCategory === 'all'
    ? strategies
    : strategies.filter(s => s.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    return CATEGORIES.find(c => c.value === category)?.color || '';
  };

  return (
    <Card className="border-teal-200 dark:border-teal-800">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-100 dark:bg-teal-900 rounded-lg">
            <UtensilsCrossed className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="flex-1">
            <CardTitle>Coping Menu Builder</CardTitle>
            <CardDescription>
              Create a personalized "menu" of regulation strategies
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Quick Start */}
        <div>
          <Label className="mb-2 block">Quick Start</Label>
          <Button onClick={loadPresets} variant="outline" size="sm">
            Load Preset Strategies (12 evidence-based options)
          </Button>
        </div>

        {/* Menu Name */}
        <div>
          <Label htmlFor="menuName">Menu Name</Label>
          <Input
            id="menuName"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="e.g., Sarah's Calm-Down Menu"
          />
        </div>

        {/* Add Strategy */}
        <div className="space-y-3">
          <Label>Add Strategy</Label>
          <div className="grid gap-2 sm:grid-cols-[120px_1fr_100px_auto]">
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newStrategy}
              onChange={(e) => setNewStrategy(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addStrategy()}
              placeholder="e.g., Listen to music"
            />
            <Select value={newDuration} onValueChange={setNewDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {['2 min', '5 min', '10 min', '15 min', '20 min'].map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addStrategy} disabled={!newStrategy.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filter */}
        {strategies.length > 0 && (
          <div>
            <Label>Filter by Category</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All ({strategies.length})
              </Button>
              {CATEGORIES.map((cat) => {
                const count = strategies.filter(s => s.category === cat.value).length;
                if (count === 0) return null;
                return (
                  <Button
                    key={cat.value}
                    variant={selectedCategory === cat.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.value)}
                  >
                    {cat.label} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Random Picker */}
        {strategies.length > 0 && (
          <Card className="border-2 border-dashed border-teal-300 dark:border-teal-700">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Can't decide? Pick one for me!</p>
                <Button onClick={handleRandomPick} variant="outline" size="sm">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random Pick
                </Button>
              </div>
              {randomPick && (
                <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getCategoryColor(randomPick.category)}>
                      {CATEGORIES.find(c => c.value === randomPick.category)?.label}
                    </Badge>
                    <Badge variant="outline">{randomPick.duration}</Badge>
                  </div>
                  <p className="text-lg font-medium">{randomPick.strategy}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Strategies List */}
        {filteredStrategies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{menuName}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredStrategies.map((strategy, index) => (
                  <div
                    key={strategy.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-medium text-muted-foreground">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="font-medium">{strategy.strategy}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getCategoryColor(strategy.category)} variant="secondary">
                            {CATEGORIES.find(c => c.value === strategy.category)?.label}
                          </Badge>
                          <Badge variant="outline">{strategy.duration}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStrategy(strategy.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {strategies.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <UtensilsCrossed className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                Load presets or add your first coping strategy to build your menu
              </p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        {strategies.length > 0 && (
          <div className="flex gap-2 justify-center">
            <Button onClick={exportMenu}>
              <Download className="w-4 h-4 mr-2" />
              Export Menu
            </Button>
            <Button variant="outline" onClick={() => setStrategies([])}>
              Clear All
            </Button>
          </div>
        )}

        {/* Tip */}
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Tip:</strong> Build the menu together when calm. Practice each strategy so they're 
              familiar when needed. Update the menu as preferences change. Having choices reduces anxiety 
              and increases buy-in.
            </p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
