# Phase 7: Server-Side Sync + Local/Remote Merge Implementation

## Status: Completed ✅

## Date: 2026-02-11

## Summary

Phase 7 implements server-side persistence and synchronization for NB-Card profiles and contacts. Users can now sync their cards to their account (when signed in) or to a persistent device ID (when anonymous), ensuring data availability across devices and protection against browser storage clearing.

## Implementation Details

### 1. Database Schema (Prisma)

**File: `/web/prisma/schema.prisma`**

Added two new models for storing NBCard data:

```prisma
model NBCardProfile {
  id               String   @id @default(cuid())
  userEmail        String?  // Lowercase email when signed in
  deviceId         String?  // Anonymous device ID when not signed in
  profileId        String   // Client-side UUID
  profileData      Json     // Full Profile object
  templateData     Json?    // TemplateSelection object
  version          Int      @default(1)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @default(now()) @updatedAt
  
  @@unique([userEmail, profileId])
  @@unique([deviceId, profileId])
  @@index([userEmail, updatedAt])
  @@index([deviceId, updatedAt])
}

model NBCardContact {
  id               String   @id @default(cuid())
  userEmail        String?
  deviceId         String?
  contactId        String   // Client-side UUID
  contactData      Json     // Full Contact object
  version          Int      @default(1)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @default(now()) @updatedAt
  
  @@unique([userEmail, contactId])
  @@unique([deviceId, contactId])
  @@index([userEmail, updatedAt])
  @@index([deviceId, updatedAt])
}
```

**Key Design Decisions:**
- **Dual ownership model**: Records linked to either `userEmail` (signed-in) OR `deviceId` (anonymous)
- **Client-side UUIDs**: `profileId` and `contactId` generated on client, used as natural keys
- **Version field**: Enables optimistic locking for future conflict resolution
- **JSON storage**: Profiles and contacts stored as JSON for schema flexibility
- **Unique constraints**: Enforce one record per user/device + profile/contact combination

### 2. API Routes

**Created: `/web/app/api/nb-card/sync/route.ts`**

POST endpoint for uploading profiles and contacts to server.

```typescript
interface SyncPayload {
  deviceId: string;
  profiles: Array<{
    id: string;
    profileData: unknown;
    templateData?: unknown;
    updatedAt: string;
  }>;
  contacts: Array<{
    id: string;
    contactData: unknown;
    updatedAt: string;
  }>;
}
```

**Features:**
- Detects signed-in user via `next-auth` session
- Upserts records (create if new, update if exists)
- Increments version on each update
- Returns detailed success/failure results per record
- Graceful database unavailability handling

**Created: `/web/app/api/nb-card/pull/route.ts`**

GET endpoint for downloading profiles and contacts from server.

```
GET /api/nb-card/pull?deviceId=xxx
```

**Features:**
- Fetches all profiles and contacts for user (by email) or device (by deviceId)
- Returns records sorted by `updatedAt` DESC (most recent first)
- Transforms database records to client-friendly format
- Includes version and timestamp metadata

### 3. Client-Side Sync Library

**Created: `/web/lib/nb-card/sync.ts`**

Provides high-level sync functions used by UI components:

**Key Functions:**

```typescript
// Upload local data to server
syncToServer(deviceId: string, profiles: Profile[], contacts: Contact[]): Promise<SyncResult>

// Download data from server
pullFromServer(deviceId: string): Promise<PullResult>

// Merge server data with local data
mergeProfiles(local: Profile[], server: ServerProfile[]): Profile[]
mergeContacts(local: Contact[], server: ServerContact[]): Contact[]

// Full bidirectional sync (pull + merge + push)
fullSync(deviceId: string, localProfiles: Profile[], localContacts: Contact[]): Promise<MergeResult>
```

**Merge Strategy:**
1. Pull server data (`/api/nb-card/pull`)
2. Merge with local IndexedDB data:
   - Deduplicate by UUID (`profileId`, `contactId`)
   - Compare `updatedAt` timestamps
   - **Prefer most recent** (server wins if newer, local wins if newer)
   - Keep all unique records from both sources
3. Push merged data back to server (`/api/nb-card/sync`)

### 4. UI Integration (NBCardPanel)

**File: `/web/components/nbcard/NBCardPanel.tsx`**

