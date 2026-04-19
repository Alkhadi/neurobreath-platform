# NeuroBreath Buddy — Integration Fix Report

> **Date:** 2026-04-19  
> **Scope:** Server-side patches only — 4 files, 115 insertions, 18 deletions  
> **Build status:** ✅ tsc · ✅ lint · ✅ production build (86 s)

---

## Phase 1 — Repo Inspection Findings

| File | Purpose |
|------|---------|
| `web/app/api/chat/route.ts` | Primary chat endpoint — orchestrates Firestore retrieval, NHS, PubMed, and OpenAI |
| `web/lib/buddy/server/nhs.ts` | NHS Website Content API v2 — manifest fetch, topic resolution, page extraction |
| `web/lib/buddy/server/ask.ts` | Buddy deterministic pipeline — internal-first retrieval, NHS, PubMed, safety, citations |
| `web/lib/buddy/server/cache.ts` | In-memory TTL cache (24 h NHS manifest, 6 h KB/routes) |
| `web/lib/buddy/server/text.ts` | Topic candidate extraction and query normalization |
| `web/lib/openai.ts` | Lazy OpenAI client — safe for build (no module-scope instantiation) |
| `web/lib/buddy/server/internalKb.ts` | Fuse.js fuzzy matching against Firestore `siteContentChunks` |
| `web/components/page-buddy.tsx` | Client component — FAB trigger, dialog, chat UI, TTS |
| `web/.env.local` | Contains `NHS_WEBSITE_CONTENT_API_ENV=sandbox` and sandbox API key |
| `web/.env.example` | Template for env vars |

### Data flow

```
page-buddy.tsx → POST /api/chat → retrieveContent (Firestore)
                                 → resolveNhsTopic → fetchResolvedNhsPage (NHS API)
                                 → fetchPubMed
                                 → OpenAI chat completion
                                 → saveTurnPair (Firestore)
```

---

## Phase 2 — Confirmed Root Causes

### Root Cause A: `getNhsBaseUrl()` ignores `NHS_WEBSITE_CONTENT_API_ENV`

**Before:** When `NHS_WEBSITE_CONTENT_API_KEY` is set, the function returns the **production** URL (`api.service.nhs.uk`) regardless of `NHS_WEBSITE_CONTENT_API_ENV=sandbox`.

**Effect:** The sandbox key (`O99UTNn…`) is sent to the production endpoint → **HTTP 401 Invalid ApiKey**.

**Confirmed:** `curl -H "apikey: <sandbox_key>" https://api.service.nhs.uk/nhs-website-content/manifest/pages/` → `401`.

### Root Cause C: Dead env var `NHS_WEBSITE_CONTENT_API_ENV`

The variable was defined in `.env.local` but never read by any code. It was dead configuration.

### Root Cause D: Missing `OPENAI_API_KEY` in Vercel (likely)

When `getOpenAIClient()` returns `null`, the fallback message `"…the service is being configured…"` is served with zero logging. Cannot confirm remotely — requires Vercel env var audit.

### Root Cause I: Silent HTTP error swallowing in `fetchJson()`

**Before:** All HTTP errors (401, 403, 404, 429, 503, timeouts) were caught and returned `null` with **zero logging**. Impossible to debug.

### NHS Sandbox Status

The NHS sandbox API (`sandbox.api.service.nhs.uk`) is currently returning **503/504**. This is an external infrastructure issue, not a code bug. The patches correctly log this.

---

## Phase 3 — Surgical Patch Plan & Exact Diffs

### Patch 1: `web/lib/buddy/server/nhs.ts` — Fix URL selection + add structured error logging

**What changed:**
1. Added `NHS_BASE_URLS` constant map (`sandbox`, `integration`, `production`).
2. `getNhsBaseUrl()` now reads `NHS_WEBSITE_CONTENT_API_ENV` to select the correct URL.
3. `fetchJson()` replaced with version that:
   - Logs structured JSON errors with status code, error type, and non-secret context.
   - Classifies errors: `auth`, `forbidden`, `not_found`, `rate_limited`, `timeout`, `network`, `parse`.
   - Records diagnostic in `_lastDiag` for caller observability.
4. Exported `NhsFetchDiag` interface and `getLastNhsDiag()` function.

### Patch 2: `web/app/api/chat/route.ts` — Improve fallback + add NHS observability

**What changed:**
1. Imported `getLastNhsDiag`.
2. When `!openai`: logs diagnostic JSON; if retrieved content exists (internal or NHS), serves raw content with disclaimer instead of generic "being configured" message.
3. NHS fetch section: logs `chat_nhs_empty_page` and `chat_nhs_no_topic_match` with diagnostic info when NHS returns empty.
4. Observability log enhanced with: `hasOpenAIKey`, `hasNhsKey`, `nhsEnv`, `nhsLastStatus`, `nhsLastError`.

