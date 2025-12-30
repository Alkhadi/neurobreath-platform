# Onboarding System - Quick Start Guide

## 🚀 TL;DR

The onboarding card now:
- ✅ Only shows to first-time users
- ✅ Never shows to returning users
- ✅ Has beautiful gradient UI
- ✅ Offers guest mode
- ✅ Explains profile benefits
- ✅ Is fully responsive
- ✅ Is privacy-first

## 🎯 What Changed?

### Before
```tsx
// Old: Always visible, no gating
<CreateProfile />
```

### After
```tsx
// New: Strictly gated, beautified
<OnboardingGate>
  <OnboardingCard />
</OnboardingGate>
```

## 📸 Visual Changes

### New UI Features

**Header:**
```
┌─────────────────────────────────────┐
│ 👥 Welcome to NeuroBreath! ✨      │ ← Gradient background
│ Get started with personalized...   │
└─────────────────────────────────────┘
```

**Benefits Section:**
```
┌─────────────────────────────────────┐
│ 🎖️ With a profile, you can:        │
│  • Track individual progress        │
│  • Receive personalized recs        │
│  • Save multiple learner profiles   │
│  • Export progress reports          │
└─────────────────────────────────────┘
```

**Buttons (Hierarchy):**
```
┌─────────────────────────────────────┐
│ [▓▓ Create a Learner Profile ▓▓]   │ ← Primary (gradient)
│ [   Join a Classroom         ]     │ ← Secondary (outlined)
│                                     │
│     Continue as guest               │ ← Tertiary (link)
│     You can create a profile...     │
└─────────────────────────────────────┘
```

## 🔧 Quick Implementation

### 1. The page already uses it!

Check [dyslexia-reading-training/page.tsx](../app/dyslexia-reading-training/page.tsx:202):

```tsx
{/* Right Card - Profile Creation */}
<CreateProfile />
```

This component now internally uses the new gated system.

### 2. Testing the Flow

#### Test New User (First Visit)
```bash
# In browser console:
localStorage.clear()
location.reload()
# ✅ Should see onboarding card
```

#### Test Returning User (Has Profile)
```bash
# In browser console:
localStorage.setItem('learnerProfile', JSON.stringify({
  id: '123',
  name: 'Test',
  createdAt: new Date().toISOString()
}))
location.reload()
# ✅ Should NOT see onboarding card
```

#### Test Guest User (Dismissed)
```bash
# In browser console:
localStorage.clear()
location.reload()
# Click "Continue as guest"
location.reload()
# ✅ Should NOT see onboarding card
```

### 3. Using Debug Helpers (Development Only)

```javascript
// In browser console (development mode):

// Reset to new user
window.__onboarding.reset()

// Show current state
window.__onboarding.debug()

// Simulate returning user
window.__onboarding.simulateReturning()

// Simulate guest
window.__onboarding.simulateGuest()
```

## 📋 Visibility Rules (Quick Reference)

### Shows When ✅
- ✅ No profile exists
- ✅ Not completed onboarding
- ✅ Not dismissed onboarding
- ✅ All three above are true

### Hides When ❌
- ❌ Profile exists
- ❌ Completed onboarding
- ❌ Dismissed onboarding
- ❌ Any one above is true

## 🎨 UI Improvements

### What's Better?

1. **Visual Polish**
   - Gradient background accent
   - Smooth animations
   - Better spacing and rhythm
   - Professional shadows

2. **Clear Messaging**
   - Explains WHY to create a profile
   - Lists specific benefits
   - Privacy-first language

3. **User Control**
   - Dismissible (X button)
   - Guest mode option
   - No forced sign-up

4. **Accessibility**
   - Keyboard navigation
   - ARIA labels
   - Clear focus states
   - Screen reader friendly

## 🔐 Privacy & Security

### What's Protected?

1. **No Data Leakage**
   - Component doesn't mount when hidden
   - Not just CSS display:none
   - No state pollution

2. **User Control**
   - Can dismiss permanently
   - Can use as guest
   - Clear privacy messaging

3. **Local-First**
   - All data in localStorage
   - No server required
   - No tracking

## 🧪 Test Checklist

- [ ] Clear localStorage → Should see onboarding
- [ ] Click "Create Profile" → Should hide onboarding
- [ ] Refresh → Should NOT see onboarding
- [ ] Clear localStorage → Should see onboarding
- [ ] Click "Continue as guest" → Should hide onboarding
- [ ] Refresh → Should NOT see onboarding
- [ ] Clear localStorage → Should see onboarding
- [ ] Click X (dismiss) → Should hide onboarding
- [ ] Refresh → Should NOT see onboarding

## 📂 Key Files

```
web/
├── hooks/
│   └── useOnboarding.ts          # 🧠 Core logic
├── components/
│   ├── OnboardingGate.tsx        # 🚪 Visibility wrapper
│   ├── OnboardingCard.tsx        # 🎨 Beautiful UI
│   └── CreateProfile.tsx         # 🔄 Uses new system
└── lib/
    └── onboarding-helpers.ts     # 🛠️ Testing tools
```

## 🚨 Common Issues

### "I don't see the onboarding card"
**Check:**
```javascript
window.__onboarding.debug()
```
Look for:
- `Has Profile: false` ✅
- `Onboarding Completed: false` ✅
- `Onboarding Dismissed: false` ✅

### "Onboarding shows when it shouldn't"
**Fix:**
```javascript
localStorage.clear()
location.reload()
```

### "Changes aren't appearing"
**Check:**
1. Is dev server running? (`npm run dev`)
2. Did page compile? (check console)
3. Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)

## 💡 Pro Tips

### Quick Reset During Development
```javascript
// Add this to browser bookmarks:
javascript:(function(){localStorage.clear();location.reload();})()
```

### View Current State
```javascript
// One-liner in console:
console.table(window.__onboarding.getState())
```

### Export State for Debugging
```javascript
// Copy state as JSON:
copy(window.__onboarding.export())
```

## 🎯 Next Steps

### When Implementing Profile Creation

1. Create profile modal/form component
2. On successful profile creation:
   ```typescript
   const { completeOnboarding } = useOnboarding();

   const handleSubmit = (profileData) => {
     // Save profile
     setLearnerProfile(newProfile);

     // Hide onboarding forever
     completeOnboarding();
   };
   ```

### When Adding Classroom Features

1. Create classroom join flow
2. On successful join:
   ```typescript
   const { completeOnboarding } = useOnboarding();

   const handleJoinClassroom = (classCode) => {
     // Join classroom
     joinClassroom(classCode);

     // Hide onboarding forever
     completeOnboarding();
   };
   ```

## 📚 More Information

- **Full Documentation:** [ONBOARDING_SYSTEM.md](./ONBOARDING_SYSTEM.md)
- **Implementation Summary:** [ONBOARDING_IMPLEMENTATION.md](../../ONBOARDING_IMPLEMENTATION.md)

## ✅ Success Criteria

You'll know it's working when:

1. ✅ New users see beautiful onboarding card
2. ✅ Creating profile makes it disappear forever
3. ✅ Guest mode works (dismisses forever)
4. ✅ Refreshing page respects user choice
5. ✅ UI is polished and professional
6. ✅ No hydration errors in console
7. ✅ Responsive on all screen sizes

---

**Ready to test?**
1. Open [http://localhost:3000/dyslexia-reading-training](http://localhost:3000/dyslexia-reading-training)
2. Open DevTools Console
3. Run: `localStorage.clear(); location.reload()`
4. You should see the new onboarding card! 🎉

---

**Questions?** Check the full documentation or inspect the code comments.
