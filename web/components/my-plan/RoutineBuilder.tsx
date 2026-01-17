'use client';

import { useState } from 'react';
import { Plus, Trash2, Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import { useMyPlanActions } from '@/lib/user-preferences/useMyPlanActions';
import { useUserPreferencesState } from '@/lib/user-preferences/useUserPreferences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { DayOfWeek, TimeOfDay, RoutineSlot } from '@/lib/user-preferences/schema';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIMES: TimeOfDay[] = ['morning', 'afternoon', 'evening'];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const TIME_LABELS: Record<TimeOfDay, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};

const PRESETS = [
  {
    name: 'Daily Meditation',
    description: 'Morning mindfulness routine',
    slots: [
      { day: 'monday' as DayOfWeek, timeOfDay: 'morning' as TimeOfDay, itemRef: 'breathing-exercise', duration: 10 },
      { day: 'tuesday' as DayOfWeek, timeOfDay: 'morning' as TimeOfDay, itemRef: 'breathing-exercise', duration: 10 },
      { day: 'wednesday' as DayOfWeek, timeOfDay: 'morning' as TimeOfDay, itemRef: 'breathing-exercise', duration: 10 },
      { day: 'thursday' as DayOfWeek, timeOfDay: 'morning' as TimeOfDay, itemRef: 'breathing-exercise', duration: 10 },
      { day: 'friday' as DayOfWeek, timeOfDay: 'morning' as TimeOfDay, itemRef: 'breathing-exercise', duration: 10 },
    ],
  },
  {
    name: 'Evening Wind-Down',
    description: 'Relaxation before bed',
    slots: [
      { day: 'sunday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
      { day: 'monday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
      { day: 'tuesday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
      { day: 'wednesday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
      { day: 'thursday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
      { day: 'friday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
      { day: 'saturday' as DayOfWeek, timeOfDay: 'evening' as TimeOfDay, itemRef: 'relaxation-technique', duration: 15 },
    ],
  },
];

export function RoutineBuilder() {
  const { myPlan } = useUserPreferencesState();
  const { addRoutineSlot, removeRoutineSlot, setRoutinePreset, clearRoutine } = useMyPlanActions();
  
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('monday');
  const [selectedTime, setSelectedTime] = useState<TimeOfDay>('morning');
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [duration, setDuration] = useState<number>(10);

  const routine = myPlan.routinePlan?.slots || [];
  const savedItems = myPlan.savedItems || [];

  const handleAddSlot = () => {
    if (!selectedItem) {
      alert('Please select an activity');
      return;
    }
    addRoutineSlot(selectedDay, selectedTime, selectedItem, duration);
  };

  const handleRemoveSlot = (slot: RoutineSlot & { originalIndex: number }) => {
    if (confirm('Remove this activity from your routine?')) {
      removeRoutineSlot(slot.day, slot.timeOfDay, slot.itemRef);
    }
  };

  const handleApplyPreset = (presetName: string) => {
    if (routine.length > 0 && !confirm('This will replace your current routine. Continue?')) {
      return;
    }
    const preset = PRESETS.find(p => p.name === presetName);
    if (preset) {
      setRoutinePreset(presetName, preset.slots);
    }
  };

  const handleClearRoutine = () => {
    if (confirm('Clear your entire routine? This cannot be undone.')) {
      clearRoutine();
    }
  };

  const getSlotsByDay = (day: DayOfWeek) => {
    return routine
      .map((slot, index) => ({ ...slot, originalIndex: index }))
      .filter(slot => slot.day === day)
      .sort((a, b) => {
        const timeOrder = { morning: 0, afternoon: 1, evening: 2 };
        return timeOrder[a.timeOfDay] - timeOrder[b.timeOfDay];
      });
  };

  return (
    <div className="space-y-6">
      {/* Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Quick Start Presets
          </CardTitle>
          <CardDescription>Apply a pre-built routine template</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {PRESETS.map((preset) => (
              <Card key={preset.name} className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base">{preset.name}</CardTitle>
                  <CardDescription className="text-sm">{preset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleApplyPreset(preset.name)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Apply Preset
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Activity
          </CardTitle>
          <CardDescription>Schedule a saved item in your routine</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={selectedDay} onValueChange={(v) => setSelectedDay(v as DayOfWeek)}>
                <SelectTrigger id="day">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>
                      {DAY_LABELS[day]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time of Day</Label>
              <Select value={selectedTime} onValueChange={(v) => setSelectedTime(v as TimeOfDay)}>
                <SelectTrigger id="time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMES.map((time) => (
                    <SelectItem key={time} value={time}>
                      {TIME_LABELS[time]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activity">Activity</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger id="activity">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {savedItems.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No saved items
                    </SelectItem>
                  ) : (
                    savedItems.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(parseInt(v))}>
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 min</SelectItem>
                  <SelectItem value="10">10 min</SelectItem>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="20">20 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleAddSlot} disabled={savedItems.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add to Routine
            </Button>
            {routine.length > 0 && (
              <Button onClick={handleClearRoutine} variant="outline" className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Routine
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Your Weekly Routine
          </CardTitle>
          <CardDescription>
            {routine.length === 0 ? 'No activities scheduled' : `${routine.length} activities scheduled`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {routine.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No activities in your routine yet. Add an activity above to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {DAYS.map((day) => {
                const daySlots = getSlotsByDay(day);
                if (daySlots.length === 0) return null;

                return (
                  <div key={day} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {DAY_LABELS[day]}
                    </h3>
                    <div className="space-y-2">
                      {daySlots.map((slot) => {
                        const item = savedItems.find(i => i.id === slot.itemRef);
                        return (
                          <div
                            key={`${slot.day}-${slot.timeOfDay}-${slot.itemRef}`}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Badge variant="outline">{TIME_LABELS[slot.timeOfDay]}</Badge>
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{slot.duration} min</span>
                              <span className="font-medium">
                                {item?.title || slot.itemRef}
                              </span>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveSlot(slot)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
