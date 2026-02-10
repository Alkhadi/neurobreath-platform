# GitHub Setup (Sanitized)

This file documents repository setup steps **without** embedding any secrets.

## Rules

- Do not commit `.env` files or credentials.
- Store secrets in:
  - Vercel project environment variables
  - Local `web/.env.local` (untracked)
  - GitHub Actions / repo secrets (if used)

## Typical setup

1. Clone the repo.
2. Install dependencies under `web/`.
3. Configure required environment variables in Vercel and locally.
4. Deploy with Vercel.

If you need credentials (DB, Resend, Turnstile), retrieve them from provider dashboards and set them as environment variables — never paste them into docs.
