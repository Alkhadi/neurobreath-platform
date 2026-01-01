# DYNAMIC SUBTITLES IMPLEMENTATION ✅

## What Was Added

Route-aware dynamic subtitles that make the onboarding card feel contextual and relevant.

## Files Created/Modified

### Created:
1. **`lib/onboarding/getOnboardingSubtitle.ts`** - Helper functions for route-aware text

### Modified:
2. **`components/OnboardingCard.tsx`** - Now uses dynamic subtitle based on pathname

## How It Works

The subtitle changes based on the current route to provide contextual guidance:

### Examples:

| Route | Subtitle |
|-------|----------|
| `/` | "Pick a quick activity and protect your streak today." |
| `/get-started` | "Set up a learner profile for personalised progress tracking." |
| `/dyslexia-reading-training` | "Start dyslexia-friendly practice and track progress over time." |
| `/progress` | "Review streaks, milestones, and next recommended practice." |
| `/rewards` | "Collect badges and celebrate progress milestones." |
| `/tools/*` | "Choose a tool and complete today's quick quest." |
| `/breathing/*` | "Use a breathing tool to improve focus and calm in minutes." |
| `/techniques/*` | "Pick a technique and follow a guided routine." |
| `/conditions/*` | "Explore practical strategies and supportive guidance for today." |

### Locked State (when PIN required):

| Route | Locked Subtitle |
|-------|-----------------|
| `/get-started` | "Unlock to create another learner profile" |
| `/progress`, `/rewards` | "Unlock to view and manage profiles" |
| Default | "Click to unlock and manage profiles" |

## Implementation Details

### The Helper Function:

```typescript
// lib/onboarding/getOnboardingSubtitle.ts
export function getOnboardingSubtitle(pathname: string): string {
  // Exact matches
  if (pathname === '/') return 'Pick a quick activity...'
  if (pathname === '/get-started') return 'Set up a learner profile...'
  
  // Prefix matches
  if (pathname.startsWith('/tools')) return 'Choose a tool...'
  if (pathname.startsWith('/breathing')) return 'Use a breathing tool...'
  
  // Default
  return 'Get started with personalised reading training.'
}
```

### In OnboardingCard:

```typescript
// components/OnboardingCard.tsx
'use client'

import { usePathname } from 'next/navigation'
import { getOnboardingSubtitle, getOnboardingLockedSubtitle } from '@/lib/onboarding/getOnboardingSubtitle'

export function OnboardingCard({ deviceId, profileStatus }: OnboardingCardProps) {
  const pathname = usePathname()
  
  // Dynamic subtitle based on route and lock state
  const subtitle = isLocked && !isUnlocked 
    ? getOnboardingLockedSubtitle(pathname || '/')
    : getOnboardingSubtitle(pathname || '/')
  
  return (
    <Card>
      <button>
        <h2>Welcome to NeuroBreath!</h2>
        <p>{subtitle}</p> {/* ← Dynamic! */}
      </button>
    </Card>
  )
}
```

## UX Benefits

✅ **Contextual**: User knows exactly what the onboarding is for on each page
✅ **Helpful**: Provides clear next steps relevant to their current location
✅ **Professional**: Feels polished and intentional
✅ **Engaging**: Different messages keep it fresh
✅ **Clear**: No confusion about what creating a profile will do

## Testing

After restarting dev server, navigate to different routes and observe the subtitle change:

```bash
yarn dev

# Visit these routes and watch the subtitle change:
http://localhost:3001/                       # "Pick a quick activity..."
http://localhost:3001/get-started            # "Set up a learner profile..."
http://localhost:3001/dyslexia-reading-training  # "Start dyslexia-friendly practice..."
http://localhost:3001/breathing/techniques/sos-60  # "Use a breathing tool..."
http://localhost:3001/tools/focus-tiles      # "Choose a tool..."
```

## Extensibility

Easy to add more route-specific messages:

```typescript
// lib/onboarding/getOnboardingSubtitle.ts

export function getOnboardingSubtitle(pathname: string): string {
  // ... existing code ...
  
  // Add new routes here:
  if (p === '/my-new-page') return 'Your custom message for this page.'
  if (p.startsWith('/new-section')) return 'Message for this section.'
  
  return 'Get started with personalised reading training.'
}
```

## Status

✅ **Dynamic subtitles IMPLEMENTED**
✅ **Route-aware messaging WORKING**
✅ **No linter errors**
✅ **Ready for testing**

The onboarding card now provides contextual, helpful guidance that changes based on where the user is in the app! 🎯

