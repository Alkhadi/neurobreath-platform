# NeuroBreath Platform

NeuroBreath is a neurodiversity support platform focused on evidence-informed breathing tools, learning/reading supports, and practical resources for ADHD, autism, anxiety, dyslexia, and related needs.

This repository is a monorepo. The Next.js app lives in `web/`.

## 1) Executive Summary

NeuroBreath provides structured, sensory-aware tools (breathing exercises, progress tracking, printables) and an on-page assistant (PageBuddy) to help users navigate content and adopt strategies.

It exists to make high-quality, evidence-informed support accessible, consistent, and easy to use for neurodivergent individuals as well as parents, teachers, and carers.

## 2) Architecture Overview

High-level request flow:

```text
Browser
    └─ Next.js App Router (web/app)
             ├─ Server Components (SSR/SSG)
             ├─ Client Components (interactive UI)
             └─ API Routes (web/app/api/*/route.ts)
                         └─ Prisma (web/lib/db.ts)
                                     └─ PostgreSQL (local Docker or hosted)
```

Key modules:

- `web/app/`: routes and API handlers
- `web/components/`: UI components (PageBuddy lives here)
- `web/lib/`: shared utilities (SEO config, db client, AI config)
- `web/prisma/`: schema and migrations
- `web/tests/`: Playwright E2E

## 3) Setup Guide

### Prerequisites

- Node.js 20 LTS recommended
- Yarn classic (v1)
- Docker (optional, for local Postgres)

### Install

```bash
cd web
yarn install
```

### Configure

```bash
cd web
cp .env.example .env
```

Set required variables in `.env` (see Configuration).

### Run

```bash
cd web
yarn dev
```

Open: http://localhost:3000

## 4) Usage Guide

### Common commands

```bash
cd web
yarn dev
yarn lint
yarn typecheck
yarn build
```

### Example API request

Health check:

```bash
curl -s http://localhost:3000/api/healthz | jq
```

Contact form endpoint (Turnstile + Resend):

```bash
curl -X POST http://localhost:3000/api/contact \
    -H 'Content-Type: application/json' \
    -d '{"name":"Test","email":"test@example.com","message":"Hello","token":"TURNSTILE_TOKEN"}'
```

## 5) Configuration

Environment variables are defined in `web/.env.example` (names only, no values).

| Variable | Required | Used for |
|---|---:|---|
| `DATABASE_URL` | Yes | Prisma/Postgres |
| `NEXT_PUBLIC_SITE_URL` | Recommended | SEO canonical fallback |
| `ABACUSAI_API_KEY` | Optional | PageBuddy + AI Coach API routes |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Contact form client |
| `TURNSTILE_SECRET_KEY` | Optional | Contact form server |
| `RESEND_API_KEY` | Optional | Contact email sending |

Secrets handling:

- Never commit `.env` files.
- API routes must validate env vars *inside* handlers (no throw on import).

## 6) Testing

Playwright E2E:

```bash
cd web
yarn test:e2e
yarn test:e2e tests/buddy.spec.ts
```

Testing expectations:

- Buddy/UI/API changes must at least run `tests/buddy.spec.ts`.

## 7) Deployment

CI gates for PRs are enforced in `.github/workflows/ci-gates.yml`:

- `yarn lint`
- `yarn typecheck`
- `yarn build`
- `yarn test:e2e tests/buddy.spec.ts`

Production deployment is handled by the repository’s existing workflows and hosting configuration.

## 8) Contributing Guide

- Work in `web/`.
- Before pushing, run:

```bash
cd web
yarn lint
yarn typecheck
yarn build
```

PRs must follow `.github/pull_request_template.md`.

## 9) FAQ & Troubleshooting

### Build fails due to missing env vars

- Ensure API routes do not instantiate SDK clients at module scope.
- Ensure `.env.example` includes new env var names.

### Prisma issues

- Prisma client is centralized at `web/lib/db.ts`.
- Confirm `DATABASE_URL` is set for runtime DB access.

## 10) License and Credits

License: see repository license files (if present).

Credits:

- Next.js, React, TypeScript
- Prisma + PostgreSQL
- Playwright

---

## 🧪 Testing

```bash
cd web
yarn lint           # ESLint checks
yarn type-check     # TypeScript validation
```

---

## 📚 Documentation

