# Frontend Layout Fixes - Summary

## Issue Description

The orbit tracker card in the hero section was overlapping the Quick Win planner section below it, causing layout and visibility issues.

## Root Cause Analysis

### 1. Sticky Positioning Issue

The `.nb-hero-col-right` was using `position: sticky; top: 2rem;` which caused the orbit elements to "stick" and overlap content below.

### 2. **Z-Index Stacking Context**

The Quick Win section had a lower z-index (`z-index: 1`) than needed, allowing the orbit tracker to appear on top.

### 3. **Missing Containment**

The orbit tracker card and other elements lacked proper containment properties (`box-sizing: border-box`, `width: 100%`).

## Solutions Implemented

### CSS Changes (`web/app/globals.css`)

#### 1. Fixed Hero Right Column Positioning

```css
/* BEFORE */
.nb-hero-col-right {
  position: sticky;
  top: 2rem;
  height: fit-content;
  z-index: 2;
}

/* AFTER */
.nb-hero-col-right {
  position: relative;
  height: fit-content;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
```

**Why:** Removed `sticky` positioning to prevent overlap. Added flexbox layout for better vertical stacking.

#### 2. Enhanced Quick Win Section Z-Index

```css
/* BEFORE */
.nb-hero-quickwin-section {
  margin-top: 3rem;
  position: relative;
  z-index: 1;
}

/* AFTER */
.nb-hero-quickwin-section {
  margin-top: 3rem;
  position: relative;
  z-index: 10;
  clear: both;
}
```

**Why:** Increased z-index to ensure Quick Win appears above all orbit elements. Added `clear: both` for proper flow.

#### 3. Improved Quick Win Component Styling

```css
/* BEFORE */
.nb-quickwin {
  /* ...other styles */
  z-index: 2;
}

/* AFTER */
.nb-quickwin {
  /* ...other styles */
  z-index: 20;
  width: 100%;
  box-sizing: border-box;
}
```

**Why:** Higher z-index guarantees it's above orbit elements. Added width/box-sizing for proper containment.

#### 4. Orbit Tracker Card Containment

```css
/* BEFORE */
.orbit-tracker-card {
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 1.25rem;
}

/* AFTER */
.orbit-tracker-card {
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 0.75rem;
  padding: 1.25rem;
  position: relative;
  z-index: 1;
  width: 100%;
  box-sizing: border-box;
}
```

**Why:** Ensures the card stays within its container and doesn't overflow.

#### 5. Updated Responsive Behavior

```css
/* BEFORE */
@media (max-width: 1024px) {
  .nb-hero-col-right {
    position: relative;
    top: 0;
    order: -1;
  }
  .nb-hero-col-right .orbit-container {
    max-height: 600px;
  }
}

/* AFTER */
@media (max-width: 1024px) {
  .nb-hero-col-right {
    position: relative;
    order: -1;
    margin-bottom: 2rem;
  }
  .nb-hero-col-right .orbit-container {
    max-height: 600px;
    max-width: 100%;
  }
  .nb-hero-quickwin-section {
    margin-top: 2rem;
  }
}
```

**Why:** Better mobile layout with proper spacing and width constraints.

### TypeScript Fixes

#### Fixed Progress Card Component

**Issue:** The `ProgressCard` component expected separate `stats` and `statItems` props, but was dynamically extracting values from `stats` using array indexing, which was fragile.

**Solution:**

1. Updated `statItems` in `challenges-section.tsx` to include `value` property:

```typescript
const statItems = [
  {
    icon: Clock,
    value: stats.totalMinutes,  // ✅ Added value
    label: 'Total minutes',
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-600'
  },
  // ... other items
]
```

1. Simplified `ProgressCard` component:

```typescript
// BEFORE
export default function ProgressCard({ stats, statItems }: ProgressCardProps) {
  // Used Object.values(stats)[index] - fragile!
}

// AFTER
export default function ProgressCard({ statItems }: ProgressCardProps) {
  // Uses item.value directly - type-safe!
}
```

1. Updated interface to remove unused `stats` prop.

## Z-Index Stacking Order (Final)

```text
Background (0)
  ↑
Orbit Elements (1)
  ↑
Quick Win Section Container (10)
  ↑
Quick Win Component (20)
```

## Benefits

✅ **No Overlap:** Quick Win section now always appears above orbit tracker
✅ **Responsive:** Works correctly on all screen sizes
✅ **Type-Safe:** Fixed TypeScript errors in ProgressCard
✅ **Maintainable:** Clear z-index hierarchy and proper containment
✅ **Performant:** Removed unnecessary sticky positioning

## Testing

- ✅ Build passes without errors
- ✅ All TypeScript types are valid
- ✅ Responsive layout works at all breakpoints
- ✅ Z-index stacking is correct

## Files Modified

1. `web/app/globals.css` - CSS fixes for layout and z-index
2. `web/components/home/challenges-section.tsx` - Added value to statItems
3. `web/components/home/progress-card.tsx` - Simplified prop interface

## Recommendations

1. **Avoid `position: sticky` in grid layouts** - Can cause unexpected overlaps
2. **Establish z-index scale** - Use increments of 10 (1, 10, 20, 30) for clearer hierarchy
3. **Always add `box-sizing: border-box`** - Prevents width/padding overflow issues
4. **Use `clear: both`** - When you need guaranteed flow clearance
5. **Type props explicitly** - Avoid dynamic value extraction that breaks type safety

## Browser Compatibility

All CSS properties used are widely supported:

- `position: relative` ✅
- `z-index` ✅
- `box-sizing: border-box` ✅
- `display: flex` ✅
- `clear: both` ✅

---

**Status:** ✅ Complete - All issues resolved, build passing
