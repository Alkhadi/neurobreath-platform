# QA Reliability Checklist (NeuroBreath)

This checklist is the “next phase” safety net after feature work lands: it keeps regressions (like horizontal overflow in embedded browsers) from slipping into production.

## A) Local gates (must be green)

Run from `web/`:

```bash
yarn lint
yarn typecheck
yarn build

# Minimum high-signal E2E
PW_REUSE_SERVER=1 yarn test:e2e tests/buddy.spec.ts
PW_REUSE_SERVER=1 yarn test:e2e tests/responsive.spec.ts
```

## B) Automated guardrails (reports)

From `web/`:

```bash
# Screenshots + horizontal overflow detection
BASE_URL=http://localhost:3000 yarn responsive:scan

# Route inventory + DOM-discovered links must be 200/3xx
BASE_URL=http://localhost:3000 yarn links:verify

# Lighthouse (mobile + desktop) reports
BASE_URL=http://localhost:3000 yarn perf:lighthouse
```

Outputs:
- `web/reports/responsive/`
- `web/reports/links-verification.json`
- `web/reports/lighthouse/`

## C) Tesla / embedded-browser regression check

Manual smoke (recommended when touching header/nav):

1. Open `/uk` and `/us`.
2. Open **Conditions** mega-menu.
3. Verify dropdown stays within viewport (no left cut-off) and is scrollable if needed.
4. Verify keyboard:
   - `Tab` reaches triggers
   - `Escape` closes menu

The automated coverage lives in `web/tests/responsive.spec.ts`.

## D) Visual regression (optional, controlled)

Visual tests are intentionally separate from default E2E:

```bash
yarn test:visual
# Only when you intentionally want to refresh baselines:
yarn test:visual:update
```

## E) CI expectations

PR gates are enforced in `.github/workflows/ci-gates.yml` and include:
- Lint / typecheck / build
- E2E smoke (Buddy)
- Responsive overflow regression
- Link verification
- Lighthouse report generation (uploaded as artifacts)

## F) Rollback

If a regression makes it to `main`, revert the offending commit:

```bash
git revert <sha>
```
