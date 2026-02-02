# Legal & Consent Implementation Report — NeuroBreath Platform
**Date:** 23 January 2026  
**Implementation:** UK GDPR + US CCPA Compliance

---

## Phase 1: Audit Findings

### 1.1 Routing Structure Discovery

**Structure Identified:**
- Main app directory: `/web/app`
- Regional routing via folders:
  - `/web/app/uk/` - UK-specific routes (login, register, password-reset, my-account, journeys)
  - `/web/app/us/` - US-specific routes (limited; get-started, journeys)
  - `/web/app/[region]/` - Dynamic region route group
- Global layout: `/web/app/layout.tsx` (root layout using Next.js 15 App Router)
- Footer component: `/web/components/site-footer.tsx`
- Evidence footer: `/web/components/evidence-footer.tsx`

**Current footer structure:**
- The footer already has a "Trust & Safety" section with links to:
  - Trust Centre
  - Disclaimer
  - Evidence Policy
  - Accessibility
  - Editorial standards
  - Privacy
  - Terms
  - Report a concern
- All Trust links use dynamic `${regionPrefix}` routing (supports /uk and /us)
- Footer is region-aware via cookie `nb_region` and pathname detection

### 1.2 Analytics & Tracking Audit

**FOUND: Privacy-First Local Analytics Only**

> **Update (2026-02-02):** The platform also includes optional **Vercel Web Analytics** and **Vercel Speed Insights**, which are **only enabled after explicit analytics consent** (`analytics: true`). They are off by default.

The platform implements a **completely privacy-focused analytics system** with:
- **No third-party advertising** and **no third-party analytics by default**
- Local-only analytics via `/web/lib/analytics/engine.ts`:
  - Uses localStorage only (`ANALYTICS_STORAGE_KEY`)
  - All data stays on user's device
  - No data sent to external servers (for the local analytics engine)
  - No cookies created for tracking
- **Comment in code confirms local-only intent** (refers to the local analytics engine).

**localStorage Usage Identified:**
1. Analytics: `/web/lib/analytics/engine.ts` + `/web/lib/analytics/events.ts`
2. Guest progress tracking: `/web/lib/guest-progress.ts` (`GUEST_PROGRESS_KEY`)
3. Device profile/onboarding: `/web/lib/onboarding/deviceProfileStore.ts`

**No first-party tracking cookies are implemented by NeuroBreath.**

**Verdict:** By default, the platform has **no non-essential tracking active**. Optional third-party telemetry (Vercel Analytics/Speed Insights) is consent-gated and only enabled after users opt in. We still implement the consent system to:
- Be future-proof as telemetry tooling evolves
- Demonstrate compliance best practices
- Allow user control over functional localStorage usage

### 1.3 Data Collection Audit

**Database Models (Prisma Schema):**

The platform collects minimal data via Prisma models:

**User Account Data (Optional — /uk only):**
- `AuthUser`: email, passwordHash, emailVerified, twoFactorEnabled, twoFactorSecret
- `AuthSession`: session tokens for logged-in users
- `AuthPasswordResetToken`: temporary password reset tokens
- `ParentAccess`: parent access codes for viewing child progress

**Progress/Analytics Data (Stored per `deviceId`):**
- `Session`: breathing technique sessions (deviceId, technique, minutes, breaths, completedAt)
- `Progress`: aggregate stats (deviceId, totalSessions, totalMinutes, streaks)
- `Badge`: unlocked badges (deviceId, badgeKey, unlockedAt)
- `Challenge`: challenge progress (deviceId, challengeKey, progress)
- `DailyQuest`: daily quest tracking (deviceId, questDate, completion)
- `VoicePreference`: TTS preferences (deviceId, voiceName, voiceSpeed)

**Reading Assessment Data:**
- `ReadingPassage`, `ReadingAttempt`, `LearnerPlacement`: dyslexia reading training data

**Contact Form:**
- `/web/app/api/contact/route.ts` accepts name, email, message
- Uses Resend API to send emails
- Implements rate limiting (5 requests per 10 minutes per IP)
- Uses Turnstile (Cloudflare) for anti-spam
- **No database storage of contact form submissions** (data only sent via email)

**Data Collection Summary:**
- **Optional user accounts** (/uk region only for auth features)
- **DeviceId-based progress tracking** (localStorage → optional sync to DB)
- **No health/biometric data collected**
- **No email marketing** (no newsletter signups, no marketing automation)
- **Contact form ephemeral** (email only, no DB persistence)

**Lawful Bases:**
- Account creation: Contract (GDPR Art. 6(1)(b)) + Consent for optional features
- Progress sync: Legitimate interest (GDPR Art. 6(1)(f)) for service functionality
- Essential localStorage: Legitimate interest for functionality
- Contact form: Legitimate interest for responding to inquiries
- Analytics (if added): Consent required

