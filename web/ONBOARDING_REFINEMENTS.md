# ONBOARDING PLACEMENT REFINEMENTS - COMPLETE ✅

## Changes Made (Based on User Clarification)

### 1. **Onboarding Card Route Restrictions** ✅

**BEFORE:** Onboarding card rendered site-wide (all pages)
**AFTER:** Onboarding card renders ONLY on specific routes

**Allowed Routes (EXACT match):**
- `/` (home) - best place for first-time guidance
- `/get-started` - onboarding hub
- `/dyslexia-reading-training` - "create profile to track progress" prompt
- `/progress` - only if no profile exists (encourage profile creation)
- `/rewards` - only if no profile exists (encourage profile creation)

**Excluded Routes (NEVER render):**
- **Prefix exclusions:** `/teacher/*`, `/parent/*`
- **Exact exclusions:** `/blog`, `/ai-blog`, `/resources`, `/downloads`, `/contact`, `/support-us`, `/schools`, `/send-report`

**Implementation:** `components/OnboardingCardWrapper.tsx`

---

### 2. **State-Based UX (Clean State Machine)** ✅

#### **State A: No Profile Exists**
- ✅ Card is visible, collapsed by default
- ✅ Click expands to show options
- ✅ Primary action: "Create a Learner Profile" → `/get-started`
- ✅ Secondary: "Join a Classroom" → `/schools`
- ✅ Tertiary: "Continue as Guest" → `/dyslexia-reading-training` + set guest mode flag

#### **State B: Profile Exists + PIN Set (Shared Device)**
- ✅ Card becomes locked by default
- ✅ Click opens "Enter PIN" modal (not expand)
- ✅ Correct PIN unlocks for this page visit only
- ✅ Refresh/route change locks again

#### **State C: Profile Exists (No Need for Onboarding)**
- ✅ **Option 1 (Most Pages):** Hide onboarding card completely
- ✅ **Option 2 (/ and /get-started):** Show compact "Profile enabled ✓" banner
  - Non-clickable status indicator
  - Shows active profile name
  - Discreet "Add another learner" link (requires PIN)
  - Dismissible for session (stored in sessionStorage)

**Implementation:** 
- `components/OnboardingCardWrapper.tsx` (route/state logic)
- `components/ProfileEnabledBanner.tsx` (new compact banner)

---

### 3. **Action Route Mapping** ✅

All onboarding actions now navigate to proper routes:

| Action | Target Route | Behavior |
|--------|--------------|----------|
| **Create a Learner Profile** | `/get-started?action=create-profile` | Opens profile creation flow on /get-started |
| **Join a Classroom** | `/schools` | Navigates to classroom join hub |
| **Continue as guest** | `/dyslexia-reading-training` | Starts practice immediately + sets `localStorage('nb:guestMode', 'true')` |
| **Add another learner** (from banner) | `/get-started?action=create-profile` | Requires PIN unlock first |

**Implementation:** `components/OnboardingCard.tsx`, `components/ProfileEnabledBanner.tsx`

---

### 4. **Guest Mode Flag** ✅

When user clicks "Continue as guest":
- ✅ Sets `localStorage.setItem('nb:guestMode', 'true')`
- ✅ Navigates to `/dyslexia-reading-training`
- ✅ Progress stored device-local (separate from profiles)
- ✅ Can upgrade to profile later

**Use Case:** Track guest progress separately from learner profiles (use existing `lib/guest-progress.ts` infrastructure)

---

### 5. **Middleware Enhancement** ✅

Added pathname to response headers for server-side route checking:

```typescript
// middleware.ts
response.headers.set('x-pathname', pathname)
```

This allows `OnboardingCardWrapper` (server component) to access the current route and make routing decisions server-side.

---

## Files Modified/Created

### Modified:
1. `components/OnboardingCardWrapper.tsx` - Route restrictions + state logic
2. `components/OnboardingCard.tsx` - Action route mapping (navigate instead of modal)
3. `middleware.ts` - Added pathname to headers

### Created:
4. `components/ProfileEnabledBanner.tsx` - NEW compact State C banner

---

## Updated Run Steps

```bash
cd /Users/akoroma/Documents/GitHub/neurobreath-platform/web
yarn dev
```

### Test Flow (Refined):

#### **Test 1: State A (No Profile) on Allowed Routes**
1. Open `http://localhost:3000/` - Onboarding appears (collapsed)
2. Click header → Expands
3. Click "Create a Learner Profile" → Navigates to `/get-started?action=create-profile`
4. Click "Join a Classroom" → Navigates to `/schools`
5. Click "Continue as guest" → Navigates to `/dyslexia-reading-training` + sets guest mode

