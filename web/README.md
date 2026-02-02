# NeuroBreath Web Platform

> Evidence-based neurodiversity support platform providing tools for ADHD, autism, anxiety, dyslexia, and related conditions.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Quick Start (5 minutes)](#quick-start-5-minutes)
- [Detailed Setup](#detailed-setup)
- [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Documentation Index](#documentation-index)
- [License & Credits](#license--credits)

---

## Project Overview

**NeuroBreath** is a Next.js-based web application providing evidence-based support tools for neurodivergent individuals, educators, parents, and carers. The platform combines breathing techniques, reading assessments, interactive tools, gamification, and AI-powered assistance to support learning, regulation, and wellbeing.

### Key Capabilities

- **Breathing & Regulation Tools**: Guided breathing exercises (Box, Coherent, 4-7-8, SOS, etc.) with mood tracking and session logging
- **Reading Assessments**: Oral reading fluency (ORF), word lists, pseudoword decoding, comprehension tests, and adaptive placement system (NB-L0 through NB-L8)
- **Neurodiversity Hubs**: Specialized content and tools for autism, ADHD, dyslexia, anxiety, and depression
- **Interactive Tools**: Now/Next builders, sensory detectives, emotion thermometers, transition timers, communication supports
- **Gamification**: XP, levels, streaks, badges, daily quests, and 30-day challenges
- **AI Assistance**:
  - PageBuddy: Context-aware site assistant on every page
  - AI Coach: Evidence-based recommendations with 7-day plans
- **Parent/Teacher Companion**: Read-only progress access via 6-digit codes
- **SEND Reporting**: AI-assisted training recommendations (non-diagnostic)
- **Classroom Features**: Join codes, teacher dashboards, student rostering (in development)

### Evidence Base

All content is grounded in:
- NHS/NICE guidelines
- CDC recommendations
- PubMed peer-reviewed research
- Educational assessment standards (ORF, comprehension rubrics)

---

## Tech Stack

| Area | Technology | Source |
|------|-----------|--------|
| **Framework** | Next.js 15 (App Router) | `package.json` |
| **Language** | TypeScript 5.2.2 | `package.json`, `tsconfig.json` |
| **Styling** | Tailwind CSS 3.3.3 + shadcn/ui (Radix UI) | `tailwind.config.ts`, `components.json` |
| **Database** | PostgreSQL 16 + Prisma 6.7.0 | `compose.yml`, `prisma/schema.prisma` |
| **Authentication** | NextAuth 4.x (Prisma adapter) | `package.json` |
| **State Management** | Zustand 5.x + React Context | `package.json`, `contexts/` |
| **Data Fetching** | SWR 2.x + TanStack Query 5.x | `package.json` |
| **AI Integration** | Abacus.AI API (GPT-4, Claude) | `lib/page-buddy-configs.ts` |
| **File Storage** | AWS S3 (optional, for audio recordings) | `lib/aws-config.ts` |
| **Deployment** | Docker Compose (local dev) | `compose.yml` |
| **Package Manager** | Yarn (workspace standard) | `yarn.lock` |

---

## Architecture Overview

### Folder Structure

```
web/
├── app/                      # Next.js App Router (routes & API)
│   ├── (routes)/             # Page routes
│   │   ├── autism/           # Autism support hub
│   │   ├── adhd/             # ADHD resources
│   │   ├── anxiety/          # Anxiety tools
│   │   ├── breathing/        # Breathing exercises
│   │   ├── conditions/       # Condition-specific pathways
│   │   ├── dyslexia-reading-training/  # Reading assessments
│   │   ├── progress/         # User progress dashboard
│   │   ├── parent/           # Parent companion access
│   │   ├── teacher/          # Teacher dashboard
│   │   └── tools/            # Interactive tools
│   ├── api/                  # API routes (Next.js API handlers)
│   │   ├── ai-coach/         # AI coach recommendations
│   │   ├── api-ai-chat-buddy/ # PageBuddy chat endpoint
│   │   ├── assessment/       # Reading assessment storage
│   │   ├── sessions/         # Breathing session logging
│   │   ├── progress/         # Progress tracking
│   │   ├── badges/           # Badge/achievement unlocks
│   │   ├── challenges/       # Daily quests & challenges
│   │   ├── send-report/      # SEND report generation
│   │   └── upload/           # S3 presigned upload (audio)
│   ├── layout.tsx            # Root layout (header, footer, PageBuddy)
│   └── globals.css           # Global styles
├── components/               # React components (285+ files)
│   ├── ui/                   # shadcn/ui primitives (buttons, dialogs, etc.)
│   ├── page-buddy.tsx        # AI assistant component
│   ├── site-header.tsx       # Global navigation
│   ├── site-footer.tsx       # Global footer
│   ├── blog/                 # AI coach UI components
│   └── ...                   # Feature-specific components
├── lib/                      # Utility functions & configs (82 files)
│   ├── db.ts                 # Prisma client + circuit breaker
│   ├── aws-config.ts         # S3 client config
│   ├── ai-coach/             # AI coach system prompt & resource catalog
│   ├── page-buddy-configs.ts # PageBuddy page-specific configs
│   └── ...                   # Validation, formatting, data helpers
├── hooks/                    # Custom React hooks (17 files)
│   ├── useOnboarding.ts      # Onboarding visibility logic
│   ├── useLocalStorage.ts    # Type-safe localStorage wrapper
│   └── ...                   # Feature-specific hooks
├── contexts/                 # React Context providers
│   ├── BreathingSessionContext.tsx
│   ├── ProgressContext.tsx
│   └── ReadingLevelContext.tsx
├── prisma/                   # Database schema & migrations
│   ├── schema.prisma         # 18 models (Session, Progress, ReadingAttempt, etc.)
│   └── migrations/           # SQL migrations
├── public/                   # Static assets (images, audio, legacy HTML)
├── types/                    # TypeScript type definitions
├── middleware.ts             # Next.js middleware (pathname header injection)
├── docs/                     # Additional documentation
└── compose.yml               # Docker Compose (PostgreSQL 16)
```

### Data Flow

```
Client Request
    ↓
Next.js App Router (app/)
    ↓
API Route (app/api/*/route.ts)
    ↓
Prisma Client (lib/db.ts) ← Circuit breaker for DB failures
    ↓
PostgreSQL (Docker container or remote)
    ↓
Response (JSON or SSR HTML)
```

### Database Schema Highlights

**Core Models** (`prisma/schema.prisma`):
- `Session`: Breathing session logs (technique, duration, breaths, rounds)
- `Progress`: User progress aggregates (total sessions/minutes/breaths, streaks)
- `Badge`, `Challenge`, `DailyQuest`: Gamification system
- `ReadingAttempt`: Assessment session records (ORF, comprehension, placement)
- `ReadingPassage`, `WordList`, `PseudowordList`: Assessment content
- `LessonCatalog`, `LearnerPlacement`: Adaptive learning system (NB-L0→L8)
- `SENDReport`: AI-assisted training recommendations
- `ParentAccess`: Parent companion access codes
- `UserProfile`: Onboarding completion tracking

---

## Quick Start (5 minutes)

**Prerequisites:**
- Docker Desktop running (for PostgreSQL)
- Node.js (version not explicitly specified; Next.js 15 recommends Node 18.17+)
- npm or yarn installed

**Steps:**

1. **Start PostgreSQL database**:
   ```bash
   npm run db:up
   # or: docker compose up -d
   ```

2. **Create environment file**:
   ```bash
   cp config/env.example .env
   ```

3. **Add required API key** to `.env`:
   ```bash
   # Required for PageBuddy AI Assistant
   ABACUSAI_API_KEY=your_api_key_here
   ```

4. **Generate Prisma client and push schema**:
   ```bash
   npm run prisma:generate
   npm run db:push
   ```

5. **Start development server**:
   ```bash
   npm run dev
   # Server starts at http://localhost:3000
   ```

---

## Analytics & Performance

- **Vercel Analytics + Speed Insights** are mounted via the root layout in [app/layout.tsx](app/layout.tsx#L1) and rendered by [components/analytics/VercelWebAnalytics.tsx](components/analytics/VercelWebAnalytics.tsx#L1).
- They are **consent-gated**: both load only when the user has saved consent with `analytics: true` (see `nb_consent` cookie / `nb_consent_prefs` localStorage).

**Verify in production (Vercel):**
- Vercel Dashboard → Project → **Analytics** (Web Analytics)
- Vercel Dashboard → Project → **Speed Insights**

**Verify in-browser:**
- Open DevTools → Application → Cookies/Local Storage and confirm consent has `analytics: true`.
- Open DevTools → Network and look for Vercel analytics/insights requests after a navigation.

6. **Verify setup**:
   - Open `http://localhost:3000`
   - You should see the homepage with navigation
   - PageBuddy (AI assistant) should appear as a floating button

---

## Detailed Setup

### Local Development (Full Steps)

#### 1. Clone Repository
```bash
git clone <repository-url>
cd neurobreath-platform/web
```

#### 2. Install Dependencies
```bash
npm install
# or: yarn install
```

#### 3. Database Setup

**Start PostgreSQL with Docker:**
```bash
npm run db:up
```

This starts PostgreSQL 16 on `localhost:5432` with:
- Database: `neurobreath`
- User: `postgres`
- Password: `postgres`
- Volume: `neurobreath_pgdata` (persistent storage)

**Stop database:**
```bash
npm run db:down
```

**Reset database (⚠️ deletes all data):**
```bash
npm run db:reset
```

**Access database GUI:**
```bash
npm run db:studio
# Opens Prisma Studio at http://localhost:5555
```

#### 4. Environment Configuration

Copy the example file:
```bash
cp config/env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

#### 5. Database Migrations

**Generate Prisma client:**
```bash
npm run prisma:generate
```

**Push schema to database:**
```bash
npm run db:push
```

**Note:** This project uses `prisma db push` (schema sync) rather than `prisma migrate` for development. Production deployments should use migrations.

#### 6. Run Development Server

**Standard start:**
```bash
npm run dev
```

**Clean start (clears Next.js cache):**
```bash
npm run dev:clean
```

**Custom port:**
```bash
npm run dev -- -p 3001
```

#### 7. Verify Installation

- Homepage: `http://localhost:3000`
- Autism Hub: `http://localhost:3000/autism`
- Reading Training: `http://localhost:3000/dyslexia-reading-training`
- Blog/AI Coach: `http://localhost:3000/blog`

---

## Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Required | Default | Purpose | Where Used |
|----------|----------|---------|---------|------------|
| `DATABASE_URL` | ✅ Yes | `postgresql://postgres:postgres@localhost:5432/neurobreath` | PostgreSQL connection string | Prisma client (`lib/db.ts`) |
| `ABACUSAI_API_KEY` | ✅ Yes | — | Abacus.AI API key for PageBuddy & AI Coach | `app/api/api-ai-chat-buddy/route.ts` |
| `NEXT_PUBLIC_SITE_URL` | ✅ Yes (prod) | — | Canonical base URL for SEO + absolute metadata URLs | `lib/seo/site-config.ts` |
| `NEXTAUTH_URL` | ⚠️ Recommended | `http://localhost:3000` | NextAuth base URL | NextAuth config |
| `NEXTAUTH_SECRET` | ⚠️ Recommended | — | NextAuth JWT secret (generate with `openssl rand -base64 32`) | NextAuth config |
| `NHS_API_KEY` | ❌ Optional | — | NHS API key for health data (not required for core features) | Legacy blog scripts |
| `PUBMED_API_KEY` | ❌ Optional | — | NCBI E-utilities API key (higher rate limits for PubMed search) | PubMed integration |
| `PUBMED_EMAIL` | ❌ Optional | — | Contact email for NCBI (optional, for responsible usage) | PubMed integration |
| `AWS_BUCKET_NAME` | ❌ Optional | — | S3 bucket name for audio recording uploads | `lib/aws-config.ts` |
| `AWS_FOLDER_PREFIX` | ❌ Optional | — | S3 folder prefix (e.g., `nbcard/`) | `lib/aws-config.ts` |
| `NEXT_DIST_DIR` | ❌ Optional | `.next` | Custom Next.js build output directory | `next.config.js` |
| `NEXT_OUTPUT_MODE` | ❌ Optional | — | Next.js output mode (`standalone`, etc.) | `next.config.js` |

#### Vercel: Production vs Preview

- **Production**: set `NEXT_PUBLIC_SITE_URL` to your real domain, e.g. `https://neurobreath.co.uk`.
- **Preview deployments**: leave `NEXT_PUBLIC_SITE_URL` unset. Previews will automatically use Vercel-provided `VERCEL_URL` for `metadataBase`/canonical generation. Previews are forced to `noindex` by default to prevent preview domains being indexed.

Notes:
- `VERCEL_ENV` and `VERCEL_URL` are injected automatically by Vercel.
- If you set `NEXT_PUBLIC_SITE_URL` at the project level for all environments, previews will still be `noindex`, but their canonical base will point at production.

API notes:
- `/api/contact` accepts `POST` for contact form submissions. A `GET` request returns a small JSON response for quick health/reachability checks.

### Security Warning

⚠️ **NEVER commit `.env` files to version control.** Use placeholder values in documentation.

To obtain API keys:
- **Abacus.AI**: Sign up at [abacus.ai](https://abacus.ai) → Dashboard → API Keys
- **NHS API**: Register at [developer.api.nhs.uk](https://developer.api.nhs.uk)
- **PubMed/NCBI**: Request key at [ncbi.nlm.nih.gov/account](https://www.ncbi.nlm.nih.gov/account/)
- **AWS S3**: Configure IAM credentials via AWS CLI or environment variables

### Database Configuration

**Default (Docker Compose):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/neurobreath"
```

**Remote Database:**
```env
DATABASE_URL="postgresql://user:password@remote-host:5432/dbname?sslmode=require"
```

**Connection Pool Settings:**
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?connection_limit=10&pool_timeout=20"
```

---

## Usage

### Development Commands

```bash
# Start development server
npm run dev

# Start with clean cache
npm run dev:clean

# Build for production
npm run build

# Start production server (requires build first)
npm run start
```

### Database Commands

```bash
# Start PostgreSQL (Docker)
npm run db:up

# Stop PostgreSQL
npm run db:down

# Reset database (⚠️ destructive)
npm run db:reset

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Open Prisma Studio GUI
npm run db:studio
```

### Code Quality Commands

```bash
# Run ESLint
npm run lint

# Run ESLint with auto-fix
npm run lint:fix

# Run TypeScript type checking
npm run typecheck
```

### Key Routes & Pages

**Public Pages:**
- `/` — Homepage
- `/autism` — Autism support hub (tools, skills, quests, evidence)
- `/adhd` — ADHD resources
- `/anxiety` — Anxiety management tools
- `/breathing` — Breathing exercises overview
- `/dyslexia-reading-training` — Reading assessment system
- `/progress` — User progress dashboard
- `/blog` — AI Coach Q&A interface
- `/contact` — Contact page with social links

**Interactive Tools:**
- `/tools/*` — 24+ interactive tools (emotion thermometer, sensory detective, etc.)
- `/autism/focus-garden` — Focus training game
- `/breathing/*` — Guided breathing sessions

**API Routes:**
- `POST /api/sessions` — Log breathing session
- `POST /api/assessment/save-attempt` — Save reading assessment
- `POST /api/ai-coach` — Get AI recommendations
- `POST /api/api-ai-chat-buddy` — PageBuddy chat
- `GET /api/progress` — Fetch user progress
- `GET /api/badges` — Get unlocked badges
- `GET /api/quests/today` — Get daily quests
- `POST /api/send-report/generate` — Generate SEND report
- `POST /api/parent/auth` — Parent access code authentication

---

## Testing

### Quality Gates (must be green)

Run these from `web/`:

- `yarn lint`
- `yarn typecheck`
- `yarn build`
- `yarn test:e2e` (Playwright: chromium + firefox + webkit)
- `yarn responsive:scan` (screenshots + horizontal overflow detection)
- `yarn links:verify` (route inventory + DOM-discovered links -> HTTP 200/3xx)
- `yarn perf:lighthouse` (Lighthouse mobile + desktop reports)

Outputs:

- `web/reports/responsive/` (screenshots + `responsive-scan.json`)
- `web/reports/links-verification.json`
- `web/reports/lighthouse/` (HTML/JSON + `summary.json`)

Runbook:

- `web/QA_RELIABILITY_CHECKLIST.md`

### Manual Testing Checklist

**Core Flows:**
1. ✅ Homepage loads without errors
2. ✅ Navigate to `/autism` and complete a daily quest
3. ✅ Start a breathing session (e.g., Box Breathing)
4. ✅ Complete a reading assessment (`/dyslexia-reading-training`)
5. ✅ Check progress dashboard shows logged data
6. ✅ Interact with PageBuddy (ask a question)
7. ✅ Test dark mode toggle (header icon)

**Onboarding Flow:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Should see onboarding card (first-time user)
4. Dismiss or create profile → onboarding disappears
5. Refresh → should not reappear

**Database Failure Resilience:**
1. Stop database: `npm run db:down`
2. Trigger API request (e.g., view progress page)
3. Should see graceful error message, not 10s+ hang

### Automated Testing

This repo uses Playwright E2E tests:

- `yarn test:e2e` — default cross-browser suite (chromium + firefox + webkit)
- `yarn test:e2e tests/buddy.spec.ts` — fast, high-signal smoke for Buddy
- `yarn test:e2e tests/responsive.spec.ts` — overflow + Tesla mega-menu regression

Visual regression is intentionally separate to keep baseline management sane:

- `yarn test:visual` — visual suite (dedicated config)
- `yarn test:visual:update` — update snapshots intentionally

See `web/tests/` and `web/playwright.config.visual.ts`.

---

## Deployment

### Local/Staging Deployment

**Using Docker Compose (current setup):**
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

**Environment-specific builds:**
```bash
# Staging
NEXT_PUBLIC_ENV=staging npm run build

# Production
NEXT_PUBLIC_ENV=production npm run build
npm run start
```

### Production Deployment

**TODO:** No CI/CD workflows detected in repository.

Recommended deployment platforms for Next.js 15:
- **Vercel** (recommended for Next.js)
- **AWS Amplify**
- **Docker + AWS ECS/Fargate**
- **Railway** or **Render**

**Pre-deployment checklist:**
1. Set all required environment variables on hosting platform
2. Configure `DATABASE_URL` to production database
3. Run database migrations (if using `prisma migrate`)
4. Set `NODE_ENV=production`
5. Configure health check endpoint
6. Enable HTTPS/SSL
7. Set up database backups
8. Configure logging/monitoring (Sentry, LogRocket, etc.)

**Build command:**
```bash
npm run build
```

**Start command:**
```bash
npm run start
```

**Health check endpoint:**
```bash
curl http://localhost:3000/api/health
# TODO: Implement health check route if not present
```

---

## Contributing

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**:
   ```bash
   npm run dev
   npm run lint
   npm run typecheck
   ```

3. **Commit with clear messages**:
   ```bash
   git add .
   git commit -m "feat: add reading comprehension scoring"
   ```

4. **Push and create pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

- **TypeScript**: Strict mode enabled (`tsconfig.json`)
- **Linting**: ESLint + Prettier (run `npm run lint:fix`)
- **Type Checking**: Required before commits (`npm run typecheck`)
- **Component Structure**: Use functional components with TypeScript
- **Naming Conventions**:
  - Components: PascalCase (`MyComponent.tsx`)
  - Hooks: camelCase starting with `use` (`useMyHook.ts`)
  - API routes: kebab-case folders (`my-route/route.ts`)
  - Utilities: camelCase (`myUtilFunction.ts`)

### Adding New Features

**New Page Route:**
1. Create `app/my-route/page.tsx`
2. Add to navigation in `components/site-header.tsx`
3. Add PageBuddy config in `lib/page-buddy-configs.ts`

**New API Route:**
1. Create `app/api/my-endpoint/route.ts`
2. Export `GET`, `POST`, etc. handlers
3. Add error handling and database circuit breaker checks

**New Database Model:**
1. Add model to `prisma/schema.prisma`
2. Run `npm run prisma:generate`
3. Run `npm run db:push` (dev) or create migration (prod)
4. Update TypeScript types in `types/`

### Documentation Standards

- Update README.md for new environment variables
- Add feature docs to `/docs` folder
- Update CHANGELOG for notable changes (see existing `*_COMPLETE.md` files)
- Include JSDoc comments for complex functions

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Fails

**Symptoms:**
- `P1001: Can't reach database server`
- API routes return 500 errors
- Long delays (10s+) on page loads

**Solutions:**
```bash
# Check Docker is running
docker ps

# Restart database
npm run db:reset

# Verify connection string in .env
echo $DATABASE_URL

# Check database logs
docker compose logs postgres
```

#### 2. Prisma Client Not Generated

**Symptoms:**
- `Cannot find module '@prisma/client'`
- TypeScript errors in `lib/db.ts`

**Solutions:**
```bash
# Regenerate Prisma client
npm run prisma:generate

# Clear Next.js cache and restart
npm run dev:clean
```

#### 3. Environment Variables Not Loading

**Symptoms:**
- `process.env.ABACUSAI_API_KEY` is `undefined`
- Features fail silently

**Solutions:**
```bash
# Verify .env file exists
ls -la .env

# Restart dev server (required after .env changes)
# Stop server (Ctrl+C) and run:
npm run dev

# Check variable is set (in Node.js REPL or API route)
console.log(process.env.ABACUSAI_API_KEY)
```

#### 4. Next.js Build Errors

**Symptoms:**
- `npm run build` fails
- TypeScript errors during build

**Solutions:**
```bash
# Run type checking first
npm run typecheck

# Check for linter errors
npm run lint

# Clear build cache
rm -rf .next
npm run build
```

#### 5. Hydration Mismatch Errors

**Symptoms:**
- Warning in console: "Hydration failed..."
- UI flickers on load

**Solutions:**
- Components reading `localStorage` should use `useEffect` + `useState(false)`
- Check for SSR/client rendering differences
- Use `suppressHydrationWarning` on elements with dynamic content (already applied to `<html>` and `<body>` in `app/layout.tsx`)

#### 6. PageBuddy Not Responding

**Symptoms:**
- Chat interface loads but no responses
- API errors in console

**Solutions:**
```bash
# Verify API key in .env
grep ABACUSAI_API_KEY .env

# Check API route logs
# Open browser DevTools → Network → Look for /api/api-ai-chat-buddy

# Test API key manually
curl -X POST http://localhost:3000/api/api-ai-chat-buddy \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

#### 7. Reading Assessment Not Saving

**Symptoms:**
- Assessment completes but doesn't appear in history
- Progress not updating

**Solutions:**
```bash
# Check database is running
npm run db:studio

# Verify ReadingAttempt table exists
# In Prisma Studio, check for "ReadingAttempt" model

# Check API route in DevTools Network tab
# POST /api/assessment/save-attempt should return 200
```

### Getting Help

If issues persist:
1. Check existing documentation in `/docs` and root `.md` files
2. Search for error messages in project `.md` files (many contain troubleshooting sections)
3. Enable verbose logging:
   ```bash
   DEBUG=* npm run dev
   ```
4. Check browser console and terminal for error stack traces
5. Verify all prerequisites are installed (Node.js, Docker, PostgreSQL client)

---

## Documentation Index

### Core Documentation

- **[QUICK_START.md](./QUICK_START.md)** — Quick onboarding (this file, expanded version)
- **[AI_COACH_QUICK_START.md](./AI_COACH_QUICK_START.md)** — AI Coach feature guide
- **[PAGEBUDDY_INTEGRATION.md](./PAGEBUDDY_INTEGRATION.md)** — PageBuddy AI assistant integration guide
- **[PAGEBUDDY_VISUAL_GUIDE.md](./PAGEBUDDY_VISUAL_GUIDE.md)** — PageBuddy usage & customization

### Feature-Specific Docs

- **[AUTISM_HUB_COMPLETE_REPLACEMENT.md](./AUTISM_HUB_COMPLETE_REPLACEMENT.md)** — Autism hub features & structure
- **[NEUROBREATH_AI_COACH_PERSONALIZED.md](./NEUROBREATH_AI_COACH_PERSONALIZED.md)** — AI Coach technical spec
- **[docs/ONBOARDING_SYSTEM.md](./docs/ONBOARDING_SYSTEM.md)** — Onboarding architecture & rules
- **[docs/ONBOARDING_QUICK_START.md](./docs/ONBOARDING_QUICK_START.md)** — Onboarding testing guide

### Implementation Summaries

- **[BUILD_FIXES_COMPLETE.md](./BUILD_FIXES_COMPLETE.md)** — Build error resolutions
- **[TYPESCRIPT_BUILD_FIX_SUMMARY.md](./TYPESCRIPT_BUILD_FIX_SUMMARY.md)** — TypeScript fixes
- **[API_ERRORS_FIXED.md](./API_ERRORS_FIXED.md)** — API error handling improvements
- **[DATABASE_ERROR_FIX.md](./DATABASE_ERROR_FIX.md)** — Database circuit breaker implementation
- **[ACCESSIBILITY_COMPLETE.md](./ACCESSIBILITY_COMPLETE.md)** — Accessibility improvements
- **[FORM_ACCESSIBILITY_FIXED.md](./FORM_ACCESSIBILITY_FIXED.md)** — Form accessibility enhancements

### Condition-Specific Guides

- **[app/conditions/bipolar/README.md](./app/conditions/bipolar/README.md)** — Bipolar support hub documentation
- **[anxiety_research_2025.md](./anxiety_research_2025.md)** — Anxiety research notes

### Legacy & Migration

- **[LEGACY_IMPORT_MAPPING.md](./LEGACY_IMPORT_MAPPING.md)** — Legacy HTML content migration guide
- **[HEADER_FOOTER_INTEGRATION.md](./HEADER_FOOTER_INTEGRATION.md)** — Global navigation integration

### Visual Assets

- **[public/legacy-assets/assets/brand/brand-sheet.md](./public/legacy-assets/assets/brand/brand-sheet.md)** — Brand guidelines
- **[public/audio/AMBIENCE_SOUNDS_README.md](./public/audio/AMBIENCE_SOUNDS_README.md)** — Audio assets documentation

---

## License & Credits

**License:** TODO (No LICENSE file detected in repository. Recommended: MIT, Apache 2.0, or proprietary license declaration)

**Credits:**
- **Framework:** [Next.js](https://nextjs.org) by Vercel
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://radix-ui.com)
- **Database:** [Prisma](https://prisma.io) + [PostgreSQL](https://postgresql.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [Lucide React](https://lucide.dev)
- **AI:** [Abacus.AI](https://abacus.ai)
- **Evidence Sources:** NHS, NICE, CDC, PubMed/NCBI

**Maintainers:** TODO (Add team/contact information)

---

**Last Updated:** 2025-01-08
**Version:** See package.json
**Repository:** `/Users/akoroma/Documents/GitHub/neurobreath-platform/web`

---

## Notes for Developers

### Circuit Breaker Pattern

The database client (`lib/db.ts`) implements a circuit breaker to prevent cascading failures:
- If database is unreachable, API routes fail fast (return empty state)
- Circuit opens for 30 seconds after connectivity errors
- Prevents 10s+ request timeouts
- Check status: `isDbDown()` function

### PageBuddy Configuration

PageBuddy adapts to each page via `lib/page-buddy-configs.ts`. To add a new page:
```typescript
export const pageBuddyConfigs: PageBuddyConfig[] = [
  {
    pathname: '/my-new-page',
    title: 'My Page',
    description: 'Page description for AI context',
    quickButtons: ['How do I start?', 'What can I do here?'],
    tours: [/* optional guided tour steps */]
  }
];
```

### Prisma Studio Access

For visual database inspection:
```bash
npm run db:studio
# Opens at http://localhost:5555
```

### Vercel Deployment (Recommended)

1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Configure build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
4. Add PostgreSQL database (Vercel Postgres or external)
5. Deploy!

---

**Questions or Issues?** Check the [Documentation Index](#documentation-index) or [Troubleshooting](#troubleshooting) sections above.