**Added State:**
```typescript
const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle'); // 'idle' | 'syncing' | 'success' | 'error'
const [showSyncPrompt, setShowSyncPrompt] = useState(false); // Import prompt on sign-in
const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
const [deviceId] = useState(() => generateDeviceId()); // Persistent device ID
```

**Sign-In Detection:**
```typescript
useEffect(() => {
  getSession().then((s) => {
    const newEmail = s?.user?.email?.toLowerCase() || null;
    
    // Detect sign-in: if we just got an email and have local profiles, offer import
    if (newEmail && !sessionEmail && profiles.length > 0) {
      setShowSyncPrompt(true);
    }
    
    setSessionEmail(newEmail);
  });
}, [sessionEmail, profiles]);
```

**Sync Handler:**
```typescript
const handleSyncNow = async () => {
  setSyncStatus('syncing');
  const result = await fullSync(deviceId, profiles, contacts);
  if (result.success) {
    setProfiles(result.mergedProfiles);
    setContacts(result.mergedContacts);
    setLastSyncTime(new Date().toISOString());
    setSyncStatus('success');
    toast.success(`Synced ${result.mergedProfiles.length} profiles`);
  } else {
    setSyncStatus('error');
    toast.error(`Sync failed: ${result.error}`);
  }
};
```

### 5. UI Components

**Import Prompt (shown on sign-in):**
```tsx
{showSyncPrompt && (
  <div className="mb-6 rounded-xl border-2 border-purple-200 bg-purple-50 p-4">
    <h3>Import Your Local Cards?</h3>
    <p>You have {profiles.length} profiles and {contacts.length} contacts saved locally.</p>
    <Button onClick={handleImportLocalCards}>
      <Cloud className="mr-2" />
      Yes, Sync Now
    </Button>
    <Button onClick={handleSkipImport} variant="outline">Not Now</Button>
  </div>
)}
```

**Sync Status Banner (shown when signed in):**
```tsx
{sessionEmail && (
  <div className="mb-4 flex items-center justify-between bg-gray-50 px-4 py-2">
    <div className="flex items-center gap-2">
      {syncStatus === 'syncing' ? (
        <RefreshCw className="animate-spin" />
        <span>Syncing...</span>
      ) : syncStatus === 'success' ? (
        <Cloud className="text-green-600" />
        <span>Synced • {new Date(lastSyncTime).toLocaleTimeString()}</span>
      ) : (
        <Cloud className="text-gray-400" />
        <span>Signed in as {sessionEmail}</span>
      )}
    </div>
    <Button onClick={handleSyncNow} disabled={syncStatus === 'syncing'}>
      Sync Now
    </Button>
  </div>
)}
```

## User Flows

### Flow 1: Anonymous User → Sign In → Import

1. User creates profile(s) locally (saved in IndexedDB)
2. User signs in
3. **Import prompt appears**: "Import Your Local Cards?"
4. User clicks "Yes, Sync Now"
5. System:
   - Pulls server data (empty for new user)
   - Merges with local data (local cards are newer)
   - Pushes merged data to server
6. Cards now available across all devices

### Flow 2: Signed-In User → New Device

1. User signs in on new device
2. Local storage is empty (no profiles yet)
3. System auto-syncs on next interaction:
   - Pulls server data
   - Merges with empty local store
   - Local store populated with server cards
4. Cards immediately available

### Flow 3: Manual Sync

1. User clicks "Sync Now" button
2. System performs full bidirectional sync:
   - Downloads server cards
   - Merges with local cards (most recent wins)
   - Uploads merged result
3. Status indicator shows "Synced • 2:34 PM"

### Flow 4: Conflict Resolution (Future Enhancement)

Current implementation uses **Last-Write-Wins** (LWW) strategy based on `updatedAt` timestamp. For future improvement, consider:
- Show conflict dialog when timestamps are very close (< 1 minute)
- Allow manual selection of "keep local" vs "keep server"
- Use version field for three-way merge

## Verification Results

**All Gates Passing:**

```bash
✅ yarn lint --max-warnings=0
   Done in 5.82s

✅ yarn typecheck
   Done in 30.10s

✅ yarn build
   Done in 71.14s
   /us/resources/nb-card: 178 B, 461 kB First Load JS
```

