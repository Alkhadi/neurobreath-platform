# NeuroBreath Web (local dev)

## Quick start (local Postgres)

1. Start Docker Desktop (the `docker` CLI must be able to connect to the Docker daemon).
2. Start Postgres:

```bash
yarn db:up
```

3. Create a local `.env` file (Prisma/Next will read it automatically):

```bash
cp config/env.example .env
```

4. **Add required environment variables** to `.env`:

```bash
# Required for PageBuddy AI Assistant
ABACUSAI_API_KEY=your_api_key_here
```

5. Generate Prisma client + push schema:

```bash
yarn prisma:generate
yarn db:push
```

6. Run the app:

```bash
yarn dev -p 3000
```

## 🤖 PageBuddy - AI Assistant

NeuroBreath now includes **PageBuddy**, a site-wide AI assistant that helps users navigate the platform!

### Features:
- 💬 Context-aware chat on every page
- 🗺️ Guided page tours
- 🔊 Text-to-speech support
- 🎯 Quick question buttons
- 📱 Fully responsive & accessible

### Documentation:
- 📖 [Complete Integration Guide](./PAGEBUDDY_INTEGRATION.md)
- 🎨 [Visual Guide & Usage](./PAGEBUDDY_VISUAL_GUIDE.md)

### Configuration:
PageBuddy automatically adapts to each page based on configs in:
- `lib/page-buddy-configs.ts` - Add/edit page-specific content
- `components/page-buddy.tsx` - Main component
- `app/api/api-ai-chat-buddy/route.ts` - API endpoint

## Notes

- If the database is down/unreachable, the API routes now **fail fast** and return a safe "empty state" response (instead of stalling for ~10s and returning repeated 500s).
- PageBuddy is integrated in the root layout and appears on **all pages** automatically.
- All PageBuddy data is processed server-side for privacy and security.

