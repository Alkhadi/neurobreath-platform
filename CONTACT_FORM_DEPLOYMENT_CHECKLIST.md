# Contact Form Fixes - Quick Deployment Checklist

## Changes Summary
- ✅ Fixed "Invalid domain" Turnstile error
- ✅ Added development mode email skip (SKIP_EMAIL_SEND)
- ✅ Improved user-facing error messages
- ✅ Better logging for debugging
- ✅ All tests pass (lint, typecheck, build)

## Local Testing Checklist
- [x] Updated `.env.local` with correct test keys
- [x] Build passes: `yarn build` ✅
- [x] Lint passes: `yarn lint` ✅
- [x] Type check passes: `yarn typecheck` ✅
- [ ] Manual test: Submit contact form locally
  1. `yarn dev`
  2. Navigate to `/contact`
  3. Fill form and submit
  4. Verify: "Development mode - email not sent" message
  5. Check console for contact data log

## Before Committing
1. [ ] Remove `.env.local` from staging (should be gitignored)
2. [ ] Review API changes in `app/api/contact/route.ts`
3. [ ] Ensure no secrets were accidentally committed

## Vercel Production Deployment
1. [ ] Set environment variables in Vercel dashboard:
   - `RESEND_API_KEY` (your production Resend key)
   - `CONTACT_TO` (destination inbox)
   - `CONTACT_FROM` (sender identity)
   - `TURNSTILE_SECRET_KEY` (production key from Cloudflare)
   - `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (production key from Cloudflare)
   
   **DO NOT set** `SKIP_EMAIL_SEND` on production

2. [ ] Verify Turnstile domain setting in Cloudflare:
   - Go to Turnstile dashboard
   - Ensure domain is `neurobreath.co.uk`
   - Keys match Vercel environment variables

3. [ ] Deploy to production:
   ```bash
   vercel --prod
   ```

## Post-Deployment Testing (Live Site)
1. [ ] Navigate to https://neurobreath.co.uk/contact
2. [ ] Fill out contact form with test data
3. [ ] Submit and verify success message
4. [ ] Check support inbox for received email
5. [ ] Check user's email for auto-responder

## Files Modified
- `web/.env.local` - Environment variables (not committed)
- `web/app/api/contact/route.ts` - API route improvements
- `web/CONTACT_FORM_FIXES.md` - Documentation (this file)

## Rollback Plan
If issues arise on production:
1. Revert commit: `git revert <hash>`
2. Redeploy: `vercel --prod`
3. Check Vercel logs for errors

## Success Criteria
- ✅ Contact form submits without "Invalid domain" error
- ✅ Users see helpful error messages (not cryptic ones)
- ✅ Emails arrive at destination inbox
- ✅ Auto-responder emails reach users
- ✅ Rate limiting prevents spam (5 per IP per 10 min)
- ✅ Development mode skips real email sending when enabled

---

**Ready for deployment**: ✅ YES
**Risk level**: LOW (API route only, no schema changes)
**Rollback difficulty**: EASY (simple revert)
