# AI Agent Engineering Rules — NeuroBreath Platform (Repo Contract)

> **CRITICAL (Non-Negotiable):** These rules are the contract for all AI agents working in this repo.
> **Default:** `STRICT PATCH MODE` is **ON** unless the repo owner explicitly turns it OFF for a specific task.

---

## 0) Repository Context (Authoritative)

- **Repository:** `neurobreath-platform` (Alkhadi/neurobreath-platform)
- **Primary app directory:** `/web`
- **Package manager:** Yarn classic
- **Core stack:** Next.js 15 (App Router) + React + TypeScript + Tailwind + Prisma + PostgreSQL
- **Testing:** Playwright E2E (plus targeted suites referenced by scripts)

---

## 1) The One Principle That Matters

AI work must be **predictable, reviewable, and reversible**.

That means:
- Small, well-scoped diffs whenever possible
- No hidden architectural drift
- No secrets
- No dependency surprises
- Green gates before “done”
- Clean handover when switching agents

---

## 2) Non-Negotiable Quality Gates (Must Be Green)

Before claiming any work is complete, you **MUST** run and report gates.

### A) TypeScript (Zero Errors)

```bash
cd web && yarn typecheck
```

### B) ESLint (Zero Errors)

```bash
cd web && yarn lint
```

Do NOT weaken config, disable rules broadly, or add blanket ignores.
Fix root causes.

### C) Next.js Production Build (Must Succeed)

```bash
cd web && yarn build
```

- Build must not fail due to env secrets evaluated at import time.
- If needed to verify clean build behavior: remove `.next` and rebuild.

### D) Tests (Smallest Relevant Set)

Run the smallest meaningful suite for the touched area.

```bash
# If Buddy/UI/API is touched:
cd web && yarn test:e2e tests/buddy.spec.ts

# Otherwise run the smallest relevant suite
cd web && yarn test:e2e
```

### Definition of Done (Must Report Explicitly)

You must explicitly report:

- ✅ `cd web && yarn lint` passed
- ✅ `cd web && yarn typecheck` passed
- ✅ `cd web && yarn build` passed
- ✅ Relevant tests passed (or why not applicable + safe alternative)

---

## 3) Absolute Prohibitions (Never Do These)

- ❌ Disable TypeScript checks or weaken `tsconfig.json`
- ❌ Skip linting or add broad `eslint-disable` comments
- ❌ Add secrets/API keys/tokens to code, commits, screenshots, logs, or examples
- ❌ Commit build/test artifacts: `.next/`, `node_modules/`, `playwright-report/`, `test-results/`, `*.tsbuildinfo`
- ❌ Put JSX inside data/config objects (data must be JSON-like)
- ❌ Use `any` unless unavoidable (prefer `unknown` + narrowing, unions, strict DTO types)

---

## 4) Next.js App Router Safety Rules (Build-Safe by Design)

### 4.1 Never “Throw on Import” in Route Modules

All route handlers and server modules must be safe to import during `next build`.

❌ WRONG (can crash build):

```typescript
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY!); // ❌ evaluated at import time
```

✅ CORRECT (lazy init inside handler):

```typescript
import { Resend } from "resend";

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Server misconfigured" }, { status: 500 });
  }
  const resend = new Resend(apiKey);
  // ...
}
```

### 4.2 External Service Pattern (Required)

- Validate env vars inside the handler.
- If missing, return controlled `500` JSON (do not crash at import time).
- Instantiate SDK clients only after env validation.

### 4.3 Client vs Server Boundaries (Hard Rule)

- Prisma is server-only.
- Never import server-only modules into client components.
- Use `'use client'` only when required.

---

## 5) TypeScript + React Rules (Maintainability + UX)

- No unused imports/vars
- Prefer `const` unless reassigned
- Hooks must have correct dependency arrays
- Keep components small; avoid large “god components”
- Accessibility is required: keyboard navigation, ARIA labels where appropriate, focus states
- Use `next/link` for internal navigation

---

## 6) Prisma Rules (Server-Only + Controlled Change)

