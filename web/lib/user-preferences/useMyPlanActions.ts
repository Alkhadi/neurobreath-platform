/**
 * My Plan Actions Hook
 * 
 * Composable hook for managing My Plan state
 * (saved items, journey progress, routines, notes).
 */

'use client';

import { useUserPreferences } from './useUserPreferences';
import type {
  SavedItem,
  SavedItemType,
  JourneyProgress,
  RoutineSlot,
  DayOfWeek,
  TimeOfDay,
  Region,
} from './schema';

export function useMyPlanActions() {
  const { state, updateState } = useUserPreferences();

  // Saved Items
  const addSavedItem = (
    type: SavedItemType,
    id: string,
    title: string,
    href: string,
    tags: string[],
    region: Region
  ) => {
    // Check if already saved
    const exists = state.myPlan.savedItems.some((item) => item.id === id);
    if (exists) return;

    const newItem: SavedItem = {
      id,
      type,
      title,
      href,
      tags,
      region,
      savedAt: new Date().toISOString(),
    };

    updateState({
      myPlan: {
        ...state.myPlan,
        savedItems: [...state.myPlan.savedItems, newItem],
      },
    });
  };

  const removeSavedItem = (id: string) => {
    updateState({
      myPlan: {
        ...state.myPlan,
        savedItems: state.myPlan.savedItems.filter((item) => item.id !== id),
      },
    });
  };

  const updateSavedItemNote = (id: string, note: string) => {
    updateState({
      myPlan: {
        ...state.myPlan,
        savedItems: state.myPlan.savedItems.map((item) =>
          item.id === id ? { ...item, note } : item
        ),
      },
    });
  };

  const isSaved = (id: string): boolean => {
    return state.myPlan.savedItems.some((item) => item.id === id);
  };

  // Journey Progress
  const setJourneyProgress = (
    journeyId: string,
    currentStep: number,
    totalSteps: number
  ) => {
    const existing = state.myPlan.journeyProgress[journeyId];
    const now = new Date().toISOString();

    const progress: JourneyProgress = {
      journeyId,
      currentStep,
      totalSteps,
      startedAt: existing?.startedAt || now,
      updatedAt: now,
      completed: currentStep >= totalSteps,
    };

    updateState({
      myPlan: {
        ...state.myPlan,
        journeyProgress: {
          ...state.myPlan.journeyProgress,
          [journeyId]: progress,
        },
      },
    });
  };

  const clearJourneyProgress = (journeyId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [journeyId]: _removed, ...rest } = state.myPlan.journeyProgress;
    updateState({
      myPlan: {
        ...state.myPlan,
        journeyProgress: rest,
      },
    });
  };

  const getJourneyProgress = (journeyId: string): JourneyProgress | null => {
    return state.myPlan.journeyProgress[journeyId] || null;
  };

  // Routine Planner
  const addRoutineSlot = (
    day: DayOfWeek,
    timeOfDay: TimeOfDay,
    itemRef: string,
    duration?: number
  ) => {
    const newSlot: RoutineSlot = {
      day,
      timeOfDay,
      itemRef,
      duration,
    };

    updateState({
      myPlan: {
        ...state.myPlan,
        routinePlan: {
          ...state.myPlan.routinePlan,
          slots: [...state.myPlan.routinePlan.slots, newSlot],
        },
      },
    });
  };

  const removeRoutineSlot = (day: DayOfWeek, timeOfDay: TimeOfDay, itemRef: string) => {
    updateState({
      myPlan: {
        ...state.myPlan,
        routinePlan: {
          ...state.myPlan.routinePlan,
          slots: state.myPlan.routinePlan.slots.filter(
            (slot) =>
              !(slot.day === day && slot.timeOfDay === timeOfDay && slot.itemRef === itemRef)
          ),
        },
      },
    });
  };

  const setRoutinePreset = (presetName: string, slots: RoutineSlot[]) => {
    updateState({
      myPlan: {
        ...state.myPlan,
        routinePlan: {
          presetName,
          slots,
        },
      },
    });
  };

  const clearRoutine = () => {
    updateState({
      myPlan: {
        ...state.myPlan,
        routinePlan: {
          slots: [],
        },
      },
    });
  };

  return {
    myPlan: state.myPlan,
    // Saved items
    addSavedItem,
    removeSavedItem,
    updateSavedItemNote,
    isSaved,
    // Journey progress
    setJourneyProgress,
    clearJourneyProgress,
    getJourneyProgress,
    // Routine planner
    addRoutineSlot,
    removeRoutineSlot,
    setRoutinePreset,
    clearRoutine,
  };
}
