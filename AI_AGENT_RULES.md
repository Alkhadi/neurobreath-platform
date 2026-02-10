# AI Agent Engineering Rules — NeuroBreath Platform

> **CRITICAL**: These rules are non-negotiable. All changes MUST pass quality gates before claiming "done".

## Repository Context

- **Repository**: `neurobreath-platform` (Alkhadi/neurobreath-platform)
- **Application Directory**: `/web`
- **Package Manager**: Yarn classic
- **Stack**: Next.js 15 (App Router) + TypeScript + Prisma + PostgreSQL

---

## SECTION A — NON-NEGOTIABLE QUALITY GATES

Before claiming any work is complete, you **MUST** verify these gates pass locally:

### 1. TypeScript Check (Zero Errors)
```bash
cd web && yarn typecheck
```

### 2. ESLint (Zero Errors)
```bash
cd web && yarn lint
```
- **Do NOT** disable rules, weaken config, or add blanket ignores
- Fix root causes

### 3. Next.js Production Build (Clean State)
```bash
cd web && yarn build
```
- Must not rely on cache (remove `.next` if needed to validate)
- Build must never fail due to missing secrets evaluated at import time

### 4. Relevant Tests
```bash
# If Buddy/UI/API is touched:
cd web && yarn test:e2e tests/buddy.spec.ts

# Otherwise run the smallest relevant suite
cd web && yarn test:e2e
```

### Definition of Done

You must explicitly report:
- ✅ `yarn lint` passed
- ✅ `yarn typecheck` passed
- ✅ `yarn build` passed
- ✅ Relevant tests passed (or justified not applicable)

---

## SECTION B — ABSOLUTE PROHIBITIONS

**NEVER** do any of the following:

1. ❌ Disable TypeScript or weaken `tsconfig.json`
2. ❌ Skip linting or add broad `eslint-disable` comments
3. ❌ Add secrets/API keys to code or commit them
4. ❌ Commit build artifacts: `.next/`, `*.tsbuildinfo`, `playwright-report/`, `test-results/`
5. ❌ Place JSX inside data/config objects (data must be JSON-like)
6. ❌ Use `any` unless unavoidable (prefer `unknown` + narrowing, unions, strict DTO types)

---

## SECTION C — NEXT.JS APP ROUTER SAFETY RULES

### 1. NO "Throw on Import" in API Route Handlers

Route modules **MUST** be safe to import during `next build`.

**❌ WRONG** (throws during build if env var missing):
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!) // ❌ Fails at build time

export async function POST(req: Request) {
  // ...
}
```

**✅ CORRECT** (safe instantiation):
```typescript
import { Resend } from 'resend'

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    return Response.json(
      { error: 'Server misconfigured' },
      { status: 500 }
    )
  }
  
  const resend = new Resend(apiKey)
  // ...
}
```

### 2. Build-Safe External Service Pattern

- Validate env vars **inside** the handler
- If missing, return controlled JSON error (500) without throwing
- Instantiate SDK clients **lazily** only after env validation

### 3. Client vs Server Boundaries

- Prisma is **server-only**: never import into client components
- Client components must not import server-only modules or env usage
- Use `'use client'` directive only when required

---

## SECTION D — TYPESCRIPT + REACT RULES

1. No unused imports/vars
2. Prefer `const` unless reassigned (`prefer-const`)
3. Hooks: correct dependencies; no incorrect omissions
4. Keep components small and maintainable
5. Ensure accessibility: keyboard navigation, ARIA labels, focus states
6. Use `next/link` for internal navigation

---

## SECTION E — PRISMA RULES

1. Centralize Prisma client in `/web/lib/db.ts`
2. Treat Prisma warnings as actionable:
   - Fix properly OR document clearly with TODO and upgrade plan
3. No DB calls in client components

---

## SECTION F — REPO HYGIENE & CHANGE DELIVERY

1. Always run commands from `/web`
2. Keep diffs minimal and scoped
3. Update `.env.example` with any newly required env var **names** (no values)
4. Provide rollback plan (git revert / restore prior deployment)

---

## MANDATORY RESPONSE FORMAT

For all code changes, provide:

**A) Summary of changes** (1–6 bullets)  
**B) Files touched** (list)  
**C) Patch/Diff** (copy-paste ready)  
**D) Run steps** (exact commands)  
**E) Acceptance checks** (exact URLs + what to verify)  
**F) Risks + rollback plan**  
**G) Gate results** (lint/typecheck/build/tests)

---

## SECTION G — ERROR HANDLING

When you encounter:

- **TypeScript errors**: Fix properly (do not weaken tsconfig)
- **ESLint errors**: Fix root causes (do not disable rules broadly)
- **Next build failures**: Ensure route handlers are build-safe
- **Missing env vars**: Update `.env.example` and implement safe server-side validation
- **Prisma warnings**: Resolve or document with TODO + upgrade plan

**Do NOT stop at "here is why it fails"** — propose and apply the fix.

---

## Quick Reference Commands

```bash
# From /web directory:

# Development
yarn dev
yarn dev:clean  # Clean .next cache first

# Quality Gates
yarn lint
yarn typecheck
yarn build

# Testing
yarn test:e2e
yarn test:e2e tests/buddy.spec.ts
yarn test:visual

# Database
yarn db:up      # Start Docker Postgres
yarn db:push    # Push schema changes
yarn db:studio  # Open Prisma Studio

# Prisma
yarn prisma:generate
```

---

## CI Integration

See `.github/workflows/ci-gates.yml` for automated enforcement.

All PRs must pass:
- Lint
- Typecheck
- Build
- E2E smoke test

---

## Related Documentation

- **PR Template**: `.github/pull_request_template.md`
- **README**: `/web/README.md`
- **Performance Playbook**: `/web/PERFORMANCE_PLAYBOOK.md`
- **Tech Spec**: `/docs/TECH_SPEC.md`

---

**Last Updated**: 2026-01-20