- Prisma client is centralized (e.g. `web/lib/db.ts`).
- No DB calls in client components.
- Prisma warnings are actionable: fix properly OR document clearly with TODO + plan.
- Schema/migrations are high-risk: see STRICT PATCH MODE and overrides.

---

## 7) Repo Hygiene & Change Delivery

- Run commands from `/web` unless explicitly required otherwise.
- Keep diffs minimal and scoped when possible.
- Update `.env.example` with newly required env var names only (no values).
- Provide rollback plan (revert commit, revert PR, restore previous behavior).

---

## 8) Mandatory Response Format (For Any Code Patch)

For all changes, provide:

**A) Summary of changes** (1–6 bullets)
**B) Files touched** (list)
**C) Patch/Diff** (copy-paste ready)
**D) Run steps** (exact commands)
**E) Acceptance checks** (exact URLs + what to verify)
**F) Risks + rollback plan**
**G) Gate results** (lint/typecheck/build/tests)

---

## 9) Error Handling Policy (Fix, Don’t Explain-Only)

When encountering:

- TypeScript errors → fix properly (do not weaken config)
- ESLint errors → fix root cause (do not disable broadly)
- Build failures → make imports/build safe (App Router rules)
- Missing env vars → validate inside handlers + update `.env.example`
- Prisma warnings → resolve or document with plan

Do NOT stop at “here is why it fails.” Provide and apply the fix.

---

## SECTION H — STRICT PATCH MODE (Default ON)

### H0) Purpose

STRICT PATCH MODE exists to make the repo agent-switch-safe:

- prevents silent architectural drift
- blocks high-risk changes without explicit approval
- keeps work reviewable, testable, and reversible

### H1) Important Reality (Prompt-Aware Enforcement Is Impossible)

Automations (guards/hooks/CI) cannot read or interpret your prompt.
Therefore, enforcement focuses on objective, high-risk drift:

- secrets
- artifacts
- dependency drift
- schema/migrations
- unsafe build imports

…and remains flexible for legitimate multi-page/site-wide fixes.

### H2) Allowed Scope (Broad by Default for This Workflow)

By default, agents may change multi-page and site-wide UI/UX across:

- `web/**` (pages, components, styles, layout, header/footer, content)

and supporting areas if needed by the task:

- `.github/**`, `docs/**`, `packages/**`, `scripts/**`, `shared/**`, `serverless/**`, `flutter_app/**`

Still disallowed (never commit):

- `.next/`, `node_modules/`, `playwright-report/`, `test-results/`, `*.tsbuildinfo`

### H3) Minimal-Diff Discipline (No Style-Refactors Without Need)

- Change the smallest surface area that fixes the root cause.
- Do not rewrite code “for style.”
- Do not introduce new patterns unless the target area already uses them.

### H4) High-Risk Guardrails (Always Strict)

By default, the following are blocked unless explicitly approved:

- Dependency drift
  - edits to dependency sections in `package.json`
  - `web/yarn.lock` changes
- Prisma schema/migrations
  - `web/prisma/schema.prisma`
  - `web/prisma/migrations/**`
- Secrets (any new secret material in repo)
- Artifacts (build/test outputs committed)

### H5) “Mixed Patch” Heuristic (Strict Only Where It Matters)

Multi-file and multi-page fixes are normal in this repo.
However, mixes that combine high-risk domains are blocked by default, for safety.

Blocked by default (high-risk mixes):

- Prisma schema/migration changes + app changes
- dependency/lockfile changes + app changes
- CI workflow changes + high-risk changes (auth/prisma/deps)

Generally allowed (normal workflow):

- multiple pages/components/styles across `web/**`
- site-wide header/footer/CSS changes
- UI + content + layout changes
- API + UI changes (when no prisma/schema/deps drift is involved)

### H6) Explicit Override Switches (Owner-Approved Only)

Use only when the repo owner explicitly approves.

Local (environment variables):

