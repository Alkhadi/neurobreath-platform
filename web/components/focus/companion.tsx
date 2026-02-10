'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  MessageCircle, Settings, X
} from 'lucide-react'
import {
  COMPANION_TYPES,
  COMPANION_ACCESSORIES,
  MOOD_VISUALS,
  getCompanionDialogue,
} from '@/lib/focus/companion-data'
import type { CompanionData } from '@/lib/focus-garden-store'

interface CompanionProps {
  companion: CompanionData;
  onCustomize?: () => void;
  onInteract?: () => void;
  context?: 'greeting' | 'session-start' | 'session-end' | 'harvest' | 'streak' | 'idle' | 'comeback' | 'breathing' | 'level-up' | 'quest-complete';
  size?: 'sm' | 'md' | 'lg';
  showDialogue?: boolean;
}

export function Companion({
  companion,
  onCustomize,
  onInteract,
  context = 'greeting',
  size = 'md',
  showDialogue = true
}: CompanionProps) {
  const [dialogue, setDialogue] = useState<string | null>(null);
  const [showFullDialogue, setShowFullDialogue] = useState(false);

  const companionProfile = COMPANION_TYPES[companion.type];
  const moodVisual = MOOD_VISUALS[companion.mood];
  const accessoryEmoji = companion.activeAccessory
    ? (COMPANION_ACCESSORIES.find(a => a.id === companion.activeAccessory)?.emoji ?? null)
    : null;

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      emoji: 'text-3xl',
      accessory: 'text-lg',
      dialogueBubble: 'max-w-[150px] text-xs p-2'
    },
    md: {
      container: 'w-24 h-24',
      emoji: 'text-5xl',
      accessory: 'text-2xl',
      dialogueBubble: 'max-w-xs text-sm p-3'
    },
    lg: {
      container: 'w-32 h-32',
      emoji: 'text-6xl',
      accessory: 'text-3xl',
      dialogueBubble: 'max-w-sm text-base p-4'
    }
  }[size];

  // Update dialogue when context or mood changes
  useEffect(() => {
    if (showDialogue) {
      const dialogueData = getCompanionDialogue(companion.type, context);
      setDialogue(dialogueData.text);
      
      // Auto-hide dialogue after 5 seconds
      const timer = setTimeout(() => {
        setDialogue(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [companion.type, context, showDialogue, companion.mood]);

  const handleCompanionClick = useCallback(() => {
    // Show dialogue on click
    const dialogueData = getCompanionDialogue(companion.type, context);
    setDialogue(dialogueData.text);
    setShowFullDialogue(true);
    
    if (onInteract) {
      onInteract();
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowFullDialogue(false);
      setTimeout(() => setDialogue(null), 300);
    }, 5000);
  }, [companion.type, context, onInteract]);

  return (
    <div className="relative inline-block group">
      {/* Dialogue Bubble */}
      {dialogue && showDialogue && (
        <div
          className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 z-10",
            showFullDialogue ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          )}
        >
          <div
            className={cn(
              "relative rounded-2xl shadow-lg border-2",
              sizeClasses.dialogueBubble,
              moodVisual.bgColor,
              moodVisual.borderColor
            )}
          >
            <button
              aria-label="Close dialogue"
              onClick={() => {
                setShowFullDialogue(false);
                setTimeout(() => setDialogue(null), 300);
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="w-3 h-3 text-slate-600" />
            </button>
            
            <p className="font-medium text-slate-800 leading-relaxed">
              {dialogue}
            </p>
            
            {/* Speech bubble arrow */}
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-8 border-transparent drop-shadow-md",
                `border-t-8`,
                moodVisual.borderColor.replace('border', 'border-t')
              )}
            />
          </div>
        </div>
      )}

      {/* Companion */}
      <button
        onClick={handleCompanionClick}
        className={cn(
          "relative rounded-3xl border-4 shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-offset-2",
          sizeClasses.container,
          moodVisual.bgColor,
          moodVisual.borderColor,
          moodVisual.animation,
          "cursor-pointer"
        )}
      >
        {/* Main Emoji */}
        <div className={cn(
          "absolute inset-0 flex items-center justify-center transition-transform group-hover:scale-110",
          sizeClasses.emoji
        )}>
          {companionProfile.emoji}
        </div>

        {/* Accessory */}
        {accessoryEmoji && (
          <div className={cn(
            "absolute -top-2 -right-2 transition-transform group-hover:rotate-12",
            sizeClasses.accessory
          )}>
            {accessoryEmoji}
          </div>
        )}

        {/* Mood Indicator */}
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-slate-200">
          <span className="text-xs">{moodVisual.emoji}</span>
        </div>

        {/* Level Badge */}
        {companion.level > 1 && (
          <div className="absolute -top-1 -left-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
            <span className="text-xs font-bold text-white">{companion.level}</span>
          </div>
        )}

        {/* Sparkle Effect on Hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </button>

      {/* Action Buttons */}
      {size !== 'sm' && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="outline"
            className="h-7 px-2 bg-white shadow-md border-slate-300 hover:bg-slate-50"
            onClick={(e) => {
              e.stopPropagation();
              handleCompanionClick();
            }}
          >
            <MessageCircle className="w-3 h-3" />
          </Button>
          
          {onCustomize && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 bg-white shadow-md border-slate-300 hover:bg-slate-50"
              onClick={(e) => {
                e.stopPropagation();
                onCustomize();
              }}
            >
              <Settings className="w-3 h-3" />
            </Button>
          )}
        </div>
      )}

      {/* Companion Info Tooltip on Hover */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl max-w-[min(18rem,calc(100vw-2rem))] whitespace-normal break-words text-center">
          <div className="font-bold">{companion.name || companionProfile.name}</div>
          <div className="text-slate-300 text-[10px]">Level {companion.level}</div>
        </div>
      </div>
    </div>
  );
}

