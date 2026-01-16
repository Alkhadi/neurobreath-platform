# NeuroBreath Platform

## A neurodiversity-affirming breathing & mindfulness platform for neurodivergent individuals

🌐 **Live Site**: [www.neurobreath.co.uk](https://www.neurobreath.co.uk)  
📦 **Repository**: `neurobreath-platform` (monorepo)  
🚀 **Deployment**: Cloudflare Pages (Next.js SSR via Workers)

---

## 📋 Project Overview

NeuroBreath provides **evidence-based breathing techniques, dyslexia reading training, and ADHD/autism support tools** through an accessible, sensory-safe web platform. Built with neurodivergent users at the center—featuring low-stimulation design, voice guidance, progress tracking, and gamification.

### **Core Features**

- ✅ **Breathing Techniques**: Box, 4-7-8, Coherent (5-5), SOS 60s Reset
- ✅ **Dyslexia Reading Training**: 28+ interactive tools (Phonics Lab, Vowel Universe, Fluency Pacer, etc.)
- ✅ **ADHD Deep Dive**: Assessment guides, school support, teen strategies
- ✅ **Playful Breathing Lab**: Breath Ladder, Colour-Path, Focus Tiles, Roulette
- ✅ **Voice Guidance**: Pre-recorded audio + TTS with 7 ambient sounds (rain, ocean, forest, etc.)
- ✅ **Progress Tracking**: LocalStorage-based session history, badges, streak tracking

---

## 🗂️ Monorepo Structure

```text
neurobreath-platform/
├── README.md                    # This file
├── .gitignore                   # Production-grade ignore rules
├── .env.example                 # Environment variables template
├── docs/                        # Documentation
│   ├── neurobreath-product-spec.md
│   └── decisions.md
├── web/                         # ✅ Next.js 14 web application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
│   ├── hooks/                   # Custom hooks
│   ├── public/                  # Static assets (audio, images)
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
├── shared/                      # 🔮 Future: Shared data/design tokens
│   ├── data/                    # JSON data (plants, decks, etc.)
│   ├── design/                  # Design tokens (colors, spacing)
│   └── assets/                  # Shared icons, images
├── serverless/                  # 🔮 Future: Cloudflare Workers/Pages Functions
│   └── worker/                  # API proxy layer
├── flutter_app/                 # 🔮 Future: Mobile app (iOS/Android)
└── .github/                     # 🔮 Future: CI/CD workflows
    └── workflows/
        └── ci.yml
```

---

## 🚀 Quick Start (Development)

### **Prerequisites**

- Node.js 18+ (LTS recommended)
- Yarn 1.22+ (project uses Yarn as package manager)

### **Local Development**

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/neurobreath-platform.git
cd neurobreath-platform

# Navigate to web app
cd web

# Install dependencies
yarn install

# Generate Prisma client (if using database)
yarn prisma generate

# Start development server
yarn dev
```

👉 **Open**: [http://localhost:3000](http://localhost:3000)

---

## 📦 Build & Deploy

### **Production Build**

```bash
cd web
yarn build          # Creates .next/ production bundle
yarn start          # Serves production build locally
```

### **Cloudflare Pages Deployment**

#### **Option 1: Direct Git Integration**

1. Push to GitHub: `git push origin main`
2. Connect repository in [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Configure build settings:
   - **Build command**: `cd web && yarn install && yarn build`
   - **Build output directory**: `web/.next`
   - **Root directory**: `/` (monorepo root)
4. Set custom domain: `www.neurobreath.co.uk`
5. Add redirect: `neurobreath.co.uk` → `www.neurobreath.co.uk`

#### **Option 2: Wrangler CLI**

```bash
cd web
npx wrangler pages deploy .next --project-name=neurobreath
```

> **⚠️ Important**: Next.js SSR features require Cloudflare Workers deployment (not static Pages). Use `@cloudflare/next-on-pages` adapter for full SSR support.

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