- `ALLOW_OUT_OF_SCOPE=1` (edits outside default allowlist)
- `ALLOW_DEP_CHANGES=1` (deps/lockfile drift)
- `ALLOW_PRISMA_CHANGES=1` (schema/migrations)
- `ALLOW_MIXED_PATCH=1` (intentional high-risk mixing)

CI-friendly commit message tokens (approved exceptions):

- `#allow-out-of-scope`
- `#allow-deps`
- `#allow-prisma`
- `#allow-mixed-patch`

If mixing includes deps or prisma, include the specific token too (`#allow-deps`, `#allow-prisma`).

### H7) Mandatory Local Gates Under Strict Patch Mode

Run from `web/`:

```bash
yarn lint
yarn typecheck
yarn build

# If Buddy/UI/API is touched:
yarn test:e2e tests/buddy.spec.ts
```

If a gate cannot run (CI-only env), state exactly why and provide a safe alternative verification step.

---

## SECTION I — AGENT SWITCHING POLICY (Safe Anytime, With Checkpoints)

Switching agents is allowed at any time if you first create a stable checkpoint.

### I1) Preferred Stable Points (Best Practice)

Only switch agents when:

- `git status` is clean (no uncommitted changes)
- relevant gates are green for the patch scope
- a handover note exists (Section J)

### I2) Avoid Switching Mid-Flight During High-Risk Work

Avoid switching mid-flight during:

- dependency upgrades
- Prisma migrations/schema work
- authentication changes
- long refactors

### I3) Emergency Mid-Flight Switch Procedure (When You Must Hand Off Now)

If you must hand off immediately:

- Make working tree consistent (no half-written files)
- Create a checkpoint:
  - preferred: a temporary commit prefixed `WIP: ...`
  - or: a named stash
- Paste the handover template (Section J) including:
  - what is incomplete
  - which gates fail (exact errors)
  - exact next steps to return to green

---

## SECTION J — AGENT HANDOVER TEMPLATE (Copy/Paste)

Use whenever you switch agents, pause work, or ask another agent to continue.

### J1) Context

- Repo/Branch:
- Task type: bugfix | feature | refactor | docs/process
- Goal (1 sentence):
- Non-goals / must-not-change:

### J2) What Changed

- Summary (1–6 bullets):
- Files touched:
- Key decisions (why this approach):

### J3) Current State

- What remains (next concrete steps):
- Known issues / risks:
- If failing: exact error + location + reproduction steps

### J4) Verification

- Commands run + results:
  - `cd web && yarn lint`:
  - `cd web && yarn typecheck`:
  - `cd web && yarn build`:
  - `cd web && yarn test:e2e ...` (if relevant):

### J5) Rollback

- Rollback plan: `git revert <sha>` or restore previous behavior (describe)

---

## 10) Auto-Enforcement (Repo-Managed, No Prompt Copy/Paste Required)

This repo includes automation to enforce the above rules:

- Guard script (blocks high-risk drift): `web/scripts/strict-patch-guard.mjs`
- Local git hooks (block bad commits/pushes): `.githooks/pre-commit`, `.githooks/pre-push`
- CI checks (block merges that violate the contract): `.github/workflows/ci-gates.yml`

If these enforcement components exist in the repo, they must remain enabled and must not be bypassed except via approved overrides (Section H6).

Note: automation cannot read your prompt; it enforces objectively detectable risk only.

---

## Quick Reference Commands

```bash
# From /web directory:

# Development
yarn dev
yarn dev:clean

# Quality gates
yarn lint
yarn typecheck
yarn build

# Testing
yarn test:e2e
yarn test:e2e tests/buddy.spec.ts
yarn test:visual

# Database (if present in scripts)
yarn db:up
yarn db:push
yarn db:studio

# Prisma
yarn prisma:generate
```

---

## Related Documentation

- PR Template: `.github/pull_request_template.md`
- README: `/web/README.md`
- Performance Playbook: `/web/PERFORMANCE_PLAYBOOK.md`
- Tech Spec: `/docs/TECH_SPEC.md`

---

**Last Updated**: 2026-02-19