- **[Product Specification](./docs/neurobreath-product-spec.md)**: Complete feature roadmap, aims, and objectives
- **[Technical Decisions](./docs/decisions.md)**: Architecture decisions, technology choices, design patterns
- **[Project Files](./PROJECT.md)**: Original project vision and requirements (legacy)
- **[Implementation Summary](./IMPLEMENTATION_SUMMARY.md)**: Technical changelog of all implementations

---

## 🔐 Environment Variables

Create a `.env` file in `/web/` directory (never commit this file!):

```env
# Copy from .env.example and fill in your values
NEXT_PUBLIC_SITE_URL=https://www.neurobreath.co.uk
DATABASE_URL=your_database_url_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```

See `.env.example` for full list of required variables.

---

## 🛠️ Technology Stack

### **Frontend**

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2
- **Styling**: Tailwind CSS 3.3 + CSS Modules
- **UI Components**: Radix UI (Accessible primitives)
- **Icons**: Lucide React
- **Animations**: Framer Motion

### **Audio & Voice**

- **Voice Guidance**: Web Speech API (TTS) + Pre-recorded MP3s
- **Ambient Sounds**: Web Audio API (7 procedural generators)
- **Speech Recognition**: Web Speech API (STT)

### **Deployment**

- **Hosting**: Cloudflare Pages + Workers
- **CDN**: Cloudflare global network
- **Domain**: <www.neurobreath.co.uk> (canonical)

### **Future Stack**

- **Mobile**: Flutter (iOS/Android)
- **Backend**: Cloudflare Workers + D1 Database
- **Auth**: NextAuth.js (email/password)

---

## 📊 Project Stats

- **Pages**: 52 routes across 7 categories
- **Components**: 77 React components (27 dyslexia-specific)
- **Audio Files**: 8 professional voice guidance tracks
- **Bundle Size**: 140 kB homepage, 119 kB technique pages
- **Accessibility**: WCAG 2.1 Level AA compliant
- **Performance**: Lighthouse 95+ scores

---

## 🤝 Contributing

This project follows a neurodiversity-affirming development philosophy:

1. **Accessibility First**: WCAG 2.1 Level AA minimum
2. **Sensory Safety**: Low-stimulation design, no flashing animations
3. **Clear Language**: Plain English, avoid jargon
4. **Progressive Enhancement**: Core features work without JavaScript
5. **Privacy-Focused**: No tracking, LocalStorage only for user benefit

### **Development Guidelines**

- Use **descriptive commit messages** (Conventional Commits format)
- Test on **real devices** (not just dev tools responsive mode)
- Verify **screen reader compatibility** (NVDA/VoiceOver)
- Follow **existing component patterns** for consistency
- Document **new features** in `/docs/decisions.md`

---

## 📝 License

**Proprietary** — All rights reserved. This codebase is private and not open-source.

---

## 📞 Contact

- **Website**: [www.neurobreath.co.uk](https://www.neurobreath.co.uk)
- **Support**: <support@neurobreath.co.uk>
- **Social**: Twitter [@NeuroBreath](https://twitter.com/NeuroBreath)

---

## 🗺️ Roadmap

### **Phase 1: MVP** ✅ Complete (Dec 2024)

- [x] Core breathing techniques (Box, 4-7-8, Coherent, SOS)
- [x] Dyslexia reading training (28+ tools)
- [x] ADHD Deep Dive resources
- [x] Voice guidance + ambient sounds
- [x] Progress tracking + gamification

### **Phase 2: Polish** 🚧 In Progress (Q1 2025)

- [ ] Shop integration (Neurogum-style layout)
- [ ] "Inside the Neurodivergent Brain" research deck
- [ ] Enhanced progress dashboard
- [ ] Social sharing improvements
- [ ] Performance optimizations

### **Phase 3: Scale** 🔮 Planned (Q2 2025)

- [ ] Flutter mobile app (iOS/Android)
- [ ] Cloudflare Workers backend
- [ ] User accounts + authentication
- [ ] Data synchronization across devices
- [ ] Offline mode support

### **Phase 4: Community** 🔮 Planned (Q3 2025)

- [ ] Teacher dashboard
- [ ] Parent/carer resources
- [ ] School integration tools
- [ ] AI coaching system
- [ ] Blog + Q&A platform

---

## 🙏 Acknowledgments

- **Audio Narration**: Professional British voice recordings (Dorothy)
- **Design Inspiration**: Neurodiversity community feedback
- **Research**: NHS mental health guidelines, dyslexia best practices
- **Icons**: Lucide icon library
- **Hosting**: Cloudflare Pages

---

## Built with ❤️ for the neurodivergent community
