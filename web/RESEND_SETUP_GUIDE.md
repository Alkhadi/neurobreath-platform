# Resend Email Setup Guide

## Issue
The contact form shows "Email send failed" because Resend requires proper configuration.

## Root Cause
Resend has restrictions on email sending:
1. **Sender Address**: Must be from a verified domain OR use `onboarding@resend.dev` (free tier test address)
2. **Recipient Address**: In the free tier, you can only send to verified email addresses

## Solution Options

### Option 1: Development Mode (Current - No Real Emails)
Enable `SKIP_EMAIL_SEND=true` in `.env.local` to bypass actual email sending during development:

```bash
SKIP_EMAIL_SEND=true
```

**Pros**: Form works immediately, data is logged to console
**Cons**: No actual emails sent

### Option 2: Verify Recipient Email in Resend Dashboard
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Add and verify the recipient email (`info@neurobreath.co.uk`)
3. Remove or set `SKIP_EMAIL_SEND=false` in `.env.local`

**Pros**: Emails work with test sender
**Cons**: Only works for verified emails

### Option 3: Add and Verify Your Domain (Production-Ready)
1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Add `neurobreath.co.uk`
4. Add the required DNS records to your domain registrar:
   - SPF record
   - DKIM record
   - DMARC record (optional but recommended)
5. Wait for verification (usually takes a few minutes)
6. Update `.env.local`:
   ```bash
   CONTACT_FROM="NeuroBreath Support <support@neurobreath.co.uk>"
   SKIP_EMAIL_SEND=false
   ```

**Pros**: Production-ready, can send to any email
**Cons**: Requires DNS access and setup time

## Current Configuration

### Environment Variables (.env.local)
```bash
# Email sending (Resend)
RESEND_API_KEY=re_PDniApCD_2vZ8L9x9xdAbMHRyCG8iRMLW
CONTACT_TO=info@neurobreath.co.uk
CONTACT_FROM="NeuroBreath Support <onboarding@resend.dev>"
SKIP_EMAIL_SEND=true  # Currently bypassing email for dev
```

## Testing the Fix

1. **With SKIP_EMAIL_SEND=true** (current):
   - Form will submit successfully
   - Message: "Thanks! Your message was received. (Development mode - email not sent)"
   - Data logged to server console

2. **After Resend Setup**:
   - Set `SKIP_EMAIL_SEND=false` or remove it
   - Restart dev server
   - Test form - emails should send successfully

## Error Messages Reference

| Error | Meaning | Solution |
|-------|---------|----------|
| "Email service is not properly configured" | Domain verification needed | Verify domain in Resend |
| "Email service authentication failed" | API key issue | Check RESEND_API_KEY |
| "Email send failed: ..." | Various Resend errors | Check server logs for details |

## Next Steps

1. **For Development**: Leave `SKIP_EMAIL_SEND=true` and use console logs
2. **For Production**: Complete Option 3 (verify domain) before deploying

## Additional Resources

- [Resend Dashboard](https://resend.com/domains)
- [Resend Domain Verification Guide](https://resend.com/docs/dashboard/domains/introduction)
- [Resend API Documentation](https://resend.com/docs/api-reference/emails/send-email)
