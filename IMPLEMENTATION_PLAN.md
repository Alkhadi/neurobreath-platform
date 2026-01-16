# NeuroBreath Platform Enhancement Plan

**Date:** 2025-12-30  
**Mission:** Extend and harden the system, not rewrite it.

## Repository Scan Complete ✅

### Existing Systems Identified

- **Guest Mode:** Uses localStorage with key `neurobreath-progress`
- **Onboarding:** `OnboardingGate.tsx`, `OnboardingCard.tsx`, `useOnboarding.ts` hook
- **API Routes:** `/api/sessions`, `/api/progress`, `/api/badges`, `/api/challenges`, `/api/assessment/*`
- **Prisma Schema:** Session, Progress, Badge, Challenge, ReadingAttempt, LearnerPlacement models
- **Assessment System:** Placement rubric, placement plans, reading profiles
- **Progress Context:** React context for client-side progress tracking

### Rules Verified

- ✅ Guest mode must not be broken
- ✅ No forced login
- ✅ No hydration errors (SSR-safe patterns found)
- ✅ Existing onboarding logic preserved
- ✅ Privacy-first design confirmed

---

## Implementation Plan

### A) Guest Mode Enhancements

#### 1. Standardize Guest Progress Storage

**File:** `web/lib/guest-progress.ts` (NEW)

- Create centralized guest progress schema/types
- Standardize on `neurobreath:guestProgress` key
- Export interfaces for reading sessions, assessments, badges
- Include session counter for prompts

#### 2. GuestBadge Component

**File:** `web/components/GuestBadge.tsx` (NEW)

- Visual indicator showing "Guest Mode" with clean styling
- Tooltip explaining guest mode benefits
- Click to view guest mode info modal
- SSR-safe (client-only rendering)

#### 3. Guest Explanatory Copy

**File:** `web/components/GuestModeInfo.tsx` (NEW)

- Modal/Dialog explaining guest mode
- Privacy-first messaging
- Benefits of creating account (optional, never forced)
- Links to export data

#### 4. 7-Session Gentle Prompt

**File:** `web/components/GuestAccountPrompt.tsx` (NEW)

- Checks session count from localStorage
- Shows friendly modal after 7th session
- "Create account to sync across devices" (dismissible)
- Never blocks access (can dismiss forever)
- Uses `useLocalStorage` for dismiss state

#### 5. Guest Export (.nbx)

**File:** `web/app/api/guest/export/route.ts` (NEW)
**File:** `web/components/ExportGuestData.tsx` (NEW)

- Export all guest progress as JSON `.nbx` file
- Include: sessions, assessments, badges, progress, timestamps
- QR code payload for device transfer
- Client-side export (no server needed)

---

### B) Teacher Analytics Dashboard

#### 1. Teacher Dashboard Route

**File:** `web/app/teacher/dashboard/page.tsx` (NEW - SERVER COMPONENT)

- Server-side data aggregation (SSR)
- Query Prisma for device/classroom aggregates
- Pass data as props to client charts

#### 2. Analytics API Route

**File:** `web/app/api/teacher/analytics/route.ts` (NEW)

- GET endpoint for teacher dashboard data
- Query params: `?classroom=X&dateRange=week`
- Aggregate: minutes per activity, weekly consistency, completion rates
- Return JSON with chart-ready data

#### 3. Client Chart Components

**File:** `web/components/teacher/AnalyticsCharts.tsx` (NEW - CLIENT COMPONENT)

- Use Recharts (check if exists, else install)
- BarChart: Minutes per activity
- LineChart: Weekly consistency
- PieChart: Completion rates
- All charts SSR-safe (no window access in render)

#### 4. Dashboard Layout

**File:** `web/app/teacher/layout.tsx` (NEW)

- Teacher-specific sidebar/nav
- Role guard (check teacher role from localStorage or header)
- Breadcrumbs for navigation

---

### C) AI-Assisted SEND Reporting

#### 1. Prisma Model for Reports

**File:** `web/prisma/schema.prisma` (UPDATE)

