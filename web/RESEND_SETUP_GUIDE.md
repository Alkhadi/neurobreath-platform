# Resend Email Setup (NeuroBreath)

This project sends Contact form submissions via Resend.

## Important

- Never commit API keys, passwords, or `.env` files.
- Use environment variables in Vercel and locally.
- If a secret was ever committed, rotate it immediately.

## Required environment variables

Set these (Vercel + local):

- `RESEND_API_KEY` — your Resend API key (starts with `re_...`)
- `CONTACT_TO` — destination inbox (recommended: `info@neurobreath.co.uk`)
- `CONTACT_FROM` — sender identity (recommended: `NeuroBreath Support <onboarding@resend.dev>`)

## Cloudflare routing (recommended)

Recommended production flow:

1. Form sends to `info@neurobreath.co.uk`
2. Cloudflare Email Routing forwards to your personal inbox (e.g. Yahoo)

This keeps the code stable even if the destination inbox changes.

## Vercel (production)

From `web/`:

```bash
vercel env add RESEND_API_KEY production
vercel env add CONTACT_TO production
vercel env add CONTACT_FROM production
vercel --prod
```

## Local development

Create `web/.env.local` (do not commit it):

```dotenv
RESEND_API_KEY=re_your_real_key_here
CONTACT_TO=info@neurobreath.co.uk
CONTACT_FROM="NeuroBreath Support <onboarding@resend.dev>"
```
