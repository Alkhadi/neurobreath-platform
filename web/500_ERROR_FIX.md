# 500 ERROR FIX - OnboardingCardWrapper

## Issue
Getting 500 Internal Server Error when accessing `/dyslexia-reading-training`

## Root Cause
The `OnboardingCardWrapper` server component was trying to read headers without proper error handling, which could cause the page to crash if:
1. Headers aren't available
2. Database connection fails
3. Any other server-side error occurs

## Fix Applied

### 1. Added Error Handling to OnboardingCardWrapper
```typescript
// components/OnboardingCardWrapper.tsx
export async function OnboardingCardWrapper() {
  try {
    // ... existing code ...
    
    // Safer header reading with fallback
    let pathname = '/';
    try {
      const headersList = await headers();
      pathname = headersList.get('x-pathname') || '/';
    } catch (error) {
      console.warn('[OnboardingCardWrapper] Failed to read pathname from headers:', error);
    }
    
    // ... rest of component ...
  } catch (error) {
    console.error('[OnboardingCardWrapper] Error rendering onboarding:', error);
    // Fail gracefully - don't break the page
    return null;
  }
}
```

### 2. Simplified Middleware Matcher
```typescript
// middleware.ts
export const config = {
  // Simpler matcher - exclude API, static files, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)).*)',
  ],
}
```

## What This Fixes

✅ **Graceful Degradation**: If onboarding fails to render, page still loads
✅ **Better Error Logging**: Console warnings show what went wrong
✅ **Simpler Middleware**: Cleaner regex pattern for route matching
✅ **Fallback Behavior**: Defaults to `/` if pathname can't be determined

## Testing

After restarting the dev server:

```bash
# Stop current server (Ctrl+C)
yarn dev

# Should now work without 500 errors:
# - http://localhost:3001/dyslexia-reading-training
# - http://localhost:3001/
# - All other routes
```

## Expected Behavior Now

1. **If onboarding renders successfully**: Shows onboarding card or banner (based on state)
2. **If onboarding fails**: Page loads normally without onboarding (graceful fallback)
3. **Console shows**: Warnings/errors for debugging (but doesn't crash page)

## If Still Getting 500 Error

Check the terminal for the actual error message. Possible causes:

1. **Database connection issue**: Make sure Prisma is set up
   ```bash
   yarn db:up    # Start Docker Postgres
   yarn prisma:generate
   yarn db:push
   ```

2. **Missing dependencies**: Re-install
   ```bash
   rm -rf node_modules yarn.lock
   yarn install
   ```

3. **TypeScript errors**: Check
   ```bash
   yarn tsc --noEmit
   ```

4. **Other component errors**: The error might be in `/dyslexia-reading-training/page.tsx` itself, not onboarding

## Quick Debug Steps

1. Check terminal output for actual error stack trace
2. Try accessing other routes:
   - `/` (homepage)
   - `/get-started`
   - `/blog` (should NOT show onboarding)
3. If all routes fail: issue is likely in `app/layout.tsx`
4. If only `/dyslexia-reading-training` fails: issue is in that page component

## Status
✅ Error handling added
✅ Middleware simplified
✅ Ready for testing

Restart dev server and check if error persists. If it does, share the actual error from terminal (lines after "Ready in 1458ms").