```prisma
model SENDReport {
  id              String   @id @default(cuid())
  deviceId        String
  learnerName     String?
  reportDate      DateTime @default(now())
  
  // Data inputs
  assessmentIds   String[] // References to ReadingAttempt IDs
  sessionIds      String[] // References to Session IDs
  dateRange       Json     // { from, to }
  
  // AI Analysis
  patternSummary  String   // AI-generated or rule-based
  strengths       String[]
  challenges      String[]
  recommendations String[]
  confidence      String   // high, medium, low
  
  // Metadata
  generatedBy     String   // "ai-gpt4" or "rules-engine"
  isEdited        Boolean  @default(false)
  editedContent   String?
  
  // Print settings
  isPrintFriendly Boolean  @default(true)
  disclaimerShown Boolean  @default(true)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @default(now()) @updatedAt
  
  @@index([deviceId, reportDate])
}
```

#### 2. Report Generation API

**File:** `web/app/api/send-report/generate/route.ts` (NEW)

- POST with deviceId, dateRange, assessmentIds
- Try AI provider (check env vars: OPENAI_API_KEY, ABACUS_API_KEY, etc.)
- Fallback to deterministic rules-engine if no AI
- Return report JSON

#### 3. Rules-Based Fallback

**File:** `web/lib/send-report-rules.ts` (NEW)

- Analyze patterns without AI
- Simple thresholds and heuristics
- E.g., "Decoding score consistently below 60% → recommend phonics focus"
- Always include disclaimer: "This is NOT a diagnosis"

#### 4. Report View Page

**File:** `web/app/send-report/[reportId]/page.tsx` (NEW)

- Server-side fetch report from Prisma
- Print-friendly layout
- Edit mode (teacher can adjust)
- Prominent disclaimer banner
- Export as PDF button

#### 5. Report List Page

**File:** `web/app/send-report/page.tsx` (NEW)

- List all reports for device/classroom
- Create new report button
- Filter by date range

---

### D) Parent Companion Logic

#### 1. Prisma Model for Parent Access

**File:** `web/prisma/schema.prisma` (UPDATE)

```prisma
model ParentAccess {
  id            String   @id @default(cuid())
  parentEmail   String?  // Optional
  parentCode    String   @unique // 6-digit code for auth
  deviceId      String   // Learner's device
  learnerName   String?
  isActive      Boolean  @default(true)
  canEdit       Boolean  @default(false) // Always false for v1
  
  createdAt     DateTime @default(now())
  expiresAt     DateTime? // Optional expiry
  
  @@index([parentCode])
  @@index([deviceId])
}
```

#### 2. Parent Auth API

**File:** `web/app/api/parent/auth/route.ts` (NEW)

- POST: Create parent access link/code
- GET: Verify parent code and return deviceId

#### 3. Parent Progress API (Read-Only)

**File:** `web/app/api/parent/progress/route.ts` (NEW)

- GET with parentCode query param
- Verify code → fetch deviceId → return progress
- Read-only: sessions, badges, assessments, placement
- Mobile-friendly JSON response

#### 4. Parent View Page

**File:** `web/app/parent/[parentCode]/page.tsx` (NEW)

- Simple, mobile-optimized layout
- Show learner progress
- No edit capabilities
- "View only" badge prominent

---

### E) Flutter Sync API

#### 1. Sync Contract Schema

**File:** `web/lib/sync-schema.ts` (NEW)

```typescript
export interface SyncRequest {
  deviceId: string
  isGuest: boolean
  lastSyncTimestamp?: string
  clientData: {
    sessions: Session[]
    progress: Progress
    badges: Badge[]
    assessments: ReadingAttempt[]
  }
}

export interface SyncResponse {
  success: boolean
  serverTimestamp: string
  merged: {
    sessions: Session[]
    progress: Progress
    badges: Badge[]
    assessments: ReadingAttempt[]
  }
  conflicts?: Conflict[]
}
```

#### 2. Sync API Endpoint

**File:** `web/app/api/sync/route.ts` (NEW)

- POST: Sync client data with server
- Guest mode: Return client data as-is (no server write)
- Authenticated: Merge with Prisma, resolve conflicts
- Use last-write-wins for conflicts (simple v1 strategy)

