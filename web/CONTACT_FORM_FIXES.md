# Contact Form - Message Sending & Email Fixes

## Issues Fixed

### 1. **Invalid Domain Error (Turnstile Verification)**
**Problem**: The contact form was failing with "Invalid domain" error when submitting locally and on the live website.

**Root Cause**: Incorrect/deprecated Turnstile test keys were being used.

**Solution**: Updated `.env.local` with the correct official Cloudflare Turnstile test keys:
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA` (officially designated test key)
- `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` (officially designated test key)

These test keys are guaranteed to work on all domains (including localhost).

### 2. **Email Service Not Configured Locally**
**Problem**: Attempting to send real emails during local development failed due to missing proper configuration.

**Solution**: 
- Added `SKIP_EMAIL_SEND=true` to `.env.local` for development mode
- When `NODE_ENV === "development"` and `SKIP_EMAIL_SEND === "true"`, the API logs contact data to console instead of sending real emails
- This allows testing the full form flow without hitting Resend API limits

### 3. **Poor Error Messages**
**Problem**: Users saw cryptic errors that weren't helpful for troubleshooting.

**Solution**: Implemented comprehensive error handling in `/app/api/contact/route.ts`:

#### Turnstile Verification Errors:
- `"domain"` → "The contact form is not properly configured for this domain"
- `"timeout"` → "Verification timed out. Please try again."
- `"invalid"` → "Verification token is invalid. Please refresh the page and try again."

#### Resend Email Errors:
- `"domain"` → "Email service domain is not verified"
- `"verify"/"verification"` → "Email service is not properly verified"
- `"api key"/"authentication"` → "Email service authentication failed"
- `"invalid_email"` → "The recipient email address is invalid"
- `"rate_limit"/"429"` → "Too many emails sent. Please try again in a few minutes."

#### General Network Errors:
- Better handling of network timeouts and failures
- More descriptive messages for debugging

## Local Development Setup

### Requirements
Your `web/.env.local` should contain:

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neurobreath"

# Email sending (Resend) - uses your real API key but won't send in dev mode
RESEND_API_KEY=re_your_actual_key_here
CONTACT_TO=info@neurobreath.co.uk
CONTACT_FROM="NeuroBreath Support <onboarding@resend.dev>"

# Skip actual email sending in local development (logs to console instead)
SKIP_EMAIL_SEND=true

# Turnstile (using official Cloudflare test keys - always passes validation)
# These work on ALL domains including localhost
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
```

### Testing Locally

1. **Start development server**:
   ```bash
   cd web
   yarn dev
   ```

2. **Navigate to contact form**:
   - Go to `http://localhost:3000/contact`

3. **Submit a test message**:
   - Fill out the form
   - Click the verification checkbox (test keys auto-pass)
   - Click "Send message"
   - Check terminal output - you should see:
     ```
     DEV MODE: Skipping actual email send. Contact data: {...}
     ```

4. **Expected behavior**:
   - Form shows: "Thanks! Your message was received. (Development mode - email not sent)"
   - No actual email is sent
   - Full contact data is logged for verification

## Production (Live Website) Setup

### Required Environment Variables on Vercel

Set these in Vercel dashboard (`Settings → Environment Variables`):

```
RESEND_API_KEY=re_your_production_key
CONTACT_TO=info@neurobreath.co.uk
CONTACT_FROM="NeuroBreath Support <onboarding@resend.dev>"
TURNSTILE_SECRET_KEY=your_production_turnstile_secret
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_production_turnstile_site_key
```

**DO NOT set `SKIP_EMAIL_SEND` on production** - only in local `.env.local`

### Obtaining Turnstile Keys

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
2. Create a new site (if not already created)
3. Select domain: `neurobreath.co.uk` (or appropriate production domain)
4. Copy the **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
5. Copy the **Secret Key** → `TURNSTILE_SECRET_KEY`

### Obtaining Resend API Key

1. Go to [Resend Dashboard](https://resend.com)
2. Create a new API key or use existing one
3. Copy the key (starts with `re_...`)
4. Add to Vercel environment variables

### Vercel Deployment via CLI

If deploying via command line:

```bash
cd web
vercel env add RESEND_API_KEY production
vercel env add CONTACT_TO production
vercel env add CONTACT_FROM production
vercel env add TURNSTILE_SECRET_KEY production
vercel env add NEXT_PUBLIC_TURNSTILE_SITE_KEY production

# Deploy
vercel --prod
```

## Testing on Live Site

1. Navigate to your live website contact form
2. Submit a test message
3. Verify:
   - Form shows success message: "Thanks! We'll get back to you soon."
   - Admin email arrives at `CONTACT_TO` address
   - User receives auto-responder email from `CONTACT_FROM` sender

## Files Modified

1. **`web/.env.local`** - Updated Turnstile test keys and added SKIP_EMAIL_SEND
2. **`web/app/api/contact/route.ts`** - Improved error handling and logging:
   - Better Turnstile error parsing
   - Comprehensive Resend API error mapping
   - Development mode email skip with console logging
   - Try-catch for auto-responder (non-critical failure)

## Troubleshooting

### "Invalid domain" Error
- ✅ **Fixed** - Use official test keys in development
- On production: Verify Turnstile domain matches your website domain in Cloudflare dashboard

### "Email service is not configured"
- Check `RESEND_API_KEY` is set and valid
- On local dev: Ensure `SKIP_EMAIL_SEND=true` for testing without email sending

### "Too many requests" (429 error)
- Rate limit is 5 submissions per IP per 10 minutes (in-memory)
- Wait 10 minutes or contact support

### Network errors with ad-blockers
- The client-side form already has a helpful message for this
- Users should disable ad-blockers/VPNs for the contact form to work

### Auto-responder not reaching user
- Non-critical failure logged but doesn't block main form submission
- Check that `CONTACT_FROM` email is properly verified in Resend

## Verification Gates (Pre-Deployment)

Before marking as done:

```bash
cd web

# These must all pass green:
yarn lint        # ✅ PASS
yarn typecheck   # ✅ PASS  
yarn build       # ✅ PASS

# Optional: E2E test for contact form (if exists)
# yarn test:e2e tests/contact.spec.ts
```

## Monitoring

Add monitoring for production errors:

1. Check Vercel deployment logs for any API errors
2. Monitor Resend dashboard for bounce rates
3. Set up email alerts for `CONTACT_TO` inbox
4. Monitor Turnstile success rates in Cloudflare dashboard

---

**Last Updated**: 23 January 2026
**Status**: ✅ All Fixes Applied & Tested
