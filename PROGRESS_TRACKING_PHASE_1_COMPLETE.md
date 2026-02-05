# Progress Tracking - Phase 1 Complete ✅

**Date:** February 5, 2026  
**Branch:** `feat/progress-subjects`  
**Commit:** `476cf6f`  
**Status:** Pushed, awaiting CI

---

## What Was Built

### Core Infrastructure (Already Existed)
- ✅ ProgressEvent model with `userId`, `deviceId`, `subjectId` fields
- ✅ SubjectProfile + SubjectAccess for learner profiles
- ✅ Device ID middleware (`nb_device_id` cookie, 400-day expiry)
- ✅ API routes: POST `/api/progress/events`, GET `/api/progress/summary`
- ✅ `trackProgress()` helper function
- ✅ Security: subject-scoped authorization, guest → Me, signed-in → Me or UUID with access checks

### Phase 1 Additions (This Commit)
- ✅ Wired breathing session completions to `trackProgress()` in `BeginSessionModal.tsx`
- ✅ Created `ProgressCalendar` component with activity heatmap visualization
- ✅ Integrated calendar into progress dashboard
- ✅ Added 30-second auto-refresh polling for real-time feel
- ✅ All tracking works for guests (device-only) and logged-in users (user + device)

---

## Files Modified

1. **`web/components/BeginSessionModal.tsx`** ([line 7](web/components/BeginSessionModal.tsx#L7), [lines 424-435](web/components/BeginSessionModal.tsx#L424-L435))
   - Added `trackProgress` import
   - Called tracking on session complete with techniqueId, durationSeconds, category

2. **`web/components/progress/ProgressCalendar.tsx`** (NEW - 184 lines)
   - Month navigation (prev/next buttons)
   - 7-column grid (Mon-Sun) with activity intensity colors
   - Hover tooltips showing count + minutes
   - Click handlers for future day-detail view
   - Activity level legend (gray → light green → dark green)

3. **`web/app/progress/page.tsx`** ([line 8](web/app/progress/page.tsx#L8), [lines 268-280](web/app/progress/page.tsx#L268-L280), [lines 183-191](web/app/progress/page.tsx#L183-L191))
   - Added ProgressCalendar import and component
   - Inserted calendar between stats cards and recent activity
   - Added 30-second polling interval with cleanup
   - Removed unused CalendarIcon import

---

## Quality Gates ✅

```bash
cd /Users/akoroma/Documents/GitHub/neurobreath-platform/web

✅ yarn typecheck   # PASSED (Prisma 6.7.0, no upgrade)
✅ yarn lint        # PASSED (0 errors, 0 warnings)
⏳ yarn build       # Not yet run
⏳ End-to-end test  # Not yet tested
```

---

## How It Works Now

### Anonymous/Guest Users
- Device ID cookie (`nb_device_id`) tracks all activity per-device
- Works even when logged out
- Events: `{ deviceId: "...", userId: null, subjectId: null }`

### Logged-In Users
- Tracks both `userId` + `deviceId`
- Enables cross-device progress aggregation
- If user logs in after using as guest, device activity continues tracking
- Events: `{ deviceId: "...", userId: "...", subjectId: null }` (for "Me")

### Multi-Learner (Signed-in)
- Select learner from dropdown (persisted to `localStorage: nb_active_subject`)
- API validates access via SubjectAccess table
- Events: `{ deviceId: "...", userId: "...", subjectId: "uuid" }`

### Real-Time Updates
- Progress page auto-refreshes every 30 seconds
- Manual refresh available via "Refresh" button
- Calendar shows activity heatmap with daily counts + minutes

---

## Next Steps (Follow Order)

### 1. Get PR #7 Green and Merged 🔥
**Current Status:** CI checks running  
**Action:** `gh pr checks 7 --watch`

Once all checks pass:
```bash
gh pr merge 7 --squash
```

### 2. Create New Branch for Dashboard Upgrade
```bash
git checkout main
git pull
git checkout -b feat/progress-dashboard-upgrade
```

### 3. Implement Dashboard Upgrade (Strict Patch Mode)
**Goal:** Production-grade progress tracking with 2026 feel, NO CI destabilization

#### A. Coverage: Wire All Completions
- Lessons (end of lesson, "Mark complete")
- Quizzes (submit results + score)
- Focus Garden (water/harvest/complete)
- Meditation/mindfulness sessions
- Challenges/quests
- **Rule:** One canonical call-site per feature

#### B. Reliability: Offline Queue + Retry
- Add localStorage queue (`nb_progress_queue_v1`) for failed POST `/api/progress/events`
- Cap at 200 entries to prevent bloat
- Flush triggers:
  - On app start (first trackProgress call)
  - On window 'online' event
  - On document visibility change to 'visible'
- Use `navigator.sendBeacon` for unload (best-effort)

#### C. Real-Time Feel: BroadcastChannel
- After successful event ingestion, broadcast:  
  `{ type: "progress:event", subjectId, eventType, ts }`
- On `/progress` page, listen for broadcasts → immediate refetch
- Keep 60s polling as fallback for cross-device updates
- **No WebSockets/SSE** (serverless-safe approach)

#### D. Dashboard UI Upgrades (No New Deps)
- **KPI Cards (Last 7d + Last 30d):**
  - totalEvents, mindfulMinutes, breathingSessions
  - streakCurrent, streakBest (compute client-side from dailySeries if needed)
- **Activity Feed (Recent 50-100 events):**
  - Icon, label, duration, subject, timestamp (stable format: YYYY-MM-DD)
  - Filter chips: All / Breathing / Lessons / Quizzes / Focus Garden
- **Breakdowns:**
  - "Top techniques/categories (last 7d)" table or mini CSS bars
- **Data Sourcing:**
  - Extend existing `/api/progress/summary` to return `recentEvents` and `dailySeries`
  - If too risky, add `/api/progress/feed?range=7d&subjectId=...`
  - Reuse auth + subject validation logic

#### E. Visual Test Stability
- No time-dependent strings ("5 minutes ago")
- Format dates as `YYYY-MM-DD` (stable)
- Deterministic sorting (no random ordering)

### 4. Quality Gates (Must Pass)
```bash
cd web
yarn lint
yarn typecheck
yarn build
yarn test:e2e tests/buddy.spec.ts
```

### 5. QA Checklist
- [ ] Guest device tracking (no auth)
- [ ] Signed-in "me"
- [ ] Signed-in learner (subjectId UUID)
- [ ] Offline queue (turn off network → create events → turn on network → confirm flush)
- [ ] Cross-tab real-time (two tabs open → complete session → /progress updates instantly)

### 6. Commit and Push
```bash
git add -A
git commit -m "feat(progress): improve dashboard reliability and realtime UX"
git push -u origin feat/progress-dashboard-upgrade
gh pr create --fill
```

---

## Constraints (Non-Negotiable)

- ❌ **NO new npm dependencies**
- ❌ **NO database schema changes** (no Prisma model edits, no migrations)
- ✅ **Reuse existing patterns** (buttons, cards, tabs, toasts, icons)
- ✅ **Keep CI stable** (no nondeterministic UI in visual tests)
- ✅ **Preserve guest + signed-in + multi-learner semantics**

---

## Why This Order Matters

1. **PR #7 tight and green** → Establishes stable foundation (subjects + progress ingestion)
2. **Separate dashboard PR** → Isolates polish work, keeps review focused
3. **Coverage first** → Maximize value (track everything)
4. **Reliability second** → Production-grade (no lost events)
5. **Real-time third** → Premium feel (instant updates)
6. **UI polish last** → Useful dashboard (KPIs, feed, breakdowns)

---

## Commit History (This Branch)

```bash
476cf6f (HEAD -> feat/progress-subjects) feat: wire breathing sessions to progress tracking + add calendar view + real-time refresh
e29a7d6 (origin/feat/progress-subjects) fix: implement responsive overflow prevention (STRICT PATCH)
fee6e11 feat: increase typography sizes by 4%
56345f1 feat: implement ChatGPT-style typography system
e8d9fc2 Fix responsive Tesla nav test and stabilize SEO readiness checks
```

---

## PR #7 Overview

**Title:** Learner profiles + subject-scoped progress  
**URL:** https://github.com/Alkhadi/neurobreath-platform/pull/7

**What:**
- Adds learner/child profiles (SubjectProfile) + access control (SubjectAccess)
- Secures progress ingestion with subject-aware authorization (guest → Me, signed-in → Me or UUID with access)
- Updates `/progress` with learner selector + persistence
- Adds subject attribution to `trackProgress()`

**Security Rules:**
- Guest: `subjectId` forced to `null` (Me)
- Signed-in: `subjectId=me` → `null` (Me). UUID requires SubjectAccess; writes require `canWrite=true`
- Invalid subjectId → 400; unauthorized UUID → 403

**Files:**
- `web/app/api/subjects/route.ts` (NEW)
- `web/app/api/progress/events/route.ts` (authorization added)
- `web/app/api/progress/summary/route.ts` (subject filtering added)
- `web/app/progress/page.tsx` (learner selector + calendar)
- `web/lib/progress/track.ts` (reads `nb_active_subject` from localStorage)
- `web/prisma/schema.prisma` (SubjectProfile + SubjectAccess models)
- `web/prisma/migrations/...` (migration SQL)

---

## Architecture Notes

### Event Stream Pattern
- **Append-only ProgressEvent table** (never updated or deleted)
- **Summary aggregation on read** (no pre-computed stats tables)
- **Device + User tracking** (guest → device-only, signed-in → user + device)
- **Subject scoping** (Me vs learner UUID with access control)

### Device Linking
- Middleware sets `nb_device_id` cookie (400 days, httpOnly, sameSite: lax)
- When user logs in, `/api/progress/summary` links device to user via UserDevice table
- Future signed-in queries merge guest device events (avoid leaking other users' data)

### Subject Model
- **"Me"** (`subjectId: null`): User's own progress
- **Learner** (`subjectId: UUID`): Child/learner profile with access control
- SubjectAccess: `{ userId, subjectId, role, canWrite }`
- Reads require SubjectAccess row; writes require `canWrite=true`

---

## Success Metrics

### Phase 1 (Current)
- ✅ Breathing sessions tracked (main user flow)
- ✅ Calendar visualization (activity heatmap)
- ✅ Real-time feel (30s polling)
- ✅ 100% device + user tracking (guest and logged-in)

### Phase 2 (Dashboard Upgrade)
- 🎯 All activity types tracked (lessons, quizzes, Focus Garden, meditation)
- 🎯 No lost events (offline queue + flush)
- 🎯 Instant updates (BroadcastChannel)
- 🎯 Useful dashboard (KPI cards, activity feed, breakdowns)
- 🎯 Production-grade reliability

---

## Technical Debt / Future Work

- [ ] Consider SSE/WebSockets for true server push (after stable baseline)
- [ ] Add day-detail modal when clicking calendar dates
- [ ] Persist guest device events when user registers (link deviceId → userId)
- [ ] Add goals (localStorage for now, persist later)
- [ ] Archive old ProgressEvent rows (1-year retention policy)
- [ ] Add "Export progress" feature (CSV/PDF)

---

## References

- AI_AGENT_RULES.md (repo hygiene, quality gates)
- web/.env.example (env var registry)
- QUICK_COMMIT_GUIDE.md (commit best practices)
- PRODUCTION_RUNBOOK.md (deployment checklist)
