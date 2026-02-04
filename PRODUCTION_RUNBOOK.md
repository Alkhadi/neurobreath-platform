# Production Runbook — Prisma Migrations (NeuroBreath)

## Purpose

Prevent production outages (e.g. “Auth database tables are not ready yet…”) by ensuring Prisma migrations are applied to the production database before/alongside deployments.

## Production project (Vercel)

- **Correct Vercel project:** `neurobreath-platform-taff`
- **Domain served:** [https://neurobreath.co.uk](https://neurobreath.co.uk)

## Safe production migration procedure (copy/paste)

> Notes:
> - This uses the Vercel CLI to pull production environment variables locally.
> - Do not paste or print secret values into chat/logs.

```bash
# From repo root

# (a) Link to the correct Vercel project
vercel link --project neurobreath-platform-taff

# (b) Pull production env vars into a local file (do NOT commit this file)
vercel env pull .env.production.local --environment=production

# (c) Load env vars for this terminal session only
set -a
source .env.production.local
set +a

# (d) Check migration status, then deploy migrations to production
cd web
yarn db:migrate:status
yarn db:migrate:deploy

# (e) Regenerate Prisma client (safe + keeps local build consistent)
yarn prisma:generate
```

## Quick verification (no secrets)

After migrations are deployed, verify:

- [https://neurobreath.co.uk/uk/register](https://neurobreath.co.uk/uk/register)
- [https://neurobreath.co.uk/api/auth/session](https://neurobreath.co.uk/api/auth/session)

## Do NOT commit

- `.env.local`, `.env.production.local`, or any `.env*.local` files
- `.vercel/`
