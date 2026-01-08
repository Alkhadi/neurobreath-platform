# Flutter Sync API Documentation

## Overview

The NeuroBreath sync API allows Flutter/mobile clients to synchronize data with the server. It supports both **guest mode** (local-only) and **authenticated mode** (server sync).

**Endpoint:** `POST /api/sync`

---

## Authentication

- **Guest Mode:** No authentication required. Data is returned as-is without server writes.
- **Authenticated Mode:** Requires valid device ID associated with an account.

---

## Request Format

### Headers
```
Content-Type: application/json
```

### Body Schema

```typescript
{
  // Client identification
  deviceId: string          // Required: Unique device identifier
  isGuest: boolean          // Required: true for guest mode, false for auth
  
  // Last sync timestamp (optional, for incremental sync)
  lastSyncTimestamp?: string  // ISO 8601 format
  
  // Client data to sync
  clientData: {
    sessions: SyncSession[]
    progress: SyncProgress
    badges: SyncBadge[]
    assessments: SyncAssessment[]
  }
  
  // Client metadata (optional)
  clientVersion?: string
  platform?: "web" | "flutter" | "ios" | "android"
}
```

### Data Types

#### SyncSession
```typescript
{
  id: string                // Unique session ID
  deviceId: string
  technique: string         // e.g., "box", "coherent", "four78"
  label: string
  minutes: number
  breaths: number
  rounds: number
  category?: string         // e.g., "calm", "focus", "sleep"
  completedAt: string       // ISO 8601
  syncedAt?: string         // ISO 8601 (when synced to server)
}
```

#### SyncProgress
```typescript
{
  deviceId: string
  totalSessions: number
  totalMinutes: number
  totalBreaths: number
  currentStreak: number
  longestStreak: number
  lastSessionDate?: string  // YYYY-MM-DD
  updatedAt: string         // ISO 8601
}
```

#### SyncBadge
```typescript
{
  deviceId: string
  badgeKey: string          // e.g., "firstBreath", "weekWarrior"
  badgeName: string
  badgeIcon: string         // Emoji or icon identifier
  unlockedAt: string        // ISO 8601
}
```

#### SyncAssessment
```typescript
{
  id: string
  deviceId: string
  assessmentType: string    // e.g., "fullCheckIn", "orf", "wordList"
  placementLevel?: string   // e.g., "NB-L0" through "NB-L8"
  placementConfidence?: string  // "low", "medium", "high"
  readingProfile?: any      // JSON object with skill scores
  startedAt: string         // ISO 8601
  endedAt?: string          // ISO 8601
}
```

---

## Response Format

### Success Response (200 OK)

```typescript
{
  success: true
  serverTimestamp: string   // ISO 8601
  
  // Merged data (what client should now have)
  merged: {
    sessions: SyncSession[]
    progress: SyncProgress
    badges: SyncBadge[]
    assessments: SyncAssessment[]
  }
  
  // Conflicts detected (if any)
  conflicts?: SyncConflict[]
  
  // Sync metadata
  syncInfo: {
    sessionsAdded: number
    sessionsUpdated: number
    badgesAdded: number
    assessmentsAdded: number
    conflictsResolved: number
  }
  
  // For guest users
  isGuestMode?: boolean
  guestMessage?: string
}
```

### Error Response (4xx/5xx)

```typescript
{
  error: string
  dbUnavailable?: boolean
  dbUnavailableReason?: string
}
```

---

## Behavior by Mode

### Guest Mode (`isGuest: true`)

1. Server does **NOT** write any data to the database
2. Server returns client data as-is in `merged` field
3. Response includes `isGuestMode: true` and `guestMessage`
4. All `syncInfo` counts are 0
5. No conflicts are detected

**Use Case:** User practicing without an account, data stays local.

### Authenticated Mode (`isGuest: false`)

1. Server writes client data to database
2. Server fetches existing data and merges with client data
3. Conflicts are resolved using **last-write-wins** strategy (based on timestamps)
4. Response includes merged data from server
5. `syncInfo` shows how many items were added/updated

**Use Case:** User with account, data syncs across devices.

---

## Conflict Resolution

When the same item exists on both client and server with different data:

- **Strategy:** Last-write-wins (default)
- **Logic:** Compare timestamps (`completedAt`, `updatedAt`)
- **Winner:** Most recent timestamp wins
- **Conflicts Array:** Lists all conflicts detected and how they were resolved

### Conflict Object

```typescript
{
  type: "session" | "progress" | "badge" | "assessment"
  itemId: string
  clientVersion: any
  serverVersion: any
  resolution: "client-wins" | "server-wins" | "merged"
  reason: string
}
```

---

## Example Requests

### Guest Mode Sync