#### **Test 2: State A (No Profile) on Excluded Routes**
1. Open `http://localhost:3000/blog` - Onboarding does NOT appear ✓
2. Open `http://localhost:3000/resources` - Onboarding does NOT appear ✓
3. Open `http://localhost:3000/teacher/dashboard` - Onboarding does NOT appear ✓

#### **Test 3: State C (Profile Exists) - Banner on / and /get-started**
1. Create a profile (State A → State C transition)
2. Open `http://localhost:3000/` - Shows "Profile enabled ✓" banner
3. Banner shows active profile name
4. Click "Add another learner" → PIN dialog → `/get-started?action=create-profile`
5. Click X to dismiss → Banner hidden for session

#### **Test 4: State C (Profile Exists) - No Banner on Other Routes**
1. Open `http://localhost:3000/dyslexia-reading-training` - No onboarding, no banner ✓
2. Open `http://localhost:3000/progress` - No onboarding, no banner ✓
3. Clean UX (no clutter)

#### **Test 5: State B (PIN Lock) Still Works**
1. Have profile + PIN set
2. Open `http://localhost:3000/` - Shows banner (State C)
3. Click "Add another learner" → PIN dialog opens
4. Enter correct PIN → Navigates to `/get-started?action=create-profile`

---

## Updated Acceptance Criteria

### ✅ Route Placement (Professional UX)
- [ ] Onboarding appears on `/`, `/get-started`, `/dyslexia-reading-training`, `/progress`, `/rewards` ONLY
- [ ] Onboarding does NOT appear on `/blog`, `/resources`, `/teacher/*`, `/parent/*`, etc.
- [ ] Clean "onboarding appears where it matters" feel

### ✅ State Machine Behavior
- [ ] **State A (No Profile):** Card visible, collapsed, expandable
- [ ] **State B (PIN Lock):** Card locked, click opens PIN modal
- [ ] **State C (Profile Exists):**
  - [ ] On most routes: No card, no banner (clean)
  - [ ] On `/` and `/get-started`: Compact "Profile enabled ✓" banner
  - [ ] Banner dismissible for session (sessionStorage)

### ✅ Action Routes
- [ ] "Create a Learner Profile" → `/get-started?action=create-profile`
- [ ] "Join a Classroom" → `/schools`
- [ ] "Continue as guest" → `/dyslexia-reading-training` + guest mode flag
- [ ] "Add another learner" (banner) → PIN unlock → `/get-started?action=create-profile`

### ✅ Guest Mode
- [ ] "Continue as guest" sets `localStorage('nb:guestMode', 'true')`
- [ ] Guest progress stored device-local (separate from profiles)
- [ ] Guest can upgrade to profile later

---

## Integration with /get-started

You'll need to handle the `?action=create-profile` query param on `/get-started`:

```typescript
// app/get-started/page.tsx (or wherever /get-started is)
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProfileCreationDialog } from '@/components/ProfileCreationDialog'

export default function GetStartedPage() {
  const searchParams = useSearchParams()
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  
  useEffect(() => {
    // Check if action=create-profile query param exists
    if (searchParams.get('action') === 'create-profile') {
      setShowProfileDialog(true)
    }
  }, [searchParams])
  
  return (
    <div>
      {/* Your existing /get-started content */}
      <h1>Get Started with NeuroBreath</h1>
      {/* ... */}
      
      {/* Profile creation dialog (triggered by query param or button) */}
      <ProfileCreationDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog}
      />
    </div>
  )
}
```

---

## Professional UX Achieved ✓

**Before:** Onboarding everywhere, potentially cluttered
**After:** 
- ✅ Onboarding only where it matters (practice routes, hubs)
- ✅ No onboarding on content pages (blog, resources)
- ✅ Compact banner for existing users (State C)
- ✅ Clear navigation paths for each action
- ✅ Guest mode properly integrated
- ✅ Clean, professional "onboarding appears where it matters" feel

---

## Summary

All refinements complete! The onboarding system now:

1. **Renders strategically** (only 5 specific routes, excluded from 10+ routes)
2. **State machine UX** (A: full card, B: locked, C: compact banner or hidden)
3. **Action routing** (all buttons navigate to proper destinations)
4. **Guest mode flag** (properly tracked for device-local progress)
5. **Professional feel** (non-intrusive, context-aware, clean)

**Status:** ✅ READY FOR TESTING

Test and verify all routes, states, and actions work as specified. Let me know if you need any further refinements!