#### 3. Conflict Resolution

**File:** `web/lib/sync-conflicts.ts` (NEW)

- Last-write-wins by timestamp
- Log conflicts for debugging
- Return conflict info in response

#### 4. Flutter Documentation

**File:** `flutter_app/docs/SYNC_API.md` (NEW)

- Document sync endpoint contract
- Example requests/responses
- Guest vs auth behavior
- Offline-first strategy

---

### F) Open-Source Core Extraction

#### 1. Create Core Package

**Directory:** `/packages/neurobreath-core/` (NEW)

```text
/packages/neurobreath-core/
  ├── README.md
  ├── LICENSE (MIT)
  ├── package.json
  ├── src/
  │   ├── types/
  │   │   ├── progress.ts
  │   │   ├── session.ts
  │   │   ├── assessment.ts
  │   ├── utils/
  │   │   ├── sync.ts
  │   │   ├── storage.ts
  │   │   ├── validation.ts
  │   ├── offline/
  │   │   ├── queue.ts
  │   │   ├── merge.ts
  │   ├── index.ts
```

#### 2. Extract Core Types

**Files:** Move from `web/lib/` to `packages/neurobreath-core/src/types/`

- Guest progress schema
- Session types
- Progress types
- Assessment types (non-branded)

#### 3. Extract Utilities

**Files:** Move generic utilities

- Sync logic (offline-ready)
- Storage abstraction
- Validation helpers
- **Exclude:** AI prompts, branding, API keys

#### 4. Package Configuration

**File:** `packages/neurobreath-core/package.json`

```json
{
  "name": "@neurobreath/core",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

#### 5. Update Web Package

**File:** `web/package.json` (UPDATE)

- Add dependency: `"@neurobreath/core": "workspace:*"`
- Update imports to use core package

---

### G) Prisma Migrations

#### 1. Create Migration for New Models

```bash
npx prisma migrate dev --name add-send-reports-and-parent-access
```

**Models to add:**

- SENDReport
- ParentAccess

#### 2. Migration File

**File:** `web/prisma/migrations/TIMESTAMP_add_send_reports_and_parent_access/migration.sql`

- Auto-generated by Prisma
- Review before applying

#### 3. Update Prisma Client

```bash
npx prisma generate
```

---

### H) Documentation & Verification

#### 1. Change Summary Document

**File:** `ENHANCEMENT_SUMMARY.md` (NEW)

- List all files added/modified
- API endpoints added
- New features explained
- Migration instructions

#### 2. Environment Variables Document

**File:** `web/config/env.example` (UPDATE if needed)

- Document optional AI provider keys
- Note: System works without them (rules-based fallback)

#### 3. Guest Mode Verification Checklist

- [ ] Can use app without login
- [ ] Guest progress persists in localStorage
- [ ] No forced account creation
- [ ] Export works offline
- [ ] 7-session prompt is dismissible
- [ ] No hydration errors

#### 4. Testing Notes

**File:** `TESTING_NOTES.md` (NEW)

- Manual test scenarios
- Guest mode flows
- Teacher dashboard data checks
- Parent read-only verification
- Flutter sync contract tests

---

## Implementation Order

1. **Guest Enhancements** → Low risk, high value
2. **Core Extraction** → Foundation for others
3. **Prisma Migrations** → Required for teacher/parent features
4. **Teacher Dashboard** → Independent feature
5. **AI SEND Reporting** → Uses teacher data patterns
6. **Parent Companion** → Uses existing progress APIs
7. **Flutter Sync** → Final integration piece
8. **Documentation** → Continuous throughout

---

## Stop Conditions

- ❌ If guest mode breaks → STOP and revert
- ❌ If SSR hydration errors appear → STOP and fix
- ❌ If forced auth is introduced → STOP and remove
- ❌ If existing onboarding is disrupted → STOP and restore

---

## New Environment Variables (All Optional)

```bash
# AI Provider (optional - system works without)
OPENAI_API_KEY=sk-...
ABACUS_API_KEY=...

# All features work without these - deterministic fallbacks in place
```

**Key Principle:** Privacy-first, offline-capable, guest-friendly.
