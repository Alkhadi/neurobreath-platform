# Migration Guide

## Database Migrations

### Required: Add New Models


The following Prisma models have been added and require database migration:

1. **SENDReport** - Training recommendation reports
2. **ParentAccess** - Parent/guardian access codes

### Migration Steps

#### 1. Review Schema Changes


Open `web/prisma/schema.prisma` and review the new models:

- Lines ~373-410: `SENDReport` model
- Lines ~416-432: `ParentAccess` model

#### 2. Create Migration


```bash
cd web
npx prisma migrate dev --name add_send_reports_and_parent_access
```

This will:

- Generate SQL migration file
- Apply migration to development database
- Regenerate Prisma Client

#### 3. Review Generated Migration


Check the migration file in:

```texttext
web/prisma/migrations/YYYYMMDDHHMMSS_add_send_reports_and_parent_access/migration.sql
```

Expected SQL (approximate):

```sql
-- CreateTable
CREATE TABLE "SENDReport" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "learnerName" TEXT,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assessmentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sessionIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dateRangeJson" JSONB NOT NULL,
    "patternSummary" TEXT NOT NULL,
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "challenges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" TEXT NOT NULL DEFAULT 'medium',
    "generatedBy" TEXT NOT NULL,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "editedContent" TEXT,
    "isPrintFriendly" BOOLEAN NOT NULL DEFAULT true,
    "disclaimerShown" BOOLEAN NOT NULL DEFAULT true,
    "disclaimer" TEXT NOT NULL DEFAULT 'This report provides training recommendations only and is NOT a diagnostic assessment. For formal educational or clinical assessment, please consult qualified professionals.',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SENDReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentAccess" (
    "id" TEXT NOT NULL,
    "parentEmail" TEXT,
    "parentCode" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "learnerName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "canEdit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "lastAccessedAt" TIMESTAMP(3),

    CONSTRAINT "ParentAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SENDReport_deviceId_reportDate_idx" ON "SENDReport"("deviceId", "reportDate");

-- CreateIndex
CREATE INDEX "SENDReport_deviceId_createdAt_idx" ON "SENDReport"("deviceId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ParentAccess_parentCode_key" ON "ParentAccess"("parentCode");

-- CreateIndex
CREATE INDEX "ParentAccess_parentCode_idx" ON "ParentAccess"("parentCode");

-- CreateIndex
CREATE INDEX "ParentAccess_deviceId_idx" ON "ParentAccess"("deviceId");

-- CreateIndex
CREATE INDEX "ParentAccess_isActive_idx" ON "ParentAccess"("isActive");
```

#### 4. Regenerate Prisma Client


```bash
npx prisma generate
```

This updates the Prisma Client with new model types.

#### 5. Verify Types

Check that TypeScript recognizes new models:

```typescript
// Should work without errors
import { prisma } from '@/lib/db'

const report = await prisma.sENDReport.create({ /* ... */ })
const access = await prisma.parentAccess.create({ /* ... */ })
```

### Production Deployment


#### Option 1: Automatic Migration (Recommended for managed databases)


```bash
cd web
npx prisma migrate deploy
```

This applies pending migrations to production database.

#### Option 2: Manual SQL (For strict production control)

1. Export migration SQL:

```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > migration.sql
```

1. Review SQL carefully
1. Apply manually to production database
1. Mark migration as applied:

```bash
npx prisma migrate resolve --applied MIGRATION_NAME
```

### Rollback (If Needed)

If you need to rollback:

```sql
-- Drop new tables
DROP TABLE IF EXISTS "SENDReport";
DROP TABLE IF EXISTS "ParentAccess";
```

Then remove the migration folder and regenerate client.

---

## Environment Variables

### No New Required Variables ✅


All new features work without additional configuration.

### Optional Variables (For Enhanced Features)

```bash
# AI Provider (optional - system falls back to rules engine)
OPENAI_API_KEY=sk-...
ABACUS_API_KEY=...
```

**Note:** If these are not set, SEND reports use deterministic rules-based analysis instead of AI. The system remains fully functional.

---

## Code Changes Required

### None! ✅


All changes are additive and backward-compatible:

- New API routes don't affect existing routes
- New components are opt-in
- Guest mode unchanged
- Existing features unaffected

### Optional Integrations

If you want to use new features in existing pages:

#### Add Guest Badge to Header

```tsx
// web/components/site-header.tsx
import { GuestBadge } from '@/components/GuestBadge'

export function SiteHeader() {
  return (
    <header>
      {/* existing header content */}
      <GuestBadge compact />
    </header>
  )
}
```

#### Add Guest Account Prompt to Layout

```tsx
// web/app/layout.tsx
import { GuestAccountPrompt } from '@/components/GuestAccountPrompt'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GuestAccountPrompt />
      </body>
    </html>
  )
}
```

#### Add Export Button to Settings

```tsx
// web/app/settings/page.tsx
import { ExportGuestData } from '@/components/ExportGuestData'

export default function SettingsPage() {
  return (
    <div>
      {/* existing settings */}
      <ExportGuestData />
    </div>
  )
}
```

---

## Testing Checklist

### Pre-Migration

- [ ] Backup production database
- [ ] Test migration on staging environment
- [ ] Verify Prisma schema syntax
- [ ] Check for conflicts with existing models

### Post-Migration


- [ ] Verify tables created successfully
- [ ] Check indexes are in place
- [ ] Test new API endpoints
- [ ] Verify TypeScript types work
- [ ] Run existing tests (ensure no regressions)

### Feature Testing


- [ ] Create a SEND report (rules engine)
- [ ] Generate parent access code
- [ ] Test parent view page
- [ ] Verify guest mode still works
- [ ] Test data export
- [ ] Check teacher dashboard

---

## Troubleshooting

### Migration Fails

**Error:** `Table already exists`

**Solution:**

```bash
# Check existing tables
npx prisma db pull

# If tables exist but migration not recorded:
npx prisma migrate resolve --applied MIGRATION_NAME
```

### Prisma Client Out of Sync

**Error:** `Unknown field 'sENDReport'`

**Solution:**

```bash
npx prisma generate
```

### Type Errors After Migration


**Error:** TypeScript doesn't recognize new models

**Solution:**

```bash
# Regenerate client
npx prisma generate

# Restart TypeScript server in your IDE
# VS Code: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

### Database Connection Issues


**Error:** `Can't reach database server`

**Solution:**

- Check `DATABASE_URL` in `.env`
- Verify database is running
- Check network/firewall settings

---

## Verification Commands

### Check Migration Status

```bash
npx prisma migrate status
```

### View Database Schema


```bash
npx prisma db pull
```

### Validate Schema


```bash
npx prisma validate
```

### Generate Client


```bash
npx prisma generate
```

---

## Timeline Estimate

- **Development DB:** 2-5 minutes
- **Staging DB:** 5-10 minutes
- **Production DB:** 10-15 minutes (including verification)

---

## Support

If you encounter issues:

1. Check Prisma logs: `npx prisma migrate status --verbose`
2. Review migration SQL file
3. Verify DATABASE_URL is correct
4. Check database permissions
5. Consult Prisma docs: <https://www.prisma.io/docs/concepts/components/prisma-migrate>

---

**Last Updated:** December 30, 2025

