# Copilot / AI Agent Instructions (NeuroBreath)

All AI agents working in this repository MUST follow the rules in [AI_AGENT_RULES.md](../AI_AGENT_RULES.md).

## Working Directory

- All application work happens inside `web/`.

## Mandatory Local Gates (must be green before “done”)

```bash
cd web

yarn lint
yarn typecheck
yarn build

# If Buddy/UI/API is touched:
yarn test:e2e tests/buddy.spec.ts
```

## Next.js Safety (non-negotiable)

- API route modules must be safe to import during build.
- Do not instantiate external SDK clients at module scope when they depend on env vars.
- Validate env vars inside handlers; if missing, return a controlled 500 JSON response.

## Repo Hygiene

- Never commit build/test artifacts: `.next/`, `*.tsbuildinfo`, `playwright-report/`, `test-results/`.
- Update `web/.env.example` with new env var NAMES (no values).