```json
{
  "deviceId": "guest-device-123",
  "isGuest": true,
  "clientData": {
    "sessions": [
      {
        "id": "sess-001",
        "deviceId": "guest-device-123",
        "technique": "box",
        "label": "Box Breathing",
        "minutes": 5,
        "breaths": 20,
        "rounds": 5,
        "category": "calm",
        "completedAt": "2025-12-30T10:00:00Z"
      }
    ],
    "progress": {
      "deviceId": "guest-device-123",
      "totalSessions": 1,
      "totalMinutes": 5,
      "totalBreaths": 20,
      "currentStreak": 1,
      "longestStreak": 1,
      "lastSessionDate": "2025-12-30",
      "updatedAt": "2025-12-30T10:00:00Z"
    },
    "badges": [],
    "assessments": []
  },
  "platform": "flutter"
}
```

### Authenticated Mode Sync

```json
{
  "deviceId": "auth-device-456",
  "isGuest": false,
  "lastSyncTimestamp": "2025-12-29T12:00:00Z",
  "clientData": {
    "sessions": [
      {
        "id": "sess-002",
        "deviceId": "auth-device-456",
        "technique": "coherent",
        "label": "Coherent Breathing",
        "minutes": 10,
        "breaths": 50,
        "rounds": 10,
        "category": "focus",
        "completedAt": "2025-12-30T14:00:00Z"
      }
    ],
    "progress": {
      "deviceId": "auth-device-456",
      "totalSessions": 15,
      "totalMinutes": 120,
      "totalBreaths": 600,
      "currentStreak": 5,
      "longestStreak": 7,
      "lastSessionDate": "2025-12-30",
      "updatedAt": "2025-12-30T14:00:00Z"
    },
    "badges": [
      {
        "deviceId": "auth-device-456",
        "badgeKey": "weekWarrior",
        "badgeName": "Week Warrior",
        "badgeIcon": "🔥",
        "unlockedAt": "2025-12-28T10:00:00Z"
      }
    ],
    "assessments": []
  },
  "platform": "flutter"
}
```

---

## Offline-First Strategy

### Recommended Flow

1. **Local Storage First:** Always save data locally immediately
2. **Background Sync:** Attempt sync in background when online
3. **Conflict Handling:** Accept server's merged response as source of truth
4. **Retry Logic:** Implement exponential backoff for failed syncs
5. **Queue Management:** Queue local changes and sync in batches

### Flutter Implementation Hints

```dart
// Pseudo-code
class SyncService {
  Future<void> syncData() async {
    // 1. Gather local data
    final localData = await _gatherLocalData();
    
    // 2. Build sync request
    final request = {
      'deviceId': await getDeviceId(),
      'isGuest': await isGuestMode(),
      'clientData': localData,
      'lastSyncTimestamp': await getLastSyncTimestamp(),
      'platform': 'flutter',
    };
    
    // 3. Send to server
    final response = await http.post(
      '/api/sync',
      body: jsonEncode(request),
    );
    
    // 4. Handle response
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _updateLocalWithMerged(data['merged']);
      await setLastSyncTimestamp(data['serverTimestamp']);
    }
  }
}
```

---

## Error Handling

### Common Errors

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | Invalid sync request | Request body is malformed |
| 500 | Sync failed | Server error during sync |
| 503 | Database unavailable | Database is down |

### Recommended Actions

- **400:** Validate request schema before sending
- **500:** Retry with exponential backoff
- **503:** Queue for later, show offline mode

---

## Rate Limiting

- No strict rate limits currently
- Recommended: Sync at most once per minute
- Batch multiple changes into single sync request

---

## Security & Privacy

- **Guest Mode:** No data leaves device unless explicitly synced
- **Authenticated Mode:** Data encrypted in transit (HTTPS)
- **No Tracking:** No analytics or tracking in sync process
- **UK Education Compliant:** GDPR and safeguarding standards

---

## Testing

### Test with cURL

```bash
curl -X POST https://your-domain.com/api/sync \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "test-device",
    "isGuest": true,
    "clientData": {
      "sessions": [],
      "progress": {
        "deviceId": "test-device",
        "totalSessions": 0,
        "totalMinutes": 0,
        "totalBreaths": 0,
        "currentStreak": 0,
        "longestStreak": 0,
        "updatedAt": "2025-12-30T10:00:00Z"
      },
      "badges": [],
      "assessments": []
    }
  }'
```

---

## Support

For questions or issues:
- Check `web/lib/sync-schema.ts` for type definitions
- Review `web/app/api/sync/route.ts` for server implementation
- Open an issue on GitHub

---

**Version:** 1.0.0  
**Last Updated:** 2025-12-30