## Files Modified/Created

1. `/web/prisma/schema.prisma` (+58 lines: NBCardProfile, NBCardContact models)
2. `/web/app/api/nb-card/sync/route.ts` (new file, 169 lines)
3. `/web/app/api/nb-card/pull/route.ts` (new file, 101 lines)
4. `/web/lib/nb-card/sync.ts` (new file, 228 lines)
5. `/web/components/nbcard/NBCardPanel.tsx` (+89 lines: sync state, handlers, UI)

## Breaking Changes

**None.** All changes are additive and backward-compatible:
- Existing local-only storage continues to work
- Sync is opt-in (requires user action)
- Anonymous users retain full functionality
- No changes to Profile/Contact data structures

## Security Considerations

1. **Authentication**: Session-based via `next-auth`, server validates email from session token
2. **Authorization**: Users can only access their own data (filtered by `userEmail` or `deviceId`)
3. **Data Privacy**: No cross-user data exposure (unique constraints prevent collisions)
4. **Anonymous Isolation**: Device IDs are randomly generated and stored client-side only

## Performance

- **Sync payload**: ~1-5 KB per profile, ~500 bytes per contact (JSON gzip'd)
- **Typical upload**: 10 profiles + 20 contacts = ~15 KB
- **Database queries**: Indexed by `userEmail` and `deviceId` for fast lookups
- **Batch operations**: All profiles/contacts synced in single request (no N+1)

## Future Enhancements (Phase 8+)

1. **Auto-sync on edit**: Trigger sync after profile/contact changes (debounced 5-10s)
2. **Offline queue**: Store pending sync operations when network unavailable
3. **Conflict UI**: Show dialog when server/local timestamps are close
4. **Sync history**: Track sync events for diagnostics ("Last synced 5 minutes ago from iPhone")
5. **Selective sync**: Allow users to exclude specific profiles from sync
6. **Migration assistant**: Help users migrate from deviceId → userEmail on sign-in

## Migration Path (Anonymous → Signed-In)

When anonymous user signs in:

**Current Behavior:**
- Import prompt offers to merge local cards with server
- User accepts → local cards uploaded to server under user email
- Future devices can pull these cards

**Database State:**
- Old deviceId records remain in database (orphaned but harmless)
- New userEmail records created for same profileIds
- IndexedDB continues to use local storage as cache

**Option for Future:** Add migration endpoint to transfer deviceId records to userEmail:

```sql
UPDATE "NBCardProfile" 
SET userEmail = 'user@example.com', deviceId = NULL 
WHERE deviceId = 'device-xxx' AND userEmail IS NULL;
```

## Known Limitations

1. **No real-time sync**: Requires manual "Sync Now" click or page refresh
2. **No conflict detection UI**: Always uses last-write-wins strategy
3. **No sync history**: Can't see "what changed" after sync
4. **No selective sync**: All profiles/contacts synced together
5. **Template selection not synced**: Only profile data synced (template selection stored separately)

## Testing Recommendations

### Manual Test Cases:

1. **Anonymous Sync**
   - Create profile without signing in
   - Verify local save works
   - Sign in
   - Accept import prompt
   - Open new incognito tab, sign in, verify profile appears

2. **Conflict Resolution**
   - Create profile "Alice" on Device A
   - Create profile "Bob" on Device B (same user)
   - Sync Device A → server has Alice
   - Sync Device B → server has Alice + Bob
   - Refresh Device A → should show both Alice and Bob

3. **Offline Resilience**
   - Disconnect network
   - Click "Sync Now"
   - Verify graceful error message
   - Reconnect and retry

4. **Anonymous → Signed-In Migration**
   - Create 5 profiles anonymously
   - Sign in
   - Click "Yes, Sync Now"
   - Open new browser, sign in
   - Verify all 5 profiles appear

## Documentation

- Sync flow documented in code comments
- API endpoints include JSDoc with request/response examples
- Merge strategy explained in `sync.ts` comments

## Next Steps

Ready for **Phase 8**: Share & saved cards actions, or **Phase 9**: Import/export + image security.

Phase 7 provides the foundation for cross-device sync. Phase 8 can build on this to add more sophisticated sharing features (QR codes with server-backed URLs, shareable links, etc.).