### 1.4 Existing Legal/Trust Pages

**Current pages in `/web/app/uk/trust/` and `/web/app/us/trust/`:**
- Disclaimer
- Privacy
- Terms
- Accessibility
- Evidence Policy
- Editorial Standards
- Contact/Report a concern

**Action Required:**
- Enhance existing privacy/terms pages with full GDPR/CCPA content
- Add new Cookies policy page
- Add Data Rights page (UK GDPR) and Privacy Rights page (US CCPA)
- Update all pages to ensure consistency, last-updated dates, and proper legal language

---

## Phase 2: Implementation Plan

### 2.1 Legal Infrastructure
- Create `/web/lib/legal/legalConfig.ts` (org details, contact email, lastUpdated)
- Create legal layout components for consistent formatting
- Create shared utilities for legal page structure

### 2.2 Legal Pages
Create/update pages in both `/uk/legal/` and `/us/legal/`:
- Privacy Policy (comprehensive GDPR/CCPA)
- Terms of Service
- Cookie Policy (NEW)
- Disclaimer (enhance existing)
- Accessibility Statement (enhance existing)
- Data Rights (UK GDPR requests)
- Privacy Rights (US CCPA/CPRA rights)

### 2.3 Consent System
- Cookie consent banner (first visit)
- Preferences modal (Essential, Functional, Analytics categories)
- Persistent "Cookie settings" link in footer
- Storage: first-party cookie + localStorage fallback
- Gate any future non-essential tracking

---

## Phase 3: Consent Implementation Details

### 3.1 Categories
- **Essential:** Always on (site functionality, security)
- **Functional:** Optional localStorage for progress tracking
- **Analytics:** Optional (currently none, but future-proofing)

### 3.2 User Controls
- Equal prominence: [Accept all] [Reject all] [Manage preferences]
- Granular toggles in modal
- Easy withdrawal via "Cookie settings" link

### 3.3 Technical Implementation
- Client component mounted in root layout
- No non-essential scripts/storage before consent
- Accessible (keyboard nav, ARIA labels, focus trap)
- Respects prefers-reduced-motion

---

## TODO: Solicitor Review Required

⚠️ **LEGAL DISCLAIMER:** This implementation provides best-practice draft content suitable for legal review. It is **NOT legal advice**. Before going live, the following must be reviewed by a qualified solicitor:

1. Privacy Policy wording and lawful bases
2. Terms of Service liability limitations and governing law
3. Cookie Policy accuracy
4. Data retention policies
5. International transfer mechanisms (if applicable)
6. CCPA/CPRA compliance for US users
7. Any jurisdiction-specific requirements

Once legal review is complete, update this report with:
- [ ] Date of legal review
- [ ] Name of reviewing solicitor/firm
- [ ] Any modifications made post-review

---

## Implementation Status

- [x] Phase 1: Audit complete
- [x] Phase 2: Legal pages (UK + US complete)
- [x] Phase 3: Consent system (banner + modal + footer control)
- [x] Phase 4: QA & testing (lint + build + smoke tests)
- [x] Phase 5: Report finalization (complete; awaiting solicitor sign-off)

---

**Next Steps:**
1. Capture solicitor review (name/date) and any edits
2. Re-run smoke test suite after any legal copy changes
3. Track solicitor sign-off in the checklist below

---

## Phase 4: QA & Testing

**Mandatory gates (web/):**
- `yarn lint` ✅
- `yarn build` ✅

**Smoke tests (curl -I, Next.js dev on :3000):**
- UK legal: /uk/legal/privacy, /uk/legal/terms, /uk/legal/cookies, /uk/legal/disclaimer, /uk/legal/accessibility, /uk/legal/data-rights — initial warm-up 500 on privacy, re-run 200 ✅
- US legal: /us/legal/privacy, /us/legal/terms, /us/legal/cookies, /us/legal/disclaimer, /us/legal/accessibility, /us/legal/privacy-rights — 200 ✅

**Notes:**
- Next.js dev warned about metadata fields (themeColor/viewport) during manual fetch; non-blocking.
- Consent UI mounted at root layout with banner + preferences modal; footer cookie settings button verified.

---

## Phase 5: Finalization

**Verification summary:**
- Quality gates: lint/build ✅ (typecheck implicit in build)
- Smoke tests: all UK/US legal routes return 200 after warm-up ✅
- Consent UX: banner + modal + footer control present; categories Essential/Functional/Analytics

**Outstanding items:**
- Solicitor review required (see checklist above)
- Re-run smoke suite after any content edits

---

**Report will be updated as implementation progresses.**
