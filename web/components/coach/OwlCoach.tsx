/**
 * Owl Coach Component
 * 
 * Duolingo-style habit companion that appears on allowed routes only.
 * Displays daily quests, streak status, and motivational messages.
 * 
 * ROUTE ALLOWLIST (EXPLICIT):
 * - Primary: /, /get-started, /dyslexia-reading-training, /progress, /rewards, /coach
 * - Breathing/Techniques: /breathing/*, /techniques/*
 * - Tools: /tools/*
 * - Conditions: /adhd, /anxiety, /autism, /sleep, /stress, /conditions/*
 * 
 * EXCLUSIONS:
 * - /blog, /ai-blog, /resources, /downloads, /support-us, /contact
 * - /schools, /send-report, /teacher-quick-pack, /teacher/dashboard
 * - /parent/*
 */

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Trophy, 
  Flame,
  Target,
  X,
} from 'lucide-react'
import { getActiveProfileId, getActiveProfile } from '@/lib/onboarding/deviceProfileStore'
import { getOwlCoachState, isQuietHours, type OwlMood } from '@/lib/coach/owlCoachEngine'
import { getStreak } from '@/lib/progress/progressStore'

// ============================================================================
// ROUTE MATCHING
// ============================================================================

const ALLOWED_ROUTES_EXACT = [
  '/',
  '/get-started',
  '/dyslexia-reading-training',
  '/progress',
  '/rewards',
  '/coach',
]

const ALLOWED_ROUTES_PREFIX = [
  '/breathing',
  '/techniques',
  '/tools',
  '/conditions',
]

const ALLOWED_ROUTES_CONDITION_HUBS = [
  '/adhd',
  '/anxiety',
  '/autism',
  '/sleep',
  '/stress',
]

const EXCLUDED_ROUTES = [
  '/blog',
  '/ai-blog',
  '/resources',
  '/downloads',
  '/support-us',
  '/contact',
  '/schools',
  '/send-report',
  '/teacher-quick-pack',
  '/teacher/dashboard',
  '/parent',
]

/**
 * Check if Owl Coach should render on this route
 */
function shouldShowOwlCoach(pathname: string): boolean {
  // Check exclusions first
  for (const excluded of EXCLUDED_ROUTES) {
    if (pathname.startsWith(excluded)) {
      return false
    }
  }
  
  // Check exact matches
  if (ALLOWED_ROUTES_EXACT.includes(pathname)) {
    return true
  }
  
  // Check condition hubs (exact match)
  if (ALLOWED_ROUTES_CONDITION_HUBS.includes(pathname)) {
    return true
  }
  
  // Check prefix matches
  for (const prefix of ALLOWED_ROUTES_PREFIX) {
    if (pathname.startsWith(prefix)) {
      return true
    }
  }
  
  return false
}

// ============================================================================
// OWL MOOD ICONS & COLORS
// ============================================================================

const OWL_MOOD_CONFIG: Record<OwlMood, { icon: string; color: string; bgColor: string }> = {
  GENIUS: {
    icon: '🦉💡',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  HAPPY: {
    icon: '🦉😊',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  CONCERNED: {
    icon: '🦉🤔',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
  },
  FIRM: {
    icon: '🦉💪',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  CELEBRATE: {
    icon: '🦉🎉',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
}

// ============================================================================
// COMPONENT
// ============================================================================

export function OwlCoach() {
  const pathname = usePathname()
  
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  // Profile and coach state
  const [profileId, setProfileId] = useState<string | null>(null)
  const [owlState, setOwlState] = useState<ReturnType<typeof getOwlCoachState> | null>(null)
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  
  // Load state on mount
  useEffect(() => {
    setMounted(true)
    
    const activeProfileId = getActiveProfileId()
    if (!activeProfileId) {
      setIsHidden(true)
      return
    }
    
    const profile = getActiveProfile()
    if (!profile) {
      setIsHidden(true)
      return
    }
    
    // Check if user disabled Owl Coach
    if (profile.settings?.showOwlCoach === false) {
      setIsHidden(true)
      return
    }
    
    // Check quiet hours
    if (isQuietHours(profile.settings?.quietHoursStart, profile.settings?.quietHoursEnd)) {
      setIsHidden(true)
      return
    }
    
    setProfileId(activeProfileId)
    
    // Load coach state
    const tone = profile.settings?.owlTone || 'standard'
    const state = getOwlCoachState(activeProfileId, tone)
    setOwlState(state)
    
    // Load streak
    const streakData = getStreak(activeProfileId)
    setStreak({
      current: streakData.current,
      longest: streakData.longest,
    })
  }, [])
  
  // Check route allowlist
  if (!mounted || isHidden || isDismissed || !shouldShowOwlCoach(pathname || '/')) {
    return null
  }
  
  if (!profileId || !owlState) {
    return null
  }
  
  const moodConfig = OWL_MOOD_CONFIG[owlState.mood]
  
  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm">
      <Card className={`shadow-xl border-2 ${moodConfig.bgColor} border-primary/20`}>
        <CardContent className="p-0">
          {/* Collapsed View - Owl Bubble */}
          {!isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="w-full p-4 flex items-center gap-3 hover:bg-muted/20 transition-colors text-left"
              aria-label="Expand Owl Coach"
              aria-expanded="false"
            >
              <div className="text-4xl flex-shrink-0">
                {moodConfig.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${moodConfig.color} truncate`}>
                  Genius Owl Coach
                </p>
                {streak.current > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span>{streak.current} day streak</span>
                  </div>
                )}
              </div>
              <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </button>
          )}
          
          {/* Expanded View - Full Panel */}
          {isExpanded && (
            <div className="p-4 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="text-3xl">
                    {moodConfig.icon}
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${moodConfig.color}`}>
                      Genius Owl Coach
                    </h3>
                    <p className="text-xs text-muted-foreground">Your practice companion</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1 hover:bg-muted/50 rounded transition-colors"
                    aria-label="Collapse Owl Coach"
                  >
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDismissed(true)}
                    className="p-1 hover:bg-muted/50 rounded transition-colors"
                    aria-label="Dismiss Owl Coach"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
              
              {/* Owl Message */}
              <div className={`p-3 rounded-lg ${moodConfig.bgColor} border border-primary/10`}>
                <p className="text-sm text-foreground leading-relaxed">
                  {owlState.message}
                </p>
              </div>
              
              {/* Streak Display */}
              {streak.current > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {streak.current} Day Streak
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Best: {streak.longest} days
                      </p>
                    </div>
                  </div>
                  <Trophy className="w-6 h-6 text-orange-500" />
                </div>
              )}
              
              {/* Daily Quest */}
              {owlState.quest && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <h4 className="text-sm font-semibold text-foreground">Today's Quest</h4>
                  </div>
                  <div className="space-y-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {owlState.quest.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {owlState.quest.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-primary flex-shrink-0">
                        <Sparkles className="w-3 h-3" />
                        <span>+{owlState.quest.reward.xp} XP</span>
                      </div>
                    </div>
                    <Progress value={owlState.quest.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      {Math.round(owlState.quest.progress)}% complete
                    </p>
                  </div>
                </div>
              )}
              
              {/* Action Button */}
              {owlState.action && (
                <Link href={owlState.action.route} className="block">
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    size="lg"
                  >
                    {owlState.action.label}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

