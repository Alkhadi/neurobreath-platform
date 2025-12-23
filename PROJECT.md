# NeuroBreath.co.uk — Project Documentation

**Version:** 1.0.0  
**Last Updated:** December 23, 2025  
**Project Status:** Active Development  

---

## 🎯 Project Mission

NeuroBreath.co.uk is a comprehensive digital platform providing evidence-based breathing exercises, mindfulness tools, and specialized learning interventions for neurodivergent individuals, with a particular focus on:
- **ADHD** — Attention regulation and focus enhancement
- **Anxiety & Stress** — Nervous system regulation and emotional well-being
- **Dyslexia** — Structured literacy and reading skill development
- **Autism** — Sensory regulation and self-soothing techniques
- **Sleep** — Sleep hygiene and relaxation protocols

---

## 🌟 Core Aims

### 1. **Accessibility First**
- Ensure all features are usable by individuals with diverse learning needs and abilities
- Maintain WCAG 2.1 AA compliance across all pages
- Provide multiple modalities of interaction (visual, auditory, kinesthetic)
- Support screen readers, keyboard navigation, and assistive technologies

### 2. **Evidence-Based Practice**
- Ground all interventions in peer-reviewed research and clinical guidelines
- Cite authoritative sources (IDA, Harvard, NHS, Yale, etc.)
- Provide transparent explanations of why each technique works
- Update content based on latest scientific findings

### 3. **Neurodivergent-Centered Design**
- Design for focus, reduced cognitive load, and sensory comfort
- Avoid overwhelming interfaces with excessive stimuli
- Provide clear visual hierarchies and predictable navigation
- Offer customization options (ambient sounds, voice coach, time settings)

### 4. **Practical & Actionable**
- Provide immediately usable tools and exercises
- Break complex skills into manageable steps
- Track progress to maintain motivation
- Offer downloadable resources for offline use

### 5. **Inclusive & Stigma-Free**
- Use person-first and identity-first language respectfully
- Celebrate neurodiversity as natural human variation
- Avoid deficit-focused framing
- Provide tools for all ages and skill levels

---

## 🎨 Design Principles