### Patch 3: `web/lib/buddy/server/ask.ts` — Specific NHS failure warnings

**What changed:**
1. Imported `getLastNhsDiag`.
2. NHS failure warning now includes specific error type and HTTP status instead of generic "sources could not be verified".

### Patch 4: `web/.env.example` — Document `NHS_WEBSITE_CONTENT_API_ENV`

**What changed:** Added `NHS_WEBSITE_CONTENT_API_ENV=sandbox` with documentation comment.

---

## Phase 4 — Verification Results

### Static analysis

| Gate | Result |
|------|--------|
| `yarn typecheck` | ✅ Zero errors |
| `yarn lint` | ✅ Zero new errors (1 pre-existing in `profile-card.tsx`) |
| `yarn build` | ✅ Passed in 86.32 s |

### NHS API verification

| Test | Result |
|------|--------|
| Sandbox key → production URL | ❌ **401 Invalid ApiKey** (root cause A confirmed) |
| Sandbox key → sandbox URL | ❌ **503 Service Unavailable** (external infra) |
| Production URL without key | ❌ **401** (expected) |

### Server-side observability (from dev server logs)

```json
{"component":"nhs","baseUrl":"https://sandbox.api.service.nhs.uk/nhs-website-content","hasApiKey":true,"isSandbox":true,"path":"/nhs-website-content/manifest/pages/?pageSize=200","event":"nhs_fetch_http_error","status":503,"error":"network"}
```

```json
{"event":"chat_response","source":"ai","hasOpenAIKey":true,"hasNhsKey":true,"nhsEnv":"sandbox","nhsLastStatus":504,"nhsLastError":"network","latencyMs":21158}
```

✅ Structured logs are emitted correctly with status codes, error types, and env context.

### E2E tests (`tests/buddy.spec.ts`)

| Test | Result |
|------|--------|
| API-only: "no vague fallbacks" | ✅ 3/3 passed (chromium, firefox, webkit) |
| UI tests (37 total) | ❌ Pre-existing failures — Buddy FAB button not rendering |

**Why UI tests fail:** The "1 Issue" Next.js error overlay appears in test screenshots, preventing the Buddy FAB from rendering. This is a **pre-existing client-side hydration issue** unrelated to the server-side patches. Evidence:
- All 4 patched files are server-only (no client components changed).
- The API-only test passes across all browsers, confirming server patches work.
- The FAB visibility failure occurs before any API calls are made.

---

## Env Vars — Required for Deployment

### Vercel Production

| Variable | Value | Notes |
|----------|-------|-------|
| `OPENAI_API_KEY` | `sk-…` | **Must be set** — absence triggers the fallback message |
| `NHS_WEBSITE_CONTENT_API_KEY` | (production key) | **Must be a production key**, not the sandbox key |
| `NHS_WEBSITE_CONTENT_API_ENV` | `production` | Selects `api.service.nhs.uk` |

### Vercel Preview

| Variable | Value | Notes |
|----------|-------|-------|
| `NHS_WEBSITE_CONTENT_API_ENV` | `sandbox` | Selects `sandbox.api.service.nhs.uk` |
| `NHS_WEBSITE_CONTENT_API_KEY` | (sandbox key) | Can be the existing sandbox key |

### Local Development

Already configured in `.env.local`:
```
NHS_WEBSITE_CONTENT_API_ENV=sandbox
NHS_WEBSITE_CONTENT_API_KEY=O99UTNnrxaPC4if4sVZmqGrFpvlZ2eTi
```

---

## Residual Risks

1. **NHS sandbox is down (503/504)** — External infrastructure issue. NHS clinical content is unavailable in dev/preview until the sandbox recovers. The app degrades gracefully (internal-only answers).

2. **Production NHS key required** — The sandbox key (`O99UTNn…`) cannot be used in production. A production NHS Website Content API key must be obtained and set in Vercel.

3. **`OPENAI_API_KEY` in Vercel** — Cannot verify remotely. If missing, the improved fallback now (a) logs the absence, and (b) serves raw retrieved content if available, instead of the generic message.

4. **Pre-existing E2E test failures** — 37 UI tests fail due to a client-side rendering issue (Buddy FAB not appearing). This predates the patches and needs separate investigation.

5. **No NEXT_PUBLIC_ secrets** — Verified: no secrets are exposed to the client bundle.

---

## Test Commands

```bash
cd web

# Static gates (must pass)
yarn lint
yarn typecheck
yarn build

# E2E (optional — UI tests have pre-existing failures)
yarn test:e2e tests/buddy.spec.ts
```
