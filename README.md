# 🫁 NeuroBreath.co.uk

**Evidence-Based Breathing & Learning Tools for Neurodivergent Minds**

[![Next.js](https://img.shields.io/badge/Next.js-14.2.28-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.3-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](./LICENSE)

---

## 🌟 What is NeuroBreath?

NeuroBreath is a comprehensive digital platform providing **scientifically-backed breathing exercises**, **structured literacy interventions**, and **mindfulness tools** specifically designed for individuals with:

- 🧠 **ADHD** — Focus enhancement and attention regulation
- 😰 **Anxiety & Stress** — Nervous system regulation
- 📖 **Dyslexia** — Reading skill development with 28+ interactive tools
- 🧩 **Autism** — Sensory regulation and self-soothing
- 😴 **Sleep Disorders** — Relaxation protocols and sleep hygiene

---

## ✨ Key Features

### 🫁 **Breathing Techniques**
- **4-7-8 Breathing** — Sleep onset and anxiety reduction
- **Box Breathing** — Focus and calmness (Navy SEAL technique)
- **Coherent Breathing** — HRV optimization and emotional regulation
- **SOS Breathing** — Acute stress relief

**Enhanced Features:**
- 🖥️ Fullscreen immersive mode
- 🗣️ Voice coach with text-to-speech
- 🎵 6 ambient soundscapes (rain, ocean, birds, singing bowl, wind chimes)
- ⏱️ Customizable duration (1-10 minutes)
- 🚗 Safety warnings for drivers

### 📚 **Dyslexia Reading Training Hub**
A complete **structured literacy system** with 28+ interactive components:

#### **Phonological Awareness** (5 games)
- Blending & Segmenting Lab
- Rhythm Training Game
- Letter Reversal Training (b/d, p/q)
- Syllable Splitter
- Phonics Sounds Lab

#### **Decoding & Phonics** (8 tools)
- Phonics Player with audio sync
- Word Construction (drag-and-drop)
- Rapid Naming Test (automaticity)
- Morphology Master (prefixes/suffixes/roots)
- Vowel Universe

#### **Fluency Development**
- Fluency Pacer with WPM tracking
- Reading Assessment

#### **Vocabulary & Comprehension**
- Vocabulary Recognition (flashcards)
- Vocabulary Builder

#### **Resources & Support**
- Parent & Educator Guide
- Weekly Progress Tracker
- Phonics Worksheets
- Letter Reversal Practice Sheets
- Achievement Certificates

### 🎮 **Interactive Tools**
- **Breath Ladder** — Progressive breathing challenges
- **Colour Path** — Visual focus training
- **Focus Tiles** — Memory and concentration games
- **Roulette** — Random technique selector

### 🤖 **Reading Buddy Chatbot**
Global floating assistant with:
- 15+ predefined responses
- Guided tour functionality
- Custom query handling
- Text-to-speech support
- Available on all pages

### 📊 **Progress Tracking**
- Session counting and time tracking
- Streak maintenance
- Badge achievements
- Reward cards system
- Mastery indicators

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **Yarn** 1.22+ (package manager)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neurobreath.git
cd neurobreath/nextjs_space

# Install dependencies
yarn install

# Generate Prisma client (if using database)
yarn prisma generate

# Start development server
yarn dev
```

The application will be available at **http://localhost:3000**

### Build for Production

```bash
# Create optimized production build
yarn build

# Start production server
yarn start
```

---

## 📁 Project Structure

```
neurobreath/
├── nextjs_space/              # Main Next.js application
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Global layout with chatbot
│   │   ├── page.tsx           # Homepage
│   │   ├── dyslexia-reading-training/  # Dyslexia hub (137 KB)
│   │   ├── techniques/        # Breathing technique pages
│   │   ├── tools/             # Interactive tools
│   │   ├── progress/          # Progress tracking
│   │   ├── rewards/           # Achievement rewards
│   │   └── api/               # API routes
│   ├── components/            # React components (28+ dyslexia tools)
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom hooks
│   ├── lib/                   # Utilities and types
│   ├── public/                # Static assets
│   ├── prisma/                # Database schema
│   ├── package.json           # Dependencies
│   └── tsconfig.json          # TypeScript config
├── .gitignore                 # Git exclusions (249 lines)
├── PROJECT.md                 # Detailed project documentation
└── README.md                  # This file
```

---

## 🛠️ Tech Stack

### Core Technologies
- **Framework:** Next.js 14.2.28 (App Router)
- **Language:** TypeScript 5.2.2 (strict mode)
- **Styling:** Tailwind CSS 3.3.3
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React hooks
- **Audio:** Web Audio API + HTML5 Audio
- **Storage:** LocalStorage (client-side persistence)
- **Package Manager:** Yarn (default)

### Key Dependencies
- `react` 18.2.0
- `next` 14.2.28
- `typescript` 5.2.2
- `tailwindcss` 3.3.3
- `lucide-react` 0.446.0 (icons)
- `framer-motion` 10.18.0 (animations)
- `sonner` 1.5.0 (toast notifications)

---

## 🎨 Design System

### Color Palette
- **Primary:** Purple/Indigo (`#4F46E5`, `#7C3AED`)
- **Accents:** Cyan (`#06B6D4`), Green (`#10B981`), Blue (`#3B82F6`)
- **Backgrounds:** Soft gradients (`purple-50` to `pink-50`)
- **Text:** High contrast (`gray-900` on white)

### Typography
- **Body Text:** 16px minimum, sans-serif
- **Headings:** 18-32px, font-semibold
- **Worksheets:** Comic Sans MS (child-friendly)

### Spacing
- Generous whitespace for cognitive comfort
- Consistent padding (p-4, p-6, p-8)
- Clear visual grouping with cards

---

## ♿ Accessibility

NeuroBreath follows **WCAG 2.1 AA** standards:

- ✅ **Keyboard Navigation** — All features usable without mouse
- ✅ **Screen Reader Support** — Descriptive ARIA labels
- ✅ **Color Contrast** — Minimum 4.5:1 ratio
- ✅ **Focus Indicators** — Visible focus rings
- ✅ **Text-to-Speech** — Voice coach and reading support
- ✅ **Large Tap Targets** — Minimum 44×44px
- ✅ **Responsive Design** — Mobile, tablet, desktop optimized

---

## 🧪 Testing

### Run Type Checks
```bash
yarn tsc --noEmit
```

### Build Test
```bash
yarn build
```

### Manual Testing Checklist
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] No hydration errors
- [ ] LocalStorage persistence works
- [ ] Audio playback functions
- [ ] All links accessible
- [ ] Mobile responsive
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly

---

## 📊 Performance

### Current Metrics
- **Dyslexia Page:** 137 KB
- **Total First Load JS:** 261 KB
- **Homepage:** 121 KB
- **Build Time:** ~30 seconds
- **Zero Critical Issues** ✅

### Optimization Features
- Static page generation where possible
- Code splitting by route
- Image optimization with Next.js Image
- Lazy loading for heavy components
- Efficient bundle size management

---

## 🔐 Environment Variables

Create a `.env.local` file in the `nextjs_space` directory:

```env
# Add your environment variables here
# Example:
# DATABASE_URL="postgresql://..."
# NEXT_PUBLIC_API_URL="https://api.example.com"
```

**Note:** `.env` files are excluded from Git via `.gitignore`

---

## 📚 Documentation

For detailed project documentation, including:
- Aims and objectives
- Design principles
- Technical standards
- Component guidelines
- Future roadmap

See **[PROJECT.md](./PROJECT.md)**

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   ```bash
   yarn tsc --noEmit
   yarn build
   ```

3. **Commit with descriptive message**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards
- Use TypeScript strict mode
- Follow existing component patterns
- Include accessibility attributes
- Add evidence banners for research-backed features
- Wrap browser APIs in `useEffect`
- Test on mobile devices
- Document complex logic

---

## 📝 License

**Copyright © 2025 NeuroBreath.co.uk**  
All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or modification is prohibited.

---

## 📞 Support

- **Email:** support@neurobreath.co.uk
- **Documentation:** [PROJECT.md](./PROJECT.md)
- **Issues:** [GitHub Issues](https://github.com/yourusername/neurobreath/issues)

---

## 🎯 Current Status

**Version:** 1.0.0  
**Last Updated:** December 23, 2025  
**Status:** ✅ **PRODUCTION READY**

**Recent Achievements:**
- ✅ 28+ dyslexia components completed
- ✅ Enhanced breathing exercises with 6 ambient sounds
- ✅ Global Reading Buddy chatbot
- ✅ Comprehensive progress tracking
- ✅ 5 downloadable resources
- ✅ Zero critical bugs
- ✅ Full accessibility compliance

**Next Milestone:** Phase 2 content expansion (Q1 2026)

---

**Built with ❤️ for neurodivergent learners**