### Visual Design
- **Color Palette:**
  - Primary: Purple/Indigo (#4F46E5, #7C3AED) — Calming and focused
  - Accent: Cyan (#06B6D4), Green (#10B981), Blue (#3B82F6)
  - Backgrounds: Soft gradients (purple-50 to pink-50, blue-50 to cyan-50)
  - Text: High contrast (gray-900 on white, white on dark)
- **Typography:**
  - Sans-serif fonts for readability (system fonts: Arial, Helvetica)
  - Comic Sans MS for child-friendly worksheets
  - Minimum 16px body text, 18-24px headings
- **Spacing:**
  - Generous whitespace to reduce cognitive load
  - Consistent padding (p-4, p-6, p-8)
  - Clear visual grouping with cards and sections
- **Icons & Emojis:**
  - Use emojis for visual interest and quick recognition (🫁 lungs, 📚 books, 🎵 music)
  - Lucide icons for UI controls (consistent 24px size)

### User Experience
- **Navigation:**
  - Sticky header with clear menu structure
  - Conditions menu (ADHD, Anxiety, Dyslexia, Autism, Sleep, Stress)
  - Breathing techniques menu (4-7-8, Box, Coherent, SOS)
  - Tools menu (Breath Ladder, Colour Path, Focus Tiles, Roulette)
- **Interaction Patterns:**
  - Large tap targets (minimum 44×44px)
  - Immediate visual feedback on all interactions
  - Toast notifications for actions (downloads, completions)
  - Confetti celebrations for milestones
- **Progress Tracking:**
  - LocalStorage for client-side persistence
  - Visual progress bars and percentage displays
  - Streak tracking and achievement badges
  - Mastery indicators for completed skills

### Technical Standards
- **Framework:** Next.js 14.2.28 (App Router)
- **Language:** TypeScript with strict mode
- **Styling:** Tailwind CSS with custom utilities
- **UI Components:** Radix UI primitives + shadcn/ui
- **State Management:** React hooks (useState, useEffect, useRef)
- **Audio:** Web Audio API for synthesis, HTML5 Audio for playback
- **Storage:** LocalStorage for client-side persistence
- **Package Manager:** Yarn (default and only)

---

## 📚 Objectives by Focus Area

### Dyslexia Reading Training
**Primary Goal:** Provide a comprehensive structured literacy hub covering all 6 elements (Phonology, Sound-Symbol, Syllable, Morphology, Syntax, Semantics)

**Objectives:**
1. **Phonological Awareness** (3+ games)
   - Blending & Segmenting Lab ✅
   - Rhythm Training Game ✅
   - Letter Reversal Training ✅
   - Syllable Splitter ✅
   - Phonics Sounds Lab ✅

2. **Decoding & Word Recognition** (8+ tools)
   - Phonics Player ✅
   - Word Construction (drag-and-drop) ✅
   - Rapid Naming Test ✅
   - Morphology Master ✅
   - Vowel Universe ✅

3. **Fluency Development** (2+ tools)
   - Fluency Pacer with WPM tracking ✅
   - Reading Assessment ✅

4. **Vocabulary & Comprehension** (2+ tools)
   - Vocabulary Recognition (flashcards) ✅
   - Vocabulary Builder ✅

5. **Resources & Support** (5+ downloads)
   - Parent & Educator Guide ✅
   - Weekly Progress Tracker ✅
   - Phonics Worksheets ✅
   - Letter Reversal Practice ✅
   - Achievement Certificates ✅

6. **Gamification** (ongoing)
   - Streak Toolkit ✅
   - Reward Cards System ✅
   - Reading Buddy Chatbot ✅

**Success Metrics:**
- 28+ interactive components
- 137 KB optimized page size
- Zero broken links
- LocalStorage persistence across all tools
- Evidence banners on all game components

### Breathing Techniques
**Primary Goal:** Provide scientifically-backed breathing protocols for nervous system regulation

**Objectives:**
1. **Core Techniques** (4 protocols)
   - 4-7-8 Breathing (sleep & anxiety) ✅
   - Box Breathing (focus & calm) ✅
   - Coherent Breathing (HRV optimization) ✅
   - SOS Breathing (acute stress) ✅

2. **Enhanced Features**
   - Fullscreen immersive mode ✅
   - Voice coach with TTS ✅
   - Ambient sounds (6 options) ✅
   - Time selection (1-10 minutes) ✅
   - Driving safety warnings ✅

3. **Progress Tracking**
   - Session counting ✅
   - Total minutes practiced ✅
   - Streak tracking ✅
   - Badge achievements ✅

### Tools & Games
**Primary Goal:** Provide engaging tools for skill-building and regulation

**Objectives:**
1. **Breath Ladder** — Progressive difficulty breathing challenges
2. **Colour Path** — Visual focus and attention training
3. **Focus Tiles** — Memory and concentration games
4. **Roulette** — Random technique selector for variety

### Global Features
**Primary Goal:** Provide consistent support across all pages

**Objectives:**
1. **Reading Buddy Chatbot** ✅
   - Floating button in bottom-right corner
   - Green gradient with red notification badge
   - 15+ predefined responses
   - Custom query handling
   - Available on all pages via layout

2. **Progress System** ✅
   - Centralized progress tracking
   - Badge unlocking system
   - Challenge completions
   - Quest rewards

3. **Rewards Page** ✅
   - Achievement cards display
   - Progress visualization
   - Motivational messaging

---

## 🛠️ Technical Architecture

### Project Structure
```
neurobreath/
├── nextjs_space/
│   ├── app/
│   │   ├── layout.tsx               # Global layout with chatbot
│   │   ├── page.tsx                 # Homepage
│   │   ├── dyslexia-reading-training/
│   │   │   └── page.tsx            # Dyslexia hub (137 KB)
│   │   ├── techniques/
│   │   │   ├── 4-7-8/
│   │   │   ├── box-breathing/
│   │   │   ├── coherent/
│   │   │   └── sos/
│   │   ├── tools/
│   │   │   ├── breath-ladder/
│   │   │   ├── colour-path/
│   │   │   ├── focus-tiles/
│   │   │   └── roulette/
│   │   ├── progress/
│   │   ├── rewards/
│   │   ├── about/
│   │   ├── contact/
│   │   └── api/
│   │       ├── download-resource/   # Generates HTML resources
│   │       ├── sessions/
│   │       ├── progress/
│   │       ├── badges/
│   │       ├── challenges/
│   │       └── quests/
│   ├── components/
│   │   ├── site-header.tsx          # Navigation with 🫁 logo
│   │   ├── site-footer.tsx
│   │   ├── ReadingBuddy.tsx         # Global chatbot
│   │   ├── BreathingExercise.tsx    # Enhanced breathing UI
│   │   ├── ui/                      # Radix/shadcn components
│   │   └── [28+ dyslexia components]
│   ├── contexts/
│   │   ├── ProgressContext.tsx
│   │   └── ReadingLevelContext.tsx
│   ├── hooks/
│   │   ├── useSpeechSynthesis.ts
│   │   ├── useSpeechRecognition.ts
│   │   ├── useDorothyAudio.ts
│   │   └── useLocalStorage.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── types.ts
│   │   ├── breathing-data.ts
│   │   ├── badge-definitions.ts
│   │   └── challenge-definitions.ts
│   └── public/
│       ├── audio/                    # MP3 audio files
│       ├── favicon.svg
│       └── og-image.png
├── .gitignore                        # Comprehensive 249-line file
└── PROJECT.md                        # This document
```

### Component Standards

#### File Organization
- One component per file
- Use PascalCase for component files (e.g., `RhythmTraining.tsx`)
- Group related files in subdirectories when needed
- Keep components under 500 lines (split if larger)

#### TypeScript Conventions
```typescript
'use client';  // Always include for client components

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  title: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export function ComponentName({ title, difficulty = 'Beginner' }: Props) {
  const [state, setState] = useState<Type>(initialValue);
  
  useEffect(() => {
    // LocalStorage access ONLY in useEffect (SSR safety)
    const saved = localStorage.getItem('key');
    if (saved) setState(JSON.parse(saved));
  }, []);
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Content */}
      </CardContent>
    </Card>
  );
}
```

#### SSR/Hydration Safety
- **NEVER** access `localStorage`, `window`, or `document` in component body
- **ALWAYS** wrap browser APIs in `useEffect` or `useLayoutEffect`
- **NEVER** use `Math.random()` or `new Date()` in render (causes hydration errors)
- Pass server data via props from `getServerSideProps` when needed

#### Audio Integration
```typescript
// Web Audio API (for synthesis)
const audioContextRef = useRef<AudioContext | null>(null);

useEffect(() => {
  if (typeof window !== 'undefined' && !audioContextRef.current) {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };
}, []);

// HTML5 Audio (for MP3 playback)
const audioRef = useRef<HTMLAudioElement>(null);
const playSound = () => {
  if (audioRef.current) {
    audioRef.current.play();
  }
};

return <audio ref={audioRef} src="/audio/file.mp3" />;
```

#### LocalStorage Patterns
```typescript
// Loading data
useEffect(() => {
  const saved = localStorage.getItem('feature-progress');
  if (saved) {
    setProgress(JSON.parse(saved));
  }
}, []);

// Saving data
const handleComplete = () => {
  const updated = { ...progress, completed: true };
  setProgress(updated);
  localStorage.setItem('feature-progress', JSON.stringify(updated));
};
```

---

## 🎓 Content Guidelines

### Evidence Banners
Every evidence-based component should include a banner explaining the research:
```tsx
<div className="bg-purple-50 dark:bg-purple-950/50 p-4 rounded-lg border-l-4 border-purple-500">
  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
    <strong>Evidence-Based:</strong> Research shows [specific finding] improves [specific outcome].
  </p>
</div>
```

### Language & Tone
- **Encouraging:** "Great work!", "You're building skills!", "Keep practicing!"
- **Clear:** Use simple, direct language (8th-grade reading level)
- **Respectful:** Avoid infantilizing language for older learners
- **Specific:** "You completed 5 words correctly" vs. "Good job"

### Link Standards
- **NEVER** link to broken or inaccessible URLs
- Verify all external links before adding
- Prefer official sources (.edu, .gov, .org)
- Use `target="_blank" rel="noopener noreferrer"` for external links
- Provide descriptive link text (not "click here")

---

## 🚀 Future Development Roadmap

### Phase 2: Enhanced Content (Q1 2026)
- [ ] ADHD focus training module
- [ ] Anxiety management techniques library
- [ ] Autism sensory regulation tools
- [ ] Sleep hygiene program
- [ ] Parent dashboard with child progress tracking

### Phase 3: Social Features (Q2 2026)
- [ ] Educator accounts with classroom management
- [ ] Group challenges and leaderboards
- [ ] Peer support forums (moderated)
- [ ] Progress sharing with parents/teachers

### Phase 4: Advanced Features (Q3 2026)
- [ ] AI-powered personalized learning paths
- [ ] Video demonstrations for all techniques
- [ ] Multi-language support (Spanish, French, German)
- [ ] Mobile app (Flutter) with offline mode
- [ ] Wearable device integration (HRV tracking)

### Phase 5: Research & Validation (Q4 2026)
- [ ] Clinical trials with partner institutions
- [ ] Published efficacy studies
- [ ] Professional certification program
- [ ] Integration with school IEP/504 plans

---

## 📊 Quality Standards

### Performance Targets
- **Page Load:** First Contentful Paint < 1.5s
- **Bundle Size:** Individual pages < 150 KB
- **Total JS:** First Load < 300 KB
- **Lighthouse Score:** > 90 across all metrics

### Accessibility Requirements
- **WCAG 2.1 AA** compliance mandatory
- **Color Contrast:** Minimum 4.5:1 for text
- **Keyboard Navigation:** All features usable without mouse
- **Screen Reader:** Descriptive ARIA labels on all interactive elements
- **Focus Indicators:** Visible focus rings on all focusable elements

### Testing Checklist
Before deploying any new feature:
- [ ] TypeScript compilation passes (`yarn tsc --noEmit`)
- [ ] Build completes successfully (`yarn build`)
- [ ] No console errors in browser
- [ ] No hydration errors
- [ ] LocalStorage persistence works
- [ ] Audio playback functions correctly
- [ ] All links are valid and accessible
- [ ] Mobile responsive (test 320px, 768px, 1024px)
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] High contrast mode readable

---

## 🤝 Collaboration Guidelines

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/add-anxiety-module

# Make changes, test thoroughly
yarn tsc --noEmit
yarn build

# Commit with descriptive message
git add .
git commit -m "Add anxiety management module with 5 techniques"

# Push and create PR
git push origin feature/add-anxiety-module
```

### Commit Message Format
```
<type>: <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Formatting changes
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat: Add Rhythm Training game for phonological awareness

- Implemented 6 difficulty patterns with audio sync
- Added mastery tracking with localStorage
- Included evidence banner with research citation

Closes #123
```

### Code Review Standards
All PRs must:
1. Pass TypeScript compilation
2. Pass build process
3. Include updated documentation
4. Have descriptive commit messages
5. Include accessibility attributes
6. Be tested on mobile devices
7. Have no console errors

---

## 📞 Support & Resources

### Research Sources
- **Dyslexia:** International Dyslexia Association (dyslexiaida.org)
- **ADHD:** CHADD (chadd.org), ADDitude Magazine
- **Autism:** Autism Self Advocacy Network (autisticadvocacy.org)
- **Breathing:** Harvard Medical School, Mayo Clinic, NHS
- **Education:** Reading Rockets, What Works Clearinghouse

### Technical Documentation
- **Next.js:** https://nextjs.org/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives/docs
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API

### Contact
- **Project Lead:** [To be assigned]
- **Technical Lead:** [To be assigned]
- **Clinical Advisor:** [To be assigned]
- **Support Email:** support@neurobreath.co.uk

---

## 📝 Change Log

### v1.0.0 (December 23, 2025)
- ✅ Initial project structure established
- ✅ Dyslexia reading training hub completed (28+ components)
- ✅ Breathing techniques with enhanced features
- ✅ Global Reading Buddy chatbot
- ✅ Progress tracking and rewards system
- ✅ Downloadable resources API
- ✅ Comprehensive .gitignore
- ✅ Production-ready with zero critical issues

---

## 📄 License

**Copyright © 2025 NeuroBreath.co.uk**  
All rights reserved.

This project is proprietary software. Unauthorized copying, distribution, or modification is prohibited without written permission from the project owners.

---

**Project Status:** ✅ **PRODUCTION READY**  
**Last Checkpoint:** "Production-ready dyslexia page with bug fixes" (Dec 23, 2025)  
**Next Milestone:** Phase 2 content expansion (Q1 2026)
