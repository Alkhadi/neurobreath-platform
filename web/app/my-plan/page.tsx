'use client';

import { useState } from 'react';
import { BookmarkIcon, Clock, CheckCircle2, Plus, Trash2, StickyNote, Calendar } from 'lucide-react';
import { useUserPreferencesState } from '@/lib/user-preferences/useUserPreferences';
import { useMyPlanActions } from '@/lib/user-preferences/useMyPlanActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import type { SavedItem } from '@/lib/user-preferences/schema';

export default function MyPlanPage() {
  const { myPlan, isLoaded } = useUserPreferencesState();
  const { removeSavedItem, updateSavedItemNote, setJourneyProgress, clearJourneyProgress } = useMyPlanActions();
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  if (!isLoaded) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your plan...</p>
          </div>
        </div>
      </div>
    );
  }

  const savedItems = myPlan.savedItems || [];
  const journeyProgress = Object.entries(myPlan.journeyProgress || {});
  const routine = myPlan.routinePlan?.slots || [];

  const handleStartEditNote = (item: SavedItem) => {
    setEditingNoteId(item.id);
    setNoteText(item.note || '');
  };

  const handleSaveNote = (itemId: string) => {
    updateSavedItemNote(itemId, noteText);
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleCancelEditNote = () => {
    setEditingNoteId(null);
    setNoteText('');
  };

  const handleRemoveItem = (itemId: string) => {
    if (confirm('Remove this item from your plan?')) {
      removeSavedItem(itemId);
    }
  };

  const handleMarkJourneyComplete = (journeyId: string) => {
    const progress = myPlan.journeyProgress?.[journeyId];
    if (progress && confirm('Mark this journey as complete?')) {
      setJourneyProgress(journeyId, progress.totalSteps, progress.totalSteps);
    }
  };

  const handleClearJourney = (journeyId: string) => {
    if (confirm('Remove this journey from your progress?')) {
      clearJourneyProgress(journeyId);
    }
  };

  const getItemIcon = (type: SavedItem['type']) => {
    switch (type) {
      case 'journey':
        return <Calendar className="w-5 h-5" />;
      case 'tool':
      case 'guide':
        return <BookmarkIcon className="w-5 h-5" />;
      default:
        return <BookmarkIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <BookmarkIcon className="w-8 h-8" />
          My Plan
        </h1>
        <p className="text-muted-foreground">
          Your personalized collection of tools, guides, and progress tracking
        </p>
      </div>

      <Tabs defaultValue="saved" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <BookmarkIcon className="w-4 h-4" />
            Saved Items ({savedItems.length})
          </TabsTrigger>
          <TabsTrigger value="journeys" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Journeys ({journeyProgress.length})
          </TabsTrigger>
          <TabsTrigger value="routine" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Routine ({routine.length})
          </TabsTrigger>
        </TabsList>

        {/* Saved Items Tab */}
        <TabsContent value="saved" className="space-y-4">
          {savedItems.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <BookmarkIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No saved items yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Save tools, guides, and resources from around the site to build your personalized plan
                </p>
                <Button asChild>
                  <Link href="/tools">Browse Tools</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {savedItems.map((item) => (
                <Card key={item.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          {getItemIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg mb-1">
                            <Link href={item.href} className="hover:underline">
                              {item.title}
                            </Link>
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {item.type}
                            </Badge>
                            {item.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editingNoteId === item.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Add a personal note..."
                          rows={3}
                          className="resize-none"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleSaveNote(item.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEditNote}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {item.note ? (
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                              {item.note}
                            </p>
                          </div>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEditNote(item)}
                          className="text-xs"
                        >
                          <StickyNote className="w-3 h-3 mr-1" />
                          {item.note ? 'Edit Note' : 'Add Note'}
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Saved {new Date(item.savedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Journey Progress Tab */}
        <TabsContent value="journeys" className="space-y-4">
          {journeyProgress.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No journeys in progress</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start a journey to track your progress through structured programs
                </p>
                <Button asChild>
                  <Link href="/journeys">Explore Journeys</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {journeyProgress.map(([journeyId, progress]) => {
                const percentComplete = Math.round((progress.currentStep / progress.totalSteps) * 100);
                return (
                  <Card key={journeyId}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {progress.completed && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                            {journeyId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </CardTitle>
                          <CardDescription>
                            Step {progress.currentStep} of {progress.totalSteps} • {percentComplete}% complete
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {!progress.completed && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkJourneyComplete(journeyId)}
                            >
                              Mark Complete
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleClearJourney(journeyId)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${percentComplete}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Started {new Date(progress.startedAt).toLocaleDateString()}</span>
                          <span>Updated {new Date(progress.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Routine Tab */}
        <TabsContent value="routine" className="space-y-4">
          {routine.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold mb-2">No routine set up</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Build a daily routine with your saved tools and exercises
                </p>
                <Button disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Build Routine (Coming Soon)
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Your Daily Routine</CardTitle>
                <CardDescription>Scheduled activities throughout your week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {routine.map((slot, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">
                          {slot.day} - {slot.timeOfDay}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {slot.itemRef} ({slot.duration} min)
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
