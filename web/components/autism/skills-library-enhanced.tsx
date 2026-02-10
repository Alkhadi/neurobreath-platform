'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { skills } from '@/lib/data/skills';
import { Search, Star, StarOff, Play, Pause, Check, BookOpen, TrendingUp, Clock, Award } from 'lucide-react';
import { logSkillPractice, toggleFavoriteSkill, loadProgress, getMasteryLevelName } from '@/lib/progress-store-enhanced';
import { toast } from 'sonner';

interface SkillsLibraryEnhancedProps {
  onProgressUpdate?: () => void;
}

export function SkillsLibraryEnhanced({ onProgressUpdate }: SkillsLibraryEnhancedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isPracticing, setIsPracticing] = useState(false);
  const [practiceTime, setPracticeTime] = useState(0);
  const [practiceNotes, setPracticeNotes] = useState('');
  type ProgressState = ReturnType<typeof loadProgress>;
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [sortBy, setSortBy] = useState<'relevance' | 'mastery' | 'recent'>('relevance');
  const practiceIntervalRef = useRef<number | null>(null);

  // Load progress on mount and when updated - client side only to avoid hydration mismatch
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  // All unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    skills.forEach(skill => skill.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet);
  }, []);

  // Filter and sort skills
  const filteredSkills = useMemo(() => {
    let filtered = skills.filter(skill => {
      const matchesSearch = searchQuery === '' || 
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => skill.tags.includes(tag));
      
      return matchesSearch && matchesTags;
    });

    // Sort
    if (sortBy === 'mastery' && progress) {
      filtered = filtered.sort((a, b) => {
        const masteryA = progress?.skillMastery?.[a.id]?.level || 0;
        const masteryB = progress?.skillMastery?.[b.id]?.level || 0;
        return masteryB - masteryA;
      });
    } else if (sortBy === 'recent' && progress) {
      filtered = filtered.sort((a, b) => {
        const lastA = progress?.skillMastery?.[a.id]?.lastPracticed || '';
        const lastB = progress?.skillMastery?.[b.id]?.lastPracticed || '';
        return lastB.localeCompare(lastA);
      });
    }

    return filtered;
  }, [searchQuery, selectedTags, sortBy, progress]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleToggleFavorite = (skillId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedProgress = toggleFavoriteSkill(skillId);
    setProgress(updatedProgress);
    onProgressUpdate?.();
  };

  const startPractice = (skillId: string) => {
    setSelectedSkill(skillId);
    setIsPracticing(true);
    setPracticeTime(0);
    setPracticeNotes('');
    
    // Start timer
    const interval = window.setInterval(() => {
      setPracticeTime(prev => prev + 1);
    }, 1000);

    practiceIntervalRef.current = interval;
  };

  const stopPractice = (completed: boolean = true) => {
    if (practiceIntervalRef.current) {
      clearInterval(practiceIntervalRef.current);
      practiceIntervalRef.current = null;
    }
    
    if (selectedSkill && practiceTime > 0) {
      const minutes = Math.ceil(practiceTime / 60);
      const result = logSkillPractice(selectedSkill, minutes, practiceNotes, completed);
      
      setProgress(result.progress);
      onProgressUpdate?.();
      
      // Show celebration
      let message = `+${result.xpAwarded} XP! `;
      if (result.leveledUp) {
        message += '🎉 Level Up! ';
      }
      if (result.masteryLevelUp && selectedSkill) {
        const mastery = result.progress.skillMastery[selectedSkill];
        if (mastery) {
          message += `⭐ ${getMasteryLevelName(mastery.level)} achieved! `;
        }
      }
      if (result.questsCompleted.length > 0) {
        message += `✅ ${result.questsCompleted.length} quest(s) completed!`;
      }
      
      toast.success(message, {
        duration: 5000,
      });
    }
    
    setIsPracticing(false);
    setSelectedSkill(null);
    setPracticeTime(0);
    setPracticeNotes('');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedSkillData = selectedSkill ? skills.find(s => s.id === selectedSkill) : null;

  return (
    <div className="w-full">
      {/* Search and Filters */}
        <div
          className="mb-8 space-y-4"
          data-tour="nb:autism-hub:skills-filters"
          data-tour-order="10"
          data-tour-title="Skills filters & sorting"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground">Filter by:</span>
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === 'relevance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('relevance')}
                className="flex-shrink-0"
              >
                Relevance
              </Button>
              <Button
                variant={sortBy === 'mastery' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('mastery')}
                className="flex-shrink-0"
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Mastery
              </Button>
              <Button
                variant={sortBy === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('recent')}
                className="flex-shrink-0"
              >
                <Clock className="h-4 w-4 mr-1" />
                Recent
              </Button>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            data-tour="nb:autism-hub:skills-results"
            data-tour-order="11"
            data-tour-title="Skills results list"
          >
          {filteredSkills.map(skill => {
            const mastery = progress?.skillMastery?.[skill.id];
            const isFavorite = progress?.favoriteSkills?.includes(skill.id) || false;
            const masteryProgress = mastery ? (mastery.level / 5) * 100 : 0;
            const isFullWidth = skill.id === 'peer-support';
            
            return (
              <Card 
                key={skill.id} 
                className={`group hover:shadow-lg transition-all duration-300 cursor-pointer relative overflow-hidden ${isFullWidth ? 'col-span-full' : ''}`}
                onClick={() => setSelectedSkill(skill.id)}
              >
                {/* Favorite button */}
                <button
                  onClick={(e) => handleToggleFavorite(skill.id, e)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isFavorite ? (
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ) : (
                    <StarOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>

                <CardHeader className="pr-14">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors break-words">
                    {skill.title}
                  </CardTitle>
                  <CardDescription className="break-words">{skill.description}</CardDescription>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {skill.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Mastery Level */}
                  {mastery && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Mastery</span>
                        <span className="font-semibold flex items-center gap-1">
                          <Award className="h-4 w-4 text-yellow-500" />
                          {getMasteryLevelName(mastery.level)}
                        </span>
                      </div>
                      <Progress value={masteryProgress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{mastery.practiceCount} practices</span>
                        <span>{mastery.totalMinutes} min total</span>
                      </div>
                    </div>
                  )}

                  {/* Practice Button */}
                  <Button 
                    className="w-full" 
                    onClick={(e) => {
                      e.stopPropagation();
                      startPractice(skill.id);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skills found matching your criteria.</p>
          </div>
        )}

        {/* Practice Dialog */}
        <Dialog open={isPracticing} onOpenChange={(open) => !open && stopPractice(false)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedSkillData?.title}
                {isPracticing && (
                  <Badge variant="outline" className="ml-auto">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(practiceTime)}
                  </Badge>
                )}
              </DialogTitle>
              <DialogDescription>{selectedSkillData?.whyItHelps}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="steps" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="steps">How To</TabsTrigger>
                <TabsTrigger value="pitfalls">Pitfalls</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
              </TabsList>

              <TabsContent value="steps" className="space-y-4 mt-4">
                <h4 className="font-semibold">Steps:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedSkillData?.howToDo.map((step, idx) => (
                    <li key={idx} className="text-sm">{step}</li>
                  ))}
                </ol>
              </TabsContent>

              <TabsContent value="pitfalls" className="space-y-4 mt-4">
                <h4 className="font-semibold">Common Pitfalls:</h4>
                <ul className="list-disc list-inside space-y-2">
                  {selectedSkillData?.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">{pitfall}</li>
                  ))}
                </ul>

                <h4 className="font-semibold mt-6">Age Adaptations:</h4>
                <div className="space-y-2">
                  {Object.entries(selectedSkillData?.ageAdaptations || {}).map(([age, text]) => (
                    <div key={age} className="text-sm">
                      <Badge variant="outline" className="mr-2">{age}</Badge>
                      {text}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="evidence" className="space-y-4 mt-4">
                <h4 className="font-semibold">Evidence Links:</h4>
                <div className="space-y-2">
                  {selectedSkillData?.evidenceLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{link.text}</span>
                        <Badge variant="secondary">{link.source}</Badge>
                      </div>
                      {link.pmid && (
                        <span className="text-xs text-muted-foreground">PMID: {link.pmid}</span>
                      )}
                    </a>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Practice Notes */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Practice Notes (optional)</label>
                <Textarea
                  placeholder="How did it go? Any observations or adaptations..."
                  value={practiceNotes}
                  onChange={(e) => setPracticeNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  onClick={() => stopPractice(true)}
                  size="lg"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Complete Practice
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => stopPractice(false)}
                  size="lg"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </div>
  );
}