// ========== COMPANION IN SESSION VIEW ==========

interface CompanionInSessionProps {
  companion: CompanionData;
  isBreathing?: boolean;
  breathPhase?: 'inhale' | 'hold' | 'exhale' | 'rest';
  phaseDurationMs?: number;
}

export function CompanionInSession({
  companion,
  isBreathing = false,
  breathPhase = 'rest',
  phaseDurationMs = 4000
}: CompanionInSessionProps) {
  const companionProfile = COMPANION_TYPES[companion.type];

  const transitionDurationBucket = (() => {
    if (phaseDurationMs <= 1000) return 1000;
    if (phaseDurationMs <= 2000) return 2000;
    if (phaseDurationMs <= 3000) return 3000;
    if (phaseDurationMs <= 4000) return 4000;
    return 5000;
  })();
  
  // Breathing animations
  const breathAnimations = {
    inhale: 'scale-125',
    hold: 'scale-125',
    exhale: 'scale-100',
    rest: 'scale-100'
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Companion with breathing animation */}
      <div
        data-nb-duration={String(transitionDurationBucket)}
        className={cn(
          "text-8xl transition-transform ease-in-out nb-breath-duration",
          isBreathing && breathAnimations[breathPhase]
        )}
      >
        {companionProfile.emoji}
      </div>

      {/* Breathing instruction */}
      {isBreathing && (
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900 capitalize">
            {breathPhase === 'hold' ? 'Hold' : breathPhase}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            {breathPhase === 'inhale' && 'Breathe in slowly...'}
            {breathPhase === 'hold' && 'Hold your breath...'}
            {breathPhase === 'exhale' && 'Breathe out slowly...'}
            {breathPhase === 'rest' && 'Rest...'}
          </p>
        </div>
      )}

      {/* Companion doing activity */}
      {!isBreathing && (
        <div className="text-center">
          <p className="text-lg font-medium text-slate-700">
            {companion.name || companionProfile.name} is focusing with you
          </p>
          <div className="flex items-center gap-2 justify-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-600">In the zone</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ========== COMPACT COMPANION INDICATOR ==========

interface CompactCompanionProps {
  companion: CompanionData;
  onClick?: () => void;
}

export function CompactCompanion({ companion, onClick }: CompactCompanionProps) {
  const companionProfile = COMPANION_TYPES[companion.type];
  const moodVisual = MOOD_VISUALS[companion.mood];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-14 h-14 rounded-2xl border-2 shadow-md transition-all hover:scale-110 flex items-center justify-center text-3xl group",
        moodVisual.bgColor,
        moodVisual.borderColor
      )}
    >
      {companionProfile.emoji}
      
      {/* Mood indicator */}
      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200">
        <span className="text-[10px]">{moodVisual.emoji}</span>
      </div>

      {/* Level */}
      {companion.level > 1 && (
        <div className="absolute -top-1 -left-1 w-5 h-5 bg-amber-500 rounded-full shadow-md flex items-center justify-center border border-white">
          <span className="text-[10px] font-bold text-white">{companion.level}</span>
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-xl max-w-[min(18rem,calc(100vw-2rem))] whitespace-normal break-words text-center">
          {companion.name || companionProfile.name}
        </div>
      </div>
    </button>
  );
}
