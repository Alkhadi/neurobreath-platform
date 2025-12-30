# @neurobreath/core

**Open-source core utilities for NeuroBreath platform**

Privacy-first, offline-capable learning engine utilities for building educational applications.

## Features

- 🔒 **Privacy-First:** No tracking, no forced authentication
- 📱 **Offline-Ready:** Full functionality without internet
- 🔄 **Sync Utilities:** Conflict resolution and data merging
- 📊 **Progress Tracking:** Session, assessment, and badge management
- 🎯 **Type-Safe:** Full TypeScript support
- 🧩 **Framework-Agnostic:** Works with React, Flutter, vanilla JS

## Installation

```bash
npm install @neurobreath/core
```

## Usage

### Progress Tracking

```typescript
import { GuestProgress, loadGuestProgress, addGuestSession } from '@neurobreath/core'

// Load progress from storage
const progress = loadGuestProgress()

// Add a session
addGuestSession({
  technique: 'box',
  label: 'Box Breathing',
  minutes: 5,
  breaths: 20,
  rounds: 5,
  category: 'calm'
})
```

### Sync Management

```typescript
import { SyncRequest, validateSyncRequest } from '@neurobreath/core'

const request: SyncRequest = {
  deviceId: 'device-123',
  isGuest: true,
  clientData: {
    sessions: [],
    progress: { /* ... */ },
    badges: [],
    assessments: []
  }
}

if (validateSyncRequest(request)) {
  // Send to sync endpoint
}
```

### Storage Utilities

```typescript
import { createStorage } from '@neurobreath/core'

const storage = createStorage('myapp')

// Save data
storage.set('key', { data: 'value' })

// Load data
const data = storage.get('key')
```

## What's Included

### Types
- `GuestProgress` - Guest mode progress schema
- `SyncRequest/Response` - Sync API contracts
- `Session`, `Badge`, `Assessment` - Core data types

### Utilities
- Progress tracking (add sessions, badges, assessments)
- Storage abstraction (localStorage, AsyncStorage compatible)
- Validation helpers
- Conflict resolution

### Offline Support
- Queue management for offline changes
- Merge strategies (last-write-wins, client-wins, server-wins)
- Timestamp-based conflict detection

## What's NOT Included

This core package is **brand-agnostic** and does **not** include:

- ❌ NeuroBreath branding or UI components
- ❌ AI prompts or provider integrations
- ❌ API keys or secrets
- ❌ Server-side code
- ❌ Framework-specific implementations

## Philosophy

1. **Privacy First:** No data leaves the device unless explicitly synced
2. **Offline Capable:** Full functionality without internet
3. **No Lock-In:** Use what you need, extend as you wish
4. **Education Focused:** Built for UK education compliance (GDPR, safeguarding)

## License

MIT - See [LICENSE](./LICENSE) for details

## Contributing

Contributions welcome! This is an open-source project.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

- Documentation: [GitHub Wiki](https://github.com/neurobreath/neurobreath-platform/wiki)
- Issues: [GitHub Issues](https://github.com/neurobreath/neurobreath-platform/issues)

## Related Projects

- [neurobreath-platform](https://github.com/neurobreath/neurobreath-platform) - Full platform (Next.js + Flutter)

---

**Made with ❤️ for learners everywhere**

